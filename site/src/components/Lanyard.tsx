'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import type { RapierRigidBody } from '@react-three/rapier';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import type { CurveType } from 'three';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

const cardGLB = '/card.glb';
const lanyard = '/lanyard.png';

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

interface Vec3Like { x: number; y: number; z: number }

function toVec3(v: Vec3Like): THREE.Vector3 {
  return new THREE.Vector3(v.x, v.y, v.z);
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, frontImage = null, backImage = null, imageFit = 'cover', lanyardImage = null, lanyardWidth = 1 }: BandProps) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic' as const, canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 };
  const { nodes: rawNodes, materials } = useGLTF(cardGLB);
  const typedNodes = rawNodes as unknown as { card: THREE.Mesh; clip: THREE.Mesh; clamp: THREE.Mesh };
  const typedMaterials = materials as unknown as { base: THREE.MeshStandardMaterial; metal: THREE.MeshStandardMaterial };
  const texture = useTexture(lanyardImage || lanyard) as THREE.Texture;
  const frontTex = useTexture(frontImage || BLANK_PIXEL) as THREE.Texture;
  const backTex = useTexture(backImage || BLANK_PIXEL) as THREE.Texture;

  /** Track lerped positions for joint interpolation without mutating refs. */
  const lerped = useRef(new Map<string, THREE.Vector3>());

  const cardMap = useMemo(() => {
    const baseMap = typedMaterials.base.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image as unknown as { width: number; height: number };
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    ctx.drawImage(baseMap.image as unknown as CanvasImageSource, 0, 0, W, H);

    const drawFitted = (src: CanvasImageSource, rect: { x: number; y: number; w: number; h: number }) => {
      const rx = rect.x * W, ry = rect.y * H, rw = rect.w * W, rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const sw = (src as unknown as { width: number }).width;
      const sh = (src as unknown as { height: number }).height;
      const scale = pick(rw / sw, rh / sh);
      const dw = sw * scale, dh = sh * scale;
      const dx = rx + (rw - dw) / 2, dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(src, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image as CanvasImageSource, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image as CanvasImageSource, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, typedMaterials.base.map]);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = 'chordal' as CurveType;
    return c;
  });
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed as unknown as RefObject<RapierRigidBody>, j1 as unknown as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as unknown as RefObject<RapierRigidBody>, j2 as unknown as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2 as unknown as RefObject<RapierRigidBody>, j3 as unknown as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3 as unknown as RefObject<RapierRigidBody>, card as unknown as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      const getLerped = (key: string, ref: { current: RapierRigidBody | null }) => {
        const m = lerped.current;
        const t = ref.current!.translation();
        if (!m.has(key)) m.set(key, toVec3(t));
        return m.get(key)!;
      };
      [j1, j2].forEach(ref => {
        const l = getLerped(ref === j1 ? 'j1' : 'j2', ref);
        const t = ref.current!.translation();
        const clampedDistance = Math.max(0.1, Math.min(1, l.distanceToSquared(toVec3(t))));
        l.lerp(toVec3(t), delta * (minSpeed + Math.sqrt(clampedDistance) * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(toVec3(j3.current!.translation()));
      curve.points[1].copy(getLerped('j2', j2));
      curve.points[2].copy(getLerped('j1', j1));
      curve.points[3].copy(toVec3(fixed.current.translation()));
      (band.current!.geometry as unknown as { setPoints: (pts: THREE.Vector3[]) => void }).setPoints(curve.getPoints(isMobile ? 16 : 32));
      const av = card.current!.angvel();
      ang.set(av.x, av.y, av.z);
      const r = card.current!.rotation();
      card.current!.setAngvel({ x: ang.x, y: ang.y - r.y * 0.25, z: ang.z }, true);
    }
  });

  // curve.curveType set in useState initializer above — moved to allocation site

  // eslint-disable-next-line react-hooks/immutability -- useTexture v10 lacks wrap config; load-time setup, never re-runs
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(toVec3(card.current!.translation())));
            }}
          >
            <mesh geometry={typedNodes.card.geometry}>
              <meshPhysicalMaterial map={cardMap} map-anisotropy={16} clearcoat={isMobile ? 0 : 1} clearcoatRoughness={0.15} roughness={0.9} metalness={0.8} />
            </mesh>
            <mesh geometry={typedNodes.clip.geometry} material={typedMaterials.metal} material-roughness={0.3} />
            <mesh geometry={typedNodes.clamp.geometry} material={typedMaterials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-expect-error — meshline v2.0 types incomplete; runtime compatible */}
        <meshLineGeometry />
        {/* @ts-expect-error — meshline v2.0 types incomplete; runtime compatible */}
        <meshLineMaterial color="white" depthTest={false} resolution={isMobile ? [1000, 2000] : [1000, 1000]} useMap map={texture} repeat={[-4, 1]} lineWidth={lanyardWidth} />
      </mesh>
    </>
  );
}
