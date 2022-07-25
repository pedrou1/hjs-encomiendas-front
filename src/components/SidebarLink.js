import React from 'react';
import { Divider, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function SidebarLink({ link, icon, label, location, nested, type }) {
	const classes = useStyles();
	var isLinkActive = (link && location.pathname === link) || location.pathname.indexOf(link) !== -1;

	if (type === 'title') return <Typography>{label}</Typography>;

	if (type === 'divider') return <Divider />;

	return (
		<ListItem button component={link && Link} to={link} style={isLinkActive && !nested ? classes.buttonActive : null} disableRipple>
			<ListItemIcon>{icon}</ListItemIcon>
			<ListItemText primary={label} />
		</ListItem>
	);
}

const useStyles = () => ({
	buttonActive: {
		color: '#0a58ca',
		backgroundColor: 'rgba(0, 0, 0, 0.04)',
	},
});
