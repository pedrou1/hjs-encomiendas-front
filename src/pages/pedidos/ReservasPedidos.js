import { Button, CssBaseline, Box, Container, IconButton, InputLabel, Grid, Typography, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import * as servicioPedidos from '../../services/ServicioPedidos';
import Table from '../../components/Table';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ModalDialog from '../../components/ModalDialog';
import { toast } from 'react-toastify';
import * as Constantes from '../../utils/constantes';
import { columnasPedidos } from '../../utils/columnasTablas';

const ReservasPedidos = () => {
	const [pedidos, setPedidos] = useState([]);
	const [countPedidos, setCountPedidos] = useState(0);
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [globalParams, setGlobalParams] = useState({ PageIndex: 0, PageSize: 10 });
	const navigate = useNavigate();

	useEffect(() => {
		getPedidos();
	}, []);

	const getPedidos = async (newPaginationData) => {
		let params = globalParams;
		if (newPaginationData) {
			params.PageIndex = newPaginationData.PageIndex;
			params.PageSize = newPaginationData.PageSize;
		}

		const { pedidos, totalRows, operationResult } = await servicioPedidos.obtenerPedidosReservados(params);

		setGlobalParams(params);
		setPedidos(pedidos);
		setCountPedidos(totalRows);
		setLoadingFinished(operationResult == 1 ? true : false);
	};

	const onPageChange = async (paginationData) => {
		await getPedidos(paginationData);
	};

	const goToVerPedidos = (pedido) => {
		navigate('/crear-pedido', { state: { pedido: pedido, reserva: true } });
	};

	const columnas = [...columnasPedidos];

	return (
		<Container component="main">
			<Helmet>
				<title>Reservas de pedidos</title>
			</Helmet>
			<CssBaseline />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Table
					data={pedidos}
					columns={columnas}
					totalRows={countPedidos}
					isLoadingFinished={loadingFinished}
					onPageChange={onPageChange}
					onRowClicked={goToVerPedidos}
				>
					<Grid item xs={3} lg={3} className="d-flex justify-content-between">
						<div></div>
						<div className="pt-4" style={{ marginLeft: '5.5rem' }}>
							<h4>Reservas de pedidos</h4>
						</div>
						<div className="align-self-end"></div>
					</Grid>
				</Table>
			</Box>
		</Container>
	);
};

export default ReservasPedidos;
