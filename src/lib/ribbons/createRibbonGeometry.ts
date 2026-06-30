import * as THREE from "three";

/** Flat tape along a 3D curve — parallel-transport frames for natural twist. */
export function createRibbonGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  segments: number,
  width: number,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const prevTangent = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const axis = new THREE.Vector3();
  const half = width / 2;

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    curve.getPoint(t, point);
    curve.getTangent(t, tangent).normalize();

    if (i === 0) {
      const seed = new THREE.Vector3(0, 1, 0);
      binormal.crossVectors(tangent, seed);
      if (binormal.lengthSq() < 1e-5) {
        binormal.crossVectors(tangent, new THREE.Vector3(1, 0, 0));
      }
      binormal.normalize();
      normal.crossVectors(binormal, tangent).normalize();
      prevTangent.copy(tangent);
    } else {
      axis.crossVectors(prevTangent, tangent);
      const axisLen = axis.length();
      if (axisLen > 1e-5) {
        const angle = Math.acos(THREE.MathUtils.clamp(prevTangent.dot(tangent), -1, 1));
        normal.applyAxisAngle(axis.multiplyScalar(1 / axisLen), angle);
        binormal.crossVectors(tangent, normal).normalize();
        normal.crossVectors(binormal, tangent).normalize();
      }
      prevTangent.copy(tangent);
    }

    positions.push(
      point.x - binormal.x * half,
      point.y - binormal.y * half,
      point.z - binormal.z * half,
      point.x + binormal.x * half,
      point.y + binormal.y * half,
      point.z + binormal.z * half,
    );
    normals.push(
      normal.x,
      normal.y,
      normal.z,
      normal.x,
      normal.y,
      normal.z,
    );
    uvs.push(t, 0, t, 1);
  }

  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();

  return geometry;
}
