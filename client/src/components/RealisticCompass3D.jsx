import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { playLaserBlip } from '../utils/cyberSound';
import { Compass, Sparkles } from 'lucide-react';

/**
 * Procedurally generates a high-resolution antique nautical astrolabe dial texture
 * directly inspired by Captain Jack Sparrow's compass and navigational charts in the reference image.
 */
function createCompassDialTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;

  // 1. Weathered Antique Parchment & Aztec Gold Dial Background (Exact match to reference image)
  const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, size / 2);
  bgGrad.addColorStop(0, '#f7eed8');     // Luminous aged parchment center
  bgGrad.addColorStop(0.45, '#ebd8b0');  // Vintage nautical chart ivory
  bgGrad.addColorStop(0.72, '#c9a86b');  // Weathered antique brass transition
  bgGrad.addColorStop(0.88, '#6b4f24');  // Aged mahogany/leather ring
  bgGrad.addColorStop(1, '#231507');     // Deep antique casing shadow
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Subtle vintage parchment texture specks & aged vignette
  ctx.fillStyle = 'rgba(80, 50, 20, 0.04)';
  for (let i = 0; i < 300; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillRect(rx, ry, Math.random() * 3 + 1, Math.random() * 3 + 1);
  }

  // 2. Concentric Astrolabe Calculation Rings (from reference drawing)
  const ringDefs = [
    { r: 475, color: '#4a3212', width: 4 },
    { r: 462, color: '#8c6828', width: 2 },
    { r: 442, color: '#2d1e0c', width: 2.5 },
    { r: 418, color: '#a67c2e', width: 1.5 },
    { r: 375, color: '#593e15', width: 1.5, dash: [8, 6] },
    { r: 320, color: '#2b1d0b', width: 1.5 },
    { r: 250, color: 'rgba(74, 50, 18, 0.5)', width: 1.2, dash: [4, 4] },
    { r: 180, color: '#6b4c18', width: 1.5 },
    { r: 110, color: '#3b250c', width: 2 },
    { r: 65,  color: '#8c6828', width: 2.5 },
  ];

  ringDefs.forEach(({ r, color, width, dash }) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dash) ctx.setLineDash(dash);
    ctx.stroke();
    ctx.restore();
  });

  // 3. 360-Degree Graduation Tick Marks & Navigation Radials
  for (let deg = 0; deg < 360; deg += 1) {
    const rad = (deg * Math.PI) / 180;
    const isCardinal = deg % 90 === 0;
    const isMajor = deg % 30 === 0;
    const isMedium = deg % 10 === 0;
    const isMinor = deg % 2 === 0;

    let innerR = 442;
    if (isCardinal) innerR = 395;
    else if (isMajor) innerR = 412;
    else if (isMedium) innerR = 422;
    else if (isMinor) innerR = 432;
    else innerR = 436;

    const x1 = cx + Math.cos(rad) * 442;
    const y1 = cy + Math.sin(rad) * 442;
    const x2 = cx + Math.cos(rad) * innerR;
    const y2 = cy + Math.sin(rad) * innerR;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isCardinal ? '#1a1005' : isMajor ? '#3b250c' : '#735220';
    ctx.lineWidth = isCardinal ? 3.5 : isMajor ? 2.5 : 1.2;
    ctx.stroke();

    // Degree numbers at major marks
    if (isMajor && !isCardinal) {
      const textR = 385;
      const tx = cx + Math.cos(rad) * textR;
      const ty = cy + Math.sin(rad) * textR;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(rad + Math.PI / 2);
      ctx.fillStyle = '#2b1b08';
      ctx.font = 'bold 16px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${deg}°`, 0, 0);
      ctx.restore();
    }
  }

  // 4. Intricate Nautical Geometry / Astrolabe Chords (From user image)
  ctx.save();
  ctx.strokeStyle = 'rgba(74, 50, 18, 0.35)';
  ctx.lineWidth = 1;
  // Intersecting chords and star geometry
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 462, cy + Math.sin(angle) * 462);
    ctx.lineTo(cx - Math.cos(angle) * 462, cy - Math.sin(angle) * 462);
    ctx.stroke();
  }
  // Secondary astrological chord lines
  for (let i = 0; i < 16; i++) {
    const a1 = (i * Math.PI) / 8;
    const a2 = ((i + 5) * Math.PI) / 8;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a1) * 375, cy + Math.sin(a1) * 375);
    ctx.lineTo(cx + Math.cos(a2) * 375, cy + Math.sin(a2) * 375);
    ctx.strokeStyle = 'rgba(120, 80, 30, 0.18)';
    ctx.stroke();
  }
  ctx.restore();

  // 5. Cardinal Lettering (N, E, S, W) in ornate pirate script
  const cardinals = [
    { text: 'N', angle: -Math.PI / 2, color: '#160d03', size: 'bold 48px' },
    { text: 'E', angle: 0, color: '#2b1b08', size: 'bold 40px' },
    { text: 'S', angle: Math.PI / 2, color: '#160d03', size: 'bold 40px' },
    { text: 'W', angle: Math.PI, color: '#2b1b08', size: 'bold 40px' },
  ];

  cardinals.forEach(({ text, angle, color, size: fontSize }) => {
    const tx = cx + Math.cos(angle) * 345;
    const ty = cy + Math.sin(angle) * 345;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
    ctx.shadowBlur = 6;
    ctx.font = `${fontSize} "Cinzel Decorative", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    ctx.restore();
  });

  // 6. Fleur-de-lis / Nautical Spire Accents at North & Cardinals (from user image)
  const drawFleurDeLis = (x, y, scale = 1, rot = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#221506';
    ctx.beginPath();
    // Central petal
    ctx.moveTo(0, -26);
    ctx.bezierCurveTo(7, -18, 9, -6, 0, 4);
    ctx.bezierCurveTo(-9, -6, -7, -18, 0, -26);
    // Left petal
    ctx.moveTo(-2, -3);
    ctx.bezierCurveTo(-14, -10, -22, 2, -10, 8);
    ctx.bezierCurveTo(-4, 9, 0, 4, -2, -3);
    // Right petal
    ctx.moveTo(2, -3);
    ctx.bezierCurveTo(14, -10, 22, 2, 10, 8);
    ctx.bezierCurveTo(4, 9, 0, 4, 2, -3);
    ctx.fill();
    // Crossbar
    ctx.fillRect(-12, 5, 24, 3);
    ctx.restore();
  };

  drawFleurDeLis(cx, cy - 435, 0.75, 0);
  drawFleurDeLis(cx + 435, cy, 0.65, Math.PI / 2);
  drawFleurDeLis(cx, cy + 435, 0.65, Math.PI);
  drawFleurDeLis(cx - 435, cy, 0.65, -Math.PI / 2);

  // 7. Crimson Bloodline Calligraphy / Coordinates (Exact match to reference image!)
  ctx.save();
  ctx.strokeStyle = '#c9182b';
  ctx.lineWidth = 2.5;
  // Red vertical bloodline passing through North
  ctx.beginPath();
  ctx.moveTo(cx, 20);
  ctx.lineTo(cx, 460);
  ctx.stroke();

  // Fine crimson measurement ticks
  for (let y = 80; y <= 360; y += 30) {
    ctx.beginPath();
    ctx.moveTo(cx - 10, y);
    ctx.lineTo(cx + 10, y);
    ctx.stroke();
  }

  // Red coordinate bloodline splatters from reference image
  ctx.fillStyle = '#b51224';
  const bloodDrops = [
    { x: cx - 22, y: 140, r: 4.5 },
    { x: cx + 18, y: 220, r: 3.5 },
    { x: cx + 175, y: 280, r: 4 },
    { x: cx - 180, y: 340, r: 3.5 },
    { x: cx + 6, y: 440, r: 5 },
    { x: cx - 95, y: 520, r: 3.5 },
    { x: cx + 130, y: 610, r: 3 },
  ];
  bloodDrops.forEach((d) => {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 8. Nautical Inscriptions around Inner Astrolabe Ring
  ctx.save();
  ctx.fillStyle = '#1e1305';
  ctx.font = 'bold 14px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PORT: ESEC • LAT: 11.27° N • LON: 77.58° E', cx, cy + 195);
  ctx.fillText('EXPEDITION CODIENYCH 1.0', cx, cy - 195);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Builds the 3D multi-faceted compass rose needle (8-point star with 3D chiseled facets)
 */
function createFacetedNeedleGroup() {
  const needleGroup = new THREE.Group();

  // Gold Material for light facet (polished cursed Aztec gold)
  const goldFacetMat = new THREE.MeshStandardMaterial({
    color: 0xffdf33,
    metalness: 0.95,
    roughness: 0.15,
    side: THREE.DoubleSide,
  });

  // Darkened Antique Ebony / Steel Material for shadow facet (creates razor-sharp 3D ridge)
  const shadowFacetMat = new THREE.MeshStandardMaterial({
    color: 0x150f08,
    metalness: 0.85,
    roughness: 0.38,
    side: THREE.DoubleSide,
  });

  // Cyan / Steel Material for secondary points
  const cyanFacetMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    metalness: 0.9,
    roughness: 0.2,
    side: THREE.DoubleSide,
  });

  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x0b151e,
    metalness: 0.85,
    roughness: 0.38,
    side: THREE.DoubleSide,
  });

  /**
   * Helper to create a 3D chiseled diamond point with a raised center spine
   */
  const createSpire = (length, width, zPeak, isPrimary = true) => {
    const spireGroup = new THREE.Group();

    // Left facet geometry (P0: base left, P1: peak center, P2: tip)
    const leftGeom = new THREE.BufferGeometry();
    const leftVertices = new Float32Array([
      -width, 0, 0,
      0, 0, zPeak,
      0, length, 0,
    ]);
    leftGeom.setAttribute('position', new THREE.BufferAttribute(leftVertices, 3));
    leftGeom.computeVertexNormals();

    // Right facet geometry (P0: peak center, P1: base right, P2: tip)
    const rightGeom = new THREE.BufferGeometry();
    const rightVertices = new Float32Array([
      0, 0, zPeak,
      width, 0, 0,
      0, length, 0,
    ]);
    rightGeom.setAttribute('position', new THREE.BufferAttribute(rightVertices, 3));
    rightGeom.computeVertexNormals();

    const leftMesh = new THREE.Mesh(leftGeom, isPrimary ? goldFacetMat : cyanFacetMat);
    const rightMesh = new THREE.Mesh(rightGeom, isPrimary ? shadowFacetMat : darkSteelMat);

    spireGroup.add(leftMesh);
    spireGroup.add(rightMesh);

    return spireGroup;
  };

  // 1. North Spire (Longest, prominent spearhead from reference image)
  const northSpire = createSpire(2.38, 0.36, 0.32, true);
  needleGroup.add(northSpire);

  // 2. South Spire (Medium length)
  const southSpire = createSpire(1.8, 0.32, 0.26, true);
  southSpire.rotation.z = Math.PI;
  needleGroup.add(southSpire);

  // 3. East Spire
  const eastSpire = createSpire(1.95, 0.32, 0.26, true);
  eastSpire.rotation.z = -Math.PI / 2;
  needleGroup.add(eastSpire);

  // 4. West Spire
  const westSpire = createSpire(1.95, 0.32, 0.26, true);
  westSpire.rotation.z = Math.PI / 2;
  needleGroup.add(westSpire);

  // 5. Four Diagonal Secondary Spires (NE, SE, SW, NW)
  const diagAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  diagAngles.forEach((angle) => {
    const diagSpire = createSpire(1.38, 0.24, 0.2, false);
    diagSpire.rotation.z = angle;
    needleGroup.add(diagSpire);
  });

  // 6. Central Pierced Ring Ornament linking the spires
  const ringGeom = new THREE.TorusGeometry(0.7, 0.045, 16, 48);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.95,
    roughness: 0.18,
  });
  const innerRingMesh = new THREE.Mesh(ringGeom, ringMat);
  innerRingMesh.position.z = 0.08;
  needleGroup.add(innerRingMesh);

  return needleGroup;
}

const RealisticCompass3D = forwardRef(({ className = '', onStartSpin, onEmbark }, ref) => {
  const mountRef = useRef(null);
  const navigate = useNavigate();
  const [isSpinningFast, setIsSpinningFast] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Refs to hold Three.js animation targets
  const stateRef = useRef({
    needleGroup: null,
    compassContainer: null,
    dialMesh: null,
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    spinVelocity: 0.008,
    extraRotation: 0,
    isDestroyed: false,
  });

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let isDisposed = false;

    const width = currentMount.clientWidth || 320;
    const height = currentMount.clientHeight || 320;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    currentMount.appendChild(renderer.domElement);

    // 2. Realistic Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0xfffaed, 1.1);
    scene.add(ambientLight);

    // Main Golden Key Light (Top-Right)
    const keyLight = new THREE.DirectionalLight(0xfff0b3, 2.0);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    // Caribbean Cyan Secondary Light (Bottom-Left)
    const fillLight = new THREE.DirectionalLight(0x00e5ff, 1.0);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    // Central Aztec Jewel Point Light
    const corePointLight = new THREE.PointLight(0xffd700, 1.8, 8);
    corePointLight.position.set(0, 0, 1.2);
    scene.add(corePointLight);

    // 3. Master Compass Object Container (For 3D gimbal tilt & orientation)
    const compassContainer = new THREE.Group();
    scene.add(compassContainer);
    stateRef.current.compassContainer = compassContainer;

    // 4. Solid Antique Hammered Brass Backplate Casing
    const backPlateGeom = new THREE.CylinderGeometry(2.72, 2.65, 0.28, 64);
    const backPlateMat = new THREE.MeshStandardMaterial({
      color: 0x1f1408,
      metalness: 0.85,
      roughness: 0.35,
    });
    const backPlateMesh = new THREE.Mesh(backPlateGeom, backPlateMat);
    backPlateMesh.rotation.x = Math.PI / 2;
    backPlateMesh.position.z = -0.22;
    compassContainer.add(backPlateMesh);

    // Outer Chamfered Ring (Hollow open-ended bezel ring)
    const outerBezelGeom = new THREE.CylinderGeometry(2.68, 2.76, 0.35, 64, 1, true);
    const outerBezelMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.24,
      side: THREE.DoubleSide,
    });
    const outerBezelMesh = new THREE.Mesh(outerBezelGeom, outerBezelMat);
    outerBezelMesh.rotation.x = Math.PI / 2;
    outerBezelMesh.position.z = 0.02;
    compassContainer.add(outerBezelMesh);

    // Golden Bezel Trim Rim (Torus)
    const rimGeom = new THREE.TorusGeometry(2.7, 0.09, 24, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xffe680,
      metalness: 0.95,
      roughness: 0.16,
    });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    rimMesh.position.z = 0.12;
    compassContainer.add(rimMesh);

    // Decorative Aztec Gold Rivets around Bezel (16 rivets)
    const rivetGeom = new THREE.SphereGeometry(0.065, 16, 16);
    const rivetMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.18,
    });
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      const rivetMesh = new THREE.Mesh(rivetGeom, rivetMat);
      rivetMesh.position.x = Math.cos(angle) * 2.58;
      rivetMesh.position.y = Math.sin(angle) * 2.58;
      rivetMesh.position.z = 0.13;
      compassContainer.add(rivetMesh);
    }

    // Inner Dark Iron Bezel Inset
    const innerRimGeom = new THREE.CylinderGeometry(2.42, 2.42, 0.22, 64, 1, true);
    const innerRimMat = new THREE.MeshStandardMaterial({
      color: 0x14100b,
      metalness: 0.85,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const innerRimMesh = new THREE.Mesh(innerRimGeom, innerRimMat);
    innerRimMesh.rotation.x = Math.PI / 2;
    innerRimMesh.position.z = 0.08;
    compassContainer.add(innerRimMesh);

    // 5. Dial Face with Astrolabe Markings (High contrast parchment)
    const dialGeom = new THREE.CircleGeometry(2.4, 64);
    const dialTexture = createCompassDialTexture();
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      metalness: 0.0,
      roughness: 0.85,
      side: THREE.FrontSide,
    });
    const dialMesh = new THREE.Mesh(dialGeom, dialMat);
    dialMesh.position.z = 0.04;
    compassContainer.add(dialMesh);
    stateRef.current.dialMesh = dialMesh;

    // 6. 3D Faceted Star Needle Group
    const needleGroup = createFacetedNeedleGroup();
    needleGroup.position.z = 0.18;
    compassContainer.add(needleGroup);
    stateRef.current.needleGroup = needleGroup;

    // 7. Center Aztec Jewel / Pirate Compass Core (The tap target)
    const coreHubGeom = new THREE.CylinderGeometry(0.38, 0.46, 0.18, 32);
    const coreHubMat = new THREE.MeshStandardMaterial({
      color: 0xb8860b,
      metalness: 0.95,
      roughness: 0.2,
    });
    const coreHubMesh = new THREE.Mesh(coreHubGeom, coreHubMat);
    coreHubMesh.rotation.x = Math.PI / 2;
    coreHubMesh.position.z = 0.28;
    compassContainer.add(coreHubMesh);

    // Glowing Aztec Medallion Skull / Ruby Cap
    const gemGeom = new THREE.SphereGeometry(0.24, 32, 16);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xb35900,
      emissiveIntensity: 0.9,
      metalness: 0.85,
      roughness: 0.15,
    });
    const gemMesh = new THREE.Mesh(gemGeom, gemMat);
    gemMesh.scale.set(1, 1, 0.6);
    gemMesh.position.z = 0.35;
    compassContainer.add(gemMesh);

    // 8. Convex Glass Crystal Cover (Subtle glare on top of needle)
    const glassGeom = new THREE.CircleGeometry(2.4, 48);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      roughness: 0.1,
      metalness: 0.1,
    });
    const glassMesh = new THREE.Mesh(glassGeom, glassMat);
    glassMesh.position.z = 0.35;
    compassContainer.add(glassMesh);

    // Initial slight 3D angle
    compassContainer.rotation.x = 0.12;

    // 9. Interactive Parallax & Tilt Handling
    const handlePointerMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      // Tilt range: ~20 degrees for prominent 3D perspective
      stateRef.current.targetTiltX = -y * 0.35;
      stateRef.current.targetTiltY = x * 0.35;
    };

    const handlePointerLeave = () => {
      stateRef.current.targetTiltX = 0.08;
      stateRef.current.targetTiltY = 0;
    };

    currentMount.addEventListener('mousemove', handlePointerMove);
    currentMount.addEventListener('touchmove', handlePointerMove, { passive: true });
    currentMount.addEventListener('mouseleave', handlePointerLeave);

    // 10. Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;
      const state = stateRef.current;

      // Smooth Gimbal Floating / Nautical Ship Wave Oscillation
      const floatPitch = Math.sin(elapsedTime * 1.2) * 0.06;
      const floatRoll = Math.cos(elapsedTime * 0.9) * 0.06;

      state.currentTiltX += (state.targetTiltX + floatPitch - state.currentTiltX) * 0.08;
      state.currentTiltY += (state.targetTiltY + floatRoll - state.currentTiltY) * 0.08;

      if (state.compassContainer) {
        state.compassContainer.rotation.x = state.currentTiltX;
        state.compassContainer.rotation.y = state.currentTiltY;
      }

      // Continuous 3D Rotation ("thaana adhuve rotate aagura maari vei machi")
      // The dial and needles spin smoothly with nautical compass dynamics
      if (state.needleGroup) {
        // Jack Sparrow's compass has subtle hunting/seeking oscillations layered over continuous rotation
        const huntingWobble = Math.sin(elapsedTime * 2.5) * 0.04;
        state.needleGroup.rotation.z += state.spinVelocity + huntingWobble * 0.005;

        // Dial rotates subtly in counter-sync for rich multi-layered astrolabe feel
        if (state.dialMesh) {
          state.dialMesh.rotation.z -= state.spinVelocity * 0.25;
        }

        // Decay extra spin velocity if clicked
        if (state.spinVelocity > 0.008) {
          state.spinVelocity *= 0.985;
          if (state.spinVelocity < 0.008) state.spinVelocity = 0.008;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Responsive Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousemove', handlePointerMove);
      currentMount.removeEventListener('touchmove', handlePointerMove);
      currentMount.removeEventListener('mouseleave', handlePointerLeave);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handle click / tap on the compass (or center core or external trigger)
  const handleCompassClick = () => {
    if (isSpinningFast) return;
    playLaserBlip();
    setIsSpinningFast(true);
    if (onStartSpin) onStartSpin();

    // Boost spin velocity dramatically like Jack Sparrow's compass locking coordinates!
    if (stateRef.current) {
      stateRef.current.spinVelocity = 0.48;
    }

    // Small delay so user enjoys the rapid spin feedback, then navigates to next page (/portal)
    setTimeout(() => {
      if (onEmbark) {
        onEmbark();
      } else {
        navigate('/portal');
      }
    }, 550);
  };

  useImperativeHandle(ref, () => ({
    spinAndEmbark: handleCompassClick,
    spin: (velocity = 0.48) => {
      setIsSpinningFast(true);
      if (stateRef.current) {
        stateRef.current.spinVelocity = velocity;
      }
    },
    setHovered: (hovered) => {
      setIsHovered(hovered);
      if (hovered && stateRef.current && stateRef.current.spinVelocity <= 0.015) {
        stateRef.current.spinVelocity = 0.025;
      }
    },
  }));

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Mount Frame */}
      <div
        onClick={handleCompassClick}
        className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] cursor-pointer group flex items-center justify-center"
        title="Tap center to embark to Event Portal"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleCompassClick();
        }}
      >
        {/* Glowing Aztec Gold Aura behind the 3D compass */}
        <div
          className={`absolute inset-4 rounded-full bg-gradient-to-br from-[#ffd700]/25 via-[#ff9900]/15 to-[#00e5ff]/10 blur-2xl transition-all duration-500 pointer-events-none ${
            isHovered || isSpinningFast ? 'scale-115 opacity-100' : 'scale-95 opacity-60'
          }`}
        />

        {/* Pulsing Concentric Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-[#ffd700]/20 animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-2 rounded-full border border-[#00e5ff]/20 pointer-events-none" />

        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full relative z-10" />

        {/* Delicate Center Compass Aura (Unobtrusive) */}
        <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <div
            className={`w-8 h-8 rounded-full border border-[#ffd700]/70 pointer-events-none transition-all duration-300 ${
              isHovered ? 'scale-125 shadow-[0_0_15px_#ffd700]' : 'scale-100 shadow-[0_0_8px_rgba(255,215,0,0.4)]'
            }`}
          />
        </div>
      </div>

      {/* Interactive Helper Prompt Button directly below compass */}
      <button
        type="button"
        onClick={handleCompassClick}
        className="mt-1 sm:mt-2 group relative inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#1f1508]/90 via-[#2f1b0a]/90 to-[#1f1508]/90 border border-[#ffd700]/70 hover:border-[#ffd700] text-[#ffd700] hover:text-white shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:shadow-[0_0_30px_rgba(255,215,0,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer backdrop-blur-md"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
        <span className="font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase">
          TAP COMPASS TO EMBARK
        </span>
        <span className="font-mono text-[#00e5ff] text-xs">➔</span>
      </button>

      {/* Coordinate & Mode Sub-label */}
      <div className="mt-1 font-mono text-[10px] text-[#e5c158]/70 tracking-wider">
        <span>3D NAVIGATIONAL ASTROLABE // TAP TO SET SAIL</span>
      </div>
    </div>
  );
});
RealisticCompass3D.displayName = 'RealisticCompass3D';

export default RealisticCompass3D;
