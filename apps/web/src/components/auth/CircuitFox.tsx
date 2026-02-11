'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export function CircuitFox() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} position={[0, -1, 0]} scale={0.8}>
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.6, 1.5, 16, 32]} />
          <meshStandardMaterial
            color="#4c1d95"
            emissive="#3b82f6"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.2, 0.3]} castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color="#5b21b6"
            emissive="#60a5fa"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Snout */}
        <mesh position={[0, 1, 1]} castShadow>
          <coneGeometry args={[0.3, 0.6, 8]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#60a5fa"
            emissiveIntensity={0.3}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Ears (left) */}
        <mesh position={[-0.4, 2, 0.1]} rotation={[0, 0, -0.3]} castShadow>
          <coneGeometry args={[0.2, 0.8, 8]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#60a5fa"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Ears (right) */}
        <mesh position={[0.4, 2, 0.1]} rotation={[0, 0, 0.3]} castShadow>
          <coneGeometry args={[0.2, 0.8, 8]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#60a5fa"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Eyes (left) */}
        <mesh position={[-0.25, 1.3, 0.9]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Eyes (right) */}
        <mesh position={[0.25, 1.3, 0.9]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Legs - Front Left */}
        <mesh position={[-0.4, -0.8, 0.5]} castShadow>
          <cylinderGeometry args={[0.15, 0.12, 1, 8]} />
          <meshStandardMaterial
            color="#6b21a8"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Legs - Front Right */}
        <mesh position={[0.4, -0.8, 0.5]} castShadow>
          <cylinderGeometry args={[0.15, 0.12, 1, 8]} />
          <meshStandardMaterial
            color="#6b21a8"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Legs - Back Left */}
        <mesh position={[-0.4, -0.8, -0.5]} castShadow>
          <cylinderGeometry args={[0.15, 0.12, 1, 8]} />
          <meshStandardMaterial
            color="#6b21a8"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Legs - Back Right */}
        <mesh position={[0.4, -0.8, -0.5]} castShadow>
          <cylinderGeometry args={[0.15, 0.12, 1, 8]} />
          <meshStandardMaterial
            color="#6b21a8"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Tail */}
        <mesh position={[0, 0.5, -1.5]} rotation={[0.7, 0, 0]} castShadow>
          <coneGeometry args={[0.5, 1.8, 8]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#60a5fa"
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Circuit lines (glowing tubes around body) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 0.7;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
              <meshStandardMaterial
                color="#60a5fa"
                emissive="#3b82f6"
                emissiveIntensity={1.5}
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        })}

        {/* Circuit nodes (glowing spheres) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 0.75;
          const x = Math.cos(angle) * radius;
          const y = Math.random() * 0.8 - 0.4;
          const z = Math.sin(angle) * radius;

          return (
            <mesh key={`node-${i}`} position={[x, y, z]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial
                color="#60a5fa"
                emissive="#3b82f6"
                emissiveIntensity={2}
              />
            </mesh>
          );
        })}

        {/* Main glow effect */}
        <pointLight position={[0, 0.5, 0]} intensity={2} color="#60a5fa" distance={6} />
        <pointLight position={[0, 1.2, 0.3]} intensity={1.5} color="#ec4899" distance={3} />
      </group>
    </Float>
  );
}
