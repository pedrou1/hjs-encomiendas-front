import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Registrar from './pages/Registrar';
import NavBar from './components/NavBar';
import IniciarSesion from './pages/IniciarSesion';

function App() {
	return (
		<div className="App">
			<NavBar />
			<Routes>
				<Route path="/" exact element={<Registrar />} />
				<Route path="/iniciar-sesion" exact element={<IniciarSesion />} />
			</Routes>
		</div>
	);
}

export default App;
