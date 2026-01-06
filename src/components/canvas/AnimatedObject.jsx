import { useGLTF } from '@react-three/drei';

const AnimatedModel = () => {
  let model;
  try {
    const gltf = useGLTF('/models/laptop.glb');
    model = gltf.scene;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }

  return (
    <>
      {model && (
        <primitive 
          object={model} 
          scale={0.05} 
          position={[0, -0.3, 0]}
          rotation={[0, Math.PI / 4, 0]}
        />
      )}
    </>
  );
};

// Preload the model
try {
  useGLTF.preload('/models/laptop.glb');
} catch (error) {
  console.error('Error preloading model:', error);
}

export default AnimatedModel;
