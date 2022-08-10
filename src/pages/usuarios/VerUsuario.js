import { Button, Grid, Typography, Container, Paper, Stack } from '@mui/material';
import { Helmet } from 'react-helmet';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import * as Constantes from '../../utils/Constantes';
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

const VerUsuario = () => {
	const [usuario, setUsuario] = useState({});
	const [openModal, setOpenModal] = useState(false);
	const { idUsuario } = useParams();

	const navigate = useNavigate();
	const classes = useStyles();

	useEffect(() => {
		getUsuario();
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

	return (
		<Container component="main" maxWidth="xl">
			<Helmet>
				<title>Ver perfil</title>
			</Helmet>

			{usuario && (
				<div>
					<Grid item xs={3} lg={3} className="d-flex flex-column">
						<div className="align-self-end">
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
								<Stack alignItems="center" spacing={1}>
									<Typography variant="h6">{`${usuario.nombre} ${usuario.apellido}`}</Typography>
								</Stack>
								<br />
								<Stack spacing={1}>
									<UserInfoText>
										<PersonOutlineOutlinedIcon />
										<Typography variant="body1">Hombre</Typography>
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
									<UserInfoText>
										<LocationIcon />
										<Typography variant="body1">Gral Artigas</Typography>
									</UserInfoText>
									{usuario.usuario && (
										<UserInfoText>
											<CheckOutlinedIcon />
											<Typography variant="body1">Tiene cuenta</Typography>
										</UserInfoText>
									)}
								</Stack>
							</Paper>
						</Grid>
						<Grid item xs={12} lg={8}>
							<Stack direction="column" spacing={2}>
								<Table title="Pedidos" data={[]} columns={[]} totalRows={1} onPageChange={() => null} />
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
