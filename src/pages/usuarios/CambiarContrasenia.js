import { Button, TextField, CssBaseline, Box, Grid, Typography, Container, Paper, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Helmet } from 'react-helmet';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import * as Constantes from '../../utils/constantes';
import { defaultStyles } from '../../utils/defaultStyles';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const CambiarContrasenia = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const usuario = state.usuario;

	const formik = useFormik({
		initialValues: {
			usuario: usuario.usuario ? usuario.usuario : '',
			password: '',
		},
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				const usuarioIngresado = usuario;
				usuarioIngresado.password = values.password;

				const res = await servicioUsuarios.modificarContraUsuario(usuarioIngresado);

				if (res.operationResult == Constantes.SUCCESS) {
					navigate('-1');
					toast.success(`Contraseña modificada correctamente`);
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
				<title>Modificar contraseña</title>
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
						Cambiar contraseña
					</Typography>
					<Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									disabled={true}
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="usuario"
									variant="outlined"
									fullWidth
									id="usuario"
									label="Usuario"
									autoFocus
									value={formik.values.usuario}
									onChange={formik.handleChange}
									error={formik.touched.usuario && Boolean(formik.errors.usuario)}
									helperText={formik.touched.usuario && formik.errors.usuario}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="password"
									variant="outlined"
									fullWidth
									id="password"
									label="Contraseña"
									type="password"
									autoFocus={true}
									value={formik.values.password}
									onChange={formik.handleChange}
									error={formik.touched.password && Boolean(formik.errors.password)}
									helperText={formik.touched.password && formik.errors.password}
								/>
							</Grid>
							<Box mt={12} />
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
									Modificar
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
	usuario: yup.string('Introduce tu nombre de usuario').min(4, 'El nombre de usuario debe tener una longitud mínima de 4 caracteres'),
	password: yup.string('Introduce tu contraseña').min(6, 'La contraseña debe tener una longitud mínima de 6 caracteres'),
});

export default CambiarContrasenia;
