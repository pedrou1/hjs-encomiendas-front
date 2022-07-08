import axios from 'axios';

const url = process.env.REACT_APP_API_URL + 'api/usuario';

export const obtener = async (prop) => {
	try {
		const res = await axios.get(url);
		if (res.status == 200) {
			console.log(res.data);
			return res.data;
		}
	} catch (err) {
		console.log(`ERROR: ${err}`);
	}
};

export const registrarUsuario = async (usuario) => {
	try {
		const res = await axios.post(url + '/registrar', usuario);
		if (res.status == 200) {
			console.log(res.data);
			return res.data;
		}
	} catch (err) {
		console.log(`ERROR: ${err}`);
	}
};

export const iniciarSesion = async (usuario) => {
	try {
		const res = await axios.post(url + '/login', usuario);
		if (res.status == 200) {
			return res.data;
		}
	} catch (err) {
		console.log(`ERROR: ${err}`);
	}
};
