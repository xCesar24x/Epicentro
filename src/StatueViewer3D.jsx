import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// =====================================================
// MODELO 3D DE LA ESTATUA
// =====================================================
function StatueModel({ onSectionClick, selectedId, hovered, setHovered, collapsed, sections }) {
  const { scene } = useGLTF('/estatua_daniel2.glb');
  const modelRef = useRef();

  // Gentle floating animation
  useFrame((state) => {
    if (modelRef.current && !collapsed) {
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  // Map mesh names to section IDs
  const meshSectionMap = {
    'HEAD_VOID': 0,
    'HARMS_VOID': 1,
    'BODY_VOID': 2,
    'LEGS_VOID': 3,
    'STONE': 4,
  };

  // Apply emissive glow to selected/hovered sections
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const sectionId = meshSectionMap[child.name];
        if (sectionId !== undefined && sections[sectionId]) {
          const section = sections[sectionId];
          const color = new THREE.Color(section.color);

          if (child.material) {
            child.material = child.material.clone();
            child.material.transparent = true;
            
            if (selectedId === sectionId) {
              child.material.emissive = color;
              child.material.emissiveIntensity = 0.35;
            } else if (hovered === sectionId) {
              child.material.emissive = color;
              child.material.emissiveIntensity = 0.15;
            } else {
              child.material.emissive = new THREE.Color(0x000000);
              child.material.emissiveIntensity = 0;
            }
          }
        }
      }
    });
  }, [selectedId, hovered, scene, sections]);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const name = e.object.name;
    const sectionId = meshSectionMap[name];
    if (sectionId !== undefined) {
      setHovered(sectionId);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e) => {
    setHovered(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const name = e.object.name;
    const sectionId = meshSectionMap[name];
    if (sectionId !== undefined) {
      onSectionClick(sectionId);
    }
  };

  return (
    <group ref={modelRef}>
      <primitive 
        object={scene} 
        scale={0.01}
        position={[0, -1.5, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  );
}

// =====================================================
// LOADING SPINNER
// =====================================================
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-gold/70 text-sm font-serif tracking-wider">Cargando modelo 3D...</p>
      </div>
    </Html>
  );
}

// =====================================================
// COMPONENTE PRINCIPAL DEL VISOR 3D
// =====================================================
export default function StatueViewer3D({ selectedId, setSelectedId, hovered, setHovered, collapsed, stoneActive, sections }) {
  return (
    <div className="absolute inset-0 z-5">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow
          color="#fff5e0"
        />
        <directionalLight 
          position={[-3, 4, -2]} 
          intensity={0.4} 
          color="#b0c4ff"
        />
        <pointLight position={[0, 3, 2]} intensity={0.5} color="#ffd700" />

        {/* Environment for realistic reflections */}
        <Environment preset="city" />

        {/* 3D Statue Model */}
        <Suspense fallback={<LoadingFallback />}>
          <StatueModel
            onSectionClick={(id) => !collapsed && !stoneActive && setSelectedId(id)}
            selectedId={selectedId}
            hovered={hovered}
            setHovered={setHovered}
            collapsed={collapsed}
            sections={sections}
          />
        </Suspense>

        {/* Contact shadow below the statue */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={8}
          blur={2}
          far={4}
          color="#d4af37"
        />

        {/* Orbit controls for user interaction */}
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={7}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={!selectedId && !collapsed}
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Post-processing bloom for glow */}
        <EffectComposer>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/estatua_daniel2.glb');
