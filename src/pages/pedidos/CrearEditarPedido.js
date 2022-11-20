import { Button, TextField, CssBaseline, Box, Grid, Typography, Container, Paper, InputLabel, Chip, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Helmet } from 'react-helmet';
import * as servicioPedidos from '../../services/ServicioPedidos';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import * as servicioUnidades from '../../services/ServicioUnidades';
import * as Constantes from '../../utils/constantes';
import { defaultStyles } from '../../utils/defaultStyles';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AsyncPaginate } from 'react-select-async-paginate';
import Select from 'react-select';
import SelectPaginate from '../../components/SelectPaginate';
import * as servicioTipoPedidos from '../../services/ServicioTipoPedidos';
import GoogleApiWrapper from './MapComp';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import ModalDialog from '../../components/ModalDialog';

const estados = Constantes.estados;

const CrearEditarPedido = () => {
	const [chofer, setChofer] = useState({});
	const [cliente, setCliente] = useState({});
	const [unidad, setUnidad] = useState({});
	const [estado, setEstado] = useState(estados[0]);
	const [tipoPedido, setTipoPedido] = useState({});
	const [errors, setErrors] = useState({});
	const [openModal, setOpenModal] = useState(false);

	const navigate = useNavigate();
	const { state } = useLocation();
	const pedido = state?.pedido ? state.pedido : null;
	const esReserva = state?.reserva ? state.reserva : null;

	const [showMap, setShowMap] = useState(false);

	const [horaLimite, setHoraLimite] = useState(pedido?.horaLimite ? new Date(pedido.horaLimite) : null);

	const [direccion, setDireccion] = useState(null);

	useEffect(() => {
		if (!process.env.REACT_APP_API_GOOGLE) {
			window.location = '#/error';
		}

		if (pedido) {
			const chofer = { value: pedido.chofer.idUsuario, label: `${pedido.chofer.nombre} ${pedido.chofer.apellido}` };
			const cliente = { value: pedido.cliente.idUsuario, label: `${pedido.cliente.nombre} ${pedido.cliente.apellido}` };
			const unidad = { value: pedido.transporte.idUnidadTransporte, label: `${pedido.transporte.nombre}` };
			const tipoPedido = { value: pedido.tipoPedido.idTipoPedido, label: `${pedido.tipoPedido.nombre}`, ...pedido.tipoPedido };
			setDireccion({ lat: pedido.latitude, lng: pedido.longitude, nombre: pedido.nombreDireccion });
			setChofer(chofer);
			setCliente(cliente);
			setUnidad(unidad);
			setTipoPedido(tipoPedido);
			setEstado(estados.find((e) => e.value === pedido.estado));
		}
	}, []);

	useEffect(() => {
		if (chofer.value) {
			setUnidadDeChofer(chofer.value);
		}
	}, [chofer]);

	const setUnidadDeChofer = async (idUsuario) => {
		const unidad = await servicioUnidades.otenerUnidadDeChofer(idUsuario);
		if (unidad?.idUnidadTransporte) {
			setUnidad({ value: unidad.idUnidadTransporte, label: `${unidad.nombre}` });
		}
	};

	const checkErrors = () => {
		setErrors({
			chofer: !chofer?.value ? true : false,
			cliente: !cliente?.value ? true : false,
			unidad: !unidad?.value ? true : false,
			tipoPedido: !tipoPedido?.value ? true : false,
			direccion: !direccion?.lat ? true : false,
		});
	};

	const rechazarPedido = async () => {
		let pedidoIngresado = parsearPedido(pedido);

		pedidoIngresado = {
			...pedidoIngresado,
			chofer: undefined,
			cliente: undefined,
			transporte: undefined,
			reservado: false,
			activo: false,
			estado: estados[3].value,
		};

		if (chofer.value && cliente.value && unidad.value && tipoPedido.value && direccion.lat && estado.value) {
			const res = await servicioPedidos.modificarPedido(pedidoIngresado);
			if (res.operationResult == Constantes.SUCCESS) {
				navigate('/reservas-pedidos');
				toast.success(`Reserva rechazada correctamente`);
			} else if (res.operationResult == Constantes.ERROR) {
				toast.error('Ha ocurrido un error');
				navigate('/error');
			}
		} else {
			toast.error('Ingrese los datos');
		}
	};

	const parsearPedido = (values) => {
		let pedidoIngresado = {
			...values,
			idPedido: pedido?.idPedido,
			idChofer: chofer.value,
			idCliente: cliente.value,
			idTipoPedido: tipoPedido.value,
			idTransporte: unidad.value,
			estado: estado.value,
			longitude: direccion.lng,
			latitude: direccion.lat,
			nombreDireccion: direccion.nombre,
			horaLimite: !isNaN(horaLimite) ? horaLimite : null,
		};

		return pedidoIngresado;
	};

	const formik = useFormik({
		initialValues: pedido
			? {
					apartamento: pedido.apartamento,
					descripcion: pedido.descripcion,
					nroPuerta: pedido.nroPuerta,
			  }
			: {
					apartamento: '',
					descripcion: '',
					nroPuerta: '',
			  },
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				checkErrors();
				if (chofer.value && cliente.value && unidad.value && tipoPedido.value && direccion.lat && estado.value) {
					let pedidoIngresado = parsearPedido(values);

					if (esReserva) {
						pedidoIngresado = {
							...pedidoIngresado,
							fechaRetiro: new Date(),
							reservado: false,
							activo: true,
						};
					}

					const res = pedido ? await servicioPedidos.modificarPedido(pedidoIngresado) : await servicioPedidos.registrarPedido(pedidoIngresado);

					if (res.operationResult == Constantes.SUCCESS) {
						navigate('/pedidos');
						let mensaje = pedido ? 'modificado' : 'creado';
						if (esReserva) mensaje = 'reservado';

						toast.success(`Pedido ${mensaje} correctamente`);
					} else if (res.operationResult == Constantes.ERROR) {
						toast.error('Ha ocurrido un error');
						navigate('/error');
					}
				} else {
					toast.error('Ingrese los datos');
				}
			} catch (error) {
				console.log(error);
			}
		},
	});

	const classes = useStyles();

	async function loadOptionsChofer(search, loadedOptions) {
		const filters = JSON.stringify(search.trim().split(/\s+/));
		const Tipo = Constantes.ID_CHOFER;
		const { usuarios, totalRows } = await servicioUsuarios.obtenerUsuarios({ PageIndex: loadedOptions.length, PageSize: 5, filters, Tipo });

		return {
			options: [...usuarios.map((u) => ({ value: u.idUsuario, label: `${u.nombre} ${u.apellido}` }))],
			hasMore: loadedOptions.length < totalRows,
		};
	}

	async function loadOptionsCliente(search, loadedOptions) {
		const filters = JSON.stringify(search.trim().split(/\s+/));
		const Tipo = Constantes.ID_CLIENTE;
		const { usuarios, totalRows } = await servicioUsuarios.obtenerUsuarios({ PageIndex: loadedOptions.length, PageSize: 5, filters, Tipo });

		return {
			options: [...usuarios.map((u) => ({ value: u.idUsuario, label: `${u.apellido} ${u.nombre}`, ...u }))],
			hasMore: loadedOptions.length < totalRows,
		};
	}

	async function loadOptionsUnidad(search, loadedOptions) {
		const filters = JSON.stringify(search.trim().split(/\s+/));
		const { unidadesTransporte, totalRows } = await servicioUnidades.obtenerUnidades({ PageIndex: loadedOptions.length, PageSize: 5, filters });

		return {
			options: [...unidadesTransporte.map((u) => ({ value: u.idUnidadTransporte, label: `${u.nombre}` }))],
			hasMore: loadedOptions.length < totalRows,
		};
	}

	async function loadOptionTiposPedido(search, loadedOptions) {
		const filters = JSON.stringify(search.trim().split(/\s+/));
		const { tiposPedidos, totalRows } = await servicioTipoPedidos.obtenerTipoPedidos({ PageIndex: loadedOptions.length, PageSize: 5, filters });
		if (tiposPedidos?.length > 0) {
			return {
				options: [...tiposPedidos.map((t) => ({ value: t.idTipoPedido, label: `${t.nombre}`, ...t }))],
				hasMore: false,
			};
		} else {
			return {
				options: [],
				hasMore: false,
			};
		}
	}

	const customStyles = {
		option: (provided, state) => {
			return {
				...provided,
				zIndex: 9999,
			};
		},
	};

	useEffect(() => {
		const time = setTimeout(() => {
			setShowMap(true);
		}, 1500);

		return () => {
			clearTimeout(time);
		};
	}, []);

	useEffect(() => {
		if (direccion?.value) {
			geocodeByAddress(direccion.value.description)
				.then((results) => getLatLng(results[0]))
				.then(({ lat, lng }) => {
					setDireccion({ lat, lng, nombre: direccion.value.description });
				});
		}
	}, [direccion]);

	return (
		<Container component="main" maxWidth="sm">
			<Helmet>{!esReserva ? <title>{pedido ? 'Modificar pedido' : 'Crear pedido'}</title> : <title>Ver reserva</title>}</Helmet>
			<CssBaseline />
			<ModalDialog
				open={openModal}
				titulo="Rechazar"
				mensaje={`¿Quieres rechazar la reserva?`}
				esEliminar={true}
				handleClose={() => {
					setOpenModal(false);
				}}
				handleAccept={() => rechazarPedido()}
			/>
			<Paper
				sx={{
					...defaultStyles.boxShadow,
					paddingX: 6,
					paddingY: 2,
					marginBottom: 2,
				}}
			>
				<Box>
					{!esReserva ? (
						<Typography component="h1" variant="h5">
							{pedido ? 'Editar Pedido' : 'Crear Pedido'}
						</Typography>
					) : (
						<Typography component="h1" variant="h5">
							Ver reserva
						</Typography>
					)}
					<Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
						<Grid className="text-start">
							<SelectPaginate
								label="Chofer *"
								errorLabel={errors.chofer ? 'Ingrese un chofer' : ''}
								value={chofer}
								loadOptions={loadOptionsChofer}
								setOnChange={setChofer}
								styleInputLabel={{ mt: 2 }}
							/>
							<SelectPaginate
								label="Cliente *"
								errorLabel={errors.cliente ? 'Ingrese un cliente' : ''}
								value={cliente}
								loadOptions={loadOptionsCliente}
								setOnChange={setCliente}
								styleInputLabel={{ mt: 2 }}
							/>
							<div className="mb-1"></div>
							{cliente?.telefono ? (
								<Typography variant="span" sx={{ fontWeight: 'normal', m: 1 }}>
									Tel:
									<Typography variant="span" sx={{ fontWeight: 'Medium', m: 1 }}>
										<Chip size="small" label={cliente.telefono} />
									</Typography>
								</Typography>
							) : (
								<></>
							)}
							{cliente?.telefono2 ? (
								<Typography variant="span" sx={{ fontWeight: 'normal', m: 1 }}>
									Tel. secundario:
									<Typography variant="span" sx={{ fontWeight: 'Medium', m: 1 }}>
										<Chip size="small" label={cliente.telefono2} />
									</Typography>
								</Typography>
							) : (
								<></>
							)}
							<SelectPaginate
								label="Unidad de transporte *"
								errorLabel={errors.unidad ? 'Ingrese una unidad' : ''}
								value={unidad}
								loadOptions={loadOptionsUnidad}
								setOnChange={setUnidad}
								styleInputLabel={{ mt: 2 }}
							/>
							<SelectPaginate
								label="Tipo de Pedido *"
								errorLabel={errors.tipoPedido ? 'Ingrese un tipo de pedido' : ''}
								value={tipoPedido}
								loadOptions={loadOptionTiposPedido}
								setOnChange={(e) => setTipoPedido(e)}
								styleInputLabel={{ mt: 2 }}
							/>

							{tipoPedido && tipoPedido.tarifa && (
								<Box sx={{ mt: 1 }}>
									<Typography variant="span" sx={{ fontWeight: 'Medium', m: 1 }}>
										Tarifa: <Chip size="small" label={'$ ' + tipoPedido.tarifa} />
									</Typography>
									<Typography variant="span" sx={{ fontWeight: 'Medium', m: 1 }}>
										Peso desde: <Chip size="small" label={tipoPedido.pesoDesde + ' kg'} />
									</Typography>
									<Typography variant="span" sx={{ fontWeight: 'Medium', m: 1 }}>
										Peso hasta: <Chip size="small" label={tipoPedido.pesoHasta + ' kg'} />
									</Typography>
								</Box>
							)}

							<InputLabel sx={{ mt: 2 }}>Estado</InputLabel>
							<Select
								menuPortalTarget={document.querySelector('body')}
								value={estado}
								options={estados}
								onChange={(e) => setEstado(e)}
								styles={customStyles}
								styleInputLabel={{ mt: 2 }}
							/>
							<Box sx={{ mt: 1 }}>
								{pedido && pedido.fechaRetiro ? (
									<Typography variant="span" sx={{ fontWeight: 'normal', m: 1, mt: 4 }}>
										{`Fecha de retiro: ${new Date(pedido.fechaRetiro).toLocaleDateString('es-ES', {
											year: 'numeric',
											month: 'numeric',
											day: 'numeric',
										})}`}
									</Typography>
								) : (
									<></>
								)}

								{pedido && pedido.fechaEntrega ? (
									<Typography variant="span" sx={{ fontWeight: 'normal', m: 1, mt: 4 }}>
										{`Fecha de entrega: ${new Date(pedido.fechaEntrega).toLocaleDateString('es-ES', {
											year: 'numeric',
											month: 'numeric',
											day: 'numeric',
										})}`}
									</Typography>
								) : (
									<></>
								)}
							</Box>
							<InputLabel sx={{ mt: 2 }}>Dirección *</InputLabel>

							{!direccion?.nombre ? (
								showMap ? (
									<GooglePlacesAutocomplete
										apiKey={process.env.REACT_APP_API_GOOGLE}
										apiOptions={{ language: 'es' }}
										autocompletionRequest={{ componentRestrictions: { country: 'uy' } }}
										selectProps={{
											onChange: setDireccion,
											placeholder: 'Busca una dirección',
											noOptionsMessage: () => (direccion ? 'No se ha encontrado una direccion' : 'Ingrese un dato'),
											loadingMessage: () => 'Cargando...',
										}}
										onLoadFailed={(error) => {
											console.log(error);
										}}
									/>
								) : (
									<></>
								)
							) : (
								<Chip label={direccion.nombre} onDelete={() => setDireccion(null)} />
							)}

							{errors.direccion && (
								<InputLabel sx={{ mt: '0.3rem', color: '#d32f2f', fontSize: '0.75rem', ml: 1 }}>Ingrese una direccion</InputLabel>
							)}
							<Grid item xs={12} sm={6} style={{ height: 280, marginTop: 20, position: 'relative', width: 350 }}>
								<GoogleApiWrapper markerPos={direccion}></GoogleApiWrapper>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="descripcion"
									multiline
									maxRows={4}
									variant="outlined"
									fullWidth
									id="descripcion"
									label="Descripción"
									value={formik.values.descripcion}
									onChange={formik.handleChange}
									error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
									helperText={formik.touched.descripcion && formik.errors.descripcion}
								/>
							</Grid>

							<Grid item xs={12} sm={6} sx={{ mt: 2 }}>
								<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
									<TimePicker
										label="Hora límite"
										value={horaLimite}
										onChange={(h) => setHoraLimite(h)}
										renderInput={(params) => <TextField {...params} />}
									/>
								</LocalizationProvider>
							</Grid>
							<Grid item xs={12} sm={6} sx={{ mt: 2 }}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="apartamento"
									variant="outlined"
									fullWidth
									id="apartamento"
									label="Apartamento"
									value={formik.values.apartamento}
									onChange={formik.handleChange}
									error={formik.touched.apartamento && Boolean(formik.errors.apartamento)}
									helperText={formik.touched.apartamento && formik.errors.apartamento}
								/>
							</Grid>

							<Grid item xs={12} sm={6} sx={{ mt: 2 }}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="nroPuerta"
									variant="outlined"
									fullWidth
									id="nroPuerta"
									label="Nro. Puerta"
									onChange={(event) => {
										if (isFinite(event.target.value)) {
											formik.handleChange(event);
										}
									}}
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
									value={formik.values.nroPuerta}
									error={formik.touched.nroPuerta && Boolean(formik.errors.nroPuerta)}
									helperText={formik.touched.nroPuerta && formik.errors.nroPuerta}
								/>
							</Grid>
						</Grid>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								marginTop: 2,
							}}
						>
							<div className="align-self-end">
								{!esReserva ? (
									<>
										<Button variant="outlined" color="primary" sx={{ mt: 3, mb: 2 }} className="m-1" component={RouterLink} to={-1}>
											Cancelar
										</Button>
										<Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} className="m-1">
											{pedido ? 'Modificar' : 'Crear'}
										</Button>
									</>
								) : (
									<>
										<Button variant="outlined" color="primary" sx={{ mt: 3, mb: 2 }} className="m-1" component={RouterLink} to={-1}>
											Atrás
										</Button>
										<Button variant="contained" color="error" onClick={() => setOpenModal(true)}>
											Rechazar
										</Button>
										<Button type="submit" variant="contained" color="success" sx={{ mt: 3, mb: 2 }} className="m-1">
											Crear
										</Button>
									</>
								)}
							</div>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

const useStyles = () => ({
	label: {
		backgroundColor: '#fafafa',
		paddingLeft: 6,
		paddingRight: 8,
	},
});

const validationSchema = yup.object({
	orden: 0,
	tipo: 0,
	descripcion: yup.string().min(4, 'La descripción debe tener al menos 4 caracteres').max(200, 'La descripción no puede superar los 200 caracteres'),
	nroPuerta: yup.string().max(6, 'El número de puerta no puede superar los 6 caracteres'),
	apartamento: yup.string().max(100, 'El apartamento no puede superar los 100 caracteres'),
});

export default CrearEditarPedido;
