/* ════════════════════════════════════════════════════════════
   app.js — Inicialización y navegación por tabs
════════════════════════════════════════════════════════════ */

// ── Tab switching ─────────────────────────────────────────────
function showTab(tabId) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('tab-section--active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));

  document.getElementById('tab-' + tabId)?.classList.add('tab-section--active');
  document.querySelectorAll(`.tab[data-tab="${tabId}"]`).forEach(t => t.classList.add('tab--active'));
}

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

// ── Refresh button ────────────────────────────────────────────
document.getElementById('btnRefresh').addEventListener('click', loadAll);

// ── Predicciones filters ──────────────────────────────────────
document.getElementById('filtroG').addEventListener('change', filtrar);
document.getElementById('filtroC').addEventListener('change', filtrar);
document.getElementById('buscar').addEventListener('input', filtrar);

// ── Boot ──────────────────────────────────────────────────────
filtrar();

// Prode buttons se inicializan cuando los datos llegan (en api.js -> renderProde)
// Aquí seteamos botones de Prode con datos vacíos como fallback
const dummyProdeInit = () => {
  const allM = window._allMatches || [];
  initProdeButtons(allM);
};

// Hook para que prode-buttons funcionen tras cargar datos
const origRenderProde = window.renderProde;
window.renderProde = function(matches) {
  origRenderProde(matches);
  initProdeButtons(matches);
};

autoRefresh();
