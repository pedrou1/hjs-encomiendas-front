import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import RegistrarUsuario from './pages/usuarios/RegistrarUsuario';
import NavBar from './components/NavBar';
import IniciarSesion from './pages/usuarios/IniciarSesion';
import Usuarios from './pages/usuarios/Usuarios';
import ProtectedRoute from './pages/common/ProtectedRoute';
import * as Constantes from './utils/Constantes';
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
				{usuario?.idCategoria == Constantes.PERMISO_ADMINISTRADOR ? <Sidebar /> : <></>}
				<Routes>
					<Route path="/" exact element={<RegistrarUsuario />} />
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
