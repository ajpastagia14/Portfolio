'use client';
import './index.css';
import * as THREE from 'three';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

const GLTF_PATH = '/assets/kartu.glb';
const TEXTURE_PATH = '/assets/bandd.png';
const PHOTO_PATH = '/assets/akshar-card-photo.jpg';
const PHOTO_ASPECT = 941 / 1135; // width / height of the source photo

useGLTF.preload(GLTF_PATH);
useTexture.preload(TEXTURE_PATH);
useTexture.preload(PHOTO_PATH);

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div
      className="responsive-wrapper"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <Canvas
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 13], fov: 25 }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          pointerEvents: isMobile ? 'none' : 'auto', // ✅ fix drag desktop
        }}
      >
        <ambientLight intensity={Math.PI} />

        <Scene isMobile={isMobile} />

        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Scene({ isMobile }) {
  return (
    <Physics
      key={isMobile ? 'mobile' : 'desktop'}
      interpolate
      gravity={[0, -40, 0]}
      timeStep={1 / 60}
    >
      {/* hanya desktop */}
      {!isMobile && <Band isMobile={isMobile} />}
    </Physics>
  );
}

// Builds a rounded-rectangle plane (instead of a plain sharp-cornered
// PlaneGeometry) so the photo overlay's corners match the card's own
// rounded corners. three.js's ShapeGeometry doesn't normalize UVs to 0–1
// on its own, so they're remapped manually to line up with the texture.
function createRoundedPhotoGeometry(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(x, y + r);
  shape.lineTo(x, y + height - r);
  shape.quadraticCurveTo(x, y + height, x + r, y + height);
  shape.lineTo(x + width - r, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - r);
  shape.lineTo(x + width, y + r);
  shape.quadraticCurveTo(x + width, y, x + width - r, y);
  shape.lineTo(x + r, y);
  shape.quadraticCurveTo(x, y, x, y + r);

  const geometry = new THREE.ShapeGeometry(shape, 12);

  const pos = geometry.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - x) / width;
    uv[i * 2 + 1] = (pos.getY(i) - y) / height;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));

  return geometry;
}

function Band({ isMobile, maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(GLTF_PATH);
  const texture = useTexture(TEXTURE_PATH);
  const photoTexture = useTexture(PHOTO_PATH);
  const { width, height } = useThree((state) => state.size);

  // Position/size the photo plane using the card mesh's own bounding box,
  // inset a bit so the card's own white border/frame stays visible around
  // it (like a real ID badge), then crop the texture itself (object-fit:
  // cover style) so the photo isn't stretched.
  const cardPhoto = useMemo(() => {
    const geo = nodes.card.geometry;
    geo.computeBoundingBox();
    const box = geo.boundingBox;

    const boxWidth = box.max.x - box.min.x;
    const boxHeight = box.max.y - box.min.y;
    const inset = 0.86;
    const width = boxWidth * inset;
    const height = boxHeight * inset;
    const cornerRadius = Math.min(width, height) * 0.14;

    return {
      geometry: createRoundedPhotoGeometry(width, height, cornerRadius),
      width,
      height,
      planeAspect: boxWidth / boxHeight,
      x: (box.max.x + box.min.x) / 2,
      y: (box.max.y + box.min.y) / 2,
      z: box.max.z + 0.012,
    };
  }, [nodes]);

  useEffect(() => {
    photoTexture.colorSpace = THREE.SRGBColorSpace;
    photoTexture.wrapS = THREE.ClampToEdgeWrapping;
    photoTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Crop (rather than stretch) the photo to fill the card face, the same
    // way CSS `object-fit: cover` would — anchored toward the top so the
    // face isn't the part that gets cropped off.
    if (PHOTO_ASPECT > cardPhoto.planeAspect) {
      const scale = cardPhoto.planeAspect / PHOTO_ASPECT;
      photoTexture.repeat.set(scale, 1);
      photoTexture.offset.set((1 - scale) / 2, 0);
    } else {
      const scale = PHOTO_ASPECT / cardPhoto.planeAspect;
      photoTexture.repeat.set(1, scale);
      photoTexture.offset.set(0, 1 - scale);
    }

    photoTexture.needsUpdate = true;
  }, [photoTexture, cardPhoto.planeAspect]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const canDrag = !isMobile;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered && canDrag) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged, canDrag]);

  useFrame((state, delta) => {
    if (dragged && card.current && canDrag) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      const newX = vec.x - dragged.x;
      let newY = vec.y - dragged.y;
      const newZ = vec.z - dragged.z;

      const screenY = state.pointer.y;
      const limit = isMobile ? -0.1 : -0.2;

      if (screenY < limit) newY = card.current.translation().y;

      card.current.setNextKinematicTranslation({ x: newX, y: newY, z: newZ });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }

        const d = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );

        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + d * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(32));
      }

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());

      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z,
      });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[3, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => canDrag && hover(true)}
            onPointerOut={() => canDrag && hover(false)}
            onPointerUp={(e) => {
              if (!canDrag) return;
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              if (!canDrag) return;
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial {...materials.base} />
            </mesh>
            <mesh
              geometry={cardPhoto.geometry}
              position={[cardPhoto.x, cardPhoto.y, cardPhoto.z]}
            >
              {/* Same physical material as the card itself (clearcoat/
                  roughness/env reflections included) so the glossy white
                  highlight that sweeps the card while it swings still
                  shows up on the photo instead of being flattened out. */}
              <meshPhysicalMaterial {...materials.base} map={photoTexture} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          transparent
          opacity={0.9}
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}