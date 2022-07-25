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

export const registrarUsuario = async (usuario) => {
	try {
		const res = await http.post(url + '/registrar', usuario);
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
