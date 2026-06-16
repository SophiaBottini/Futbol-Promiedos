/* ════════════════════════════════════════════════════════════
   api.js — Comunicación con football-data.org
════════════════════════════════════════════════════════════ */

const TOKEN = 'de3520c4735349858722bb080dd9a865';
const BASE  = 'https://api.football-data.org/v4';
const WC    = 'WC';

async function apiFetch(path) {
  const res = await fetch(BASE + path, {
    headers: { 'X-Auth-Token': TOKEN },
    mode: 'cors',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 120)}`);
  }
  return res.json();
}

function setApiStatus(state, label) {
  const el = document.getElementById('apiStatus');
  el.className = 'api-badge api-badge--' + state;
  el.textContent = label;
}

function setUpdateTime() {
  const el = document.getElementById('lastUpdate');
  if (el) {
    el.textContent = 'Actualizado ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }
}

async function loadAll() {
  setApiStatus('loading', 'Cargando…');
  try {
    const [mData, sData] = await Promise.all([
      apiFetch(`/competitions/${WC}/matches`),
      apiFetch(`/competitions/${WC}/standings`),
    ]);

    renderResults(mData.matches || []);
    renderStandings(sData.standings || []);
    renderFixture(mData.matches || []);

    // Guardar partidos para el Prode
    window._allMatches = mData.matches || [];
    renderProde(mData.matches || []);

    setApiStatus('ok', '✓ En vivo');
    setUpdateTime();
  } catch (err) {
    console.error(err);
    setApiStatus('err', '✗ Error');
    const errHtml = `<div class="error-box">
      <h3>No se pudo conectar con la API</h3>
      <p>Error: <code>${err.message}</code><br><br>
      Posibles causas:<br>
      • Abrí el archivo con un servidor local: <code>python3 -m http.server 8080</code><br>
      • Token incorrecto o vencido.<br>
      • La API puede estar en mantenimiento.</p>
      <button class="btn-retry" onclick="loadAll()">↻ Reintentar</button>
    </div>`;
    ['today-grid','recent-grid','upcoming-grid','standings-grid','fixture-container']
      .forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = errHtml; });
  }
}

async function autoRefresh() {
  await loadAll();
  setInterval(async () => {
    const hasLive = document.querySelectorAll('.match-card--live').length > 0;
    if (hasLive) await loadAll();
  }, 60_000);
}
