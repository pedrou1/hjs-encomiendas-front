import React, { useState } from 'react';
import { Divider, ListItem, ListItemIcon, ListItemText, Typography, Collapse, List } from '@mui/material';
import { Link } from 'react-router-dom';

export default function SidebarLink({ link, icon, label, location, nested, type, isSidebarOpened, children }) {
	const classes = useStyles();
	var [isOpen, setIsOpen] = useState(false);

	var isLinkActive = (link && location.pathname === link) || location.pathname.indexOf(link) !== -1;

	if (type === 'title') return <Typography>{label}</Typography>;

	if (type === 'divider') return <Divider />;

	function toggleCollapse(e) {
		if (isSidebarOpened) {
			e.preventDefault();
			setIsOpen(!isOpen);
		}
	}

	if (!children)
		return (
			<ListItem button component={link && Link} to={link} style={isLinkActive && !nested ? classes.buttonActive : null} disableRipple>
				<ListItemIcon>{icon}</ListItemIcon>
				<ListItemText primary={label} />
			</ListItem>
		);

	if (children)
		return (
			<>
				<ListItem
					button
					component={link && Link}
					onClick={toggleCollapse}
					to={link}
					style={isLinkActive && !nested ? classes.buttonActive : null}
					disableRipple
				>
					<ListItemIcon>{icon}</ListItemIcon>
					<ListItemText primary={label} />
				</ListItem>

				<Collapse in={isOpen && isSidebarOpened} timeout="auto" unmountOnExit className={classes.nestedList}>
					<List component="div" disablePadding style={{ marginLeft: 10 }}>
						{children.map((childrenLink) => (
							<SidebarLink
								key={childrenLink && childrenLink.link}
								location={location}
								isSidebarOpened={isSidebarOpened}
								classes={classes}
								nested
								{...childrenLink}
							/>
						))}
					</List>
				</Collapse>
			</>
		);
}

const useStyles = () => ({
	buttonActive: {
		color: '#0a58ca',
		backgroundColor: 'rgba(0, 0, 0, 0.04)',
	},
});
