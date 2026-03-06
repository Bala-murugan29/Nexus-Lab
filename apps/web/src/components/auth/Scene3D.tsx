'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';

function AnimatedSphere({ position, color, scale = 2 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0}
          metalness={0.8}
        />
      </Sphere> 
    </Float>
  );
}

function ParticleField() {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 15;
        const size = Math.random() * 0.1 + 0.05;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              emissive="#3b82f6" 
              emissiveIntensity={1.0}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.5} color="#8b5cf6" />
        
        {/* Main 3D Spheres */}
        <AnimatedSphere position={[-4, 2, -2]} color="#3b82f6" scale={2.5} />
        <AnimatedSphere position={[4, -2, -3]} color="#8b5cf6" scale={2} />
        <AnimatedSphere position={[0, 0, -5]} color="#06b6d4" scale={1.8} />
        
        {/* Particle Field */}
        <ParticleField />
        
        {/* Camera Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
