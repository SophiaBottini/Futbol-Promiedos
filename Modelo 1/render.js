/* ════════════════════════════════════════════════════════════
   render.js — Funciones de renderizado (resultados, fixture, posiciones, predicciones)
════════════════════════════════════════════════════════════ */

// ── Helpers de fecha ──────────────────────────────────────────
function isToday(d) {
  return new Date(d).toDateString() === new Date().toDateString();
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}
function fmtTime(d) {
  return new Date(d).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

// ── Match Card ────────────────────────────────────────────────
function buildMatchCard(m) {
  const live  = m.status === 'IN_PLAY' || m.status === 'PAUSED';
  const done  = m.status === 'FINISHED';
  const today = isToday(m.utcDate);

  const cardClass = live ? 'match-card--live' : (today && !done ? 'match-card--today' : '');

  const homeWin = done && m.score.fullTime.home > m.score.fullTime.away;
  const awayWin = done && m.score.fullTime.away > m.score.fullTime.home;
  const hs = (done || live) ? (m.score.fullTime.home ?? '?') : '';
  const as = (done || live) ? (m.score.fullTime.away ?? '?') : '';

  const centerHtml = (done || live)
    ? `<div class="score-row">
        <div class="score-digit">${hs}</div>
        <div class="score-sep">–</div>
        <div class="score-digit">${as}</div>
       </div>
       ${live ? `<div class="match-minute">⏱ ${m.minute ?? ''}′</div>` : ''}
       ${done ? '<div class="match-finished">FIN</div>' : ''}`
    : `<div class="match-time-big">${fmtTime(m.utcDate)}</div>
       <div class="match-time-sub">Hora ARG</div>`;

  const statusHtml = live
    ? `<span class="match-card__status--live"><span class="live-pip"></span>En vivo</span>`
    : done
      ? `<span class="match-card__status--done"><span class="done-pip"></span>Finalizado</span>`
      : `<span class="match-card__status--sched">📅 ${fmtDate(m.utcDate)}</span>`;

  const group = m.group ? m.group.replace('GROUP_', 'Grupo ') : '';

  return `<div class="match-card ${cardClass}">
    <div class="match-card__head">
      ${statusHtml}
      ${group ? `<span class="group-badge">${group}</span>` : ''}
    </div>
    <div class="match-card__body">
      <div class="match-card__teams">
        <div class="match-card__team">
          ${flagImg(m.homeTeam, 'flag-img')}
          <div class="match-card__team-name ${homeWin ? 'match-card__team-name--winner' : ''}">
            ${m.homeTeam?.shortName || m.homeTeam?.name || '—'}
          </div>
        </div>
        <div class="match-card__center">${centerHtml}</div>
        <div class="match-card__team">
          ${flagImg(m.awayTeam, 'flag-img')}
          <div class="match-card__team-name ${awayWin ? 'match-card__team-name--winner' : ''}">
            ${m.awayTeam?.shortName || m.awayTeam?.name || '—'}
          </div>
        </div>
      </div>
    </div>
    <div class="match-card__foot">
      <span class="match-card__venue">${(m.venue || '').substring(0, 26)}</span>
      <span>${m.stage === 'GROUP_STAGE' ? 'Fase Grupos' : m.stage || ''}</span>
    </div>
  </div>`;
}

// ── Renderizar sección Resultados ─────────────────────────────
function renderResults(all) {
  const live     = all.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  const todayM   = all.filter(m => isToday(m.utcDate) && m.status !== 'IN_PLAY' && m.status !== 'PAUSED');
  const recent   = all.filter(m => m.status === 'FINISHED').slice(-8).reverse();
  const upcoming = all.filter(m => m.status === 'SCHEDULED' && !isToday(m.utcDate)).slice(0, 9);

  // Live
  const liveWrap = document.getElementById('live-wrap');
  liveWrap.style.display = live.length ? 'block' : 'none';
  document.getElementById('live-grid').innerHTML = live.map(buildMatchCard).join('');

  // Hoy
  document.getElementById('today-date').textContent =
    new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('today-grid').innerHTML = todayM.length
    ? todayM.map(buildMatchCard).join('')
    : '<div class="empty"><span>📭</span>No hay partidos programados para hoy</div>';

  // Últimos resultados
  document.getElementById('recent-grid').innerHTML = recent.length
    ? recent.map(buildMatchCard).join('')
    : '<div class="empty"><span>📋</span>Sin resultados aún</div>';

  // Próximos
  document.getElementById('upcoming-grid').innerHTML = upcoming.length
    ? upcoming.map(buildMatchCard).join('')
    : '<div class="empty"><span>📅</span>Sin próximos partidos</div>';
}

// ── Fixture row ───────────────────────────────────────────────
function buildFixtureRow(m) {
  const live  = m.status === 'IN_PLAY' || m.status === 'PAUSED';
  const done  = m.status === 'FINISHED';
  const today = isToday(m.utcDate);
  const cls   = live ? 'fixture-row--live' : done ? 'fixture-row--played' : today ? 'fixture-row--today' : '';
  const group = m.group ? m.group.replace('GROUP_', 'G') : '';
  const score = (done || live)
    ? `${m.score.fullTime.home ?? '?'} – ${m.score.fullTime.away ?? '?'}`
    : fmtTime(m.utcDate);

  return `<div class="fixture-row ${cls}">
    <div class="fixture-row__date">
      <span class="fixture-row__grp">${group}</span><br>${fmtDate(m.utcDate)}
    </div>
    <div class="fixture-row__team">
      ${flagImg(m.homeTeam, 'flag-img--sm')}
      <span>${m.homeTeam?.shortName || '—'}</span>
    </div>
    <div class="fixture-row__score ${done || live ? '' : 'fixture-row__score--tbd'}">${score}</div>
    <div class="fixture-row__team fixture-row__team--right">
      <span>${m.awayTeam?.shortName || '—'}</span>
      ${flagImg(m.awayTeam, 'flag-img--sm')}
    </div>
    <div class="fixture-row__meta">${(m.venue || '').substring(0, 18)}</div>
  </div>`;
}

function renderFixture(all) {
  const byDate = {};
  all.forEach(m => {
    const d = fmtDate(m.utcDate);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(m);
  });

  let html = '';
  Object.entries(byDate).forEach(([d, ms]) => {
    html += `<h2 class="section-title" style="margin-top:20px">${d}</h2>
      <div class="fixture-list">${ms.map(buildFixtureRow).join('')}</div>`;
  });

  document.getElementById('fixture-container').innerHTML =
    html || '<div class="empty"><span>📅</span>Sin datos de fixture</div>';
}

// ── Standings card ────────────────────────────────────────────
function buildStandingsCard(grp) {
  const name = (grp.group || '').replace('GROUP_', 'Grupo ');
  const flagsHtml = grp.table.slice(0, 4)
    .map(r => flagImg(r.team, 'flag-img--sm'))
    .join('');

  const rows = grp.table.map((r, i) => {
    const posCls = i === 0 ? 'st-pos--q' : i === 1 ? 'st-pos--m' : '';
    return `<tr>
      <td><span class="st-pos ${posCls}">${r.position}</span></td>
      <td><div class="st-team-row">${flagImg(r.team, 'flag-img--sm')}<span>${r.team.shortName || r.team.name}</span></div></td>
      <td>${r.playedGames}</td>
      <td>${r.won}</td>
      <td>${r.draw}</td>
      <td>${r.lost}</td>
      <td>${r.goalsFor}</td>
      <td>${r.goalsAgainst}</td>
      <td style="font-size:11px">${r.goalDifference > 0 ? '+' : ''}${r.goalDifference}</td>
      <td class="st-pts">${r.points}</td>
    </tr>`;
  }).join('');

  return `<div class="standings-card">
    <div class="standings-card__head">
      <div class="standings-card__flags">${flagsHtml}</div>
      ${name}
    </div>
    <table class="st-table">
      <thead>
        <tr><th>#</th><th>Equipo</th><th>J</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function renderStandings(groups) {
  document.getElementById('standings-grid').innerHTML = groups.length
    ? groups.map(buildStandingsCard).join('')
    : '<div class="empty"><span>📊</span>Posiciones no disponibles aún</div>';
}

// ── Predicciones ──────────────────────────────────────────────
function statValClass(val, hi, lo) {
  return val >= hi ? 'stat-val--green' : val <= lo ? 'stat-val--red' : 'stat-val--gold';
}

function formPills(forma) {
  const map = { G: 'form-pill--g', E: 'form-pill--e', P: 'form-pill--p' };
  return forma.map(f => `<span class="form-pill ${map[f]}">${f}</span>`).join('');
}

function buildPredCard(q) {
  const elite = q.v >= 58 ? 'pred-card--elite' : '';
  const tagCls = p => p >= 55 ? 'tag--green' : p <= 45 ? 'tag--red' : 'tag--gold';

  return `<div class="pred-card ${elite}">
    <div class="pred-card__head">
      <img src="https://flagcdn.com/w80/${q.iso}.png" alt="${q.n}" class="flag-img--md" loading="lazy" onerror="this.style.opacity=0">
      <div>
        <div class="pred-card__name">${q.n}</div>
        <div class="pred-card__sub">${q.c} · #${q.r} FIFA</div>
      </div>
      <div class="pred-card__group">Grupo ${q.g}</div>
    </div>
    <div class="pred-card__body">
      <div class="wdl">
        <div class="wdl__labels"><span>Victoria</span><span>Empate</span><span>Derrota</span></div>
        <div class="wdl__bar">
          <div class="wdl__win"  style="width:${q.v}%"></div>
          <div class="wdl__draw" style="width:${q.e}%"></div>
          <div class="wdl__loss" style="width:${q.d}%"></div>
        </div>
        <div class="wdl__pcts">
          <span class="wdl__pct-win">${q.v}%</span>
          <span class="wdl__pct-draw">${q.e}%</span>
          <span class="wdl__pct-loss">${q.d}%</span>
        </div>
      </div>
      <div class="pred-stats">
        <div class="stat-box"><div class="stat-val ${statValClass(q.gf, 2, 1.3)}">${q.gf}</div><div class="stat-lbl">GF/partido</div></div>
        <div class="stat-box"><div class="stat-val ${statValClass(1.5 - q.gc, .4, -.1)}">${q.gc}</div><div class="stat-lbl">GC/partido</div></div>
        <div class="stat-box"><div class="stat-val ${statValClass(q.o25, 60, 46)}">${q.o25}%</div><div class="stat-lbl">Over 2.5</div></div>
        <div class="stat-box"><div class="stat-val ${statValClass(q.btts, 52, 38)}">${q.btts}%</div><div class="stat-lbl">BTTS</div></div>
        <div class="stat-box"><div class="stat-val stat-val--gold">${q.cf}/${q.cc}</div><div class="stat-lbl">Corners ±</div></div>
        <div class="stat-box"><div class="stat-val ${statValClass(q.cards, 3.5, 2.7)}">${q.cards}</div><div class="stat-lbl">Tarjetas</div></div>
      </div>
      <div class="possession">
        <div class="possession__label"><span>Posesión</span><span>${q.pos}%</span></div>
        <div class="possession__track"><div class="possession__fill" style="width:${q.pos}%"></div></div>
      </div>
      <div class="pred-tags">
        <span class="tag ${tagCls(q.o25)}">${q.o25 >= 55 ? '✓' : '✗'} ${q.cl}</span>
        <span class="tag tag--gold">Tarj. ${q.cardL}</span>
        <span class="tag ${tagCls(q.btts)}">BTTS ${q.btts}%</span>
      </div>
      <div class="form-row">
        <span class="form-label">Forma</span>
        <div class="form-pills">${formPills(q.forma)}</div>
      </div>
      <div class="hot-tip">🔥 <strong>Dato caliente:</strong> ${q.dato}</div>
    </div>
  </div>`;
}

function filtrar() {
  const g = document.getElementById('filtroG').value;
  const c = document.getElementById('filtroC').value;
  const b = document.getElementById('buscar').value.toLowerCase();
  const res = EQUIPOS.filter(q =>
    (!g || q.g === g) &&
    (!c || q.c === c) &&
    q.n.toLowerCase().includes(b)
  );
  document.getElementById('predGrid').innerHTML = res.map(buildPredCard).join('');
  document.getElementById('contador').textContent = res.length + ' equipos';
}
