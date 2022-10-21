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
		cell: (row) => <div>{row.estado && row.estado != 0 ? estados.find((e) => e.value === row.estado)?.label : ''}</div>,
	},
	{
		name: 'Tipo',
		selector: (row) => row.tipoPedido.nombre,
		sortable: true,
		grow: 1,
	},
	{
		name: 'Dirección',
		selector: (row) => row?.nombreDireccion,
		sortable: true,
		grow: 1,
		cell: (row) => (row?.nombreDireccion ? row.nombreDireccion.substring(0, 35) + `${row.nombreDireccion.length > 35 ? '...' : ''}` : <div>-</div>),
	},
];
