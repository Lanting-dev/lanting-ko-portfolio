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
import {
  CUBE_FACE_PALETTE,
  CUBE_FACE_STITCH_SEED,
} from "@/lib/about/cubeFacePalette";
import { getAboutSceneValues } from "@/lib/about/aboutScroll";
import { StitchCanvasTexture } from "@/lib/about/stitchThreeTexture";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const DEG = Math.PI / 180;
/** Slightly inset so rotated corners stay inside the canvas. */
const CUBE_SIZE = 0.9;
const CUBE_HALF = CUBE_SIZE / 2;
const CUBE_FOOT_Y = CUBE_HALF;

type ProfileCubeProps = {
  aboutProgress: number;
  profileImpactComplete: boolean;
  anchorGroupRef: RefObject<THREE.Group | null>;
};

function ProfileCube({
  aboutProgress,
  profileImpactComplete,
  anchorGroupRef,
}: ProfileCubeProps) {
  const reducedMotion = usePrefersReducedMotion();
  const profileMap = useTexture(PROFILE_ASSET);
  profileMap.colorSpace = THREE.SRGBColorSpace;

  const progressRef = useRef(aboutProgress);
  const impactRef = useRef(profileImpactComplete);
  progressRef.current = aboutProgress;
  impactRef.current = profileImpactComplete;

  const stitch = useMemo(
    () => ({
      right: new StitchCanvasTexture(
        CUBE_FACE_PALETTE.right,
        CUBE_FACE_STITCH_SEED.right,
      ),
      left: new StitchCanvasTexture(
        CUBE_FACE_PALETTE.left,
        CUBE_FACE_STITCH_SEED.left,
      ),
      top: new StitchCanvasTexture(
        CUBE_FACE_PALETTE.top,
        CUBE_FACE_STITCH_SEED.top,
      ),
      bottom: new StitchCanvasTexture(
        CUBE_FACE_PALETTE.bottom,
        CUBE_FACE_STITCH_SEED.bottom,
      ),
      back: new StitchCanvasTexture(
        CUBE_FACE_PALETTE.back,
        CUBE_FACE_STITCH_SEED.back,
      ),
    }),
    [],
  );

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

  const materials = useMemo(
    () => [
      new THREE.MeshBasicMaterial({ map: stitch.right.texture }),
      new THREE.MeshBasicMaterial({ map: stitch.left.texture }),
      new THREE.MeshBasicMaterial({ map: stitch.top.texture }),
      new THREE.MeshBasicMaterial({ map: stitch.bottom.texture }),
      new THREE.MeshBasicMaterial({ map: profileMap }),
      new THREE.MeshBasicMaterial({ map: stitch.back.texture }),
    ],
    [profileMap, stitch],
  );

  useEffect(
    () => () => {
      materials.forEach((material) => material.dispose());
    },
    [materials],
  );

  useFrame(({ clock }) => {
    const timeMs = clock.elapsedTime * 1000;
    const animate = !reducedMotion;
    stitch.right.paint(timeMs, animate);
    stitch.left.paint(timeMs, animate);
    stitch.top.paint(timeMs, animate);
    stitch.bottom.paint(timeMs, animate);
    stitch.back.paint(timeMs, animate);

    const spin = anchorGroupRef.current;
    if (!spin) return;

    const { rotateX, rotateY, rotateZ, cubeScale, wobble } =
      getAboutSceneValues(progressRef.current, impactRef.current);

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

function ProfileBallAnchorProjector({
  cubeGroupRef,
  onAnchorMove,
}: {
  cubeGroupRef: RefObject<THREE.Group | null>;
  onAnchorMove: (x: number, y: number) => void;
}) {
  const { camera, size } = useThree();
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const cube = cubeGroupRef.current;
    if (!cube) return;

    point.set(0, CUBE_HALF, CUBE_HALF);
    cube.localToWorld(point);
    point.project(camera);

    onAnchorMove(
      (point.x * 0.5 + 0.5) * size.width,
      (-point.y * 0.5 + 0.5) * size.height,
    );
  });

  return null;
}

type AboutCubeCanvasProps = {
  width: number;
  height: number;
  aboutProgress: number;
  profileImpactComplete: boolean;
  onAnchorMove: (x: number, y: number) => void;
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

function AboutCubeSceneInner({
  aboutProgress,
  profileImpactComplete,
  onAnchorMove,
  aspect,
}: Omit<AboutCubeCanvasProps, "width" | "height"> & { aspect: number }) {
  const anchorGroupRef = useRef<THREE.Group>(null);

  return (
    <>
      <CameraFraming aspect={aspect} />
      <ambientLight intensity={1.15} />
      <Suspense fallback={null}>
        <ProfileCube
          aboutProgress={aboutProgress}
          profileImpactComplete={profileImpactComplete}
          anchorGroupRef={anchorGroupRef}
        />
      </Suspense>
      <ProfileBallAnchorProjector
        cubeGroupRef={anchorGroupRef}
        onAnchorMove={onAnchorMove}
      />
    </>
  );
}

export default function AboutCubeCanvas({
  width,
  height,
  aboutProgress,
  profileImpactComplete,
  onAnchorMove,
}: AboutCubeCanvasProps) {
  const aspect = width / Math.max(height, 1);

  return (
    <Canvas
      className="about-cube-canvas"
      style={{ width, height }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 36, near: 0.05, far: 30 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <AboutCubeSceneInner
        aspect={aspect}
        aboutProgress={aboutProgress}
        profileImpactComplete={profileImpactComplete}
        onAnchorMove={onAnchorMove}
      />
    </Canvas>
  );
}
