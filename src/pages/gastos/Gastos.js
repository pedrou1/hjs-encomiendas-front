import { Button, CssBaseline, Box, Container, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioGastos from '../../services/ServicioGastos';
import Table from '../../components/Table';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ModalDialog from '../../components/ModalDialog';
import { toast } from 'react-toastify';
import * as Constantes from '../../utils/constantes';
import { columnasPedidos } from '../../utils/columnasTablas';

const Gastos = () => {
	const [gastos, setGastos] = useState([]);
	const [countGastos, setCountGastos] = useState(0);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const [openModal, setOpenModal] = useState(false);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [gastoSeleccionado, setGastoSeleccionado] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		getGastos();
	}, []);

	useEffect(() => {
		if (gastoSeleccionado?.idGasto) {
			setOpenModal(!openModal);
		}
	}, [gastoSeleccionado]);

	const getGastos = async (newPaginationData) => {
		if (newPaginationData) setPaginationData(newPaginationData);
		const { gastos, totalRows, operationResult } = await servicioGastos.obtenerGastos(newPaginationData || paginationData);
		if (gastos) {
			setGastos(gastos);
			setCountGastos(totalRows);
			setLoadingFinished(operationResult == 1 ? true : false);
		}
	};

	const onPageChange = async (paginationData) => {
		await getGastos(paginationData);
	};

	const actualizarTabla = async () => {
		await getGastos();
		setGastoSeleccionado({});
	};

	const goToVerGastos = (gasto) => {
		navigate('/crear-editar-gasto', { state: { gasto: gasto } });
	};

	const handleDelete = async () => {
		if (gastoSeleccionado?.idGasto) {
			const res = await servicioGastos.eliminarGasto(gastoSeleccionado.idGasto);
			if (res.operationResult == Constantes.SUCCESS) {
				setOpenModal(false);
				actualizarTabla();
				toast.success('Gasto eliminado correctamente');
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
				<IconButton aria-label="delete" size="small" color="error" onClick={() => setGastoSeleccionado(row)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	return (
		<Container component="main">
			<Helmet>
				<title>Gastos</title>
			</Helmet>
			<ModalDialog
				open={openModal}
				titulo="Eliminar"
				mensaje={`¿Quieres eliminar el gasto seleccionado?`}
				esEliminar={true}
				handleClose={() => {
					setOpenModal(false);
					setTimeout(() => {
						setGastoSeleccionado({});
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
						to="/crear-editar-gasto"
						endIcon={<AddIcon />}
					>
						Crear nuevo
					</Button>
				</div>
				<Table
					title="Gastos"
					data={gastos}
					columns={columnas}
					totalRows={countGastos}
					isLoadingFinished={loadingFinished}
					onPageChange={onPageChange}
					onRowClicked={goToVerGastos}
				/>
			</Box>
		</Container>
	);
};

export default Gastos;

const cols = [
	{
		name: 'Descripción',
		selector: (row) => `${row.descripcion}`,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Usuario',
		selector: (row) => `${row.usuario.nombre} ${row.usuario.apellido}`,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Unidad',
		selector: (row) => row.transporte.nombre,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Fecha',
		selector: (row) => `${new Date(row.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric' })}`,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Costo',
		selector: (row) => row.costo,
		sortable: false,
		grow: 1,
	},
];
