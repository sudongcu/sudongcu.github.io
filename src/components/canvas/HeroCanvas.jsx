import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, Sparkles } from '@react-three/drei';
import GlacierLogo from './AnimatedObject';

/** Eases the logo toward the cursor position (normalized -1..1). */
const Rig = ({ pointerRef, children }) => {
  const group = useRef(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = pointerRef?.current ?? { x: 0, y: 0 };
    const k = 1 - Math.pow(0.002, delta); // frame-rate independent easing
    g.rotation.y += (p.x * 0.38 - g.rotation.y) * k;
    g.rotation.x += (-p.y * 0.26 - g.rotation.x) * k;
    g.position.x += (p.x * 0.35 - g.position.x) * k;
    g.position.y += (p.y * 0.22 - g.position.y) * k;
  });

  return <group ref={group}>{children}</group>;
};

const HeroCanvas = ({ pointerRef }) => (
  <Canvas
    dpr={[1, 1.5]}
    camera={{ position: [0, 0, 9], fov: 45 }}
    gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    style={{ pointerEvents: 'none' }}
  >
    <ambientLight intensity={0.6} />
    <directionalLight position={[6, 8, 6]} intensity={1.4} color="#dff6ff" />
    <pointLight position={[-6, -4, 4]} intensity={24} distance={22} color="#4cc9f0" />
    <pointLight position={[5, -5, -4]} intensity={16} distance={22} color="#8b9cff" />

    <Suspense fallback={null}>
      <Rig pointerRef={pointerRef}>
        <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9} floatingRange={[-0.25, 0.25]}>
          <GlacierLogo />
        </Float>
      </Rig>

      {/* Drifting ice crystals */}
      <Sparkles count={110} scale={[16, 9, 6]} size={2.2} speed={0.25} opacity={0.55} color="#c9ecff" />

      {/* Procedural cool-toned environment for reflections (no network fetch) */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#dff6ff" position={[0, 5, -5]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#7fe6ff" position={[-6, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#8b9cff" position={[6, -2, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 0, 6]} scale={3} />
      </Environment>
    </Suspense>
  </Canvas>
);

export default HeroCanvas;
