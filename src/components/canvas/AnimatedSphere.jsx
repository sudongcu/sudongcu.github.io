import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = ({ mousePosition }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    // Continuous slow rotation
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.001;
    }

    // Animate distortion
    if (materialRef.current) {
      materialRef.current.distort = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        ref={materialRef}
        color="#0ea5e9"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

export default AnimatedSphere;
