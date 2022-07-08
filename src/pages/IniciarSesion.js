import { Avatar, Button, TextField, Link, CssBaseline, Box, Grid, Typography, Container } from '@mui/material';
import styled from '@emotion/styled';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as servicioUsuarios from '../services/ServicioUsuarios';
import * as Constantes from '../utils/constantes';

const IniciarSesion = (prop) => {
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			usuario: '',
			password: '',
		},
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			const res = await servicioUsuarios.iniciarSesion(values);
			if (res == Constantes.Success) {
				console.log('success');
			} else if (res == Constantes.Error) {
				// 			navigate('/404');
			}
		},
	});

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="xs">
			<Helmet>
				<title>Iniciar sesión</title>
			</Helmet>
			<CssBaseline />
			<Box
				sx={{
					marginTop: 10,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Inicia sesión
				</Typography>
				<Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
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
					<Button type="submit" color="primary" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
						Iniciar sesión
					</Button>
					<Grid container>
						<Grid item xs>
							<Box mt={2} />
						</Grid>

						<Grid item>
							<Box mt={2} />
							<Link href={process.env.PUBLIC_URL + '/'} variant="body2">
								¿No tienes una cuenta? Regístrate
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
};

const useStyles = styled((theme) => ({
	label: {
		backgroundColor: '#fafafa',
		paddingLeft: 6,
		paddingRight: 8,
	},
}));

const validationSchema = yup.object({
	usuario: yup
		.string('Introduce tu nombre de usuario')
		.min(4, 'El nombre de usuario debe tener una longitud mínima de 4 caracteres')
		.required('Introduce tu nombre de usuario'),
	password: yup.string('Introduce tu contraseña').min(6, 'La contraseña debe tener una longitud mínima de 6 caracteres').required('Introduce tu contraseña'),
});

export default IniciarSesion;
