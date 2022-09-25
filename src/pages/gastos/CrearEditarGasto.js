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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AsyncPaginate } from 'react-select-async-paginate';
import Select from 'react-select';
import SelectPaginate from '../../components/SelectPaginate';
import * as servicioTipoPedidos from '../../services/ServicioTipoPedidos';

const CrearEditarGasto = () => {
	const [usuario, setUsuario] = useState({});
	const [unidad, setUnidad] = useState({});

	const navigate = useNavigate();
	const { state } = useLocation();
	const gasto = state?.gasto ? state.gasto : null;
	const [costo, setCosto] = useState(gasto ? gasto.costo : 0);

	useEffect(() => {
		if (gasto) {
			const usuario = { value: gasto.usuario.idUsuario, label: `${gasto.usuario.nombre} ${gasto.usuario.apellido}` };
			const unidad = { value: gasto.transporte.idUnidadTransporte, label: `${gasto.transporte.nombre}` };
			setUsuario(usuario);
			setUnidad(unidad);
			setCosto(costo);
		}
	}, []);

	useEffect(() => {
		if (gasto?.costo) setCosto(gasto.costo);
	}, [gasto]);

	const formik = useFormik({
		initialValues: gasto
			? {
					descripcion: gasto.descripcion,
					costo: gasto.costo,
					fecha: gasto.fecha,
			  }
			: {
					descripcion: '',
					costo: 0,
					fecha: '',
			  },
		validationSchema: validationSchema,

		onSubmit: async (values, e) => {
			try {
				if (usuario.value && unidad.value) {
					const gastoIngresado = {
						...values,
						idGasto: gasto?.idGasto,
						idUsuario: usuario.value,
						idTransporte: unidad.value,
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
			} catch (error) {}
		},
	});

	const classes = useStyles();

	async function loadOptionsUsuario(search, loadedOptions) {
		const filters = JSON.stringify(search.trim().split(/\s+/));

		const { usuarios, totalRows } = await servicioUsuarios.obtenerUsuarios({ PageIndex: loadedOptions.length, PageSize: 5, filters });

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
				<title>Crear Gasto</title>
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
								id="descripcion"
								label="Descripcion"
								value={formik.values.descripcion}
								onChange={formik.handleChange}
								error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
								helperText={formik.touched.descripcion && formik.errors.descripcion}
							/>
						</Grid>

						<Grid className="text-start">
							<SelectPaginate
								label="Usuario"
								errorLabel="Ingrese un usuario"
								value={usuario}
								loadOptions={loadOptionsUsuario}
								setOnChange={setUsuario}
							/>

							<SelectPaginate
								label="Unidad de transporte"
								errorLabel="Ingrese una unidad"
								value={unidad}
								loadOptions={loadOptionsUnidad}
								setOnChange={setUnidad}
								styleInputLabel={{ mt: 2 }}
							/>
						</Grid>

						<Grid container spacing={2}>
							<Grid item xs={12} sm={6} sx={{ mt: 2 }}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="fecha"
									variant="outlined"
									fullWidth
									id="fecha"
									label="Fecha"
									value={formik.values.fecha}
									onChange={formik.handleChange}
									error={formik.touched.fecha && Boolean(formik.errors.fecha)}
									helperText={formik.touched.fecha && formik.errors.fecha}
								/>
							</Grid>

							<Grid item xs={12} sm={6} sx={{ mt: 2 }}>
								<TextField
									InputLabelProps={{
										classes: {
											root: classes.label,
										},
									}}
									name="costo"
									variant="outlined"
									fullWidth
									id="costo"
									label="Costo"
									value={costo}
									onChange={(c) => setCosto(c)}
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
