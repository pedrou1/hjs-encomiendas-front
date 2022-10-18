import React from 'react';
import { Navigate } from 'react-router-dom';
import * as auth from '../../services/AuthService';

const ProtectedRoute = ({ permisos, children }) => {
	const usuarioAuthed = auth.getCurrentUser();

	if (usuarioAuthed && permisos?.length) {
		if (permisos.includes(usuarioAuthed.permiso)) {
			return children;
		}
		//return sin permiso
		return <Navigate to={'/usuario/' + usuarioAuthed.idUsuario} />;
	}

	return <Navigate to="/iniciar-sesion" />;
};

export default ProtectedRoute;
