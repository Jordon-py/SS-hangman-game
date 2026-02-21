import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PointMaterial, Points, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

function CameraRig({ reducedMotion }) {
  const { camera, pointer } = useThree();
  const basePosition = useMemo(() => new THREE.Vector3(0, 0, 7.5), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const targetX = reducedMotion ? 0 : pointer.x * 0.34;
    const targetY = reducedMotion ? 0 : pointer.y * 0.24 + Math.sin(time * 0.34) * 0.08;
    const targetZ = reducedMotion ? 7.5 : 7.35 + Math.cos(time * 0.22) * 0.14;

    basePosition.set(targetX, targetY, targetZ);
    camera.position.lerp(basePosition, 0.045);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function HolographicLogo({ reducedMotion }) {
  const groupRef = useRef(null);
  const faceMaterialRef = useRef(null);
  const shadowMaterialRef = useRef(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      const targetRotY = reducedMotion ? 0 : state.pointer.x * 0.22 + Math.sin(time * 0.45) * 0.05;
      const targetRotX = reducedMotion ? 0 : state.pointer.y * 0.08;
      const targetY = reducedMotion ? 0.12 : 0.12 + Math.sin(time * 0.95) * 0.08;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.07);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.07);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.07);
    }

    if (faceMaterialRef.current) {
      const pulse = 0.5 + Math.sin(time * 1.6) * 0.5;
      faceMaterialRef.current.color.setHSL(0.52 + pulse * 0.04, 0.82, 0.57);
      faceMaterialRef.current.emissive.setHSL(0.5 + pulse * 0.03, 0.95, 0.32);
      faceMaterialRef.current.emissiveIntensity = reducedMotion ? 0.8 : 0.9 + pulse * 0.55;
    }

    if (shadowMaterialRef.current) {
      const pulse = 0.5 + Math.cos(time * 1.2) * 0.5;
      shadowMaterialRef.current.emissiveIntensity = reducedMotion ? 0.2 : 0.2 + pulse * 0.2;
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1}
      rotationIntensity={reducedMotion ? 0 : 0.06}
      floatIntensity={reducedMotion ? 0 : 0.16}
    >
      <group ref={groupRef} position={[0, 0.12, 0]}>
        <Text
          fontSize={1.07}
          letterSpacing={-0.045}
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.08]}
          castShadow
        >
          AuralMind
          <meshStandardMaterial
            ref={faceMaterialRef}
            roughness={0.24}
            metalness={0.7}
            emissiveIntensity={1}
            toneMapped={false}
          />
        </Text>
        <Text
          fontSize={1.07}
          letterSpacing={-0.045}
          anchorX="center"
          anchorY="middle"
          position={[0, 0, -0.18]}
        >
          AuralMind
          <meshStandardMaterial
            ref={shadowMaterialRef}
            color="#0b2030"
            emissive="#102c42"
            roughness={0.45}
            metalness={0.35}
          />
        </Text>
      </group>
    </Float>
  );
}

function createParticlePositions(count, spreadX, spreadY, spreadZ) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * spreadX;
    positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
    positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;
  }
  return positions;
}

function AmbientField({ reducedMotion }) {
  const groupRef = useRef(null);
  const farLayerRef = useRef(null);
  const nearLayerRef = useRef(null);

  const farCount = reducedMotion ? 180 : 360;
  const nearCount = reducedMotion ? 80 : 180;

  const farPositions = useMemo(
    () => createParticlePositions(farCount, 20, 11, 12),
    [farCount]
  );
  const nearPositions = useMemo(
    () => createParticlePositions(nearCount, 14, 8, 7),
    [nearCount]
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!groupRef.current) return;

    const targetRotY = reducedMotion ? 0.06 : state.pointer.x * 0.16 + time * 0.025;
    const targetRotX = reducedMotion ? 0.04 : state.pointer.y * 0.11 + Math.sin(time * 0.22) * 0.03;
    const targetPosX = reducedMotion ? 0 : state.pointer.x * 0.2;
    const targetPosY = reducedMotion ? 0 : state.pointer.y * 0.14;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.03);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.03);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.03);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.03);

    if (!reducedMotion && farLayerRef.current?.material) {
      farLayerRef.current.material.opacity = 0.3 + Math.sin(time * 0.7) * 0.07;
    }
    if (!reducedMotion && nearLayerRef.current?.material) {
      nearLayerRef.current.material.opacity = 0.55 + Math.cos(time * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Points ref={farLayerRef} positions={farPositions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#8ce7ff"
          size={0.03}
          sizeAttenuation
          depthWrite={false}
          opacity={0.34}
        />
      </Points>
      <Points ref={nearLayerRef} positions={nearPositions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#ffd7a0"
          size={0.046}
          sizeAttenuation
          depthWrite={false}
          opacity={0.56}
        />
      </Points>
    </group>
  );
}

function EnergyRings({ reducedMotion }) {
  const groupRef = useRef(null);
  const materialARef = useRef(null);
  const materialBRef = useRef(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!groupRef.current) return;

    const targetX = reducedMotion ? 0 : state.pointer.y * 0.08;
    const targetY = reducedMotion ? 0 : state.pointer.x * 0.12;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);

    if (!reducedMotion) {
      groupRef.current.rotation.z += 0.0018;
    }

    if (materialARef.current) {
      const pulse = 0.5 + Math.sin(time * 1.3) * 0.5;
      materialARef.current.emissiveIntensity = reducedMotion ? 0.7 : 0.7 + pulse * 0.5;
      materialARef.current.opacity = reducedMotion ? 0.44 : 0.36 + pulse * 0.2;
    }
    if (materialBRef.current) {
      const pulse = 0.5 + Math.cos(time * 1.1) * 0.5;
      materialBRef.current.emissiveIntensity = reducedMotion ? 0.35 : 0.34 + pulse * 0.26;
      materialBRef.current.opacity = reducedMotion ? 0.28 : 0.25 + pulse * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.1, -1.15]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.45, 0.028, 20, 180]} />
        <meshStandardMaterial
          ref={materialARef}
          color="#87f4ff"
          emissive="#32c8e8"
          metalness={0.48}
          roughness={0.26}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -0.12, -1.55]} rotation={[Math.PI / 2.3, 0.4, 0.12]}>
        <torusGeometry args={[3.1, 0.02, 16, 200]} />
        <meshStandardMaterial
          ref={materialBRef}
          color="#ffd29d"
          emissive="#f09f58"
          metalness={0.35}
          roughness={0.32}
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -1.6, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.6, 64]} />
        <meshBasicMaterial color="#34b7d2" transparent opacity={0.09} depthWrite={false} />
      </mesh>
    </group>
  );
}

function AuroraBands({ reducedMotion }) {
  const groupRef = useRef(null);
  const bandARef = useRef(null);
  const bandBRef = useRef(null);
  const bandCRef = useRef(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!groupRef.current) return;

    const targetX = reducedMotion ? 0 : state.pointer.y * 0.12;
    const targetY = reducedMotion ? 0 : state.pointer.x * 0.18;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.03);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.03);

    if (bandARef.current) {
      const pulse = 0.5 + Math.sin(time * 0.8) * 0.5;
      bandARef.current.opacity = reducedMotion ? 0.18 : 0.14 + pulse * 0.12;
      if (!reducedMotion) bandARef.current.rotation += 0.0012;
    }
    if (bandBRef.current) {
      const pulse = 0.5 + Math.cos(time * 0.7) * 0.5;
      bandBRef.current.opacity = reducedMotion ? 0.14 : 0.12 + pulse * 0.1;
      if (!reducedMotion) bandBRef.current.rotation -= 0.0008;
    }
    if (bandCRef.current) {
      const pulse = 0.5 + Math.sin(time * 0.95 + 1.4) * 0.5;
      bandCRef.current.opacity = reducedMotion ? 0.1 : 0.08 + pulse * 0.08;
      if (!reducedMotion) bandCRef.current.rotation += 0.001;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.35, -5.2]}>
      <mesh rotation={[0.06, -0.22, 0.1]}>
        <planeGeometry args={[9.2, 2.7]} />
        <meshBasicMaterial
          ref={bandARef}
          color="#2dd4ff"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[-0.08, 0.18, -0.12]} position={[0.4, -0.8, -0.6]}>
        <planeGeometry args={[8.4, 2.1]} />
        <meshBasicMaterial
          ref={bandBRef}
          color="#4ce0c2"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[0.1, 0.05, 0.22]} position={[-0.9, 0.7, -1]}>
        <planeGeometry args={[7.6, 1.8]} />
        <meshBasicMaterial
          ref={bandCRef}
          color="#ffaf6a"
          transparent
          opacity={0.11}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function SceneContents({ reducedMotion }) {
  const sparkleCount = reducedMotion ? 30 : 80;

  return (
    <>
      <color attach="background" args={['#071426']} />
      <fog attach="fog" args={['#071426', 9, 22]} />

      <ambientLight intensity={0.3} />
      <hemisphereLight intensity={0.8} skyColor="#94ebff" groundColor="#09141f" />
      <directionalLight color="#d8ffff" intensity={1.3} position={[3.5, 4.2, 5]} />
      <pointLight color="#ffb978" intensity={1.4} position={[-3, -1.3, 4.5]} />

      <AuroraBands reducedMotion={reducedMotion} />
      <AmbientField reducedMotion={reducedMotion} />
      <EnergyRings reducedMotion={reducedMotion} />
      <Sparkles
        count={sparkleCount}
        scale={[12, 6, 8]}
        size={1.8}
        speed={reducedMotion ? 0 : 0.18}
        opacity={0.38}
        noise={0.6}
        color="#9fefff"
      />
      <HolographicLogo reducedMotion={reducedMotion} />
      <CameraRig reducedMotion={reducedMotion} />
    </>
  );
}

export default function Scene() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 60, position: [0, 0, 7.5] }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <SceneContents reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
