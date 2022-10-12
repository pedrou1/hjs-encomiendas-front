import Chart from 'react-apexcharts';
import { Button, Grid, Typography, Container, Paper, Stack } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioPedidos from '../../services/ServicioPedidos';
import * as servicioUsuarios from '../../services/ServicioUsuarios';

const Estadisticas = () => {
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
		const cantidadP = await servicioPedidos.obtenerCantidadPedidosPorMes();
		setCantidadPedidos([{ ...cantidadPedidos[0], data: cantidadP }]);

		const cantidadC = await servicioUsuarios.obtenerCantidadClientesPorMes();
		setCantidadClientes([{ ...cantidadClientes[0], data: cantidadC }]);
	};

	return (
		<div>
			<Helmet>
				<title>Ver perfil</title>
			</Helmet>
			<Grid item xs={12} lg={4}>
				<Typography variant="h6">Pedidos</Typography>
				<Chart options={options} series={cantidadPedidos} type="bar" width={800} height={320} />
				<Typography variant="h6">Clientes nuevos</Typography>
				<Chart options={options} series={cantidadClientes} type="line" width={800} height={320} />
			</Grid>
		</div>
	);
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
