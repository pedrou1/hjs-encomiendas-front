import { CssBaseline, Box, Typography, Container } from '@mui/material';
import { Helmet } from 'react-helmet';
import ErrorIcon from '@mui/icons-material/WarningAmber';

const Error = () => {
	return (
		<Container component="main">
			<Helmet>
				<title>Ha ocurrido un error</title>
			</Helmet>
			<CssBaseline />
			<Box
				sx={{
					marginTop: 10,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<ErrorIcon sx={{ fontSize: 100, color: 'red' }} />
				<Typography component="h1" variant="h5">
					Ha ocurrido un error. Ponte en contacto con el administrador
				</Typography>
			</Box>
		</Container>
	);
};

export default Error;
