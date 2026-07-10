import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Html, Center, Bounds } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// =====================================================
// MODELO 3D DE LA ESTATUA
// =====================================================
function StatueModel({ onSectionClick, selectedId, hovered, setHovered, collapsed, sections }) {
  const { scene } = useGLTF('/estatua_daniel2.glb');
  const modelRef = useRef();

  // Log mesh names on first load for debugging
  useEffect(() => {
    console.log('GLB meshes found:');
    scene.traverse((child) => {
      if (child.isMesh) {
        console.log(`  - Mesh: "${child.name}"`);
      }
    });
  }, [scene]);

  // Gentle floating animation
  useFrame((state) => {
    if (modelRef.current && !collapsed) {
      modelRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.0003;
    }
  });

  // Map mesh names to section IDs — will be adjusted after seeing console logs
  const meshSectionMap = useMemo(() => ({
    'HEAD_VOID': 0,
    'Head_VOID': 0,
    'head_void': 0,
    'HARMS_VOID': 1,
    'Harms_VOID': 1,
    'harms_void': 1,
    'BODY_VOID': 2,
    'Body_VOID': 2,
    'body_void': 2,
    'LEGS_VOID': 3,
    'Legs_VOID': 3,
    'legs_void': 3,
    'ONLY_LEGS': 3,
    'STONE': 4,
    'Stone': 4,
    'stone': 4,
  }), []);

  // Apply emissive glow to selected/hovered sections
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Try matching mesh name
        let sectionId = undefined;
        for (const [key, value] of Object.entries(meshSectionMap)) {
          if (child.name.includes(key) || child.name.toLowerCase().includes(key.toLowerCase())) {
            sectionId = value;
            break;
          }
        }

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
  }, [selectedId, hovered, scene, sections, meshSectionMap]);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const name = e.object.name;
    let sectionId = undefined;
    for (const [key, value] of Object.entries(meshSectionMap)) {
      if (name.includes(key) || name.toLowerCase().includes(key.toLowerCase())) {
        sectionId = value;
        break;
      }
    }
    if (sectionId !== undefined) {
      setHovered(sectionId);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const name = e.object.name;
    let sectionId = undefined;
    for (const [key, value] of Object.entries(meshSectionMap)) {
      if (name.includes(key) || name.toLowerCase().includes(key.toLowerCase())) {
        sectionId = value;
        break;
      }
    }
    if (sectionId !== undefined) {
      onSectionClick(sectionId);
    }
  };

  return (
    <group ref={modelRef}>
      <primitive 
        object={scene} 
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
        <div className="w-10 h-10 border-2 border-t-yellow-500 border-yellow-500/30 rounded-full animate-spin" />
        <p className="text-yellow-500/70 text-sm tracking-wider">Cargando modelo 3D...</p>
      </div>
    </Html>
  );
}

// =====================================================
// COMPONENTE PRINCIPAL DEL VISOR 3D
// =====================================================
export default function StatueViewer3D({ selectedId, setSelectedId, hovered, setHovered, collapsed, stoneActive, sections }) {
  return (
    <div className="absolute inset-0" style={{ zIndex: 5 }}>
      <Canvas
        camera={{ position: [0, 50, 200], fov: 45, near: 0.1, far: 10000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[50, 80, 50]} 
          intensity={1.5} 
          color="#fff5e0"
        />
        <directionalLight 
          position={[-30, 40, -20]} 
          intensity={0.5} 
          color="#b0c4ff"
        />
        <pointLight position={[0, 60, 40]} intensity={0.8} color="#ffd700" />

        {/* Environment for realistic reflections */}
        <Environment preset="city" />

        {/* Auto-center and auto-fit the model */}
        <Bounds fit clip observe margin={1.4}>
          <Suspense fallback={<LoadingFallback />}>
            <Center>
              <StatueModel
                onSectionClick={(id) => !collapsed && !stoneActive && setSelectedId(id)}
                selectedId={selectedId}
                hovered={hovered}
                setHovered={setHovered}
                collapsed={collapsed}
                sections={sections}
              />
            </Center>
          </Suspense>
        </Bounds>

        {/* Orbit controls for user interaction */}
        <OrbitControls
          enablePan={false}
          minDistance={50}
          maxDistance={500}
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
