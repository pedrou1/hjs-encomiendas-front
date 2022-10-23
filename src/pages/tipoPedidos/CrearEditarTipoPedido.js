import { Button, TextField, Link, CssBaseline, Box, Grid, Typography, Container, Paper, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Helmet } from 'react-helmet';
import * as servicioTipoPedidos from '../../services/ServicioTipoPedidos';
import * as Constantes from '../../utils/constantes';
import { defaultStyles } from '../../utils/defaultStyles';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const CrearEditarTipoPedido = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const tipoPedido = state?.tipoPedido ? state.tipoPedido : null;

	const formik = useFormik({
		initialValues: tipoPedido
			? {
					nombre: tipoPedido.nombre,
					pesoDesde: tipoPedido.pesoDesde,
					pesoHasta: tipoPedido.pesoHasta,
					tarifa: tipoPedido.tarifa,
			  }
			: {
					nombre: '',
					pesoDesde: 0,
					pesoHasta: 0,
					tarifa: 0,
			  },
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				const tipoPedidoIngresado = { ...values, idTipoPedido: tipoPedido?.idTipoPedido };

				const res = tipoPedido
					? await servicioTipoPedidos.modificarTipoPedido(tipoPedidoIngresado)
					: await servicioTipoPedidos.registrarTipoPedido(tipoPedidoIngresado);

				if (res.operationResult == Constantes.SUCCESS) {
					navigate('/tipos-pedidos');
					toast.success(`Tipo de pedido ${tipoPedido ? 'modificado' : 'creado'} correctamente`);
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
				<title>{tipoPedido ? 'Modificar Tipo de Pedido' : 'Crear Tipo de Pedido'}</title>
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
						{tipoPedido ? 'Editar Tipo de Pedido' : 'Crear Tipo de pedido'}
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
									name="pesoDesde"
									variant="outlined"
									fullWidth
									id="pesoDesde"
									label="Peso Desde (KG)"
									value={formik.values.pesoDesde}
									onChange={formik.handleChange}
									error={formik.touched.pesoDesde && Boolean(formik.errors.pesoDesde)}
									helperText={formik.touched.pesoDesde && formik.errors.pesoDesde}
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
									name="pesoHasta"
									variant="outlined"
									fullWidth
									id="pesoHasta"
									label="Peso Hasta (KG)"
									value={formik.values.pesoHasta}
									onChange={formik.handleChange}
									error={formik.touched.pesoHasta && Boolean(formik.errors.pesoHasta)}
									helperText={formik.touched.pesoHasta && formik.errors.pesoHasta}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="tarifa"
									variant="outlined"
									type="number"
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
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
									{tipoPedido ? 'Modificar' : 'Crear'}
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
	pesoDesde: yup.number('Introduce el peso').min(0).required('Introduce el peso'),
	pesoHasta: yup.number('Introduce el peso').min(0).required('Introduce el peso'),
	tarifa: yup.number('Introduce la tarifa').min(0).required('Introduce la tarifa'),
});

export default CrearEditarTipoPedido;
