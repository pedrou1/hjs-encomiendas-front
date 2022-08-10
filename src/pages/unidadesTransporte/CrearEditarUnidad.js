import { Button, TextField, Link, CssBaseline, Box, Grid, Typography, Container, Paper, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Helmet } from 'react-helmet';
import * as servicioUnidades from '../../services/ServicioUnidades';
import * as Constantes from '../../utils/Constantes';
import { defaultStyles } from '../../utils/defaultStyles';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const CrearEditarUnidad = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const unidad = state?.unidad ? state.unidad : null;

	const formik = useFormik({
		initialValues: unidad
			? {
					nombre: unidad.nombre,
					promedioConsumo: unidad.promedioConsumo,
					capacidad: unidad.capacidad ? unidad.capacidad : 0,
			  }
			: {
					nombre: '',
					promedioConsumo: 0,
					capacidad: 0,
			  },
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				const unidadIngresada = { ...values, idUnidadTransporte: unidad?.idUnidadTransporte };

				const res = unidad ? await servicioUnidades.modificarUnidad(unidadIngresada) : await servicioUnidades.registrarUnidad(unidadIngresada);

				if (res.operationResult == Constantes.SUCCESS) {
					navigate('/unidades');
					toast.success(`Unidad ${unidad ? 'modificada' : 'creada'} correctamente`);
				} else if (res.operationResult == Constantes.ERROR) {
					toast.error('Ha ocurrido un error');
					navigate('/error');
				}
			} catch (error) {}
		},
	});

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="sm">
			<Helmet>
				<title>Crear Unidad de Transporte</title>
			</Helmet>
			<CssBaseline />
			<Paper
				sx={{
					...defaultStyles.boxShadow,
					paddingX: 6,
					paddingY: 2,
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
									label="Nombre"
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
									type="number"
									name="promedioConsumo"
									variant="outlined"
									fullWidth
									id="promedioConsumo"
									label="Promedio de Consumo"
									value={formik.values.promedioConsumo}
									onChange={formik.handleChange}
									error={formik.touched.promedioConsumo && Boolean(formik.errors.promedioConsumo)}
									helperText={formik.touched.promedioConsumo && formik.errors.promedioConsumo}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="capacidad"
									variant="outlined"
									fullWidth
									id="capacidad"
									label="Capacidad"
									value={formik.values.capacidad}
									onChange={formik.handleChange}
									error={formik.touched.capacidad && Boolean(formik.errors.capacidad)}
									helperText={formik.touched.capacidad && formik.errors.capacidad}
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
	nombre: yup.string('Introduce el nombre').min(4, 'El nombre debe tener una longitud mínima de 4 caracteres').required('Introduce el nombre'),
	promedioConsumo: yup.number('Introduce el promedio consumo').min(0).required('Introduce el promedio consumo'),
	capacidad: yup.number('Introduce la capacidad').min(0).required('Introduce la capacidad'),
});

export default CrearEditarUnidad;
