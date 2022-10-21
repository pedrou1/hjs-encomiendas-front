import http from '../services/httpService';

const url = process.env.REACT_APP_API_URL + 'api/unidadtransporte';

export const obtenerUnidades = async (params) => {
	try {
		const res = await http.get(`${url}`, { params });
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerUnidad = async (idUnidad) => {
	try {
		const res = await http.get(`${url}/${idUnidad}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const eliminarUnidad = async (idUnidad) => {
	try {
		console.log(idUnidad);
		const res = await http.delete(`${url}/${idUnidad}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const registrarUnidad = async (unidad) => {
	try {
		const res = await http.post(url + '/crear', unidad);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const modificarUnidad = async (unidad) => {
	try {
		const res = await http.post(url + '/modificar', unidad);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const otenerUnidadDeChofer = async (idChofer) => {
	try {
		const res = await http.get(`${url}/chofer/${idChofer}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};
