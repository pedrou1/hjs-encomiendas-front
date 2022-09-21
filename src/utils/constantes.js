export const ERROR = 0;
export const SUCCESS = 1;
export const ALREADYEXIST = 2;
export const INVALIDUSER = 3;

export const USUARIO = 'usuario';

export const PERMISO_ADMINISTRADOR = 1;
export const PERMISO_CHOFER = 2;

export const ID_CLIENTE = 1;
export const ID_CHOFER = 2;
export const ID_ADMINISTRADOR = 3;

export const tipoPedido = 
[
    {  
        value : 1, 
        label: 'Carta',
        pesoDesde: 0,
        pesoHasta: 0,
        cubicajeDesde: 0,
        cubicajeHasta: 0,
        tarifa: 5000
    },

    {  
        value : 2, 
        label: 'Sobre',
        pesoDesde: 0,
        pesoHasta: 0,
        cubicajeDesde: 0,
        cubicajeHasta: 0,
        tarifa: 9000
    },

    {  
        value : 3,
        label: 'Tipo 1 - Pequeño',
        pesoDesde: 0,
        pesoHasta: 0,
        cubicajeDesde: 0,
        cubicajeHasta: 0,
        tarifa: 55000
    },

    {  
        value : 4, 
        label: 'Tipo 2 - Mediano',
        pesoDesde: 0,
        pesoHasta: 0,
        cubicajeDesde: 0,
        cubicajeHasta: 0,
        tarifa: 5000
    },
    
    {  
        // idTipoPedido : 5, nombre: 'Tipo 3 - Grande',
        value : 5,
        label: 'Tipo 3 - Grande',
        pesoDesde: 0,
        pesoHasta: 0,
        cubicajeDesde: 0,
        cubicajeHasta: 0,
        tarifa: 5000
    },

    {  
        value : 5, 
        label: 'Productos',
        pesoDesde: 0,
        pesoHasta: 0,
        cubicajeDesde: 0,
        cubicajeHasta: 0,
        tarifa: 5000
    },

    {  
        value : 5, 
        label: 'Cotizar',
        pesoDesde: 0,
        pesoHasta: 0,
        cubicajeDesde: 0,
        cubicajeHasta: 0,
        tarifa: 5000
    },
]