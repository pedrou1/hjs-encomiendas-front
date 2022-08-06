import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, useMediaQuery, Button, Drawer, List, ListItem, ListItemText, Grid, Box, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import * as authService from '../services/AuthService';

const NavBar = ({ usuario }) => {
	const classes = useStyles();
	const [anchor, setAnchor] = useState(null); // expande la navbar movil
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // set media query
	const open = Boolean(anchor);
	const handleMenu = (event) => {
		setAnchor(event.currentTarget);
	};

	const cerrarSesion = () => {
		authService.logout();
		window.location.reload();
	};

	return (
		<div className={classes.root}>
			<AppBar style={{ background: '#212121' }}>
				<Toolbar>
					{isMobile ? ( // abre la navbar movil
						<>
							<Drawer
								variant="temporary"
								anchor={theme.direction === 'lrt' ? 'left' : 'right'}
								open={open}
								ModalProps={{
									keepMounted: true,
								}}
							>
								<IconButton onClick={() => setAnchor(null)}>
									<CloseIcon />
								</IconButton>
								<div>
									<List>
										{!usuario && (
											<ListItem button component={Link} to={process.env.PUBLIC_URL + '/iniciar-sesion'}>
												<ListItemText primary={'Iniciar sesion'} />
											</ListItem>
										)}
										<ListItem button component={Link} to={process.env.PUBLIC_URL + '/'}>
											<ListItemText primary={'Registrarse'} />
										</ListItem>
									</List>
								</div>
							</Drawer>

							<Grid item xs />

							<IconButton color="primary" edge="end" aria-label="menu" onClick={handleMenu}>
								<MenuIcon className={classes.white} />
							</IconButton>
						</>
					) : (
						<>
							<Box display="flex" flexGrow={1}>
								<Button
									variant="text"
									color="white"
									className={classes.white}
									style={{ fontSize: '22px', fontFamily: 'PT Sans' }}
									component={Link}
									to={process.env.PUBLIC_URL + '/'}
									onClick={() => setAnchor(null)}
								>
									HJS Encomiendas
								</Button>
							</Box>
							<>
								<>
									{usuario ? (
										<>
											<Button
												startIcon={<PersonIcon />}
												variant="text"
												color="white"
												component={Link}
												className={classes.white}
												style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
												onClick={() => setAnchor(null)}
												to={`/usuario/${usuario.idUsuario}`}
											>
												{usuario.usuario}
											</Button>
											<Button
												variant="text"
												color="white"
												component={Link}
												className={classes.white}
												style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
												onClick={() => {
													setAnchor(null);
													cerrarSesion();
												}}
												to={process.env.PUBLIC_URL + '/cerrar-sesion'}
											>
												SALIR
											</Button>
										</>
									) : (
										<>
											<Button
												variant="text"
												color="white"
												component={Link}
												className={classes.white}
												style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
												onClick={() => setAnchor(null)}
												to={process.env.PUBLIC_URL + '/iniciar-sesion'}
											>
												Iniciar sesion
											</Button>
											<Button
												variant="text"
												color="white"
												component={Link}
												className={classes.white}
												style={{ fontSize: '15px', fontFamily: 'PT Sans' }}
												onClick={() => setAnchor(null)}
												to={process.env.PUBLIC_URL + '/'}
											>
												Registrarse
											</Button>
										</>
									)}
								</>
							</>
						</>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
};

const useStyles = () => ({
	root: {
		flexGrow: 1,
	},
	menu: {
		flex: 1,
	},
	white: {
		color: 'white',
	},
});

export default NavBar;
