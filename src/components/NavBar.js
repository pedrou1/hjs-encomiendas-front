import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, useMediaQuery, Button, Drawer, List, ListItem, ListItemText, Grid, Box, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

const NavBar = (prop) => {
	const classes = useStyles();
	const [anchor, setAnchor] = useState(null); // expande la navbar movil
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // set media query
	const open = Boolean(anchor);
	const handleMenu = (event) => {
		setAnchor(event.currentTarget);
	};

	return (
		<div className={classes.root}>
			<AppBar style={{ background: '#212121' }}>
				<Toolbar>
					<Typography variant="h5" component="p" color="primary" className={classes.title} style={{ color: 'white' }}>
						HJS Encomiendas
					</Typography>
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
								<IconButton onClick={() => setAnchor(null)} className={classes.menuButton}>
									<CloseIcon />
								</IconButton>
								<div>
									<List>
										<ListItem button component={Link} to={process.env.PUBLIC_URL + '/iniciar-sesion'}>
											<ListItemText primary={'Iniciar sesion'} />
										</ListItem>
										<ListItem button component={Link} to={process.env.PUBLIC_URL + '/'}>
											<ListItemText primary={'Registrarse'} />
										</ListItem>
									</List>
								</div>
							</Drawer>

							<Grid item xs />

							<IconButton color="primary" className={classes.menuButton} edge="end" aria-label="menu" onClick={handleMenu}>
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
									Inicio
								</Button>
							</Box>
							<>
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
							</>
						</>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
};

const useStyles = styled((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		marginRight: theme.spacing(2),
	},
	menu: {
		flex: 1,
	},
	white: {
		color: 'white',
	},
}));

export default NavBar;
