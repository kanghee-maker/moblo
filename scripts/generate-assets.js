const fs = require("fs");
const path = require("path");

const outputDir = path.resolve(__dirname, "..", "assets", "models");

const colors = {
  skin: "#ffd0a8",
  skinShade: "#ffc19c",
  cheek: "#ffcaca",
  hair: "#382626",
  hairLight: "#6a4a3f",
  hairSoft: "#4f3932",
  dress: "#ff6fa6",
  dressLight: "#ffc7d9",
  dressShadow: "#e85f98",
  sock: "#fff2f7",
  shoe: "#5d4a56",
  shoeLight: "#8b7180",
  eye: "#263645",
  white: "#ffffff",
  gold: "#ffd36a",
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
  star: "#ffd86b",
  starGlow: "#fff2a9"
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

function superellipsoidGeometry(segments = 36, rings = 18, exponent = 0.42) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (let ring = 0; ring <= rings; ring += 1) {
    const v = -Math.PI / 2 + (ring / rings) * Math.PI;
    for (let segment = 0; segment <= segments; segment += 1) {
      const u = -Math.PI + (segment / segments) * Math.PI * 2;
      const cv = signedPow(Math.cos(v), exponent);
      const sv = signedPow(Math.sin(v), exponent);
      const cu = signedPow(Math.cos(u), exponent);
      const su = signedPow(Math.sin(u), exponent);
      const x = cv * cu;
      const y = sv;
      const z = cv * su;
      positions.push(x, y, z);
      normals.push(...normalize([x, y, z]));
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

function torusGeometry(majorRadius = 0.35, tubeRadius = 0.06, radialSegments = 32, tubeSegments = 10) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (let radial = 0; radial <= radialSegments; radial += 1) {
    const u = (radial / radialSegments) * Math.PI * 2;
    const cosU = Math.cos(u);
    const sinU = Math.sin(u);
    for (let tube = 0; tube <= tubeSegments; tube += 1) {
      const v = (tube / tubeSegments) * Math.PI * 2;
      const cosV = Math.cos(v);
      const sinV = Math.sin(v);
      const x = (majorRadius + tubeRadius * cosV) * cosU;
      const y = tubeRadius * sinV;
      const z = (majorRadius + tubeRadius * cosV) * sinU;
      positions.push(x, y, z);
      normals.push(cosU * cosV, sinV, sinU * cosV);
    }
  }
  for (let radial = 0; radial < radialSegments; radial += 1) {
    for (let tube = 0; tube < tubeSegments; tube += 1) {
      const a = radial * (tubeSegments + 1) + tube;
      const b = a + tubeSegments + 1;
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

function signedPow(value, exponent) {
  return Math.sign(value) * Math.pow(Math.abs(value), exponent);
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
  writeGlb("chaea.glb", "Moblo premium Chaea asset generator", (builder) => {
    const sphere = sphereGeometry(40, 26);
    const smallSphere = sphereGeometry(24, 16);
    const rounded = superellipsoidGeometry(40, 22, 0.54);
    const box = boxGeometry();
    const cylinder = cylinderGeometry(1, 1, 32);
    const softCone = cylinderGeometry(0.46, 0.82, 38);

    const skin = builder.material("soft skin", colors.skin);
    const skinShade = builder.material("soft skin shade", colors.skinShade);
    const cheek = builder.material("rosy cheeks", colors.cheek);
    const hair = builder.material("warm brown hair", colors.hair);
    const hairLight = builder.material("hair highlight", colors.hairLight);
    const hairSoft = builder.material("hair soft side", colors.hairSoft);
    const dress = builder.material("pink dress", colors.dress);
    const dressLight = builder.material("dress collar", colors.dressLight);
    const dressShadow = builder.material("dress soft shadow", colors.dressShadow);
    const sock = builder.material("cream socks", colors.sock);
    const shoe = builder.material("soft shoes", colors.shoe);
    const shoeLight = builder.material("shoe shine", colors.shoeLight);
    const eye = builder.material("sparkly eyes", colors.eye);
    const white = builder.material("eye highlights", colors.white);
    const smile = builder.material("soft smile", "#7b4c58");
    const gold = builder.material("tiny gold charm", colors.gold);

    builder.node("back hair shell", sphere, hair, { translation: [0, 1.54, -0.15], scale: [0.57, 0.54, 0.38] });
    builder.node("soft face", sphere, skin, { translation: [0, 1.49, 0.34], scale: [0.43, 0.42, 0.3] });
    builder.node("left ear", smallSphere, skin, { translation: [-0.42, 1.48, 0.17], scale: [0.06, 0.085, 0.038] });
    builder.node("right ear", smallSphere, skin, { translation: [0.42, 1.48, 0.17], scale: [0.06, 0.085, 0.038] });

    builder.node("left round bun", sphere, hair, { translation: [-0.47, 1.55, -0.08], scale: [0.21, 0.22, 0.18] });
    builder.node("right round bun", sphere, hair, { translation: [0.47, 1.55, -0.08], scale: [0.21, 0.22, 0.18] });
    builder.node("left bun highlight", smallSphere, hairLight, { translation: [-0.51, 1.66, 0.0], scale: [0.08, 0.045, 0.028] });
    builder.node("right bun highlight", smallSphere, hairLight, { translation: [0.39, 1.66, 0.0], scale: [0.08, 0.045, 0.028] });

    [
      [-0.23, 1.82, 0.42, 0.14, -0.38],
      [-0.08, 1.86, 0.47, 0.14, -0.12],
      [0.1, 1.85, 0.47, 0.15, 0.12],
      [0.25, 1.8, 0.42, 0.14, 0.32]
    ].forEach(([x, y, z, scale, tilt], index) => {
      builder.node(`soft bang ${index + 1}`, smallSphere, index % 2 ? hairLight : hairSoft, {
        translation: [x, y, z],
        scale: [scale, 0.07, 0.05],
        rotation: rotationFromEuler(0, 0, tilt)
      });
    });

    builder.node("left ribbon loop", rounded, dressLight, { translation: [-0.11, 2.02, 0.11], scale: [0.13, 0.06, 0.045], rotation: rotationFromEuler(0, 0, -0.18) });
    builder.node("right ribbon loop", rounded, dressLight, { translation: [0.11, 2.02, 0.11], scale: [0.13, 0.06, 0.045], rotation: rotationFromEuler(0, 0, 0.18) });
    builder.node("ribbon knot", smallSphere, dress, { translation: [0, 2.02, 0.12], scale: [0.045, 0.045, 0.038] });
    builder.node("tiny hair charm", smallSphere, gold, { translation: [0.21, 1.77, 0.43], scale: [0.024, 0.024, 0.014] });

    builder.node("neck", cylinder, skin, { translation: [0, 1.12, 0.03], scale: [0.085, 0.16, 0.085] });
    builder.node("rounded bodice", rounded, dress, { translation: [0, 0.88, 0.03], scale: [0.35, 0.32, 0.25] });
    builder.node("soft skirt", softCone, dress, { translation: [0, 0.58, 0], scale: [0.48, 0.52, 0.38] });
    builder.node("skirt shadow fold", softCone, dressShadow, { translation: [0.11, 0.54, 0.04], scale: [0.16, 0.49, 0.13], rotation: rotationFromEuler(0, 0.04, -0.08) });
    builder.node("collar left", rounded, dressLight, { translation: [-0.1, 1.13, 0.2], scale: [0.16, 0.04, 0.055], rotation: rotationFromEuler(0, 0, -0.22) });
    builder.node("collar right", rounded, dressLight, { translation: [0.1, 1.13, 0.2], scale: [0.16, 0.04, 0.055], rotation: rotationFromEuler(0, 0, 0.22) });
    builder.node("dress charm", smallSphere, gold, { translation: [0, 0.91, 0.27], scale: [0.026, 0.026, 0.016] });

    builder.node("left sleeve", smallSphere, dressLight, { translation: [-0.34, 0.95, 0.1], scale: [0.11, 0.13, 0.095] });
    builder.node("right sleeve", smallSphere, dressLight, { translation: [0.34, 0.95, 0.1], scale: [0.11, 0.13, 0.095] });
    builder.node("left arm", cylinder, skin, { translation: [-0.39, 0.7, 0.13], scale: [0.055, 0.42, 0.055], rotation: rotationFromEuler(0.08, 0, -0.28) });
    builder.node("right arm", cylinder, skin, { translation: [0.39, 0.7, 0.13], scale: [0.055, 0.42, 0.055], rotation: rotationFromEuler(0.08, 0, 0.28) });
    builder.node("left hand", smallSphere, skin, { translation: [-0.47, 0.45, 0.18], scale: [0.065, 0.055, 0.06] });
    builder.node("right hand", smallSphere, skin, { translation: [0.47, 0.45, 0.18], scale: [0.065, 0.055, 0.06] });

    builder.node("left leg", cylinder, skin, { translation: [-0.13, 0.29, 0.02], scale: [0.06, 0.28, 0.06] });
    builder.node("right leg", cylinder, skin, { translation: [0.13, 0.29, 0.02], scale: [0.06, 0.28, 0.06] });
    builder.node("left sock", cylinder, sock, { translation: [-0.13, 0.17, 0.02], scale: [0.065, 0.14, 0.065] });
    builder.node("right sock", cylinder, sock, { translation: [0.13, 0.17, 0.02], scale: [0.065, 0.14, 0.065] });
    builder.node("left shoe", rounded, shoe, { translation: [-0.13, 0.06, 0.09], scale: [0.17, 0.075, 0.22] });
    builder.node("right shoe", rounded, shoe, { translation: [0.13, 0.06, 0.09], scale: [0.17, 0.075, 0.22] });
    builder.node("left shoe shine", rounded, shoeLight, { translation: [-0.17, 0.09, 0.23], scale: [0.055, 0.018, 0.035] });
    builder.node("right shoe shine", rounded, shoeLight, { translation: [0.09, 0.09, 0.23], scale: [0.055, 0.018, 0.035] });

    [-0.13, 0.13].forEach((x) => {
      builder.node("large glossy eye", smallSphere, eye, { translation: [x, 1.54, 0.69], scale: [0.043, 0.052, 0.015] });
      builder.node("large eye sparkle", smallSphere, white, { translation: [x - 0.014, 1.57, 0.705], scale: [0.011, 0.013, 0.004] });
      builder.node("soft cheek", smallSphere, cheek, { translation: [x * 1.38, 1.43, 0.68], scale: [0.04, 0.023, 0.009] });
    });
    builder.node("tiny nose", smallSphere, skinShade, { translation: [0, 1.47, 0.695], scale: [0.012, 0.01, 0.004] });
    [-0.024, 0.024].forEach((x) => {
      builder.node("smile bead", smallSphere, smile, { translation: [x, 1.385, 0.702], scale: [0.008, 0.005, 0.003] });
    });
  });
}

function addBlock(filename, colorName, hex) {
  writeGlb(filename, `Moblo premium ${colorName} block asset generator`, (builder) => {
    const box = boxGeometry();
    const rounded = superellipsoidGeometry(42, 20, 0.32);
    const sphere = sphereGeometry(24, 16);
    const cylinder = cylinderGeometry(1, 1, 36);
    const torus = torusGeometry(0.12, 0.014, 32, 8);
    const body = builder.material(`${colorName} plastic`, hex, 0.7);
    const light = builder.material(`${colorName} soft peg highlight`, colors.white, 0.65);
    const shadow = builder.material(`${colorName} underside shade`, "#000000", 0.9);
    const face = builder.material(`${colorName} label face`, "#f8fdff", 0.78);
    const dot = builder.material(`${colorName} dark dot`, "#3f5362");

    builder.node("single molded rounded body", rounded, body, { translation: [0, 0.22, 0], scale: [0.55, 0.22, 0.42] });
    builder.node("soft underside shadow", rounded, shadow, { translation: [0, 0.05, -0.005], scale: [0.46, 0.035, 0.34] });
    builder.node("front inset panel", rounded, face, { translation: [0, 0.23, 0.435], scale: [0.26, 0.085, 0.025] });
    [-0.25, 0.25].forEach((x) => {
      builder.node("top peg body", cylinder, body, { translation: [x, 0.45, -0.08], scale: [0.12, 0.13, 0.12] });
      builder.node("rounded peg cap", sphere, body, { translation: [x, 0.515, -0.08], scale: [0.12, 0.045, 0.12] });
      builder.node("peg bevel ring", torus, light, { translation: [x, 0.525, -0.08], scale: [1, 1, 1] });
      builder.node("peg shine", sphere, light, { translation: [x - 0.04, 0.55, -0.12], scale: [0.035, 0.018, 0.026] });
    });
    builder.node("front dot", sphere, dot, { translation: [0, 0.245, 0.47], scale: [0.075, 0.075, 0.028] });
    builder.node("side highlight", box, light, { translation: [-0.38, 0.31, 0.11], scale: [0.035, 0.035, 0.32] });
  });
}

function addGoalStar() {
  writeGlb("goal-star.glb", "Moblo premium goal star asset generator", (builder) => {
    const star = starGeometry(5, 0.56, 0.25, 0.17);
    const smallStar = starGeometry(5, 0.18, 0.08, 0.07);
    const cylinder = cylinderGeometry(1, 1, 24);
    const rounded = superellipsoidGeometry(28, 14, 0.45);
    const starMat = builder.material("warm goal star", colors.star, 0.62);
    const glow = builder.material("soft star glow", colors.starGlow, 0.72);
    const stem = builder.material("goal stem", "#62c889");
    builder.node("standing star", star, starMat, { translation: [0, 0.24, 0.03], rotation: rotationFromEuler(0, 0, 0) });
    builder.node("inner star shine", smallStar, glow, { translation: [0.09, 0.8, 0.13], scale: [0.5, 0.5, 0.5] });
    builder.node("left sparkle", smallStar, glow, { translation: [-0.43, 0.83, 0.06], scale: [0.28, 0.28, 0.28], rotation: rotationFromEuler(0, 0, 0.4) });
    builder.node("right sparkle", smallStar, glow, { translation: [0.43, 0.55, 0.06], scale: [0.22, 0.22, 0.22], rotation: rotationFromEuler(0, 0, -0.24) });
    builder.node("star stem", cylinder, stem, { translation: [0, 0.18, -0.04], scale: [0.035, 0.36, 0.035] });
    builder.node("star base", rounded, stem, { translation: [0, 0.04, -0.04], scale: [0.22, 0.06, 0.22] });
  });
}

function addObstacleRock() {
  writeGlb("obstacle-rock.glb", "Moblo premium obstacle rock asset generator", (builder) => {
    const sphere = sphereGeometry(24, 16);
    const rounded = superellipsoidGeometry(24, 14, 0.5);
    const box = boxGeometry();
    const rock = builder.material("soft rock", colors.rock);
    const dark = builder.material("soft rock shadow", colors.rockDark);
    const light = builder.material("soft rock light", "#bac5cc");
    builder.node("rock center", rounded, rock, { translation: [0, 0.24, 0], scale: [0.4, 0.23, 0.35], rotation: rotationFromEuler(0.06, -0.1, 0) });
    builder.node("rock left", sphere, dark, { translation: [-0.24, 0.18, 0.06], scale: [0.22, 0.16, 0.19] });
    builder.node("rock right", sphere, rock, { translation: [0.25, 0.17, -0.04], scale: [0.2, 0.15, 0.23] });
    builder.node("rock top", sphere, light, { translation: [0.05, 0.4, 0.02], scale: [0.17, 0.11, 0.15] });
    builder.node("soft crack one", box, dark, { translation: [-0.02, 0.43, 0.21], scale: [0.025, 0.008, 0.14], rotation: rotationFromEuler(0, 0.18, 0.55) });
    builder.node("soft crack two", box, dark, { translation: [0.1, 0.34, 0.25], scale: [0.018, 0.008, 0.1], rotation: rotationFromEuler(0, -0.2, -0.4) });
  });
}

function addTree() {
  writeGlb("tree.glb", "Moblo premium tree asset generator", (builder) => {
    const sphere = sphereGeometry(28, 18);
    const cylinder = cylinderGeometry(0.65, 1, 20);
    const trunk = builder.material("friendly trunk", colors.bark);
    const leaf = builder.material("mint leaves", colors.leaf);
    const leafDark = builder.material("leaf shade", colors.leafDark);
    const fruit = builder.material("tiny tree berry", colors.dress);
    builder.node("tapered trunk", cylinder, trunk, { translation: [0, 0.24, 0], scale: [0.09, 0.5, 0.09] });
    builder.node("trunk highlight", cylinder, builder.material("friendly trunk light", "#bd8757"), { translation: [-0.025, 0.28, 0.055], scale: [0.018, 0.42, 0.012] });
    builder.node("leaf center", sphere, leaf, { translation: [0, 0.68, 0], scale: [0.32, 0.3, 0.28] });
    builder.node("leaf left", sphere, leafDark, { translation: [-0.18, 0.62, 0.04], scale: [0.23, 0.22, 0.2] });
    builder.node("leaf right", sphere, leaf, { translation: [0.2, 0.61, 0.03], scale: [0.21, 0.21, 0.19] });
    builder.node("leaf top", sphere, leaf, { translation: [0.07, 0.87, 0], scale: [0.19, 0.18, 0.17] });
    builder.node("tiny berry one", sphere, fruit, { translation: [-0.11, 0.73, 0.24], scale: [0.035, 0.035, 0.03] });
    builder.node("tiny berry two", sphere, fruit, { translation: [0.15, 0.66, 0.22], scale: [0.028, 0.028, 0.024] });
  });
}

function addCloud() {
  writeGlb("cloud.glb", "Moblo premium cloud asset generator", (builder) => {
    const sphere = sphereGeometry(30, 18);
    const cloud = builder.material("puffy cloud", colors.cloud, 0.95);
    const shade = builder.material("puffy cloud shade", "#dff6fb", 0.95);
    [[-0.32, 0, 0.17, cloud], [-0.12, 0.08, 0.23, cloud], [0.12, 0.1, 0.25, cloud], [0.34, 0.02, 0.18, cloud], [0.04, -0.04, 0.2, shade]].forEach(([x, y, scale, material]) => {
      builder.node("cloud puff", sphere, material, { translation: [x, y + 0.25, 0], scale: [scale * 1.25, scale, scale * 0.82] });
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
