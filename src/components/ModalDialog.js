import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

export default function ModalDialog({ open, handleClose, handleAccept, titulo, mensaje, esEliminar }) {
	return (
		<div>
			<Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">{titulo}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">{mensaje}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" className="" onClick={handleClose}>
						Cancelar
					</Button>

					{esEliminar ? (
						<Button variant="contained" color="error" onClick={handleAccept} autoFocus>
							Eliminar
						</Button>
					) : (
						<Button variant="outlined" onClick={handleAccept} autoFocus>
							Aceptar
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
}
