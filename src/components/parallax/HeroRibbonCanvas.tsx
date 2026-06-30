"use client";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { createRibbonGeometry } from "@/lib/ribbons/createRibbonGeometry";
import { createPanterRibbonTexture } from "@/lib/ribbons/createPanterTexture";
import {
  createPanterLoopCurve,
  PANTER_LOOP_SEGMENTS,
  PANTER_LOOP_WIDTH,
} from "@/lib/ribbons/panterLoop";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { RibbonProgressRef } from "@/components/parallax/HeroRibbonScene";

function CanvasResize({ width, height }: { width: number; height: number }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  useLayoutEffect(() => {
    if (width < 1 || height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    gl.setPixelRatio(dpr);
    gl.setSize(width, height, true);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }, [camera, gl, height, width]);

  useFrame(() => {
    if (width < 1 || height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.floor(width * dpr);
    const targetH = Math.floor(height * dpr);
    if (gl.domElement.width === targetW && gl.domElement.height === targetH) return;
    gl.setPixelRatio(dpr);
    gl.setSize(width, height, true);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

function PanterLoopRibbon({
  text,
  mobile,
  progressRef,
  reducedMotion,
}: {
  text: string;
  mobile: boolean;
  progressRef: RibbonProgressRef;
  reducedMotion: boolean;
}) {
  const curve = useMemo(() => createPanterLoopCurve(mobile), [mobile]);
  const geometry = useMemo(
    () =>
      createRibbonGeometry(
        curve,
        mobile ? PANTER_LOOP_SEGMENTS.mobile : PANTER_LOOP_SEGMENTS.desktop,
        mobile ? PANTER_LOOP_WIDTH.mobile : PANTER_LOOP_WIDTH.desktop,
      ),
    [curve, mobile],
  );

  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let tex: THREE.CanvasTexture | null = null;

    const build = () => {
      tex = createPanterRibbonTexture(text);
      if (!cancelled) setTexture(tex);
    };

    if (document.fonts?.ready) {
      void document.fonts.ready.then(build);
    } else {
      build();
    }

    return () => {
      cancelled = true;
      tex?.dispose();
    };
  }, [text]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.88,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useEffect(() => {
    if (texture) material.map = texture;
    material.needsUpdate = true;
  }, [material, texture]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    if (!texture) return;

    const kinetic = reducedMotion ? 1 : progressRef.current;
    if (!reducedMotion && kinetic > 0.03) {
      timeRef.current += delta;
    }

    texture.offset.x = -(kinetic * 0.75 + timeRef.current * 0.11);
  });

  if (!texture) return null;

  return <mesh geometry={geometry} material={material} renderOrder={2} />;
}

function PanterRig({
  text,
  mobile,
  progressRef,
  reducedMotion,
}: {
  text: string;
  mobile: boolean;
  progressRef: RibbonProgressRef;
  reducedMotion: boolean;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const smoothRef = useRef(0);

  useFrame(() => {
    const root = rootRef.current;
    if (!root) return;

    const target = reducedMotion ? 1 : progressRef.current;
    smoothRef.current += (target - smoothRef.current) * 0.11;
    const k = smoothRef.current;

    root.position.y = THREE.MathUtils.lerp(-0.38, 0.02, k);
    root.position.x = THREE.MathUtils.lerp(-0.1, 0.08, k);
    root.rotation.x = THREE.MathUtils.lerp(0.28, 0.12, k);
    root.rotation.y = THREE.MathUtils.lerp(-0.38, -0.22, k);
    root.rotation.z = THREE.MathUtils.lerp(-0.06, 0.02, k);
    const scale = THREE.MathUtils.lerp(mobile ? 0.86 : 0.9, mobile ? 1.02 : 1.08, k);
    root.scale.setScalar(scale);
  });

  return (
    <group ref={rootRef}>
      <PanterLoopRibbon
        text={text}
        mobile={mobile}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

function PanterCamera({ progressRef }: { progressRef: RibbonProgressRef }) {
  const { camera } = useThree();
  const smoothRef = useRef(0);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const target = progressRef.current;
    smoothRef.current += (target - smoothRef.current) * 0.1;
    const k = smoothRef.current;

    camera.position.set(
      THREE.MathUtils.lerp(0.38, 0.22, k),
      THREE.MathUtils.lerp(-0.35, -0.28, k),
      THREE.MathUtils.lerp(5.8, 4.8, k),
    );
    camera.fov = THREE.MathUtils.lerp(36, 42, k);
    camera.lookAt(0.08, THREE.MathUtils.lerp(-0.18, -0.05, k), 0);
    camera.updateProjectionMatrix();
  });

  return null;
}

type HeroRibbonCanvasProps = {
  text: string;
  mobile: boolean;
  progressRef: RibbonProgressRef;
  width: number;
  height: number;
};

export default function HeroRibbonCanvas({
  text,
  mobile,
  progressRef,
  width,
  height,
}: HeroRibbonCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      key={`${width}x${height}`}
      className="hero-ribbon-canvas"
      style={{ width: `${width}px`, height: `${height}px`, display: "block" }}
      dpr={[1, 2]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.1, far: 50, position: [0.35, -1.15, 7.4] }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        gl.setPixelRatio(dpr);
        gl.setSize(width, height, true);
      }}
    >
      <CanvasResize width={width} height={height} />
      <PanterCamera progressRef={progressRef} />
      <ambientLight intensity={1.45} />
      <directionalLight position={[4, 6, 7]} intensity={1.05} />
      <directionalLight position={[-5, 2, 4]} intensity={0.38} />
      <Suspense fallback={null}>
        <PanterRig
          text={text}
          mobile={mobile}
          progressRef={progressRef}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
