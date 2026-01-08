import { useGLTF } from '@react-three/drei';

const AnimatedModel = () => {
  const gltf = useGLTF('/models/laptop.glb');

  if (!gltf || !gltf.scene) {
    console.warn('Model not loaded yet');
    return null;
  }

  return (
    <primitive 
      object={gltf.scene} 
      scale={0.05} 
      position={[0, -0.3, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
};

// Preload the model
useGLTF.preload('/models/laptop.glb');

export default AnimatedModel;
