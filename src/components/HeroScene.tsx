import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { mockTracks } from '@/data/mockData';

function CoverMesh({ position, url, index }: { position: [number, number, number], url: string, index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(url);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle mouse interaction
      const mouseX = (state.pointer.x * Math.PI) / 10;
      const mouseY = (state.pointer.y * Math.PI) / 10;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX, 0.1);
    }
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={1} // Up/down float intensity
      floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within
    >
      <mesh ref={meshRef} position={position} castShadow>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshStandardMaterial map={texture} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  const positions: [number, number, number][] = [
    [-3, 0.5, -2],
    [0, 0, 0],
    [3, -0.5, -1],
    [-1.5, -2, -3],
    [2, 2, -4],
  ];

  return (
    <div className="w-full h-[60vh] absolute top-0 left-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
        <pointLight position={[10, -10, -10]} intensity={1} color="#3b82f6" />
        
        {positions.map((pos, i) => (
          <CoverMesh key={i} position={pos} url={mockTracks[i].coverUrl} index={i} />
        ))}
        
        <Environment preset="city" />
        <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Canvas>
    </div>
  );
}
