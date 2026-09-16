import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Creates high-detail procedural weathered dark mahogany / aged sea-oak plank texture
 */
function createRealisticWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Rich warm pirate mahogany timber
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#3a1f0c');
  grad.addColorStop(0.35, '#4a2912');
  grad.addColorStop(0.7, '#2f1708');
  grad.addColorStop(1, '#231005');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Fine wood grain fibers
  for (let y = 0; y < 1024; y += 2) {
    const alpha = 0.06 + Math.random() * 0.14;
    ctx.fillStyle = Math.random() > 0.4 ? `rgba(18, 9, 4, ${alpha})` : `rgba(110, 68, 35, ${alpha * 0.8})`;
    ctx.fillRect(0, y, 1024, 1.5);
  }

  // Weathered horizontal plank seams with dark recessed shadows & golden bevel highlights
  const plankHeights = [0, 205, 410, 615, 820, 1024];
  plankHeights.forEach((y) => {
    // Recessed shadow groove
    ctx.fillStyle = '#100602';
    ctx.fillRect(0, y - 4, 1024, 8);
    // Bevel highlight
    ctx.fillStyle = 'rgba(215, 155, 85, 0.25)';
    ctx.fillRect(0, y + 4, 1024, 2);
  });

  // Weathered scratches & knots
  ctx.fillStyle = 'rgba(12, 6, 2, 0.5)';
  for (let i = 0; i < 45; i++) {
    const kx = Math.random() * 1024;
    const ky = Math.random() * 1024;
    ctx.beginPath();
    ctx.ellipse(kx, ky, Math.random() * 16 + 4, Math.random() * 6 + 2, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates an ornate Celtic / Aztec forged iron band bump texture
 */
function createMetalBandTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffd700';
  ctx.fillRect(0, 0, 512, 512);

  // Hammered metallic noise
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 4 + 1;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 245, 180, 0.3)' : 'rgba(70, 45, 10, 0.35)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedurally constructs a flawless 3D arched barrel vault for the chest lid
 * with closed wooden endcaps. No Euler angle glitches, no sticking out ears.
 */
function createLidVaultGeometry(width, radius, segments = 32, withEndcaps = true) {
  const geom = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const indices = [];

  const stepsX = 6;
  const stepsArc = segments;

  // 1. Curved barrel vault surface
  for (let j = 0; j <= stepsArc; j++) {
    const angle = (j / stepsArc) * Math.PI; // 0 (front z = +radius) to PI (back z = -radius)
    const y = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    for (let i = 0; i <= stepsX; i++) {
      const x = (i / stepsX - 0.5) * width;
      positions.push(x, y, z);
      uvs.push(i / stepsX, j / stepsArc);
    }
  }

  const row = stepsX + 1;
  for (let j = 0; j < stepsArc; j++) {
    for (let i = 0; i < stepsX; i++) {
      const a = j * row + i;
      const b = (j + 1) * row + i;
      const c = (j + 1) * row + i + 1;
      const d = j * row + i + 1;
      indices.push(a, d, b);
      indices.push(d, c, b);
    }
  }

  // 2. Closed flat vertical endcaps (if requested)
  if (withEndcaps) {
    // Left cap (x = -width/2)
    const leftCenterIdx = positions.length / 3;
    positions.push(-width / 2, 0, 0);
    uvs.push(0.5, 0.5);
    for (let j = 0; j <= stepsArc; j++) {
      const angle = (j / stepsArc) * Math.PI;
      positions.push(-width / 2, Math.sin(angle) * radius, Math.cos(angle) * radius);
      uvs.push(0.5 + Math.cos(angle) * 0.5, Math.sin(angle) * 0.5);
    }
    for (let j = 0; j < stepsArc; j++) {
      indices.push(leftCenterIdx, leftCenterIdx + 1 + j, leftCenterIdx + 1 + j + 1);
    }

    // Right cap (x = +width/2)
    const rightCenterIdx = positions.length / 3;
    positions.push(width / 2, 0, 0);
    uvs.push(0.5, 0.5);
    for (let j = 0; j <= stepsArc; j++) {
      const angle = (j / stepsArc) * Math.PI;
      positions.push(width / 2, Math.sin(angle) * radius, Math.cos(angle) * radius);
      uvs.push(0.5 + Math.cos(angle) * 0.5, Math.sin(angle) * 0.5);
    }
    for (let j = 0; j < stepsArc; j++) {
      indices.push(rightCenterIdx, rightCenterIdx + 1 + j + 1, rightCenterIdx + 1 + j);
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

const RealisticTreasureChest3DCanvas = ({
  isOpen = false,
  isOpening = false,
  isHovered = false,
  onClick,
}) => {
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  // Animation references
  const lidGroupRef = useRef(null);
  const chestGroupRef = useRef(null);
  const treasureLightRef = useRef(null);
  const particlesRef = useRef(null);
  const treasurePileRef = useRef(null);
  const targetLidAngle = useRef(0);
  const currentLidAngle = useRef(0);

  // Mouse tilt tracking
  const targetRotation = useRef({ x: 0.22, y: -0.28 });

  useEffect(() => {
    // When open, lid swings back ~115 degrees
    targetLidAngle.current = isOpen ? -Math.PI * 0.65 : 0;
  }, [isOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 300;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    // Centered perspective framing the full chest without any cutoffs
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 10.8);
    camera.lookAt(0, 1.0, 0);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. CINEMATIC PIRATE LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfffaec, 1.8);
    scene.add(ambientLight);

    // Main Golden Key Light directly illuminating front planks & lock
    const keyLight = new THREE.DirectionalLight(0xfff2b8, 3.6);
    keyLight.position.set(4, 7, 9);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Top Rim Light for highlighting the arched lid
    const topLight = new THREE.DirectionalLight(0xffea88, 2.2);
    topLight.position.set(0, 10, 2);
    scene.add(topLight);

    // Caribbean Deep Sea Cyan Rim Light (Left/Back)
    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.8);
    rimLight.position.set(-8, 3, -4);
    scene.add(rimLight);

    // Glowing Internal Cursed Treasure Light
    const treasurePointLight = new THREE.PointLight(0xffd700, isOpen ? 7.0 : 0, 12);
    treasurePointLight.position.set(0, 1.6, 0);
    scene.add(treasurePointLight);
    treasureLightRef.current = treasurePointLight;

    // 4. MATERIALS
    const woodTexture = createRealisticWoodTexture();
    const metalTexture = createMetalBandTexture();

    // Dark Aged Mahogany Timber (Rich warm reddish-brown wood)
    const woodMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      color: 0x73401c,
      roughness: 0.55,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    // Dark Interior Velvet / Aged Wood
    const interiorMat = new THREE.MeshStandardMaterial({
      color: 0x180b04,
      roughness: 0.85,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    // Forged Aztec Cursed Gold (Rich metallic sheen, bevelled highlights)
    const aztecGoldMat = new THREE.MeshStandardMaterial({
      map: metalTexture,
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.18,
      side: THREE.DoubleSide,
    });

    // Antiqued Forged Iron (Corner brackets & lock base)
    const darkIronMat = new THREE.MeshStandardMaterial({
      color: 0x181412,
      metalness: 0.85,
      roughness: 0.38,
    });

    // Ruby & Emerald Jewel Materials
    const rubyMat = new THREE.MeshStandardMaterial({
      color: 0xeb143d,
      emissive: 0x8a051d,
      emissiveIntensity: 0.7,
      metalness: 0.2,
      roughness: 0.1,
    });

    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x00e676,
      emissive: 0x00662a,
      emissiveIntensity: 0.65,
      metalness: 0.2,
      roughness: 0.1,
    });

    // 5. MASTER CHEST CONTAINER
    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, -0.3, 0);
    scene.add(chestGroup);
    chestGroupRef.current = chestGroup;

    // --- BASE COMPARTMENT ---
    const baseGroup = new THREE.Group();
    chestGroup.add(baseGroup);

    const bWidth = 4.6;
    const bHeight = 2.1;
    const bDepth = 3.2;
    const wallThick = 0.22;

    // --- TRUE HOLLOW PIRATE CHEST BASE (Floor + 4 Walls) ---
    // 1. Bottom Floor
    const floorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth, wallThick, bDepth),
      interiorMat
    );
    floorMesh.position.y = wallThick / 2;
    baseGroup.add(floorMesh);

    // Decorative Solid Heavy Base Plinth
    const plinthMesh = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth + 0.25, 0.18, bDepth + 0.25),
      darkIronMat
    );
    plinthMesh.position.y = 0.09;
    baseGroup.add(plinthMesh);

    // 2. Front Wall
    const frontWall = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth, bHeight - wallThick, wallThick),
      woodMat
    );
    frontWall.position.set(0, (bHeight + wallThick) / 2, bDepth / 2 - wallThick / 2);
    frontWall.castShadow = true;
    frontWall.receiveShadow = true;
    baseGroup.add(frontWall);

    // 3. Back Wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth, bHeight - wallThick, wallThick),
      woodMat
    );
    backWall.position.set(0, (bHeight + wallThick) / 2, -bDepth / 2 + wallThick / 2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    baseGroup.add(backWall);

    // 4. Left Wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThick, bHeight - wallThick, bDepth - wallThick * 2),
      woodMat
    );
    leftWall.position.set(-bWidth / 2 + wallThick / 2, (bHeight + wallThick) / 2, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    baseGroup.add(leftWall);

    // 5. Right Wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThick, bHeight - wallThick, bDepth - wallThick * 2),
      woodMat
    );
    rightWall.position.set(bWidth / 2 - wallThick / 2, (bHeight + wallThick) / 2, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    baseGroup.add(rightWall);

    // 6. Gold Rim Trims along top edge of the 4 walls
    const topCollarFront = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth + 0.1, 0.12, wallThick + 0.08),
      aztecGoldMat
    );
    topCollarFront.position.set(0, bHeight - 0.06, bDepth / 2 - wallThick / 2);
    baseGroup.add(topCollarFront);

    const topCollarBack = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth + 0.1, 0.12, wallThick + 0.08),
      aztecGoldMat
    );
    topCollarBack.position.set(0, bHeight - 0.06, -bDepth / 2 + wallThick / 2);
    baseGroup.add(topCollarBack);

    const topCollarLeft = new THREE.Mesh(
      new THREE.BoxGeometry(wallThick + 0.08, 0.12, bDepth - wallThick * 2),
      aztecGoldMat
    );
    topCollarLeft.position.set(-bWidth / 2 + wallThick / 2, bHeight - 0.06, 0);
    baseGroup.add(topCollarLeft);

    const topCollarRight = new THREE.Mesh(
      new THREE.BoxGeometry(wallThick + 0.08, 0.12, bDepth - wallThick * 2),
      aztecGoldMat
    );
    topCollarRight.position.set(bWidth / 2 - wallThick / 2, bHeight - 0.06, 0);
    baseGroup.add(topCollarRight);

    // Vertical Aztec Gold Straps on Trunk (3 bands: Left, Center, Right)
    const strapWidth = 0.38;
    const strapThickness = 0.07;
    const bandXPositions = [-1.5, 0, 1.5];

    bandXPositions.forEach((xPos) => {
      const vStrap = new THREE.Mesh(
        new THREE.BoxGeometry(strapWidth, bHeight + 0.05, bDepth + strapThickness * 2),
        aztecGoldMat
      );
      vStrap.position.set(xPos, bHeight / 2, 0);
      baseGroup.add(vStrap);

      // Gold Rivets / Studs along the front and back of each strap
      [-0.65, 0, 0.65].forEach((yOffset) => {
        const rivetGeo = new THREE.SphereGeometry(0.065, 12, 12);
        // Front rivet
        const frontRivet = new THREE.Mesh(rivetGeo, aztecGoldMat);
        frontRivet.position.set(xPos, bHeight / 2 + yOffset, bDepth / 2 + 0.06);
        baseGroup.add(frontRivet);
        // Back rivet
        const backRivet = new THREE.Mesh(rivetGeo, aztecGoldMat);
        backRivet.position.set(xPos, bHeight / 2 + yOffset, -bDepth / 2 - 0.06);
        baseGroup.add(backRivet);
      });
    });

    // Heavy Forged Corner Brackets on all 4 bottom corners
    const cornerPositions = [
      [-bWidth / 2, -bDepth / 2],
      [bWidth / 2, -bDepth / 2],
      [-bWidth / 2, bDepth / 2],
      [bWidth / 2, bDepth / 2],
    ];

    cornerPositions.forEach(([cx, cz]) => {
      const cornerBracket = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.65, 0.32),
        darkIronMat
      );
      cornerBracket.position.set(cx, 0.35, cz);
      baseGroup.add(cornerBracket);
    });

    // Heavy Brass Drop Ring Handles on Left & Right sides
    [-1, 1].forEach((dir) => {
      // Mounting plate
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.28, 0.12, 16),
        darkIronMat
      );
      plate.rotation.z = Math.PI / 2;
      plate.position.set(dir * (bWidth / 2 + 0.05), bHeight * 0.52, 0);
      baseGroup.add(plate);

      // Hanging Heavy Torus Ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.085, 16, 24),
        aztecGoldMat
      );
      ring.rotation.y = Math.PI / 2;
      ring.rotation.x = 0.32;
      ring.position.set(dir * (bWidth / 2 + 0.18), bHeight * 0.42, 0);
      baseGroup.add(ring);
    });

    // --- TREASURE CONTENTS (VISIBLE ONLY WHEN OPEN) ---
    const treasurePile = new THREE.Group();
    treasurePile.position.set(0, bHeight - 0.9, 0);
    treasurePile.visible = isOpen;
    treasurePileRef.current = treasurePile;
    baseGroup.add(treasurePile);

    // Mounded Pile of Aztec Gold Doubloons
    const coinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 14);
    for (let c = 0; c < 55; c++) {
      const coin = new THREE.Mesh(coinGeo, aztecGoldMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.65;
      const heightOffset = Math.sin((1 - radius / 1.8) * Math.PI * 0.5) * 0.45;
      coin.position.set(
        Math.cos(angle) * radius,
        heightOffset + (Math.random() - 0.5) * 0.08,
        Math.sin(angle) * (radius * 0.65)
      );
      coin.rotation.set(
        (Math.random() - 0.5) * 0.45,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.45
      );
      treasurePile.add(coin);
    }

    // Cut Sparkling Gemstones (Rubies & Emeralds)
    const gemGeo = new THREE.OctahedronGeometry(0.22);
    for (let g = 0; g < 10; g++) {
      const gem = new THREE.Mesh(gemGeo, g % 2 === 0 ? rubyMat : emeraldMat);
      gem.position.set(
        (Math.random() - 0.5) * 2.8,
        0.35 + Math.random() * 0.25,
        (Math.random() - 0.5) * 1.6
      );
      gem.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      treasurePile.add(gem);
    }

    // Glowing Aztec Talisman in center
    const talisman = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24),
      aztecGoldMat
    );
    talisman.position.set(0, 0.5, 0.2);
    talisman.rotation.x = -0.3;
    treasurePile.add(talisman);

    // --- HINGED 3D BARREL CHEST LID (PARAMETRIC ARCH - 100% PERFECT FIT, ZERO EULER GLITCHES) ---
    // The hinge pivot sits at the back top edge: y = bHeight, z = -bDepth / 2
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, bHeight, -bDepth / 2);
    chestGroup.add(lidPivot);
    lidGroupRef.current = lidPivot;

    const lidRadius = bDepth / 2; // 1.6

    // 1. Procedural Arched Wooden Lid Vault with Solid Endcaps
    const lidGeom = createLidVaultGeometry(bWidth, lidRadius, 32, true);
    const lidMesh = new THREE.Mesh(lidGeom, woodMat);
    // Position the vault center forward at z = lidRadius (bDepth / 2)
    lidMesh.position.set(0, 0, lidRadius);
    lidMesh.castShadow = true;
    lidPivot.add(lidMesh);

    // 2. Arched Aztec Gold Metal Straps Over the Curved Lid
    bandXPositions.forEach((xPos) => {
      const strapGeom = createLidVaultGeometry(strapWidth, lidRadius + 0.035, 32, false);
      const strapMesh = new THREE.Mesh(strapGeom, aztecGoldMat);
      strapMesh.position.set(xPos, 0, lidRadius);
      lidPivot.add(strapMesh);

      // Gold Rivets along the curved strap arch
      for (let angle = 0.25; angle < Math.PI - 0.2; angle += 0.55) {
        const rivet = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 10, 10),
          aztecGoldMat
        );
        const yPos = Math.sin(angle) * (lidRadius + 0.05);
        const zPos = lidRadius + Math.cos(angle) * (lidRadius + 0.05);
        rivet.position.set(xPos, yPos, zPos);
        lidPivot.add(rivet);
      }
    });

    // 3. Lower Front Lip Rim of the Lid
    const lidFrontLip = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth + 0.12, 0.14, 0.14),
      aztecGoldMat
    );
    lidFrontLip.position.set(0, 0.07, bDepth);
    lidPivot.add(lidFrontLip);

    // 4. Heavy Davy Jones Lock Hasp Hanging Over Front Lip
    const haspPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.95, 0.14),
      aztecGoldMat
    );
    haspPlate.position.set(0, -0.25, bDepth + 0.08);
    lidPivot.add(haspPlate);

    // Lock Skull / Kraken Emblem on the Hasp
    const skullEmblem = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      darkIronMat
    );
    skullEmblem.scale.set(1, 1.25, 0.55);
    skullEmblem.position.set(0, -0.27, bDepth + 0.18);
    lidPivot.add(skullEmblem);

    // Glowing Keyhole / Cursed Soul Core on Trunk
    const lockBacking = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.05, 0.12),
      darkIronMat
    );
    lockBacking.position.set(0, bHeight - 0.55, bDepth / 2 + 0.08);
    baseGroup.add(lockBacking);

    const keyholeGem = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 14, 14),
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xff9900,
        emissiveIntensity: 0.9,
        metalness: 0.8,
        roughness: 0.15,
      })
    );
    keyholeGem.position.set(0, bHeight - 0.55, bDepth / 2 + 0.18);
    baseGroup.add(keyholeGem);

    // --- 6. FLOATING GOLDEN EMBER PARTICLES ---
    const pCount = 35;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pVelocities = [];

    for (let p = 0; p < pCount; p++) {
      pPositions[p * 3] = (Math.random() - 0.5) * 5.0;
      pPositions[p * 3 + 1] = 1.0 + Math.random() * 4.0;
      pPositions[p * 3 + 2] = (Math.random() - 0.5) * 4.0;
      pVelocities.push({
        y: 0.012 + Math.random() * 0.02,
        swaySpeed: 1.5 + Math.random() * 2.0,
        swayAmp: 0.006 + Math.random() * 0.006,
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffe070,
      size: 0.2,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesRef.current = { points: particles, vels: pVelocities };

    // MOUSE PARALLAX / TOUCH TILT
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetRotation.current = {
        x: 0.22 - y * 0.2,
        y: -0.28 + x * 0.38,
      };
    };

    const handlePointerLeave = () => {
      targetRotation.current = { x: 0.22, y: -0.28 };
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave);

    // 7. ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animFrameId.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth hinge lid swing opening
      currentLidAngle.current += (targetLidAngle.current - currentLidAngle.current) * 0.1;
      if (lidGroupRef.current) {
        lidGroupRef.current.rotation.x = currentLidAngle.current;
      }

      // Hide treasure when lid is fully shut to ensure zero clip-through
      if (treasurePileRef.current) {
        treasurePileRef.current.visible = Math.abs(currentLidAngle.current) > 0.08;
      }

      // Smooth 3D gimbal tilt
      if (chestGroupRef.current) {
        chestGroupRef.current.rotation.x += (targetRotation.current.x - chestGroupRef.current.rotation.x) * 0.08;
        chestGroupRef.current.rotation.y += (targetRotation.current.y - chestGroupRef.current.rotation.y) * 0.08;

        // Realistic nautical sea bobbing
        chestGroupRef.current.position.y = -0.3 + Math.sin(elapsedTime * 1.6) * 0.06;
      }

      // Treasure Glow Intensity Dynamics
      if (treasureLightRef.current) {
        const isCurrentlyOpen = Math.abs(currentLidAngle.current) > 0.35;
        const targetIntensity = isCurrentlyOpen ? 7.0 + Math.sin(elapsedTime * 4) * 1.5 : 0;
        treasureLightRef.current.intensity += (targetIntensity - treasureLightRef.current.intensity) * 0.15;
      }

      // Floating Ember Particles
      if (particlesRef.current) {
        const { points, vels } = particlesRef.current;
        const posAttr = points.geometry.attributes.position;
        const isCurrentlyOpen = Math.abs(currentLidAngle.current) > 0.2;

        points.material.opacity = isCurrentlyOpen ? 0.95 : 0.25;

        for (let i = 0; i < pCount; i++) {
          let y = posAttr.getY(i);
          y += vels[i].y;
          if (y > 6.0) {
            y = 1.0;
            posAttr.setX(i, (Math.random() - 0.5) * 3.5);
            posAttr.setZ(i, (Math.random() - 0.5) * 2.5);
          }
          posAttr.setY(i, y);
          posAttr.setX(i, posAttr.getX(i) + Math.sin(elapsedTime * vels[i].swaySpeed) * vels[i].swayAmp);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="w-full h-64 sm:h-72 md:h-80 cursor-pointer select-none touch-none flex items-center justify-center"
      title="Click 3D Treasure Chest to Open / Reveal Plunder"
    />
  );
};

export default RealisticTreasureChest3DCanvas;
