import { estados } from './constantes';

export const columnasPedidos = [
	{
		name: 'Chofer',
		selector: (row) => `${row.chofer.nombre} ${row.chofer.apellido}`,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Cliente',
		selector: (row) => `${row.cliente.nombre} ${row.cliente.apellido}`,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Unidad',
		selector: (row) => row.transporte.nombre,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Estado',
		selector: (row) => row.estado,
		sortable: true,
		grow: 1,
		cell: (row) => <div>{estados[row.estado].label}</div>,
	},
];
