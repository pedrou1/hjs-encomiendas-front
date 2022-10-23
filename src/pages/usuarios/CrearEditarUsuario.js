import { Button, TextField, Link, CssBaseline, Box, Grid, Typography, Container, Paper, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Helmet } from 'react-helmet';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import * as Constantes from '../../utils/constantes';
import { defaultStyles } from '../../utils/defaultStyles';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const CrearEditarUsuario = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const usuario = state?.usuario ? state.usuario : null;

	const formik = useFormik({
		initialValues: usuario
			? {
					nombre: usuario.nombre,
					apellido: usuario.apellido,
					telefono: usuario.telefono ? usuario.telefono : '',
					telefono2: usuario.telefono2 ? usuario.telefono2 : '',
					direccion: usuario.direccion ? usuario.direccion : '',
					email: usuario.email ? usuario.email : '',
					usuario: usuario.usuario ? usuario.usuario : '',
					categoriaUsuario: usuario.idCategoria,
					password: '',
					apartamento: usuario.apartamento ? usuario.apartamento : '',
					nroPuerta: usuario.nroPuerta ? usuario.nroPuerta : '',
			  }
			: {
					nombre: '',
					apellido: '',
					telefono: '',
					telefono2: '',
					nroPuerta: '',
					direccion: '',
					email: '',
					usuario: '',
					password: '',
					categoriaUsuario: Constantes.ID_CLIENTE,
					apartamento: '',
			  },
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				const usuarioIngresado = { ...values, idUsuario: usuario?.idUsuario, categoriaUsuario: { idCategoria: values.categoriaUsuario } };

				const res = usuario ? await servicioUsuarios.modificarUsuario(usuarioIngresado) : await servicioUsuarios.registrarUsuario(usuarioIngresado);

				if (res.operationResult == Constantes.SUCCESS) {
					navigate('/usuarios');
					toast.success(`Usuario ${usuario ? 'modificado' : 'creado'} correctamente`);
				} else if (res.operationResult == Constantes.ALREADYEXIST) {
					e.setFieldError('usuario', 'El usuario ya existe, ingresa otro');
				} else if (res.operationResult == Constantes.ERROR) {
					toast.error('Ha ocurrido un error');
					navigate('/error');
				}
			} catch (error) {
				console.log(error);
			}
		},
	});

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="sm">
			<Helmet>
				<title>{usuario ? 'Modificar usuario' : 'Crear usuario'}</title>
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
						{usuario ? 'Editar Usuario' : 'Crear Usuario'}
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
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
									type="number"
									autoFocus
									value={formik.values.telefono}
									onChange={formik.handleChange}
									error={formik.touched.telefono && Boolean(formik.errors.telefono)}
									helperText={formik.touched.telefono && formik.errors.telefono}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="telefono2"
									variant="outlined"
									fullWidth
									id="telefono2"
									label="Teléfono secundario"
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
									type="number"
									autoFocus
									value={formik.values.telefono2}
									onChange={formik.handleChange}
									error={formik.touched.telefono2 && Boolean(formik.errors.telefono2)}
									helperText={formik.touched.telefono2 && formik.errors.telefono2}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="direccion"
									variant="outlined"
									fullWidth
									id="direccion"
									label="Dirección"
									autoFocus
									value={formik.values.direccion}
									onChange={formik.handleChange}
									error={formik.touched.direccion && Boolean(formik.errors.direccion)}
									helperText={formik.touched.direccion && formik.errors.direccion}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
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

							<Grid item xs={12} sm={6}>
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
									label="Número de puerta"
									value={formik.values.nroPuerta}
									onChange={formik.handleChange}
									error={formik.touched.nroPuerta && Boolean(formik.errors.nroPuerta)}
									helperText={formik.touched.nroPuerta && formik.errors.nroPuerta}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									select
									name="categoriaUsuario"
									variant="outlined"
									label="Categoría"
									margin="normal"
									fullWidth
									value={formik.values.categoriaUsuario}
									onChange={formik.handleChange('categoriaUsuario')}
									error={formik.touched.categoriaUsuario && Boolean(formik.errors.categoriaUsuario)}
									helperText={formik.touched.categoriaUsuario && formik.errors.categoriaUsuario}
								>
									<MenuItem value={Constantes.ID_CLIENTE}>
										<span>Cliente</span>
									</MenuItem>
									<MenuItem value={Constantes.ID_CHOFER}>
										<span>Chofer</span>
									</MenuItem>
									<MenuItem value={Constantes.ID_ADMINISTRADOR}>
										<span>Administrador</span>
									</MenuItem>
								</TextField>
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
									{usuario ? 'Modificar' : 'Crear'}
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
	nombre: yup.string('Introduce tu nombre').min(4, 'El nombre debe tener una longitud mínima de 4 caracteres').required('Introduce tu nombre'),
	apellido: yup.string('Introduce tu apellido').min(4, 'El apellido debe tener una longitud mínima de 4 caracteres').required('Introduce tu apellido'),
	email: yup.string('Introduce tu email').email('Formato incorrecto'),
	telefono: yup
		.string('Introduce tu teléfono')
		.min(4, 'El teléfono debe tener una longitud mínima de 4 caracteres')
		.max(15, 'El teléfono debe tener una longitud máxima de 15 caracteres'),
	telefono2: yup
		.string('Introduce tu teléfono')
		.min(4, 'El teléfono debe tener una longitud mínima de 4 caracteres')
		.max(20, 'El teléfono debe tener una longitud máxima de 15 caracteres'),
	apartamento: yup.string('Introduce tu apartamento').min(4, 'El apartamento debe tener una longitud mínima de 4 caracteres'),
	nroPuerta: yup.string('Introduce tu número de puerta'),
	direccion: yup.string('Introduce tu dirección').min(4, 'La dirección debe tener una longitud mínima de 4 caracteres'),
	usuario: yup.string('Introduce tu nombre de usuario').min(4, 'El nombre de usuario debe tener una longitud mínima de 4 caracteres'),
	password: yup.string('Introduce tu contraseña').min(6, 'La contraseña debe tener una longitud mínima de 6 caracteres'),
	categoriaUsuario: yup.string('Introduce la categoría').required('Introduce la categoría'),
});

export default CrearEditarUsuario;
