import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { PARTS, CATS } from '../data/parts';

const Y = 1.4; // beam height
const PI = Math.PI;
const COL = { p: 0x4cc9f0, a: 0xff4d9d, e: 0xb8f35a };
type G = THREE.Group;
type V2 = [number, number];

const M = (color: number, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.35, ...o });
const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
const cyl = (r: number, h: number, r2 = r, seg = 28) => new THREE.CylinderGeometry(r2, r, h, seg);
const tor = (R: number, r: number, seg = 96) => new THREE.TorusGeometry(R, r, 12, seg);

function add(g: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(geo, m);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  g.add(mesh);
  return mesh;
}

/** Beam pipe ring with magnets placed around it. */
function ring(g: G, R: number, n: number, geo: THREE.BufferGeometry, mats: THREE.Material[], pipe: THREE.Material, tube = 0.22) {
  add(g, tor(R, tube), pipe, 0, Y, 0, PI / 2);
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) / n) * PI * 2;
    add(g, geo, mats[i % mats.length], Math.cos(a) * R, Y, Math.sin(a) * R, 0, -a, 0);
  }
}

const steel = () => M(0x9aa7b8, { metalness: 0.6, roughness: 0.35 });
const dark = () => M(0x2a3444, { roughness: 0.8 });

const builders: Record<string, (g: G) => void> = {
  source(g) {
    const cage = M(0x3d6a8c);
    add(g, box(3, 3, 3), cage, -0.4, 1.5, 0);
    add(g, box(3.2, 0.25, 3.2), dark(), -0.4, 3.1, 0);
    add(g, cyl(0.45, 2.6), M(0xd9423a), -0.4, 1.3, 2.4);
    add(g, cyl(0.16, 0.5), steel(), -0.4, 2.85, 2.4);
    add(g, cyl(0.5, 1.6, 0.3), steel(), 1.6, Y, 0, 0, 0, PI / 2);
    add(g, new THREE.SphereGeometry(0.42, 20, 16), M(COL.p, { emissive: COL.p, emissiveIntensity: 1.6 }), 0.9, Y, 0);
  },
  linac4(g) {
    const cu = M(0xc9793a, { metalness: 0.65, roughness: 0.3 });
    const st = steel();
    const gird = dark();
    const kly = M(0x44566e);
    for (let i = 0; i < 9; i++) {
      const x = -8 + i * 2;
      const r = i < 1 ? 0.55 : i < 4 ? 1 : i < 7 ? 0.8 : 0.65;
      add(g, cyl(r, 1.7), i % 2 ? st : cu, x, Y, 0, 0, 0, PI / 2);
      add(g, cyl(r + 0.12, 0.12), st, x - 0.9, Y, 0, 0, 0, PI / 2);
      add(g, box(0.5, Y - r + 0.05, 1.2), gird, x, (Y - r) / 2, 0);
      if (i % 2 === 0) {
        add(g, box(1.1, 2.4, 1.1), kly, x, 1.2, -3);
        add(g, box(0.25, 0.25, 2.6), st, x, 2.3, -1.5);
      }
    }
  },
  psb(g) {
    const pipe = steel();
    const mag = M(0x2f8f83);
    for (let k = 0; k < 4; k++) add(g, tor(5, 0.16, 64), pipe, 0, 0.7 + k * 0.6, 0, PI / 2);
    for (let i = 0; i < 16; i++) {
      const a = ((i + 0.5) / 16) * PI * 2;
      add(g, box(1.1, 3, 1.2), mag, Math.cos(a) * 5, 1.5, Math.sin(a) * 5, 0, -a, 0);
    }
    add(g, cyl(1.2, 0.3), dark(), 0, 0.15, 0);
  },
  ps(g) {
    ring(g, 18, 40, box(1.5, 1.4, 1.9), [M(0xd9603a), M(0xd9603a), M(0xd9603a), M(0xe8b23a)], steel());
    const base = dark();
    for (let i = 0; i < 40; i++) {
      const a = ((i + 0.5) / 40) * PI * 2;
      add(g, box(1, 0.7, 1.2), base, Math.cos(a) * 18, 0.35, Math.sin(a) * 18, 0, -a, 0);
    }
  },
  target(g) {
    const conc = M(0x7d8794, { roughness: 0.95, metalness: 0.05 });
    add(g, box(1.2, 3, 4), conc, -1.8, 1.5, 0);
    add(g, box(1.2, 3, 4), conc, 1.8, 1.5, 0);
    add(g, box(4.8, 0.5, 4), conc, 0, 0.25, 0);
    add(g, cyl(0.5, 2.2), M(0x30343c, { roughness: 0.7 }), 0, Y, 0, PI / 2);
    add(g, cyl(0.14, 2.5), M(0xe9edf5, { metalness: 0.9, roughness: 0.2 }), 0, Y, 0, PI / 2);
    add(g, new THREE.SphereGeometry(0.5, 20, 16), M(0xffb547, { emissive: 0xff7a2f, emissiveIntensity: 2.4 }), 0, Y, 1.25);
  },
  horn(g) {
    const pts = [[0.22, 0], [0.34, 0.5], [0.8, 1.5], [1.25, 2.1], [1.25, 2.6]].map(([x, y]) => new THREE.Vector2(x, y));
    add(g, new THREE.LatheGeometry(pts, 36), M(0xdfe6f0, { metalness: 0.85, roughness: 0.22, side: THREE.DoubleSide }), 0, Y, -1.3, PI / 2);
    add(g, tor(1.3, 0.14, 40), M(0xc9793a, { metalness: 0.7, roughness: 0.3 }), 0, Y, 1.25);
    add(g, box(0.5, Y, 0.5), dark(), 0, Y / 2 - 0.6, 1.25);
    add(g, box(2.2, 0.3, 3), dark(), 0, 0.15, 0);
  },
  ad(g) {
    ring(g, 22, 24, box(1.8, 1.6, 2.6), [M(0x3566c9), M(0xc94a4a), M(0x3566c9)], steel(), 0.26);
    const base = dark();
    for (let i = 0; i < 24; i++) {
      const a = ((i + 0.5) / 24) * PI * 2;
      add(g, box(1.2, 0.6, 1.8), base, Math.cos(a) * 22, 0.3, Math.sin(a) * 22, 0, -a, 0);
    }
  },
  stoch(g) {
    const tank = M(0xe0a53a, { metalness: 0.5 });
    const cable = M(0xf2d06b, { emissive: 0xe0a53a, emissiveIntensity: 0.5 });
    for (const z of [0, 44]) {
      add(g, cyl(0.95, 3.4), tank, 0, Y, z, 0, 0, PI / 2);
      add(g, box(1.2, 0.5, 1.2), dark(), 0, 0.25, z);
      add(g, cyl(0.09, 8 - Y), cable, 0, (8 + Y) / 2, z);
    }
    add(g, cyl(0.09, 44), cable, 0, 8, 22, PI / 2);
    add(g, box(1.6, 1, 1.6), M(0x44566e), 0, 8, 22);
  },
  ecool(g) {
    const grn = M(0x3fae6b);
    const st = steel();
    add(g, cyl(0.95, 5), grn, 0, Y, 0, PI / 2);
    for (const s of [-1, 1]) {
      add(g, cyl(0.8, 3.4), grn, 1.1, Y + 1.7, s * 2.8);
      add(g, cyl(0.55, 0.9), st, 1.1, Y + 3.8, s * 2.8);
      add(g, new THREE.SphereGeometry(1, 20, 16), grn, 0.55, Y, s * 2.8);
    }
    add(g, box(2.6, 0.4, 7), dark(), 0.4, 0.2, 0);
  },
  rf(g) {
    g.rotation.y = -PI / 4;
    const cu = M(0xc9793a, { metalness: 0.7, roughness: 0.28 });
    add(g, cyl(1.25, 2.4), cu, 0, Y, 0, PI / 2);
    add(g, cyl(0.6, 3.4), steel(), 0, Y, 0, PI / 2);
    add(g, box(0.7, 2, 0.7), M(0x44566e), 0, Y + 2, 0);
    add(g, box(2.2, 0.7, 0.7), M(0x44566e), -0.8, Y + 3, 0);
    add(g, box(1.6, 0.4, 2.4), dark(), 0, 0.2, 0);
  },
  elena(g) {
    ring(g, 4, 6, box(1, 1.1, 1.7), [M(0x8b5cf6)], steel(), 0.16);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * PI * 2;
      add(g, box(0.7, 0.8, 0.7), i === 2 ? M(0x3fae6b) : M(0xe0a53a), Math.cos(a) * 4, Y, Math.sin(a) * 4, 0, -a, 0);
    }
    add(g, cyl(0.6, 2.2), M(0x3fae6b), Math.cos((2 / 6) * PI * 2) * 4.6, 1.6, Math.sin((2 / 6) * PI * 2) * 4.6);
  },
  alpha(g) {
    const c = M(0x7c5cff);
    add(g, box(4.6, 0.3, 4.6), dark(), 0, 0.15, 0);
    add(g, cyl(1.05, 4), c, -0.4, Y, 0, 0, 0, PI / 2);
    add(g, cyl(0.85, 6), M(0xb9a7ff, { metalness: 0.55 }), 1.5, 3.3, 0);
    add(g, cyl(0.5, 0.6), steel(), 1.5, 6.6, 0);
    add(g, box(1.2, 2, 1.2), M(0x44566e), -1.3, 1.3, -1.6);
  },
  aegis(g) {
    g.rotation.y = -0.35;
    const c = M(0x2fb6c4);
    add(g, box(5.4, 0.3, 3.4), dark(), 0, 0.15, 0);
    add(g, cyl(1.15, 3), c, -0.9, Y + 0.1, 0, 0, 0, PI / 2);
    add(g, cyl(0.7, 2), steel(), 1.6, Y + 0.1, 0, 0, 0, PI / 2);
    add(g, box(0.9, 2.4, 0.9), M(0x44566e), -1, 1.5, 1.2);
  },
  base(g) {
    g.rotation.y = 0.3;
    const c = M(0xe2574c);
    add(g, box(4.6, 0.3, 3.6), dark(), 0, 0.15, 0);
    add(g, cyl(1.3, 2.8), c, 0, Y + 0.2, 0, 0, 0, PI / 2);
    add(g, cyl(0.5, 4.2), steel(), 0, Y + 0.2, 0, 0, 0, PI / 2);
    add(g, cyl(0.4, 1.6), steel(), 0, 3.4, 0);
  },
  asacusa(g) {
    const c = M(0xe89a3c);
    add(g, box(5, 0.3, 3.6), dark(), 0, 0.15, 0);
    add(g, box(2.2, 2.4, 2.2), c, -1, 1.5, 0);
    add(g, cyl(0.75, 2.6), steel(), 1.2, Y, 0, 0, 0, PI / 2);
    add(g, box(0.35, 0.35, 3), M(0xd9423a, { emissive: 0xd9423a, emissiveIntensity: 0.6 }), -1, 3, 0.4);
  },
  gbar(g) {
    const c = M(0x4a8fe0);
    add(g, box(4.4, 0.3, 4.4), dark(), 0, 0.15, 0);
    add(g, box(2.4, 2, 2.4), c, 0, 1.3, 0);
    add(g, cyl(0.8, 3), M(0x9cc4f5, { metalness: 0.55 }), 0, 3.8, 0);
    add(g, cyl(0.45, 1.8), steel(), -1.8, Y, 0, 0, 0, PI / 2);
  },
  puma(g) {
    g.rotation.y = 0.5;
    const c = M(0xf0c53a);
    const tyre = M(0x15181e, { roughness: 0.9, metalness: 0 });
    add(g, box(4.4, 0.35, 2.2), dark(), 0, 0.85, 0);
    add(g, box(3, 2, 1.9), c, -0.4, 2.05, 0);
    add(g, cyl(0.6, 1.6), steel(), 1.6, 1.7, 0, 0, 0, PI / 2);
    for (const x of [-1.5, 1.5]) for (const z of [-1.15, 1.15]) add(g, cyl(0.5, 0.35), tyre, x, 0.5, z, PI / 2);
  },
  positron(g) {
    const lead = M(0x5a6472, { roughness: 0.85 });
    add(g, box(3, 2.6, 3), lead, 0, 1.3, -0.6);
    add(g, new THREE.SphereGeometry(0.45, 20, 16), M(COL.e, { emissive: COL.e, emissiveIntensity: 2 }), 0, Y, 1.05);
    add(g, cyl(0.85, 4.4), M(0x6c9a3c, { metalness: 0.5 }), 0, Y, 4, PI / 2);
    add(g, cyl(1.05, 0.25), steel(), 0, Y, 1.9, PI / 2);
    add(g, cyl(1.05, 0.25), steel(), 0, Y, 6.1, PI / 2);
    add(g, box(0.8, 1.4, 0.8), dark(), 0, 0.35, 4);
  },
  penning(g) {
    const glass = M(0x7fb4e6, { transparent: true, opacity: 0.28, metalness: 0.1, roughness: 0.15, depthWrite: false });
    const gold = M(0xe6b84a, { metalness: 0.85, roughness: 0.25 });
    for (let i = 0; i < 9; i++) add(g, cyl(0.55, 0.42, 0.55, 24), gold, 0, Y + 0.5, -2.2 + i * 0.55, PI / 2).castShadow = false;
    add(g, cyl(1.6, 6), glass, 0, Y + 0.5, 0, PI / 2).castShadow = false;
    const cap = M(0x3d6a8c);
    add(g, cyl(1.75, 0.5), cap, 0, Y + 0.5, 3.1, PI / 2);
    add(g, cyl(1.75, 0.5), cap, 0, Y + 0.5, -3.1, PI / 2);
    add(g, cyl(0.5, 1.8), steel(), 0, 4.2, 0);
    add(g, box(2.6, 0.5, 5), dark(), 0, 0.25, 0);
  },
  mixing(g) {
    const glass = M(0xc6b5ff, { transparent: true, opacity: 0.22, metalness: 0.1, roughness: 0.15, depthWrite: false });
    const coil = M(0xc9793a, { metalness: 0.75, roughness: 0.28 });
    const bar = M(0xd9423a);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * PI * 2;
      add(g, box(0.22, 0.22, 8.6), bar, Math.cos(a) * 1.05, Y + 0.6 + Math.sin(a) * 1.05, 0).castShadow = false;
    }
    add(g, cyl(1.5, 9.4), glass, 0, Y + 0.6, 0, PI / 2).castShadow = false;
    for (const z of [-4.2, -3.2, 3.2, 4.2]) add(g, tor(1.65, 0.24, 40), coil, 0, Y + 0.6, z);
    add(g, box(2.4, 0.5, 9), dark(), 0, 0.25, 0);
  },
  detector(g) {
    const si = M(0x1f9d8a, { metalness: 0.6, roughness: 0.3, side: THREE.DoubleSide });
    const si2 = M(0x35d0b5, { metalness: 0.6, roughness: 0.3, side: THREE.DoubleSide });
    [2.0, 2.45].forEach((R, k) => {
      const n = 10 + k * 4;
      for (let i = 0; i < n; i++) {
        const a = ((i + 0.5 * k) / n) * PI * 2;
        const m = add(g, box(0.06, (2 * PI * R) / n * 0.86, 4.4), k ? si2 : si, Math.cos(a) * R, Y + 0.6 + Math.sin(a) * R, 0);
        m.rotation.z = a;
      }
    });
    add(g, tor(2.55, 0.1, 48), steel(), 0, Y + 0.6, 2.25);
    add(g, tor(2.55, 0.1, 48), steel(), 0, Y + 0.6, -2.25);
  },
};

export interface SceneAPI {
  focus(id: string | null): void;
  setLang(l: number): void;
  setLabels(on: boolean): void;
  setInsets(l: number, r: number, t: number, b: number): void;
  reset(): void;
  dispose(): void;
}

export function createScene(el: HTMLElement, onSelect: (id: string | null) => void): SceneAPI {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a12);
  scene.fog = new THREE.FogExp2(0x070a12, 0.0022);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.5, 900);
  const HOME_T = new THREE.Vector3(1, 0, 6);
  const HOME_DIR = new THREE.Vector3(-0.06, 0.62, 0.78).normalize();
  camera.position.copy(HOME_T).addScaledVector(HOME_DIR, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  el.appendChild(renderer.domElement);

  const labels = new CSS2DRenderer();
  Object.assign(labels.domElement.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
  el.appendChild(labels.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(HOME_T);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = PI / 2 - 0.06;
  controls.minDistance = 7;
  controls.maxDistance = 330;
  controls.screenSpacePanning = false;

  // Lights
  scene.add(new THREE.HemisphereLight(0xbcd4ff, 0x10141c, 1.15));
  const sun = new THREE.DirectionalLight(0xffffff, 2.1);
  sun.position.set(-50, 90, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -100, right: 100, top: 80, bottom: -80, near: 10, far: 260 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  scene.add(sun);
  const tl = new THREE.PointLight(0xff7a2f, 60, 26);
  tl.position.set(4, 3, 1.5);
  scene.add(tl);
  const hl = new THREE.PointLight(0xc6b5ff, 40, 18);
  hl.position.set(62, 4, 20);
  scene.add(hl);

  // Ground
  const ground = add(scene, new THREE.PlaneGeometry(900, 900), M(0x0c121d, { roughness: 1, metalness: 0 }), 0, 0, 0, -PI / 2);
  ground.castShadow = false;
  const grid = new THREE.GridHelper(600, 150, 0x22344f, 0x141f31);
  grid.position.y = 0.02;
  scene.add(grid);
  const padM = M(0x131c2b, { roughness: 1, metalness: 0 });
  const pad = (geo: THREE.BufferGeometry, x: number, z: number) => {
    const m = add(scene, geo, padM, x, 0.04, z, -PI / 2);
    m.castShadow = false;
  };
  pad(new THREE.RingGeometry(14.5, 21.5, 96), -14, -11);
  pad(new THREE.CircleGeometry(8, 64), -42, -24);
  pad(new THREE.CircleGeometry(26, 96), 26, 20);
  pad(new THREE.PlaneGeometry(26, 7), -58, -29.5);
  pad(new THREE.PlaneGeometry(8, 22), 4, -1);
  const labM = M(0x1a2233, { roughness: 1, metalness: 0 });
  const lab = add(scene, box(18, 0.3, 36), labM, 62, 0.15, 21);
  lab.castShadow = false;

  // Zoom-in callout from ALPHA to the trap lab
  const dashM = new THREE.LineDashedMaterial({ color: 0x8b7bd8, dashSize: 0.8, gapSize: 0.6, transparent: true, opacity: 0.7 });
  for (const z of [3, 39]) {
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(31.5, 3, 10), new THREE.Vector3(53, 0.4, z)]), dashM);
    l.computeLineDistances();
    scene.add(l);
  }

  // Transfer lines (not clickable)
  const pipeM = M(0x7f8da0, { metalness: 0.6, roughness: 0.35 });
  const pipe = (a: V2, b: V2, r = 0.2) => {
    const d = new THREE.Vector3(b[0] - a[0], 0, b[1] - a[1]);
    const m = add(scene, cyl(r, d.length(), r, 12), pipeM, (a[0] + b[0]) / 2, Y, (a[1] + b[1]) / 2);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  };
  const ELENA: V2 = [17, 20];
  const exps = PARTS.filter((p) => p.cat === 'exp');
  const edge = (to: V2): V2 => {
    const d = Math.hypot(to[0] - ELENA[0], to[1] - ELENA[1]);
    return [ELENA[0] + ((to[0] - ELENA[0]) / d) * 4, ELENA[1] + ((to[1] - ELENA[1]) / d) * 4];
  };
  pipe([-67, -29], [-14, -29]);
  pipe([4, -11], [4, 20]);
  pipe([6.95, 31], [14.2, 22.8], 0.14);
  exps.forEach((p) => pipe(edge(p.pos), p.pos, 0.1));
  pipe([62, 8], [62, 32], 0.14);

  // Parts
  const root = new THREE.Group();
  scene.add(root);
  const groups = new Map<string, G>();
  const mats = new Map<string, THREE.MeshStandardMaterial[]>();
  const tags: { el: HTMLElement; name: HTMLElement; id: string; pos: THREE.Vector3 }[] = [];
  PARTS.forEach((p, i) => {
    const g = new THREE.Group();
    g.position.set(p.pos[0], 0, p.pos[1]);
    g.userData.id = p.id;
    builders[p.id](g);
    root.add(g);
    groups.set(p.id, g);
    const set = new Set<THREE.MeshStandardMaterial>();
    g.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m && m.emissive) {
        m.userData.e = m.emissive.getHex();
        m.userData.ei = m.emissiveIntensity;
        set.add(m);
      }
    });
    mats.set(p.id, [...set]);

    const div = document.createElement('button');
    div.type = 'button';
    div.className = 'lbl';
    div.style.setProperty('--c', CATS[p.cat].color);
    const num = document.createElement('span');
    num.className = 'lbl-n';
    num.textContent = String(i + 1);
    const name = document.createElement('span');
    name.className = 'lbl-t';
    div.append(num, name);
    div.addEventListener('click', () => onSelect(p.id));
    const obj = new CSS2DObject(div);
    const pos = new THREE.Vector3(p.pos[0] + (p.lo?.[0] ?? 0), p.h, p.pos[1] + (p.lo?.[1] ?? 0));
    obj.position.copy(pos);
    scene.add(obj);
    tags.push({ el: div, name, id: p.id, pos });
  });

  // Particles
  type Track = { f: (t: number, v: THREE.Vector3) => void; n: number; sp: number; c: number; bunch?: number };
  const lineT = (a: V2, b: V2) => (t: number, v: THREE.Vector3) => v.set(a[0] + (b[0] - a[0]) * t, Y, a[1] + (b[1] - a[1]) * t);
  const circT = (c: V2, R: number, dir: number, y = Y) => (t: number, v: THREE.Vector3) => {
    const a = dir * t * PI * 2;
    v.set(c[0] + Math.cos(a) * R, y, c[1] + Math.sin(a) * R);
  };
  const tracks: Track[] = [
    { f: lineT([-68, -29], [-42, -29]), n: 26, sp: 0.5, c: COL.p },
    { f: circT([-42, -24], 5, 1, 0.7), n: 10, sp: 0.9, c: COL.p, bunch: 2 },
    { f: circT([-42, -24], 5, 1, 1.3), n: 10, sp: 0.9, c: COL.p, bunch: 2 },
    { f: circT([-42, -24], 5, 1, 1.9), n: 10, sp: 0.9, c: COL.p, bunch: 2 },
    { f: circT([-42, -24], 5, 1, 2.5), n: 10, sp: 0.9, c: COL.p, bunch: 2 },
    { f: lineT([-42, -29], [-14, -29]), n: 22, sp: 0.55, c: COL.p },
    { f: circT([-14, -11], 18, 1), n: 70, sp: 0.42, c: COL.p, bunch: 5 },
    { f: lineT([4, -11], [4, 0]), n: 16, sp: 1.1, c: COL.p },
    { f: lineT([4, 1.2], [4, 20]), n: 18, sp: 0.6, c: COL.a },
    { f: circT([26, 20], 22, -1), n: 60, sp: 0.16, c: COL.a, bunch: 4 },
    { f: lineT([6.95, 31], [14.2, 22.8]), n: 8, sp: 0.3, c: COL.a },
    { f: circT(ELENA, 4, 1), n: 20, sp: 0.2, c: COL.a, bunch: 4 },
    ...exps.map((p) => ({ f: lineT(edge(p.pos), p.pos), n: 5, sp: 0.22, c: COL.a })),
    { f: lineT([62, 9], [62, 19]), n: 14, sp: 0.25, c: COL.e },
    { f: lineT([62, 32], [62, 21]), n: 12, sp: 0.25, c: COL.a },
  ];
  const total = tracks.reduce((s, t) => s + t.n, 0);
  const pPos = new Float32Array(total * 3);
  const pCol = new Float32Array(total * 3);
  const phase = new Float32Array(total);
  {
    let k = 0;
    const c = new THREE.Color();
    for (const t of tracks)
      for (let i = 0; i < t.n; i++, k++) {
        phase[k] = t.bunch ? Math.floor(Math.random() * t.bunch) / t.bunch + Math.random() * 0.035 : (i + Math.random() * 0.6) / t.n;
        c.setHex(t.c).toArray(pCol, k * 3);
      }
  }
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const cx = cv.getContext('2d')!;
  const gr = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  cx.fillStyle = gr;
  cx.fillRect(0, 0, 64, 64);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ size: 1.5, map: new THREE.CanvasTexture(cv), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  points.frustumCulled = false;
  scene.add(points);

  // Antihydrogen glow in the mixing trap
  const hbar = add(scene, new THREE.SphereGeometry(0.5, 20, 16), new THREE.MeshBasicMaterial({ color: 0xe9e2ff, transparent: true, opacity: 0.9 }), 62, Y + 0.6, 20);
  hbar.castShadow = false;

  // Selection halo
  const halo = add(scene, new THREE.RingGeometry(0.94, 1, 96), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }), 0, 0.09, 0, -PI / 2);
  halo.castShadow = false;
  halo.visible = false;

  // State
  let selected: string | null = null;
  let lang = 0;
  let fly: { p: THREE.Vector3; t: THREE.Vector3 } | null = null;
  let W = 1;
  let H = 1;
  let ins = { l: 0, r: 0, t: 0, b: 0 };
  let insReady = false;
  const off = new THREE.Vector2();
  const offT = new THREE.Vector2();
  // Shift the projection so the scene is centred in the area not covered by UI panels.
  const applyOffset = () => camera.setViewOffset(W, H, -off.x, -off.y, W, H);
  // Camera distance at which a footprint of radius r fits in the free area.
  const fitD = (r: number, min: number) => {
    const k = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const fw = Math.max(W - ins.l - ins.r, 140);
    const fh = Math.max(H - ins.t - ins.b, 140);
    return Math.max(min, (2.5 * r * H) / (k * fw), (1.9 * r * H) / (k * fh));
  };
  const homePos = () => HOME_T.clone().addScaledVector(HOME_DIR, Math.min(fitD(60, 110), 320));
  controls.addEventListener('start', () => (fly = null));

  const paint = (id: string | null, on: boolean) => {
    if (!id) return;
    for (const m of mats.get(id)!) {
      if (on && !m.userData.e) {
        m.emissive.copy(m.color);
        m.emissiveIntensity = 0.5;
      } else if (!on) {
        m.emissive.setHex(m.userData.e);
        m.emissiveIntensity = m.userData.ei;
      }
    }
    tags.find((t) => t.id === id)?.el.classList.toggle('on', on);
  };

  const go = (p: THREE.Vector3, t: THREE.Vector3) => {
    if (reduced) {
      camera.position.copy(p);
      controls.target.copy(t);
      fly = null;
    } else fly = { p, t };
  };

  const aim = () => {
    const p = PARTS.find((x) => x.id === selected);
    if (!p) return;
    const t = new THREE.Vector3(p.pos[0], 1.5, p.pos[1]);
    const dir = camera.position.clone().sub(controls.target).normalize();
    dir.y = THREE.MathUtils.clamp(dir.y, 0.45, 0.8);
    go(t.clone().addScaledVector(dir.normalize(), fitD(p.r, p.view)), t);
  };

  const focus = (id: string | null) => {
    if (id === selected) return;
    paint(selected, false);
    selected = id;
    paint(id, true);
    const p = PARTS.find((x) => x.id === id);
    halo.visible = !!p;
    if (!p) return;
    halo.position.set(p.pos[0], p.cat === 'trap' ? 0.38 : 0.09, p.pos[1]);
    halo.scale.setScalar(p.r);
    (halo.material as THREE.MeshBasicMaterial).color.set(CATS[p.cat].color);
    aim();
  };

  // Picking
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pick = (e: PointerEvent): string | null => {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    let o: THREE.Object3D | null = ray.intersectObjects(root.children, true)[0]?.object ?? null;
    while (o && !o.userData.id) o = o.parent;
    return o ? (o.userData.id as string) : null;
  };
  let down = { x: 0, y: 0 };
  let hoverId: string | null = null;
  const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY });
  const onUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
    const id = pick(e);
    if (id) onSelect(id);
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.buttons) return;
    const id = pick(e);
    if (id === hoverId) return;
    tags.find((t) => t.id === hoverId)?.el.classList.remove('hover');
    hoverId = id;
    tags.find((t) => t.id === id)?.el.classList.add('hover');
    renderer.domElement.style.cursor = id ? 'pointer' : 'grab';
  };
  const dom = renderer.domElement;
  dom.style.cursor = 'grab';
  dom.style.touchAction = 'none';
  dom.addEventListener('pointerdown', onDown);
  dom.addEventListener('pointerup', onUp);
  dom.addEventListener('pointermove', onMove);

  const resize = () => {
    W = el.clientWidth || 1;
    H = el.clientHeight || 1;
    camera.aspect = W / H;
    camera.fov = W < H ? 62 : 48;
    applyOffset();
    renderer.setSize(W, H);
    labels.setSize(W, H);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  let last = performance.now();
  const v = new THREE.Vector3();
  let time = 0;
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const now = performance.now();
    const last0 = last;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt * (reduced ? 0.25 : 1);
    let k = 0;
    for (const t of tracks)
      for (let i = 0; i < t.n; i++, k++) {
        t.f((phase[k] + time * t.sp) % 1, v);
        v.toArray(pPos, k * 3);
      }
    pGeo.attributes.position.needsUpdate = true;
    hbar.scale.setScalar(1 + Math.sin(time * 3) * 0.25);
    if (halo.visible) (halo.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(time * 4) * 0.3;
    const rdt = Math.min((now - last0) / 1000, 0.2);
    if (off.distanceToSquared(offT) > 0.2) {
      off.lerp(offT, reduced ? 1 : 1 - Math.exp(-rdt * 6));
      applyOffset();
    }
    if (fly) {
      const a = 1 - Math.exp(-rdt * 3.6);
      camera.position.lerp(fly.p, a);
      controls.target.lerp(fly.t, a);
      if (camera.position.distanceTo(fly.p) < 0.05) fly = null;
    }
    controls.update();
    for (const t of tags) t.el.classList.toggle('far', camera.position.distanceTo(t.pos) > 92 && t.id !== selected);
    renderer.render(scene, camera);
    labels.render(scene, camera);
  };
  loop();

  const setLang = (l: number) => {
    lang = l;
    tags.forEach((t, i) => {
      t.name.textContent = PARTS[i].name[lang];
      t.el.setAttribute('aria-label', PARTS[i].name[lang]);
    });
  };
  setLang(0);

  return {
    focus,
    setLang,
    setLabels: (on) => (labels.domElement.style.display = on ? '' : 'none'),
    reset: () => go(homePos(), HOME_T.clone()),
    setInsets(l, r, t, b) {
      ins = { l, r, t, b };
      offT.set((l - r) / 2, (t - b) / 2);
      if (!insReady) {
        insReady = true;
        off.copy(offT);
        applyOffset();
        if (!selected) {
          camera.position.copy(homePos());
          controls.target.copy(HOME_T);
        }
      } else if (selected && fly) aim();
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      dom.removeEventListener('pointerdown', onDown);
      dom.removeEventListener('pointerup', onUp);
      dom.removeEventListener('pointermove', onMove);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mm)) mm.forEach((x) => x.dispose());
        else mm?.dispose();
      });
      renderer.dispose();
      el.replaceChildren();
    },
  };
}
