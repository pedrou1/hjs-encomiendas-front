import { Button, TextField, CssBaseline, Box, Grid, Typography, Container, Paper, InputLabel, MenuItem, FormHelperText } from '@mui/material';
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

const CrearEditarPedido = () => {
	const [chofer, setChofer] = useState({});
	const [cliente, setCliente] = useState({});
	const [unidad, setUnidad] = useState({});
	const [estado, setEstado] = useState(estados[0]);

	const navigate = useNavigate();
	const { state } = useLocation();
	const pedido = state?.pedido ? state.pedido : null;
	const [horaLimite, setHoraLimite] = useState(pedido?.horaLimite ? new Date(pedido.horaLimite) : null);

	useEffect(() => {
		if (pedido) {
			const chofer = { value: pedido.chofer.idUsuario, label: `${pedido.chofer.nombre} ${pedido.chofer.apellido}` };
			const cliente = { value: pedido.cliente.idUsuario, label: `${pedido.cliente.nombre} ${pedido.cliente.apellido}` };
			const unidad = { value: pedido.transporte.idUnidadTransporte, label: `${pedido.transporte.nombre}` };
			setChofer(chofer);
			setCliente(cliente);
			setUnidad(unidad);
		}
	}, []);

	const formik = useFormik({
		initialValues: pedido
			? {
					estado: pedido.estado,
					tamaño: pedido.tamaño,
					peso: pedido.peso,
					cubicaje: pedido.cubicaje,
					tarifa: pedido.tarifa,
			  }
			: {
					estado: 0,
					tamaño: 0,
					peso: 0,
					cubicaje: 0,
					tarifa: 0,
			  },
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				if (chofer.value && cliente.value && unidad.value) {
					const pedidoIngresado = {
						...values,
						idPedido: pedido?.idPedido,
						idChofer: chofer.value,
						idCliente: cliente.value,
						idTransporte: unidad.value,
						estado: estado.value,
						horaLimite: !isNaN(horaLimite) ? horaLimite : null,
					};

					const res = pedido ? await servicioPedidos.modificarPedido(pedidoIngresado) : await servicioPedidos.registrarPedido(pedidoIngresado);

					if (res.operationResult == Constantes.SUCCESS) {
						navigate('/pedidos');
						toast.success(`Pedido ${pedido ? 'modificado' : 'creado'} correctamente`);
					} else if (res.operationResult == Constantes.ERROR) {
						toast.error('Ha ocurrido un error');
						navigate('/error');
					}
				} else {
					toast.error('Ingrese los datos');
				}
			} catch (error) {}
		},
	});

	const classes = useStyles();

	async function loadOptionsChofer(search, loadedOptions) {
		const filters = JSON.stringify(search.trim().split(/\s+/));

		const { usuarios, totalRows } = await servicioUsuarios.obtenerUsuarios({ PageIndex: loadedOptions.length, PageSize: 5, filters });

		return {
			options: [...usuarios.map((u) => ({ value: u.idUsuario, label: `${u.nombre} ${u.apellido}` }))],
			hasMore: loadedOptions.length < totalRows,
		};
	}

	async function loadOptionsCliente(search, loadedOptions) {
		const filters = JSON.stringify(search.trim().split(/\s+/));

		const { usuarios, totalRows } = await servicioUsuarios.obtenerUsuarios({ PageIndex: loadedOptions.length, PageSize: 5, filters });

		return {
			options: [...usuarios.map((u) => ({ value: u.idUsuario, label: `${u.nombre} ${u.apellido}` }))],
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

	const customStyles = {
		option: (provided, state) => {
			return {
				...provided,
				color: state.data.value == 1 ? 'yellow' : 'red',
				zIndex: 9999,
			};
		},
	};

	return (
		<Container component="main" maxWidth="sm">
			<Helmet>
				<title>Crear pedido</title>
			</Helmet>
			<CssBaseline />
			<Paper
				sx={{
					...defaultStyles.boxShadow,
					paddingX: 6,
					paddingY: 2,
				}}
			>
				<Box>
					<Typography component="h1" variant="h5">
						{pedido ? 'Editar Pedido' : 'Crear Pedido'}
					</Typography>
					<Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
						<Grid className="text-start">
							<SelectPaginate
								label="Chofer"
								errorLabel="Ingrese un chofer"
								value={chofer}
								loadOptions={loadOptionsChofer}
								setOnChange={setChofer}
							/>

							<SelectPaginate
								label="Cliente"
								errorLabel="Ingrese un cliente"
								value={cliente}
								loadOptions={loadOptionsCliente}
								setOnChange={setCliente}
							/>

							<SelectPaginate
								label="Unidad de transporte"
								errorLabel="Ingrese una unidad"
								value={unidad}
								loadOptions={loadOptionsUnidad}
								setOnChange={setUnidad}
								styleInputLabel={{ mt: 2 }}
							/>

							<InputLabel sx={{ mt: 2 }}>Estado</InputLabel>
							<Select
								menuPortalTarget={document.querySelector('body')}
								value={estado}
								options={estados}
								onChange={(e) => setEstado(e)}
								styles={customStyles}
							/>

							<Grid item xs={12} sm={6} sx={{ mt: 2 }}>
								<TextField
									className="text-start"
									name="tamaño"
									variant="outlined"
									fullWidth
									id="tamaño"
									label="Tamaño"
									value={formik.values.tamaño}
									onChange={formik.handleChange}
									error={formik.touched.tamaño && Boolean(formik.errors.tamaño)}
									helperText={formik.touched.tamaño && formik.errors.tamaño}
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
									name="peso"
									variant="outlined"
									fullWidth
									id="peso"
									label="Peso"
									value={formik.values.peso}
									onChange={formik.handleChange}
									error={formik.touched.peso && Boolean(formik.errors.peso)}
									helperText={formik.touched.peso && formik.errors.peso}
								/>
								<TextField
									sx={{ mt: 2 }}
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="tarifa"
									variant="outlined"
									fullWidth
									id="tarifa"
									label="Tarifa"
									value={formik.values.tarifa}
									onChange={formik.handleChange}
									error={formik.touched.tarifa && Boolean(formik.errors.tarifa)}
									helperText={formik.touched.tarifa && formik.errors.tarifa}
								/>
							</Grid>
						</Grid>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<div className="align-self-end">
								<Button variant="outlined" color="primary" sx={{ mt: 3, mb: 2 }} className="m-1" component={RouterLink} to={-1}>
									Cancelar
								</Button>
								<Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} className="m-1">
									{pedido ? 'Modificar' : 'Crear'}
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
	estado: 0,
	orden: 0,
	tipo: 0,
	tamaño: 0,
});

export default CrearEditarPedido;

const estados = [
	{ label: 'Pendiente', value: 1 },
	{ label: 'Finalizado', value: 2 },
];
