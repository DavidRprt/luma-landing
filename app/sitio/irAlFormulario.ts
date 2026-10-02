// Lleva hasta el formulario principal y deja el cursor en el primer campo.
// No se usa el ancla "#form" a secas porque en este sitio el scroll vive en el
// body (html/body con overflow-x oculto) y el navegador no siempre la respeta.
export function irAlFormulario() {
  const form = document.getElementById("form");
  if (!form) return;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => form.querySelector<HTMLInputElement>("input[name='nombre']")?.focus({ preventScroll: true }), 450);
}
