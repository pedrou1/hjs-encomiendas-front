import React, { useState } from 'react';
import { Drawer, List } from '@mui/material';
import {
	PeopleAlt as UsersIcon,
	ListAlt as PedidosIcon,
	LocalShipping as TransporteIcon,
	Map as MapaIcon,
	MonetizationOn as GastoIcon,
	BarChart,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import SidebarLink from './SidebarLink';

function Sidebar() {
	let location = useLocation();
	var [isPermanent, setPermanent] = useState(true);

	return (
		<Drawer
			variant={isPermanent ? 'permanent' : 'temporary'}
			sx={{
				width: 220,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: 220,
					boxSizing: 'border-box',
				},
			}}
		>
			<div style={{ marginTop: 80 }} />
			<List>
				{structure.map((link) => (
					<SidebarLink key={link.id} location={location} isSidebarOpened={true} {...link} />
				))}
			</List>
		</Drawer>
	);
}

export default Sidebar;

const structure = [
	{ id: 0, label: 'Usuarios', link: '/usuarios', icon: <UsersIcon /> },
	{
		id: 1,
		label: 'Pedidos',
		link: '/pedidos',
		icon: <PedidosIcon />,
	},
	{ id: 2, label: 'Unidades', link: '/unidades', icon: <TransporteIcon /> },
	{ id: 3, label: 'Estadísticas', link: '/estadisticas', icon: <BarChart /> },
	{ id: 4, label: 'Gastos', link: '/gastos', icon: <GastoIcon /> },
	{
		id: 5,
		label: 'Direcciones',
		link: '/direcciones',
		icon: <MapaIcon />,
	},
];
