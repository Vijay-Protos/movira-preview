// Set before launch: real WhatsApp number (digits only, with country code).
const MOVIRA = { whatsapp: "91XXXXXXXXXX" };

document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = `https://wa.me/${MOVIRA.whatsapp}?text=${encodeURIComponent(a.dataset.wa)}`;
});
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
document.querySelectorAll('input[type="date"]').forEach((d) => { d.min = new Date().toISOString().slice(0, 10); });

// Enquiry forms: Bootstrap validation, honeypot, then hand-off to WhatsApp.
// Swap the hand-off for a POST to a real backend endpoint when one exists.
document.querySelectorAll(".js-enquiry").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.website.value) return; // bot
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;
    const d = Object.fromEntries(new FormData(form));
    const msg = [
      `New enquiry — Movira (${document.title.split("|")[0].trim()})`,
      `Name: ${d.name}`, `Mobile: ${d.phone}`, `Email: ${d.email}`,
      d.country && `Destination: ${d.country}`, d.neet && `NEET: ${d.neet}`, d.state && `State/city: ${d.state}`,
      d.budget && `Budget: ${d.budget}`, d.date && `Call on: ${d.date}${d.time ? ", " + d.time : ""}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${MOVIRA.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    form.classList.add("sent");
    form.querySelector(".thanks-msg").hidden = false;
  });
});

// Desktop with a mouse: clicking a menu title goes to its landing page (hover opens the menu).
// Touch devices and mobile keep Bootstrap's tap-to-open behaviour.
document.addEventListener("click", (e) => {
  const a = e.target.closest(".navbar .dropdown-toggle[data-href]");
  if (a && window.matchMedia("(min-width: 992px) and (hover: hover)").matches) {
    e.preventDefault(); e.stopPropagation(); window.location.href = a.dataset.href;
  }
}, true);
