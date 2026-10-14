// Promo del plan que elegimos en el análisis: se muestra en la cinta y en la tarjeta. El cobro con descuento se arma a mano
// con scripts/mp-suscripcion.mjs cuando el cliente cierra por WhatsApp (no hay link de pago automático para la promo).
export const PROMO = { pct: 30, meses: 3 };

const aNumero = (precio: string) => Number(precio.replace(/\./g, ""));
export const precioPromo = (precio: string) => Math.round(aNumero(precio) * (1 - PROMO.pct / 100)).toLocaleString("es-AR");
