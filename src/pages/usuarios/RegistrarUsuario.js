import { Avatar, Button, TextField, Link, CssBaseline, Box, Grid, Typography, Container, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Helmet } from 'react-helmet';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import * as Constantes from '../../utils/constantes';

const RegistrarUsuario = () => {
	const formik = useFormik({
		initialValues: {
			nombre: '',
			apellido: '',
			telefono: '',
			email: '',
			usuario: '',
			password: '',
		},
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			const val = { ...values, categoriaUsuario: { idCategoria: 1 } };
			const res = await servicioUsuarios.registrarUsuario(val);

			if (res == Constantes.SUCCESS) {
				console.log('success');
			} else if (res == Constantes.ALREADYEXIST) {
				e.setFieldError('usuario', 'El usuario ya existe, ingresa otro');
			} else if (res == Constantes.ERROR) {
				// 			navigate('/404');
			}
		},
	});

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="sm">
			<Helmet>
				<title>Registrarse</title>
			</Helmet>
			<CssBaseline />
			<Paper
				data-aos="zoom-in"
				data-aos-duration={200}
				sx={{
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
					<Avatar sx={{ m: 1, bgcolor: '#2196f3' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Regístrate
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
									name="apellido"
									variant="outlined"
									fullWidth
									id="apellido"
									label="Apellido"
									value={formik.values.apellido}
									onChange={formik.handleChange}
									error={formik.touched.apellido && Boolean(formik.errors.apellido)}
									helperText={formik.touched.apellido && formik.errors.apellido}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="email"
									variant="outlined"
									fullWidth
									id="email"
									label="Email"
									value={formik.values.email}
									onChange={formik.handleChange}
									error={formik.touched.email && Boolean(formik.errors.email)}
									helperText={formik.touched.email && formik.errors.email}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="telefono"
									variant="outlined"
									fullWidth
									id="telefono"
									label="Teléfono"
									autoFocus
									value={formik.values.telefono}
									onChange={formik.handleChange}
									error={formik.touched.telefono && Boolean(formik.errors.telefono)}
									helperText={formik.touched.telefono && formik.errors.telefono}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
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
									value={formik.values.password}
									onChange={formik.handleChange}
									error={formik.touched.password && Boolean(formik.errors.password)}
									helperText={formik.touched.password && formik.errors.password}
								/>
							</Grid>
							<Box mt={12} />
						</Grid>
						<Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
							Registrarse
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Box mt={2} />
								<Link href={process.env.PUBLIC_URL + '/iniciar-sesion'} variant="body2">
									¿Ya tienes una cuenta? Iniciar sesión
								</Link>
							</Grid>
						</Grid>
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
	nombre: yup.string('Introduce tu nombre').min(4, 'El nombre debe tener una longitud mínima de 4 caracteres').required('Introduce tu nombre'),
	apellido: yup.string('Introduce tu apellido').min(4, 'El apellido debe tener una longitud mínima de 4 caracteres').required('Introduce tu apellido'),
	email: yup.string('Introduce tu email').email('Formato incorrecto'),
	telefono: yup.string('Introduce tu teléfono').min(4, 'El teléfono debe tener una longitud mínima de 4 caracteres'),
	usuario: yup
		.string('Introduce tu nombre de usuario')
		.min(4, 'El nombre de usuario debe tener una longitud mínima de 4 caracteres')
		.required('Introduce tu nombre de usuario'),
	password: yup.string('Introduce tu contraseña').min(6, 'La contraseña debe tener una longitud mínima de 6 caracteres').required('Introduce tu contraseña'),
});

export default RegistrarUsuario;
