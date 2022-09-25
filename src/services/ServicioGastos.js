import http from '../services/httpService';

const url = process.env.REACT_APP_API_URL + 'api/gastos';

export const obtenerGastos = async (params) => {
	try {
		const res = await http.get(`${url}`, { params });
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerGasto = async (idGasto) => {
	try {
		const res = await http.get(`${url}/${idGasto}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const eliminarGasto = async (idGasto) => {
	try {
		console.log(idGasto);
		const res = await http.delete(`${url}/${idGasto}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const registrarGasto = async (gasto) => {
	console.log(gasto);
	try {
		const res = await http.post(url + '/crear', gasto);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const modificarGasto = async (gasto) => {
	try {
		const res = await http.post(url + '/modificar', gasto);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};
