import { Button, CssBaseline, Box, Container, Grid, IconButton } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';
import { columnasUsuarios } from '../../utils/columnasTablas';
import AddIcon from '@mui/icons-material/Add';
import ModalDialog from '../../components/ModalDialog';
import { toast } from 'react-toastify';
import * as Constantes from '../../utils/constantes';

const UsuariosEliminados = () => {
	const [usuarios, setUsuarios] = useState([]);
	const [countUsuarios, setCountUsuarios] = useState(0);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

	const [globalParams, setGlobalParams] = useState({ PageIndex: 0, PageSize: 10 });

	useEffect(() => {
		getUsuarios();
	}, []);

	useEffect(() => {
		if (usuarioSeleccionado?.idUsuario) {
			setOpenModal(!openModal);
		}
	}, [usuarioSeleccionado]);

	const getUsuarios = async (newPaginationData) => {
		let params = globalParams;
		if (newPaginationData) {
			params.PageIndex = newPaginationData.PageIndex;
			params.PageSize = newPaginationData.PageSize;
		}

		const { usuarios, totalRows, operationResult } = await servicioUsuarios.obtenerUsuariosEliminados(params);
		setGlobalParams(params);
		setUsuarios(usuarios);
		setCountUsuarios(totalRows);
		setLoadingFinished(operationResult == 1 ? true : false);
	};

	const onPageChange = async (paginationData) => {
		await getUsuarios(paginationData);
	};

	const recuperarUsuario = async () => {
		if (usuarioSeleccionado?.idUsuario) {
			usuarioSeleccionado.password = '';
			const res = await servicioUsuarios.recuperarUsuario(usuarioSeleccionado);
			if (!res) {
				toast.error('Ha ocurrido un error');
			}

			if (res.operationResult == Constantes.SUCCESS) {
				getUsuarios();
				toast.success(`Usuario recuperado correctamente`);
			} else if (res.operationResult == Constantes.ERROR) {
				toast.error('Ha ocurrido un error');
			}
		} else {
			toast.error('Ha ocurrido un error');
		}
		setOpenModal(!openModal);
	};

	const columnas = [
		...columnasUsuarios,
		{
			button: true,
			cell: (row) => (
				<IconButton size="small" color="success" onClick={() => setUsuarioSeleccionado(row)}>
					<AddIcon />
				</IconButton>
			),
		},
	];

	return (
		<Container component="main">
			<Helmet>
				<title>Usuarios eliminados</title>
			</Helmet>
			<CssBaseline />
			<ModalDialog
				open={openModal}
				titulo="Recuperar"
				mensaje={`¿Quieres recuperar el usuario "${usuarioSeleccionado?.nombre + ' ' + usuarioSeleccionado?.apellido}"?`}
				esEliminar={false}
				handleClose={() => {
					setOpenModal(false);
					setTimeout(() => {
						setUsuarioSeleccionado({});
					}, 300);
				}}
				handleAccept={recuperarUsuario}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Table data={usuarios} columns={columnas} totalRows={countUsuarios} isLoadingFinished={loadingFinished} onPageChange={onPageChange}>
					<Grid item xs={3} lg={3} className="d-flex justify-content-between">
						<div className="px-3 pt-4"></div>
						<div className="pt-4" style={{ marginRight: '8.5rem' }}>
							<h4>Usuarios eliminados</h4>
						</div>

						<div className="align-self-end"></div>
					</Grid>
				</Table>
			</Box>
		</Container>
	);
};

export default UsuariosEliminados;
