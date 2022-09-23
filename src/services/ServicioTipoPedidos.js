import http from '../services/httpService';

const url = process.env.REACT_APP_API_URL + 'api/tipospedido';

export const obtenerTipoPedidos = async (params) => {
	try {
		const res = await http.get(`${url}`, { params });
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerTipoPedido = async (idTipoPedido) => {
	try {
		const res = await http.get(`${url}/${idTipoPedido}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const eliminarTipoPedido = async (idTipoPedido) => {
	try {
		console.log(idTipoPedido);
		const res = await http.delete(`${url}/${idTipoPedido}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const registrarTipoPedido = async (tipoPedido) => {
	try {
		const res = await http.post(url + '/crear', tipoPedido);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const modificarTipoPedido = async (tipoPedido) => {
	try {
		const res = await http.put(url + '/modificar', tipoPedido);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};
