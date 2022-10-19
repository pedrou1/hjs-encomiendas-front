import { Button, CssBaseline, Box, Container, IconButton, InputLabel, Grid, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioPedidos from '../../services/ServicioPedidos';
import Table from '../../components/Table';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ModalDialog from '../../components/ModalDialog';
import { toast } from 'react-toastify';
import * as Constantes from '../../utils/constantes';
import { columnasPedidos } from '../../utils/columnasTablas';
import Select from 'react-select';
import Filtros from './../../components/Filtros';

const estados = Constantes.estados;

const Pedidos = () => {
	const [pedidos, setPedidos] = useState([]);
	const [countPedidos, setCountPedidos] = useState(0);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const [openModal, setOpenModal] = useState(false);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [pedidoSeleccionado, setPedidoSeleccionado] = useState({});
	const [estado, setEstado] = useState([estados[0]]);
	const navigate = useNavigate();

	useEffect(() => {
		getPedidos();
	}, []);

	useEffect(() => {
		if (pedidoSeleccionado?.idPedido) {
			setOpenModal(!openModal);
		}
	}, [pedidoSeleccionado]);

	const getPedidos = async (newPaginationData, estado) => {
		if (newPaginationData) setPaginationData(newPaginationData);
		const { pedidos, totalRows, operationResult } = await servicioPedidos.obtenerPedidos(newPaginationData || paginationData, estado);
		setPedidos(pedidos);
		setCountPedidos(totalRows);
		setLoadingFinished(operationResult == 1 ? true : false);
	};

	const onPageChange = async (paginationData) => {
		await getPedidos(paginationData);
	};

	const actualizarTabla = async () => {
		await getPedidos();
		setPedidoSeleccionado({});
	};

	const handleFiltrar = async () => {
		const estadosParsed = estado.map((e) => e.value);
		console.log(estadosParsed);
		// if(estado.length){
		//  getPedidos(null, estadosParsed);
		// }
		// setPedidoSeleccionado({});
	};

	const goToVerPedidos = (pedido) => {
		navigate('/crear-pedido', { state: { pedido: pedido } });
	};

	const handleDelete = async () => {
		if (pedidoSeleccionado?.idPedido) {
			const res = await servicioPedidos.eliminarPedido(pedidoSeleccionado.idPedido);
			if (res.operationResult == Constantes.SUCCESS) {
				setOpenModal(false);
				actualizarTabla();
				toast.success('Pedido eliminado correctamente');
			} else {
				toast.error('Ha ocurrido un error');
				navigate('/error');
			}
		}
	};

	const columnas = [
		...columnasPedidos,
		{
			button: true,
			cell: (row) => (
				<IconButton aria-label="delete" size="small" color="error" onClick={() => setPedidoSeleccionado(row)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	const customStyles = {
		option: (provided, state) => {
			return {
				...provided,
				color: 'black',
				zIndex: 9999,
			};
		},
	};

	return (
		<Container component="main">
			<Helmet>
				<title>Pedidos</title>
			</Helmet>
			<ModalDialog
				open={openModal}
				titulo="Eliminar"
				mensaje={`¿Quieres eliminar el pedido seleccionado?`}
				esEliminar={true}
				handleClose={() => {
					setOpenModal(false);
					setTimeout(() => {
						setPedidoSeleccionado({});
					}, 300);
				}}
				handleAccept={handleDelete}
			/>
			<CssBaseline />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<div className="align-self-end">
					<Button
						variant="contained"
						style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
						component={RouterLink}
						to="/crear-pedido"
						endIcon={<AddIcon />}
					>
						Crear nuevo
					</Button>
				</div>
				<Table
					// title="Pedidos"
					data={pedidos}
					columns={columnas}
					totalRows={countPedidos}
					isLoadingFinished={loadingFinished}
					onPageChange={onPageChange}
					onRowClicked={goToVerPedidos}
				>
					<Grid item xs={3} lg={3} className="d-flex flex-column">
						<div className="align-self-end">
							<Filtros>
								<Typography>Filtros</Typography>
								<InputLabel sx={{ mt: 2 }}>Estado</InputLabel>

								<Select
									menuPortalTarget={document.querySelector('.MuiPaper-elevation')}
									value={estado}
									isMulti
									options={estados}
									onChange={(e) => setEstado(e)}
									styles={customStyles}
									noOptionsMessage={() => 'No hay mas datos'}
									placeholder={''}
								/>
								<Button
									onClick={() => {
										handleFiltrar();
									}}
									disabled={!estado.length}
									variant="contained"
									style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
								>
									Filtrar
								</Button>
							</Filtros>
						</div>
					</Grid>
				</Table>
			</Box>
		</Container>
	);
};

export default Pedidos;
