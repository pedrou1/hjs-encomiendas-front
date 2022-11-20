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
import { columnasUsuarios } from '../../utils/columnasTablas';

const Usuarios = () => {
	const [usuarios, setUsuarios] = useState([]);
	const [countUsuarios, setCountUsuarios] = useState(0);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [filtro, setFiltro] = useState(null);
	const [openFiltros, setOpenFiltros] = useState(null);
	const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
	const [globalParams, setGlobalParams] = useState({ PageIndex: 0, PageSize: 10 });
	const navigate = useNavigate();

	useEffect(() => {
		getUsuarios();
	}, []);

	const getUsuarios = async (newPaginationData, newParams, buscando) => {
		let params = globalParams;
		if (newPaginationData) {
			params.PageIndex = newPaginationData.PageIndex;
			params.PageSize = newPaginationData.PageSize;
		}

		if (newParams != null || newParams != undefined) {
			params.categorias = newParams.categorias;
		} else {
			if (!newPaginationData && !buscando) params.categorias = null;
		}

		if (filtro) params.filters = JSON.stringify(filtro.trim().split(/\s+/));
		else params.filters = undefined;

		const { usuarios, totalRows, operationResult } = await servicioUsuarios.obtenerUsuarios(params);
		setGlobalParams(params);
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

	useEffect(() => {
		getUsuarios(null, null, true);
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
		const categoriasParsed = categoriasSeleccionadas.map((e) => e.value);
		let params = { categorias: null };

		if (categoriasParsed && categoriasParsed.length) {
			params.categorias = JSON.stringify(categoriasParsed);
		}
		getUsuarios(null, params);
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
						style={{ fontSize: '15px', fontFamily: 'PT Sans', marginRight: 14 }}
						component={RouterLink}
						to="/recuperar-usuarios"
					>
						Recuperar usuarios
					</Button>
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
					columns={columnasUsuarios}
					totalRows={countUsuarios}
					isLoadingFinished={loadingFinished}
					onPageChange={onPageChange}
					onRowClicked={goToVerUsuario}
				>
					<Grid item xs={3} lg={3} className="d-flex justify-content-between">
						<div className="px-3 pt-4">
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
						<div className="pt-4" style={{ marginRight: '8.5rem' }}>
							<h4>Usuarios</h4>
						</div>

						<div className="align-self-end">
							<Filtros anchorEl={openFiltros} setAnchorEl={setOpenFiltros}>
								<Typography>Filtros</Typography>
								<InputLabel sx={{ mt: 1 }}>Categorías</InputLabel>

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
												setCategoriasSeleccionadas([]);
												setOpenFiltros(false);
												getUsuarios();
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
					</Grid>
				</Table>
			</Box>
		</Container>
	);
};

export default Usuarios;
