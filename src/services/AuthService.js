import * as Constantes from '../utils/Constantes';

export function getJwt() {
	return localStorage.getItem(Constantes.USUARIO) ? JSON.parse(localStorage.getItem(Constantes.USUARIO)).token : null;
}

export function setLoggedIn(jwtToken, usuario) {
	const loggedIn = { token: jwtToken, usuario: usuario };
	localStorage.setItem(Constantes.USUARIO, JSON.stringify(loggedIn));
}

export function logout() {
	localStorage.removeItem(Constantes.USUARIO);
}

export function getCurrentUser() {
	const loggedIn = localStorage.getItem(Constantes.USUARIO);

	if (loggedIn) {
		return JSON.parse(loggedIn).usuario;
	}
	return null;
}
