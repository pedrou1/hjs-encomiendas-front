import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import RegistrarUsuario from './pages/RegistrarUsuario';
import NavBar from './components/NavBar';
import IniciarSesion from './pages/IniciarSesion';
import Usuarios from './pages/Usuarios';
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
				<Sidebar />
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
