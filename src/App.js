import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrarUsuario from './pages/usuarios/RegistrarUsuario';
import NavBar from './components/NavBar';
import IniciarSesion from './pages/usuarios/IniciarSesion';
import Usuarios from './pages/usuarios/Usuarios';
import ProtectedRoute from './pages/common/ProtectedRoute';
import * as Constantes from './utils/constantes';
import Error from './pages/common/Error';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';
import * as authService from './services/AuthService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CrearEditarUsuario from './pages/usuarios/CrearEditarUsuario';
import VerUsuario from './pages/usuarios/VerUsuario';
import UnidadesTransporte from './pages/unidadesTransporte/UnidadesTransporte';
import CrearEditarUnidad from './pages/unidadesTransporte/CrearEditarUnidad';
import CrearEditarPedido from './pages/pedidos/CrearEditarPedido';
import Pedidos from './pages/pedidos/Pedidos';
import Estadisticas from './pages/estadisticas/Estadisticas';
import CrearEditarTipoPedido from './pages/tipoPedidos/CrearEditarTipoPedido';
import TiposPedidos from './pages/tipoPedidos/TiposPedidos';
import Gastos from './pages/gastos/Gastos';
import CrearEditarGasto from './pages/gastos/CrearEditarGasto';

function App() {
	const [usuario, setUsuario] = useState(null);
	AOS.init();

	useEffect(() => {
		const usuario = authService.getCurrentUser();
		setUsuario(usuario);
	}, []);

	return (
		<div className="App">
			<Box sx={{ display: 'flex' }}>
				<NavBar usuario={usuario} />
				{usuario?.permiso == Constantes.PERMISO_ADMINISTRADOR ? <Sidebar /> : <></>}
				<Routes>
					<Route path="/" element={<Navigate replace to="/iniciar-sesion" />} />
					<Route path="/registrar" exact element={<RegistrarUsuario />} />
					<Route path="/iniciar-sesion" exact element={<IniciarSesion />} />
					<Route path="/error" exact element={<Error />} />
					<Route
						path="/usuarios"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<Usuarios />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/crear-usuario"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<CrearEditarUsuario />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/usuario/:idUsuario"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<VerUsuario />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/unidades"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<UnidadesTransporte />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/crear-unidad"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<CrearEditarUnidad />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/pedidos"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<Pedidos />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/crear-pedido"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<CrearEditarPedido />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/estadisticas"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<Estadisticas />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/crear-editar-pedido"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<CrearEditarTipoPedido />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/tipos-pedidos"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<TiposPedidos />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/gastos"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<Gastos />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/crear-editar-gasto"
						exact
						element={
							<ProtectedRoute permiso={Constantes.PERMISO_ADMINISTRADOR}>
								<CrearEditarGasto />
							</ProtectedRoute>
						}
					/>
				</Routes>
				<ToastContainer
					position="bottom-center"
					autoClose={3000}
					transition={Zoom}
					hideProgressBar={true}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</Box>
		</div>
	);
}

export default App;
