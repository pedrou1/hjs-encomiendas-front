import http from '../services/httpService';

const url = process.env.REACT_APP_API_URL + 'api/pedido';

export const obtenerPedidos = async (params) => {
	try {
		const res = await http.get(`${url}`, { params });
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerPedidosReservados = async (params) => {
	try {
		const res = await http.get(`${url}/reservados`, { params });
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerPedido = async (idPedido) => {
	try {
		const res = await http.get(`${url}/${idPedido}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const obtenerCantidadPedidosPorMes = async (anio = 0) => {
	try {
		const res = await http.get(`${url}/por-mes/${anio}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const eliminarPedido = async (idPedido) => {
	try {
		const res = await http.delete(`${url}/${idPedido}`);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const registrarPedido = async (pedido) => {
	try {
		const res = await http.post(url + '/crear', pedido);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};

export const modificarPedido = async (pedido) => {
	try {
		const res = await http.put(url + '/modificar', pedido);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {}
};
