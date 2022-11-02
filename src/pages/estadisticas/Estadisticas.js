import Chart from 'react-apexcharts';
import { Button, Grid, Typography, Container, Paper, CssBaseline, Box, TextField, InputLabel } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioPedidos from '../../services/ServicioPedidos';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import { defaultStyles } from '../../utils/defaultStyles';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '../../components/Table';
import * as Constantes from '../../utils/constantes';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Filtros from './../../components/Filtros';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';

const Estadisticas = () => {
	const [loading, setLoading] = useState(false);
	const [usuarios, setUsuarios] = useState([]);
	const [countUsuarios, setCountUsuarios] = useState(0);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [globalParams, setGlobalParams] = useState({ PageIndex: 0, PageSize: 10 });
	const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(Constantes.categoriasUsuarios[0]);
	const [openFiltros, setOpenFiltros] = useState(null);
	const [verGraficas, setVerGraficas] = useState(true);
	const [anio, setAnio] = useState(new Date());

	const navigate = useNavigate();

	const [cantidadPedidos, setCantidadPedidos] = useState([
		{
			name: 'Pedidos',
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		},
	]);
	const [cantidadClientes, setCantidadClientes] = useState([
		{
			name: 'Clientes',
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		},
	]);

	useEffect(() => {
		obtenerCantidadPedidos();
		getUsuarios();
	}, []);

	const obtenerCantidadPedidos = async (anioIn) => {
		setLoading(true);
		const anioFiltro = anioIn ? anioIn : anio;
		if (!(anioFiltro.getFullYear() > new Date().getFullYear() || anioFiltro.getFullYear() < 2020)) {
			const cantidadP = await servicioPedidos.obtenerCantidadPedidosPorMes(anioFiltro.getFullYear());
			setCantidadPedidos([{ ...cantidadPedidos[0], data: cantidadP }]);

			const cantidadC = await servicioUsuarios.obtenerCantidadClientesPorMes(anioFiltro.getFullYear());
			setCantidadClientes([{ ...cantidadClientes[0], data: cantidadC }]);
		}
		setLoading(false);
	};

	const getUsuarios = async (newPaginationData, tipo) => {
		let params = globalParams;
		if (newPaginationData) {
			params.PageIndex = newPaginationData.PageIndex;
			params.PageSize = newPaginationData.PageSize;
		}

		if (tipo?.value) {
			params.tipo = tipo.value;
		} else {
			params.tipo = categoriaSeleccionada.value;
		}

		const { usuariosInforme, totalRows, operationResult } = await servicioUsuarios.obtenerUsuariosYCantidadPedidos(params);
		console.log(usuariosInforme, totalRows);
		setGlobalParams(params);
		if (usuariosInforme) {
			setUsuarios(usuariosInforme);
		}
		setCountUsuarios(totalRows);
		setLoadingFinished(operationResult == 1 ? true : false);
	};

	const onPageChange = async (paginationData) => {
		await getUsuarios(paginationData);
	};

	const goToVerUsuario = (row) => {
		navigate(`/usuario/${row.usuario.idUsuario}`);
	};

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
				<title>Ver estadísticas</title>
			</Helmet>
			<CssBaseline />
			<div className="align-items-end d-flex flex-column mb-1">
				<div className="align-self-end">
					<Button variant="contained" style={{ fontSize: '15px', fontFamily: 'PT Sans' }} onClick={() => setVerGraficas(!verGraficas)}>
						{verGraficas ? 'Ver por usuario' : 'Ver estadísticas'}
					</Button>
				</div>
			</div>
			{verGraficas ? (
				<Paper
					sx={{
						...defaultStyles.boxShadow,
						paddingX: 6,
						paddingY: 2,
						marginBottom: 3,
					}}
				>
					<Box>
						<Grid item xs={12} lg={12} className="d-flex justify-content-between">
							<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
								<DatePicker
									views={['year']}
									label="Año"
									value={anio}
									disableFuture={true}
									minDate={new Date('2020-05-01')}
									maxDate={new Date()}
									onChange={(newValue) => {
										console.log(newValue);
										if (newValue > new Date()) {
											setAnio(new Date());
										} else {
											setAnio(newValue);
										}
										obtenerCantidadPedidos(newValue);
									}}
									renderInput={(params) => <TextField {...params} sx={{ width: 120, mt: 2, ml: 1 }} helperText={null} />}
								/>
							</LocalizationProvider>
							<Typography variant="h6" style={{ marginRight: '8rem' }}>
								Pedidos
							</Typography>
							<div></div>
						</Grid>
						<Grid className="align-items-center d-flex flex-column">
							<>
								<Chart options={options} series={cantidadPedidos} type="bar" width={800} height={320} />

								{loading ? (
									<div className="mb-1">
										<CircularProgress />
									</div>
								) : (
									<Typography variant="h6">Clientes nuevos</Typography>
								)}

								<Chart options={options} series={cantidadClientes} type="line" width={800} height={320} />
							</>
						</Grid>
					</Box>
				</Paper>
			) : (
				<Table
					data={usuarios}
					columns={columnasUsuarios}
					totalRows={countUsuarios}
					isLoadingFinished={loadingFinished}
					onPageChange={onPageChange}
					onRowClicked={goToVerUsuario}
				>
					<Grid item xs={3} lg={3} className="d-flex justify-content-between">
						<div className="px-3 pt-3"></div>
						<div className="pt-3" style={{ marginLeft: '2.5rem' }}>
							<h5>Cantidad de pedidos por usuario</h5>
						</div>

						<div className="align-self-end">
							<Filtros anchorEl={openFiltros} setAnchorEl={setOpenFiltros}>
								<Typography>Filtros</Typography>
								<InputLabel sx={{ mt: 2 }}>Categoría</InputLabel>

								<Select
									menuPortalTarget={document.querySelector('.MuiPaper-elevation')}
									value={categoriaSeleccionada}
									options={Constantes.categoriasUsuarios.slice(0, -1)}
									onChange={(e) => setCategoriaSeleccionada(e)}
									styles={customStyles}
									noOptionsMessage={() => 'No hay mas datos'}
									placeholder={''}
								/>

								<div className="mt-2 pb-1  d-flex justify-content-start">
									<div className="mr-2">
										<Button
											onClick={() => {
												setOpenFiltros(false);
												getUsuarios();
											}}
											variant="contained"
											className="mt-2"
											style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
										>
											Filtrar
										</Button>
									</div>
									<div className="pb-1" style={{ marginLeft: '0.6rem' }}>
										<Button
											onClick={() => {
												setCategoriaSeleccionada(Constantes.categoriasUsuarios[0]);
												setOpenFiltros(false);
												getUsuarios(null, Constantes.categoriasUsuarios[0]);
											}}
											variant="outlined"
											className="mt-2 ml-2"
											style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
										>
											Limpiar
										</Button>
									</div>
								</div>
							</Filtros>
						</div>
					</Grid>
				</Table>
			)}
		</Container>
	);
};
export default Estadisticas;

const options = {
	chart: {
		id: 'apexchart-example',
		toolbar: {
			show: false,
		},
	},
	xaxis: {
		categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	},
	yaxis: [
		{
			labels: {
				formatter: function (val) {
					return val.toFixed(0);
				},
			},
		},
	],
};

const series = [
	{
		name: 'Pedidos',
		data: [0, 0, 0, 30, 40, 35, 50, 49, 60, 70, 91, 125],
	},
];

export const columnasUsuarios = [
	{
		name: 'Nombre',
		selector: (row) => row.usuario.nombre,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Apellido',
		selector: (row) => row.usuario.apellido,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Teléfono',
		selector: (row) => row.usuario.telefono,
		sortable: false,
		grow: 1,
		cell: (row) => (row.usuario.telefono ? row.usuario.telefono : <div>-</div>),
	},
	{
		name: 'Email',
		selector: (row) => row.usuario.email,
		sortable: false,
		grow: 1,
		cell: (row) => (row.usuario.email ? row.usuario.email : <div>-</div>),
	},
	{
		name: 'Usuario',
		selector: (row) => row.usuario.usuario,
		sortable: false,
		grow: 1.5,
	},
	{
		name: 'Cantidad de pedidos',
		selector: (row) => row?.cantidadPedidos,
		sortable: false,
		grow: 1,
		cell: (row) => (row?.cantidadPedidos ? <div className="align-items-center d-flex">{row?.cantidadPedidos} pedidos</div> : <div>-</div>),
	},
];
