// ============= CONFIG =============
const APP_VERSION = '2.0.0';
const urlParams = new URLSearchParams(window.location.search);
const FOLLOWING_MODE = urlParams.get('modo') === 'siguiendo';
if (FOLLOWING_MODE) {
  document.body.classList.add('following-mode');
  document.getElementById('followingBanner').style.display = 'block';
}

// ============= DATA: PLAN BASE =============
const TRIP = { startDate: '2026-05-18', endDate: '2026-06-22', name: 'Jesi' };

// Plan base (luego puede ser sobrescrito por ediciones del usuario en state.dayOverrides)
const DAYS_BASE = [
  { date: '2026-05-18', day: 'Lun', city: 'travel', place: 'Vuelo Argentina → Milán', morning: 'Vuelo intercontinental.', afternoon: '', evening: 'Tip: melatonina, hidratarse, dormir lo que puedas.', sleeping: 'Avión', work: false, mapsQuery: '' },
  { date: '2026-05-19', day: 'Mar', city: 'travel', place: 'Milán → Chieti', morning: 'Llegada Malpensa. Malpensa Express → Milán Centrale.', afternoon: 'Frecciarossa Milán → Pescara (~4h).', evening: 'Tren regional Pescara → Chieti. Llegada noche.', sleeping: 'Casa amigos Chieti', work: false, mapsQuery: 'Chieti, Italy' },
  { date: '2026-05-20', day: 'Mié', city: 'chieti', place: 'Chieti', morning: 'Mañana libre 8-13. Café, mercado, paseo.', afternoon: 'Trabajo desde 14 (9 hs Argentina).', evening: 'Trabajo hasta las 23 (18 hs Argentina).', sleeping: 'Casa amigos', work: true, mapsQuery: 'Chieti, Italy' },
  { date: '2026-05-21', day: 'Jue', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-22', day: 'Vie', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-23', day: 'Sáb', city: 'chieti', place: 'Chieti - descanso', morning: 'Aclimatación, descanso.', afternoon: 'Caminata por Chieti Alta.', evening: 'Cena con amigos.', sleeping: 'Casa amigos', work: false, mapsQuery: 'Chieti Alta' },
  { date: '2026-05-24', day: 'Dom', city: 'chieti', place: 'Chieti - descanso', morning: 'Descanso o paseo a Pescara (15 min en tren).', afternoon: 'Lungomare, café.', evening: '', sleeping: 'Casa amigos', work: false, mapsQuery: 'Pescara lungomare' },
  { date: '2026-05-25', day: 'Lun', city: 'chieti', place: 'Sulmona en el día', morning: 'Tren Chieti→Sulmona (1h). Plaza Garibaldi, acueducto medieval.', afternoon: 'Confetti Pelino, almuerzo pasta a la chitarra.', evening: 'Vuelta a Chieti. Trabajo 14-23.', sleeping: 'Casa amigos', work: true, mapsQuery: 'Sulmona, Italy' },
  { date: '2026-05-26', day: 'Mar', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-27', day: 'Mié', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-28', day: 'Jue', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-29', day: 'Vie', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-30', day: 'Sáb', city: 'chieti', place: 'Scanno', morning: 'Mañana en Chieti.', afternoon: 'Tren Chieti→Sulmona + bus a Scanno.', evening: 'Caminar pueblo medieval. Cena cazuela montaña.', sleeping: 'B&B Scanno', work: false, mapsQuery: 'Scanno, Italy' },
  { date: '2026-05-31', day: 'Dom', city: 'chieti', place: 'Scanno → Chieti', morning: 'Subida al mirador Lago di Scanno (corazón).', afternoon: 'Vuelta tarde a Chieti.', evening: '', sleeping: 'Casa amigos', work: false, mapsQuery: 'Lago di Scanno' },
  { date: '2026-06-01', day: 'Lun', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-06-02', day: 'Mar', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-06-03', day: 'Mié', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-06-04', day: 'Jue', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo 14-23.', evening: '', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-06-05', day: 'Vie', city: 'chieti', place: 'Chieti - despedida', morning: 'Mañana libre.', afternoon: 'ÚLTIMO día de trabajo. Trabajo 14-23.', evening: 'Despedida con amigos.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-06-06', day: 'Sáb', city: 'puglia', place: 'Chieti → Bari', morning: 'Tren Chieti→Bari (3h30).', afternoon: 'Llegada Bari. Bari Vecchia, focaccia barese.', evening: 'Strada delle Orecchiette (señoras haciendo pasta).', sleeping: 'Bari', work: false, mapsQuery: 'Bari Vecchia' },
  { date: '2026-06-07', day: 'Dom', city: 'puglia', place: 'Polignano + Monopoli', morning: 'Tren Bari→Polignano (30 min). Cala Porto, acantilados.', afternoon: 'Almuerzo de pescado. Tren a Monopoli.', evening: 'Vuelta a Bari.', sleeping: 'Bari', work: false, mapsQuery: 'Polignano a Mare' },
  { date: '2026-06-08', day: 'Lun', city: 'puglia', place: 'Alberobello + Locorotondo', morning: 'Tren a Alberobello (1h45). Trulli.', afternoon: 'Locorotondo: pueblo blanco redondo. Almuerzo Primitivo.', evening: 'Trulli al atardecer (sin turismo). Vuelta a Bari.', sleeping: 'Bari', work: false, mapsQuery: 'Alberobello' },
  { date: '2026-06-09', day: 'Mar', city: 'puglia', place: 'Bari → Matera', morning: 'Mañana en Bari.', afternoon: 'Bus Bari→Matera (1h15).', evening: 'Sassi iluminados, Belvedere Murgia Timone, cena en Sasso.', sleeping: 'Sasso Matera', work: false, mapsQuery: 'Sassi di Matera' },
  { date: '2026-06-10', day: 'Mié', city: 'puglia', place: 'Matera → Lecce', morning: 'Casa Grotta, Cripta del Peccato (opcional).', afternoon: 'Bus Matera→Bari + tren Bari→Lecce.', evening: 'Lecce: Piazza SantOronzo, anfiteatro romano.', sleeping: 'Lecce', work: false, mapsQuery: 'Lecce, Italy' },
  { date: '2026-06-11', day: 'Jue', city: 'puglia', place: 'Otranto o Gallipoli', morning: 'Tren Lecce→Otranto (1h).', afternoon: 'Playa cristalina, casco amurallado bizantino.', evening: 'Vuelta a Lecce. Cena.', sleeping: 'Lecce', work: false, mapsQuery: 'Otranto, Italy' },
  { date: '2026-06-12', day: 'Vie', city: 'travel', place: 'Lecce → Bari → Málaga → Granada 🌹', morning: 'Tren Lecce→Bari.', afternoon: 'Vuelo Bari→Málaga.', evening: 'Tren AVANT Málaga 18:50 → Granada 20:00. Cena en mi lugar en el mundo.', sleeping: 'Granada', work: false, mapsQuery: 'Granada, Spain' },
  { date: '2026-06-13', day: 'Sáb', city: 'granada', place: 'Mi lugar en el mundo 🌹', morning: '', afternoon: '', evening: '', sleeping: 'Granada', work: false, mapsQuery: 'Granada, Spain' },
  { date: '2026-06-14', day: 'Dom', city: 'granada', place: 'Mi lugar en el mundo 🌹', morning: '', afternoon: '', evening: '', sleeping: 'Granada', work: false, mapsQuery: '' },
  { date: '2026-06-15', day: 'Lun', city: 'granada', place: 'Mi lugar en el mundo 🌹', morning: '', afternoon: '', evening: '', sleeping: 'Granada', work: false, mapsQuery: '' },
  { date: '2026-06-16', day: 'Mar', city: 'granada', place: 'Mi lugar en el mundo 🌹', morning: '', afternoon: '', evening: '', sleeping: 'Granada', work: false, mapsQuery: '' },
  { date: '2026-06-17', day: 'Mié', city: 'malaga', place: 'Granada → Málaga', morning: 'Mañana Granada (despedida).', afternoon: 'Tren AVANT 18:50 → Málaga 20:00.', evening: 'Cena en Málaga.', sleeping: 'Málaga', work: false, mapsQuery: 'Málaga, Spain' },
  { date: '2026-06-18', day: 'Jue', city: 'malaga', place: 'Ronda + Málaga', morning: 'Tren 8:08 Málaga→Ronda (1h45). Puente Nuevo, casco antiguo, plaza de toros.', afternoon: 'Almuerzo en Ronda. Vuelta a Málaga.', evening: 'Alcazaba, Teatro Romano. Tapas en El Pimpi.', sleeping: 'Málaga', work: false, mapsQuery: 'Ronda, Spain' },
  { date: '2026-06-19', day: 'Vie', city: 'travel', place: 'Málaga → Milán', morning: 'Mañana Málaga relax: Gibralfaro, Mercado Atarazanas, Picasso.', afternoon: 'Tren Cercanías al aeropuerto. Vuelo 15:10.', evening: 'Llegada Milán Bergamo 17:50. Bus a Milán Centrale.', sleeping: 'Milán', work: false, mapsQuery: 'Milano, Italy' },
  { date: '2026-06-20', day: 'Sáb', city: 'milan', place: 'Milán clásico', morning: 'Duomo + terraza, Galleria, Scala.', afternoon: 'Brera, Castello Sforzesco, Parco Sempione.', evening: 'Bosco Verticale. Aperitivo en Navigli.', sleeping: 'Milán', work: false, mapsQuery: 'Duomo di Milano' },
  { date: '2026-06-21', day: 'Dom', city: 'milan', place: 'Bergamo en el día', morning: 'Tren a Bergamo (50 min). Bergamo Alta.', afternoon: 'Piazza Vecchia, Santa Maria Maggiore, Capilla Colleoni. Almuerzo bergamasco.', evening: 'Vuelta a Milán. Cena despedida.', sleeping: 'Milán', work: false, mapsQuery: 'Bergamo Alta' },
  { date: '2026-06-22', day: 'Lun', city: 'travel', place: 'Vuelta a Argentina', morning: 'Malpensa Express → vuelo a casa.', afternoon: 'Llegar 3hs antes.', evening: 'Mañana 23 ya estás laburando. Bienvenida a tu vida real ✨', sleeping: 'Avión / Casa', work: false, mapsQuery: '' }
];

const BLOCKS = [
  { id: 'llegada', icon: '✈️', title: 'Llegada', dates: '18-19 may', firstDay: '2026-05-18', weather: '' },
  { id: 'chieti', icon: '🏔️', title: 'Chieti', dates: '20 may - 5 jun', firstDay: '2026-05-20', weather: '🌤️ 18-25°C · primaveral · lluvias ocasionales' },
  { id: 'puglia', icon: '🫒', title: 'Puglia', dates: '6-12 jun', firstDay: '2026-06-06', weather: '☀️ 25-30°C · soleado · mar caliente' },
  { id: 'andalucia', icon: '🌹', title: 'Andalucía', dates: '12-19 jun', firstDay: '2026-06-12', weather: '🔥 28-35°C · calor seco · llevar agua' },
  { id: 'milan', icon: '⛪', title: 'Milán', dates: '19-21 jun', firstDay: '2026-06-19', weather: '🌤️ 22-28°C · agradable · noches frescas' },
  { id: 'vuelta', icon: '🏠', title: 'Vuelta', dates: '22 jun', firstDay: '2026-06-22', weather: '' },
];

const CHECKLIST_ITEMS = [
  { id: 'v1', priority: 1, text: 'Vuelo Bari → Málaga', dateUse: 'Vie 12 jun', notes: 'Ryanair. COMPRAR YA.' },
  { id: 'v2', priority: 1, text: 'Vuelo Málaga → Milán Bergamo', dateUse: 'Vie 19 jun ~15:10', notes: 'Ryanair / EasyJet.' },
  { id: 'v3', priority: 1, text: 'Frecciarossa Milano Centrale → Pescara', dateUse: 'Mar 19 may', notes: 'trenitalia.com - Super Economy.' },
  { id: 'v4', priority: 1, text: 'Alojamiento Sasso en Matera (1 noche)', dateUse: 'Mar 9 jun', notes: 'Booking/Airbnb. Buscar "sasso".' },
  { id: 'a1', priority: 2, text: 'Alojamiento Bari (3 noches)', dateUse: 'Sáb 6 al lun 8 jun', notes: 'Hostel privado o B&B en Bari Vecchia.' },
  { id: 'a2', priority: 2, text: 'Alojamiento Lecce (2 noches)', dateUse: 'Mié 10 al jue 11 jun', notes: 'Hostel privado o B&B.' },
  { id: 'a3', priority: 2, text: 'Alojamiento Granada (5 noches)', dateUse: 'Vie 12 al mar 16 jun', notes: 'Albaicín / Realejo / centro.' },
  { id: 'a4', priority: 2, text: 'Alojamiento Málaga (2 noches)', dateUse: 'Mié 17 al jue 18 jun', notes: 'Centro o cerca María Zambrano.' },
  { id: 'a5', priority: 2, text: 'Alojamiento Milán (2 noches)', dateUse: 'Vie 19 al sáb 20 jun', notes: 'Centrale, Brera, Navigli o Porta Romana.' },
  { id: 'a6', priority: 2, text: 'La Última Cena (Da Vinci) - opcional', dateUse: 'Sáb 20 o dom 21 jun', notes: 'cenacolovinciano.org' },
  { id: 't1', priority: 3, text: 'Tren AVANT Málaga → Granada', dateUse: 'Vie 12 jun (18:50)', notes: 'renfe.com en mayo.' },
  { id: 't2', priority: 3, text: 'Tren AVANT Granada → Málaga', dateUse: 'Mié 17 jun (18:50)', notes: 'renfe.com en mayo.' },
  { id: 't3', priority: 3, text: 'Tren Frecciarossa Chieti → Bari', dateUse: 'Sáb 6 jun temprano', notes: 'Comprar en mayo.' },
  { id: 't4', priority: 3, text: 'B&B Scanno (1 noche)', dateUse: 'Sáb 30 may', notes: 'Booking. Pueblo chico.' },
  { id: 't5', priority: 3, text: 'Cripta del Peccato Originale - opcional', dateUse: 'Mié 10 jun', notes: 'criptadelpeccatooriginale.it' },
  { id: 'l1', priority: 4, text: 'Tren regional Pescara → Chieti', dateUse: 'Mar 19 may', notes: 'En la estación. 15 min.' },
  { id: 'l2', priority: 4, text: 'Tren Chieti → Sulmona ida y vuelta', dateUse: 'Dom 25 may', notes: 'Regional.' },
  { id: 'l3', priority: 4, text: 'Tren + bus Chieti → Sulmona → Scanno', dateUse: 'Sáb 30 may', notes: 'App TUA mycicero.' },
  { id: 'l4', priority: 4, text: 'Trenes regionales Puglia', dateUse: '7-11 jun', notes: 'Bari-Polignano, Bari-Alberobello, etc.' },
  { id: 'l5', priority: 4, text: 'Bus Bari ↔ Matera', dateUse: '9-10 jun', notes: 'busmiccolis.com / flixbus.com' },
  { id: 'l6', priority: 4, text: 'Tren Málaga ↔ Ronda', dateUse: 'Jue 18 jun', notes: 'Salida 8:08 hs Málaga.' },
  { id: 'l7', priority: 4, text: 'Bus Bergamo aeropuerto → Milán', dateUse: 'Vie 19 jun llegada', notes: 'En aeropuerto, 1h.' },
  { id: 'l8', priority: 4, text: 'Tren Milán ↔ Bergamo', dateUse: 'Dom 21 jun', notes: 'Regional, 50 min.' },
  { id: 'l9', priority: 4, text: 'Malpensa Express → aeropuerto', dateUse: 'Lun 22 jun', notes: '50 min.' },
  { id: 'o1', priority: 5, text: 'Tarjeta Wise o Revolut', dateUse: 'Antes', notes: 'Para evitar comisiones argentinas.' },
  { id: 'o2', priority: 5, text: 'eSIM (Holafly o Airalo)', dateUse: 'Antes', notes: '30 días con datos.' },
  { id: 'o3', priority: 5, text: 'Avisar al banco fechas y países', dateUse: 'Antes', notes: 'Para que no bloqueen tarjetas.' },
  { id: 'o4', priority: 5, text: 'Foto pasaporte + scans en Drive', dateUse: 'Antes', notes: 'Compartir con persona de confianza.' },
  { id: 'o5', priority: 5, text: 'Apps: TUA mycicero, Trenitalia, Renfe, Ryanair', dateUse: 'Antes', notes: 'Bajar todas las apps.' },
];

const PRIORITY_LABELS = {
  1: { name: 'Nivel 1 · Comprar ya', class: 'urgent' },
  2: { name: 'Nivel 2 · 2-3 semanas', class: 'priority2' },
  3: { name: 'Nivel 3 · En mayo', class: 'priority3' },
  4: { name: 'Nivel 4 · Allá', class: 'priority4' },
  5: { name: 'Otros', class: 'others' },
};

const CITY_NAMES = { chieti: 'Chieti / Abruzzo', puglia: 'Puglia / Matera', granada: 'Granada', malaga: 'Málaga', milan: 'Milán', travel: 'Viaje' };
const CITY_ICONS = { chieti: '🏔️', puglia: '🫒', granada: '🌹', malaga: '🌊', milan: '⛪', travel: '✈️' };

const PLACE_TYPES = [
  { id: 'hotel', label: 'Alojamiento', icon: '🛏️' },
  { id: 'restaurant', label: 'Restaurante', icon: '🍽️' },
  { id: 'attraction', label: 'Atracción', icon: '🏛️' },
  { id: 'cafe', label: 'Café / Bar', icon: '☕' },
  { id: 'transport', label: 'Transporte', icon: '🚂' },
  { id: 'other', label: 'Otro', icon: '📍' },
];

const EXPENSE_CATEGORIES = [
  { id: 'transporte', name: 'Transporte', color: '#22223b' },
  { id: 'alojamiento', name: 'Alojamiento', color: '#4a4e69' },
  { id: 'comida', name: 'Comida', color: '#9a8c98' },
  { id: 'entradas', name: 'Entradas', color: '#c9ada7' },
  { id: 'otros', name: 'Otros', color: '#7d6e7a' },
];

// ============= STATE =============
let state = {
  checklist: {},
  expenses: [],
  exchangeRate: 1100,
  notes: {},
  dayOverrides: {},
  places: {},
  dayPhotos: {},
  customTasks: []  // [{id, text, dateUse, notes, priority, custom: true}]
};

function loadState() {
  try {
    const saved = localStorage.getItem('viaje2026-v2');
    if (saved) {
      state = { ...state, ...JSON.parse(saved) };
    } else {
      // Migración desde v1 si existe
      const oldSaved = localStorage.getItem('viaje2026');
      if (oldSaved) {
        const old = JSON.parse(oldSaved);
        state.exchangeRate = old.exchangeRate || 1100;
        state.notes = old.notes || {};
        // Convertir checklist v1 (con actualCost) a expenses v2
        if (old.checklist) {
          Object.keys(old.checklist).forEach(id => {
            const item = CHECKLIST_ITEMS.find(i => i.id === id);
            if (item) {
              state.checklist[id] = true;
              if (old.checklist[id].actualCost) {
                const text = item.text.toLowerCase();
                let cat = 'otros';
                if (text.includes('vuelo') || text.includes('tren') || text.includes('bus') || text.includes('frecciarossa') || text.includes('avant') || text.includes('malpensa')) cat = 'transporte';
                else if (text.includes('alojamiento') || text.includes('b&b') || text.includes('sasso')) cat = 'alojamiento';
                else if (text.includes('cena') || text.includes('cripta')) cat = 'entradas';
                state.expenses.push({
                  amount: old.checklist[id].actualCost,
                  category: cat,
                  description: item.text,
                  date: '2026-04-27', // hoy como fecha de carga
                  paid: 'yes'
                });
              }
            }
          });
        }
        saveState();
      }
    }
  } catch (e) { console.warn('Load error:', e); }
}

function saveState() {
  if (FOLLOWING_MODE) return;
  try { localStorage.setItem('viaje2026-v2', JSON.stringify(state)); }
  catch (e) { console.warn('Save error:', e); }
}

// ============= UTILS =============
function getToday() { return new Date().toISOString().split('T')[0]; }
function parseDate(s) { return new Date(s + 'T12:00:00'); }
function formatDate(s, fmt) {
  const d = parseDate(s);
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  if (fmt === 'long') {
    const days = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    return days[d.getDay()] + ' ' + d.getDate() + ' de ' + months[d.getMonth()];
  }
  return d.getDate() + ' ' + months[d.getMonth()];
}
function daysBetween(from, to) {
  return Math.round((parseDate(to) - parseDate(from)) / 86400000);
}
function tomorrowDate() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().split('T')[0];
}

// Get day with overrides applied
function getDay(date) {
  const base = DAYS_BASE.find(d => d.date === date);
  if (!base) return null;
  const override = state.dayOverrides[date] || {};
  return { ...base, ...override };
}

function getAllDays() {
  return DAYS_BASE.map(d => getDay(d.date));
}

function showToast(msg, undoAction) {
  const t = document.getElementById('toast');
  if (undoAction) {
    t.innerHTML = msg + ' <span class="toast-action">DESHACER</span>';
    const action = t.querySelector('.toast-action');
    action.onclick = () => {
      undoAction();
      t.classList.remove('visible');
    };
  } else {
    t.textContent = msg;
  }
  t.classList.add('visible');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('visible'), undoAction ? 5000 : 2400);
}

// ============= TODAY VIEW =============
function renderToday() {
  const today = getToday();
  const tripDay = getDay(today);
  const todayCard = document.getElementById('todayCard');
  const cdCard = document.getElementById('countdownCard');
  
  // Defensive check
  if (!todayCard || !cdCard) {
    console.warn('Missing DOM elements for renderToday');
    return;
  }
  
  if (tripDay) {
    // Estamos en viaje: mostrar el día actual
    const summary = [tripDay.morning, tripDay.afternoon, tripDay.evening].filter(Boolean).join(' · ');
    todayCard.innerHTML = `
      <div class="hero-today" onclick="openDayDetail('${today}')" style="cursor:pointer;">
        <div class="today-eyebrow">Hoy · ${formatDate(today, 'long')}</div>
        <div class="today-title">${tripDay.place}</div>
        <div class="today-subtitle">${summary || 'Sin plan registrado todavía'}</div>
        <div class="today-meta">
          <div class="meta-pill">🛏️ ${tripDay.sleeping}</div>
          ${tripDay.work ? '<div class="meta-pill">💻 trabajo 14-23</div>' : '<div class="meta-pill">🌴 libre</div>'}
          ${tripDay.mapsQuery ? `<div class="meta-pill clickable" onclick="event.stopPropagation();openMaps('${tripDay.mapsQuery}')">📍 maps</div>` : ''}
        </div>
      </div>
    `;
    cdCard.innerHTML = '';
  } else {
    const days = daysBetween(today, TRIP.startDate);
    
    if (days > 0) {
      // Antes del viaje: countdown grande + fecha de hoy
      todayCard.innerHTML = `
        <div class="hero-today" style="text-align:center;padding:20px 24px;">
          <div class="today-eyebrow">Hoy</div>
          <div class="today-title" style="font-size:24px;">${formatDate(today, 'long')}</div>
        </div>
      `;
      const totalDays = daysBetween('2026-01-01', TRIP.startDate);
      const elapsed = daysBetween('2026-01-01', today);
      const progress = Math.max(0, Math.min(100, (elapsed/totalDays)*100));
      cdCard.innerHTML = `
        <div class="countdown-wrap">
          <div class="countdown-label">Faltan</div>
          <div class="countdown-number">${days}</div>
          <div class="countdown-suffix">días para Italia ✈</div>
          <div class="countdown-progress"><div class="countdown-progress-fill" style="width:${progress}%"></div></div>
        </div>
      `;
    } else if (today > TRIP.endDate) {
      cdCard.innerHTML = '';
      todayCard.innerHTML = `<div class="hero-today"><div class="today-eyebrow">Viaje terminado</div><div class="today-title">¡Bienvenida a casa!</div><div class="today-subtitle">Esperamos que la hayas pasado increíble.</div></div>`;
    } else {
      cdCard.innerHTML = '';
      todayCard.innerHTML = '<div class="hero-today"><div class="today-eyebrow">Hoy</div><div class="today-title">Día sin plan</div></div>';
    }
  }
  
  renderBlockGrid();
}

function renderBlockGrid() {
  document.getElementById('blockGrid').innerHTML = BLOCKS.map(b => `
    <div class="block-card" onclick="goToBlock('${b.firstDay}')">
      <div class="block-card-icon">${b.icon}</div>
      <div class="block-card-content">
        <div class="block-card-title">${b.title}</div>
        <div class="block-card-dates">${b.dates}</div>
        ${b.weather ? `<div class="block-card-weather">${b.weather}</div>` : ''}
      </div>
      <div class="block-card-arrow">→</div>
    </div>
  `).join('');
}

function goToBlock(firstDay) {
  switchTab('calendar');
  setTimeout(() => {
    const el = document.querySelector('[data-day="' + firstDay + '"]');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 120);
}

// ============= CALENDAR =============
function renderCalendar() {
  const today = getToday();
  const list = document.getElementById('dayList');
  const months = { '2026-05': 'Mayo', '2026-06': 'Junio' };
  const monthsShort = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  let html = '';
  let lastMonth = '';
  
  getAllDays().forEach(d => {
    const monthKey = d.date.substring(0, 7);
    if (monthKey !== lastMonth) {
      html += '<div class="month-sep">' + months[monthKey] + '</div>';
      lastMonth = monthKey;
    }
    const dt = parseDate(d.date);
    const isToday = d.date === today;
    const isPast = d.date < today;
    const cls = isToday ? 'today' : (isPast ? 'past' : '');
    
    const summary = [d.morning, d.afternoon, d.evening].filter(Boolean).join(' · ');
    const summaryShort = summary.length > 100 ? summary.substring(0, 100) + '…' : (summary || 'Sin plan registrado');
    
    html += `
      <div class="day-item ${cls}" data-day="${d.date}" onclick="openDayDetail('${d.date}')">
        <div class="day-date">
          <div class="day-num">${dt.getDate()}</div>
          <div class="day-mes">${monthsShort[dt.getMonth()]}</div>
          <div class="day-dia">${d.day}</div>
        </div>
        <div class="day-info">
          <div class="day-place">${d.place}</div>
          <div class="day-summary">${summaryShort}</div>
          <div class="day-meta-row">
            <div class="day-meta-pill">🛏️ ${d.sleeping}</div>
            ${d.work ? '<div class="day-meta-pill">💻 trabajo</div>' : ''}
          </div>
        </div>
      </div>
    `;
  });
  list.innerHTML = html;
}

let _currentDayDetail = null;

function openDayDetail(date) {
  const d = getDay(date);
  if (!d) return;
  _currentDayDetail = date;
  
  document.getElementById('ddDate').textContent = formatDate(date, 'long');
  document.getElementById('ddTitle').textContent = d.place;
  
  // Header con chips: ciudad + alojamiento + trabajo
  let headerHtml = `<div style="font-size:13px;font-weight:400;opacity:0.85;">${CITY_ICONS[d.city]} ${CITY_NAMES[d.city]}</div>`;
  headerHtml += '<div class="day-header-chips">';
  if (d.sleeping) {
    const mapsUrl = d.mapsQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.sleeping + ' ' + d.mapsQuery)}` : null;
    if (mapsUrl) {
      headerHtml += `<a href="${mapsUrl}" target="_blank" class="day-header-chip">🛏️ ${d.sleeping} →</a>`;
    } else {
      headerHtml += `<span class="day-header-chip">🛏️ ${d.sleeping}</span>`;
    }
  }
  if (d.work) headerHtml += `<span class="day-header-chip work">💻 trabajo 14-23</span>`;
  if (d.mapsQuery && !d.sleeping) headerHtml += `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.mapsQuery)}" target="_blank" class="day-header-chip">📍 Maps →</a>`;
  headerHtml += '</div>';
  document.getElementById('ddPlace').innerHTML = headerHtml;
  
  const expenses = state.expenses.filter(e => e.date === date);
  const totalExp = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const note = state.notes[date] || '';
  const places = state.places[date] || [];
  const photo = state.dayPhotos[date];
  
  let html = '';
  
  // FOTO DEL DÍA (si existe, arriba)
  if (photo) {
    html += `
      <div class="day-photo-section">
        <img src="${photo}" class="day-photo" onclick="openPhotoModal('${date}')" alt="Foto del día">
        ${!FOLLOWING_MODE ? `
        <div class="day-photo-overlay">
          <div class="day-photo-btn" onclick="changeDayPhoto('${date}')" title="Cambiar">📷</div>
          <div class="day-photo-btn" onclick="removeDayPhoto('${date}')" title="Borrar">🗑</div>
        </div>` : ''}
      </div>
    `;
  } else if (!FOLLOWING_MODE) {
    html += `
      <button class="add-photo-btn" onclick="changeDayPhoto('${date}')">
        📷 <span>Agregar foto del día</span>
      </button>
    `;
  }
  
  // EL DÍA - mañana / tarde / noche con tap directo para editar
  html += `
    <div class="day-section-card">
      <div class="day-section-label">
        <span>El día</span>
        ${!FOLLOWING_MODE ? `<span class="day-section-label-edit" onclick="editAllDay('${date}')">✏️ Editar todo</span>` : ''}
      </div>
      <div class="moments">
        <div class="moment-block" ${!FOLLOWING_MODE ? `onclick="editSingleMoment('${date}','morning')"` : ''}>
          <div class="moment-icon-wrap">🌅</div>
          <div class="moment-content">
            <div class="moment-label">Mañana</div>
            <div class="moment-text ${!d.morning ? 'empty' : ''}">${d.morning || (FOLLOWING_MODE ? '—' : 'Tocá para agregar')}</div>
          </div>
        </div>
        <div class="moment-block" ${!FOLLOWING_MODE ? `onclick="editSingleMoment('${date}','afternoon')"` : ''}>
          <div class="moment-icon-wrap">☀️</div>
          <div class="moment-content">
            <div class="moment-label">Tarde</div>
            <div class="moment-text ${!d.afternoon ? 'empty' : ''}">${d.afternoon || (FOLLOWING_MODE ? '—' : 'Tocá para agregar')}</div>
          </div>
        </div>
        <div class="moment-block" ${!FOLLOWING_MODE ? `onclick="editSingleMoment('${date}','evening')"` : ''}>
          <div class="moment-icon-wrap">🌙</div>
          <div class="moment-content">
            <div class="moment-label">Noche</div>
            <div class="moment-text ${!d.evening ? 'empty' : ''}">${d.evening || (FOLLOWING_MODE ? '—' : 'Tocá para agregar')}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // NOTAS - arriba, después de "El día"
  if (!FOLLOWING_MODE) {
    html += `
      <div class="notes-section">
        <div class="day-section-card">
          <div class="day-section-label"><span>Notas</span></div>
          <textarea class="notes-textarea-compact" id="dayNote" placeholder="Algo que quieras recordar..." onblur="autoSaveNote('${date}')">${note}</textarea>
        </div>
      </div>
    `;
  } else if (note) {
    html += `
      <div class="day-section-card">
        <div class="day-section-label"><span>Notas</span></div>
        <div class="day-section-text">${note}</div>
      </div>
    `;
  }
  
  // LUGARES - solo si hay alguno o si no estás en modo siguiendo
  if (places.length > 0) {
    html += '<div class="day-section-card"><div class="day-section-label"><span>Lugares</span>';
    if (!FOLLOWING_MODE) html += `<span class="day-section-label-edit" onclick="addPlace('${date}')">+ Agregar</span>`;
    html += '</div><div class="places-list">';
    places.forEach((p, idx) => {
      const typeData = PLACE_TYPES.find(t => t.id === p.type) || PLACE_TYPES[5];
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((p.mapsQuery || p.name) + ' ' + (d.mapsQuery || ''))}`;
      html += `
        <div class="place-card">
          <div class="place-icon">${typeData.icon}</div>
          <div class="place-info">
            <div class="place-name">${p.name}</div>
            <div class="place-type">${typeData.label}</div>
          </div>
          <div class="place-actions">
            <a href="${mapsUrl}" target="_blank" class="place-btn" title="Maps">📍</a>
            ${p.link ? `<a href="${p.link}" target="_blank" class="place-btn" title="Link">🔗</a>` : ''}
            ${!FOLLOWING_MODE ? `<button class="place-btn" onclick="deletePlace('${date}',${idx})" title="Borrar">🗑</button>` : ''}
          </div>
        </div>
      `;
    });
    html += '</div></div>';
  } else if (!FOLLOWING_MODE) {
    // Sin sección, solo botón discreto
    html += `<button class="add-place-btn" onclick="addPlace('${date}')" style="width:100%;justify-content:center;margin-bottom:12px;">📍 Agregar un lugar (hotel, resto, atracción)</button>`;
  }
  
  // GASTOS DEL DÍA
  if (!FOLLOWING_MODE && expenses.length > 0) {
    html += '<div class="day-section-card"><div class="day-section-label"><span>Gastos del día</span></div>';
    expenses.forEach(e => {
      html += `<div style="display:flex;justify-content:space-between;font-size:13px;padding:5px 0;"><span>${e.description || EXPENSE_CATEGORIES.find(c=>c.id===e.category)?.name}</span><span style="font-weight:600;">${parseFloat(e.amount).toFixed(2)} EU</span></div>`;
    });
    html += `<div style="display:flex;justify-content:space-between;border-top:1px solid var(--parchment-dark);margin-top:8px;padding-top:10px;font-weight:600;font-size:14px;"><span>Total</span><span>${totalExp.toFixed(2)} EU</span></div></div>`;
  }
  
  // NAVEGACIÓN ANTERIOR/SIGUIENTE
  const allDays = getAllDays();
  const idx = allDays.findIndex(x => x.date === date);
  const prev = idx > 0 ? allDays[idx-1] : null;
  const next = idx < allDays.length - 1 ? allDays[idx+1] : null;
  
  html += '<div class="day-nav">';
  if (prev) html += `<button class="day-nav-btn" onclick="openDayDetail('${prev.date}')"><span>←</span><div><div style="font-size:10px;opacity:0.6;">Anterior</div><div>${formatDate(prev.date)}</div></div></button>`;
  else html += '<div style="flex:1;"></div>';
  if (next) html += `<button class="day-nav-btn next" onclick="openDayDetail('${next.date}')"><div style="text-align:right;"><div style="font-size:10px;opacity:0.6;">Siguiente</div><div>${formatDate(next.date)}</div></div><span>→</span></button>`;
  else html += '<div style="flex:1;"></div>';
  html += '</div>';
  
  document.getElementById('ddBody').innerHTML = html;
  document.getElementById('dayDetail').classList.add('active');
  document.getElementById('dayDetail').scrollTo(0, 0);
}

// Auto-save de notas al perder foco (sin botón)
function autoSaveNote(date) {
  const val = document.getElementById('dayNote').value;
  if (state.notes[date] !== val) {
    state.notes[date] = val;
    saveState();
    showToast('Nota guardada');
  }
}

// EDITAR TODO EL DÍA en un solo modal
function editAllDay(date) {
  const d = getDay(date);
  showEditModal({
    title: 'Editar día',
    subtitle: formatDate(date, 'long'),
    fields: [
      { label: 'Título del día', name: 'place', type: 'text', value: d.place },
      { label: '🌅 Mañana', name: 'morning', type: 'textarea', value: d.morning || '' },
      { label: '☀️ Tarde', name: 'afternoon', type: 'textarea', value: d.afternoon || '' },
      { label: '🌙 Noche', name: 'evening', type: 'textarea', value: d.evening || '' },
      { label: 'Dónde duermo', name: 'sleeping', type: 'text', value: d.sleeping },
      { label: 'Ciudad para Maps (referencia)', name: 'mapsQuery', type: 'text', value: d.mapsQuery || '' },
    ],
    onSave: (vals) => {
      state.dayOverrides[date] = { ...state.dayOverrides[date], ...vals };
      saveState();
      openDayDetail(date);
      showToast('Día actualizado');
    }
  });
}

// Editar UN solo momento (mañana/tarde/noche)
function editSingleMoment(date, moment) {
  const d = getDay(date);
  const labels = { morning: '🌅 Mañana', afternoon: '☀️ Tarde', evening: '🌙 Noche' };
  showEditModal({
    title: labels[moment],
    subtitle: formatDate(date, 'long'),
    fields: [
      { label: 'Qué hacés', name: moment, type: 'textarea', value: d[moment] || '', autofocus: true },
    ],
    onSave: (vals) => {
      state.dayOverrides[date] = { ...state.dayOverrides[date], ...vals };
      saveState();
      openDayDetail(date);
      showToast('Guardado');
    }
  });
}

// FOTO DEL DÍA
function changeDayPhoto(date) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 1200;
        let w = img.width, h = img.height;
        if (w > h && w > maxSize) { h = h * maxSize / w; w = maxSize; }
        else if (h > maxSize) { w = w * maxSize / h; h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        state.dayPhotos[date] = dataUrl;
        saveState();
        openDayDetail(date);
        showToast('Foto guardada');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function removeDayPhoto(date) {
  const oldPhoto = state.dayPhotos[date];
  delete state.dayPhotos[date];
  saveState();
  openDayDetail(date);
  showToast('Foto eliminada', () => {
    state.dayPhotos[date] = oldPhoto;
    saveState();
    openDayDetail(date);
  });
}

function openPhotoModal(date) {
  const photo = state.dayPhotos[date];
  if (!photo) return;
  document.getElementById('photoModalImg').src = photo;
  document.getElementById('photoModal').classList.add('active');
}

function closePhotoModal() {
  document.getElementById('photoModal').classList.remove('active');
}

function closeDayDetail() {
  document.getElementById('dayDetail').classList.remove('active');
  _currentDayDetail = null;
}

// EDITAR DÍA: el botón ✏️ del header abre el editor completo
function editDayHeader() {
  if (!_currentDayDetail) return;
  editAllDay(_currentDayDetail);
}

function addPlace(date) {
  showEditModal({
    title: 'Agregar lugar',
    subtitle: 'Hotel, restaurante, atracción...',
    fields: [
      { label: 'Nombre', name: 'name', type: 'text', value: '', autofocus: true },
      { label: 'Tipo', name: 'type', type: 'select', options: PLACE_TYPES.map(t => ({ value: t.id, label: t.icon + ' ' + t.label })), value: 'attraction' },
      { label: 'Búsqueda en Maps (opcional, ayuda a encontrarlo)', name: 'mapsQuery', type: 'text', value: '' },
      { label: 'Link (Booking, Airbnb, web, etc)', name: 'link', type: 'text', value: '' },
    ],
    onSave: (vals) => {
      if (!vals.name) return;
      if (!state.places[date]) state.places[date] = [];
      state.places[date].push(vals);
      saveState();
      openDayDetail(date);
      showToast('Lugar agregado');
    }
  });
}

function deletePlace(date, idx) {
  const oldPlace = state.places[date][idx];
  state.places[date].splice(idx, 1);
  if (state.places[date].length === 0) delete state.places[date];
  saveState();
  openDayDetail(date);
  showToast('Lugar borrado', () => {
    if (!state.places[date]) state.places[date] = [];
    state.places[date].splice(idx, 0, oldPlace);
    saveState();
    openDayDetail(date);
  });
}

// ============= CHECKLIST =============
function getAllTasks() {
  // Combina tareas predefinidas + custom
  return [...CHECKLIST_ITEMS, ...state.customTasks];
}

function renderChecklist() {
  const cont = document.getElementById('checklistContainer');
  const all = getAllTasks();
  let html = '';
  
  for (let p = 1; p <= 5; p++) {
    const items = all.filter(i => i.priority === p);
    if (items.length === 0) continue;
    const done = items.filter(i => state.checklist[i.id]).length;
    const meta = PRIORITY_LABELS[p];
    
    html += `
      <div class="checklist-section ${meta.class}">
        <div class="checklist-section-header">
          <span>${meta.name}</span>
          <span class="checklist-counter">${done}/${items.length}</span>
        </div>
        ${items.map(i => `
          <div class="checklist-item ${state.checklist[i.id] ? 'done' : ''}">
            <div class="checkbox ${state.checklist[i.id] ? 'checked' : ''}" onclick="toggleChecklist('${i.id}')"></div>
            <div class="item-content" onclick="toggleChecklist('${i.id}')">
              <div class="item-name">${i.text}${i.custom ? ' <span style="font-size:10px;color:var(--lilac);">· mía</span>' : ''}</div>
              <div class="item-meta">${i.dateUse || ''}</div>
              ${i.notes ? `<div class="item-meta" style="font-style:italic;margin-top:3px">${i.notes}</div>` : ''}
            </div>
            ${i.custom ? `<button class="item-edit" onclick="editCustomTask('${i.id}')">✏️</button>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }
  
  if (all.length === 0) {
    html = '<div class="empty-state"><div class="empty-state-icon">✓</div><div class="empty-state-text">Sin tareas todavía. Tocá <strong>+ Nueva tarea</strong> arriba.</div></div>';
  }
  
  cont.innerHTML = html;
}

function toggleChecklist(id) {
  if (state.checklist[id]) {
    delete state.checklist[id];
  } else {
    state.checklist[id] = true;
  }
  saveState();
  renderChecklist();
}

function addCustomTask() {
  showEditModal({
    title: 'Nueva tarea',
    subtitle: 'Algo que tenés que hacer o reservar',
    fields: [
      { label: 'Tarea', name: 'text', type: 'text', value: '', autofocus: true },
      { label: 'Cuándo (referencia)', name: 'dateUse', type: 'text', value: '' },
      { label: 'Prioridad', name: 'priority', type: 'select', options: [
        { value: '1', label: '🔥 Nivel 1 - Comprar ya' },
        { value: '2', label: '📅 Nivel 2 - 2-3 semanas' },
        { value: '3', label: '📌 Nivel 3 - En mayo' },
        { value: '4', label: '✈️ Nivel 4 - Allá' },
        { value: '5', label: '💳 Otros' },
      ], value: '4' },
      { label: 'Notas (opcional)', name: 'notes', type: 'textarea', value: '' },
    ],
    onSave: (vals) => {
      if (!vals.text) return;
      const id = 'custom_' + Date.now();
      state.customTasks.push({
        id,
        text: vals.text,
        dateUse: vals.dateUse,
        notes: vals.notes,
        priority: parseInt(vals.priority),
        custom: true
      });
      saveState();
      renderChecklist();
      showToast('Tarea agregada');
    }
  });
}

function editCustomTask(id) {
  const idx = state.customTasks.findIndex(t => t.id === id);
  if (idx < 0) return;
  const t = state.customTasks[idx];
  showEditModal({
    title: 'Editar tarea',
    subtitle: 'Tarea propia',
    fields: [
      { label: 'Tarea', name: 'text', type: 'text', value: t.text },
      { label: 'Cuándo', name: 'dateUse', type: 'text', value: t.dateUse || '' },
      { label: 'Prioridad', name: 'priority', type: 'select', options: [
        { value: '1', label: '🔥 Nivel 1 - Comprar ya' },
        { value: '2', label: '📅 Nivel 2 - 2-3 semanas' },
        { value: '3', label: '📌 Nivel 3 - En mayo' },
        { value: '4', label: '✈️ Nivel 4 - Allá' },
        { value: '5', label: '💳 Otros' },
      ], value: String(t.priority) },
      { label: 'Notas', name: 'notes', type: 'textarea', value: t.notes || '' },
    ],
    onSave: (vals) => {
      state.customTasks[idx] = { ...t, ...vals, priority: parseInt(vals.priority) };
      saveState();
      renderChecklist();
      showToast('Actualizada');
    },
    onDelete: () => {
      const oldTask = state.customTasks[idx];
      state.customTasks.splice(idx, 1);
      delete state.checklist[id];
      saveState();
      renderChecklist();
      showToast('Tarea borrada', () => {
        state.customTasks.splice(idx, 0, oldTask);
        saveState();
        renderChecklist();
      });
    }
  });
}

// ============= BUDGET / EXPENSES =============
function renderBudget() {
  const totalSpent = state.expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const totalPaid = state.expenses.filter(e => e.paid !== 'no').reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const totalPending = totalSpent - totalPaid;
  const budgetEstimate = 3300;
  const pct = Math.min(100, (totalSpent / budgetEstimate) * 100);
  
  document.getElementById('budgetSummary').innerHTML = `
    <div class="budget-row"><span>Presupuesto estimado</span><span>${budgetEstimate.toFixed(0)} EU</span></div>
    <div class="budget-row"><span>Pagado</span><span>${totalPaid.toFixed(2)} EU</span></div>
    ${totalPending > 0 ? `<div class="budget-row"><span>Pendiente de pagar</span><span>${totalPending.toFixed(2)} EU</span></div>` : ''}
    <div class="budget-row big"><span>Total</span><span>${totalSpent.toFixed(2)} EU</span></div>
    <div class="budget-bar">
      <div class="budget-bar-fill ${totalSpent > budgetEstimate ? 'over' : ''}" style="width:${pct}%"></div>
    </div>
    <div style="font-size:10px;opacity:0.6;margin-top:8px;text-align:right;font-weight:500;">${pct.toFixed(0)}% del presupuesto</div>
  `;
  
  const catTotals = {};
  EXPENSE_CATEGORIES.forEach(c => catTotals[c.id] = 0);
  state.expenses.forEach(e => {
    if (catTotals[e.category] !== undefined) catTotals[e.category] += parseFloat(e.amount) || 0;
  });
  
  const maxCat = Math.max(...Object.values(catTotals), 1);
  document.getElementById('categoryBars').innerHTML = EXPENSE_CATEGORIES.map(c => `
    <div class="cat-bar">
      <div class="cat-bar-header">
        <span>${c.name}</span>
        <span style="font-weight:500;">${catTotals[c.id].toFixed(0)} EU</span>
      </div>
      <div class="cat-bar-track">
        <div class="cat-bar-fill" style="width:${(catTotals[c.id]/maxCat)*100}%;background:${c.color}"></div>
      </div>
    </div>
  `).join('');
  
  const exList = document.getElementById('expensesList');
  document.getElementById('expensesCount').textContent = state.expenses.length > 0 ? `${state.expenses.length} ${state.expenses.length === 1 ? 'gasto' : 'gastos'}` : '';
  
  if (state.expenses.length === 0) {
    exList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💸</div><div class="empty-state-text">Sin gastos cargados.<br>Tocá <strong>+ Nuevo gasto</strong> o el botón <strong>+</strong> abajo.</div></div>';
  } else {
    const sorted = [...state.expenses].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    exList.innerHTML = sorted.map((e) => {
      const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category) || { name: e.category };
      const realIdx = state.expenses.indexOf(e);
      return `
        <div class="expense-item" onclick="editExpense(${realIdx})">
          <div class="expense-info">
            <div class="expense-cat">${cat.name}</div>
            <div class="expense-desc">${e.description || cat.name}</div>
            <div class="expense-date">${e.date ? formatDate(e.date) : 'Sin fecha'}</div>
          </div>
          <div class="expense-amount-wrap">
            <div class="expense-amount">${parseFloat(e.amount).toFixed(2)} EU</div>
            ${e.paid === 'no' ? '<div class="expense-paid">PENDIENTE</div>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }
}

function openAddExpense(presetData) {
  showEditModal({
    title: 'Nuevo gasto',
    subtitle: 'Vuelo, hotel, comida, lo que sea',
    fields: [
      { label: 'Monto (EU)', name: 'amount', type: 'number', value: presetData?.amount || '', autofocus: true },
      { label: 'Categoría', name: 'category', type: 'select', options: EXPENSE_CATEGORIES.map(c => ({ value: c.id, label: c.name })), value: presetData?.category || 'comida' },
      { label: 'Qué fue', name: 'description', type: 'text', value: presetData?.description || '' },
      { label: 'Fecha', name: 'date', type: 'date', value: presetData?.date || getToday() },
      { label: 'Estado', name: 'paid', type: 'select', options: [{value:'yes',label:'Ya pagado'},{value:'no',label:'Pendiente de pagar'}], value: presetData?.paid || 'yes' },
    ],
    onSave: (vals) => {
      if (!vals.amount) return;
      state.expenses.push({ ...vals, addedAt: new Date().toISOString() });
      saveState();
      renderBudget();
      showToast('Gasto guardado');
    }
  });
}

function editExpense(idx) {
  const e = state.expenses[idx];
  if (!e) return;
  showEditModal({
    title: 'Editar gasto',
    subtitle: e.description || EXPENSE_CATEGORIES.find(c=>c.id===e.category)?.name,
    fields: [
      { label: 'Monto (EU)', name: 'amount', type: 'number', value: e.amount },
      { label: 'Categoría', name: 'category', type: 'select', options: EXPENSE_CATEGORIES.map(c => ({ value: c.id, label: c.name })), value: e.category },
      { label: 'Qué fue', name: 'description', type: 'text', value: e.description || '' },
      { label: 'Fecha', name: 'date', type: 'date', value: e.date || getToday() },
      { label: 'Estado', name: 'paid', type: 'select', options: [{value:'yes',label:'Ya pagado'},{value:'no',label:'Pendiente de pagar'}], value: e.paid || 'yes' },
    ],
    onSave: (vals) => {
      state.expenses[idx] = { ...e, ...vals };
      saveState();
      renderBudget();
      showToast('Actualizado');
    },
    onDelete: () => {
      const oldExp = state.expenses[idx];
      state.expenses.splice(idx, 1);
      saveState();
      renderBudget();
      showToast('Gasto borrado', () => {
        state.expenses.splice(idx, 0, oldExp);
        saveState();
        renderBudget();
      });
    }
  });
}

function quickExpense() {
  showEditModal({
    title: 'Gasto rápido',
    subtitle: 'Solo lo esencial',
    fields: [
      { label: 'Monto (EU)', name: 'amount', type: 'number', value: '', autofocus: true },
      { label: 'Categoría', name: 'category', type: 'select', options: EXPENSE_CATEGORIES.map(c => ({ value: c.id, label: c.name })), value: 'comida' },
      { label: 'Qué fue (opcional)', name: 'description', type: 'text', value: '' },
    ],
    onSave: (vals) => {
      if (!vals.amount) return;
      state.expenses.push({ ...vals, date: getToday(), paid: 'yes', addedAt: new Date().toISOString() });
      saveState();
      renderBudget();
      showToast('Gasto agregado');
    }
  });
}

function updateRate() {
  const v = parseFloat(document.getElementById('rateInput').value);
  if (v > 0) {
    state.exchangeRate = v;
    saveState();
    convertFromEUR();
  }
}
function convertFromARS() {
  const ars = parseFloat(document.getElementById('arsInput').value);
  if (!isNaN(ars)) document.getElementById('eurInput').value = (ars / state.exchangeRate).toFixed(2);
}
function convertFromEUR() {
  const eur = parseFloat(document.getElementById('eurInput').value);
  if (!isNaN(eur)) document.getElementById('arsInput').value = (eur * state.exchangeRate).toFixed(0);
}

// ============= EDIT MODAL =============
function showEditModal({ title, subtitle, fields, onSave, onDelete }) {
  let html = '<div class="edit-handle"></div>';
  html += '<div class="edit-title">' + title + '</div>';
  if (subtitle) html += '<div class="edit-subtitle">' + subtitle + '</div>';
  
  fields.forEach(f => {
    html += '<div class="edit-field"><label class="edit-label">' + f.label + '</label>';
    if (f.type === 'textarea') {
      html += '<textarea class="edit-input edit-textarea" name="' + f.name + '">' + (f.value || '') + '</textarea>';
    } else if (f.type === 'select') {
      html += '<select class="edit-input" name="' + f.name + '">';
      f.options.forEach(o => {
        html += '<option value="' + o.value + '"' + (o.value === f.value ? ' selected' : '') + '>' + o.label + '</option>';
      });
      html += '</select>';
    } else {
      html += '<input class="edit-input" type="' + f.type + '" name="' + f.name + '" value="' + (f.value || '').toString().replace(/"/g, '&quot;') + '"' + (f.autofocus ? ' autofocus' : '') + '>';
    }
    html += '</div>';
  });
  
  html += '<div class="edit-buttons">';
  if (onDelete) html += '<button class="btn btn-secondary" style="background:#fcebec;color:#c44;border-color:#c44;flex:0 0 auto;padding:13px 18px;" onclick="window._editOnDelete()">🗑</button>';
  html += '<button class="btn btn-secondary" onclick="closeEditModal()">Cancelar</button>';
  html += '<button class="btn btn-primary" onclick="saveEditModal()">Guardar</button>';
  html += '</div>';
  
  document.getElementById('editContent').innerHTML = html;
  document.getElementById('editModal').classList.add('active');
  window._editOnSave = onSave;
  window._editOnDelete = onDelete ? () => { onDelete(); closeEditModal(); } : null;
  window._editFields = fields;
  
  setTimeout(() => {
    const auto = document.querySelector('#editContent [autofocus]');
    if (auto) auto.focus();
  }, 100);
}

function saveEditModal() {
  const vals = {};
  window._editFields.forEach(f => {
    const el = document.querySelector('#editContent [name="' + f.name + '"]');
    if (el) vals[f.name] = el.value;
  });
  window._editOnSave(vals);
  closeEditModal();
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
}

// ============= SEARCH =============
function openSearch() {
  document.getElementById('searchModal').classList.add('active');
  setTimeout(() => document.getElementById('searchInput').focus(), 200);
}
function closeSearch() {
  document.getElementById('searchModal').classList.remove('active');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}
function performSearch(q) {
  q = q.toLowerCase().trim();
  if (q.length < 2) {
    document.getElementById('searchResults').innerHTML = '';
    return;
  }
  const results = [];
  getAllDays().forEach(d => {
    const text = (d.place + ' ' + (d.morning || '') + ' ' + (d.afternoon || '') + ' ' + (d.evening || '')).toLowerCase();
    if (text.includes(q)) {
      results.push({ type: 'Día', title: formatDate(d.date) + ' · ' + d.place, meta: (d.morning || d.afternoon || '').substring(0, 60) + '…', action: () => { closeSearch(); openDayDetail(d.date); } });
    }
  });
  CHECKLIST_ITEMS.forEach(i => {
    if (i.text.toLowerCase().includes(q) || (i.notes && i.notes.toLowerCase().includes(q))) {
      results.push({ type: 'Compra', title: i.text, meta: i.dateUse, action: () => { closeSearch(); switchTab('checklist'); } });
    }
  });
  Object.keys(state.places).forEach(date => {
    state.places[date].forEach(p => {
      if (p.name.toLowerCase().includes(q)) {
        results.push({ type: 'Lugar', title: p.name, meta: formatDate(date), action: () => { closeSearch(); openDayDetail(date); } });
      }
    });
  });
  
  const cont = document.getElementById('searchResults');
  if (results.length === 0) {
    cont.innerHTML = '<div style="padding:30px;text-align:center;color:var(--grape);font-size:13px;">Sin resultados para "' + q + '"</div>';
  } else {
    cont.innerHTML = results.map((r, idx) => `
      <div class="search-result" onclick="window._searchActions[${idx}]()">
        <div class="search-result-title">${r.title}</div>
        <div class="search-result-meta">${r.type} · ${r.meta}</div>
      </div>
    `).join('');
    window._searchActions = results.map(r => r.action);
  }
}

function openMaps(query) {
  window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query), '_blank');
}

// ============= MENU =============
function openMenu() { document.getElementById('menuModal').classList.add('active'); }
function closeMenu() { document.getElementById('menuModal').classList.remove('active'); }

function exportData() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'viaje-2026-backup-' + getToday() + '.json';
  a.click();
  URL.revokeObjectURL(url);
  closeMenu();
  showToast('Backup descargado');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (confirm('¿Importar estos datos? Va a reemplazar todo lo que tengas ahora.')) {
        state = { ...state, ...imported };
        saveState();
        renderToday(); renderCalendar(); renderChecklist(); renderBudget();
        document.getElementById('rateInput').value = state.exchangeRate;
        closeMenu();
        showToast('Datos importados');
      }
    } catch (err) {
      alert('Error al importar: archivo no válido');
    }
  };
  reader.readAsText(file);
}

function shareFollowing() {
  const url = window.location.origin + window.location.pathname + '?modo=siguiendo';
  if (navigator.share) {
    navigator.share({ title: 'Viaje de Jesi', text: 'Seguí mi viaje por Italia y Andalucía', url }).catch(() => copyToClipboard(url));
  } else {
    copyToClipboard(url);
  }
  closeMenu();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Link copiado')).catch(() => prompt('Copiá este link:', text));
}

function copyTodayPlan() {
  const today = getToday();
  const tripDay = getDay(today);
  let text;
  if (tripDay) {
    const summary = [tripDay.morning, tripDay.afternoon, tripDay.evening].filter(Boolean).join('\n');
    text = `Hoy ${formatDate(today, 'long')}:\n${tripDay.place}\n\n${summary}\n\n🛏️ ${tripDay.sleeping}`;
  } else {
    const days = daysBetween(today, TRIP.startDate);
    text = days > 0 ? `Faltan ${days} días para Italia ✈️` : 'Viaje terminado';
  }
  copyToClipboard(text);
  closeMenu();
}

function checkForUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        reg.update().then(() => {
          showToast('Buscando actualizaciones...');
          setTimeout(() => location.reload(true), 1000);
        });
      } else {
        location.reload(true);
      }
    });
  } else {
    location.reload(true);
  }
  closeMenu();
}

function reloadForUpdate() {
  if (window._waitingSW) {
    window._waitingSW.postMessage('SKIP_WAITING');
  }
  window.location.reload();
}

function resetData() {
  if (confirm('¿Borrar gastos, notas, ediciones y lugares? El plan original queda intacto.')) {
    state = { checklist: {}, expenses: [], exchangeRate: 1100, notes: {}, dayOverrides: {}, places: {} };
    saveState();
    renderToday(); renderCalendar(); renderChecklist(); renderBudget();
    document.getElementById('rateInput').value = 1100;
    closeMenu();
    showToast('Datos reiniciados');
  }
}

// ============= TABS =============
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector('.nav-btn[data-tab="' + tab + '"]').classList.add('active');
  
  const fab = document.getElementById('fab');
  if (tab === 'budget') fab.classList.remove('hidden');
  else fab.classList.add('hidden');
  
  if (tab === 'home') renderToday();
  if (tab === 'calendar') renderCalendar();
  if (tab === 'checklist') renderChecklist();
  if (tab === 'budget') renderBudget();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============= INIT =============
loadState();
document.getElementById('rateInput').value = state.exchangeRate;
renderToday();
document.getElementById('fab').classList.add('hidden');

['editModal', 'searchModal', 'menuModal'].forEach(id => {
  document.getElementById(id).addEventListener('click', (e) => {
    if (e.target.id === id) {
      if (id === 'editModal') closeEditModal();
      if (id === 'searchModal') closeSearch();
      if (id === 'menuModal') closeMenu();
    }
  });
});

// PWA install
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window._installPrompt = e;
});

// Service Worker con auto-update
if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      // Detectar nuevo SW esperando
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nueva versión lista — mostrar banner
            window._waitingSW = newWorker;
            document.getElementById('updateBanner').classList.add('show');
          }
        });
      });
      
      // Chequear updates cada 30 min
      setInterval(() => reg.update(), 30 * 60 * 1000);
    }).catch(() => {});
    
    // Recargar cuando el SW nuevo toma control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}
