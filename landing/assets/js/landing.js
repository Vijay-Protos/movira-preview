// Landing page: country tabs open from hero tiles, "Explore" links and the URL hash (#italy / #malta);
// the enquiry popup pre-selects the destination from the button that opened it (data-dest).
const explorer = document.getElementById("explore");
const openCountry = (k, scroll) => {
  const btn = document.getElementById("tabbtn-" + k);
  if (!btn || !window.bootstrap) return;
  bootstrap.Tab.getOrCreateInstance(btn).show();
  if (scroll) explorer.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
};
document.querySelectorAll("[data-explore]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openCountry(a.dataset.explore, true); }));
explorer.addEventListener("shown.bs.tab", (e) => {
  if (e.target.id && e.target.id.startsWith("tabbtn-")) history.replaceState(null, "", "#" + e.target.id.slice(7));
});
const fromHash = () => { const h = location.hash.slice(1); if (h === "italy" || h === "malta") openCountry(h, true); };
window.addEventListener("load", fromHash);
window.addEventListener("hashchange", fromHash);

const enqModal = document.getElementById("enqModal");
if (enqModal) enqModal.addEventListener("show.bs.modal", (e) => {
  const sel = enqModal.querySelector('select[name="country"]');
  if (sel && !enqModal.querySelector(".js-enquiry.sent")) sel.value = (e.relatedTarget && e.relatedTarget.dataset.dest) || "";
});
