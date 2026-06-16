/* ════════════════════════════════════════════════════════════
   prode.js — Sistema de pronósticos (PRODE)
════════════════════════════════════════════════════════════ */

const PRODE_KEY = 'mundial2026_prode';

function loadProdeData() {
  try { return JSON.parse(localStorage.getItem(PRODE_KEY) || '{}'); }
  catch { return {}; }
}

function saveProdeData(data) {
  localStorage.setItem(PRODE_KEY, JSON.stringify(data));
}

// Resultado del pronóstico vs resultado real
function evalProde(pred, real) {
  if (!real || real.home === null) return 'pending';
  if (pred.home === null || pred.away === null || pred.home === '' || pred.away === '') return 'pending';
  const ph = parseInt(pred.home), pa = parseInt(pred.away);
  const rh = real.home, ra = real.away;
  if (ph === rh && pa === ra) return 'exact';   // 3 pts
  const predWinner = ph > pa ? 'H' : ph < pa ? 'A' : 'D';
  const realWinner = rh > ra ? 'H' : rh < ra ? 'A' : 'D';
  if (predWinner === realWinner) return 'winner'; // 1 pt
  return 'wrong'; // 0 pts
}

function prodePoints(result) {
  return result === 'exact' ? 3 : result === 'winner' ? 1 : 0;
}

function buildProdeRow(m, prodeData) {
  const done  = m.status === 'FINISHED';
  const live  = m.status === 'IN_PLAY' || m.status === 'PAUSED';
  const saved = prodeData[m.id] || { home: '', away: '' };
  const real  = done || live ? { home: m.score.fullTime.home, away: m.score.fullTime.away } : null;
  const result = evalProde(saved, real);
  const pts    = prodePoints(result);

  const rowCls = result === 'exact'  ? 'prode-row--correct'
               : result === 'winner' ? 'prode-row--partial'
               : result === 'wrong'  ? 'prode-row--wrong'
               : '';

  const realScoreHtml = real
    ? `<div class="prode-real-score">${real.home} – ${real.away}</div>
       <div style="font-size:9px;color:var(--text-dim);text-align:center">Resultado real</div>`
    : `<div class="prode-real-score prode-real-score--tbd">vs</div>`;

  const ptsBadge = result !== 'pending'
    ? `<span class="prode-pts prode-pts--${pts}">${pts}pts</span>`
    : `<span class="prode-pts prode-pts--pending">—</span>`;

  const disabled = live || done ? 'disabled class="prode-input prode-input--disabled"' : 'class="prode-input"';

  return `<div class="prode-row ${rowCls} ${done ? 'prode-row--finished' : ''}" data-match-id="${m.id}">
    <div class="prode-team">
      ${flagImg(m.homeTeam, 'flag-img--sm')}
      <span>${m.homeTeam?.shortName || m.homeTeam?.name || '—'}</span>
    </div>
    <div class="prode-center">
      ${realScoreHtml}
      <div class="prode-inputs">
        <input type="number" min="0" max="20" ${disabled} value="${saved.home}"
          data-match="${m.id}" data-side="home" placeholder="–">
        <span class="prode-sep">–</span>
        <input type="number" min="0" max="20" ${disabled} value="${saved.away}"
          data-match="${m.id}" data-side="away" placeholder="–">
      </div>
      ${ptsBadge}
    </div>
    <div class="prode-team prode-team--right">
      <span>${m.awayTeam?.shortName || m.awayTeam?.name || '—'}</span>
      ${flagImg(m.awayTeam, 'flag-img--sm')}
    </div>
  </div>`;
}

function renderProde(allMatches) {
  const groupMatches = allMatches.filter(m => m.stage === 'GROUP_STAGE');
  if (!groupMatches.length) {
    document.getElementById('prode-grid').innerHTML =
      '<div class="empty"><span>📋</span>No hay partidos de fase de grupos disponibles</div>';
    return;
  }

  const prodeData = loadProdeData();

  // Agrupar por grupo
  const byGroup = {};
  groupMatches.forEach(m => {
    const g = (m.group || 'Sin grupo').replace('GROUP_', 'Grupo ');
    if (!byGroup[g]) byGroup[g] = [];
    byGroup[g].push(m);
  });

  let html = '';
  Object.entries(byGroup).sort().forEach(([g, ms]) => {
    html += `<div class="prode-group">
      <div class="prode-group__title">${g}</div>
      ${ms.map(m => buildProdeRow(m, prodeData)).join('')}
    </div>`;
  });

  document.getElementById('prode-grid').innerHTML = html;

  updateProdeCounters(groupMatches, prodeData);
  attachProdeInputListeners();
}

function updateProdeCounters(matches, prodeData) {
  let total = matches.length;
  let completados = 0;
  let aciertos = 0;
  let pts = 0;

  matches.forEach(m => {
    const saved = prodeData[m.id];
    if (saved && (saved.home !== '' && saved.away !== '')) completados++;
    const done = m.status === 'FINISHED';
    const live = m.status === 'IN_PLAY' || m.status === 'PAUSED';
    if (done || live) {
      const real = { home: m.score.fullTime.home, away: m.score.fullTime.away };
      const result = evalProde(saved || {}, real);
      if (result !== 'pending') {
        if (result === 'exact' || result === 'winner') aciertos++;
        pts += prodePoints(result);
      }
    }
  });

  document.getElementById('prode-total').textContent = total;
  document.getElementById('prode-completados').textContent = completados;
  document.getElementById('prode-aciertos').textContent = aciertos;
  document.getElementById('prode-pts').textContent = pts;
}

function attachProdeInputListeners() {
  document.querySelectorAll('.prode-input:not([disabled])').forEach(input => {
    input.addEventListener('change', () => {
      const matchId = parseInt(input.dataset.match);
      const side    = input.dataset.side;
      const val     = input.value.trim();

      const data = loadProdeData();
      if (!data[matchId]) data[matchId] = { home: '', away: '' };
      data[matchId][side] = val === '' ? '' : parseInt(val);
      saveProdeData(data);
    });
  });
}

function initProdeButtons(allMatches) {
  document.getElementById('btnSaveProde').addEventListener('click', () => {
    const data = loadProdeData();

    // Leer todos los inputs actuales
    document.querySelectorAll('.prode-input:not([disabled])').forEach(input => {
      const matchId = parseInt(input.dataset.match);
      const side    = input.dataset.side;
      const val     = input.value.trim();
      if (!data[matchId]) data[matchId] = { home: '', away: '' };
      data[matchId][side] = val === '' ? '' : parseInt(val);
    });

    saveProdeData(data);
    renderProde(allMatches);

    const btn = document.getElementById('btnSaveProde');
    btn.textContent = '✅ ¡Guardado!';
    setTimeout(() => { btn.textContent = '💾 Guardar pronósticos'; }, 2000);
  });

  document.getElementById('btnResetProde').addEventListener('click', () => {
    if (!confirm('¿Borrar todos los pronósticos?')) return;
    localStorage.removeItem(PRODE_KEY);
    renderProde(allMatches);
  });

  document.getElementById('btnShareProde').addEventListener('click', () => {
    const data = loadProdeData();
    const allM = window._allMatches || [];
    const lines = ['🏆 Mi PRODE Mundial 2026\n'];
    allM.filter(m => m.stage === 'GROUP_STAGE').forEach(m => {
      const p = data[m.id];
      if (p && p.home !== '' && p.away !== '') {
        const home = m.homeTeam?.shortName || m.homeTeam?.name || '?';
        const away = m.awayTeam?.shortName || m.awayTeam?.name || '?';
        lines.push(`${home} ${p.home}–${p.away} ${away}`);
      }
    });
    const text = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btnShareProde');
        btn.textContent = '✅ ¡Copiado!';
        setTimeout(() => { btn.textContent = '📤 Compartir'; }, 2000);
      });
    } else {
      alert(text);
    }
  });
}
