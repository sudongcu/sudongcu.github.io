import { useGLTF } from '@react-three/drei';

const AnimatedModel = () => {
  const gltf = useGLTF('/models/logo.glb');

  if (!gltf || !gltf.scene) {
    console.warn('Model not loaded yet');
    return null;
  }

  return (
    <primitive 
      object={gltf.scene} 
      scale={0.1} 
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, 0, 0.5]}
    />
  );
};

// Preload the model
useGLTF.preload('/models/logo.glb');

export default AnimatedModel;
