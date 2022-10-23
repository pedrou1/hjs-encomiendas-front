import { Button, Grid, Typography, Container, Paper, Stack, Skeleton, InputLabel, TextField } from '@mui/material';
import { Helmet } from 'react-helmet';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import * as Constantes from '../../utils/constantes';
import { columnasPedidos } from '../../utils/columnasTablas';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import LocationIcon from '@mui/icons-material/Place';
import EmailIcon from '@mui/icons-material/MailOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditIcon from '@mui/icons-material/Edit';
import Table from '../../components/Table';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalDialog from '../../components/ModalDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as servicioPedidos from '../../services/ServicioPedidos';
import KeyIcon from '@mui/icons-material/Key';
import * as authService from '../../services/AuthService';
import * as servicioUnidades from '../../services/ServicioUnidades';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Select from 'react-select';
import Filtros from './../../components/Filtros';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SelectPaginate from '../../components/SelectPaginate';

const estados = Constantes.estados;

const VerUsuario = () => {
	const [usuario, setUsuario] = useState({});
	const [openModal, setOpenModal] = useState(false);
	const { idUsuario } = useParams();
	const [pedidos, setPedidos] = useState([]);
	const [countPedidos, setCountPedidos] = useState(0);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const [esAdmin, setEsAdmin] = useState(false);
	const [unidad, setUnidad] = useState('');
	const [estado, setEstado] = useState([]);
	const [openFiltros, setOpenFiltros] = useState(null);
	const [fechaDesde, setFechaDesde] = useState(null);
	const [fechaHasta, setFechaHasta] = useState(null);
	const [columnas, setColumnas] = useState(columnasPedidos);

	const navigate = useNavigate();
	const classes = useStyles();

	useEffect(() => {
		const usuarioActual = authService.getCurrentUser();
		setEsAdmin(usuarioActual.idCategoria === Constantes.ID_ADMINISTRADOR);

		getUsuario();
		getPedidos();
	}, []);

	useEffect(() => {
		if (fechaDesde && !fechaHasta) {
			setFechaHasta(new Date());
		}
		if (fechaHasta && !fechaDesde) {
			setFechaDesde(new Date());
		}
	}, [fechaDesde, fechaHasta]);

	const getUsuario = async () => {
		const usuario = await servicioUsuarios.obtenerUsuario(idUsuario);
		setUsuario(usuario);

		if (usuario.idCategoria === Constantes.ID_CLIENTE) {
			setColumnas(columnasPedidos.filter((p) => p.name !== 'Cliente'));
		} else if (usuario.idCategoria === Constantes.ID_CHOFER) {
			setColumnas(columnasPedidos.filter((p) => p.name !== 'Chofer'));
		}

		const unidad = await servicioUnidades.otenerUnidadDeChofer(idUsuario);

		if (unidad) {
			setUnidad(unidad.nombre);
		}
	};

	const handleDelete = async () => {
		const res = await servicioUsuarios.eliminarUsuario(idUsuario);
		if (res.operationResult == Constantes.SUCCESS) {
			setOpenModal(false);
			navigate(-1);
			toast.success('Usuario eliminado correctamente');
		} else {
			toast.error('Ha ocurrido un error');
			navigate('/error');
		}
	};

	const getPedidos = async (newPaginationData, newParams) => {
		if (newPaginationData) setPaginationData(newPaginationData);
		let params = newPaginationData || paginationData;
		params.idUsuarioPedido = idUsuario;
		if (newParams) params = { ...params, ...newParams };
		const { pedidos, totalRows, operationResult } = await servicioPedidos.obtenerPedidos(params);
		setPedidos(pedidos);
		setCountPedidos(totalRows);
		setLoadingFinished(operationResult == 1 ? true : false);
	};

	const handleFiltrar = async () => {
		let params = {};
		params.estados = estado.map((e) => e.value);

		if (params.estados && params.estados.length) {
			params.estados = JSON.stringify(params.estados);
		}

		if (fechaDesde && fechaHasta) {
			params.fechaDesde = fechaDesde;
			params.fechaHasta = fechaHasta;
		}
		getPedidos(null, params);
	};

	const onPageChange = async (paginationData) => {
		paginationData.idUsuarioPedido = idUsuario;
		await getPedidos(paginationData);
	};

	const goToVerPedidos = (pedido) => {
		navigate('/crear-pedido', { state: { pedido: pedido } });
	};

	return (
		<Container component="main" maxWidth="xl">
			<Helmet>
				<title>Ver perfil</title>
			</Helmet>

			{usuario && (
				<div>
					<Grid item xs={3} lg={3} className="d-flex flex-column">
						{esAdmin && (
							<div className="align-self-end" style={{ minHeight: !usuario?.nombre ? '2.3rem' : '0rem' }}>
								{usuario?.usuario ? (
									<Button
										variant="outlined"
										sx={{ mr: 1 }}
										startIcon={<KeyIcon />}
										onClick={() => navigate('/usuario/cambiar-password', { state: { usuario } })}
									>
										Cambiar contraseña
									</Button>
								) : (
									<></>
								)}
								{usuario?.nombre ? (
									<>
										<Button
											variant="outlined"
											sx={{ mr: 1 }}
											startIcon={<EditIcon />}
											onClick={() => navigate('/crear-usuario', { state: { usuario: usuario } })}
										>
											Modificar
										</Button>
										<Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => setOpenModal(!openModal)}>
											Eliminar
										</Button>
									</>
								) : (
									<></>
								)}
							</div>
						)}
						<ModalDialog
							open={openModal}
							titulo="¿Estas seguro?"
							mensaje={`¿Quieres eliminar el usuario ${usuario.nombre} ${usuario.apellido}?`}
							esEliminar={true}
							handleClose={() => setOpenModal(false)}
							handleAccept={handleDelete}
						/>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={12} lg={4}>
							<Paper sx={{ p: 2, paddingX: { xs: 4, md: 2 } }} className="mt-2">
								{usuario.nombre ? (
									<>
										<Stack alignItems="center" spacing={1}>
											<Typography variant="h6">{`${usuario.nombre} ${usuario.apellido}`}</Typography>
										</Stack>
										<br />
										<Stack spacing={1}>
											{usuario.usuario && (
												<UserInfoText>
													<PersonOutlineOutlinedIcon />
													<Typography variant="body1">{usuario.usuario}</Typography>
												</UserInfoText>
											)}
											{usuario.telefono && (
												<UserInfoText>
													<LocalPhoneOutlinedIcon />
													<Typography variant="body1">{usuario.telefono}</Typography>
												</UserInfoText>
											)}
											<UserInfoText>
												<AdminPanelSettingsIcon />
												<Typography variant="body1">{usuario.categoriaUsuario?.nombre}</Typography>
											</UserInfoText>

											{unidad && (
												<UserInfoText>
													<LocalShippingIcon />
													<Typography variant="body1">{unidad}</Typography>
												</UserInfoText>
											)}
											{usuario.email && (
												<UserInfoText>
													<EmailIcon />
													<Typography variant="body1">{usuario.email}</Typography>
												</UserInfoText>
											)}
											{usuario.direccion && (
												<UserInfoText>
													<LocationIcon />
													<Typography variant="body1">{usuario.direccion}</Typography>
												</UserInfoText>
											)}
											{usuario.usuario && (
												<UserInfoText>
													<CheckOutlinedIcon />
													<Typography variant="body1">Tiene cuenta</Typography>
												</UserInfoText>
											)}
										</Stack>
									</>
								) : (
									<>
										<Skeleton variant="text" sx={{ my: 0, mx: 1, p: 2 }} />
										{[...Array(3)].map((e, i) => (
											<Skeleton key={i} variant="text" sx={{ my: 1, mx: 1, p: 1 }} />
										))}
									</>
								)}
							</Paper>
						</Grid>
						<Grid item xs={12} lg={8}>
							<Stack direction="column" spacing={2}>
								<Table
									data={pedidos}
									columns={columnas}
									totalRows={countPedidos}
									isLoadingFinished={loadingFinished}
									onPageChange={onPageChange}
									onRowClicked={(r) => (esAdmin ? goToVerPedidos(r) : null)}
								>
									<div className="d-flex justify-content-between">
										<div></div>
										<div className="pt-3">
											<h5>Pedidos</h5>
										</div>

										<div className="align-self-end">
											<Filtros anchorEl={openFiltros} setAnchorEl={setOpenFiltros}>
												<Typography>Filtros</Typography>
												<InputLabel sx={{ mt: 1 }}>Estado</InputLabel>
												<div>
													<Select
														menuPortalTarget={document.querySelector('.MuiPaper-elevation')}
														value={estado}
														isMulti
														options={estados}
														onChange={(e) => setEstado(e)}
														styles={customStyles}
														noOptionsMessage={() => 'No hay mas datos'}
														placeholder={''}
													/>

													<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
														<DatePicker
															label="Fecha desde"
															value={fechaDesde}
															onChange={(f) => setFechaDesde(f)}
															renderInput={(params) => <TextField className="mt-3 w-50" {...params} />}
														/>
													</LocalizationProvider>
													<LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
														<DatePicker
															label="Fecha hasta"
															value={fechaHasta}
															onChange={(f) => setFechaHasta(f)}
															renderInput={(params) => <TextField className="mt-3 w-50" {...params} />}
														/>
													</LocalizationProvider>
												</div>
												<div className="mt-2 pb-1  d-flex justify-content-start">
													<div className="mr-2">
														<Button
															onClick={() => {
																handleFiltrar();
																setOpenFiltros(false);
															}}
															variant="contained"
															className="mt-2"
															style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
														>
															Filtrar
														</Button>
													</div>
													<div className="pb-1" style={{ marginLeft: '0.6rem' }}>
														<Button
															onClick={() => {
																setEstado([]);
																setFechaDesde(null);
																setFechaHasta(null);
																setOpenFiltros(false);
																getPedidos();
															}}
															variant="outlined"
															className="mt-2 ml-2"
															style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
														>
															Limpiar
														</Button>
													</div>
												</div>
											</Filtros>
										</div>
									</div>
								</Table>
							</Stack>
						</Grid>
					</Grid>
				</div>
			)}
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

export default VerUsuario;

const UserInfoText = ({ children }) => (
	<Stack
		direction="row"
		alignItems="center"
		justifyContent={{
			sm: 'center',
			lg: 'flex-start',
		}}
		gap={1}
	>
		{children}
	</Stack>
);

const customStyles = {
	option: (provided, state) => {
		return {
			...provided,
			color: 'black',
			zIndex: 9999,
		};
	},
};
