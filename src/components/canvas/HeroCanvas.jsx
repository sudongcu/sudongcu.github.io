import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import AnimatedSphere from './AnimatedSphere';

const HeroCanvas = ({ mousePosition }) => {
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
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0ea5e9" />
      <spotLight
        position={[0, 5, 10]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />

      {/* 3D Object */}
      <Suspense fallback={null}>
        <AnimatedSphere mousePosition={mousePosition} />
      </Suspense>

      {/* Controls - Enable rotation with mouse drag */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
};

export default HeroCanvas;
