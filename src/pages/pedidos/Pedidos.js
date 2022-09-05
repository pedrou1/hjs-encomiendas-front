import { Button, CssBaseline, Box, Container } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioPedidos from '../../services/ServicioPedidos';
import Table from '../../components/Table';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Pedidos = () => {
	const [pedidos, setPedidos] = useState([]);
	const [countPedidos, setCountPedidos] = useState(0);
	const [paginationData, setPaginationData] = useState({ PageIndex: 0, PageSize: 10 });
	const navigate = useNavigate();

	useEffect(() => {
		getPedidos();
	}, []);

	const getPedidos = async (newPaginationData) => {
		if (newPaginationData) setPaginationData(newPaginationData);
		const { pedidos, totalRows } = await servicioPedidos.obtenerPedidos(newPaginationData || paginationData);
		setPedidos(pedidos);
		setCountPedidos(totalRows);
	};

	const onPageChange = async (paginationData) => {
		await getPedidos(paginationData);
	};

	const goToVerPedidos = (pedido) => {
		navigate('/crear-pedido', { state: { pedido: pedido } });
	};
	return (
		<Container component="main">
			<Helmet>
				<title>Pedidos</title>
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
						to="/crear-pedido"
						endIcon={<AddIcon />}
					>
						Crear nuevo
					</Button>
				</div>
				<Table title="Pedidos" data={pedidos} columns={columnas} totalRows={countPedidos} onPageChange={onPageChange} onRowClicked={goToVerPedidos} />
			</Box>
		</Container>
	);
};

export default Pedidos;

const columnas = [
	{
		name: 'Chofer',
		selector: (row) => `${row.chofer.nombre} ${row.chofer.apellido}`,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Cliente',
		selector: (row) => `${row.cliente.nombre} ${row.cliente.apellido}`,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Unidad',
		selector: (row) => row.transporte.nombre,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Peso',
		selector: (row) => row.peso,
		sortable: true,
		grow: 1.1,
	},
	{
		name: 'Tamaño',
		selector: (row) => row.tamaño,
		sortable: true,
		grow: 1.1,
		cell: (row) => <div>{row.tamaño + ' m2'}</div>,
	},
	{
		name: 'Tarifa',
		selector: (row) => row.tarifa,
		sortable: true,
		grow: 1.2,
	},
	{
		name: 'Estado',
		selector: (row) => row.estado,
		sortable: true,
		grow: 1,
		cell: (row) => <div>{row.estado == 1 ? 'Pendiente' : 'Finalizado'}</div>,
	},
];
