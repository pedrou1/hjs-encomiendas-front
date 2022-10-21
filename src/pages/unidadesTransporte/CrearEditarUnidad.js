import { Button, TextField, Link, CssBaseline, Box, Grid, Typography, Container, Paper, MenuItem } from '@mui/material';
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

const CrearEditarUnidad = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [chofer, setChofer] = useState({});
	const [errors, setErrors] = useState({});
	const unidad = state?.unidad ? state.unidad : null;

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
					promedioConsumo: unidad.promedioConsumo,
					marca: unidad.marca ? unidad.marca : '',
					modelo: unidad.modelo ? unidad.modelo : '',
					anio: unidad.anio ? unidad.anio : 0,
					padron: unidad.padron ? unidad.padron : '',
					matricula: unidad.matricula ? unidad.matricula : '',
			  }
			: {
					nombre: '',
					promedioConsumo: 0,
					marca: '',
					modelo: '',
					anio: 0,
					padron: '',
					matricula: '',
			  },
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				checkErrors();
				if (chofer.value) {
					const unidadIngresada = { ...values, idChofer: chofer.value, idUnidadTransporte: unidad?.idUnidadTransporte };

					const res = unidad ? await servicioUnidades.modificarUnidad(unidadIngresada) : await servicioUnidades.registrarUnidad(unidadIngresada);
					console.log(res);
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

	const checkErrors = () => {
		setErrors({
			chofer: !chofer?.value ? true : false,
		});
	};

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
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
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
									name="marca"
									variant="outlined"
									fullWidth
									id="marca"
									label="Marca"
									autoFocus
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
									autoFocus
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
									label="Padron"
									autoFocus
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
									label="Matricula"
									autoFocus
									value={formik.values.matricula}
									onChange={formik.handleChange}
									error={formik.touched.matricula && Boolean(formik.errors.matricula)}
									helperText={formik.touched.matricula && formik.errors.matricula}
								/>
							</Grid>

							<Grid className="text-start" item xs={12} sm={8}>
								<SelectPaginate
									label="Chofer"
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
	nombre: yup.string('Introduce el nombre').min(4, 'El nombre debe tener una longitud mínima de 4 caracteres').required('Introduce el nombre'),
	promedioConsumo: yup.number('Introduce el promedio consumo').min(0).required('Introduce el promedio consumo'),
});

export default CrearEditarUnidad;
