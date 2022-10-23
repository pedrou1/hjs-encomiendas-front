import { estados } from './constantes';

export const columnasPedidos = [
	{
		name: 'Chofer',
		selector: (row) => `${row.chofer.nombre} ${row.chofer.apellido}`,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Cliente',
		selector: (row) => `${row.cliente.nombre} ${row.cliente.apellido}`,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Unidad',
		selector: (row) => row.transporte.nombre,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Estado',
		selector: (row) => row.estado,
		sortable: false,
		grow: 1,
		cell: (row) => <div>{row.estado && row.estado != 0 ? estados.find((e) => e.value === row.estado)?.label : ''}</div>,
	},
	{
		name: 'Tipo',
		selector: (row) => row.tipoPedido.nombre,
		sortable: false,
		grow: 1,
	},
	{
		name: 'Dirección',
		selector: (row) => row?.nombreDireccion,
		sortable: false,
		grow: 1,
		cell: (row) => (row?.nombreDireccion ? row.nombreDireccion.substring(0, 35) + `${row.nombreDireccion.length > 35 ? '...' : ''}` : <div>-</div>),
	},
	{
		name: 'Fecha',
		selector: (row) => row?.fechaCreacion,
		sortable: false,
		grow: 0.7,
		cell: (row) =>
			row?.fechaCreacion ? (
				`${new Date(row.fechaCreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric' })}`
			) : (
				<div>-</div>
			),
	},
];

export const columnasUsuarios = [
	{
		name: 'Nombre/Razón Social',
		selector: (row) => row.nombre,
		sortable: false,
		grow: 1.3,
		cell: (row) => <div>{row.nombre}</div>,
	},
	{
		name: 'Apellido',
		selector: (row) => (row?.ci ? row?.apellido : '-'),
		sortable: false,
		grow: 1,
	},
	{
		name: 'Ci/Rut',
		selector: (row) => (row?.ci ? row?.ci : row?.rut),
		sortable: false,
		grow: 1,
	},
	{
		name: 'Teléfono',
		selector: (row) => row.telefono,
		sortable: false,
		grow: 1,
		cell: (row) => (row.telefono ? row.telefono : <div>-</div>),
	},
	{
		name: 'Email',
		selector: (row) => row.email,
		sortable: false,
		grow: 1,
		cell: (row) => (row.email ? row.email : <div>-</div>),
	},
	{
		name: 'Usuario',
		selector: (row) => row.usuario,
		sortable: false,
		grow: 1.5,
	},
	{
		name: 'Tipo',
		selector: (row) => row?.categoriaUsuario?.nombre,
		sortable: false,
		grow: 1,
		cell: (row) => (row?.categoriaUsuario?.nombre ? row?.categoriaUsuario?.nombre : <div>-</div>),
	},
	{
		name: 'Dirección',
		selector: (row) => row?.direccion,
		sortable: false,
		grow: 1,
		cell: (row) => (row?.direccion ? row?.direccion.substring(0, 30) : <div>-</div>),
	},
];
