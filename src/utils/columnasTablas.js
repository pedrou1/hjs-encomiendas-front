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
		name: 'Peso',
		selector: (row) => row.peso,
		sortable: true,
		grow: 1.1,
	},
	{
		name: 'Tamaño',
		selector: (row) => row.tamaño,
		sortable: true,
		grow: 1.1,
		cell: (row) => <div>{row.tamaño + ' m2'}</div>,
	},
	{
		name: 'Tarifa',
		selector: (row) => row.tarifa,
		sortable: true,
		grow: 1.2,
	},
	{
		name: 'Estado',
		selector: (row) => row.estado,
		sortable: true,
		grow: 1,
		cell: (row) => <div>{row.estado === 1 ? 'Pendiente' : 'Finalizado'}</div>,
	},
];
