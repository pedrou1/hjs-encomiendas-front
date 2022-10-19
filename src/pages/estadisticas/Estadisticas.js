import Chart from 'react-apexcharts';
import { Button, Grid, Typography, Container, Paper, CssBaseline, Box, } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioPedidos from '../../services/ServicioPedidos';
import * as servicioUsuarios from '../../services/ServicioUsuarios';
import { defaultStyles } from '../../utils/defaultStyles';
import CircularProgress from '@mui/material/CircularProgress';

const Estadisticas = () => {
	const [loading, setLoading] = useState(false);
	//create state series
	const [cantidadPedidos, setCantidadPedidos] = useState([
		{
			name: 'Pedidos',
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		},
	]);
	const [cantidadClientes, setCantidadClientes] = useState([
		{
			name: 'Clientes',
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		},
	]);

	useEffect(() => {
		obtenerCantidadPedidos();
	}, []);

	const obtenerCantidadPedidos = async () => {
		setLoading(true)
		const cantidadP = await servicioPedidos.obtenerCantidadPedidosPorMes();
		setCantidadPedidos([{ ...cantidadPedidos[0], data: cantidadP }]);

		const cantidadC = await servicioUsuarios.obtenerCantidadClientesPorMes();
		setCantidadClientes([{ ...cantidadClientes[0], data: cantidadC }]);
		setLoading(false)
	};

	return (
		<Container component="main">
			<Helmet>
				<title>Ver perfil</title>
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
			<Grid className='align-items-center d-flex flex-column'>
				<>
				<Typography variant="h6">Pedidos</Typography>
				<Chart options={options} series={cantidadPedidos} type="bar" width={800} height={320} />

				{loading ? <div className='mb-1'><CircularProgress /></div> : 	<Typography variant="h6">Clientes nuevos</Typography>}

				<Chart options={options} series={cantidadClientes} type="line" width={800} height={320} />
				</>
			</Grid></Box></Paper>
			</Container>
	)
};
export default Estadisticas;

const options = {
	chart: {
		id: 'apexchart-example',
		toolbar: {
			show: false,
		},
	},
	xaxis: {
		categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	},
	yaxis: [
		{
			labels: {
				formatter: function (val) {
					return val.toFixed(0);
				},
			},
		},
	],
};

const series = [
	{
		name: 'Pedidos',
		data: [0, 0, 0, 30, 40, 35, 50, 49, 60, 70, 91, 125],
	},
];
