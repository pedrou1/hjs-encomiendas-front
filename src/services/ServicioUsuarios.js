import http from '../services/httpService';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL + 'api/usuario';

export const obtenerUsuarios = async (params) => {
	try {
		const res = await http.get(`${url}`, { params });
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerUsuariosEliminados = async (params) => {
	try {
		const res = await http.get(`${url}/eliminados`, { params });
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerUsuariosYCantidadPedidos = async (params) => {
	try {
		const res = await http.get(`${url}/cantidad/pedidos`, { params });
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerUsuario = async (idUsuario) => {
	try {
		const res = await http.get(`${url}/${idUsuario}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerChoferDeReserva = async () => {
	try {
		const res = await http.get(`${url}/choferReserva`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerCantidadClientesPorMes = async (anio = 0) => {
	try {
		const res = await http.get(`${url}/por-mes/${anio}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const eliminarUsuario = async (idUsuario) => {
	try {
		const res = await http.delete(`${url}/${idUsuario}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const registrarUsuario = async (usuario) => {
	try {
		const res = await http.post(url + '/registrar', usuario);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const modificarUsuario = async (usuario) => {
	try {
		const res = await http.post(url + '/modificar', usuario);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const modificarContraUsuario = async (usuario) => {
	try {
		const res = await http.put(url + '/modificar-contrasenia', usuario);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const recuperarUsuario = async (usuario) => {
	try {
		const res = await http.put(url + '/recuperar-usuario', usuario);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const iniciarSesion = async (usuario) => {
	try {
		const res = await axios.post(url + '/login', usuario);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};
