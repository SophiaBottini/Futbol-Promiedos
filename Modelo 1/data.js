/* ════════════════════════════════════════════════════════════
   data.js — Datos estáticos: banderas y predicciones
════════════════════════════════════════════════════════════ */

// Mapeo TLA → ISO2 para flagcdn.com
const TLA_TO_ISO2 = {
  MEX:'mx',ZAF:'za',KOR:'kr',CZE:'cz',CAN:'ca',BIH:'ba',QAT:'qa',CHE:'ch',
  BRA:'br',MAR:'ma',HTI:'ht',SCO:'gb-sct',USA:'us',PRY:'py',AUS:'au',TUR:'tr',
  DEU:'de',CIV:'ci',ECU:'ec',CUW:'cw',NLD:'nl',JPN:'jp',SWE:'se',TUN:'tn',
  BEL:'be',EGY:'eg',IRN:'ir',NZL:'nz',ESP:'es',URY:'uy',SAU:'sa',CPV:'cv',
  FRA:'fr',SEN:'sn',IRQ:'iq',NOR:'no',ARG:'ar',DZA:'dz',AUT:'at',JOR:'jo',
  PRT:'pt',COD:'cd',UZB:'uz',COL:'co',ENG:'gb-eng',HRV:'hr',GHA:'gh',PAN:'pa',
};

// Mapeo nombre completo → ISO2
const NAME_TO_ISO2 = {
  'Mexico':'mx','South Africa':'za','Korea Republic':'kr','Czechia':'cz',
  'Czech Republic':'cz','Canada':'ca','Bosnia-Herzegovina':'ba','Bosnia':'ba',
  'Qatar':'qa','Switzerland':'ch','Brazil':'br','Morocco':'ma','Haiti':'ht',
  'Scotland':'gb-sct','USA':'us','United States':'us','Paraguay':'py',
  'Australia':'au','Türkiye':'tr','Turkey':'tr','Germany':'de',
  "Côte d'Ivoire":'ci','Ecuador':'ec','Curaçao':'cw','Netherlands':'nl',
  'Japan':'jp','Sweden':'se','Tunisia':'tn','Belgium':'be','Egypt':'eg',
  'Iran':'ir','New Zealand':'nz','Spain':'es','Uruguay':'uy',
  'Saudi Arabia':'sa','Cabo Verde':'cv','Cape Verde':'cv','France':'fr',
  'Senegal':'sn','Iraq':'iq','Norway':'no','Argentina':'ar','Algeria':'dz',
  'Austria':'at','Jordan':'jo','Portugal':'pt','DR Congo':'cd',
  'Uzbekistan':'uz','Colombia':'co','England':'gb-eng','Croatia':'hr',
  'Ghana':'gh','Panama':'pa',
};

function flagUrl(team) {
  if (!team) return '';
  const iso = TLA_TO_ISO2[team.tla] || NAME_TO_ISO2[team.name] || NAME_TO_ISO2[team.shortName] || '';
  return iso ? `https://flagcdn.com/w80/${iso}.png` : '';
}

function flagImg(team, cls = 'flag-img') {
  const url  = flagUrl(team);
  const name = team?.shortName || team?.name || '?';
  const size = cls === 'flag-img' ? '32' : '18';
  if (!url) return `<span style="font-size:${size}px">🏳️</span>`;
  return `<img src="${url}" alt="${name}" class="${cls}" loading="lazy" onerror="this.style.display='none'">`;
}

// ── PREDICCIONES ─────────────────────────────────────────────
const EQUIPOS = [
  {iso:'ar',n:'Argentina',g:'J',c:'CONMEBOL',r:1,v:65,e:22,d:13,gf:2.1,gc:0.6,o25:58,btts:35,cf:5.2,cc:4.1,cl:'Over 9.5',cards:2.8,cardL:'Over 2.5',pos:54,forma:['G','G','G','G','G'],dato:'Marcó en 19 de los últimos 20. Scaloni invicto desde oct 2025. 5 victorias pre-Mundial.'},
  {iso:'br',n:'Brasil',g:'C',c:'CONMEBOL',r:5,v:60,e:22,d:18,gf:2.5,gc:1.1,o25:65,btts:60,cf:6.0,cc:4.5,cl:'Over 10.5',cards:3.1,cardL:'Over 3.5',pos:56,forma:['G','G','E','G','G'],dato:'60% BTTS. Ganó 6-2 a Panamá en mayo 2026. Vini Jr: 8 goles en los últimos 12.'},
  {iso:'co',n:'Colombia',g:'K',c:'CONMEBOL',r:9,v:55,e:25,d:20,gf:2.2,gc:1.2,o25:60,btts:45,cf:5.0,cc:4.8,cl:'Over 9.5',cards:3.4,cardL:'Over 3.5',pos:52,forma:['P','G','G','G','P'],dato:'6-3 a Venezuela en eliminatorias. Borré, Díaz y Durán: trío explosivo.'},
  {iso:'uy',n:'Uruguay',g:'H',c:'CONMEBOL',r:15,v:48,e:28,d:24,gf:1.8,gc:1.1,o25:45,btts:40,cf:4.5,cc:5.2,cl:'Under 9.5',cards:3.8,cardL:'Over 3.5',pos:46,forma:['P','G','G','E','P'],dato:'Darwin Núñez = 40% de los goles del equipo. Perdió 5-1 vs EE.UU. en nov.'},
  {iso:'py',n:'Paraguay',g:'D',c:'CONMEBOL',r:20,v:40,e:28,d:32,gf:1.4,gc:1.3,o25:42,btts:42,cf:4.8,cc:5.0,cl:'Under 9.5',cards:3.2,cardL:'Under 3.5',pos:44,forma:['P','P','G','G','P'],dato:'Venció a México 2-1 en nov 2025. Almirón y Enciso como armas.'},
  {iso:'ec',n:'Ecuador',g:'E',c:'CONMEBOL',r:22,v:38,e:28,d:34,gf:1.6,gc:1.4,o25:48,btts:44,cf:4.5,cc:5.1,cl:'Under 9.5',cards:3.0,cardL:'Under 3.5',pos:45,forma:['G','E','P','G','E'],dato:'Ganó 1-0 a Argentina en eliminatorias. Kendry Páez, 18 años.'},
  {iso:'es',n:'España',g:'H',c:'UEFA',r:2,v:65,e:20,d:15,gf:2.6,gc:0.9,o25:70,btts:52,cf:6.5,cc:4.2,cl:'Over 10.5',cards:2.6,cardL:'Under 3.5',pos:61,forma:['G','G','G','G','G'],dato:'Imbatida en 18/20. Yamal (17 años) es la gran figura. Bicampeona de Europa.'},
  {iso:'de',n:'Alemania',g:'E',c:'UEFA',r:4,v:62,e:22,d:16,gf:2.4,gc:1.0,o25:68,btts:52,cf:6.2,cc:4.5,cl:'Over 10.5',cards:2.8,cardL:'Under 3.5',pos:57,forma:['G','G','G','G','E'],dato:'8V en los últimos 10. Wirtz y Musiala: la mejor dupla sub-25 del torneo.'},
  {iso:'fr',n:'Francia',g:'I',c:'UEFA',r:3,v:63,e:22,d:15,gf:2.3,gc:0.9,o25:65,btts:48,cf:6.0,cc:4.4,cl:'Over 10.5',cards:2.9,cardL:'Under 3.5',pos:56,forma:['G','G','G','E','G'],dato:'Mbappé regresa al Mundial. 4V en los últimos 5.'},
  {iso:'pt',n:'Portugal',g:'K',c:'UEFA',r:6,v:62,e:22,d:16,gf:2.8,gc:1.0,o25:72,btts:55,cf:6.3,cc:4.5,cl:'Over 10.5',cards:3.2,cardL:'Over 3.5',pos:55,forma:['G','G','G','G','E'],dato:'72% Over 2.5, el más alto de UEFA. Bruno Fernandes + Vitinha.'},
  {iso:'gb-eng',n:'Inglaterra',g:'L',c:'UEFA',r:7,v:60,e:24,d:16,gf:2.3,gc:0.9,o25:64,btts:46,cf:6.0,cc:4.8,cl:'Over 10.5',cards:2.8,cardL:'Under 3.5',pos:56,forma:['G','G','G','G','E'],dato:'Grupo L asequible. Bellingham lidera la nueva generación inglesa.'},
  {iso:'nl',n:'Países Bajos',g:'F',c:'UEFA',r:8,v:56,e:24,d:20,gf:2.2,gc:1.0,o25:62,btts:50,cf:5.8,cc:4.6,cl:'Over 10.5',cards:2.9,cardL:'Under 3.5',pos:55,forma:['G','G','G','P','G'],dato:'Gakpo: 6 goles en los últimos 8. Van Dijk: líder defensivo.'},
  {iso:'be',n:'Bélgica',g:'G',c:'UEFA',r:10,v:48,e:26,d:26,gf:2.0,gc:1.1,o25:60,btts:45,cf:5.4,cc:4.8,cl:'Over 9.5',cards:3.1,cardL:'Over 3.5',pos:53,forma:['G','E','G','G','P'],dato:'Doku es la nueva estrella. Grupo G blando (Irán, Egipto, NZ).'},
  {iso:'no',n:'Noruega',g:'I',c:'UEFA',r:12,v:42,e:26,d:32,gf:2.4,gc:1.5,o25:70,btts:58,cf:5.2,cc:5.8,cl:'Over 10.5',cards:3.4,cardL:'Over 3.5',pos:47,forma:['G','G','P','G','E'],dato:'Haaland clasificó por fin a un Mundial. 70% de sus partidos Over 2.5.'},
  {iso:'at',n:'Austria',g:'J',c:'UEFA',r:18,v:38,e:28,d:34,gf:1.8,gc:1.4,o25:58,btts:50,cf:5.0,cc:5.2,cl:'Under 9.5',cards:3.2,cardL:'Under 3.5',pos:50,forma:['G','G','P','E','G'],dato:'Grupo J con Argentina. Arnautović: 7 goles en sus últimas 5 clasificatorias.'},
  {iso:'hr',n:'Croacia',g:'L',c:'UEFA',r:16,v:42,e:28,d:30,gf:1.8,gc:1.3,o25:55,btts:45,cf:5.2,cc:4.8,cl:'Under 9.5',cards:3.2,cardL:'Under 3.5',pos:52,forma:['G','G','E','P','G'],dato:'Modric sigue a los 40 años. Venció a Colombia en amistoso 2026.'},
  {iso:'ch',n:'Suiza',g:'B',c:'UEFA',r:19,v:42,e:28,d:30,gf:1.7,gc:1.1,o25:50,btts:44,cf:5.0,cc:5.0,cl:'Under 9.5',cards:2.8,cardL:'Under 3.5',pos:50,forma:['G','E','G','G','P'],dato:'Siempre llega lejos cuando nadie la espera. Xhaka es el motor.'},
  {iso:'se',n:'Suecia',g:'F',c:'UEFA',r:24,v:35,e:28,d:37,gf:1.7,gc:1.4,o25:48,btts:42,cf:5.0,cc:5.5,cl:'Under 9.5',cards:2.8,cardL:'Under 3.5',pos:48,forma:['G','P','E','G','P'],dato:'Clasificó por play-off. Sin Ibra ni Forsberg.'},
  {iso:'cz',n:'Rep. Checa',g:'A',c:'UEFA',r:25,v:38,e:28,d:34,gf:1.5,gc:1.3,o25:48,btts:42,cf:4.8,cc:5.2,cl:'Under 9.5',cards:2.8,cardL:'Under 3.5',pos:48,forma:['P','P','G','E','G'],dato:'Clasificó eliminando a Italia. Perdió 1-2 vs Corea en jornada 1.'},
  {iso:'ba',n:'Bosnia-Hz',g:'B',c:'UEFA',r:30,v:35,e:28,d:37,gf:1.6,gc:1.5,o25:55,btts:48,cf:4.5,cc:5.0,cl:'Under 9.5',cards:3.0,cardL:'Under 3.5',pos:46,forma:['G','G','P','E','G'],dato:'Džeko (38 años) aún en la lista. Pljaka es la nueva figura.'},
  {iso:'gb-sct',n:'Escocia',g:'C',c:'UEFA',r:32,v:28,e:25,d:47,gf:1.4,gc:1.8,o25:50,btts:48,cf:5.0,cc:5.8,cl:'Under 9.5',cards:3.5,cardL:'Over 3.5',pos:44,forma:['P','E','G','P','P'],dato:'Grupo C imposible: Brasil y Marruecos. Única chance: ganar a Haití.'},
  {iso:'us',n:'EE.UU.',g:'D',c:'CONCACAF',r:13,v:52,e:24,d:24,gf:1.9,gc:1.2,o25:58,btts:45,cf:5.5,cc:5.0,cl:'Over 10.5',cards:3.0,cardL:'Under 3.5',pos:50,forma:['G','G','G','E','G'],dato:'Local anfitrión. Pulisic + Reyna = dupla top. Pochettino los transformó.'},
  {iso:'ca',n:'Canadá',g:'B',c:'CONCACAF',r:34,v:52,e:26,d:22,gf:2.0,gc:1.1,o25:60,btts:46,cf:5.8,cc:4.9,cl:'Over 10.5',cards:2.9,cardL:'Under 3.5',pos:50,forma:['G','G','G','P','G'],dato:'Davies en su mejor momento. Venció a EE.UU. en casa en 2024.'},
  {iso:'mx',n:'México',g:'A',c:'CONCACAF',r:15,v:48,e:26,d:26,gf:1.9,gc:1.3,o25:58,btts:46,cf:5.5,cc:5.0,cl:'Over 9.5',cards:3.2,cardL:'Under 3.5',pos:50,forma:['G','G','G','G','G'],dato:'Ganó 2-0 a Sudáfrica en el partido inaugural. Rompió la maldición.'},
  {iso:'pa',n:'Panamá',g:'L',c:'CONCACAF',r:48,v:22,e:24,d:54,gf:1.2,gc:2.1,o25:46,btts:32,cf:4.2,cc:6.0,cl:'Under 9.5',cards:3.8,cardL:'Over 3.5',pos:40,forma:['P','P','G','P','P'],dato:'Brasil les metió 6-2 en mayo 2026. ~3.8 tarjetas/partido.'},
  {iso:'ht',n:'Haití',g:'C',c:'CONCACAF',r:55,v:20,e:22,d:58,gf:0.9,gc:1.8,o25:45,btts:30,cf:3.8,cc:6.2,cl:'Under 9.5',cards:3.0,cardL:'Under 3.5',pos:38,forma:['P','P','E','P','P'],dato:'Primera Copa del Mundo. Grupo C con Brasil y Marruecos.'},
  {iso:'cw',n:'Curazao',g:'E',c:'CONCACAF',r:60,v:15,e:20,d:65,gf:0.8,gc:2.0,o25:40,btts:28,cf:3.5,cc:5.8,cl:'Under 9.5',cards:2.8,cardL:'Under 3.5',pos:38,forma:['P','E','P','P','P'],dato:'Nación más pequeña del Mundial (156.000 hab). Grupo E con Alemania.'},
  {iso:'ma',n:'Marruecos',g:'C',c:'CAF',r:14,v:58,e:24,d:18,gf:2.1,gc:0.8,o25:60,btts:44,cf:5.8,cc:4.5,cl:'Over 10.5',cards:3.0,cardL:'Under 3.5',pos:52,forma:['G','G','G','E','G'],dato:'Semifinalistas en Qatar 2022. 4 victorias seguidas en 2026.'},
  {iso:'sn',n:'Senegal',g:'I',c:'CAF',r:17,v:42,e:28,d:30,gf:1.8,gc:1.2,o25:52,btts:44,cf:5.2,cc:5.0,cl:'Under 9.5',cards:3.2,cardL:'Under 3.5',pos:48,forma:['G','G','E','G','P'],dato:'Mané lideró la clasificación. Salif Sané: nueva roca defensiva.'},
  {iso:'eg',n:'Egipto',g:'G',c:'CAF',r:38,v:38,e:28,d:34,gf:1.9,gc:1.3,o25:55,btts:46,cf:5.0,cc:5.2,cl:'Under 9.5',cards:3.1,cardL:'Under 3.5',pos:49,forma:['G','G','G','E','P'],dato:'Mohamed Salah sigue activo. Clasificó con 7V y 2E en CAF.'},
  {iso:'ci',n:'C. de Marfil',g:'E',c:'CAF',r:28,v:40,e:26,d:34,gf:1.8,gc:1.4,o25:56,btts:46,cf:5.0,cc:5.5,cl:'Under 9.5',cards:3.0,cardL:'Under 3.5',pos:48,forma:['G','E','G','P','G'],dato:'Campeones AFCON 2024. Haller volvió tras vencer el cáncer.'},
  {iso:'tn',n:'Túnez',g:'F',c:'CAF',r:35,v:30,e:28,d:42,gf:1.5,gc:1.5,o25:48,btts:44,cf:4.8,cc:5.2,cl:'Under 9.5',cards:3.0,cardL:'Under 3.5',pos:46,forma:['G','E','P','G','E'],dato:'Empataron 1-1 vs Brasil en amistoso nov 2025.'},
  {iso:'dz',n:'Argelia',g:'J',c:'CAF',r:36,v:30,e:26,d:44,gf:1.6,gc:1.5,o25:46,btts:42,cf:4.6,cc:5.4,cl:'Under 9.5',cards:3.3,cardL:'Over 3.5',pos:46,forma:['G','P','G','E','P'],dato:'Mahrez (36 años) sigue activo. Primer Mundial desde 2014.'},
  {iso:'gh',n:'Ghana',g:'L',c:'CAF',r:40,v:28,e:26,d:46,gf:1.4,gc:1.6,o25:45,btts:40,cf:4.5,cc:5.5,cl:'Under 9.5',cards:3.2,cardL:'Under 3.5',pos:44,forma:['E','G','P','E','P'],dato:'Kudus del Ajax es la nueva estrella.'},
  {iso:'za',n:'Sudáfrica',g:'A',c:'CAF',r:61,v:28,e:26,d:46,gf:1.3,gc:1.5,o25:44,btts:38,cf:4.5,cc:5.5,cl:'Under 9.5',cards:3.0,cardL:'Under 3.5',pos:44,forma:['P','P','E','G','P'],dato:'Perdió 0-2 ante México con 2 expulsados en el debut.'},
  {iso:'cv',n:'Cabo Verde',g:'H',c:'CAF',r:70,v:18,e:22,d:60,gf:1.0,gc:1.8,o25:42,btts:30,cf:3.8,cc:5.8,cl:'Under 9.5',cards:2.8,cardL:'Under 3.5',pos:40,forma:['G','P','P','E','P'],dato:'Primer Mundial de su historia. Grupo H con España y Uruguay.'},
  {iso:'cd',n:'RD Congo',g:'K',c:'CAF',r:44,v:25,e:26,d:49,gf:1.4,gc:1.6,o25:45,btts:38,cf:4.2,cc:5.5,cl:'Under 9.5',cards:3.4,cardL:'Over 3.5',pos:43,forma:['G','P','G','P','P'],dato:'Clasificó por el repechaje intercontinental. Bakambu referente.'},
  {iso:'jp',n:'Japón',g:'F',c:'AFC',r:11,v:55,e:24,d:21,gf:2.2,gc:0.9,o25:64,btts:46,cf:6.0,cc:4.5,cl:'Over 10.5',cards:2.8,cardL:'Under 3.5',pos:54,forma:['G','G','G','E','G'],dato:'La selección asiática más en forma. Mitoma, Kubo y Kamada: tridente europeo top.'},
  {iso:'kr',n:'Corea del Sur',g:'A',c:'AFC',r:22,v:42,e:28,d:30,gf:1.8,gc:1.2,o25:56,btts:46,cf:5.5,cc:5.0,cl:'Over 9.5',cards:3.0,cardL:'Under 3.5',pos:50,forma:['G','G','P','G','G'],dato:'Ganó 2-1 vs Rep. Checa en el debut. Son Heung-min: capitán histórico.'},
  {iso:'au',n:'Australia',g:'D',c:'AFC',r:26,v:38,e:28,d:34,gf:1.7,gc:1.4,o25:52,btts:44,cf:5.2,cc:5.2,cl:'Under 9.5',cards:3.0,cardL:'Under 3.5',pos:48,forma:['G','E','G','P','E'],dato:'Semifinalistas en Qatar 2022. Leckie y Maclaren como claves.'},
  {iso:'ir',n:'Irán',g:'G',c:'AFC',r:29,v:36,e:28,d:36,gf:1.5,gc:1.3,o25:46,btts:42,cf:4.8,cc:5.5,cl:'Under 9.5',cards:3.5,cardL:'Over 3.5',pos:47,forma:['G','G','E','P','G'],dato:'Taremi como arma principal. Solo 1.3 GC/partido.'},
  {iso:'sa',n:'Arabia Saudita',g:'H',c:'AFC',r:33,v:35,e:28,d:37,gf:1.6,gc:1.5,o25:52,btts:42,cf:5.0,cc:5.5,cl:'Under 9.5',cards:3.2,cardL:'Under 3.5',pos:48,forma:['G','E','P','G','E'],dato:'Vencieron a Argentina en Qatar 2022. Grupo H con España.'},
  {iso:'qa',n:'Catar',g:'B',c:'AFC',r:42,v:25,e:25,d:50,gf:1.4,gc:1.7,o25:45,btts:38,cf:4.5,cc:5.5,cl:'Under 9.5',cards:2.8,cardL:'Under 3.5',pos:46,forma:['E','P','G','P','P'],dato:'Campeón Copa de Asia 2023. Clasificó por mérito propio.'},
  {iso:'uz',n:'Uzbekistán',g:'K',c:'AFC',r:45,v:28,e:26,d:46,gf:1.5,gc:1.6,o25:46,btts:40,cf:4.8,cc:5.5,cl:'Under 9.5',cards:2.9,cardL:'Under 3.5',pos:46,forma:['G','P','G','P','E'],dato:'Primer Mundial de su historia. Shukurov goleador.'},
  {iso:'iq',n:'Irak',g:'I',c:'AFC',r:52,v:22,e:24,d:54,gf:1.2,gc:1.5,o25:42,btts:32,cf:4.2,cc:5.8,cl:'Under 9.5',cards:3.5,cardL:'Over 3.5',pos:42,forma:['G','P','E','P','P'],dato:'Regresa al Mundial 40 años después (1986). Grupo I con Francia.'},
  {iso:'jo',n:'Jordania',g:'J',c:'AFC',r:58,v:20,e:22,d:58,gf:1.1,gc:1.6,o25:40,btts:30,cf:4.0,cc:6.0,cl:'Under 9.5',cards:3.2,cardL:'Under 3.5',pos:40,forma:['G','P','P','E','P'],dato:'Primer Mundial de su historia. Grupo J con Argentina.'},
  {iso:'nz',n:'Nueva Zelanda',g:'G',c:'AFC',r:95,v:18,e:20,d:62,gf:0.9,gc:2.0,o25:40,btts:28,cf:3.5,cc:6.0,cl:'Under 9.5',cards:2.6,cardL:'Under 3.5',pos:38,forma:['P','E','P','P','P'],dato:'Clasificó por OFC. Grupo G con Bélgica, Irán y Egipto.'},
];
