import React, { useState } from 'react';
import { Drawer, List } from '@mui/material';
import { PeopleAlt as UsersIcon, ListAlt as PedidosIcon, LocalShipping as TransporteIcon, MonetizationOn as GastoIcon, BarChart, Title } from '@mui/icons-material';
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

	{
		id: 2,
		label: 'Tipo de Pedidos',
		link: '/tipos-pedidos',
		icon: <Title />,
	},

	{ id: 3, label: 'Unidades', link: '/unidades', icon: <TransporteIcon /> },
	{ id: 4, label: 'Estadísticas', link: '/estadisticas', icon: <BarChart /> },
	{ id: 5, label: 'Gastos', link: '/gastos', icon: <GastoIcon /> },
];
