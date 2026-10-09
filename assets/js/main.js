// Set before launch: real WhatsApp number (digits only, with country code).
const MOVIRA = { whatsapp: "91XXXXXXXXXX" };

document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = `https://wa.me/${MOVIRA.whatsapp}?text=${encodeURIComponent(a.dataset.wa)}`;
  a.target = "_blank"; a.rel = "noopener";
});
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
document.querySelectorAll('input[type="date"]').forEach((d) => { d.min = new Date().toISOString().slice(0, 10); });

const fmtPhone = (v) => {
  const d = (v || "").replace(/\D/g, "");
  if (d.length === 10) return `+91 ${d}`;
  if (d.length === 12 && d.startsWith("91")) return `+${d}`;
  return (v || "").trim();
};

// Enquiry forms: validation, honeypot, then hand-off to WhatsApp.
// Swap the hand-off for a POST to a real backend endpoint when one exists.
document.querySelectorAll(".js-enquiry").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.website.value) return; // bot
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      const bad = form.querySelector("input:invalid, select:invalid, textarea:invalid");
      if (bad) { const more = bad.closest("details"); if (more) more.open = true; bad.focus(); }
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const msg = [
      `New enquiry — Movira (${document.title.split("|")[0].trim()})`,
      `Name: ${d.name}`, `Mobile: ${fmtPhone(d.phone)}`, d.email && `Email: ${d.email}`,
      d.country && `Destination: ${d.country}`, d.neet && `NEET: ${d.neet}`, d.state && `State/city: ${d.state}`,
      d.budget && `Budget: ${d.budget}`, (d.date || d.time) && `Call on: ${[d.date, d.time].filter(Boolean).join(", ")}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${MOVIRA.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    form.classList.add("sent");
    const t = form.querySelector(".thanks-msg"); t.hidden = false; t.focus();
  });
});

// Modal: close the mobile menu first; preselect destination from the trigger's data-dest.
const enq = document.getElementById("enqModal");
if (enq) enq.addEventListener("show.bs.modal", (e) => {
  const oc = document.querySelector(".offcanvas.show");
  if (oc && window.bootstrap) bootstrap.Offcanvas.getOrCreateInstance(oc).hide();
  const dest = e.relatedTarget && e.relatedTarget.dataset.dest;
  const sel = enq.querySelector('select[name="country"]');
  if (dest && sel && !enq.querySelector(".js-enquiry.sent")) sel.value = dest;
});

// Desktop with a mouse: clicking a menu title goes to its landing page (hover opens the menu).
// Touch devices and mobile keep Bootstrap's tap-to-open behaviour.
document.addEventListener("click", (e) => {
  const a = e.target.closest(".navbar .dropdown-toggle[data-href]");
  if (a && window.matchMedia("(min-width: 992px) and (hover: hover)").matches) {
    e.preventDefault(); e.stopPropagation(); window.location.href = a.dataset.href;
  }
}, true);

// Desktop: Escape dismisses a menu shown by hover or focus (CSS-driven, so Bootstrap's own Escape never fires).
const desktop = window.matchMedia("(min-width: 992px)");
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || !desktop.matches) return;
  const dd = (document.activeElement && document.activeElement.closest(".navbar .dropdown")) || document.querySelector(".navbar .dropdown:hover");
  if (!dd) return;
  dd.classList.add("is-dismissed");
  const t = dd.querySelector(".dropdown-toggle");
  if (t) t.focus();
});
document.querySelectorAll(".navbar .dropdown").forEach((dd) => {
  dd.addEventListener("mouseleave", () => dd.classList.remove("is-dismissed"));
  dd.addEventListener("focusout", (e) => { if (!dd.contains(e.relatedTarget)) dd.classList.remove("is-dismissed"); });
});
