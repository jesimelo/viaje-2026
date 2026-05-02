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
  // === LLEGADA ===
  { date: '2026-05-18', day: 'Lun', city: 'travel', place: 'Vuelo Argentina → Milán', morning: 'Vuelo.', afternoon: 'Vuelo.', evening: 'Vuelo. 💡 Tip: melatonina + hidratarte mucho.', sleeping: 'Avión', work: false, mapsQuery: '' },
  { date: '2026-05-19', day: 'Mar', city: 'travel', place: 'Milán → Chieti', morning: 'Llegada Malpensa. Desayuno.', afternoon: 'Malpensa Express → Milán Centrale. Frecciarossa Milán → Pescara (~4h).', evening: 'Cena con amigos.', sleeping: 'Casa amigos Chieti', work: false, mapsQuery: 'Chieti, Italy' },

  // === CHIETI ===
  { date: '2026-05-20', day: 'Mié', city: 'chieti', place: 'Chieti', morning: 'Mañana libre 8-13.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: 'Chieti, Italy' },
  { date: '2026-05-21', day: 'Jue', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-22', day: 'Vie', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-23', day: 'Sáb', city: 'chieti', place: 'Chieti - descanso', morning: 'Amigos.', afternoon: 'Amigos.', evening: 'Amigos. 💡 Probá los arrosticini (brochette de cordero), típico de Abruzzo.', sleeping: 'Casa amigos', work: false, mapsQuery: 'Chieti Alta' },
  { date: '2026-05-24', day: 'Dom', city: 'chieti', place: 'Chieti - descanso', morning: 'Ir a Pescara (15 min en tren).', afternoon: 'Pescara - lungomare, café.', evening: 'Cena con amigos.', sleeping: 'Casa amigos', work: false, mapsQuery: 'Pescara lungomare' },
  { date: '2026-05-25', day: 'Lun', city: 'chieti', place: 'Sulmona en el día', morning: 'Tren Chieti → Sulmona (1h).', afternoon: 'Sulmona: Plaza Garibaldi, acueducto medieval, Confetti Pelino. 💡 Probá pasta alla chitarra.', evening: 'Vuelta a Chieti.', sleeping: 'Casa amigos', work: true, mapsQuery: 'Sulmona, Italy' },
  { date: '2026-05-26', day: 'Mar', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-27', day: 'Mié', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-28', day: 'Jue', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-29', day: 'Vie', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-05-30', day: 'Sáb', city: 'chieti', place: 'Scanno', morning: 'Tren Chieti → Sulmona + bus a Scanno.', afternoon: 'Scanno: pueblo medieval. 💡 Probá ricotta y dulces de almendra locales.', evening: 'Noche en Scanno (B&B).', sleeping: 'B&B Scanno', work: false, mapsQuery: 'Scanno, Italy' },
  { date: '2026-05-31', day: 'Dom', city: 'chieti', place: 'Scanno → Chieti', morning: 'Subida al mirador del Lago di Scanno (forma de corazón ❤️).', afternoon: 'Vuelta tarde a Chieti.', evening: 'Cena con amigos.', sleeping: 'Casa amigos', work: false, mapsQuery: 'Lago di Scanno' },
  { date: '2026-06-01', day: 'Lun', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-06-02', day: 'Mar', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-06-03', day: 'Mié', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-06-04', day: 'Jue', city: 'chieti', place: 'Chieti', morning: 'Mañana libre.', afternoon: 'Trabajo.', evening: 'Trabajo.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },
  { date: '2026-06-05', day: 'Vie', city: 'chieti', place: 'Chieti - despedida', morning: 'Mañana libre.', afternoon: 'ÚLTIMO día de trabajo.', evening: 'Trabajo. 💡 Tirate cena de despedida con amigos.', sleeping: 'Casa amigos', work: true, mapsQuery: '' },

  // === ANDALUCÍA (ARRANCA) ===
  { date: '2026-06-06', day: 'Sáb', city: 'malaga', place: 'Chieti → Roma → Málaga', morning: 'Bus Chieti → Roma (ProntoBus).', afternoon: 'Vuelo directo Roma → Málaga.', evening: 'Check-in Málaga centro. 🍷 Cena en El Pimpi (clásico, pedí vino dulce) o tapeo por calle Larios. 💡 También Casa Lola para tapas más auténticas.', sleeping: 'Málaga', work: false, mapsQuery: 'Málaga, Spain' },
  { date: '2026-06-07', day: 'Dom', city: 'malaga', place: 'Málaga (día de ciudad)', morning: 'Alcazaba y Teatro Romano. Subida a Gibralfaro (mejores vistas).', afternoon: 'Museo Picasso o relax en La Malagueta. 💡 Comé un espeto de sardinas en El Tintero (chiringuito histórico).', evening: 'Atardecer en el Muelle Uno. Tapas por la zona de la Plaza de las Flores.', sleeping: 'Málaga', work: false, mapsQuery: 'Málaga centro' },
  { date: '2026-06-08', day: 'Lun', city: 'malaga', place: 'Córdoba en el día', morning: 'Tren AVE/AVANT Málaga → Córdoba (1h). 💡 Salí temprano (7-8 hs).', afternoon: 'Mezquita-Catedral (entrada 11:30), Judería, Calleja de las Flores, Alcázar. 💡 Almuerzo en Casa Pepe de la Judería (rabo de toro o salmorejo).', evening: 'Tren 20:00 vuelta a Málaga. Dormir en Málaga.', sleeping: 'Málaga', work: false, mapsQuery: 'Mezquita-Catedral de Córdoba' },
  { date: '2026-06-09', day: 'Mar', city: 'malaga', place: 'Ronda', morning: 'Bus Avanza o tren a Ronda (~2h).', afternoon: 'Puente Nuevo, Plaza de Toros, miradores del Tajo. 💡 Bajá por el sendero del Tajo, poca gente lo hace y es espectacular.', evening: 'Vuelta a Málaga. 💡 Si tenés energía, cena en La Cosmopolita.', sleeping: 'Málaga', work: false, mapsQuery: 'Ronda, Spain' },

  // === GRANADA ===
  { date: '2026-06-10', day: 'Mié', city: 'granada', place: 'Málaga → Granada', morning: 'Tren AVANT Málaga → Granada (1h 10m).', afternoon: 'Paseo por el Albaicín. Atardecer en el Mirador de San Nicolás (vistas a la Alhambra).', evening: 'Tapeo por el centro. 💡 En Granada cada bebida viene con tapa GRATIS - probá Bar Los Diamantes o Bodegas Castañeda.', sleeping: 'Granada', work: false, mapsQuery: 'Granada, Spain' },
  { date: '2026-06-11', day: 'Jue', city: 'granada', place: 'Mi lugar en el mundo 🌹', morning: 'Libre. 💡 Si no fuiste, día perfecto para Alhambra (RESERVÁ con MUCHO tiempo).', afternoon: 'Libre. 💡 Tetería en el Albaicín (calle Calderería Nueva).', evening: 'Libre. 💡 Flamenco en Sacromonte (cuevas) - Cuevas Los Tarantos o Venta El Gallo.', sleeping: 'Granada', work: false, mapsQuery: 'Alhambra' },
  { date: '2026-06-12', day: 'Vie', city: 'granada', place: 'Mi lugar en el mundo 🌹', morning: 'Libre.', afternoon: 'Libre. 💡 Paseo de los Tristes, baños árabes Hammam Al Ándalus.', evening: 'Libre.', sleeping: 'Granada', work: false, mapsQuery: '' },
  { date: '2026-06-13', day: 'Sáb', city: 'granada', place: 'Mi lugar en el mundo 🌹', morning: 'Libre.', afternoon: 'Libre.', evening: 'Libre.', sleeping: 'Granada', work: false, mapsQuery: '' },

  // === MÁLAGA → BARI ===
  { date: '2026-06-14', day: 'Dom', city: 'travel', place: 'Granada → Málaga → Bari', morning: 'Tren Granada → Málaga.', afternoon: 'Vuelo directo Málaga → Bari (~3h).', evening: 'Check-in Bari. 🍕 Focaccia barese nocturna en Panificio Fiore (clásico).', sleeping: 'Bari', work: false, mapsQuery: 'Bari, Italy' },

  // === PUGLIA ===
  { date: '2026-06-15', day: 'Lun', city: 'puglia', place: 'Polignano + Monopoli', morning: 'Tren Bari → Polignano. 💡 Cala Porto, los acantilados son MUY fotogénicos.', afternoon: 'Tren a Monopoli. Paseo por murallas y casco antiguo.', evening: 'Vuelta a Bari. 💡 Probá orecchiette al sugo o con cime di rapa, plato típico.', sleeping: 'Bari', work: false, mapsQuery: 'Polignano a Mare' },
  { date: '2026-06-16', day: 'Mar', city: 'puglia', place: 'Trulli → Matera', morning: 'Tren a Alberobello (1h45). Trulli (casitas cono).', afternoon: 'Locorotondo (pueblo blanco). 💡 Transfer/bus directo a Matera. 💡 Calzado con agarre - las piedras de Matera patinan aunque estén secas.', evening: '✨ Dormir en un Sasso (la noche mágica). Cena en un sasso restaurant.', sleeping: 'Sasso Matera', work: false, mapsQuery: 'Sassi di Matera' },
  { date: '2026-06-17', day: 'Mié', city: 'puglia', place: 'Matera → Lecce', morning: 'Matera a fondo: Casa Grotta, Iglesias Rupestres, Belvedere Murgia Timone.', afternoon: 'Bus Matera → Lecce (Itabus o Flixbus, ~3h directo).', evening: '🍦 Primera noche en Lecce. Gelato en Natale (el mejor del sur).', sleeping: 'Lecce', work: false, mapsQuery: 'Lecce, Italy' },
  { date: '2026-06-18', day: 'Jue', city: 'puglia', place: 'Lecce full day', morning: 'Tour barroco: Basílica Santa Croce, Duomo, anfiteatro romano.', afternoon: 'Compras de papel maché (artesanía de Lecce). 💡 Caffè leccese (con leche de almendra y hielo).', evening: 'Cena de despedida del sur. 💡 Probá puccia (sandwich pugliese).', sleeping: 'Lecce', work: false, mapsQuery: 'Lecce centro' },

  // === VUELTA A CHIETI ===
  { date: '2026-06-19', day: 'Vie', city: 'chieti', place: 'Lecce → Chieti', morning: 'Tren Frecciabianca/Intercity Lecce → Pescara (~4h30).', afternoon: 'Llegada a Pescara/Chieti.', evening: 'Cena con amigos.', sleeping: 'Casa amigos Chieti', work: false, mapsQuery: 'Chieti, Italy' },

  // === MILÁN ===
  { date: '2026-06-20', day: 'Sáb', city: 'milan', place: 'Chieti → Milán', morning: 'Frecciarossa Pescara → Milán Centrale (~4h15). 💡 LADO DERECHO del tren para ver el Adriático.', afternoon: 'Llegada Milán. Check-in. Galleria Vittorio Emanuele.', evening: '✨ Duomo de noche iluminado (sin la marea de gente). Cena en Brera (calles empedradas, bohemia). 💡 Probá risotto alla milanese (con azafrán) o cotoletta.', sleeping: 'Milán', work: false, mapsQuery: 'Duomo di Milano' },
  { date: '2026-06-21', day: 'Dom', city: 'milan', place: 'Bergamo + Milán', morning: 'Tren Milán → Bergamo (50 min). Funicular a Ciudad Alta.', afternoon: 'Almuerzo en Bergamo. 💡 Probá los casoncelli (raviolones bergamascos).', evening: 'Vuelta a Milán. Aperitivo en Navigli (Spritz + buffet al atardecer). Despedida frente al Castello Sforzesco o Arco della Pace.', sleeping: 'Milán', work: false, mapsQuery: 'Bergamo Alta' },

  // === VUELTA ===
  { date: '2026-06-22', day: 'Lun', city: 'travel', place: 'Vuelta a Argentina', morning: 'Malpensa Express → vuelo a casa.', afternoon: 'Llegar 3hs antes.', evening: 'Mañana 23 ya estás laburando. Bienvenida a tu vida real ✨', sleeping: 'Avión / Casa', work: false, mapsQuery: '' }
];

const BLOCKS = [
  { id: 'llegada', icon: '✈️', title: 'Llegada', dates: '18-19 may', firstDay: '2026-05-18', weather: '' },
  { id: 'chieti', icon: '🏔️', title: 'Chieti', dates: '20 may - 5 jun', firstDay: '2026-05-20', weather: '🌤️ 18-25°C · primaveral · lluvias ocasionales' },
  { id: 'andalucia', icon: '🌹', title: 'Andalucía', dates: '6-13 jun', firstDay: '2026-06-06', weather: '🔥 28-35°C · calor seco · llevar agua' },
  { id: 'puglia', icon: '🫒', title: 'Puglia', dates: '14-18 jun', firstDay: '2026-06-14', weather: '☀️ 25-30°C · soleado · mar caliente' },
  { id: 'chieti2', icon: '👋', title: 'Chieti (vuelta)', dates: '19 jun', firstDay: '2026-06-19', weather: '' },
  { id: 'milan', icon: '⛪', title: 'Milán', dates: '20-21 jun', firstDay: '2026-06-20', weather: '🌤️ 22-28°C · agradable · noches frescas' },
  { id: 'vuelta', icon: '🏠', title: 'Vuelta', dates: '22 jun', firstDay: '2026-06-22', weather: '' },
];

const CHECKLIST_ITEMS = [
  // === NIVEL 1: Comprar YA ===
  { id: 'v1', priority: 1, text: 'Bus Chieti → Roma (ProntoBus)', dateUse: 'Sáb 6 jun mañana', notes: 'prontobusitalia.it. Llegar a Roma 3h antes del vuelo.' },
  { id: 'v2', priority: 1, text: 'Vuelo Roma → Málaga', dateUse: 'Sáb 6 jun tarde', notes: 'Ryanair / Vueling. Comprar YA.' },
  { id: 'v3', priority: 1, text: 'Vuelo Málaga → Bari', dateUse: 'Dom 14 jun', notes: 'Vueling / Ryanair. Cuidado con horarios nocturnos.' },
  { id: 'v4', priority: 1, text: 'Frecciarossa Pescara → Milán', dateUse: 'Sáb 20 jun', notes: 'trenitalia.com. LADO DERECHO para ver el Adriático.' },
  { id: 'v5', priority: 1, text: 'Tren Lecce → Pescara', dateUse: 'Vie 19 jun', notes: 'Frecciabianca/Intercity. ~4h30. Comprar con tiempo.' },
  { id: 'v6', priority: 1, text: 'Entrada Alhambra (Granada)', dateUse: 'Cuando estés en Granada', notes: '🔥 SE AGOTAN. Reservá YA en alhambra-patronato.es. Si no, tour nocturno.' },
  { id: 'v7', priority: 1, text: 'Sasso en Matera (1 noche)', dateUse: 'Mar 16 jun', notes: 'Booking/Airbnb. Buscar "sasso" experiencia única.' },

  // === NIVEL 2: 2-3 semanas ===
  { id: 'a1', priority: 2, text: 'Alojamiento Málaga (4 noches)', dateUse: 'Sáb 6 al mar 9 jun', notes: 'Centro o cerca María Zambrano.' },
  { id: 'a2', priority: 2, text: 'Alojamiento Granada (4 noches)', dateUse: 'Mié 10 al sáb 13 jun', notes: 'Albaicín / Realejo / centro.' },
  { id: 'a3', priority: 2, text: 'Alojamiento Bari (2 noches)', dateUse: 'Dom 14 al lun 15 jun', notes: 'Hostel privado o B&B en Bari Vecchia.' },
  { id: 'a4', priority: 2, text: 'Alojamiento Lecce (2 noches)', dateUse: 'Mié 17 al jue 18 jun', notes: 'Hostel privado o B&B.' },
  { id: 'a5', priority: 2, text: 'Alojamiento Milán (2 noches)', dateUse: 'Sáb 20 al dom 21 jun', notes: 'Centrale, Brera, Navigli o Porta Romana.' },
  { id: 'a6', priority: 2, text: 'Entrada Mezquita-Catedral Córdoba', dateUse: 'Lun 8 jun (11:30 hs)', notes: 'mezquita-catedraldecordoba.es' },
  { id: 'a7', priority: 2, text: 'Tren AVE/AVANT Málaga → Córdoba ida y vuelta', dateUse: 'Lun 8 jun', notes: 'renfe.com. Ida temprano (7-8 hs), vuelta 20:00.' },
  { id: 'a8', priority: 2, text: 'Tren AVANT Málaga → Granada', dateUse: 'Mié 10 jun media mañana', notes: 'renfe.com (1h 10m).' },

  // === NIVEL 3: En mayo ===
  { id: 't1', priority: 3, text: 'Bus/Tren Málaga → Ronda ida y vuelta', dateUse: 'Mar 9 jun', notes: 'Avanza suele tener mejores horarios que tren.' },
  { id: 't2', priority: 3, text: 'Tren Granada → Málaga', dateUse: 'Dom 14 jun temprano', notes: 'Para llegar a tiempo al vuelo a Bari.' },
  { id: 't3', priority: 3, text: 'B&B Scanno (1 noche)', dateUse: 'Sáb 30 may', notes: 'Booking. Pueblo chico.' },
  { id: 't4', priority: 3, text: 'Transfer/Bus Locorotondo/Alberobello → Matera', dateUse: 'Mar 16 jun', notes: 'Transfer privado ~25€/persona compartido. O bus vía Bari.' },
  { id: 't5', priority: 3, text: 'Bus Matera → Lecce', dateUse: 'Mié 17 jun', notes: 'Itabus o Flixbus. Directo, ~3h.' },

  // === NIVEL 4: Allá ===
  { id: 'l1', priority: 4, text: 'Tren regional Pescara → Chieti', dateUse: 'Mar 19 may', notes: 'En la estación. 15 min.' },
  { id: 'l2', priority: 4, text: 'Tren Chieti → Sulmona ida y vuelta', dateUse: 'Lun 25 may', notes: 'Regional.' },
  { id: 'l3', priority: 4, text: 'Tren + bus Chieti → Sulmona → Scanno', dateUse: 'Sáb 30 may', notes: 'App TUA mycicero.' },
  { id: 'l4', priority: 4, text: 'Trenes regionales Puglia (Polignano, Monopoli)', dateUse: '15 jun', notes: 'App Trenitalia sobre la marcha.' },
  { id: 'l5', priority: 4, text: 'Tren Bari → Alberobello', dateUse: 'Mar 16 jun mañana', notes: 'FSE - Ferrovie Sud Est.' },
  { id: 'l6', priority: 4, text: 'Cercanías Málaga aeropuerto', dateUse: 'Sáb 6 jun llegada', notes: 'Renfe Cercanías. Directo desde aeropuerto.' },
  { id: 'l7', priority: 4, text: 'Malpensa Express → aeropuerto', dateUse: 'Lun 22 jun', notes: '50 min desde Centrale.' },

  // === NIVEL 5: Otros (antes de viajar) ===
  { id: 'o1', priority: 5, text: 'Tarjeta Wise o Revolut', dateUse: 'Antes', notes: 'Para evitar comisiones argentinas.' },
  { id: 'o2', priority: 5, text: 'eSIM (Holafly o Airalo)', dateUse: 'Antes', notes: '30 días con datos para Italia + España.' },
  { id: 'o3', priority: 5, text: 'Avisar al banco fechas y países', dateUse: 'Antes', notes: 'Para que no bloqueen tarjetas.' },
  { id: 'o4', priority: 5, text: 'Foto pasaporte + scans en Drive', dateUse: 'Antes', notes: 'Compartir con persona de confianza.' },
  { id: 'o5', priority: 5, text: 'Apps: TUA mycicero, Trenitalia, Renfe, Vueling, Ryanair, Avanza', dateUse: 'Antes', notes: 'Bajar todas las apps.' },
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
  customTasks: [],
  reservations: []  // [{id, type, name, dateStart, timeStart, placeStart, dateEnd, timeEnd, placeEnd, code, voucherUrl, cost, notes}]
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
let _calendarView = 'list';

function switchCalendarView(view) {
  _calendarView = view;
  document.querySelectorAll('.view-toggle-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  if (view === 'list') {
    document.getElementById('dayList').style.display = '';
    document.getElementById('monthGrid').style.display = 'none';
    renderListView();
  } else {
    document.getElementById('dayList').style.display = 'none';
    document.getElementById('monthGrid').style.display = '';
    renderMonthView();
  }
}

function renderCalendar() {
  if (_calendarView === 'list') renderListView();
  else renderMonthView();
}

function renderListView() {
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

function renderMonthView() {
  const today = getToday();
  const cont = document.getElementById('monthGrid');
  const monthsLong = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const weekdays = ['L','M','M','J','V','S','D']; // empezamos en lunes
  
  // Agrupar días por mes
  const byMonth = {};
  const allDays = getAllDays();
  allDays.forEach(d => {
    const key = d.date.substring(0, 7);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(d);
  });
  
  let html = '';
  
  Object.keys(byMonth).sort().forEach(monthKey => {
    const [year, month] = monthKey.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    
    // Día de la semana del primero (0 = domingo, queremos lunes = 0)
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;
    
    html += `<div class="month-block">
      <div class="month-title">${monthsLong[month-1]} ${year}</div>
      <div class="calendar-grid">`;
    
    // Headers de días de la semana
    weekdays.forEach(w => {
      html += `<div class="calendar-weekday">${w}</div>`;
    });
    
    // Días vacíos al inicio
    for (let i = 0; i < startDow; i++) {
      html += `<div class="calendar-day empty"></div>`;
    }
    
    // Días del mes
    for (let day = 1; day <= lastDay; day++) {
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const dayData = byMonth[monthKey].find(d => d.date === dateStr);
      
      if (dayData) {
        const isToday = dateStr === today;
        const isPast = dateStr < today;
        const blockClass = `block-${dayData.city === 'travel' ? 'llegada' : dayData.city}`;
        const reservations = getReservationsForDate(dateStr);
        
        // Ícono de reserva si tiene
        let icons = '';
        if (reservations.length > 0) {
          const types = [...new Set(reservations.map(r => r.type))];
          if (types.includes('flight')) icons += '✈';
          else if (types.includes('train')) icons += '🚂';
          else if (types.includes('bus')) icons += '🚌';
          else if (types.includes('hotel')) icons += '🛏';
          else icons += '📌';
        }
        
        // Nombre cortito del lugar
        let shortPlace = dayData.place
          .replace('Mi lugar en el mundo 🌹', 'Granada 🌹')
          .replace(/→/g, '·')
          .split('·')[0]
          .trim()
          .replace('Vuelta a Argentina', 'Vuelta')
          .replace('Vuelo Argentina', 'Vuelo')
          .replace('Chieti - despedida', 'Chieti')
          .replace('Chieti - descanso', 'Chieti');
        
        // Truncar si muy largo
        if (shortPlace.length > 14) shortPlace = shortPlace.substring(0, 13) + '…';
        
        html += `<div class="calendar-day in-trip ${blockClass} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}" onclick="openDayDetail('${dateStr}')">
          ${icons ? `<div class="calendar-day-icons">${icons}</div>` : ''}
          <div class="calendar-day-num">${day}</div>
          <div class="calendar-day-place">${shortPlace}</div>
        </div>`;
      } else {
        html += `<div class="calendar-day empty"></div>`;
      }
    }
    
    html += `</div></div>`;
  });
  
  // Leyenda
  html += `<div class="calendar-legend">
    <div class="legend-item"><div class="legend-color block-chieti"></div>Chieti</div>
    <div class="legend-item"><div class="legend-color block-andalucia"></div>Andalucía</div>
    <div class="legend-item"><div class="legend-color block-puglia"></div>Puglia</div>
    <div class="legend-item"><div class="legend-color block-milan"></div>Milán</div>
    <div class="legend-item"><div class="legend-color block-llegada"></div>Vuelo</div>
  </div>`;
  
  cont.innerHTML = html;
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
  
  // RESERVAS DEL DÍA (vuelos, trenes, hoteles que salen/llegan ese día)
  const dayReservations = getReservationsForDate(date);
  if (dayReservations.length > 0 || !FOLLOWING_MODE) {
    html += `
      <div class="day-section-card">
        <div class="day-section-label">
          <span>Reservas</span>
          ${!FOLLOWING_MODE ? `<span class="day-section-label-edit" onclick="addReservation({dateStart:'${date}'})">+ Agregar</span>` : ''}
        </div>
    `;
    if (dayReservations.length === 0) {
      html += `<div class="reservation-section-empty">Sin reservas para este día</div>`;
    } else {
      html += `<div class="day-reservations">`;
      dayReservations.forEach(r => {
        html += renderReservationCard(r, getToday());
      });
      html += `</div>`;
    }
    html += `</div>`;
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

// ============= RESERVATIONS =============
const RESERVATION_TYPES = [
  { id: 'flight', label: 'Vuelo', icon: '✈️' },
  { id: 'train', label: 'Tren', icon: '🚂' },
  { id: 'bus', label: 'Bus', icon: '🚌' },
  { id: 'car', label: 'Auto', icon: '🚗' },
  { id: 'ferry', label: 'Ferry', icon: '🛥️' },
  { id: 'hotel', label: 'Alojamiento', icon: '🛏️' },
  { id: 'tour', label: 'Tour / Entrada', icon: '🎫' },
  { id: 'other', label: 'Otro', icon: '📋' },
];

function getReservationType(id) {
  return RESERVATION_TYPES.find(t => t.id === id) || RESERVATION_TYPES[7];
}

function renderReservations() {
  const list = document.getElementById('reservationsList');
  const counter = document.getElementById('reservationsCount');
  const today = getToday();
  
  if (!state.reservations || state.reservations.length === 0) {
    counter.textContent = '';
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🎫</div><div class="empty-state-text">Sin reservas todavía.<br>Tocá <strong>+ Nueva reserva</strong> para agregar tu primer vuelo, tren u hotel.</div></div>';
    return;
  }
  
  counter.textContent = `${state.reservations.length} ${state.reservations.length === 1 ? 'reserva' : 'reservas'}`;
  
  // Sort by start date+time
  const sorted = [...state.reservations].sort((a, b) => {
    const aKey = (a.dateStart || '9999-99-99') + (a.timeStart || '');
    const bKey = (b.dateStart || '9999-99-99') + (b.timeStart || '');
    return aKey.localeCompare(bKey);
  });
  
  let html = '';
  let lastMonth = '';
  
  sorted.forEach(r => {
    const monthKey = (r.dateStart || '').substring(0, 7);
    const months = { '2026-05': 'Mayo', '2026-06': 'Junio' };
    if (monthKey && months[monthKey] && monthKey !== lastMonth) {
      html += `<div class="month-sep-reservations">${months[monthKey]}</div>`;
      lastMonth = monthKey;
    }
    
    html += renderReservationCard(r, today);
  });
  
  list.innerHTML = html;
}

function renderReservationCard(r, today) {
  const type = getReservationType(r.type);
  const isPast = r.dateEnd && r.dateEnd < today;
  const isHotel = r.type === 'hotel';
  const isTour = r.type === 'tour';
  
  let html = `<div class="reservation-card ${isPast ? 'past' : ''}" onclick="editReservation('${r.id}')">`;
  
  // Header
  html += `<div class="reservation-header">
    <div class="reservation-icon">${type.icon}</div>
    <div class="reservation-title-block">
      <div class="reservation-type">${type.label}</div>
      <div class="reservation-name">${r.name || '(sin nombre)'}</div>
    </div>
    <div class="reservation-date">${r.dateStart ? formatDate(r.dateStart) : ''}</div>
  </div>`;
  
  // Route
  if (isHotel) {
    if (r.dateStart && r.dateEnd) {
      html += `<div class="reservation-route">
        <div class="route-point">
          <div class="route-time">${r.timeStart || 'check-in'}</div>
          <div class="route-place">${formatDate(r.dateStart)} · entrada</div>
        </div>
        <div class="route-arrow">→</div>
        <div class="route-point" style="text-align:right;">
          <div class="route-time">${r.timeEnd || 'check-out'}</div>
          <div class="route-place">${formatDate(r.dateEnd)} · salida</div>
        </div>
      </div>`;
    }
    if (r.placeStart) {
      html += `<div style="font-size:12px;color:var(--grape);margin:6px 0;">📍 ${r.placeStart}</div>`;
    }
  } else if (isTour) {
    if (r.timeStart || r.placeStart) {
      html += `<div class="reservation-route">
        <div class="route-point">
          ${r.timeStart ? `<div class="route-time">${r.timeStart}</div>` : ''}
          ${r.placeStart ? `<div class="route-place">${r.placeStart}</div>` : ''}
        </div>
      </div>`;
    }
  } else {
    // Travel: flight, train, bus, car, ferry
    if (r.placeStart || r.placeEnd) {
      html += `<div class="reservation-route">
        <div class="route-point">
          <div class="route-time">${r.timeStart || '—'}</div>
          <div class="route-place">${r.placeStart || ''}</div>
        </div>
        <div class="route-arrow">→</div>
        <div class="route-point" style="text-align:right;">
          <div class="route-time">${r.timeEnd || '—'}</div>
          <div class="route-place">${r.placeEnd || ''}</div>
        </div>
      </div>`;
    }
  }
  
  // Chips
  let chips = '';
  if (r.code) chips += `<span class="reservation-chip code">#${r.code}</span>`;
  if (r.cost) chips += `<span class="reservation-chip cost">${r.cost} EU</span>`;
  if (r.voucherUrl) chips += `<a href="${r.voucherUrl}" target="_blank" class="reservation-chip" onclick="event.stopPropagation()">📎 voucher</a>`;
  
  if (chips) html += `<div class="reservation-meta-row">${chips}</div>`;
  
  if (r.notes) html += `<div style="font-size:11px;color:var(--grape);margin-top:8px;font-style:italic;">${r.notes}</div>`;
  
  html += '</div>';
  return html;
}

function addReservation(presetData) {
  const fields = [
    { label: 'Tipo', name: 'type', type: 'select', options: RESERVATION_TYPES.map(t => ({ value: t.id, label: t.icon + ' ' + t.label })), value: presetData?.type || 'flight' },
    { label: 'Nombre / descripción', name: 'name', type: 'text', value: presetData?.name || '', autofocus: true },
    { label: 'Fecha (salida o check-in)', name: 'dateStart', type: 'date', value: presetData?.dateStart || '' },
    { label: 'Hora salida', name: 'timeStart', type: 'time', value: presetData?.timeStart || '' },
    { label: 'Lugar / origen', name: 'placeStart', type: 'text', value: presetData?.placeStart || '' },
    { label: 'Fecha llegada / check-out', name: 'dateEnd', type: 'date', value: presetData?.dateEnd || '' },
    { label: 'Hora llegada', name: 'timeEnd', type: 'time', value: presetData?.timeEnd || '' },
    { label: 'Destino', name: 'placeEnd', type: 'text', value: presetData?.placeEnd || '' },
    { label: 'Código de reserva', name: 'code', type: 'text', value: presetData?.code || '' },
    { label: 'Link al voucher (Drive, Booking, etc)', name: 'voucherUrl', type: 'text', value: presetData?.voucherUrl || '' },
    { label: 'Costo (EU)', name: 'cost', type: 'number', value: presetData?.cost || '' },
    { label: 'Notas', name: 'notes', type: 'textarea', value: presetData?.notes || '' },
  ];
  
  showEditModal({
    title: 'Nueva reserva',
    subtitle: 'Vuelo, tren, hotel, lo que sea',
    fields,
    onSave: (vals) => {
      if (!vals.name && !vals.placeStart) return;
      const id = 'res_' + Date.now();
      if (!state.reservations) state.reservations = [];
      state.reservations.push({ id, ...vals });
      saveState();
      renderReservations();
      // Si está abierto un día, refrescar
      if (_currentDayDetail) openDayDetail(_currentDayDetail);
      showToast('Reserva agregada');
    }
  });
}

function editReservation(id) {
  const r = state.reservations.find(x => x.id === id);
  if (!r) return;
  
  showEditModal({
    title: 'Editar reserva',
    subtitle: r.name || getReservationType(r.type).label,
    fields: [
      { label: 'Tipo', name: 'type', type: 'select', options: RESERVATION_TYPES.map(t => ({ value: t.id, label: t.icon + ' ' + t.label })), value: r.type || 'flight' },
      { label: 'Nombre / descripción', name: 'name', type: 'text', value: r.name || '' },
      { label: 'Fecha (salida o check-in)', name: 'dateStart', type: 'date', value: r.dateStart || '' },
      { label: 'Hora salida', name: 'timeStart', type: 'time', value: r.timeStart || '' },
      { label: 'Lugar / origen', name: 'placeStart', type: 'text', value: r.placeStart || '' },
      { label: 'Fecha llegada / check-out', name: 'dateEnd', type: 'date', value: r.dateEnd || '' },
      { label: 'Hora llegada', name: 'timeEnd', type: 'time', value: r.timeEnd || '' },
      { label: 'Destino', name: 'placeEnd', type: 'text', value: r.placeEnd || '' },
      { label: 'Código de reserva', name: 'code', type: 'text', value: r.code || '' },
      { label: 'Link al voucher', name: 'voucherUrl', type: 'text', value: r.voucherUrl || '' },
      { label: 'Costo (EU)', name: 'cost', type: 'number', value: r.cost || '' },
      { label: 'Notas', name: 'notes', type: 'textarea', value: r.notes || '' },
    ],
    onSave: (vals) => {
      const idx = state.reservations.findIndex(x => x.id === id);
      state.reservations[idx] = { ...r, ...vals };
      saveState();
      renderReservations();
      if (_currentDayDetail) openDayDetail(_currentDayDetail);
      showToast('Actualizada');
    },
    onDelete: () => {
      const idx = state.reservations.findIndex(x => x.id === id);
      const old = state.reservations[idx];
      state.reservations.splice(idx, 1);
      saveState();
      renderReservations();
      if (_currentDayDetail) openDayDetail(_currentDayDetail);
      showToast('Reserva borrada', () => {
        state.reservations.splice(idx, 0, old);
        saveState();
        renderReservations();
        if (_currentDayDetail) openDayDetail(_currentDayDetail);
      });
    }
  });
}

// Get reservations that touch this date (start, end, or in between for hotels)
function getReservationsForDate(date) {
  if (!state.reservations) return [];
  return state.reservations.filter(r => {
    if (r.type === 'hotel') {
      // Hotel: incluye si la fecha está entre check-in y check-out
      if (r.dateStart && r.dateEnd) {
        return date >= r.dateStart && date < r.dateEnd;
      }
      return r.dateStart === date;
    }
    return r.dateStart === date || r.dateEnd === date;
  }).sort((a, b) => (a.timeStart || '99:99').localeCompare(b.timeStart || '99:99'));
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

function resetItinerary() {
  if (confirm('¿Resetear las ediciones del itinerario al plan original?\n\nNO se borran tus gastos, reservas, notas, lugares ni fotos.')) {
    state.dayOverrides = {};
    saveState();
    renderToday(); renderCalendar();
    closeMenu();
    showToast('Itinerario reseteado al plan original');
  }
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
  const navBtn = document.querySelector('.nav-btn[data-tab="' + tab + '"]');
  if (navBtn) navBtn.classList.add('active');
  
  const fab = document.getElementById('fab');
  if (tab === 'budget') fab.classList.remove('hidden');
  else fab.classList.add('hidden');
  
  if (tab === 'home') renderToday();
  if (tab === 'calendar') renderCalendar();
  if (tab === 'checklist') renderChecklist();
  if (tab === 'budget') renderBudget();
  if (tab === 'reservations') renderReservations();
  
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
