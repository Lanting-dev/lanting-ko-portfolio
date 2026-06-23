"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
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
/** Three-quarter resting pose so the cube clearly reads as a solid. */
const BASE_YAW = -0.5;
const BASE_PITCH = 0.26;

/** Soft radial falloff — reads as a blurred floor contact shadow, not a hard disc. */
function createSoftCircleTexture(size = 128): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const center = size / 2;
  const gradient = ctx.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    center,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.72)");
  gradient.addColorStop(0.35, "rgba(0, 0, 0, 0.32)");
  gradient.addColorStop(0.62, "rgba(0, 0, 0, 0.12)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

type RevealRef = { current: boolean };

function ProjectCube({
  greySrc,
  colorSrc,
  seed,
  revealedRef,
  hoveredRef,
}: {
  greySrc: string;
  colorSrc: string;
  seed: number;
  revealedRef: RevealRef;
  hoveredRef: RevealRef;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const gl = useThree((state) => state.gl);
  const [greyMap, colorMap] = useTexture([greySrc, colorSrc]);
  // Anisotropic filtering keeps the art sharp on the tilted (foreshortened) face.
  const maxAniso = gl.capabilities.getMaxAnisotropy();
  for (const map of [greyMap, colorMap]) {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = maxAniso;
    map.minFilter = THREE.LinearMipmapLinearFilter;
    map.generateMipmaps = true;
    map.needsUpdate = true;
  }

  const groupRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.MeshBasicMaterial>(null);
  const colorBackplateRef = useRef<THREE.MeshBasicMaterial>(null);
  const colorPlaneRef = useRef<THREE.MeshBasicMaterial>(null);

  const shadowTexture = useMemo(() => createSoftCircleTexture(), []);
  useEffect(() => () => shadowTexture.dispose(), [shadowTexture]);

  // Matches the profile cube: grey cross-stitch faces stay neutral while the
  // project artwork itself reveals in colour on the front face.
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

  // The five patterned faces — kept in an array so we can tint them together.
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

  // Box face order: right, left, top, bottom, front, back.
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

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    // Ball settles on the card → swap the noise face for the colour artwork.
    const amount = revealedRef.current ? 1 : 0;

    if (colorBackplateRef.current) {
      colorBackplateRef.current.opacity = amount;
    }
    if (colorPlaneRef.current) {
      colorPlaneRef.current.opacity = amount;
    }
    greyFrontMaterial.opacity = 1 - amount;
    if (shadowRef.current) {
      const revealed = revealedRef.current;
      const hovered = hoveredRef.current;
      const targetOpacity = revealed ? (hovered ? 0.52 : 0.3) : 0;
      shadowRef.current.opacity +=
        (targetOpacity - shadowRef.current.opacity) * 0.2;
    }

    if (reducedMotion) {
      // Static three-quarter pose still reads as a solid cube.
      group.rotation.set(BASE_PITCH, BASE_YAW, 0);
      return;
    }
    // Hover straightens the cube to face the viewer (readable + "openable");
    // otherwise hold a three-quarter angle and sway around it.
    const t = clock.elapsedTime;
    const hovered = hoveredRef.current;
    const targetY = hovered ? 0 : BASE_YAW + Math.sin(t * 0.5) * 0.1;
    const targetX = hovered ? 0 : BASE_PITCH + Math.sin(t * 0.37 + 1) * 0.05;
    group.rotation.y += (targetY - group.rotation.y) * 0.12;
    group.rotation.x += (targetX - group.rotation.x) * 0.12;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0.04, -BOX_H / 2 - 0.08, -0.03]} scale={[1.08, 0.2, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial
          ref={shadowRef}
          map={shadowTexture}
          color={0x000000}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
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

function CameraFraming() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const aspect = size.width / Math.max(size.height, 1);
    const vFov = camera.fov * DEG;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    // Fit the tilted silhouette (front + side + top) with breathing room.
    const yaw = Math.abs(BASE_YAW) + 0.1;
    const pitch = Math.abs(BASE_PITCH) + 0.05;
    const silhouetteW = BOX_W * Math.cos(yaw) + BOX_D * Math.sin(yaw);
    const silhouetteH = BOX_H * Math.cos(pitch) + BOX_D * Math.sin(pitch);
    const margin = 1.12;
    const halfH = (silhouetteH / 2) * margin;
    const halfW = (silhouetteW / 2) * margin;
    const distV = halfH / Math.tan(vFov / 2);
    const distH = halfW / Math.tan(hFov / 2);
    const distance = Math.max(distV, distH) + BOX_D / 2;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.near = 0.05;
    camera.far = distance + 10;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

type ProjectCubeCanvasProps = {
  greySrc: string;
  colorSrc: string;
  width: number;
  height: number;
  seed: number;
  revealed: boolean;
  hovered: boolean;
  active?: boolean;
};

export default function ProjectCubeCanvas({
  greySrc,
  colorSrc,
  width,
  height,
  seed,
  revealed,
  hovered,
  active = true,
}: ProjectCubeCanvasProps) {
  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;
  const hoveredRef = useRef(hovered);
  hoveredRef.current = hovered;

  return (
    <Canvas
      className="project-cube-canvas"
      style={{ width, height }}
      dpr={[1, 1.5]}
      flat
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.05, far: 30 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <CameraFraming />
      <ambientLight intensity={1.15} />
      <Suspense fallback={null}>
        <ProjectCube
          greySrc={greySrc}
          colorSrc={colorSrc}
          seed={seed}
          revealedRef={revealedRef}
          hoveredRef={hoveredRef}
        />
      </Suspense>
    </Canvas>
  );
}
