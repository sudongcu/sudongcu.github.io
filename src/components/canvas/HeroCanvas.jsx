import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import AnimatedModel from './AnimatedObject';

const HeroCanvas = () => {
  return (
    <Canvas
      className="w-full h-full"
      dpr={[1, 2]}
      gl={{ 
        alpha: true, 
        antialias: true,
        powerPreference: 'high-performance'
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
      
      {/* Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0ea5e9" />
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />

      {/* 3D Model */}
      <Suspense fallback={null}>
        <AnimatedModel />
      </Suspense>

      {/* Controls - Enable rotation with mouse drag */}
      <OrbitControls 
        enableZoom={true} 
        enablePan={true}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
};

export default HeroCanvas;
