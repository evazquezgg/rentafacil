/* ============================================================
   CONFIGURACIÓN DEL NEGOCIO — RentaFácil
   Cambia AQUÍ tus datos y todo el sitio se actualiza solo.
   ============================================================ */
window.RF_CONFIG = {
  /* WhatsApp: código de país + número, SIN espacios ni símbolos.
     Ejemplo México: "5215512345678"  (el 1 es para celulares) */
  whatsapp: "525500000000",

  /* Número tal como quieres que se vea en el sitio */
  telefono: "55 0000 0000",

  /* Local */
  direccion: "Av. Principal 123, Centro",
  ciudad: "Tu Ciudad",
  estado: "Edomex",
  codigoPostal: "50000",
  zonaEntrega: "Tu ciudad y alrededores",

  /* Horarios */
  horarioEntreSemana: "Lun a Sáb · 8:00 a 19:00",
  horarioDomingo: "Domingo · 9:00 a 14:00",
  horarioCorto: "Lun–Sáb 8:00 a 19:00 · Dom 9:00 a 14:00"
};

(function () {
  "use strict";

  var cfg = window.RF_CONFIG;
  if (!document.getElementById || !cfg) return;

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function fill() {
    /* Barra superior */
    setText(
      "js-topbar",
      "Abrimos " + cfg.horarioEntreSemana.toLowerCase() + " y " +
        cfg.horarioDomingo.toLowerCase() +
        " · Entrega a domicilio con costo según distancia"
    );

    /* Tarjeta de contacto */
    setText("js-phone", cfg.telefono);
    setText("js-address", cfg.direccion + ", " + cfg.ciudad);
    setText("js-hours", cfg.horarioEntreSemana + "<br>" + cfg.horarioDomingo);
    setText("js-zone", cfg.zonaEntrega);

    /* Pie de página */
    var telLink = document.getElementById("js-footer-tel");
    if (telLink) {
      telLink.setAttribute("href", "tel:+" + cfg.whatsapp);
      telLink.textContent = cfg.telefono;
    }
    setText("js-footer-address", cfg.direccion + ", " + cfg.ciudad);
    setText("js-footer-hours", cfg.horarioCorto);

    /* Datos para Google (JSON-LD) */
    var schema = document.getElementById("json-ld-negocio");
    if (schema) {
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "RentaFácil",
        description: "Renta de herramientas para casa, jardín y obra por día o por semana.",
        telephone: "+" + cfg.whatsapp,
        priceRange: "$110 - $500 por día",
        address: {
          "@type": "PostalAddress",
          streetAddress: cfg.direccion,
          addressLocality: cfg.ciudad,
          addressRegion: cfg.estado,
          postalCode: cfg.codigoPostal,
          addressCountry: "MX"
        },
        openingHours: "Mo-Sa 08:00-19:00, Su 09:00-14:00"
      });
    }

    /* Número disponible para el resto del sitio */
    window.__RF_WHATSAPP = cfg.whatsapp;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fill);
  } else {
    fill();
  }
})();