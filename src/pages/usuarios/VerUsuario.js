import { Button, Grid, Typography, Container, Paper, Stack, Skeleton } from '@mui/material';
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

const VerUsuario = () => {
	const [usuario, setUsuario] = useState({});
	const [openModal, setOpenModal] = useState(false);
	const { idUsuario } = useParams();
	const [pedidos, setPedidos] = useState([]);
	const [countPedidos, setCountPedidos] = useState(0);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const [esAdmin, setEsAdmin] = useState(false);

	const navigate = useNavigate();
	const classes = useStyles();

	useEffect(() => {
		const usuarioActual = authService.getCurrentUser();
		setEsAdmin(usuarioActual.idCategoria === Constantes.ID_ADMINISTRADOR);

		getUsuario();
		getPedidos();
	}, []);

	const getUsuario = async () => {
		const usuario = await servicioUsuarios.obtenerUsuario(idUsuario);

		setUsuario(usuario);
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

	const getPedidos = async (newPaginationData) => {
		if (newPaginationData) {
			setPaginationData(newPaginationData);
		}
		const params = newPaginationData || paginationData;
		params.idUsuarioPedido = idUsuario;
		const { pedidos, totalRows, operationResult } = await servicioPedidos.obtenerPedidos(params);
		setPedidos(pedidos);
		setCountPedidos(totalRows);
		setLoadingFinished(operationResult == 1 ? true : false);
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
							<div className="align-self-end">
								<Button
									variant="outlined"
									sx={{ mr: 1 }}
									startIcon={<KeyIcon />}
									onClick={() => navigate('/usuario/cambiar-password', { state: { usuario } })}
								>
									Cambiar contraseña
								</Button>
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
											<UserInfoText>
												<PersonOutlineOutlinedIcon />
												<Typography variant="body1">[Hombre[</Typography>
											</UserInfoText>
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
									title="Pedidos"
									data={pedidos}
									columns={columnasPedidos}
									totalRows={countPedidos}
									isLoadingFinished={loadingFinished}
									onPageChange={onPageChange}
									onRowClicked={goToVerPedidos}
								/>
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
