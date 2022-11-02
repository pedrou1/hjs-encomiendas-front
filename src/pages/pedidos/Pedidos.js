import { Button, CssBaseline, Box, Container, IconButton, InputLabel, Grid, Typography, TextField, Tooltip, Chip } from '@mui/material';
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as servicioUnidades from '../../services/ServicioUnidades';
import SelectPaginate from '../../components/SelectPaginate';
import InfoIcon from '@mui/icons-material/Info';

const estados = Constantes.estados;

const Pedidos = () => {
	const [pedidos, setPedidos] = useState([]);
	const [countPedidos, setCountPedidos] = useState(0);
	const [openModal, setOpenModal] = useState(false);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [pedidoSeleccionado, setPedidoSeleccionado] = useState({});
	const [estado, setEstado] = useState([]);
	const [openFiltros, setOpenFiltros] = useState(null);
	const [fechaDesde, setFechaDesde] = useState(null);
	const [fechaHasta, setFechaHasta] = useState(null);
	const [unidadSeleccionada, setUnidadSeleccionada] = useState({});
	const [globalParams, setGlobalParams] = useState({ PageIndex: 0, PageSize: 10 });
	const [distanciaRecorridaSeleccionada, setDistanciaRecorridaSeleccionada] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		getPedidos();
	}, []);

	useEffect(() => {
		if (pedidoSeleccionado?.idPedido) {
			setOpenModal(!openModal);
		}
	}, [pedidoSeleccionado]);

	useEffect(() => {
		if (fechaDesde && !fechaHasta) {
			setFechaHasta(new Date());
		}
		if (fechaHasta && !fechaDesde) {
			setFechaDesde(new Date());
		}
	}, [fechaDesde, fechaHasta]);

	const getPedidos = async (newPaginationData, newParams) => {
		let params = globalParams;
		if (newPaginationData) {
			params.PageIndex = newPaginationData.PageIndex;
			params.PageSize = newPaginationData.PageSize;
		}

		if (newParams != null || newParams != undefined) {
			params.estados = newParams.estados;
			params.fechaDesde = newParams.fechaDesde;
			params.fechaHasta = newParams.fechaHasta;
			params.idUnidad = newParams.idUnidad;
		} else {
			if (!newPaginationData) {
				params.estados = [];
				params.fechaDesde = null;
				params.fechaHasta = null;
				params.idUnidad = null;
			}
		}

		const { pedidos, totalRows, distanciaRecorrida, operationResult } = await servicioPedidos.obtenerPedidos(params);

		setGlobalParams(params);
		setPedidos(pedidos);
		setCountPedidos(totalRows);
		setLoadingFinished(operationResult == 1 ? true : false);
		setDistanciaRecorridaSeleccionada(distanciaRecorrida);
	};

	const onPageChange = async (paginationData) => {
		await getPedidos(paginationData);
	};

	const actualizarTabla = async () => {
		await getPedidos();
		setPedidoSeleccionado({});
	};

	const handleFiltrar = async () => {
		let params = { idUnidad: 0, fechaDesde: null, fechaHasta: null, estados: [] };
		params.estados = estado.map((e) => e.value);

		if (params.estados && params.estados.length) {
			params.estados = JSON.stringify(params.estados);
		}

		if (unidadSeleccionada?.value) params.idUnidad = unidadSeleccionada.value;

		if (fechaDesde && fechaHasta) {
			params.fechaDesde = fechaDesde;
			params.fechaHasta = fechaHasta;
		}
		getPedidos(null, params);
	};

	const goToVerPedidos = (pedido) => {
		navigate('/crear-pedido', { state: { pedido: pedido } });
	};

	async function loadOptionsUnidad(search, loadedOptions) {
		const filters = JSON.stringify(search.trim().split(/\s+/));
		const { unidadesTransporte, totalRows } = await servicioUnidades.obtenerUnidades({ PageIndex: loadedOptions.length, PageSize: 5, filters });

		return {
			options: [...unidadesTransporte.map((u) => ({ value: u.idUnidadTransporte, label: `${u.nombre}`, ...u }))],
			hasMore: loadedOptions.length < totalRows,
		};
	}

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
					data={pedidos}
					columns={columnas}
					totalRows={countPedidos}
					isLoadingFinished={loadingFinished}
					onPageChange={onPageChange}
					onRowClicked={goToVerPedidos}
				>
					<Grid item xs={3} lg={3} className="d-flex justify-content-between">
						{distanciaRecorridaSeleccionada ? (
							<Typography className="pt-4" style={{ marginLeft: '1rem' }}>
								<Chip size="small" label={'Distancia recorrida: ' + Math.round(distanciaRecorridaSeleccionada / 1000) + 'km'} />

								{unidadSeleccionada.promedioConsumo ? (
									<Chip
										sx={{ ml: 1 }}
										size="small"
										label={`Consumo: ${(distanciaRecorridaSeleccionada / (unidadSeleccionada.promedioConsumo * 1000)).toFixed(2)}L`}
									/>
								) : (
									''
								)}
							</Typography>
						) : (
							<div></div>
						)}

						<div className="pt-4" style={{ marginLeft: distanciaRecorridaSeleccionada ? '-4.5rem' : '4.2rem' }}>
							<h4>Pedidos</h4>
						</div>

						<div className="align-self-end">
							<Filtros anchorEl={openFiltros} setAnchorEl={setOpenFiltros}>
								<div className="d-flex align-items-center">
									<Typography>Filtros</Typography>
									<Tooltip title="Elige una unidad y un rango de fecha para saber el consumo promedio">
										<IconButton size="small">
											<InfoIcon sx={{ fontSize: 20 }} color="disabled" />
										</IconButton>
									</Tooltip>
								</div>
								<InputLabel sx={{ mt: 1 }}>Estado</InputLabel>
								<div>
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
									<SelectPaginate
										label="Unidad de transporte"
										value={unidadSeleccionada}
										loadOptions={loadOptionsUnidad}
										setOnChange={setUnidadSeleccionada}
										styleInputLabel={{ mt: 2 }}
										menuPortalTargetName={'.MuiPaper-elevation'}
										stylesCustm={customStyles}
									/>
									<div className="d-flex align-items-center">
										<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
											<DatePicker
												label="Fecha desde"
												value={fechaDesde}
												onChange={(f) => setFechaDesde(f)}
												renderInput={(params) => <TextField className="mt-3 w-50" style={{ marginRight: '0.4rem' }} {...params} />}
											/>
										</LocalizationProvider>
										<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
											<DatePicker
												label="Fecha hasta"
												value={fechaHasta}
												onChange={(f) => setFechaHasta(f)}
												renderInput={(params) => <TextField className="mt-3 w-50" {...params} />}
											/>
										</LocalizationProvider>
									</div>
								</div>
								<div className="mt-2 pb-1  d-flex justify-content-start">
									<div className="mr-2">
										<Button
											onClick={() => {
												handleFiltrar();
												setOpenFiltros(false);
											}}
											variant="contained"
											style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
										>
											Filtrar
										</Button>
									</div>
									<div className="pb-1" style={{ marginLeft: '0.8rem' }}>
										<Button
											onClick={() => {
												setEstado([]);
												setUnidadSeleccionada({});
												setFechaDesde(null);
												setFechaHasta(null);
												setOpenFiltros(false);
												getPedidos();
											}}
											variant="outlined"
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
			</Box>
		</Container>
	);
};

export default Pedidos;
