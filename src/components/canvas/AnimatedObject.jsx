import { useEffect, useMemo } from 'react';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const MODEL_URL = '/models/logo.glb';
const RAW_WIDTH = 63; // model bounds are roughly ±31.5 on X
const ICE = new THREE.Color('#e4f2ff');

/**
 * What the ice refracts. A bright vertical gradient (ice white → frost →
 * aurora) makes the logo glow from within; a dark background would just
 * read as smoked glass.
 */
const makeIceBackdrop = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, '#f4faff');
  gradient.addColorStop(0.45, '#9fe9ff');
  gradient.addColorStop(0.75, '#7fd0ff');
  gradient.addColorStop(1, '#8b9cff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 4, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

/**
 * Merge every piece of the logo into one geometry, carrying each piece's
 * (ice-lifted) tint as a vertex color. One mesh + one transmission material
 * means one refraction pass per frame instead of one per piece — and the
 * pieces no longer occlude each other as black silhouettes inside the buffer.
 */
const buildGeometry = (scene) => {
  const parts = [];
  scene.traverse((child) => {
    if (!child.isMesh) return;
    let g = child.geometry.clone();
    if (g.index) g = g.toNonIndexed();
    Object.keys(g.attributes).forEach((name) => {
      if (name !== 'position') g.deleteAttribute(name);
    });
    // Rebuild normals from winding: the exported normals are unreliable on
    // some faces, which reads as black (Fresnel ≈ 1) on a transmissive material.
    g.computeVertexNormals();

    const tint = (child.material?.color ?? new THREE.Color('#7fe6ff')).clone().lerp(ICE, 0.35);
    const count = g.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      colors[i * 3] = tint.r;
      colors[i * 3 + 1] = tint.g;
      colors[i * 3 + 2] = tint.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    parts.push(g);
  });

  const merged = mergeGeometries(parts, false);
  parts.forEach((g) => g.dispose());
  merged.computeBoundingSphere();
  return merged;
};

const GlacierLogo = () => {
  const { scene } = useGLTF(MODEL_URL);
  const { viewport } = useThree();
  const geometry = useMemo(() => buildGeometry(scene), [scene]);
  const backdrop = useMemo(() => makeIceBackdrop(), []);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => backdrop.dispose(), [backdrop]);

  const isNarrow = viewport.width < 8;
  const targetWidth = isNarrow ? viewport.width * 0.66 : viewport.height * 0.76;
  const scale = targetWidth / RAW_WIDTH;
  const x = isNarrow ? 0 : viewport.width * 0.04;
  const y = isNarrow ? viewport.height * 0.26 : 0.1;

  return (
    <group scale={scale} position={[x, y, 0]} rotation={[0.1, -0.28, 0]}>
      {/* The model's face points +Y; stand it up so it faces the camera. */}
      <mesh geometry={geometry} rotation={[Math.PI / 2, 0, 0]}>
        <MeshTransmissionMaterial
          vertexColors
          color="#ffffff"
          background={backdrop}
          samples={4}
          resolution={384}
          transmission={1}
          roughness={0.3}
          thickness={1.2}
          ior={1.33}
          chromaticAberration={0.06}
          anisotropy={0.25}
          distortion={0.2}
          distortionScale={0.35}
          temporalDistortion={0.06}
          clearcoat={1}
          clearcoatRoughness={0.1}
          attenuationDistance={3}
          attenuationColor="#9fdcff"
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
};

useGLTF.preload(MODEL_URL);

export default GlacierLogo;
