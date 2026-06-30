"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import * as THREE from "three";
import { PROFILE_ASSET } from "@/lib/assets";
import { cubeFaceColor } from "@/lib/about/cubeFacePalette";
import { getAboutSceneValues } from "@/lib/about/aboutScroll";

function faceColor(id: Parameters<typeof cubeFaceColor>[0]): THREE.Color {
  return new THREE.Color(cubeFaceColor(id));
}

const DEG = Math.PI / 180;
/** Slightly inset so rotated corners stay inside the canvas. */
const CUBE_SIZE = 0.9;
const CUBE_HALF = CUBE_SIZE / 2;
const CUBE_FOOT_Y = CUBE_HALF;

type ProfileCubeProps = {
  aboutProgress: number;
  anchorGroupRef: RefObject<THREE.Group | null>;
};

function ProfileCube({ aboutProgress, anchorGroupRef }: ProfileCubeProps) {
  const profileMap = useTexture(PROFILE_ASSET);
  profileMap.colorSpace = THREE.SRGBColorSpace;

  const progressRef = useRef(aboutProgress);
  progressRef.current = aboutProgress;

  const materials = useMemo(
    () => [
      new THREE.MeshBasicMaterial({ color: faceColor("right") }),
      new THREE.MeshBasicMaterial({ color: faceColor("left") }),
      new THREE.MeshBasicMaterial({ color: faceColor("top") }),
      new THREE.MeshBasicMaterial({ color: faceColor("bottom") }),
      new THREE.MeshBasicMaterial({ map: profileMap }),
      new THREE.MeshBasicMaterial({ color: faceColor("back") }),
    ],
    [profileMap],
  );

  useEffect(
    () => () => {
      materials.forEach((material) => material.dispose());
    },
    [materials],
  );

  useFrame(() => {
    const spin = anchorGroupRef.current;
    if (!spin) return;

    const { rotateX, rotateY, rotateZ, cubeScale, wobble } =
      getAboutSceneValues(progressRef.current);

    spin.rotation.order = "ZYX";
    spin.rotation.set(
      (-rotateX - wobble) * DEG,
      (-rotateY) * DEG,
      (-rotateZ) * DEG,
    );
    spin.scale.setScalar(cubeScale);
  });

  return (
    <group position={[0, CUBE_FOOT_Y, 0]}>
      <group ref={anchorGroupRef}>
        <mesh material={materials}>
          <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
        </mesh>
      </group>
    </group>
  );
}

type AboutCubeCanvasProps = {
  width: number;
  height: number;
  aboutProgress: number;
  /** Run the render loop only while the scene is on screen. */
  active?: boolean;
};

function CameraFraming({ aspect }: { aspect: number }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const vFov = camera.fov * DEG;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const fitRadius = Math.sqrt(3) * CUBE_HALF * 1.28;
    const distV = fitRadius / Math.sin(vFov / 2);
    const distH = fitRadius / Math.sin(hFov / 2);
    const distance = Math.max(distV, distH) + 0.35;

    camera.position.set(0, CUBE_FOOT_Y, distance);
    camera.lookAt(0, CUBE_FOOT_Y, 0);
    camera.near = 0.05;
    camera.far = distance + 10;
    camera.updateProjectionMatrix();
  }, [aspect, camera]);

  return null;
}

function InvalidateOnProgress({
  aboutProgress,
  active,
}: {
  aboutProgress: number;
  active: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (active) invalidate();
  }, [aboutProgress, active, invalidate]);

  return null;
}

function AboutCubeSceneInner({
  aboutProgress,
  aspect,
  active,
}: Omit<AboutCubeCanvasProps, "width" | "height"> & {
  aspect: number;
  active: boolean;
}) {
  const anchorGroupRef = useRef<THREE.Group>(null);

  return (
    <>
      <InvalidateOnProgress aboutProgress={aboutProgress} active={active} />
      <CameraFraming aspect={aspect} />
      <ambientLight intensity={1.15} />
      <Suspense fallback={null}>
        <ProfileCube aboutProgress={aboutProgress} anchorGroupRef={anchorGroupRef} />
      </Suspense>
    </>
  );
}

export default function AboutCubeCanvas({
  width,
  height,
  aboutProgress,
  active = true,
}: AboutCubeCanvasProps) {
  const aspect = width / Math.max(height, 1);

  return (
    <Canvas
      className="about-cube-canvas"
      style={{ width, height }}
      dpr={[1, 2]}
      frameloop={active ? "demand" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 36, near: 0.05, far: 30 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <AboutCubeSceneInner
        aspect={aspect}
        aboutProgress={aboutProgress}
        active={active}
      />
    </Canvas>
  );
}
