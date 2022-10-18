import axios from 'axios';
import { toast } from 'react-toastify';
import * as authService from '../services/AuthService';

axios.defaults.headers.common['Authorization'] = `Bearer ${authService.getJwt()}`;

axios.interceptors.response.use(null, (error) => {
	const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

	if (!expectedError) {
		toast.error('Ha ocurrido un error con su conexión');
	}
	// window.location = '/error';
	console.log(error.response);
	return Promise.reject(error);
});

export default {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete,
};
