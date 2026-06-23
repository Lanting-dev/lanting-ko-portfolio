"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  CUBE_FACE_PALETTE,
  CUBE_FACE_STITCH_SEED,
  type CubeFaceId,
} from "@/lib/about/cubeFacePalette";
import { StitchCanvasTexture } from "@/lib/about/stitchThreeTexture";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const DEG = Math.PI / 180;
/** Portrait front face matches the project card art (600 × 755). */
const CARD_ASPECT = 600 / 755;
const BOX_W = 1;
const BOX_H = BOX_W / CARD_ASPECT;
const BOX_D = 0.42;
/** Resting 3D pose — cards tilt when not scroll-centred. */
const BASE_YAW = -0.5;
const BASE_PITCH = 0.26;
const ROT_LERP = 0.12;
const ROT_EPS = 0.004;

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
  seed,
  engagedRef,
  engaged,
  focusedRef,
  focused,
  onSettlingChange,
}: {
  greySrc: string;
  colorSrc: string;
  seed: number;
  engagedRef: EngagedRef;
  engaged: boolean;
  focusedRef: { current: boolean };
  focused: boolean;
  onSettlingChange: (settling: boolean) => void;
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
  const colorBackplateRef = useRef<THREE.MeshBasicMaterial>(null);
  const colorPlaneRef = useRef<THREE.MeshBasicMaterial>(null);

  const stitch = useMemo(() => {
    const make = (id: CubeFaceId) =>
      new StitchCanvasTexture(
        CUBE_FACE_PALETTE[id],
        CUBE_FACE_STITCH_SEED[id] + seed,
      );
    return {
      right: make("right"),
      left: make("left"),
      top: make("top"),
      bottom: make("bottom"),
      back: make("back"),
    };
  }, [seed]);

  useEffect(
    () => () => {
      stitch.right.dispose();
      stitch.left.dispose();
      stitch.top.dispose();
      stitch.bottom.dispose();
      stitch.back.dispose();
    },
    [stitch],
  );

  const sideMaterials = useMemo(
    () => [
      new THREE.MeshBasicMaterial({ map: stitch.right.texture }),
      new THREE.MeshBasicMaterial({ map: stitch.left.texture }),
      new THREE.MeshBasicMaterial({ map: stitch.top.texture }),
      new THREE.MeshBasicMaterial({ map: stitch.bottom.texture }),
      new THREE.MeshBasicMaterial({ map: stitch.back.texture }),
    ],
    [stitch],
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
    if (colorBackplateRef.current) {
      colorBackplateRef.current.opacity = colorAmount;
    }
    if (colorPlaneRef.current) {
      colorPlaneRef.current.opacity = colorAmount;
    }
  };

  const settledRef = useRef(true);

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

    const targetX = focusedRef.current ? 0 : BASE_PITCH;
    const targetY = focusedRef.current ? 0 : BASE_YAW;
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
      <mesh position={[0, 0, BOX_D / 2 + 0.001]}>
        <planeGeometry args={[BOX_W, BOX_H]} />
        <meshBasicMaterial
          ref={colorBackplateRef}
          color={0xffffff}
          toneMapped={false}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh position={[0, 0, BOX_D / 2 + 0.003]}>
        <planeGeometry args={[BOX_W, BOX_H]} />
        <meshBasicMaterial
          ref={colorPlaneRef}
          map={colorMap}
          toneMapped={false}
          transparent
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
  seed: number;
  hovered: boolean;
  focused: boolean;
};

export default function ProjectCubeCanvas({
  greySrc,
  colorSrc,
  width,
  height,
  seed,
  hovered,
  focused,
}: ProjectCubeCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();
  const engaged = hovered || focused;
  const engagedRef = useRef(engaged);
  engagedRef.current = engaged;
  const focusedRef = useRef(focused);
  focusedRef.current = focused;
  const [rotating, setRotating] = useState(false);
  const handleSettlingChange = useCallback((settling: boolean) => {
    setRotating(settling);
  }, []);
  const shouldLoop = !reducedMotion && (hovered || focused || rotating);
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
          seed={seed}
          engagedRef={engagedRef}
          engaged={engaged}
          focusedRef={focusedRef}
          focused={focused}
          onSettlingChange={handleSettlingChange}
        />
      </Suspense>
    </Canvas>
  );
}
