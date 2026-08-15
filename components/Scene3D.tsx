"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

/* =========================================================
   LARGE CENTRAL BUBBLE
========================================================= */

function MainBubble() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x =
      state.clock.elapsedTime * 0.18;

    meshRef.current.rotation.y =
      state.clock.elapsedTime * 0.28;

    meshRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <Float
      speed={1}
      rotationIntensity={0.25}
      floatIntensity={0.7}
    >
      <mesh
        ref={meshRef}
        position={[2.5, 0.2, 0]}
      >
        <sphereGeometry args={[0.85, 48, 48]} />

        <meshStandardMaterial
          color="#ffc515"
          roughness={0.12}
          metalness={0.42}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}


/* =========================================================
   EXISTING DIAMOND
========================================================= */

function Diamond({
  position,
  size,
  speed = 1.5,
}: {
  position: [number, number, number];
  size: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x =
      state.clock.elapsedTime * 0.7;

    meshRef.current.rotation.y =
      state.clock.elapsedTime * 0.9;

    meshRef.current.rotation.z =
      state.clock.elapsedTime * 0.4;
  });

  return (
    <Float
      speed={speed}
      rotationIntensity={0.8}
      floatIntensity={1.3}
    >
      <mesh
        ref={meshRef}
        position={position}
      >
        <octahedronGeometry args={[size, 0]} />

        <meshStandardMaterial
          color="#dca800"
          roughness={0.18}
          metalness={0.55}
        />
      </mesh>
    </Float>
  );
}


/* =========================================================
   SMALL BUBBLE
========================================================= */

function SmallBubble({
  position,
  size,
  speed = 1.8,
}: {
  position: [number, number, number];
  size: number;
  speed?: number;
}) {
  return (
    <Float
      speed={speed}
      rotationIntensity={0.4}
      floatIntensity={1.2}
    >
      <mesh position={position}>
        <sphereGeometry
          args={[size, 24, 24]}
        />

        <meshStandardMaterial
          color="#ffc515"
          roughness={0.2}
          metalness={0.25}
        />
      </mesh>
    </Float>
  );
}


/* =========================================================
   MAIN SCENE
========================================================= */

export default function Scene3D() {
  return (
    <div
      style={{
        position: "absolute",

        top: "76px",
        left: 0,

        width: "100%",
        height: "650px",

        zIndex: 1,

        pointerEvents: "none",

        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{
          position: [0.8, 0, 8],
          fov: 45,
        }}

        dpr={[1, 2]}

        style={{
          width: "100%",
          height: "100%",

          display: "block",

          pointerEvents: "none",
        }}
      >

        {/* =================================================
            LIGHTING
        ================================================= */}

        <ambientLight intensity={1.7} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={3}
        />

        <directionalLight
          position={[-4, 2, 3]}
          intensity={1.5}
        />

        <pointLight
          position={[3, 1, 5]}
          intensity={2}
          color="#fff1a8"
        />

        <pointLight
          position={[-2, -2, 3]}
          intensity={1}
          color="#ffc515"
        />


        {/* =================================================
            BACKGROUND PARTICLES
        ================================================= */}

        <Sparkles
          count={100}
          scale={[9, 5, 4]}
          size={1.5}
          speed={0.3}
          color="#d9a900"
        />


        {/* =================================================
            MAIN LARGE BUBBLE
        ================================================= */}

        <MainBubble />


        {/* =================================================
            EXISTING DIAMONDS
        ================================================= */}

        <Diamond
          position={[0.6, 2.5, -0.5]}
          size={0.25}
          speed={1.4}
        />

        <Diamond
          position={[5.6, 2.2, -0.6]}
          size={0.18}
          speed={1.7}
        />

        <Diamond
          position={[5.4, -2.1, -0.7]}
          size={0.22}
          speed={1.5}
        />

        <Diamond
          position={[1.0, -2.5, -0.8]}
          size={0.16}
          speed={1.9}
        />


        {/* =================================================
            SMALL BUBBLES
        ================================================= */}

        <SmallBubble
          position={[4.7, 1.3, -1]}
          size={0.12}
          speed={1.8}
        />

        <SmallBubble
          position={[5.2, -1.2, -1]}
          size={0.09}
          speed={2}
        />

      </Canvas>
    </div>
  );
}