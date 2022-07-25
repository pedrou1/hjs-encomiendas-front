import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material';
import blue from '@mui/material/colors/blue';
import green from '@mui/material/colors/green';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme({
	palette: {
		primary: {
			main: blue[700],
		},
		secondary: {
			main: green[500],
		},
		white: {
			main: '#FFFFFF',
		},
		background: {
			default: '#f7f7f7',
		},
	},
	zIndex: {
		appBar: 1350,
	},
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<ThemeProvider theme={theme}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
