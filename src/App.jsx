import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, useCursor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Play, X, RotateCcw, Shield, Compass, BookOpen, Clock, Activity } from 'lucide-react';
import * as THREE from 'three';

// --- DATA BÍBLICA E HISTÓRICA DETALLADA ---
const SECTIONS_DATA = [
  {
    id: 0,
    metal: "Cabeza de Oro",
    title: "Imperio de Babilonia",
    years: "605 – 539 a.C.",
    color: "#ffd700",
    uvHeight: 0.15,
    uvOffset: 0.85,
    planeHeight: 0.90,
    yPos: 2.55,
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
    uvHeight: 0.25,
    uvOffset: 0.60,
    planeHeight: 1.50,
    yPos: 1.35,
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
    uvHeight: 0.15,
    uvOffset: 0.45,
    planeHeight: 0.90,
    yPos: 0.15,
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
    uvHeight: 0.33,
    uvOffset: 0.12,
    planeHeight: 1.98,
    yPos: -1.29,
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
    uvHeight: 0.12,
    uvOffset: 0.00,
    planeHeight: 0.72,
    yPos: -2.64,
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

// --- SISTEMA DE PARTÍCULAS (POLVO DE LA DESTRUCCIÓN) ---
const DustParticles = ({ collapsed }) => {
  const pointsRef = useRef();
  const particleCount = 2000;
  
  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Iniciar las partículas cerca del suelo y esparcidas
      pos[i*3] = (Math.random() - 0.5) * 6; // x
      pos[i*3+1] = -3 + (Math.random() * 1.5); // y
      pos[i*3+2] = (Math.random() - 0.5) * 6; // z
    }
    return pos;
  });

  const [velocities] = useState(() => {
    const v = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Velocidad expansiva y hacia arriba
      v[i*3] = (Math.random() - 0.5) * 0.15; // vx
      v[i*3+1] = Math.random() * 0.2; // vy
      v[i*3+2] = (Math.random() - 0.5) * 0.15; // vz
    }
    return v;
  });

  useFrame(() => {
    if (collapsed && pointsRef.current) {
      const positionsArray = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positionsArray[i*3] += velocities[i*3];
        positionsArray[i*3+1] += velocities[i*3+1];
        positionsArray[i*3+2] += velocities[i*3+2];
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!collapsed) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#d4b483" transparent opacity={0.6} sizeAttenuation={true} depthWrite={false} />
    </points>
  );
};

// --- COMPONENTE 3D CON MODELADO PROCEDURAL ---
const StatueModel = ({ 
  selectedId, 
  setSelectedId, 
  hovered, 
  setHovered, 
  stoneActive, 
  stoneProgress, 
  collapsed, 
  collapseOffsets 
}) => {
  useCursor(hovered !== null, 'pointer', 'auto');
  const controlsRef = useRef();

  // Interpolación de cámara a la sección seleccionada
  useFrame((state) => {
    if (selectedId !== null && !collapsed) {
      const targetY = SECTIONS_DATA[selectedId].yPos;
      state.camera.position.lerp(new THREE.Vector3(0, targetY, 6.5), 0.05);
      controlsRef.current.target.lerp(new THREE.Vector3(0, targetY, 0), 0.05);
    } else if (stoneActive) {
      state.camera.position.lerp(new THREE.Vector3(0, 0.0, 10), 0.04);
      controlsRef.current.target.lerp(new THREE.Vector3(0, -1.5, 0), 0.04);
    } else {
      state.camera.position.lerp(new THREE.Vector3(0, 0.0, 9), 0.05);
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0.0, 0), 0.05);
    }
  });

  return (
    <>
      <OrbitControls 
        ref={controlsRef} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 1.7} 
        minDistance={3} 
        maxDistance={15} 
        enableDamping
        dampingFactor={0.05}
      />
      
      {/* Iluminación 3D Cinematic y Reflejos */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#85a5ff" />
      <pointLight position={[0, 4, 3]} intensity={0.8} color="#ffd700" />
      <Environment preset="studio" />
      
      {/* Grupo General de la Estatua */}
      <group position={[0, -0.5, 0]}>

        {/* Nube de Polvo Profético */}
        <DustParticles collapsed={collapsed} />

        <Float speed={2} rotationIntensity={0.02} floatIntensity={0.1}>
          {/* 5 Secciones de la Estatua (Composición 3D Estilizada) */}
          {SECTIONS_DATA.map((section, idx) => {
            const isSelected = selectedId === section.id;
            const isHovered = hovered === section.id;
            const offset = collapsed ? collapseOffsets[idx] : { pos: [0, 0, 0], rot: [0, 0, 0] };

            return (
              <group
                key={section.id}
                position={[offset.pos[0], section.yPos + offset.pos[1], offset.pos[2]]}
                rotation={offset.rot}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (!collapsed && !stoneActive) setSelectedId(section.id); 
                }}
                onPointerOver={(e) => { 
                  e.stopPropagation(); 
                  if (!collapsed && !stoneActive) setHovered(section.id); 
                }}
                onPointerOut={() => setHovered(null)}
              >
                {/* Composición de meshes de cada sección 3D */}
                <group scale={isSelected ? 1.05 : 1}>
                  {idx === 0 && (
                    <>
                      {/* Cabeza de Oro (Babilonia) - Casco y Cráneo Poligonal */}
                      <mesh castShadow position={[0, 0.05, 0]}>
                        <icosahedronGeometry args={[0.26, 1]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.12} clearcoat={1.0} clearcoatRoughness={0.05} flatShading={true} emissive={isHovered ? "#ffd700" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Cara interna (detrás de la visera) */}
                      <mesh castShadow position={[0, 0, 0.04]}>
                        <sphereGeometry args={[0.21, 8, 8]} />
                        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.25} flatShading={true} />
                      </mesh>
                      {/* Protectores de mejillas del casco (Cheek guards) */}
                      <mesh castShadow position={[-0.18, -0.08, 0.16]} rotation={[0, -0.3, -0.2]}>
                        <boxGeometry args={[0.06, 0.16, 0.16]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.12} clearcoat={1.0} flatShading={true} emissive={isHovered ? "#ffd700" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.18, -0.08, 0.16]} rotation={[0, 0.3, 0.2]}>
                        <boxGeometry args={[0.06, 0.16, 0.16]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.12} clearcoat={1.0} flatShading={true} emissive={isHovered ? "#ffd700" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Cresta de casco de combate romano (Plume) */}
                      <mesh castShadow position={[0, 0.26, 0.0]}>
                        <boxGeometry args={[0.04, 0.08, 0.35]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.12} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0, 0.36, -0.05]} rotation={[-0.15, 0, 0]}>
                        <boxGeometry args={[0.06, 0.22, 0.46]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.12} clearcoat={1.0} flatShading={true} emissive={isHovered ? "#ffd700" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Barba babilónica cincelada y escalonada */}
                      <mesh castShadow position={[0, -0.15, 0.18]} rotation={[0.1, 0, 0]}>
                        <boxGeometry args={[0.18, 0.1, 0.1]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.15} flatShading={true} emissive={isHovered ? "#ffd700" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0, -0.23, 0.16]} rotation={[0.15, 0, 0]}>
                        <boxGeometry args={[0.14, 0.1, 0.08]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.15} flatShading={true} emissive={isHovered ? "#ffd700" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0, -0.3, 0.14]} rotation={[0.2, 0, 0]}>
                        <boxGeometry args={[0.08, 0.08, 0.06]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.15} flatShading={true} emissive={isHovered ? "#ffd700" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Cuello */}
                      <mesh castShadow position={[0, -0.32, 0]}>
                        <cylinderGeometry args={[0.13, 0.15, 0.22, 6]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.12} clearcoat={1.0} flatShading={true} emissive={isHovered ? "#ffd700" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                    </>
                  )}
                  {idx === 1 && (
                    <>
                      {/* Pecho y Brazos de Plata (Medo-Persia) - Coraza muscular */}
                      <mesh castShadow position={[0, 0.2, 0]}>
                        <cylinderGeometry args={[0.42, 0.34, 0.85, 8]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} clearcoat={0.6} clearcoatRoughness={0.1} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0, -0.4, 0]}>
                        <cylinderGeometry args={[0.34, 0.3, 0.42, 8]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} clearcoat={0.6} clearcoatRoughness={0.1} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Músculos Pectorales */}
                      <mesh castShadow position={[-0.11, 0.32, 0.36]} rotation={[0.05, -0.08, -0.05]}>
                        <boxGeometry args={[0.18, 0.25, 0.08]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} clearcoat={0.6} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.11, 0.32, 0.36]} rotation={[0.05, 0.08, 0.05]}>
                        <boxGeometry args={[0.18, 0.25, 0.08]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} clearcoat={0.6} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Abdominales cincelados (Six Pack) */}
                      <mesh castShadow position={[-0.08, 0.14, 0.35]}>
                        <boxGeometry args={[0.09, 0.1, 0.05]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.08, 0.14, 0.35]}>
                        <boxGeometry args={[0.09, 0.1, 0.05]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[-0.08, 0.02, 0.34]}>
                        <boxGeometry args={[0.09, 0.1, 0.05]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.08, 0.02, 0.34]}>
                        <boxGeometry args={[0.09, 0.1, 0.05]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[-0.08, -0.1, 0.33]}>
                        <boxGeometry args={[0.09, 0.1, 0.05]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.08, -0.1, 0.33]}>
                        <boxGeometry args={[0.09, 0.1, 0.05]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Costillas (Placas laterales) */}
                      <mesh castShadow position={[-0.22, 0.06, 0.3]} rotation={[0, 0, 0.1]}>
                        <boxGeometry args={[0.06, 0.3, 0.05]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.22, 0.06, 0.3]} rotation={[0, 0, -0.1]}>
                        <boxGeometry args={[0.06, 0.3, 0.05]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      {/* Hombreras segmentadas (Pauldrons) */}
                      <mesh castShadow position={[-0.56, 0.45, 0]}>
                        <icosahedronGeometry args={[0.2, 1]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[-0.62, 0.3, 0]}>
                        <icosahedronGeometry args={[0.18, 1]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.56, 0.45, 0]}>
                        <icosahedronGeometry args={[0.2, 1]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.62, 0.3, 0]}>
                        <icosahedronGeometry args={[0.18, 1]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      {/* Brazos */}
                      <mesh castShadow position={[-0.66, 0.12, 0]} rotation={[0, 0, 0.15]}>
                        <cylinderGeometry args={[0.1, 0.09, 0.45, 6]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.66, 0.12, 0]} rotation={[0, 0, -0.15]}>
                        <cylinderGeometry args={[0.1, 0.09, 0.45, 6]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      {/* Codos */}
                      <mesh castShadow position={[-0.7, -0.12, 0.02]}>
                        <icosahedronGeometry args={[0.09, 1]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.7, -0.12, 0.02]}>
                        <icosahedronGeometry args={[0.09, 1]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      {/* Antebrazos */}
                      <mesh castShadow position={[-0.75, -0.32, 0.12]} rotation={[-0.25, 0, 0.1]}>
                        <cylinderGeometry args={[0.09, 0.08, 0.45, 6]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.75, -0.32, 0.12]} rotation={[-0.25, 0, -0.1]}>
                        <cylinderGeometry args={[0.09, 0.08, 0.45, 6]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} />
                      </mesh>
                      {/* Manos */}
                      <mesh castShadow position={[-0.82, -0.56, 0.22]}>
                        <icosahedronGeometry args={[0.1, 1]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.82, -0.56, 0.22]}>
                        <icosahedronGeometry args={[0.1, 1]} />
                        <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.22} flatShading={true} emissive={isHovered ? "#ffffff" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                    </>
                  )}
                  {idx === 2 && (
                    <>
                      {/* Vientre y Muslos de Bronce (Grecia) */}
                      <mesh castShadow position={[0, 0.3, 0]}>
                        <cylinderGeometry args={[0.3, 0.33, 0.3, 8]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} clearcoat={0.3} flatShading={true} emissive={isHovered ? "#cd7f32" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Cinturón ancho con hebilla */}
                      <mesh castShadow position={[0, 0.15, 0]}>
                        <cylinderGeometry args={[0.35, 0.35, 0.16, 8]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0, 0.15, 0.36]}>
                        <boxGeometry args={[0.14, 0.18, 0.06]} />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.12} flatShading={true} />
                      </mesh>
                      {/* Falda de combate (Pteruges) - 8 Tiras dispuestas en círculo */}
                      <mesh castShadow position={[0, -0.15, 0.38]} rotation={[0.15, 0, 0]}>
                        <boxGeometry args={[0.08, 0.44, 0.03]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[-0.14, -0.15, 0.35]} rotation={[0.15, -0.3, 0.05]}>
                        <boxGeometry args={[0.08, 0.44, 0.03]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.14, -0.15, 0.35]} rotation={[0.15, 0.3, -0.05]}>
                        <boxGeometry args={[0.08, 0.44, 0.03]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[-0.26, -0.15, 0.26]} rotation={[0.08, -0.7, 0.1]}>
                        <boxGeometry args={[0.08, 0.44, 0.03]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.26, -0.15, 0.26]} rotation={[0.08, 0.7, -0.1]}>
                        <boxGeometry args={[0.08, 0.44, 0.03]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[-0.22, -0.15, -0.26]} rotation={[-0.08, -2.4, 0.1]}>
                        <boxGeometry args={[0.08, 0.44, 0.03]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.22, -0.15, -0.26]} rotation={[-0.08, 2.4, -0.1]}>
                        <boxGeometry args={[0.08, 0.44, 0.03]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0, -0.15, -0.34]} rotation={[-0.15, 0, 0]}>
                        <boxGeometry args={[0.08, 0.44, 0.03]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} />
                      </mesh>
                      {/* Muslos */}
                      <mesh castShadow position={[-0.18, -0.32, 0]} rotation={[0, 0, 0.06]}>
                        <cylinderGeometry args={[0.14, 0.12, 0.5, 6]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} emissive={isHovered ? "#cd7f32" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.18, -0.32, 0]} rotation={[0, 0, -0.06]}>
                        <cylinderGeometry args={[0.14, 0.12, 0.5, 6]} />
                        <meshStandardMaterial color="#cd7f32" metalness={1.0} roughness={0.3} flatShading={true} emissive={isHovered ? "#cd7f32" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                    </>
                  )}
                  {idx === 3 && (
                    <>
                      {/* Piernas de Hierro (Roma) */}
                      {/* Rodilleras (Kneecaps) */}
                      <mesh castShadow position={[-0.18, 0.8, 0.04]}>
                        <icosahedronGeometry args={[0.12, 1]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} emissive={isHovered ? "#555d66" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.18, 0.8, 0.04]}>
                        <icosahedronGeometry args={[0.12, 1]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} emissive={isHovered ? "#555d66" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Pantorrillas */}
                      <mesh castShadow position={[-0.18, 0, 0]}>
                        <cylinderGeometry args={[0.13, 0.1, 1.4, 6]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.18, 0, 0]}>
                        <cylinderGeometry args={[0.13, 0.1, 1.4, 6]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} />
                      </mesh>
                      {/* Placas frontales de espinilleras (Greaves) */}
                      <mesh castShadow position={[-0.18, 0, 0.12]} rotation={[0.05, 0, 0]}>
                        <boxGeometry args={[0.09, 1.3, 0.06]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} emissive={isHovered ? "#555d66" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.18, 0, 0.12]} rotation={[0.05, 0, 0]}>
                        <boxGeometry args={[0.09, 1.3, 0.06]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} emissive={isHovered ? "#555d66" : "#000000"} emissiveIntensity={isHovered ? 0.2 : 0} />
                      </mesh>
                      {/* Tobillos */}
                      <mesh castShadow position={[-0.18, -0.8, 0]}>
                        <icosahedronGeometry args={[0.09, 1]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.18, -0.8, 0]}>
                        <icosahedronGeometry args={[0.09, 1]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} />
                      </mesh>
                    </>
                  )}
                  {idx === 4 && (
                    <>
                      {/* Pies de Hierro y Barro (Europa Dividida) */}
                      {/* Pie Izquierdo: Talón de Hierro, Frente de Barro, dedos alternados */}
                      <mesh castShadow position={[-0.18, 0.1, -0.04]}>
                        <boxGeometry args={[0.24, 0.18, 0.24]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.4} flatShading={true} emissive={isHovered ? "#555d66" : "#000000"} emissiveIntensity={isHovered ? 0.15 : 0} />
                      </mesh>
                      <mesh castShadow position={[-0.18, -0.15, 0.15]}>
                        <boxGeometry args={[0.26, 0.06, 0.52]} />
                        <meshStandardMaterial color="#9c5327" metalness={0.0} roughness={0.95} flatShading={true} emissive={isHovered ? "#9c5327" : "#000000"} emissiveIntensity={isHovered ? 0.15 : 0} />
                      </mesh>
                      {/* Placa de metal empeine */}
                      <mesh castShadow position={[-0.18, -0.02, 0.16]} rotation={[0.1, 0, 0]}>
                        <boxGeometry args={[0.22, 0.14, 0.22]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.4} flatShading={true} />
                      </mesh>
                      {/* Parche de barro incrustado */}
                      <mesh castShadow position={[-0.18, 0.08, 0.18]} rotation={[0.2, 0.2, -0.1]}>
                        <boxGeometry args={[0.12, 0.18, 0.12]} />
                        <meshStandardMaterial color="#9c5327" metalness={0.0} roughness={0.95} flatShading={true} />
                      </mesh>
                      {/* Dedos pie izquierdo alternados */}
                      <mesh castShadow position={[-0.1, -0.1, 0.42]}>
                        <boxGeometry args={[0.06, 0.12, 0.14]} />
                        <meshStandardMaterial color="#9c5327" metalness={0.0} roughness={0.95} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[-0.14, -0.1, 0.41]}>
                        <boxGeometry args={[0.05, 0.1, 0.12]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[-0.18, -0.1, 0.4]}>
                        <boxGeometry args={[0.05, 0.09, 0.11]} />
                        <meshStandardMaterial color="#9c5327" metalness={0.0} roughness={0.95} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[-0.22, -0.1, 0.39]}>
                        <boxGeometry args={[0.04, 0.08, 0.1]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.45} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[-0.26, -0.1, 0.38]}>
                        <boxGeometry args={[0.04, 0.07, 0.09]} />
                        <meshStandardMaterial color="#9c5327" metalness={0.0} roughness={0.95} flatShading={true} />
                      </mesh>

                      {/* Pie Derecho: Talón de Barro, Frente de Hierro, dedos alternados */}
                      <mesh castShadow position={[0.18, 0.1, -0.04]}>
                        <boxGeometry args={[0.24, 0.18, 0.24]} />
                        <meshStandardMaterial color="#9c5327" metalness={0.0} roughness={0.95} flatShading={true} emissive={isHovered ? "#9c5327" : "#000000"} emissiveIntensity={isHovered ? 0.15 : 0} />
                      </mesh>
                      <mesh castShadow position={[0.18, -0.15, 0.15]}>
                        <boxGeometry args={[0.26, 0.06, 0.52]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.4} flatShading={true} emissive={isHovered ? "#555d66" : "#000000"} emissiveIntensity={isHovered ? 0.15 : 0} />
                      </mesh>
                      {/* Placa de barro empeine */}
                      <mesh castShadow position={[0.18, -0.02, 0.16]} rotation={[0.1, 0, 0]}>
                        <boxGeometry args={[0.22, 0.14, 0.22]} />
                        <meshStandardMaterial color="#9c5327" metalness={0.0} roughness={0.95} flatShading={true} />
                      </mesh>
                      {/* Parche de metal incrustado */}
                      <mesh castShadow position={[0.18, 0.08, 0.18]} rotation={[0.2, -0.2, 0.1]}>
                        <boxGeometry args={[0.12, 0.18, 0.12]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.4} flatShading={true} />
                      </mesh>
                      {/* Dedos pie derecho alternados */}
                      <mesh castShadow position={[0.1, -0.1, 0.42]}>
                        <boxGeometry args={[0.06, 0.12, 0.14]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.4} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.14, -0.1, 0.41]}>
                        <boxGeometry args={[0.05, 0.1, 0.12]} />
                        <meshStandardMaterial color="#9c5327" metalness={0.0} roughness={0.95} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.18, -0.1, 0.4]}>
                        <boxGeometry args={[0.05, 0.09, 0.11]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.4} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.22, -0.1, 0.39]}>
                        <boxGeometry args={[0.04, 0.08, 0.1]} />
                        <meshStandardMaterial color="#9c5327" metalness={0.0} roughness={0.95} flatShading={true} />
                      </mesh>
                      <mesh castShadow position={[0.26, -0.1, 0.38]}>
                        <boxGeometry args={[0.04, 0.07, 0.09]} />
                        <meshStandardMaterial color="#555d66" metalness={0.9} roughness={0.4} flatShading={true} />
                      </mesh>
                    </>
                  )}
                </group>
                
                {/* Halo de selección circular 3D en lugar de plano 2D trasero */}
                {isSelected && (
                  <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <torusGeometry args={[0.8, 0.02, 8, 64]} />
                    <meshBasicMaterial color={section.color} transparent opacity={0.8} />
                  </mesh>
                )}
              </group>
            );
          })}
        </Float>

        {/* --- PIEDRA GOLPEADORA --- */}
        {stoneActive && !collapsed && (
          <mesh 
            position={[
              0, 
              THREE.MathUtils.lerp(12, -2.5, stoneProgress), 
              THREE.MathUtils.lerp(6, 0.2, stoneProgress)
            ]}
            rotation={[stoneProgress * 20, stoneProgress * 25, 0]}
            castShadow
          >
            <dodecahedronGeometry args={[0.6, 1]} />
            <meshStandardMaterial color="#888894" roughness={0.8} metalness={0.3} />
          </mesh>
        )}
      </group>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.8} scale={15} blur={2.5} far={4} color="#000000" />
    </>
  );
};

// --- COMPONENTE PRINCIPAL (UI + ESCENA 3D) ---
export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [activeTab, setActiveTab] = useState('biblia');

  // Controladores de Animación del impacto de la Piedra
  const [stoneActive, setStoneActive] = useState(false);
  const [stoneProgress, setStoneProgress] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [collapseOffsets, setCollapseOffsets] = useState(
    SECTIONS_DATA.map(() => ({ pos: [0, 0, 0], rot: [0, 0, 0] }))
  );
  const [showFinalModal, setShowFinalModal] = useState(false);
  
  // Variables del Tour Guiado
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Animación del proyectil piedra
  useEffect(() => {
    let interval;
    if (stoneActive && !collapsed) {
      interval = setInterval(() => {
        setStoneProgress(prev => {
          // Incremento con curva de aceleración para simular gravedad real
          const step = 0.015 + (prev * 0.03); 
          if (prev + step >= 1) {
            clearInterval(interval);
            triggerCollapsePhysics();
            return 1;
          }
          return prev + step;
        });
      }, 16); // ~60fps
    }
    return () => clearInterval(interval);
  }, [stoneActive]);

  // Animación de caída de fragmentos (física básica y explosiva)
  useEffect(() => {
    let interval;
    if (collapsed) {
      const vels = SECTIONS_DATA.map((_, idx) => ({
        posVel: [
          (Math.random() - 0.5) * 0.3, // Fuerza de explosión lateral
          (Math.random() * 0.15) + 0.1, // Rebote hacia arriba
          (Math.random() - 0.5) * 0.3  // Explosión en Z
        ],
        rotVel: [
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15
        ]
      }));

      interval = setInterval(() => {
        setCollapseOffsets(prev => 
          prev.map((offset, idx) => {
            if (offset.pos[1] < -4.0) return offset; // Llegó al suelo
            
            const vel = vels[idx];
            vel.posVel[1] -= 0.015; // Gravedad acelerada
            
            return {
              pos: [
                offset.pos[0] + vel.posVel[0],
                offset.pos[1] + vel.posVel[1],
                offset.pos[2] + vel.posVel[2],
              ],
              rot: [
                offset.rot[0] + vel.rotVel[0],
                offset.rot[1] + vel.rotVel[1],
                offset.rot[2] + vel.rotVel[2],
              ]
            };
          })
        );
      }, 16);
    }
    return () => clearInterval(interval);
  }, [collapsed]);

  const triggerCollapsePhysics = () => {
    setCollapsed(true);
    setTimeout(() => {
      setShowFinalModal(true);
      setSelectedId(null);
    }, 1500);
  };

  const handleStoneTrigger = () => {
    if (stoneActive || collapsed) return;
    setStoneActive(true);
    setStoneProgress(0);
  };

  const handleReset = () => {
    setStoneActive(false);
    setStoneProgress(0);
    setCollapsed(false);
    setShowFinalModal(false);
    setCollapseOffsets(SECTIONS_DATA.map(() => ({ pos: [0, 0, 0], rot: [0, 0, 0] })));
    setSelectedId(null);
    setTourActive(false);
  };

  // --- TOUR GUIADO CONTROLLER ---
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
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      if (nextStep === 5) {
        setSelectedId(null);
        handleStoneTrigger();
      } else {
        setSelectedId(nextStep);
      }
    } else {
      setTourActive(false);
    }
  };

  const prevTourStep = () => {
    if (tourStep > 0) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      setSelectedId(prevStep);
    }
  };

  const activeData = selectedId !== null ? SECTIONS_DATA[selectedId] : null;

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-950 via-[#0a0710] to-black text-gray-100 overflow-hidden relative font-sans select-none">
      
      {/* HEADER */}
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

      {/* ÍNDICE LATERAL IZQUIERDO */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 z-15">
        {SECTIONS_DATA.map((section) => (
          <button
            key={section.id}
            onClick={() => !collapsed && setSelectedId(section.id)}
            disabled={collapsed}
            className={`w-64 text-left p-3 border-l-2 backdrop-blur-md transition-all duration-300 flex flex-col gap-1 rounded-r-md ${
              selectedId === section.id 
                ? 'border-gold bg-gold/15 translate-x-2' 
                : 'border-white/10 hover:border-gold/50 bg-black/40 hover:bg-black/60'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold">{section.metal}</span>
            <span className="text-sm font-bold font-serif">{section.title}</span>
            <span className="text-xs text-gray-400">{section.years}</span>
          </button>
        ))}
      </div>

      {/* LIENZO 3D (R3F) */}
      <div className="w-full h-full absolute top-0 left-0">
        <Canvas shadows camera={{ position: [0, 0.0, 9], fov: 45 }}>
          <Suspense fallback={null}>
            <StatueModel 
              selectedId={selectedId} 
              setSelectedId={setSelectedId} 
              hovered={hovered}
              setHovered={setHovered}
              stoneActive={stoneActive}
              stoneProgress={stoneProgress}
              collapsed={collapsed}
              collapseOffsets={collapseOffsets}
            />
            {/* Post-procesamiento Cinemático */}
            <EffectComposer>
              <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur intensity={1.2} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* POPUP LATERAL (Framer Motion) */}
      <AnimatePresence>
        {activeData && (
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="absolute top-0 right-0 w-full md:w-[500px] h-full bg-[#07050a]/90 backdrop-blur-xl border-l border-gold/10 shadow-2xl flex flex-col z-20"
          >
            {/* Header del Popup */}
            <div className="p-6 border-b border-white/5 relative">
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
              <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
                {activeData.metal}
              </span>
              <h2 className="text-2xl font-bold font-serif text-gray-100 mt-1">
                {activeData.title}
              </h2>
              <p className="text-xs text-gray-400 tracking-wider mt-1">{activeData.years}</p>
            </div>

            {/* Tabs del Popup */}
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

            {/* Contenido de la Tab Activa */}
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

            {/* Controles de Navegación */}
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

      {/* POPUP REINO DE DIOS (Final Impact) */}
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

      {/* TOUR NARRATIVO OVERLAY */}
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

      {/* TIP DE INTERACCIÓN */}
      {!tourActive && !selectedId && !collapsed && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/45 border border-white/5 px-5 py-2.5 rounded-full text-[10px] tracking-widest text-gray-400 pointer-events-none animate-pulse">
          ARRASTRA PARA ROTAR • HAZ CLIC PARA INTERACTUAR
        </div>
      )}
    </div>
  );
}
