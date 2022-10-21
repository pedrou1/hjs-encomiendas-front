import { Button, CssBaseline, Box, Container, TextField, Grid, Typography, InputLabel } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import Table from '../../components/Table';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Select from 'react-select';
import Filtros from './../../components/Filtros';
import * as Constantes from '../../utils/constantes';

const Usuarios = () => {
	const [usuarios, setUsuarios] = useState([]);
	const [countUsuarios, setCountUsuarios] = useState(0);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [filtro, setFiltro] = useState(null);
	const [openFiltros, setOpenFiltros] = useState(null);
	const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([Constantes.categoriasUsuarios[0]]);
	const navigate = useNavigate();

	useEffect(() => {
		getUsuarios();
	}, []);

	const getUsuarios = async (newPaginationData) => {
		if (newPaginationData) setPaginationData(newPaginationData);
		const { usuarios, totalRows, operationResult } = await servicioUsuarios.obtenerUsuarios(newPaginationData || paginationData);
		setUsuarios(usuarios);
		setCountUsuarios(totalRows);
		setLoadingFinished(operationResult == 1 ? true : false);
	};

	const onPageChange = async (paginationData) => {
		await getUsuarios(paginationData);
	};

	const goToVerUsuario = (row) => {
		navigate(`/usuario/${row.idUsuario}`);
	};

	const getUsuariosBusqueda = async () => {
		const params = paginationData;

		if (filtro) params.filters = JSON.stringify(filtro.trim().split(/\s+/));
		else params.filters = undefined;
		const { usuarios, totalRows, operationResult } = await servicioUsuarios.obtenerUsuarios(paginationData);

		setUsuarios(usuarios);
		setCountUsuarios(totalRows);
		setLoadingFinished(operationResult == 1 ? true : false);
	};

	useEffect(() => {
		getUsuariosBusqueda();
	}, [filtro]);

	const customStyles = {
		option: (provided, state) => {
			return {
				...provided,
				color: 'black',
				zIndex: 9999,
			};
		},
	};

	const handleFiltrar = async () => {
		// const categoriasParsed = categoriasSeleccionadas.map((e) => e.value);
		// getPedidos(null, categoriasParsed);
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
					data={usuarios}
					columns={columnas}
					totalRows={countUsuarios}
					isLoadingFinished={loadingFinished}
					onPageChange={onPageChange}
					onRowClicked={goToVerUsuario}
				>
					<Grid item xs={3} lg={3} className="d-flex justify-content-between">
						<div className="px-3 pt-3">
							<TextField
								id="input-with-icon-textfield"
								value={filtro}
								onChange={(e) => {
									setFiltro(e.target.value);
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
								variant="standard"
							/>
						</div>
						<div className="pt-3">
							<h4>Usuarios</h4>
						</div>

						<div className="align-self-end">
							<Filtros anchorEl={openFiltros} setAnchorEl={setOpenFiltros}>
								<Typography>Filtros</Typography>
								<InputLabel sx={{ mt: 2 }}>Categoria</InputLabel>

								<Select
									menuPortalTarget={document.querySelector('.MuiPaper-elevation')}
									value={categoriasSeleccionadas}
									isMulti
									options={Constantes.categoriasUsuarios}
									onChange={(e) => setCategoriasSeleccionadas(e)}
									styles={customStyles}
									noOptionsMessage={() => 'No hay mas datos'}
									placeholder={''}
								/>

								<Button
									onClick={() => {
										handleFiltrar();
										setOpenFiltros(false);
									}}
									disabled={!categoriasSeleccionadas.length}
									variant="contained"
									className="mt-2"
									style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
								>
									Filtrar
								</Button>
							</Filtros>
						</div>
					</Grid>
				</Table>
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
	{
		name: 'Tipo',
		selector: (row) => row?.categoriaUsuario?.nombre,
		sortable: true,
		grow: 1,
		cell: (row) => (row?.categoriaUsuario?.nombre ? row?.categoriaUsuario?.nombre : <div>-</div>),
	},
	{
		name: 'Dirección',
		selector: (row) => row?.direccion,
		sortable: true,
		grow: 1,
		cell: (row) => (row?.direccion ? row?.direccion.substring(0, 30) : <div>-</div>),
	},
];
