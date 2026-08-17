/* RentaFácil · Renta de herramientas */
(function () {
  "use strict";

  /* ==========================================================
     CAMBIA AQUÍ TU NÚMERO DE WHATSAPP
     Formato: código de país + número, sin espacios ni símbolos.
     Ejemplo para México: "5215512345678"
     ========================================================== */
  var WHATSAPP_NUMBER = "525500000000";
  var SITE_URL = window.location.href;

function waLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  window.__RF_WHATSAPP = WHATSAPP_NUMBER;

  function toast(message) {
    var el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("toast--show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      el.classList.remove("toast--show");
    }, 2400);
  }

  /* -------- Botones generales de WhatsApp -------- */
  document.querySelectorAll(".js-whatsapp-general").forEach(function (btn) {
    btn.setAttribute(
      "href",
      waLink(
        "Hola RentaFácil, quiero rentar una herramienta. ¿Me pueden ayudar?"
      )
    );
  });

  /* -------- Botones "Rentar ahora" de cada herramienta -------- */
  document.querySelectorAll(".js-rent").forEach(function (btn) {
    var tool = btn.getAttribute("data-tool");
    var price = btn.getAttribute("data-price");
    btn.addEventListener("click", function () {
      window.open(
        waLink(
          "Hola RentaFácil, quiero rentar: " +
            tool +
            " (" +
            price +
            "). ¿Está disponible y para cuándo la puedo apartar?"
        ),
        "_blank",
        "noopener"
      );
    });
  });

  /* -------- Compartir en redes -------- */
  function buildShareText(title) {
    return title + " — " + SITE_URL;
  }

  function openShareWindow(url) {
    window.open(url, "_blank", "noopener,width=640,height=560");
  }

  document.querySelectorAll(".js-share").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var title = btn.getAttribute("data-title") || "RentaFácil · Renta de herramientas por día";
      var text = buildShareText(title);

      if (navigator.share) {
        navigator
          .share({ title: "RentaFácil", text: title, url: SITE_URL })
          .catch(function () {});
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(function () {
            toast("Enlace copiado, listo para pegar donde quieras");
          })
          .catch(function () {
            toast("Copia el enlace de la barra del navegador");
          });
      } else {
        toast("Copia el enlace de la barra del navegador");
      }
    });
  });

  var fbBtn = document.getElementById("js-share-facebook");
  if (fbBtn) {
    fbBtn.setAttribute("href", "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(SITE_URL));
    fbBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openShareWindow(fbBtn.getAttribute("href"));
    });
  }

  var xBtn = document.getElementById("js-share-x");
  if (xBtn) {
    xBtn.setAttribute(
      "href",
      "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent("Renta taladros, podadoras y escaleras por día en RentaFácil") +
        "&url=" +
        encodeURIComponent(SITE_URL)
    );
    xBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openShareWindow(xBtn.getAttribute("href"));
    });
  }

  /* -------- Preguntas frecuentes (acordeón) -------- */
  document.querySelectorAll(".faq__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq__item");
      var wasOpen = item.hasAttribute("data-open");

      document.querySelectorAll(".faq__item[data-open]").forEach(function (openItem) {
        openItem.removeAttribute("data-open");
        openItem.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      });

      if (!wasOpen) {
        item.setAttribute("data-open", "");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* -------- Sombra del menú al hacer scroll -------- */
  var nav = document.getElementById("nav");
  window.addEventListener(
    "scroll",
    function () {
      nav.classList.toggle("nav--scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  /* -------- Año en el pie de página -------- */
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();

/* ==========================================================
   REDISEÑO: efecto 3D, respaldo de fotos y cotizador
   ========================================================== */
(function () {
  "use strict";

  /* -------- Fotos: si una imagen no carga, se muestra su etiqueta -------- */
  document.querySelectorAll(".js-photo").forEach(function (img) {
    img.addEventListener("error", function () {
      var holder = img.closest(".tool__photo") || img.parentElement;
      holder.classList.add("photo-fallback");
      if (img.dataset.name) {
        holder.setAttribute("data-label", img.dataset.name);
      }
      img.remove();
    });
  });

  /* -------- Efecto 3D al mover el ratón -------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var tiltEnabled = !reduceMotion && finePointer;

  if (tiltEnabled) {
    var stage = document.querySelector(".scene__stage");
    var scene = document.querySelector(".scene");

    if (stage && scene) {
      scene.addEventListener("mousemove", function (e) {
        var r = stage.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        stage.classList.add("is-tilting");
        stage.style.transform =
          "rotateY(" + px * 14 + "deg) rotateX(" + -py * 10 + "deg)";
      });
      scene.addEventListener("mouseleave", function () {
        stage.classList.remove("is-tilting");
        stage.style.transform = "";
      });
    }

    document.querySelectorAll(".tool__photo").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add("is-tilting");
        card.style.transform =
          "perspective(700px) rotateY(" + px * 9 + "deg) rotateX(" + -py * 9 + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }

  /* -------- Cotizador (ticket) -------- */
  var form = document.getElementById("quote-form");
  if (form) {
    var toolSelect = document.getElementById("quote-tool");
    var daysEl = document.getElementById("quote-days");
    var minusBtn = document.getElementById("quote-minus");
    var plusBtn = document.getElementById("quote-plus");
    var deliveryBox = document.getElementById("quote-delivery");
    var totalEl = document.getElementById("quote-total");
    var splitEl = document.getElementById("quote-split");
    var numberEl = document.getElementById("ticket-number");
    var sendBtn = document.querySelector(".js-quote-send");

    var DAY_DELIVERY = 80;
    var days = 1;

    function updateTotal() {
      var parts = toolSelect.value.split("|");
      var dayPrice = parseInt(parts[0], 10);
      var weekPrice = parseInt(parts[1], 10);
      var weeks = Math.floor(days / 7);
      var rest = days % 7;
      var total = weeks * weekPrice + rest * dayPrice;
      var split = "por " + days + (days === 1 ? " día" : " días");

      if (weeks > 0) {
        split =
          weeks + " semana" + (weeks > 1 ? "s" : "") +
          (rest > 0 ? " + " + rest + " día" + (rest > 1 ? "s" : "") : "") +
          " (precio de semana aplicado)";
      }
      if (deliveryBox.checked) {
        total += DAY_DELIVERY;
        split += " · incluye entrega a domicilio";
      }

      totalEl.textContent = "$" + total.toLocaleString("es-MX");
      splitEl.textContent = split;

      totalEl.classList.remove("calc");
      void totalEl.offsetWidth;
      totalEl.classList.add("calc");
    }

    function setDays(value) {
      days = Math.min(30, Math.max(1, value));
      daysEl.textContent = days;
      minusBtn.disabled = days <= 1;
      plusBtn.disabled = days >= 30;
      updateTotal();
    }

    plusBtn.addEventListener("click", function () { setDays(days + 1); });
    minusBtn.addEventListener("click", function () { setDays(days - 1); });
    toolSelect.addEventListener("change", updateTotal);
    deliveryBox.addEventListener("change", updateTotal);
    setDays(1);

    sendBtn.addEventListener("click", function () {
      var parts = toolSelect.value.split("|");
      var toolName = parts[2];
      var delivery = deliveryBox.checked ? ", con entrega a domicilio" : "";
      var message =
        "Hola RentaFácil, mi cotización: " +
        toolName +
        ", " +
        days +
        (days === 1 ? " día" : " días") +
        delivery +
        ". Total estimado $" +
        totalEl.textContent.replace("$", "") +
        ". ¿Para cuándo la puedo apartar?";

window.open(
        "https://wa.me/" + (window.__RF_WHATSAPP || "525500000000") + "?text=" + encodeURIComponent(message),
        "_blank",
        "noopener"
      );

      var num = parseInt(numberEl.textContent, 10) + 1;
      numberEl.textContent = num;
    });
  }
})();
