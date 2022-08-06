import { Button, CssBaseline, Box, Container } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioUsuarios from '../services/ServicioUsuarios';
import Table from '../components/Table';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Usuarios = () => {
	const [usuarios, setUsuarios] = useState([]);
	const [countUsuarios, setCountUsuarios] = useState(0);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const navigate = useNavigate();

	useEffect(() => {
		getUsuarios();
	}, []);

	const getUsuarios = async (newPaginationData) => {
		if (newPaginationData) setPaginationData(newPaginationData);
		const { usuarios, totalRows } = await servicioUsuarios.obtenerUsuarios(newPaginationData || paginationData);
		setUsuarios(usuarios);
		setCountUsuarios(totalRows);
	};

	const onPageChange = async (paginationData) => {
		await getUsuarios(paginationData);
	};

	const goToVerUsuario = (row) => {
		navigate(`/usuario/${row.idUsuario}`);
	};

	return (
		<Container component="main">
			<Helmet>
				<title>Usuarios</title>
			</Helmet>
			<CssBaseline />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<div className="align-self-end">
					<Button
						variant="contained"
						style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
						component={RouterLink}
						to="/crear-usuario"
						endIcon={<AddIcon />}
					>
						Crear nuevo
					</Button>
				</div>
				<Table
					title="Usuarios"
					data={usuarios}
					columns={columnas}
					totalRows={countUsuarios}
					onPageChange={onPageChange}
					onRowClicked={goToVerUsuario}
				/>
			</Box>
		</Container>
	);
};

export default Usuarios;

const columnas = [
	{
		name: 'Nombre',
		selector: (row) => row.nombre,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Apellido',
		selector: (row) => row.apellido,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Telefono',
		selector: (row) => row.telefono,
		sortable: true,
		grow: 1,
		cell: (row) => (row.telefono ? row.telefono : <div>-</div>),
	},
	{
		name: 'Email',
		selector: (row) => row.email,
		sortable: true,
		grow: 1,
		cell: (row) => (row.email ? row.email : <div>-</div>),
	},
	{
		name: 'Usuario',
		selector: (row) => row.usuario,
		sortable: true,
		grow: 1.5,
	},
];
