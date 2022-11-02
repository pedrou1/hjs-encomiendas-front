import { Avatar, Button, TextField, Link, CssBaseline, Box, Grid, Typography, Container, Paper, FormControlLabel, InputLabel, Checkbox } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Helmet } from 'react-helmet';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import * as Constantes from '../../utils/constantes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const RegistrarUsuario = () => {
	const navigate = useNavigate();

	const [esParticular, setEsParticular] = useState(true);
	const [errors, setErrors] = useState({});
	const [rut, setRut] = useState('');
	const [ci, setCi] = useState('');

	const checkErrors = () => {
		if (esParticular) {
			const errorCi = ci.length !== 8 ? true : false;
			setErrors({
				ci: errorCi,
			});
			return errorCi;
		} else {
			const errorRut = rut.length !== 12 ? true : false;
			setErrors({
				rut: errorRut,
			});
			return errorRut;
		}
	};

	useEffect(() => {
		setErrors({});
	}, [esParticular]);

	const formik = useFormik({
		initialValues: {
			nombre: '',
			apellido: '',
			telefono: '',
			direccion: '',
			email: '',
			usuario: '',
			password: '',
			apartamento: '',
			nroPuerta: '',
		},
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			const error = checkErrors();

			if (!error) {
				values.telefono = values.telefono ? values.telefono.toString() : null;
				values.apellido = values.apellido ? values.apellido.toString() : '';
				values.apellido = esParticular ? values.apellido : '';

				const val = { ...values, ci, rut, categoriaUsuario: { idCategoria: Constantes.ID_CLIENTE } };
				const res = await servicioUsuarios.registrarUsuario(val);

				if (res.operationResult == Constantes.SUCCESS) {
					navigate('/iniciar-sesion');
					toast.success(`Registrado correctamente`);
				} else if (res.operationResult == Constantes.ALREADYEXIST) {
					e.setFieldError('usuario', 'El usuario ya existe, ingresa otro');
				} else if (res.operationResult == Constantes.ERROR) {
					window.location = '#/error';
				}
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
									label={esParticular ? 'Nombre *' : 'Razón social *'}
									autoFocus
									value={formik.values.nombre}
									onChange={formik.handleChange}
									error={formik.touched.nombre && Boolean(formik.errors.nombre)}
									helperText={formik.touched.nombre && formik.errors.nombre}
								/>
							</Grid>
							{esParticular ? (
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
							) : (
								<></>
							)}

							<Grid item xs={12} className="d-flex">
								<Grid item xs={7}>
									{esParticular ? (
										<TextField
											InputLabelProps={{
												classes: {
													root: classes.label,
												},
											}}
											name="ci"
											variant="outlined"
											fullWidth
											id="ci"
											label="Cédula de identidad *"
											value={ci}
											onKeyPress={(event) => {
												if (!/[0-9]/.test(event.key)) {
													event.preventDefault();
												}
											}}
											onChange={(event) => {
												if (isFinite(event.target.value)) {
													setCi(event.target.value);
												}
											}}
										/>
									) : (
										<TextField
											InputLabelProps={{
												classes: {
													root: classes.label,
												},
											}}
											name="rut"
											variant="outlined"
											fullWidth
											id="rut"
											label="RUT *"
											value={rut}
											onKeyPress={(event) => {
												if (!/[0-9]/.test(event.key)) {
													event.preventDefault();
												}
											}}
											onChange={(event) => {
												if (isFinite(event.target.value)) {
													setRut(event.target.value);
												}
											}}
										/>
									)}
								</Grid>
								<Grid item xs={5} className="d-flex justify-content-center">
									<FormControlLabel
										control={
											<Checkbox
												checked={esParticular}
												onChange={(event) => setEsParticular(event.target.checked)}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label="Es particular"
									/>
								</Grid>
							</Grid>
							{(errors.rut || errors.ci) && (
								<InputLabel sx={{ mt: '0.3rem', color: '#d32f2f', fontSize: '0.75rem', ml: 3 }}>
									{errors.ci ? 'Ingrese una cédula correcta' : 'Ingrese un rut correcto'}
								</InputLabel>
							)}

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
									label="Teléfono *"
									autoFocus
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
									onChange={(event) => {
										if (isFinite(event.target.value)) {
											formik.handleChange(event);
										}
									}}
									value={formik.values.telefono}
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
									error={formik.touched.nroPuerta && Boolean(formik.errors.nroPuerta)}
									helperText={formik.touched.nroPuerta && formik.errors.nroPuerta}
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
									label="Usuario *"
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
									label="Contraseña *"
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
	nombre: yup
		.string('Introduce tu nombre/razón social')
		.min(4, 'El nombre/razón social debe tener una longitud mínima de 4 caracteres')
		.max(100, 'El nombre/razón social debe tener una longitud máxima de 100 caracteres')
		.required('Introduce tu nombre/razón social'),
	apellido: yup.string('Introduce tu apellido').nullable().max(100, 'El apellido debe tener una longitud máxima de 100 caracteres'),
	email: yup.string('Introduce tu email').email('Formato incorrecto').max(150, 'El email debe tener una longitud máxima de 150 caracteres'),
	telefono: yup
		.string('Introduce tu teléfono')
		.required('Introduce tu teléfono')
		.min(4, 'El teléfono debe tener una longitud mínima de 4 caracteres')
		.max(15, 'El teléfono debe tener una longitud máxima de 15 caracteres'),
	direccion: yup
		.string('Introduce tu dirección')
		.min(4, 'La dirección debe tener una longitud mínima de 4 caracteres')
		.max(200, 'La dirección debe tener una longitud máxima de 200 caracteres'),
	usuario: yup
		.string('Introduce tu nombre de usuario')
		.min(4, 'El nombre de usuario debe tener una longitud mínima de 4 caracteres')
		.max(100, 'El nombre de usuario debe tener una longitud máxima de 100 caracteres')
		.required('Introduce tu nombre de usuario'),
	password: yup
		.string('Introduce tu contraseña')
		.min(6, 'La contraseña debe tener una longitud mínima de 6 caracteres')
		.max(80, 'La contraseña debe tener una longitud máxima de 80 caracteres')
		.required('Introduce tu contraseña'),
	apartamento: yup
		.string('Introduce el apartamento')
		.min(4, 'El apartamento debe tener una longitud mínima de 4 caracteres')
		.max(100, 'El apartamento no puede superar los 100 caracteres'),
	nroPuerta: yup.string('Introduce el número de puerta').max(6, 'El número de puerta no puede superar los 6 caracteres'),
});

export default RegistrarUsuario;
