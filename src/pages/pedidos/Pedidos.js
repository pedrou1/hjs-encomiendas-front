import { Button, CssBaseline, Box, Container, IconButton } from '@mui/material';
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

const Pedidos = () => {
	const [pedidos, setPedidos] = useState([]);
	const [countPedidos, setCountPedidos] = useState(0);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const [openModal, setOpenModal] = useState(false);
	const [pedidoSeleccionado, setPedidoSeleccionado] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		getPedidos();
	}, []);

	useEffect(() => {
		if (pedidoSeleccionado?.idPedido) {
			setOpenModal(!openModal);
		}
	}, [pedidoSeleccionado]);

	const getPedidos = async (newPaginationData) => {
		if (newPaginationData) setPaginationData(newPaginationData);
		const { pedidos, totalRows } = await servicioPedidos.obtenerPedidos(newPaginationData || paginationData);
		setPedidos(pedidos);
		setCountPedidos(totalRows);
	};

	const onPageChange = async (paginationData) => {
		await getPedidos(paginationData);
	};

	const actualizarTabla = async () => {
		await getPedidos();
		setPedidoSeleccionado({});
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
				<Table title="Pedidos" data={pedidos} columns={columnas} totalRows={countPedidos} onPageChange={onPageChange} onRowClicked={goToVerPedidos} />
			</Box>
		</Container>
	);
};

export default Pedidos;
