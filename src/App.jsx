import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, RotateCcw, Shield, Compass, BookOpen, Clock, Activity } from 'lucide-react';

// =====================================================
// DATA BÍBLICA E HISTÓRICA DETALLADA
// =====================================================
const SECTIONS_DATA = [
  {
    id: 0,
    metal: "Cabeza de Oro",
    title: "Imperio de Babilonia",
    years: "605 – 539 a.C.",
    color: "#ffd700",
    glowColor: "rgba(255, 215, 0, 0.25)",
    zoneTop: 0,
    zoneHeight: 14,
    biblical: "«Tú, rey, eres rey de reyes; porque el Dios del cielo te ha dado reino, poder, fuerza y majestad... tú eres aquella cabeza de oro.» (Daniel 2:37-38)",
    king: "Nabucodonosor II",
    capital: "Babilonia",
    desc: "El oro representa el esplendor y la inmensa riqueza de Babilonia, centro cultural y religioso de Mesopotamia. Su caída ante Ciro el Grande en 539 a.C. inició la transición profética.",
    theology: "El Comentario Bíblico Adventista asocia la cabeza de oro con la gloria suprema del primer imperio mundial. Babilonia es llamada la 'ciudad codiciosa de oro' (Isaías 14:4), reflejando la altivez de su rey Nabucodonosor.",
    timeline: [
      { year: "605 a.C.", title: "Batalla de Carquemis", desc: "Nabucodonosor derrota a los egipcios y sitia Jerusalén por primera vez." },
      { year: "603 a.C.", title: "Sueño de Daniel 2", desc: "Revelación e interpretación de la estatua, ascendiendo Daniel en la corte." },
      { year: "586 a.C.", title: "Destrucción del Templo", desc: "Asedio final de Jerusalén; demolición de los muros y deportación total." },
      { year: "569 a.C.", title: "Humillación del Rey", desc: "Nabucodonosor pierde la razón por 7 tiempos debido a su orgullo." },
      { year: "539 a.C.", title: "Caída ante Ciro", desc: "El imperio cae en una sola noche tras la fiesta de Belsasar." }
    ]
  },
  {
    id: 1,
    metal: "Pecho y Brazos de Plata",
    title: "Imperio Medo-Persa",
    years: "539 – 331 a.C.",
    color: "#e3e3e3",
    glowColor: "rgba(227, 227, 227, 0.18)",
    zoneTop: 14,
    zoneHeight: 22,
    biblical: "«Y después de ti se levantará otro reino inferior al tuyo;» (Daniel 2:39a)",
    king: "Ciro el Grande / Darío",
    capital: "Persépolis / Susa",
    desc: "Los dos brazos simbolizan la alianza de los medos y los persas. La plata representa un reino de menor valor monetario pero con mayor dureza y un riguroso sistema de tributación militar.",
    theology: "Dios usó a los soberanos persas como instrumentos de restauración. El decreto de Ciro permitió el retorno del remanente judío a Judea para reconstruir el templo de Jerusalén.",
    timeline: [
      { year: "539 a.C.", title: "Conquista de Babilonia", desc: "Gobierno conjunto inicial bajo Darío el Medo y Ciro el Persa." },
      { year: "538 a.C.", title: "Decreto de Ciro", desc: "Se promulga la orden oficial que pone fin al cautiverio judío." },
      { year: "480 a.C.", title: "Campaña de Jerjes", desc: "Invasión masiva a Grecia (Jerjes es el Asuero del libro de Ester)." },
      { year: "457 a.C.", title: "Decreto de Artajerjes", desc: "Inicio de la profecía de las 70 semanas para la reconstrucción política de Jerusalén." },
      { year: "331 a.C.", title: "Batalla de Gaugamela", desc: "Caída definitiva del poderío persa ante el ejército macedonio." }
    ]
  },
  {
    id: 2,
    metal: "Vientre y Muslos de Bronce",
    title: "Imperio Griego",
    years: "331 – 168 a.C.",
    color: "#cd7f32",
    glowColor: "rgba(205, 127, 50, 0.22)",
    zoneTop: 36,
    zoneHeight: 16,
    biblical: "«y luego un tercer reino de bronce, el cual dominará sobre toda la tierra.» (Daniel 2:39b)",
    king: "Alejandro Magno",
    capital: "Alejandría",
    desc: "El bronce representa a la Grecia helenística. Los soldados griegos vestían armaduras completas de bronce. Conquistó el mundo conocido con la agilidad y velocidad de un leopardo con alas.",
    theology: "La unificación lingüística bajo el griego koiné facilitó la posterior difusión del evangelio. La rápida muerte del primer rey y la división del imperio en 4 reinos cumplió con precisión la profecía.",
    timeline: [
      { year: "331 a.C.", title: "Batalla de Gaugamela", desc: "Victoria decisiva de Alejandro que consagra la era helenística." },
      { year: "323 a.C.", title: "Muerte de Alejandro", desc: "El gran estratega muere a los 32 años sin herederos consolidados." },
      { year: "301 a.C.", title: "División del Imperio", desc: "Batalla de Ipsos; el imperio se divide entre 4 generales (Diádocos)." },
      { year: "175 a.C.", title: "Antíoco IV Epífanes", desc: "Profanación del templo judío e imposición del politeísmo helénico." },
      { year: "168 a.C.", title: "Batalla de Pidna", desc: "Derrota macedonia definitiva que corona la supremacía romana." }
    ]
  },
  {
    id: 3,
    metal: "Piernas de Hierro",
    title: "Imperio Romano",
    years: "168 a.C. – 476 d.C.",
    color: "#7a7a7a",
    glowColor: "rgba(122, 122, 122, 0.2)",
    zoneTop: 52,
    zoneHeight: 28,
    biblical: "«Y el cuarto reino será fuerte como el hierro; y como el hierro desmenuza... así desmenuzará y quebrantará a todos.» (Daniel 2:40)",
    king: "Los Césares de Roma",
    capital: "Roma / Constantinopla",
    desc: "El hierro representa la implacable fuerza militar de las legiones romanas que subyugaron al Mediterráneo. Las dos piernas simbolizan la posterior división en el Imperio de Oriente y Occidente.",
    theology: "Roma gobernaba el mundo en el nacimiento de Jesucristo, su muerte en la cruz y las primeras persecuciones de la iglesia cristiana primitiva antes de la asimilación eclesiástica secular.",
    timeline: [
      { year: "168 a.C.", title: "Victoria de Pidna", desc: "Roma somete a Macedonia, eliminando al imperio predecesor." },
      { year: "27 a.C.", title: "Pax Romana", desc: "César Augusto asume como primer emperador consolidando el Imperio." },
      { year: "31 d.C.", title: "Crucifixión de Cristo", desc: "Jesús es crucificado bajo Poncio Pilato durante el reinado de Tiberio." },
      { year: "70 d.C.", title: "Destrucción de Jerusalén", desc: "El general romano Tito incendia el Templo judío y destruye la ciudad." },
      { year: "476 d.C.", title: "Caída de Roma Occidental", desc: "El rey bárbaro Odoacro depone al último emperador Rómulo Augústulo." }
    ]
  },
  {
    id: 4,
    metal: "Pies de Hierro y Barro",
    title: "Europa Dividida",
    years: "476 d.C. – Presente",
    color: "#8a7267",
    glowColor: "rgba(138, 114, 103, 0.22)",
    zoneTop: 80,
    zoneHeight: 20,
    biblical: "«los pies y los dedos, en parte de barro cocido de alfarero y en parte de hierro, el reino será dividido... no se unirán el uno con el otro.» (Daniel 2:41-43)",
    king: "Monarquías / Gobiernos",
    capital: "Capitales Nacionales",
    desc: "La mezcla de hierro (fuerza estatal/política) y barro de alfarero (influencia religiosa eclesiástica) simboliza la desunión crónica de las naciones europeas nacidas de las invasiones bárbaras.",
    theology: "Los 10 dedos representan los reinos bárbaros originales. Los intentos de reunificación por la fuerza (Carlomagno, Napoleón, Hitler) fracasaron sistemáticamente, cumpliendo que no se unirán de manera estable.",
    timeline: [
      { year: "476 d.C.", title: "Invasión de las 10 Tribus", desc: "Fragmentación de la Europa Occidental en múltiples reinos bárbaros." },
      { year: "538 d.C.", title: "Caída de Tres Cuernos", desc: "Aniquilación militar de Hérulos, Vándalos y Ostrogodos por el Papado." },
      { year: "800 d.C.", title: "Imperio de Carlomagno", desc: "Fracasa el primer gran intento de restablecer el orden imperial romano." },
      { year: "1815 d.C.", title: "Batalla de Waterloo", desc: "Derrota final de Napoleón, frustrando sus planes de hegemonía europea." },
      { year: "Presente", title: "Unión Europea", desc: "Esfuerzo moderno de integración pacífica que conserva identidades soberanas separadas." }
    ]
  }
];

const KINGDOM_OF_GOD = {
  metal: "Piedra sin Manos",
  title: "El Reino de Dios",
  years: "Segunda Venida – Eternidad",
  biblical: "«Y en los días de estos reyes el Dios del cielo levantará un reino que no será jamás destruido... desmenuzará y consumirá a todos estos reinos, pero él permanecerá para siempre.» (Daniel 2:44-45)",
  king: "Jesucristo (Rey de Reyes)",
  capital: "La Nueva Jerusalén",
  desc: "La piedra cortada sin intervención humana ('no con mano') representa el origen completamente divino de la destrucción final de la soberanía terrenal humana y la instauración del reino absoluto de Cristo.",
  theology: "Jesús golpea la estatua en sus pies, indicando que su regreso ocurre durante el tiempo de la división europea (el fin de la historia). El polvo arrastrado por el viento ilustra que todo rastro de pecado y opresión será eliminado.",
  timeline: [
    { year: "Futuro", title: "Segunda Venida de Cristo", desc: "Jesús desciende en gloria. Los imperios humanos terrenales colapsan y son destruidos por completo." },
    { year: "Milenio", title: "Reino Celestial de 1000 años", desc: "Los santos reinan en el cielo mientras Satanás es confinado en una Tierra devastada y solitaria." },
    { year: "Post-Milenio", title: "Juicio Final", desc: "Destrucción definitiva de Satanás, la muerte y el pecado en el lago de fuego purificador." },
    { year: "Eterno", title: "Nueva Jerusalén", desc: "El planeta restaurado a su perfección original. Comunión eterna de Dios con los seres redimidos." }
  ]
};

// Direcciones predefinidas para la animación de fragmentación
const SHATTER_OFFSETS = [
  { x: -180, y: -120, rotate: -35 },
  { x: 220, y: 80, rotate: 45 },
  { x: -250, y: 200, rotate: -50 },
  { x: 150, y: 350, rotate: 30 },
  { x: -80, y: 450, rotate: -20 },
];

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================
export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [activeTab, setActiveTab] = useState('biblia');

  // Estado de la animación de la piedra
  const [stoneActive, setStoneActive] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);

  // Trail particles & impact effects
  const [trailParticles, setTrailParticles] = useState([]);
  const [impactParticles, setImpactParticles] = useState([]);
  const [showImpactRing, setShowImpactRing] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const trailIntervalRef = useRef(null);
  const stoneProgressRef = useRef(0);

  // Tour guiado
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // --- HANDLERS ---
  const handleStoneTrigger = () => {
    if (stoneActive || collapsed) return;
    setSelectedId(null);
    setStoneActive(true);
    stoneProgressRef.current = 0;
  };

  const handleStoneImpact = () => {
    // Stop trail spawning
    if (trailIntervalRef.current) {
      clearInterval(trailIntervalRef.current);
      trailIntervalRef.current = null;
    }
    // Screen shake
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
    // Impact ring
    setShowImpactRing(true);
    setTimeout(() => setShowImpactRing(false), 800);
    // Spawn impact ember particles
    const embers = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 40,
      y: 78 + (Math.random() - 0.5) * 10,
      size: 3 + Math.random() * 6,
      color: ['#ff6600', '#ff9900', '#ffcc00', '#ff3300', '#ffffff'][Math.floor(Math.random() * 5)],
      dx: (Math.random() - 0.5) * 120,
      dy: -(20 + Math.random() * 80),
      delay: Math.random() * 0.2,
    }));
    setImpactParticles(embers);
    setTimeout(() => setImpactParticles([]), 1500);
    // Original impact logic
    setShowFlash(true);
    setCollapsed(true);
    setStoneActive(false);
    setTrailParticles([]);
    setTimeout(() => setShowFlash(false), 600);
    setTimeout(() => {
      setShowFinalModal(true);
      setSelectedId(null);
    }, 2500);
  };

  const handleReset = () => {
    if (trailIntervalRef.current) {
      clearInterval(trailIntervalRef.current);
      trailIntervalRef.current = null;
    }
    setStoneActive(false);
    setCollapsed(false);
    setShowFlash(false);
    setShowFinalModal(false);
    setTrailParticles([]);
    setImpactParticles([]);
    setShowImpactRing(false);
    setScreenShake(false);
    setSelectedId(null);
    setTourActive(false);
  };

  // Trail particle spawner — creates fire particles behind the stone as it falls
  useEffect(() => {
    if (stoneActive && !collapsed) {
      const DURATION = 1800; // matches the stone animation duration in ms
      const startTime = Date.now();
      trailIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        // Easing: cubic-bezier(0.22, 0.68, 0, 1.0) approximation
        const eased = 1 - Math.pow(1 - progress, 3);
        stoneProgressRef.current = eased;
        const currentTop = -80 + eased * (78 + 80); // maps to percentage-ish range
        // Spawn 2-3 particles per tick
        const count = 2 + Math.floor(Math.random() * 2);
        const newParticles = Array.from({ length: count }, (_, i) => ({
          id: Date.now() + Math.random() + i,
          x: 50 + (Math.random() - 0.5) * 12,
          y: Math.max(0, Math.min(100, (currentTop / 5.5) + 14 + Math.random() * 3)),
          size: 4 + Math.random() * 10,
          color: ['#ff4400', '#ff6600', '#ff8800', '#ffaa00', '#ffcc44', '#fff'][Math.floor(Math.random() * 6)],
          duration: 0.4 + Math.random() * 0.5,
        }));
        setTrailParticles(prev => [...prev.slice(-30), ...newParticles]);
      }, 50);
      return () => {
        if (trailIntervalRef.current) {
          clearInterval(trailIntervalRef.current);
          trailIntervalRef.current = null;
        }
      };
    }
  }, [stoneActive, collapsed]);

  // --- TOUR GUIADO ---
  const tourScript = [
    { id: 0, text: "Comenzamos en la Cabeza de Oro. Representa a Babilonia (605-539 a.C.), el imperio neobabilónico que cautivó a Jerusalén." },
    { id: 1, text: "Descendemos al Pecho de Plata. Representa a Medo-Persia (539-331 a.C.), una coalición de dos reinos que conquistó Babilonia." },
    { id: 2, text: "Pasamos al Vientre de Bronce. Representa a Grecia (331-168 a.C.), liderada por las veloces conquistas helénicas de Alejandro Magno." },
    { id: 3, text: "Continuamos en las Piernas de Hierro. Representa a Roma (168 a.C. - 476 d.C.), un imperio fuerte como el hierro que gobernó con mano de hierro." },
    { id: 4, text: "Llegamos a los Pies de Hierro y Barro. Representa a la Europa Dividida (476 d.C. - Presente), un reino fragmentado e inestable." },
    { id: 5, text: "Finalmente, ¡la profecía se cumple! La piedra cortada no con manos golpea los pies y destruye los reinos de la tierra para implantar el Reino Eterno." }
  ];

  const startTour = () => {
    handleReset();
    setTourActive(true);
    setTourStep(0);
    setSelectedId(0);
    setActiveTab('biblia');
  };

  const nextTourStep = () => {
    if (tourStep < 5) {
      const next = tourStep + 1;
      setTourStep(next);
      if (next === 5) {
        setSelectedId(null);
        handleStoneTrigger();
      } else {
        setSelectedId(next);
      }
    } else {
      setTourActive(false);
    }
  };

  const prevTourStep = () => {
    if (tourStep > 0) {
      const prev = tourStep - 1;
      setTourStep(prev);
      setSelectedId(prev);
    }
  };

  const activeData = selectedId !== null ? SECTIONS_DATA[selectedId] : null;

  return (
    <div className={`w-screen h-screen bg-gradient-to-br from-gray-950 via-[#0a0710] to-black text-gray-100 overflow-hidden relative font-sans select-none ${screenShake ? 'screen-shake' : ''}`}>

      {/* ===== HEADER ===== */}
      <header className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gold tracking-widest font-serif drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
            El Libro de Daniel
          </h1>
          <p className="text-[10px] md:text-xs text-gray-400 font-medium tracking-widest mt-1 uppercase">
            La Estatua del Rey Nabucodonosor
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 pointer-events-auto">
          <button 
            onClick={startTour}
            className="bg-black/40 hover:bg-gold hover:text-black border border-gold/40 text-gold px-4 py-2.5 rounded font-serif text-sm transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Play size={14} fill="currentColor" /> Tour Guiado
          </button>

          {(collapsed || stoneActive) ? (
            <button 
              onClick={handleReset}
              className="bg-black/40 hover:bg-red-500 hover:text-white border border-red-500/40 text-red-400 px-4 py-2.5 rounded text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <RotateCcw size={14} /> Restaurar
            </button>
          ) : (
            <button 
              onClick={handleStoneTrigger}
              className="bg-red-600/90 hover:bg-red-500 text-white px-4 py-2.5 rounded text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 border border-red-400/50 backdrop-blur-md"
            >
              <Activity size={14} /> Lanzar Piedra
            </button>
          )}
        </div>
      </header>

      {/* ===== SIDEBAR IZQUIERDO ===== */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 z-15">
        {SECTIONS_DATA.map((section) => (
          <button
            key={section.id}
            onClick={() => !collapsed && !stoneActive && setSelectedId(section.id)}
            disabled={collapsed || stoneActive}
            className={`w-64 text-left p-3 border-l-2 backdrop-blur-md transition-all duration-300 flex flex-col gap-1 rounded-r-md ${
              selectedId === section.id 
                ? 'border-gold bg-gold/15 translate-x-2' 
                : hovered === section.id
                  ? 'border-gold/50 bg-black/50 translate-x-1'
                  : 'border-white/10 hover:border-gold/50 bg-black/40 hover:bg-black/60'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: section.color }}>
              {section.metal}
            </span>
            <span className="text-sm font-bold font-serif">{section.title}</span>
            <span className="text-xs text-gray-400">{section.years}</span>
          </button>
        ))}
      </div>

      {/* ===== ESTATUA CENTRAL (IMAGEN INTERACTIVA) ===== */}
      <div className="absolute inset-0 flex items-center justify-center z-5">
        <motion.div 
          className="relative h-[82vh] max-h-[850px]"
          animate={{ x: activeData ? -100 : 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 200 }}
        >
          {/* Aura dorada detrás de la estatua */}
          {!collapsed && (
            <div 
              className="absolute inset-0 -inset-x-20 blur-3xl opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.35), transparent 70%)' }}
            />
          )}

          {/* Imagen principal de la estatua */}
          {!collapsed && (
            <motion.img
              key="statue-main"
              src="/estatuaprincipal.png"
              alt="Estatua de Nabucodonosor - Daniel 2"
              className="h-full w-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.12)] relative z-[1]"
              draggable={false}
              animate={stoneActive ? {
                x: [0, -5, 5, -4, 4, -2, 2, 0],
              } : {
                y: [0, -6, 0],
              }}
              transition={stoneActive ? {
                duration: 0.15,
                repeat: Infinity,
                ease: "linear",
              } : {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Zonas interactivas sobre la estatua */}
          {!collapsed && !stoneActive && (
            <div className="absolute inset-0 z-[2]">
              {SECTIONS_DATA.map(section => (
                <div
                  key={`zone-${section.id}`}
                  className="absolute left-0 right-0 cursor-pointer"
                  style={{
                    top: `${section.zoneTop}%`,
                    height: `${section.zoneHeight}%`,
                  }}
                  onClick={() => setSelectedId(section.id)}
                  onMouseEnter={() => setHovered(section.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Efecto de brillo al hover/selección */}
                  <div 
                    className="absolute inset-0 transition-all duration-500 rounded-sm"
                    style={{
                      background: (hovered === section.id || selectedId === section.id) 
                        ? `linear-gradient(90deg, transparent 5%, ${section.glowColor} 30%, ${section.glowColor} 70%, transparent 95%)`
                        : 'transparent',
                      borderTop: (hovered === section.id || selectedId === section.id) 
                        ? `1px solid ${section.color}50`
                        : '1px solid transparent',
                      borderBottom: (hovered === section.id || selectedId === section.id) 
                        ? `1px solid ${section.color}50`
                        : '1px solid transparent',
                      boxShadow: selectedId === section.id
                        ? `inset 0 0 30px ${section.glowColor}, 0 0 20px ${section.glowColor}`
                        : 'none',
                    }}
                  />

                  {/* Etiqueta flotante al hacer hover */}
                  <AnimatePresence>
                    {(hovered === section.id && selectedId !== section.id) && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ transform: 'translateX(calc(100% + 12px)) translateY(-50%)' }}
                      >
                        <div 
                          className="px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap backdrop-blur-md bg-black/70"
                          style={{ border: `1px solid ${section.color}60`, color: section.color }}
                        >
                          {section.metal}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          {/* ===== TRAIL PARTICLES (behind the stone) ===== */}
          {trailParticles.map(p => (
            <div
              key={p.id}
              className="absolute pointer-events-none z-20"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${p.color}, transparent)`,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                animation: `trailFade ${p.duration}s ease-out forwards`,
              }}
            />
          ))}

          {/* ===== PIEDRA PROYECTIL MEJORADA ===== */}
          {stoneActive && !collapsed && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 z-30"
              style={{ width: 64, height: 56 }}
              initial={{ top: -80, scale: 0.3, rotate: 0 }}
              animate={{ top: '78%', scale: 1.2, rotate: 720 }}
              transition={{ duration: 1.8, ease: [0.22, 0.68, 0, 1.0] }}
              onAnimationComplete={handleStoneImpact}
            >
              {/* Motion blur streak */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(255,80,0,0.7), rgba(255,160,0,0.3), transparent)',
                  borderRadius: '40% 40% 50% 50%',
                  height: '300%',
                  top: '10%',
                  filter: 'blur(8px)',
                  opacity: 0.7,
                }}
              />
              {/* Outer fire glow */}
              <div
                className="absolute stone-fire-glow"
                style={{
                  inset: -12,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,100,0,0.4), rgba(255,60,0,0.15), transparent 70%)',
                  filter: 'blur(6px)',
                }}
              />
              {/* Stone core body */}
              <div
                className="stone-fire-glow"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle at 30% 25%, #d4d4d4, #8a8a8a 30%, #555 60%, #333 85%, #1a1a1a)',
                  borderRadius: '43% 57% 52% 48% / 45% 38% 62% 55%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Hot edge highlight */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  background: 'conic-gradient(from 200deg, transparent 0%, rgba(255,100,0,0.5) 15%, transparent 30%, rgba(255,60,0,0.3) 60%, transparent 75%)',
                  mixBlendMode: 'screen',
                }} />
                {/* Surface texture cracks */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  background: `
                    linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.3) 41%, transparent 42%),
                    linear-gradient(225deg, transparent 55%, rgba(0,0,0,0.2) 56%, transparent 57%),
                    linear-gradient(315deg, transparent 30%, rgba(255,255,255,0.08) 31%, transparent 32%)
                  `,
                }} />
                {/* Specular highlight */}
                <div style={{
                  position: 'absolute',
                  top: '12%',
                  left: '20%',
                  width: '35%',
                  height: '25%',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.35), transparent)',
                  filter: 'blur(3px)',
                }} />
              </div>
            </motion.div>
          )}

          {/* ===== IMPACT RING ===== */}
          {showImpactRing && (
            <div
              className="absolute pointer-events-none z-25"
              style={{
                left: '50%',
                top: '80%',
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '3px solid rgba(255,120,0,0.8)',
                boxShadow: '0 0 20px rgba(255,80,0,0.5), inset 0 0 20px rgba(255,80,0,0.3)',
                animation: 'impactRing 0.8s ease-out forwards',
              }}
            />
          )}

          {/* ===== IMPACT EMBER PARTICLES ===== */}
          {impactParticles.map(p => (
            <motion.div
              key={p.id}
              className="absolute pointer-events-none z-25"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${p.color}, transparent)`,
                boxShadow: `0 0 ${p.size}px ${p.color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.8 + Math.random() * 0.5, ease: 'easeOut', delay: p.delay }}
            />
          ))}

          {/* Fragmentos de la estatua al colapsar */}
          {collapsed && SECTIONS_DATA.map((section, idx) => (
            <motion.img
              key={`frag-${idx}`}
              src="/estatuaprincipal.png"
              alt=""
              className="absolute top-0 left-0 h-full w-auto pointer-events-none"
              draggable={false}
              style={{
                clipPath: `inset(${section.zoneTop}% 0 ${100 - section.zoneTop - section.zoneHeight}% 0)`,
              }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: SHATTER_OFFSETS[idx].x,
                y: SHATTER_OFFSETS[idx].y,
                rotate: SHATTER_OFFSETS[idx].rotate,
                opacity: 0,
              }}
              transition={{ 
                duration: 2.2, 
                ease: [0.22, 0, 0.36, 1],
                delay: idx * 0.1,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* ===== FLASH DE IMPACTO ===== */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            style={{ background: 'radial-gradient(circle at center 80%, rgba(255,140,0,0.95), rgba(255,60,0,0.6) 30%, rgba(255,255,255,0.8) 50%, transparent 70%)' }}
            initial={{ opacity: 1, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ===== PANEL LATERAL DERECHO (DETALLE) ===== */}
      <AnimatePresence>
        {activeData && (
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="absolute top-0 right-0 w-full md:w-[500px] h-full bg-[#07050a]/90 backdrop-blur-xl border-l border-gold/10 shadow-2xl flex flex-col z-20"
          >
            {/* Header del Panel */}
            <div className="p-6 border-b border-white/5 relative">
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: activeData.color }}>
                {activeData.metal}
              </span>
              <h2 className="text-2xl font-bold font-serif text-gray-100 mt-1">
                {activeData.title}
              </h2>
              <p className="text-xs text-gray-400 tracking-wider mt-1">{activeData.years}</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-black/40 border-b border-white/5 text-xs">
              {[
                { id: 'biblia', label: 'Escritura', icon: BookOpen },
                { id: 'historia', label: 'Historia', icon: Compass },
                { id: 'teologia', label: 'Simbolismo', icon: Shield },
                { id: 'timeline', label: 'Línea del tiempo', icon: Clock }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 flex flex-col items-center gap-1 border-b-2 font-medium tracking-wider uppercase transition-all ${
                    activeTab === tab.id 
                      ? 'border-gold text-gold bg-gold/5' 
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <tab.icon size={14} />
                  <span className="scale-90">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Contenido de la Tab */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === 'biblia' && (
                  <motion.div 
                    key="biblia"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-gold/5 border-l-2 border-gold p-5 rounded-r-md">
                      <p className="italic text-gray-200 leading-relaxed font-serif text-base">
                        {activeData.biblical}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'historia' && (
                  <motion.div 
                    key="historia"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 p-3 rounded">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Rey Principal</span>
                        <p className="font-bold text-sm mt-1">{activeData.king}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Capital</span>
                        <p className="font-bold text-sm mt-1">{activeData.capital}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Resumen Crítico</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{activeData.desc}</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'teologia' && (
                  <motion.div 
                    key="teologia"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <h4 className="text-xs uppercase font-bold text-gray-400">Interpretación Adventista</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {activeData.theology}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'timeline' && (
                  <motion.div 
                    key="timeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 relative pl-4 border-l border-gold/20 ml-2"
                  >
                    {activeData.timeline.map((event, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#07050a] border border-gold group-hover:bg-gold transition-colors duration-300" />
                        <span className="text-[10px] font-bold text-gold tracking-widest">{event.year}</span>
                        <h5 className="font-bold text-sm text-gray-200 mt-0.5">{event.title}</h5>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{event.desc}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navegación Anterior/Siguiente */}
            <div className="p-6 border-t border-white/5 flex justify-between bg-black/20">
              <button 
                disabled={selectedId === 0}
                onClick={() => setSelectedId(selectedId - 1)}
                className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded transition-colors"
              >
                Anterior
              </button>
              <button 
                disabled={selectedId === 4}
                onClick={() => setSelectedId(selectedId + 1)}
                className="px-4 py-2 text-xs bg-gold text-black font-semibold hover:bg-yellow-400 disabled:opacity-20 rounded transition-colors font-serif"
              >
                Siguiente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MODAL REINO DE DIOS ===== */}
      <AnimatePresence>
        {showFinalModal && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b0811] border border-gold/30 rounded-lg max-w-2xl w-full p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowFinalModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">{KINGDOM_OF_GOD.metal}</span>
              <h2 className="text-3xl font-bold font-serif text-gray-100 mt-1 mb-4">{KINGDOM_OF_GOD.title}</h2>
              
              <div className="bg-gold/5 border-l-2 border-gold p-4 mb-6">
                <p className="italic text-gray-200 leading-relaxed font-serif text-sm">
                  {KINGDOM_OF_GOD.biblical}
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {KINGDOM_OF_GOD.desc} {KINGDOM_OF_GOD.theology}
                </p>

                <div>
                  <h4 className="text-xs uppercase font-bold text-gold tracking-widest mb-4">Cronología del Reino Eterno</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {KINGDOM_OF_GOD.timeline.map((event, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded border border-white/5">
                        <span className="text-[9px] font-bold text-gold/75 tracking-wider">{event.year}</span>
                        <h5 className="font-bold text-sm text-gray-200 mt-0.5">{event.title}</h5>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{event.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-gold text-black font-semibold hover:bg-yellow-400 rounded transition-colors font-serif text-sm"
                >
                  Reiniciar Experiencia
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== TOUR NARRATIVO ===== */}
      {tourActive && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-11/12 max-w-xl bg-black/90 border border-gold/40 rounded-lg p-5 z-40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[9px] font-bold text-gold tracking-widest uppercase">Paso {tourStep + 1} de 6</span>
            <p className="text-xs md:text-sm text-gray-200 leading-relaxed mt-1">
              {tourScript[tourStep].text}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              disabled={tourStep === 0}
              onClick={prevTourStep}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded text-xs"
            >
              Atrás
            </button>
            <button 
              onClick={nextTourStep}
              className="px-4 py-1.5 bg-gold text-black font-bold hover:bg-yellow-400 rounded text-xs font-serif"
            >
              {tourStep === 5 ? "Finalizar" : "Siguiente"}
            </button>
            <button 
              onClick={() => setTourActive(false)}
              className="px-2 py-1.5 text-gray-400 hover:text-white text-xs"
            >
              Salir
            </button>
          </div>
        </div>
      )}

      {/* ===== TIP DE INTERACCIÓN ===== */}
      {!tourActive && selectedId === null && !collapsed && !stoneActive && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/45 border border-white/5 px-5 py-2.5 rounded-full text-[10px] tracking-widest text-gray-400 pointer-events-none animate-pulse">
          HAZ CLIC EN LA ESTATUA PARA EXPLORAR
        </div>
      )}
    </div>
  );
}
