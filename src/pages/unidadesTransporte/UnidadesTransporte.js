import { Button, CssBaseline, Box, Container, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioUnidades from '../../services/ServicioUnidades';
import Table from '../../components/Table';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ModalDialog from '../../components/ModalDialog';
import { toast } from 'react-toastify';
import * as Constantes from '../../utils/constantes';

const UnidadesTransporte = () => {
	const [unidades, setUnidades] = useState([]);
	const [countUnidades, setCountUnidades] = useState(0);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const [openModal, setOpenModal] = useState(false);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [unidadSeleccionada, setUnidadSeleccionada] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		getUnidades();
	}, []);

	useEffect(() => {
		if (unidadSeleccionada?.idUnidadTransporte) {
			setOpenModal(!openModal);
		}
	}, [unidadSeleccionada]);

	const getUnidades = async (newPaginationData) => {
		if (newPaginationData) setPaginationData(newPaginationData);
		const { unidadesTransporte, totalRows, operationResult } = await servicioUnidades.obtenerUnidades(newPaginationData || paginationData);
		if (unidadesTransporte) {
			setUnidades(unidadesTransporte);
			setCountUnidades(totalRows);
			setLoadingFinished(operationResult == 1 ? true : false);
		}
	};

	const onPageChange = async (paginationData) => {
		await getUnidades(paginationData);
	};

	const actualizarTabla = async () => {
		await getUnidades();
		setUnidadSeleccionada({});
	};

	const handleDelete = async () => {
		if (unidadSeleccionada?.idUnidadTransporte) {
			const res = await servicioUnidades.eliminarUnidad(unidadSeleccionada.idUnidadTransporte);
			if (res.operationResult == Constantes.SUCCESS) {
				setOpenModal(false);
				actualizarTabla();
				toast.success('Unidad eliminado correctamente');
			} else {
				toast.error('Ha ocurrido un error');
				navigate('/error');
			}
		}
	};

	const goToEditar = (unidad) => {
		navigate('/crear-unidad', { state: { unidad: unidad } });
	};

	const columnas = [
		...cols,
		{
			button: true,
			cell: (row) => (
				<IconButton aria-label="delete" size="small" color="error" onClick={() => setUnidadSeleccionada(row)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	return (
		<Container component="main">
			<Helmet>
				<title>Unidades de Transporte</title>
			</Helmet>
			<ModalDialog
				open={openModal}
				titulo="Eliminar"
				mensaje={`¿Quieres eliminar la unidad de transporte "${unidadSeleccionada.nombre}"?`}
				esEliminar={true}
				handleClose={() => {
					setOpenModal(false);
					setTimeout(() => {
						setUnidadSeleccionada({});
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
						to="/crear-unidad"
						endIcon={<AddIcon />}
					>
						Crear nuevo
					</Button>
				</div>
				<Table
					title="Unidades de Transporte"
					data={unidades}
					columns={columnas}
					totalRows={countUnidades}
					isLoadingFinished={loadingFinished}
					onPageChange={onPageChange}
					onRowClicked={goToEditar}
				/>
			</Box>
		</Container>
	);
};

export default UnidadesTransporte;

const cols = [
	{
		name: 'Nombre',
		selector: (row) => row.nombre,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Chofer',
		selector: (row) => `${row.chofer.nombre} ${row.chofer.apellido}`,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Promedio de consumo',
		selector: (row) => row.promedioConsumo,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Marca',
		selector: (row) => row?.marca,
		sortable: true,
		grow: 1,
		cell: (row) => (row?.marca ? row?.marca : <div>-</div>),
	},
	{
		name: 'Modelo',
		selector: (row) => row?.modelo,
		grow: 1,
		cell: (row) => (row?.modelo ? row?.modelo : <div>-</div>),
	},
	{
		name: 'Año',
		selector: (row) => row?.anio,
		grow: 1,
		cell: (row) => (row?.anio ? row?.anio : <div>-</div>),
	},
];
