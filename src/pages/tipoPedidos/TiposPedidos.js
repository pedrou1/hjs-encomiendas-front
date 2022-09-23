import { Button, CssBaseline, Box, Container, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioTipoPedidos from '../../services/ServicioTipoPedidos';
import Table from '../../components/Table';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ModalDialog from '../../components/ModalDialog';
import { toast } from 'react-toastify';
import * as Constantes from '../../utils/constantes';

const TiposPedidos = () => {
	const [tipoPedidos, setTipoPedidos] = useState([]);
	const [countTipoPedidos, setCountTipoPedidos] = useState(0);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const [openModal, setOpenModal] = useState(false);
	const [tipoPedidoSeleccionado, setTipoPedidoSeleccionado] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		getTipoPedidos();
	}, []);

	useEffect(() => {
		if (tipoPedidoSeleccionado?.idTipoPedido) {
			setOpenModal(!openModal);
		}
	}, [tipoPedidoSeleccionado]);

	const getTipoPedidos = async (newPaginationData) => {
		if (newPaginationData) setPaginationData(newPaginationData);
		const { tiposPedidos, totalRows } = await servicioTipoPedidos.obtenerTipoPedidos(newPaginationData || paginationData);
		if (tiposPedidos) {
		setTipoPedidos(tiposPedidos);
		setCountTipoPedidos(totalRows);
		}
	};

	const onPageChange = async (paginationData) => {
		await getTipoPedidos(paginationData);
	};

	const actualizarTabla = async () => {
		await getTipoPedidos();
		setTipoPedidoSeleccionado({});
	};

	const goToVerPedidos = (tipoPedido) => {
		navigate('/crear-editar-pedido', { state: { tipoPedido: tipoPedido } });
	};

	const handleDelete = async () => {
		if (tipoPedidoSeleccionado?.idTipoPedido) {
			const res = await servicioTipoPedidos.eliminarTipoPedido(tipoPedidoSeleccionado.idTipoPedido);
			if (res.operationResult == Constantes.SUCCESS) {
				setOpenModal(false);
				actualizarTabla();
				toast.success('Tipo de pedido eliminado correctamente');
			} else {
				toast.error('Ha ocurrido un error');
				navigate('/error');
			}
		}
	};

	const columnas = [
		...cols,
		{
			button: true,
			cell: (row) => (
				<IconButton aria-label="delete" size="small" color="error" onClick={() => setTipoPedidoSeleccionado(row)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	return (
		<Container component="main">
			<Helmet>
				<title>Tipo de Pedidos</title>
			</Helmet>
			<ModalDialog
				open={openModal}
				titulo="Eliminar"
				mensaje={`¿Quieres eliminar el tipo de pedido seleccionado?`}
				esEliminar={true}
				handleClose={() => {
					setOpenModal(false);
					setTimeout(() => {
						setTipoPedidoSeleccionado({});
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
						to="/crear-editar-pedido"
						endIcon={<AddIcon />}
					>
						Crear nuevo
					</Button>
				</div>
				<Table
					title="Tipo de Pedidos"
					data={tipoPedidos}
					columns={columnas}
					totalRows={countTipoPedidos}
					onPageChange={onPageChange}
					onRowClicked={goToVerPedidos}
				/>
			</Box>
		</Container>
	);
};

export default TiposPedidos;

const cols = [
	{
		name: 'Nombre',
		selector: (row) => `${row.nombre}`,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Desde (KG)',
		selector: (row) => `${row.pesoDesde}`,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Hasta (KG)',
		selector: (row) => row.pesoHasta,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Tarifa',
		selector: (row) => row.tarifa,
		sortable: true,
		grow: 1,
	},
];
