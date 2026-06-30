"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { cubeFaceColor, type CubeFaceId } from "@/lib/about/cubeFacePalette";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { PointerTiltRef } from "@/components/projects/ProjectCubeScene";

function faceColor(id: CubeFaceId): THREE.Color {
  return new THREE.Color(cubeFaceColor(id));
}

const DEG = Math.PI / 180;
/** Portrait front face matches the project card art (600 × 755). */
const CARD_ASPECT = 600 / 755;
const BOX_W = 1;
const BOX_H = BOX_W / CARD_ASPECT;
const BOX_D = 0.42;
/** Resting 3D pose , cards tilt when not scroll-centred. */
const BASE_YAW = -0.5;
const BASE_PITCH = 0.26;
const ROT_LERP = 0.12;
const ROT_EPS = 0.004;
/** Subtle pointer-follow tilt on scatter cubes. */
const POINTER_YAW = 0.14;
const POINTER_PITCH = 0.09;
const POINTER_TILT_LERP = 0.1;
const POINTER_TILT_EPS = 0.002;

function projectCubeDpr(): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

function configureArtTexture(map: THREE.Texture, maxAniso: number): void {
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = maxAniso;
  map.minFilter = THREE.LinearFilter;
  map.magFilter = THREE.LinearFilter;
  map.generateMipmaps = false;
  map.needsUpdate = true;
}

type EngagedRef = { current: boolean };

function DemandRenderOnChange({
  engaged,
  focused,
  looping,
  width,
  height,
}: {
  engaged: boolean;
  focused: boolean;
  looping: boolean;
  width: number;
  height: number;
}) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [height, invalidate, width]);

  useEffect(() => {
    if (looping) return;
    invalidate();
  }, [engaged, focused, invalidate, looping]);

  return null;
}

function ProjectCube({
  greySrc,
  colorSrc,
  engagedRef,
  engaged,
  focusedRef,
  focused,
  pointerTiltRef,
  pointerParallaxEnabled,
  onSettlingChange,
  onParallaxActiveChange,
}: {
  greySrc: string;
  colorSrc: string;
  engagedRef: EngagedRef;
  engaged: boolean;
  focusedRef: { current: boolean };
  focused: boolean;
  pointerTiltRef?: PointerTiltRef;
  pointerParallaxEnabled: boolean;
  onSettlingChange: (settling: boolean) => void;
  onParallaxActiveChange: (active: boolean) => void;
}) {
  const gl = useThree((state) => state.gl);
  const [greyMap, colorMap] = useTexture([greySrc, colorSrc]);
  const maxAniso = gl.capabilities.getMaxAnisotropy();
  for (const map of [greyMap, colorMap]) {
    configureArtTexture(map, maxAniso);
  }

  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [colorMap, greyMap, invalidate]);

  const groupRef = useRef<THREE.Group>(null);
  const colorPlaneRef = useRef<THREE.MeshBasicMaterial>(null);

  const sideMaterials = useMemo(
    () => [
      new THREE.MeshBasicMaterial({ color: faceColor("right") }),
      new THREE.MeshBasicMaterial({ color: faceColor("left") }),
      new THREE.MeshBasicMaterial({ color: faceColor("top") }),
      new THREE.MeshBasicMaterial({ color: faceColor("bottom") }),
      new THREE.MeshBasicMaterial({ color: faceColor("back") }),
    ],
    [],
  );

  const greyFrontMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: greyMap,
        transparent: true,
        toneMapped: false,
      }),
    [greyMap],
  );

  const materials = useMemo(
    () => [
      sideMaterials[0],
      sideMaterials[1],
      sideMaterials[2],
      sideMaterials[3],
      greyFrontMaterial,
      sideMaterials[4],
    ],
    [greyFrontMaterial, sideMaterials],
  );

  useEffect(
    () => () => {
      materials.forEach((material) => material.dispose());
    },
    [materials],
  );

  const applyColorMix = (colorAmount: number) => {
    greyFrontMaterial.opacity = 1 - colorAmount;
    if (colorPlaneRef.current) {
      colorPlaneRef.current.opacity = colorAmount;
    }
  };

  const settledRef = useRef(true);
  const parallaxActiveRef = useRef(false);
  const smoothedTiltRef = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    if (focused) {
      group.rotation.set(0, 0, 0);
    } else {
      group.rotation.set(BASE_PITCH, BASE_YAW, 0);
    }
  }, [focused]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    applyColorMix(engagedRef.current ? 1 : 0);

    const smoothed = smoothedTiltRef.current;
    if (pointerParallaxEnabled && pointerTiltRef) {
      const target = pointerTiltRef.current;
      smoothed.x += (target.x - smoothed.x) * POINTER_TILT_LERP;
      smoothed.y += (target.y - smoothed.y) * POINTER_TILT_LERP;
    } else {
      smoothed.x += (0 - smoothed.x) * POINTER_TILT_LERP;
      smoothed.y += (0 - smoothed.y) * POINTER_TILT_LERP;
    }

    const parallaxActive =
      pointerParallaxEnabled &&
      (Math.abs(smoothed.x) > POINTER_TILT_EPS ||
        Math.abs(smoothed.y) > POINTER_TILT_EPS);
    if (parallaxActive !== parallaxActiveRef.current) {
      parallaxActiveRef.current = parallaxActive;
      onParallaxActiveChange(parallaxActive);
    }

    const targetX = focusedRef.current
      ? 0
      : BASE_PITCH + smoothed.y * POINTER_PITCH;
    const targetY = focusedRef.current ? 0 : BASE_YAW + smoothed.x * POINTER_YAW;
    group.rotation.x += (targetX - group.rotation.x) * ROT_LERP;
    group.rotation.y += (targetY - group.rotation.y) * ROT_LERP;

    const isSettled =
      Math.abs(group.rotation.x - targetX) < ROT_EPS &&
      Math.abs(group.rotation.y - targetY) < ROT_EPS;
    if (isSettled !== settledRef.current) {
      settledRef.current = isSettled;
      onSettlingChange(!isSettled);
    }
  });

  useEffect(() => {
    applyColorMix(engaged ? 1 : 0);
  }, [engaged]);

  return (
    <group ref={groupRef}>
      <mesh material={materials}>
        <boxGeometry args={[BOX_W, BOX_H, BOX_D]} />
      </mesh>
      <mesh position={[0, 0, BOX_D / 2 + 0.003]}>
        <planeGeometry args={[BOX_W, BOX_H]} />
        <meshBasicMaterial
          ref={colorPlaneRef}
          map={colorMap}
          toneMapped={false}
          transparent
          alphaTest={0.02}
          depthWrite={false}
          opacity={0}
        />
      </mesh>
    </group>
  );
}

function cameraDistance(
  camera: THREE.PerspectiveCamera,
  size: { width: number; height: number },
  yaw: number,
  pitch: number,
  margin: number,
): number {
  const aspect = size.width / Math.max(size.height, 1);
  const vFov = camera.fov * DEG;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
  const silhouetteW =
    BOX_W * Math.cos(Math.abs(yaw)) + BOX_D * Math.sin(Math.abs(yaw));
  const silhouetteH =
    BOX_H * Math.cos(Math.abs(pitch)) + BOX_D * Math.sin(Math.abs(pitch));
  const halfH = (silhouetteH / 2) * margin;
  const halfW = (silhouetteW / 2) * margin;
  const distV = halfH / Math.tan(vFov / 2);
  const distH = halfW / Math.tan(hFov / 2);
  return Math.max(distV, distH) + BOX_D / 2;
}

function CameraFraming({ focused }: { focused: boolean }) {
  const { camera, size } = useThree();
  const tiltDistanceRef = useRef(1);
  const frontDistanceRef = useRef(1);
  const focusBlendRef = useRef(focused ? 1 : 0);

  useEffect(() => {
    if (!focused) focusBlendRef.current = 0;
  }, [focused]);

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    tiltDistanceRef.current = cameraDistance(
      camera,
      size,
      BASE_YAW,
      BASE_PITCH,
      1.08,
    );
    frontDistanceRef.current = cameraDistance(camera, size, 0, 0, 1.02);
    camera.near = 0.05;
    camera.far =
      Math.max(tiltDistanceRef.current, frontDistanceRef.current) + 10;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    focusBlendRef.current +=
      ((focused ? 1 : 0) - focusBlendRef.current) * 0.14;
    const blend = focusBlendRef.current;
    const distance =
      tiltDistanceRef.current * (1 - blend) + frontDistanceRef.current * blend;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

type ProjectCubeCanvasProps = {
  greySrc: string;
  colorSrc: string;
  width: number;
  height: number;
  hovered: boolean;
  focused: boolean;
  pointerTiltRef?: PointerTiltRef;
  pointerParallax?: boolean;
  pointerEngaged?: boolean;
};

export default function ProjectCubeCanvas({
  greySrc,
  colorSrc,
  width,
  height,
  hovered,
  focused,
  pointerTiltRef,
  pointerParallax = false,
  pointerEngaged = false,
}: ProjectCubeCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();
  const engaged = hovered || focused;
  const engagedRef = useRef(engaged);
  engagedRef.current = engaged;
  const focusedRef = useRef(focused);
  focusedRef.current = focused;
  const [rotating, setRotating] = useState(false);
  const [parallaxActive, setParallaxActive] = useState(false);
  const handleSettlingChange = useCallback((settling: boolean) => {
    setRotating(settling);
  }, []);
  const handleParallaxActiveChange = useCallback((active: boolean) => {
    setParallaxActive(active);
  }, []);
  const pointerParallaxEnabled = pointerParallax && !reducedMotion && !focused;
  const shouldLoop =
    !reducedMotion &&
    (hovered ||
      focused ||
      rotating ||
      parallaxActive ||
      (pointerParallaxEnabled && pointerEngaged));
  const [dpr, setDpr] = useState(1);

  useLayoutEffect(() => {
    setDpr(projectCubeDpr());
  }, []);

  return (
    <Canvas
      className="project-cube-canvas"
      style={{ width, height }}
      dpr={dpr}
      flat
      frameloop={shouldLoop ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.05, far: 30 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <CameraFraming focused={focused} />
      <DemandRenderOnChange
        engaged={engaged}
        focused={focused}
        looping={shouldLoop}
        width={width}
        height={height}
      />
      <ambientLight intensity={1.15} />
      <Suspense fallback={null}>
        <ProjectCube
          greySrc={greySrc}
          colorSrc={colorSrc}
          engagedRef={engagedRef}
          engaged={engaged}
          focusedRef={focusedRef}
          focused={focused}
          pointerTiltRef={pointerTiltRef}
          pointerParallaxEnabled={pointerParallaxEnabled}
          onSettlingChange={handleSettlingChange}
          onParallaxActiveChange={handleParallaxActiveChange}
        />
      </Suspense>
    </Canvas>
  );
}
