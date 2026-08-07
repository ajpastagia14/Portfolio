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

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

/**
 * @param {{ onDragChange?: (dragging: boolean) => void }} [props]
 */
export default function App({ onDragChange } = {}) {
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

        <Scene isMobile={isMobile} onDragChange={onDragChange} />

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

// When the drag-triggered container grows taller (see Hero.tsx), the
// <Canvas> itself resizes taller while staying the same width. With a
// fixed vertical FOV, R3F maps the *same* angular slice of the scene into
// *more* pixels, so everything on screen visually "zooms in". This rig
// keeps the horizontal FOV constant (locked to whatever it was right
// before the drag started) and grows the vertical FOV to match, so a
// taller canvas reveals more of the scene below instead of magnifying it.
// At rest (no height change), this is a mathematical no-op — identical to
// the plain fov=25 camera.
function CameraRig({ dragged, baseFov = 25 }) {
  const { camera, size } = useThree();
  const restAspect = useRef(size.width / Math.max(size.height, 1));

  useEffect(() => {
    if (!dragged) {
      restAspect.current = size.width / Math.max(size.height, 1);
    }
  }, [dragged, size]);

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const baseFovRad = (baseFov * Math.PI) / 180;
    const horizontalFovRad =
      2 * Math.atan(Math.tan(baseFovRad / 2) * restAspect.current);
    const verticalFovRad =
      2 * Math.atan(Math.tan(horizontalFovRad / 2) / aspect);

    camera.fov = (verticalFovRad * 180) / Math.PI;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }, [camera, size, baseFov]);

  return null;
}

function Scene({ isMobile, onDragChange }) {
  const [dragging, setDragging] = useState(false);

  return (
    <Physics
      key={isMobile ? 'mobile' : 'desktop'}
      interpolate
      gravity={[0, -40, 0]}
      timeStep={1 / 60}
    >
      <CameraRig dragged={dragging} />
      {/* hanya desktop */}
      {!isMobile && (
        <Band
          isMobile={isMobile}
          onDragChange={(v) => {
            setDragging(v);
            onDragChange?.(v);
          }}
        />
      )}
    </Physics>
  );
}

function Band({ isMobile, onDragChange, maxSpeed = 50, minSpeed = 10 }) {
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

  // Aspect ratio of the card's own face, so the photo can be cropped
  // (object-fit: cover style) instead of stretched. The photo is applied
  // directly as the card mesh's own texture map — no separate overlay
  // mesh — so it automatically inherits the card's real rounded-corner
  // shape and normals, with no z-fighting or doubled-up reflections.
  //
  // The model's own UVs on this mesh are unusable for this (the original
  // material never had an image texture, so the UVs were just whatever
  // the 3D tool auto-generated — not a clean front-facing rectangle; V
  // only spans 0–0.76, and it's rotated relative to the card's actual
  // faces). So the geometry is cloned and given fresh UVs computed
  // directly from each vertex's x/y position instead.
  const { cardGeometry, cardAspect } = useMemo(() => {
    const geo = nodes.card.geometry.clone();
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    const w = box.max.x - box.min.x;
    const h = box.max.y - box.min.y;

    const pos = geo.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = (pos.getX(i) - box.min.x) / w;
      uv[i * 2 + 1] = (pos.getY(i) - box.min.y) / h;
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));

    return { cardGeometry: geo, cardAspect: w / h };
  }, [nodes]);

  // Bake a white border + rounded-corner photo into a single 2D canvas,
  // then use that as the card's texture map. Doing it this way (one
  // flat image) instead of a 3D inset/overlay avoids z-fighting entirely
  // while still keeping the card's white frame and giving the photo its
  // own rounded corners inside it.
  const cardTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const img = photoTexture.image;
    if (!img) return null;

    const W = 1024;
    const H = Math.max(1, Math.round(W / cardAspect));
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // White border matching the card's own base color.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    const margin = Math.min(W, H) * 0.07;
    const rx = margin;
    const ry = margin;
    const rw = W - margin * 2;
    const rh = H - margin * 2;
    const radius = Math.min(rw, rh) * 0.12;

    ctx.save();
    roundRectPath(ctx, rx, ry, rw, rh, radius);
    ctx.clip();

    // Crop (rather than stretch) the photo to cover that rounded region —
    // anchored toward the top so a face crop doesn't cut off the head.
    const imgAspect = img.width / img.height;
    const rectAspect = rw / rh;
    let sx, sy, sw, sh;
    if (imgAspect > rectAspect) {
      sh = img.height;
      sw = sh * rectAspect;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / rectAspect;
      sx = 0;
      sy = 0;
    }
    ctx.drawImage(img, sx, sy, sw, sh, rx, ry, rw, rh);
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [photoTexture, cardAspect]);

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

  // Let the parent know when an active drag starts/stops, so the HTML
  // container around this canvas can temporarily grow past the Hero
  // section's edge (and only then) — the card can be pulled further down
  // without needing a permanently oversized interactive area that would
  // risk blocking clicks elsewhere on the page.
  useEffect(() => {
    onDragChange?.(!!dragged);
  }, [dragged, onDragChange]);

  // Slightly longer rope segments than the original template, so the
  // lanyard has more elastic give/stretch when pulled instead of going
  // taut almost immediately. Kept modest so the card's resting/idle
  // position doesn't shift noticeably from before.
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.15]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.15]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.15]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.6, 0]]);

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

      // How far down the card can be dragged before it's clamped, in
      // normalized pointer-Y (-1 bottom, 1 top). Raised from the
      // original -0.1/-0.2 so the card can be pulled much further down
      // the Hero section instead of stopping around its vertical center.
      const screenY = state.pointer.y;
      const limit = isMobile ? -0.6 : -0.92;

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
            <mesh geometry={cardGeometry}>
              {/* The photo IS the card's own texture map now — same
                  surface, same normals, same rounded silhouette as the
                  model itself (cardGeometry is a clone with corrected
                  UVs — see note above). No separate overlay, so no
                  z-fighting and no doubled-up reflections. cardTexture is
                  the photo pre-composited with a white border + rounded
                  corners. */}
              <meshPhysicalMaterial
                {...materials.base}
                map={cardTexture ?? undefined}
              />
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