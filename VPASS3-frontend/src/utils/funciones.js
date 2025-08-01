import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/es' // Para español
import { CommonAreaMode, idReservacionTipoReserva, idReservacionTipoUso, opcionesReservacionEspacioComun } from './constantes'

// Activar plugin
dayjs.extend(localizedFormat)
dayjs.locale('es') // Establecer el idioma



/**
 * Cambia una fecha ISO a formato legible en español (Chile)
 * Ej: "2025-05-07T16:49:16.0044431" → "7 de mayo de 2025 16:49"
 */
export function cambiarFormatoHoraFecha(fechaISO) {
  if (!fechaISO) return '';
  return dayjs(fechaISO).format('LL HH:mm')
}


export const obtenerClaimsToken = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadJson);
  } catch (error) {
      return null;
  }
}

/**
 * Compara si la primera fecha es menor o igual a la segunda.
 * @param {string} fecha1 - Fecha en formato 'YYYY-MM-DD'
 * @param {string} fecha2 - Fecha en formato 'YYYY-MM-DD'
 * @returns {boolean} true si fecha1 <= fecha2, false si fecha1 > fecha2
 */
export function esFechaMenorOIgual(fecha1, fecha2) {
    const d1 = dayjs(fecha1);
    const d2 = dayjs(fecha2);

    if (!d1.isValid() || !d2.isValid()) return false; // Manejo opcional

    return d1.isBefore(d2) || d1.isSame(d2);
}

/*
  Función que genera un arreglo de objetos con números que van desde 'inicio' hasta 'fin'.
  Si 'inicio' es mayor que 'fin', el rango se genera en orden descendente.
 */
export function generarRango(inicio, fin) {
  const resultado = [];
  const paso = inicio <= fin ? 1 : -1;
  for (let i = inicio; paso > 0 ? i <= fin : i >= fin; i += paso) {
    resultado.push({ id: i, valor: i });
  }
  return resultado;
}

/*
  Función que formatea "horas" y "minutos" a un string con formato "HH:mm:ss".
  Si las horas o minutos son menores a 10, se les agrega un cero al inicio.
*/
export function cambiarAFormatoHoraMinutos(horas, minutos) {
  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(horas)}:${pad(minutos)}:00`;
}


/*
  Función que convierte una cadena de texto con formato "HH:mm:ss" a un string legible.
  Ejemplo: "01:30:00" → "1 hora con 30 minutos"
  formatoLegibleDesdeHoraString("02:53:00"); -> "2 horas con 53 minutos"
  formatoLegibleDesdeHoraString("00:15:00"); -> "15 minutos"
  formatoLegibleDesdeHoraString("01:00:00"); -> "1 hora"
  formatoLegibleDesdeHoraString("00:00:00"); -> "0 minutos"
*/
export function formatoLegibleDesdeHoraString(horaString) {
  if (!horaString || typeof horaString !== 'string') return '';

  const [hh, mm] = horaString.split(':').map(Number);

  const partes = [];
  if (hh > 0) partes.push(`${hh} ${hh === 1 ? 'hora' : 'horas'}`);
  if (mm > 0) partes.push(`${mm} ${mm === 1 ? 'minuto' : 'minutos'}`);

  return partes.length > 0 ? partes.join(' con ') : '0 minutos';
}


/**
 * Transforma una cantidad de horas y minutos en un string con formato tipo TimeSpan ("HH:MM:SS").
 * 
 * @param {number} horas - Número de horas (debe ser 0 o mayor).
 * @param {number} minutos - Número de minutos (debe estar entre 0 y 59).
 * @returns {string|null} - Devuelve un string con formato "HH:MM:00" si los datos son válidos, o string vacío si no lo son.
 * 
 * @example
 * transformarAFormatoTimeSpan(2, 45); // "02:45:00"
 * transformarAFormatoTimeSpan(10, 5); // "10:05:00"
 * transformarAFormatoTimeSpan(3, 60); // "" (minutos inválidos)
 */
export function transformarAFormatoTimeSpan(horas, minutos) {
  // Validar que las entradas sean números y estén en rangos válidos
  if (
    typeof horas !== 'number' ||
    typeof minutos !== 'number' ||
    horas < 0 ||
    minutos < 0 ||
    minutos > 59
  ) {
    return "";
  }

  // Asegurarse de que los valores tengan 2 dígitos (ej: "02" en lugar de "2")
  const horasFormateadas = String(horas).padStart(2, '0');
  const minutosFormateados = String(minutos).padStart(2, '0');

  // Retorna en formato tipo TimeSpan, con segundos fijos en "00"
  return `${horasFormateadas}:${minutosFormateados}:00`;
}





/**
 * Transforma una fecha, una hora y minutos en un string con formato DateTime: "YYYY-MM-DDTHH:MM:00".
 *
 * @param {string} fecha - Fecha en formato "YYYY-MM-DD".
 * @param {number} hora - Hora en formato 24 horas (debe ser entre 0 y 23).
 * @param {number} minutos - Minutos (debe ser entre 0 y 59).
 * @returns {string|null} - Devuelve un string con formato datetime si los valores son válidos, o null si son inválidos.
 *
 * @example
 * transformarAFormatoDateTime("2025-03-03", 1, 40); // "2025-03-03T01:40:00"
 * transformarAFormatoDateTime("2024-12-31", 23, 59); // "2024-12-31T23:59:00"
 * transformarAFormatoDateTime("2025-01-01", 25, 0); // null (hora inválida)
 */
export function transformarAFormatoDateTime(fecha, hora, minutos) {
  // Validar tipos y rangos
  if (
    typeof fecha !== 'string' ||
    typeof hora !== 'number' ||
    typeof minutos !== 'number' ||
    hora < 0 || hora > 23 ||
    minutos < 0 || minutos > 59
  ) {
    return "";
  }

  // Validar formato de la fecha básica (YYYY-MM-DD)
  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fechaRegex.test(fecha)) {
    return "";
  }

  // Formatear hora y minutos con ceros a la izquierda si es necesario
  const horaFormateada = String(hora).padStart(2, '0');
  const minutosFormateados = String(minutos).padStart(2, '0');

  // Construir y retornar el string con formato DateTime
  return `${fecha}T${horaFormateada}:${minutosFormateados}:00`;
}



/**
 * Filtra y devuelve las opciones de tipo de reservación disponibles
 * para un espacio común específico, en base a su modo (usable, reservable o ambos).
 * 
 * Esta función utiliza el valor del `mode` de la entidad CommonArea, que se define
 * mediante un enum con flags combinables (bitmask), para determinar qué tipos
 * de reservación pueden mostrarse al usuario.
 *
 * @param {number|string} idEspacioComunSeleccionado - ID del espacio común seleccionado.
 * @param {Array} espaciosComunes - Listado completo de espacios comunes disponibles.
 * @returns {Array} Lista de opciones de tipo de reservación válidas para el espacio seleccionado.
 */

export function getOpcionesTipoReservacionFiltradas(idEspacioComunSeleccionado, espaciosComunes) {
  const espacio = espaciosComunes?.find(
    (e) => e.id === Number(idEspacioComunSeleccionado)
  );

  // Si no se encuentra el espacio seleccionado, devolver array vacío
  if (!espacio) return [];

  const { mode } = espacio;
  const opciones = [];

  // Si el espacio es usable (flag activado), se permite "Uso compartido"
  if ((mode & CommonAreaMode.Usable) === CommonAreaMode.Usable) {
    const opcionUso = opcionesReservacionEspacioComun.find(
      (o) => o.id === idReservacionTipoUso
    );
    if (opcionUso) opciones.push(opcionUso);
  }

  // Si el espacio es reservable (flag activado), se permite "Reserva exclusiva"
  if ((mode & CommonAreaMode.Reservable) === CommonAreaMode.Reservable) {
    const opcionReserva = opcionesReservacionEspacioComun.find(
      (o) => o.id === idReservacionTipoReserva
    );
    if (opcionReserva) opciones.push(opcionReserva);
  }

  return opciones;
}

// Funcion para obtener la fecha y hora de santiago en el momento de la invocacion de la funcion.
// Retorna un string tipo DateTime, algo así como: "2025-06-23T14:25:36"
export function obtenerFechaHoraSantiago() {
    const opciones = {
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const fechaChile = new Intl.DateTimeFormat('en-CA', opciones).format(new Date());
    const [fecha, hora] = fechaChile.split(', ');

    // Esto retorna un objeto Date correctamente formateado
    return new Date(`${fecha}T${hora}`);
}

// Funcion que toma el arreglo de objetos con las reservas exclusivas de un area comun, y retorna el mismo arreglo pero con las reservas que se encuentran activas todavia o no han sucedido
export function filtrarReservasExclusivasActivas(reservas) {
    const ahora = obtenerFechaHoraSantiago();

    return reservas.filter(reserva => {
        const inicio = new Date(reserva.reservationStart);
        const fin = reserva.reservationEnd ? new Date(reserva.reservationEnd) : null;

        // Reserva sin `end`: incluir si empieza ahora o en el futuro
        if (!fin) {
            return inicio >= ahora;
        }

        // Reserva con `end`: incluir si termina ahora o después
        return fin >= ahora;
    });
}

// Funcion que toma el arreglo de objetos con las reservas exclusivas de un area comun, y retorna el mismo arreglo pero con las reservas que ya no se encuentran activas o ya han sucedido
export function filtrarReservasExclusivasFinalizadas(reservas) {
    const ahora = obtenerFechaHoraSantiago();

    return reservas.filter(reserva => {
        const fin = reserva.reservationEnd ? new Date(reserva.reservationEnd) : null;

        // Solo reservas que tienen `end` y ya terminaron
        return fin && fin < ahora;
    });
}

// Funcion que toma el arreglo de objetos con los usos compartidos de un area comun, y retorna el mismo arreglo pero con los usos que se encuentran activos todavia o no han sucedido
export function filtrarUsosCompartidosActivos(usos) {
    const ahora = obtenerFechaHoraSantiago();

    return usos.filter(uso => {
        const inicio = new Date(uso.startTime);
        const fin = uso.endTime ? new Date(uso.endTime) : null;

        // Reserva sin `end`: incluir si empieza ahora o en el futuro
        if (!fin) {
            return inicio >= ahora;
        }

        // Reserva con `end`: incluir si termina ahora o después
        return fin >= ahora;
    });
}

// Funcion que toma el arreglo de objetos con los usos compartidos de un area comun, y retorna el mismo arreglo pero con los usos que se encuentran finalizados
export function filtrarUsosCompartidosFinalizados(usos) {
    const ahora = obtenerFechaHoraSantiago();

    return usos.filter(uso => {
        const fin = uso.endTime ? new Date(uso.endTime) : null;

        // Solo reservas que tienen `end` y ya terminaron
        return fin && fin < ahora;
    });
}

/**
 * Filtra el listado de encomiendas entregadas (retiradas).
 * Esta función recibe un arreglo de encomiendas y devuelve solo aquellas
 * cuyo atributo `deliveredAt` no es nulo ni undefined, es decir, ya han sido retiradas.
 *
 * @param {Array<Object>} encomiendas - Arreglo de objetos de encomiendas.
 * @returns {Array<Object>} - Arreglo filtrado de encomiendas retiradas.
 */
export function filtrarEncomiendasRetiradas(encomiendas) {
  // Se filtran las encomiendas que tienen una fecha de entrega válida (no nula ni undefined)
  return encomiendas.filter(encomienda => encomienda.deliveredAt !== null && encomienda.deliveredAt !== undefined);
}

/**
 * Filtra el listado de encomiendas pendientes de retiro.
 * Esta función recibe un arreglo de encomiendas y devuelve solo aquellas
 * cuyo atributo `deliveredAt` es nulo o undefined, es decir, aún no han sido retiradas.
 *
 * @param {Array<Object>} encomiendas - Arreglo de objetos de encomiendas.
 * @returns {Array<Object>} - Arreglo filtrado de encomiendas pendientes de retiro.
 */
export function filtrarEncomiendasPendientes(encomiendas) {
  // Se filtran las encomiendas que no tienen una fecha de entrega registrada (nula o undefined)
  return encomiendas.filter(encomienda => encomienda.deliveredAt === null || encomienda.deliveredAt === undefined);
}



