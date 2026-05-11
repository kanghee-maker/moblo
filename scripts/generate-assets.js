const fs = require("fs");
const path = require("path");

const outputDir = path.resolve(__dirname, "..", "assets", "models");

const colors = {
  skin: "#ffd0a8",
  cheek: "#ff9c9c",
  hair: "#382626",
  hairLight: "#6a4a3f",
  dress: "#ff6fa6",
  dressLight: "#ffc7d9",
  shoe: "#5d4a56",
  eye: "#263645",
  white: "#ffffff",
  red: "#ff8a76",
  blue: "#70a7ff",
  yellow: "#ffd86b",
  green: "#5fd39a",
  bark: "#9a6a43",
  leaf: "#5fd39a",
  leafDark: "#45bd78",
  cloud: "#f7ffff",
  rock: "#9ca9b2",
  rockDark: "#74818c",
  star: "#ffd86b"
};

function hexToFactor(hex) {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
    1
  ];
}

function makeBuilder(generator) {
  const builder = {
    generator,
    materials: [],
    materialByName: new Map(),
    meshes: [],
    nodes: [],
    accessors: [],
    bufferViews: [],
    binaryParts: [],
    byteOffset: 0
  };

  builder.material = (name, hex, roughness = 0.82) => {
    if (builder.materialByName.has(name)) return builder.materialByName.get(name);
    const index = builder.materials.length;
    builder.materials.push({
      name,
      pbrMetallicRoughness: {
        baseColorFactor: hexToFactor(hex),
        metallicFactor: 0,
        roughnessFactor: roughness
      }
    });
    builder.materialByName.set(name, index);
    return index;
  };

  builder.addMesh = (name, geometry, material) => {
    const positionAccessor = addAccessor(builder, new Float32Array(geometry.positions), "VEC3", 5126, 34962, true);
    const normalAccessor = addAccessor(builder, new Float32Array(geometry.normals), "VEC3", 5126, 34962, false);
    const indices = geometry.indices.length > 65535 ? new Uint32Array(geometry.indices) : new Uint16Array(geometry.indices);
    const indexAccessor = addAccessor(builder, indices, "SCALAR", indices instanceof Uint32Array ? 5125 : 5123, 34963, false);
    const meshIndex = builder.meshes.length;
    builder.meshes.push({
      name,
      primitives: [
        {
          attributes: { POSITION: positionAccessor, NORMAL: normalAccessor },
          indices: indexAccessor,
          material
        }
      ]
    });
    return meshIndex;
  };

  builder.node = (name, geometry, material, transform = {}) => {
    const mesh = builder.addMesh(name, geometry, material);
    const node = { name, mesh };
    if (transform.translation) node.translation = transform.translation;
    if (transform.scale) node.scale = transform.scale;
    if (transform.rotation) node.rotation = transform.rotation;
    builder.nodes.push(node);
    return builder.nodes.length - 1;
  };

  return builder;
}

function addAccessor(builder, typedArray, type, componentType, target, withMinMax) {
  alignBuilder(builder);
  const buffer = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
  const bufferView = builder.bufferViews.length;
  builder.bufferViews.push({
    buffer: 0,
    byteOffset: builder.byteOffset,
    byteLength: buffer.byteLength,
    target
  });
  builder.binaryParts.push(buffer);
  builder.byteOffset += buffer.byteLength;

  const accessor = {
    bufferView,
    byteOffset: 0,
    componentType,
    count: getAccessorCount(typedArray, type),
    type
  };
  if (withMinMax) {
    const { min, max } = getMinMax(typedArray, type);
    accessor.min = min;
    accessor.max = max;
  }
  builder.accessors.push(accessor);
  return builder.accessors.length - 1;
}

function alignBuilder(builder) {
  const padding = (4 - (builder.byteOffset % 4)) % 4;
  if (!padding) return;
  builder.binaryParts.push(Buffer.alloc(padding));
  builder.byteOffset += padding;
}

function getAccessorCount(array, type) {
  const size = type === "VEC3" ? 3 : 1;
  return array.length / size;
}

function getMinMax(array, type) {
  if (type !== "VEC3") return { min: [0], max: [0] };
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < array.length; i += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      const value = array[i + axis];
      min[axis] = Math.min(min[axis], value);
      max[axis] = Math.max(max[axis], value);
    }
  }
  return { min, max };
}

function writeGlb(filename, generator, build) {
  const builder = makeBuilder(generator);
  build(builder);
  alignBuilder(builder);

  const binary = Buffer.concat(builder.binaryParts);
  const gltf = {
    asset: { version: "2.0", generator },
    scene: 0,
    scenes: [{ nodes: builder.nodes.map((_, index) => index) }],
    nodes: builder.nodes,
    meshes: builder.meshes,
    materials: builder.materials,
    accessors: builder.accessors,
    bufferViews: builder.bufferViews,
    buffers: [{ byteLength: binary.byteLength }]
  };

  const jsonBuffer = padBuffer(Buffer.from(JSON.stringify(gltf), "utf8"), 0x20);
  const binBuffer = padBuffer(binary, 0x00);
  const totalLength = 12 + 8 + jsonBuffer.byteLength + 8 + binBuffer.byteLength;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonBuffer.byteLength, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binBuffer.byteLength, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);

  fs.writeFileSync(path.join(outputDir, filename), Buffer.concat([header, jsonHeader, jsonBuffer, binHeader, binBuffer]));
}

function padBuffer(buffer, fill) {
  const padding = (4 - (buffer.byteLength % 4)) % 4;
  return padding ? Buffer.concat([buffer, Buffer.alloc(padding, fill)]) : buffer;
}

function boxGeometry() {
  const positions = [];
  const normals = [];
  const indices = [];
  const faces = [
    { n: [1, 0, 0], v: [[0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5]] },
    { n: [-1, 0, 0], v: [[-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5]] },
    { n: [0, 1, 0], v: [[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]] },
    { n: [0, -1, 0], v: [[-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5]] },
    { n: [0, 0, 1], v: [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]] },
    { n: [0, 0, -1], v: [[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]] }
  ];
  faces.forEach((face) => {
    const start = positions.length / 3;
    face.v.forEach((vertex) => {
      positions.push(...vertex);
      normals.push(...face.n);
    });
    indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
  });
  return { positions, normals, indices };
}

function sphereGeometry(segments = 24, rings = 16) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (let ring = 0; ring <= rings; ring += 1) {
    const v = ring / rings;
    const theta = v * Math.PI;
    const y = Math.cos(theta);
    const radius = Math.sin(theta);
    for (let segment = 0; segment <= segments; segment += 1) {
      const u = segment / segments;
      const phi = u * Math.PI * 2;
      const x = Math.cos(phi) * radius;
      const z = Math.sin(phi) * radius;
      positions.push(x, y, z);
      normals.push(x, y, z);
    }
  }
  for (let ring = 0; ring < rings; ring += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const a = ring * (segments + 1) + segment;
      const b = a + segments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { positions, normals, indices };
}

function cylinderGeometry(topRadius = 1, bottomRadius = 1, segments = 24) {
  const positions = [];
  const normals = [];
  const indices = [];
  const slope = bottomRadius - topRadius;

  for (let yIndex = 0; yIndex <= 1; yIndex += 1) {
    const y = yIndex === 0 ? -0.5 : 0.5;
    const radius = yIndex === 0 ? bottomRadius : topRadius;
    for (let segment = 0; segment <= segments; segment += 1) {
      const phi = (segment / segments) * Math.PI * 2;
      const x = Math.cos(phi);
      const z = Math.sin(phi);
      const normal = normalize([x, slope, z]);
      positions.push(x * radius, y, z * radius);
      normals.push(...normal);
    }
  }
  for (let segment = 0; segment < segments; segment += 1) {
    const a = segment;
    const b = segment + segments + 1;
    indices.push(a, a + 1, b, b, a + 1, b + 1);
  }

  const topCenter = positions.length / 3;
  positions.push(0, 0.5, 0);
  normals.push(0, 1, 0);
  for (let segment = 0; segment <= segments; segment += 1) {
    const phi = (segment / segments) * Math.PI * 2;
    positions.push(Math.cos(phi) * topRadius, 0.5, Math.sin(phi) * topRadius);
    normals.push(0, 1, 0);
  }
  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(topCenter, topCenter + segment + 1, topCenter + segment + 2);
  }

  const bottomCenter = positions.length / 3;
  positions.push(0, -0.5, 0);
  normals.push(0, -1, 0);
  for (let segment = 0; segment <= segments; segment += 1) {
    const phi = (segment / segments) * Math.PI * 2;
    positions.push(Math.cos(phi) * bottomRadius, -0.5, Math.sin(phi) * bottomRadius);
    normals.push(0, -1, 0);
  }
  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(bottomCenter, bottomCenter + segment + 2, bottomCenter + segment + 1);
  }
  return { positions, normals, indices };
}

function starGeometry(points = 5, outer = 0.5, inner = 0.24, depth = 0.16) {
  const positions = [];
  const normals = [];
  const indices = [];
  const contour = [];
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = Math.PI / 2 + (i / (points * 2)) * Math.PI * 2;
    contour.push([Math.cos(angle) * radius, Math.sin(angle) * radius + outer, 0]);
  }

  const frontCenter = positions.length / 3;
  positions.push(0, outer, depth / 2);
  normals.push(0, 0, 1);
  contour.forEach(([x, y]) => {
    positions.push(x, y, depth / 2);
    normals.push(0, 0, 1);
  });
  for (let i = 0; i < contour.length; i += 1) {
    indices.push(frontCenter, frontCenter + i + 1, frontCenter + ((i + 1) % contour.length) + 1);
  }

  const backCenter = positions.length / 3;
  positions.push(0, outer, -depth / 2);
  normals.push(0, 0, -1);
  contour.forEach(([x, y]) => {
    positions.push(x, y, -depth / 2);
    normals.push(0, 0, -1);
  });
  for (let i = 0; i < contour.length; i += 1) {
    indices.push(backCenter, backCenter + ((i + 1) % contour.length) + 1, backCenter + i + 1);
  }

  for (let i = 0; i < contour.length; i += 1) {
    const next = (i + 1) % contour.length;
    const [x1, y1] = contour[i];
    const [x2, y2] = contour[next];
    const normal = normalize([y1 - y2, x2 - x1, 0]);
    const start = positions.length / 3;
    positions.push(x1, y1, depth / 2, x2, y2, depth / 2, x2, y2, -depth / 2, x1, y1, -depth / 2);
    normals.push(...normal, ...normal, ...normal, ...normal);
    indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
  }
  return { positions, normals, indices };
}

function normalize(vector) {
  const length = Math.hypot(...vector) || 1;
  return vector.map((value) => value / length);
}

function rotationFromEuler(x = 0, y = 0, z = 0) {
  const cx = Math.cos(x / 2);
  const sx = Math.sin(x / 2);
  const cy = Math.cos(y / 2);
  const sy = Math.sin(y / 2);
  const cz = Math.cos(z / 2);
  const sz = Math.sin(z / 2);
  return [
    sx * cy * cz - cx * sy * sz,
    cx * sy * cz + sx * cy * sz,
    cx * cy * sz - sx * sy * cz,
    cx * cy * cz + sx * sy * sz
  ];
}

function addChaea() {
  writeGlb("chaea.glb", "Moblo Chaea asset generator", (builder) => {
    const sphere = sphereGeometry(28, 18);
    const box = boxGeometry();
    const cylinder = cylinderGeometry(1, 1, 24);
    const dressCone = cylinderGeometry(0.5, 0.75, 28);

    const skin = builder.material("soft skin", colors.skin);
    const cheek = builder.material("rosy cheeks", colors.cheek);
    const hair = builder.material("warm brown hair", colors.hair);
    const hairLight = builder.material("hair highlight", colors.hairLight);
    const dress = builder.material("pink dress", colors.dress);
    const dressLight = builder.material("dress collar", colors.dressLight);
    const shoe = builder.material("soft shoes", colors.shoe);
    const eye = builder.material("sparkly eyes", colors.eye);
    const white = builder.material("eye highlights", colors.white);

    builder.node("hair cap", sphere, hair, { translation: [0, 1.55, -0.03], scale: [0.54, 0.52, 0.48] });
    builder.node("face", sphere, skin, { translation: [0, 1.5, 0.17], scale: [0.43, 0.42, 0.38] });
    builder.node("left bun", sphere, hair, { translation: [-0.45, 1.54, -0.01], scale: [0.19, 0.2, 0.18] });
    builder.node("right bun", sphere, hair, { translation: [0.45, 1.54, -0.01], scale: [0.19, 0.2, 0.18] });
    builder.node("left bang", sphere, hairLight, { translation: [-0.15, 1.84, 0.32], scale: [0.16, 0.08, 0.07] });
    builder.node("right bang", sphere, hairLight, { translation: [0.09, 1.84, 0.34], scale: [0.18, 0.08, 0.07] });
    builder.node("tiny top bow left", sphere, dressLight, { translation: [-0.09, 2.04, 0.08], scale: [0.1, 0.055, 0.045] });
    builder.node("tiny top bow right", sphere, dressLight, { translation: [0.09, 2.04, 0.08], scale: [0.1, 0.055, 0.045] });
    builder.node("bow knot", sphere, dress, { translation: [0, 2.04, 0.1], scale: [0.045, 0.045, 0.04] });

    builder.node("dress", dressCone, dress, { translation: [0, 0.78, 0], scale: [0.46, 0.72, 0.38] });
    builder.node("collar", box, dressLight, { translation: [0, 1.15, 0.18], scale: [0.38, 0.08, 0.08] });
    builder.node("left arm", cylinder, skin, { translation: [-0.37, 0.82, 0.11], scale: [0.055, 0.42, 0.055], rotation: rotationFromEuler(0, 0, -0.3) });
    builder.node("right arm", cylinder, skin, { translation: [0.37, 0.82, 0.11], scale: [0.055, 0.42, 0.055], rotation: rotationFromEuler(0, 0, 0.3) });
    builder.node("left leg", cylinder, skin, { translation: [-0.13, 0.31, 0.02], scale: [0.06, 0.34, 0.06] });
    builder.node("right leg", cylinder, skin, { translation: [0.13, 0.31, 0.02], scale: [0.06, 0.34, 0.06] });
    builder.node("left shoe", box, shoe, { translation: [-0.13, 0.08, 0.08], scale: [0.16, 0.08, 0.2] });
    builder.node("right shoe", box, shoe, { translation: [0.13, 0.08, 0.08], scale: [0.16, 0.08, 0.2] });

    [-0.13, 0.13].forEach((x) => {
      builder.node("eye", sphere, eye, { translation: [x, 1.54, 0.53], scale: [0.042, 0.052, 0.028] });
      builder.node("eye sparkle", sphere, white, { translation: [x - 0.012, 1.56, 0.555], scale: [0.012, 0.014, 0.008] });
      builder.node("cheek", sphere, cheek, { translation: [x * 1.35, 1.43, 0.51], scale: [0.06, 0.035, 0.018] });
    });

    [-0.07, -0.035, 0, 0.035, 0.07].forEach((x, index) => {
      const y = 1.39 - Math.abs(index - 2) * 0.015;
      builder.node("smile bead", sphere, builder.material("smile", "#b45e67"), { translation: [x, y, 0.545], scale: [0.016, 0.012, 0.008] });
    });
  });
}

function addBlock(filename, colorName, hex) {
  writeGlb(filename, `Moblo ${colorName} block asset generator`, (builder) => {
    const box = boxGeometry();
    const sphere = sphereGeometry(18, 12);
    const cylinder = cylinderGeometry(1, 1, 24);
    const body = builder.material(`${colorName} plastic`, hex, 0.7);
    const light = builder.material(`${colorName} soft peg highlight`, colors.white, 0.65);

    builder.node("rounded body", box, body, { translation: [0, 0.18, 0], scale: [0.92, 0.34, 0.7] });
    [[-0.42, -0.32], [0.42, -0.32], [-0.42, 0.32], [0.42, 0.32]].forEach(([x, z]) => {
      builder.node("rounded corner", sphere, body, { translation: [x, 0.18, z], scale: [0.105, 0.17, 0.105] });
    });
    [-0.22, 0.22].forEach((x) => {
      builder.node("top peg", cylinder, body, { translation: [x, 0.43, -0.16], scale: [0.12, 0.13, 0.12] });
      builder.node("peg shine", sphere, light, { translation: [x - 0.04, 0.51, -0.19], scale: [0.035, 0.018, 0.035] });
    });
    builder.node("front dot", sphere, builder.material(`${colorName} dark dot`, "#3f5362"), { translation: [0, 0.23, 0.38], scale: [0.08, 0.08, 0.035] });
  });
}

function addGoalStar() {
  writeGlb("goal-star.glb", "Moblo goal star asset generator", (builder) => {
    const star = starGeometry(5, 0.5, 0.23, 0.15);
    const cylinder = cylinderGeometry(1, 1, 18);
    const starMat = builder.material("warm goal star", colors.star, 0.62);
    const stem = builder.material("goal stem", "#62c889");
    builder.node("standing star", star, starMat, { translation: [0, 0.22, 0], rotation: rotationFromEuler(0, 0, 0) });
    builder.node("star stem", cylinder, stem, { translation: [0, 0.18, -0.04], scale: [0.035, 0.36, 0.035] });
    builder.node("star base", cylinder, stem, { translation: [0, 0.035, -0.04], scale: [0.18, 0.07, 0.18] });
  });
}

function addObstacleRock() {
  writeGlb("obstacle-rock.glb", "Moblo obstacle rock asset generator", (builder) => {
    const sphere = sphereGeometry(18, 12);
    const rock = builder.material("soft rock", colors.rock);
    const dark = builder.material("soft rock shadow", colors.rockDark);
    builder.node("rock center", sphere, rock, { translation: [0, 0.24, 0], scale: [0.36, 0.22, 0.32] });
    builder.node("rock left", sphere, dark, { translation: [-0.22, 0.18, 0.04], scale: [0.2, 0.16, 0.18] });
    builder.node("rock right", sphere, rock, { translation: [0.24, 0.17, -0.04], scale: [0.18, 0.15, 0.22] });
    builder.node("rock top", sphere, builder.material("soft rock light", "#bac5cc"), { translation: [0.05, 0.38, 0.02], scale: [0.16, 0.12, 0.14] });
  });
}

function addTree() {
  writeGlb("tree.glb", "Moblo tree asset generator", (builder) => {
    const sphere = sphereGeometry(20, 12);
    const cylinder = cylinderGeometry(1, 1, 16);
    const trunk = builder.material("friendly trunk", colors.bark);
    const leaf = builder.material("mint leaves", colors.leaf);
    const leafDark = builder.material("leaf shade", colors.leafDark);
    builder.node("trunk", cylinder, trunk, { translation: [0, 0.24, 0], scale: [0.08, 0.48, 0.08] });
    builder.node("leaf center", sphere, leaf, { translation: [0, 0.68, 0], scale: [0.28, 0.28, 0.26] });
    builder.node("leaf left", sphere, leafDark, { translation: [-0.16, 0.62, 0.04], scale: [0.2, 0.2, 0.18] });
    builder.node("leaf top", sphere, leaf, { translation: [0.08, 0.86, 0], scale: [0.18, 0.18, 0.16] });
  });
}

function addCloud() {
  writeGlb("cloud.glb", "Moblo cloud asset generator", (builder) => {
    const sphere = sphereGeometry(20, 12);
    const cloud = builder.material("puffy cloud", colors.cloud, 0.95);
    [[-0.24, 0, 0.18], [0, 0.08, 0.25], [0.25, 0.02, 0.18], [0.07, -0.03, 0.17]].forEach(([x, y, scale]) => {
      builder.node("cloud puff", sphere, cloud, { translation: [x, y + 0.25, 0], scale: [scale * 1.2, scale, scale * 0.82] });
    });
  });
}

fs.mkdirSync(outputDir, { recursive: true });
addChaea();
addBlock("block-red.glb", "red", colors.red);
addBlock("block-blue.glb", "blue", colors.blue);
addBlock("block-yellow.glb", "yellow", colors.yellow);
addBlock("block-green.glb", "green", colors.green);
addGoalStar();
addObstacleRock();
addTree();
addCloud();

console.log(`Generated GLB assets in ${outputDir}`);
