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
import * as servicioTipoPedidos from '../../services/ServicioTipoPedidos';
import GoogleApiWrapper from './MapComp';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

const estados = Constantes.estados;

const ReservarPedido = () => {
	const [chofer, setChofer] = useState({});
	const [cliente, setCliente] = useState({});
	const [unidad, setUnidad] = useState({});
	const [estado, setEstado] = useState(estados[0]);
	const [tipoPedido, setTipoPedido] = useState({});
	const [errors, setErrors] = useState({});

	const navigate = useNavigate();
	const { state } = useLocation();
	const usuario = state.usuario;

	const [showMap, setShowMap] = useState(false);

	const [horaLimite, setHoraLimite] = useState(null);

	const [direccion, setDireccion] = useState(null);

	useEffect(() => {
		if (!process.env.REACT_APP_API_GOOGLE) {
			window.location = '#/error';
		}

		setValoresDefaultReserva();
	}, []);

	const setValoresDefaultReserva = async () => {
		const chofer = await servicioUsuarios.obtenerChoferDeReserva();
		if (!chofer) {
			redirectError();
		}

		const unidad = await servicioUnidades.otenerUnidadDeChofer(chofer.idUsuario);
		if (unidad?.idUnidadTransporte) {
			setUnidad({ value: unidad.idUnidadTransporte, label: `${unidad.nombre}` });
		} else {
			redirectError();
		}

		setCliente(usuario);
		setChofer(chofer);

		const { tiposPedidos } = await servicioTipoPedidos.obtenerTipoPedidos({ PageIndex: 0, PageSize: 5 });
		if (tiposPedidos?.length > 0) {
			setTipoPedido({ value: tiposPedidos[0].idTipoPedido, label: `${tiposPedidos[0].nombre}`, ...tiposPedidos[0] });
		} else {
			redirectError();
		}
	};

	const redirectError = async () => {
		toast.error('Ha ocurrido un error');
		window.location = '#/error';
	};

	const checkErrors = () => {
		setErrors({
			chofer: !chofer?.idUsuario ? true : false,
			cliente: !cliente?.idUsuario ? true : false,
			unidad: !unidad?.value ? true : false,
			tipoPedido: !tipoPedido?.value ? true : false,
			direccion: !direccion?.lat ? true : false,
		});
	};

	const formik = useFormik({
		initialValues: {
			apartamento: '',
			descripcion: '',
			nroPuerta: '',
		},
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				checkErrors();

				if (chofer.idUsuario && cliente.idUsuario && unidad.value && tipoPedido.value && direccion.lat && estado.value) {
					const pedidoIngresado = {
						...values,
						idChofer: chofer.idUsuario,
						idCliente: cliente.idUsuario,
						idTipoPedido: tipoPedido.value,
						idTransporte: unidad.value,
						estado: estado.value,
						longitude: direccion.lng,
						latitude: direccion.lat,
						nombreDireccion: direccion.nombre,
						horaLimite: !isNaN(horaLimite) ? horaLimite : null,
						activo: false,
						reservado: true,
					};

					const res = await servicioPedidos.registrarPedido(pedidoIngresado);

					if (res.operationResult == Constantes.SUCCESS) {
						navigate(`/usuario/${cliente.idUsuario}`);
						toast.success(`Pedido reservado correctamente`);
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
			<Helmet>
				<title>Reservar pedido</title>
			</Helmet>
			<CssBaseline />
			<Paper
				sx={{
					...defaultStyles.boxShadow,
					paddingX: 6,
					paddingY: 2,
					marginBottom: 2,
				}}
			>
				<Box>
					<Typography component="h1" variant="h5">
						Reservar Pedido
					</Typography>
					<Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
						<Grid className="text-start">
							<InputLabel sx={{ mt: 2 }}>Dirección *</InputLabel>

							{!direccion?.nombre ? (
								showMap ? (
									<GooglePlacesAutocomplete
										apiKey={process.env.REACT_APP_API_GOOGLE}
										apiOptions={{ language: 'es' }}
										autocompletionRequest={{ componentRestrictions: { country: 'uy' } }}
										selectProps={{
											onChange: setDireccion,
											placeholder: 'Ingresa una dirección',
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
									variant="outlined"
									fullWidth
									id="descripcion"
									label="Comentario"
									value={formik.values.descripcion}
									onChange={formik.handleChange}
									error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
									helperText={formik.touched.descripcion && formik.errors.descripcion}
								/>
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
								<Button variant="outlined" color="primary" sx={{ mt: 3, mb: 2 }} className="m-1" component={RouterLink} to={-1}>
									Cancelar
								</Button>
								<Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} className="m-1">
									Reservar
								</Button>
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
	descripcion: yup.string().max(200, 'La descripción no puede superar los 200 caracteres'),
	nroPuerta: yup.string().max(6, 'El número de puerta no puede superar los 6 caracteres'),
	apartamento: yup.string().max(100, 'El apartamento no puede superar los 100 caracteres'),
});

export default ReservarPedido;
