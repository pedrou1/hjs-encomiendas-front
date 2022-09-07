import Chart from 'react-apexcharts';
import { Button, Grid, Typography, Container, Paper, Stack } from '@mui/material';
import { Helmet } from 'react-helmet';

const Estadisticas = () => {
	return (
		<div>
			<Helmet>
				<title>Ver perfil</title>
			</Helmet>
			<Grid item xs={12} lg={4}>
				<Typography variant="h6">Pedidos</Typography>
				<Chart options={options} series={series} type="bar" width={800} height={320} />
				<Typography variant="h6">Clientes nuevos</Typography>
				<Chart options={options} series={series} type="line" width={800} height={320} />
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
};

const series = [
	{
		name: 'Pedidos',
		data: [0, 0, 0, 30, 40, 35, 50, 49, 60, 70, 91, 125],
	},
];
