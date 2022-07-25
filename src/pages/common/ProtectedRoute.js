import React from 'react';
import { Navigate } from 'react-router-dom';
import * as auth from '../../services/AuthService';

const ProtectedRoute = ({ permiso, children }) => {
	const usuarioAuthed = auth.getCurrentUser();

	if (usuarioAuthed && permiso) {
		if (usuarioAuthed?.permiso === permiso) {
			return children;
		}
		//return sin permiso
	}

	return <Navigate to="/iniciar-sesion" />;
};

export default ProtectedRoute;
