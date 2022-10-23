import { Button, TextField, CssBaseline, Box, Grid, Typography, Container, Paper, InputLabel, MenuItem, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Helmet } from 'react-helmet';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import * as servicioUnidades from '../../services/ServicioUnidades';
import * as servicioGastos from '../../services/ServicioGastos';
import * as Constantes from '../../utils/constantes';
import { defaultStyles } from '../../utils/defaultStyles';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AsyncPaginate } from 'react-select-async-paginate';
import Select from 'react-select';
import SelectPaginate from '../../components/SelectPaginate';
import * as servicioTipoPedidos from '../../services/ServicioTipoPedidos';

const CrearEditarGasto = () => {
	const [usuario, setUsuario] = useState({});
	const [unidad, setUnidad] = useState({});
	const [errors, setErrors] = useState({});

	const navigate = useNavigate();
	const { state } = useLocation();
	const gasto = state?.gasto ? state.gasto : null;
	const [fecha, setFecha] = useState(gasto?.fecha ? new Date(gasto.fecha) : null);

	useEffect(() => {
		if (gasto) {
			const usuario = { value: gasto.usuario.idUsuario, label: `${gasto.usuario.nombre} ${gasto.usuario.apellido}` };
			const unidad = { value: gasto.transporte.idUnidadTransporte, label: `${gasto.transporte.nombre}` };
			setUsuario(usuario);
			setUnidad(unidad);
		}
	}, []);

	useEffect(() => {
		if (usuario.value) {
			setUnidadDeChofer(usuario.value);
		}
	}, [usuario]);

	const setUnidadDeChofer = async (idUsuario) => {
		const unidad = await servicioUnidades.otenerUnidadDeChofer(idUsuario);
		if (unidad?.idUnidadTransporte) {
			setUnidad({ value: unidad.idUnidadTransporte, label: `${unidad.nombre}` });
		}
	};

	const checkErrors = () => {
		setErrors({
			usuario: !usuario?.value ? true : false,
			unidad: !unidad?.value ? true : false,
		});
	};

	const formik = useFormik({
		initialValues: gasto
			? {
					descripcion: gasto.descripcion,
					costo: gasto.costo,
			  }
			: {
					descripcion: '',
					costo: 0,
			  },
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				checkErrors();
				if (usuario.value && unidad.value) {
					const gastoIngresado = {
						...values,
						idGasto: gasto?.idGasto,
						idUsuario: usuario.value,
						idTransporte: unidad.value,
						fecha,
					};

					const res = gasto ? await servicioGastos.modificarGasto(gastoIngresado) : await servicioGastos.registrarGasto(gastoIngresado);

					if (res.operationResult == Constantes.SUCCESS) {
						navigate('/gastos');
						toast.success(`Gasto ${gasto ? 'modificado' : 'creado'} correctamente`);
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

	async function loadOptionsUsuario(search, loadedOptions) {
		const filters = JSON.stringify(search.trim().split(/\s+/));

		const categorias = JSON.stringify([Constantes.ID_CHOFER, Constantes.ID_ADMINISTRADOR]);

		const { usuarios, totalRows } = await servicioUsuarios.obtenerUsuarios({ PageIndex: loadedOptions.length, PageSize: 5, categorias, filters });

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
				<title>{gasto ? 'Modificar Gasto' : 'Crear Gasto'}</title>
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
						{gasto ? 'Editar Gasto' : 'Crear Gasto'}
					</Typography>
					<Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
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
								autoFocus
								id="descripcion"
								label="Descripción"
								value={formik.values.descripcion}
								onChange={formik.handleChange}
								error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
								helperText={formik.touched.descripcion && formik.errors.descripcion}
							/>
						</Grid>

						<Grid className="text-start">
							<SelectPaginate
								label="Usuario"
								errorLabel={errors.usuario ? 'Ingrese un usuario' : ''}
								value={usuario}
								loadOptions={loadOptionsUsuario}
								setOnChange={setUsuario}
								styleInputLabel={{ mt: 2 }}
							/>

							<SelectPaginate
								label="Unidad de transporte"
								errorLabel={errors.unidad ? 'Ingrese una unidad' : ''}
								value={unidad}
								loadOptions={loadOptionsUnidad}
								setOnChange={setUnidad}
								styleInputLabel={{ mt: 2 }}
							/>
						</Grid>

						<Grid container spacing={2}>
							<Grid item xs={12} sm={6} sx={{ mt: 2 }}>
								<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
									<DatePicker label="Fecha" value={fecha} onChange={(f) => setFecha(f)} renderInput={(params) => <TextField {...params} />} />
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12} sm={6} sx={{ mt: 2 }}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
									type="number"
									name="costo"
									variant="outlined"
									fullWidth
									id="costo"
									label="Costo"
									value={formik.values.costo}
									onChange={formik.handleChange}
									error={formik.touched.costo && Boolean(formik.errors.costo)}
									helperText={formik.touched.costo && formik.errors.costo}
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
									{gasto ? 'Modificar' : 'Crear'}
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
	descripcion: yup
		.string('Introduce la descripción')
		.min(4, 'La descripción debe tener una longitud mínima de 100 caracteres')
		.required('Introduce la descripción'),
	costo: yup.number('Introduce el costo').min(0).required('Introduce el costo'),
});

export default CrearEditarGasto;
