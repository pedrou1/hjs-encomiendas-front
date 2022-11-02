import { Button, TextField, Link, CssBaseline, Box, Grid, Typography, Container, Paper, FormHelperText, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Helmet } from 'react-helmet';
import * as servicioUnidades from '../../services/ServicioUnidades';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import * as Constantes from '../../utils/constantes';
import { defaultStyles } from '../../utils/defaultStyles';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import SelectPaginate from '../../components/SelectPaginate';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CrearEditarUnidad = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [chofer, setChofer] = useState({});
	const [errors, setErrors] = useState({});
	const unidad = state?.unidad ? state.unidad : null;
	const [vtoSeguro, setVtoSeguro] = useState(unidad?.vtoSeguro ? new Date(unidad.vtoSeguro) : null);
	const [vtoPatente, setVtoPatente] = useState(unidad?.vtoPatente ? new Date(unidad.vtoPatente) : null);
	const [vtoMinisterio, setVtoMinisterio] = useState(unidad?.vtoMinisterio ? new Date(unidad.vtoMinisterio) : null);
	const [vtoApplus, setVtoApplus] = useState(unidad?.vtoApplus ? new Date(unidad.vtoApplus) : null);

	useEffect(() => {
		if (unidad) {
			const chofer = { value: unidad.chofer.idUsuario, label: `${unidad.chofer.nombre} ${unidad.chofer.apellido}` };
			setChofer(chofer);
		}
	}, []);

	const formik = useFormik({
		initialValues: unidad
			? {
					nombre: unidad.nombre,
					promedioConsumo: unidad.promedioConsumo ? unidad.promedioConsumo : '',
					marca: unidad.marca ? unidad.marca : '',
					modelo: unidad.modelo ? unidad.modelo : '',
					anio: unidad.anio ? unidad.anio : '',
					padron: unidad.padron ? unidad.padron : '',
					matricula: unidad.matricula ? unidad.matricula : '',
			  }
			: {
					nombre: '',
					promedioConsumo: '',
					marca: '',
					modelo: '',
					anio: '',
					padron: '',
					matricula: '',
			  },
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				const err = checkErrors(values);
				if (chofer.value && !err) {
					if (values.anio == '' || values.anio == null) {
						values.anio = 0;
					}
					if (values.promedioConsumo == '' || values.promedioConsumo == null) {
						values.promedioConsumo = 0;
					}

					const unidadIngresada = {
						...values,
						idChofer: chofer.value,
						idUnidadTransporte: unidad?.idUnidadTransporte,
						vtoSeguro,
						vtoPatente,
						vtoMinisterio,
						vtoApplus,
					};

					const res = unidad ? await servicioUnidades.modificarUnidad(unidadIngresada) : await servicioUnidades.registrarUnidad(unidadIngresada);

					if (res.operationResult == Constantes.SUCCESS) {
						navigate('/unidades');
						toast.success(`Unidad ${unidad ? 'modificada' : 'creada'} correctamente`);
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

	const checkErrors = (values) => {
		const errAnio = values.anio && (values.anio < 1990 || values.anio > new Date().getFullYear()) ? true : false;
		setErrors({
			chofer: !chofer?.value ? true : false,
			anio: errAnio,
		});
		return errAnio;
	};

	return (
		<Container component="main" maxWidth="sm">
			<Helmet>
				<title>{unidad ? 'Modificar Unidad de Transporte' : 'Crear Unidad de Transporte'}</title>
			</Helmet>
			<CssBaseline />
			<Paper
				sx={{
					...defaultStyles.boxShadow,
					paddingX: 6,
					paddingY: 2,
					marginY: 2,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography component="h1" variant="h5">
						{unidad ? 'Editar Unidad' : 'Crear Unidad'}
					</Typography>
					<Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="nombre"
									variant="outlined"
									fullWidth
									id="nombre"
									label="Nombre *"
									autoFocus
									value={formik.values.nombre}
									onChange={formik.handleChange}
									error={formik.touched.nombre && Boolean(formik.errors.nombre)}
									helperText={formik.touched.nombre && formik.errors.nombre}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="marca"
									variant="outlined"
									fullWidth
									id="marca"
									label="Marca"
									value={formik.values.marca}
									onChange={formik.handleChange}
									error={formik.touched.marca && Boolean(formik.errors.marca)}
									helperText={formik.touched.marca && formik.errors.marca}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="modelo"
									variant="outlined"
									fullWidth
									id="modelo"
									label="Modelo"
									value={formik.values.modelo}
									onChange={formik.handleChange}
									error={formik.touched.modelo && Boolean(formik.errors.modelo)}
									helperText={formik.touched.modelo && formik.errors.modelo}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="anio"
									variant="outlined"
									type="number"
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
									fullWidth
									id="anio"
									label="Año"
									value={formik.values.anio}
									onChange={formik.handleChange}
									error={formik.touched.anio && Boolean(formik.errors.anio)}
									helperText={formik.touched.anio && formik.errors.anio}
								/>

								{errors.anio ? (
									<FormHelperText
										error={Boolean(true)}
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											padding: '0 10px',
										}}
									>
										<span>Ingrese un año correcto</span>
									</FormHelperText>
								) : (
									<></>
								)}
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="padron"
									variant="outlined"
									fullWidth
									id="padron"
									label="Padrón"
									value={formik.values.padron}
									onChange={formik.handleChange}
									error={formik.touched.padron && Boolean(formik.errors.padron)}
									helperText={formik.touched.padron && formik.errors.padron}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="matricula"
									variant="outlined"
									fullWidth
									id="matricula"
									label="Matrícula"
									value={formik.values.matricula}
									onChange={formik.handleChange}
									error={formik.touched.matricula && Boolean(formik.errors.matricula)}
									helperText={formik.touched.matricula && formik.errors.matricula}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
									<DatePicker
										label="Vto. Seguro"
										value={vtoSeguro}
										onChange={(f) => setVtoSeguro(f)}
										renderInput={(params) => <TextField {...params} />}
									/>
								</LocalizationProvider>
							</Grid>
							<Grid item xs={12} sm={6}>
								<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
									<DatePicker
										label="Vto. Patente"
										value={vtoPatente}
										onChange={(f) => setVtoPatente(f)}
										renderInput={(params) => <TextField {...params} />}
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12} sm={6}>
								<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
									<DatePicker
										label="Vto. Ministerio"
										value={vtoMinisterio}
										onChange={(f) => setVtoMinisterio(f)}
										renderInput={(params) => <TextField {...params} />}
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12} sm={6}>
								<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
									<DatePicker
										label="Vto. Applus"
										value={vtoApplus}
										onChange={(f) => setVtoApplus(f)}
										renderInput={(params) => <TextField {...params} />}
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="promedioConsumo"
									variant="outlined"
									type="number"
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
									fullWidth
									id="promedioConsumo"
									label="Consumo"
									value={formik.values.promedioConsumo}
									onChange={formik.handleChange}
									error={formik.touched.promedioConsumo && Boolean(formik.errors.promedioConsumo)}
									helperText={formik.touched.promedioConsumo && formik.errors.promedioConsumo}
									InputProps={{
										endAdornment: <InputAdornment position="start">Km/L</InputAdornment>,
									}}
								/>
							</Grid>

							<Grid className="text-start mb-3" item xs={12} sm={8}>
								<SelectPaginate
									label="Chofer *"
									errorLabel={errors.chofer ? 'Ingrese un chofer' : ''}
									value={chofer}
									loadOptions={loadOptionsChofer}
									setOnChange={setChofer}
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
									{unidad ? 'Modificar' : 'Crear'}
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
	nombre: yup
		.string('Introduce el nombre')
		.min(4, 'El nombre debe tener una longitud mínima de 4 caracteres')
		.max(100, 'El nombre debe tener una longitud máxima de 100 caracteres')
		.required('Introduce el nombre'),
	marca: yup
		.string('Introduce la marca')
		.min(2, 'La marca debe tener una longitud mínima de 2 caracteres')
		.max(100, 'La marca debe tener una longitud máxima de 100 caracteres'),
	modelo: yup.string('Introduce el modelo').max(100, 'El modelo debe tener una longitud máxima de 100 caracteres'),
	padron: yup.string('Introduce el padrón').max(100, 'El padrón debe tener una longitud máxima de 100 caracteres'),
	matricula: yup.string('Introduce la matrícula').max(50, 'La matrícula debe tener una longitud máxima de 50 caracteres'),
});

export default CrearEditarUnidad;
