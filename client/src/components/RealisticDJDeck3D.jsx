import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playVinylScratch, playLaserBlip } from '../utils/cyberSound';
import { Disc3, Volume2, Sparkles } from 'lucide-react';

/**
 * Procedurally generates a hyper-realistic 12" vinyl groove bump/normal texture
 * with run-in grooves, recorded track bands, track breaks, and lead-out spirals.
 */
function createVinylGroovesTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;

  // Base deep vinyl dark background
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, size, size);

  // Outer glossy lead-in lip
  ctx.beginPath();
  ctx.arc(cx, cy, 495, 0, Math.PI * 2);
  ctx.strokeStyle = '#282830';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Dense concentric micro-grooves
  // In vinyl records, track groups have fine grooves with slight density variations
  const minR = 190; // Just outside the center label
  const maxR = 485;

  ctx.lineWidth = 1;
  for (let r = minR; r <= maxR; r += 1.6) {
    // Introduce track separation gaps (quieter smoother areas between songs)
    const isTrackBreak = (r > 270 && r < 278) || (r > 360 && r < 368) || (r > 430 && r < 436);
    
    if (isTrackBreak) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#18181f';
      ctx.stroke();
    } else {
      const alpha = 0.08 + (Math.sin(r * 0.4) * 0.04) + (Math.random() * 0.05);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(220, 220, 235, ${alpha})`;
      ctx.stroke();
    }
  }

  // Authentic 2-blade anisotropic radial sheen (the distinctive bow-tie light reflection on vinyl!)
  const sheenGrad1 = ctx.createConicGradient(Math.PI / 4, cx, cy);
  sheenGrad1.addColorStop(0, 'rgba(255, 255, 255, 0)');
  sheenGrad1.addColorStop(0.12, 'rgba(255, 255, 255, 0.09)');
  sheenGrad1.addColorStop(0.25, 'rgba(255, 255, 255, 0)');
  sheenGrad1.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  sheenGrad1.addColorStop(0.62, 'rgba(255, 255, 255, 0.09)');
  sheenGrad1.addColorStop(0.75, 'rgba(255, 255, 255, 0)');
  sheenGrad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheenGrad1;
  ctx.beginPath();
  ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
  ctx.fill();

  // Run-out spiral groove etched into center
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 8; a += 0.05) {
    const spiralR = 210 - (a * 2.5);
    if (spiralR < 185) break;
    const sx = cx + Math.cos(a) * spiralR;
    const sy = cy + Math.sin(a) * spiralR;
    if (a === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.strokeStyle = 'rgba(200, 200, 220, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates fallback procedural gold Aztec skull label if logo is loading
 */
function createFallbackLabelTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 250);
  grad.addColorStop(0, '#ffd700');
  grad.addColorStop(0.7, '#c99718');
  grad.addColorStop(1, '#6b4f0b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 240, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#08080a';
  ctx.font = 'bold 36px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CODIENYCH', cx, cy - 40);
  ctx.font = 'bold 26px "Cinzel", Georgia, serif';
  ctx.fillText('1.0 PIRATES', cx, cy + 30);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const RealisticDJDeck3D = ({ bassPulsing = false, activeSoundFx = null, onTriggerSound, className = '' }) => {
  const mountRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [rpmDisplay, setRpmDisplay] = useState('33 ⅓');
  const [isHovered, setIsHovered] = useState(false);

  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    deckContainer: null,
    vinylGroup: null,
    tonearmGroup: null,
    clubSpotLight: null,
    stylusLight: null,
    spinSpeed: 0.022,
    baseSpinSpeed: 0.022,
    targetRotation: 0,
    currentRotation: 0,
    targetTiltX: 0.42, // Default isometric 3D pitch angle
    targetTiltY: 0,
    currentTiltX: 0.42,
    currentTiltY: 0,
    isDragging: false,
    lastMouseX: 0,
    isDisposed: false,
    bassIntensity: 0,
  });

  // Watch for external sound FX pulses to dynamically accelerate spin & lighting
  useEffect(() => {
    if (bassPulsing) {
      stateRef.current.spinSpeed = 0.065;
      stateRef.current.bassIntensity = 1.0;
    } else {
      stateRef.current.spinSpeed = stateRef.current.baseSpinSpeed;
      stateRef.current.bassIntensity = 0;
    }
  }, [bassPulsing]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let isDisposed = false;
    const width = currentMount.clientWidth || 360;
    const height = currentMount.clientHeight || 360;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    stateRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.8);
    camera.lookAt(0, 0, 0);
    stateRef.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    currentMount.appendChild(renderer.domElement);
    stateRef.current.renderer = renderer;

    // 2. Club Stage Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfffaed, 0.9);
    scene.add(ambientLight);

    // Warm Aztec Gold Key Light (Top-Right Front)
    const goldKeyLight = new THREE.DirectionalLight(0xffe899, 2.2);
    goldKeyLight.position.set(3.5, 6, 4);
    scene.add(goldKeyLight);

    // Neon Caribbean Cyan Rim Light (Left-Back)
    const cyanRimLight = new THREE.DirectionalLight(0x00e5ff, 1.6);
    cyanRimLight.position.set(-4, 3, -2);
    scene.add(cyanRimLight);

    // Purple/Magenta Club Fill Light (Bottom-Right)
    const purpleFillLight = new THREE.DirectionalLight(0xbb44ff, 1.2);
    purpleFillLight.position.set(3, -2, 2);
    scene.add(purpleFillLight);

    // Dynamic Pulsing Center Club Spotlight
    const clubSpotLight = new THREE.PointLight(0xffd700, 2.0, 10);
    clubSpotLight.position.set(0, 2.5, 0.5);
    scene.add(clubSpotLight);
    stateRef.current.clubSpotLight = clubSpotLight;

    // 3. Master Turntable Group (Contains entire deck for 3D tilt & parallax)
    const deckContainer = new THREE.Group();
    scene.add(deckContainer);
    stateRef.current.deckContainer = deckContainer;

    // -------------------------------------------------------------
    // A. TURNTABLE BASE CHASSIS (PLINTH)
    // -------------------------------------------------------------
    // Heavy brushed obsidian & Caribbean dark mahogany body
    const plinthGeom = new THREE.BoxGeometry(4.8, 0.32, 4.8);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f16,
      metalness: 0.82,
      roughness: 0.32,
    });
    const plinthMesh = new THREE.Mesh(plinthGeom, plinthMat);
    plinthMesh.position.y = -0.16;
    deckContainer.add(plinthMesh);

    // Gold Aztec Chassis Bevel Trim Frame
    const trimGeom = new THREE.BoxGeometry(4.86, 0.05, 4.86);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18,
    });
    const trimMesh = new THREE.Mesh(trimGeom, trimMat);
    trimMesh.position.y = 0.01;
    deckContainer.add(trimMesh);

    // 4 Heavy Gold Plated Anti-Vibration Isolation Feet
    const footGeom = new THREE.CylinderGeometry(0.28, 0.38, 0.22, 24);
    const footMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.2,
    });
    const footPositions = [
      [-2.1, -0.38, -2.1],
      [2.1, -0.38, -2.1],
      [-2.1, -0.38, 2.1],
      [2.1, -0.38, 2.1],
    ];
    footPositions.forEach(([fx, fy, fz]) => {
      const foot = new THREE.Mesh(footGeom, footMat);
      foot.position.set(fx, fy, fz);
      deckContainer.add(foot);
    });

    // Deck Surface Controls (Tactile Buttons & Pitch Fader)
    // 1. Power / Strobe Tower (Top Left)
    const strobeTowerGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.45, 24);
    const strobeTowerMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
    });
    const strobeTower = new THREE.Mesh(strobeTowerGeom, strobeTowerMat);
    strobeTower.position.set(-1.9, 0.24, -1.8);
    deckContainer.add(strobeTower);

    // Strobe Window Glow
    const strobeLightGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const strobeLightMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
    const strobeLight = new THREE.Mesh(strobeLightGeom, strobeLightMat);
    strobeLight.position.set(-1.85, 0.38, -1.75);
    deckContainer.add(strobeLight);

    // 2. Play / Stop Button (Bottom Left)
    const playBtnGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 32);
    const playBtnMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.2,
    });
    const playBtn = new THREE.Mesh(playBtnGeom, playBtnMat);
    playBtn.position.set(-1.9, 0.06, 1.8);
    deckContainer.add(playBtn);

    // 33 & 45 RPM Buttons
    const rpmBtnGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24);
    const rpmBtnMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x0088aa,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.3,
    });
    const rpm33Btn = new THREE.Mesh(rpmBtnGeom, rpmBtnMat);
    rpm33Btn.position.set(-1.4, 0.05, 1.85);
    deckContainer.add(rpm33Btn);

    const rpm45Btn = new THREE.Mesh(rpmBtnGeom, playBtnMat);
    rpm45Btn.position.set(-1.1, 0.05, 1.85);
    deckContainer.add(rpm45Btn);

    // Pitch Fader Track & Golden Fader Knob (Bottom Right)
    const faderTrackGeom = new THREE.BoxGeometry(0.18, 0.02, 1.4);
    const faderTrackMat = new THREE.MeshStandardMaterial({ color: 0x05070a, metalness: 0.5, roughness: 0.6 });
    const faderTrack = new THREE.Mesh(faderTrackGeom, faderTrackMat);
    faderTrack.position.set(1.95, 0.03, 0.8);
    deckContainer.add(faderTrack);

    const faderKnobGeom = new THREE.BoxGeometry(0.24, 0.1, 0.14);
    const faderKnobMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.15 });
    const faderKnob = new THREE.Mesh(faderKnobGeom, faderKnobMat);
    faderKnob.position.set(1.95, 0.08, 0.8);
    deckContainer.add(faderKnob);

    // -------------------------------------------------------------
    // B. HEAVY MACHINED PLATTER WITH STROBE DOTS
    // -------------------------------------------------------------
    const platterGeom = new THREE.CylinderGeometry(1.88, 1.88, 0.12, 64);
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0xc8cdd4, // Cast aluminum platter
      metalness: 0.92,
      roughness: 0.22,
    });
    const platterMesh = new THREE.Mesh(platterGeom, platterMat);
    platterMesh.position.set(-0.25, 0.08, 0);
    deckContainer.add(platterMesh);

    // Beveled Strobe Rim around Platter
    const strobeRimGeom = new THREE.TorusGeometry(1.89, 0.025, 16, 64);
    const strobeRimMat = new THREE.MeshStandardMaterial({
      color: 0x22262c,
      metalness: 0.85,
      roughness: 0.4,
    });
    const strobeRim = new THREE.Mesh(strobeRimGeom, strobeRimMat);
    strobeRim.rotation.x = Math.PI / 2;
    strobeRim.position.set(-0.25, 0.12, 0);
    deckContainer.add(strobeRim);

    // -------------------------------------------------------------
    // C. 3D SPINNING VINYL RECORD GROUP
    // -------------------------------------------------------------
    const vinylGroup = new THREE.Group();
    vinylGroup.position.set(-0.25, 0.16, 0);
    deckContainer.add(vinylGroup);
    stateRef.current.vinylGroup = vinylGroup;

    // 1. High Gloss Vinyl Disc Body
    const vinylGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.03, 64);
    const groovesTexture = createVinylGroovesTexture();
    const vinylMat = new THREE.MeshStandardMaterial({
      color: 0x09090c,
      metalness: 0.72,
      roughness: 0.18,
      bumpMap: groovesTexture,
      bumpScale: 0.008,
    });
    const vinylDiscMesh = new THREE.Mesh(vinylGeom, vinylMat);
    vinylGroup.add(vinylDiscMesh);

    // Outer Vinyl Edge Lip
    const edgeLipGeom = new THREE.TorusGeometry(1.8, 0.015, 16, 64);
    const edgeLipMat = new THREE.MeshStandardMaterial({
      color: 0x14141a,
      metalness: 0.8,
      roughness: 0.25,
    });
    const edgeLip = new THREE.Mesh(edgeLipGeom, edgeLipMat);
    edgeLip.rotation.x = Math.PI / 2;
    edgeLip.position.y = 0.015;
    vinylGroup.add(edgeLip);

    // -------------------------------------------------------------
    // D. CENTER EVENT LOGO (CODIENYCH 1.0 OFFICIAL ROUND CREST)
    // -------------------------------------------------------------
    const fallbackTexture = createFallbackLabelTexture();
    const labelGeom = new THREE.CircleGeometry(0.68, 64);
    const labelMat = new THREE.MeshStandardMaterial({
      map: fallbackTexture,
      roughness: 0.28,
      metalness: 0.12,
      side: THREE.DoubleSide,
    });

    const labelMesh = new THREE.Mesh(labelGeom, labelMat);
    labelMesh.rotation.x = -Math.PI / 2; // Flat on top face of vinyl
    labelMesh.position.y = 0.018; // Slightly above vinyl surface
    vinylGroup.add(labelMesh);

    // Load the official circular event logo texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/codienych-logo-round.png',
      (logoTex) => {
        if (isDisposed) return;
        logoTex.colorSpace = THREE.SRGBColorSpace;
        logoTex.anisotropy = 8;
        logoTex.needsUpdate = true;
        labelMat.map = logoTex;
        labelMat.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('[3D Vinyl] Fallback label used:', err);
      }
    );

    // Raised Aztec Gold Bezel Rim around the Event Logo
    const logoBezelGeom = new THREE.TorusGeometry(0.69, 0.025, 16, 64);
    const logoBezelMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.15,
    });
    const logoBezel = new THREE.Mesh(logoBezelGeom, logoBezelMat);
    logoBezel.rotation.x = Math.PI / 2;
    logoBezel.position.y = 0.02;
    vinylGroup.add(logoBezel);

    // Center Spindle Hole & Gleaming Chrome Spindle Pin
    const spindleGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.28, 32);
    const spindleMat = new THREE.MeshStandardMaterial({
      color: 0xfffae0, // High-gloss polished chrome/gold
      metalness: 0.98,
      roughness: 0.08,
    });
    const spindle = new THREE.Mesh(spindleGeom, spindleMat);
    spindle.position.y = 0.12;
    vinylGroup.add(spindle);

    // -------------------------------------------------------------
    // E. REALISTIC 3D TONEARM & STYLUS CARTRIDGE ASSEMBLY
    // -------------------------------------------------------------
    const tonearmGroup = new THREE.Group();
    tonearmGroup.position.set(1.65, 0.15, -1.2);
    deckContainer.add(tonearmGroup);
    stateRef.current.tonearmGroup = tonearmGroup;

    // Tonearm Gimbal Pivot Base (Heavy Gold/Black Bearing)
    const baseCylinderGeom = new THREE.CylinderGeometry(0.32, 0.38, 0.25, 32);
    const baseCylinderMat = new THREE.MeshStandardMaterial({
      color: 0x141a24,
      metalness: 0.9,
      roughness: 0.25,
    });
    const baseCylinder = new THREE.Mesh(baseCylinderGeom, baseCylinderMat);
    baseCylinder.position.y = 0.1;
    tonearmGroup.add(baseCylinder);

    const goldGimbalRingGeom = new THREE.TorusGeometry(0.33, 0.03, 16, 32);
    const goldGimbalRingMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.15,
    });
    const goldGimbalRing = new THREE.Mesh(goldGimbalRingGeom, goldGimbalRingMat);
    goldGimbalRing.rotation.x = Math.PI / 2;
    goldGimbalRing.position.y = 0.16;
    tonearmGroup.add(goldGimbalRing);

    // Anti-Skating Dial and Height Adjuster
    const dialGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16);
    const dialMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
    const dial = new THREE.Mesh(dialGeom, dialMat);
    dial.position.set(-0.22, 0.18, 0.15);
    tonearmGroup.add(dial);

    // Pivot Horizontal Arm Gimbal (Rotates the needle across the record)
    const armPivotGroup = new THREE.Group();
    armPivotGroup.position.set(0, 0.28, 0);
    tonearmGroup.add(armPivotGroup);

    // Rear Counterweight (Weighted Aztec Gold Cylinder)
    const weightGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.24, 24);
    const weightMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.2,
    });
    const counterWeight = new THREE.Mesh(weightGeom, weightMat);
    counterWeight.rotation.x = Math.PI / 2;
    counterWeight.position.set(0.1, 0, -0.4);
    armPivotGroup.add(counterWeight);

    // S-Shaped Classic Audiophile Chrome Tonearm Tube
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.02, -0.3),
      new THREE.Vector3(0, 0.02, 0),
      new THREE.Vector3(-0.35, 0.01, 0.8),
      new THREE.Vector3(-0.65, -0.04, 1.6),
      new THREE.Vector3(-0.95, -0.09, 2.25),
    ]);
    const armTubeGeom = new THREE.TubeGeometry(armCurve, 32, 0.032, 12, false);
    const armTubeMat = new THREE.MeshStandardMaterial({
      color: 0xf5f7fa, // Gleaming polished chrome arm
      metalness: 0.98,
      roughness: 0.08,
    });
    const armTube = new THREE.Mesh(armTubeGeom, armTubeMat);
    armPivotGroup.add(armTube);

    // Pioneer / Ortofon Concorde DJ Cartridge & Headshell (Angled onto Vinyl)
    const cartridgeGeom = new THREE.BoxGeometry(0.12, 0.1, 0.32);
    const cartridgeMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff, // Caribbean electric cyan cartridge
      metalness: 0.85,
      roughness: 0.25,
    });
    const cartridge = new THREE.Mesh(cartridgeGeom, cartridgeMat);
    cartridge.position.set(-0.95, -0.1, 2.38);
    cartridge.rotation.y = -0.32;
    cartridge.rotation.x = 0.08;
    armPivotGroup.add(cartridge);

    // Precision Diamond Needle Tip touching the groove
    const needleGeom = new THREE.ConeGeometry(0.015, 0.06, 8);
    const needleMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1,
    });
    const needle = new THREE.Mesh(needleGeom, needleMat);
    needle.position.set(-0.98, -0.14, 2.48);
    needle.rotation.x = Math.PI;
    armPivotGroup.add(needle);

    // Stylus Target LED Glow illuminating the needle contact point
    const stylusLight = new THREE.PointLight(0x00e5ff, 1.4, 2.5);
    stylusLight.position.set(-0.95, -0.05, 2.4);
    armPivotGroup.add(stylusLight);
    stateRef.current.stylusLight = stylusLight;

    // Angle the tonearm so the stylus rests authentically on the outer groove of the record!
    armPivotGroup.rotation.y = 0.38;

    // -------------------------------------------------------------
    // F. ANIMATION LOOP & MOUSE PARALLAX
    // -------------------------------------------------------------
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth interpolation for 3D Deck Parallax tilt
      stateRef.current.currentTiltX += (stateRef.current.targetTiltX - stateRef.current.currentTiltX) * 0.08;
      stateRef.current.currentTiltY += (stateRef.current.targetTiltY - stateRef.current.currentTiltY) * 0.08;

      if (deckContainer) {
        deckContainer.rotation.x = stateRef.current.currentTiltX;
        deckContainer.rotation.y = stateRef.current.currentTiltY;

        // Subtle sub-bass rumble vibration when bass drop is active!
        if (stateRef.current.bassIntensity > 0) {
          const rumble = Math.sin(elapsedTime * 45) * 0.012;
          deckContainer.position.y = rumble;
          if (platterMesh) platterMesh.position.y = 0.08 + rumble * 1.5;
        } else {
          deckContainer.position.y = 0;
          if (platterMesh) platterMesh.position.y = 0.08;
        }
      }

      // Smooth vinyl record rotation (RPM)
      if (vinylGroup && !stateRef.current.isDragging) {
        vinylGroup.rotation.y += stateRef.current.spinSpeed;
      }

      // Dynamic stage lighting pulse
      if (clubSpotLight) {
        if (stateRef.current.bassIntensity > 0) {
          clubSpotLight.intensity = 3.5 + Math.sin(elapsedTime * 20) * 1.5;
          clubSpotLight.color.setHex(Math.sin(elapsedTime * 10) > 0 ? 0xffd700 : 0x00e5ff);
        } else {
          clubSpotLight.intensity = 1.8 + Math.sin(elapsedTime * 3) * 0.4;
          clubSpotLight.color.setHex(0xffd700);
        }
      }

      if (stylusLight) {
        stylusLight.intensity = 1.2 + Math.sin(elapsedTime * 6) * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount || isDisposed) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      stateRef.current.isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      groovesTexture.dispose();
      fallbackTexture.dispose();
    };
  }, []);

  // Mouse Move Parallax Handler
  const handleMouseMove = (e) => {
    if (!mountRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Interactive 3D tilt
    stateRef.current.targetTiltX = 0.42 + y * 0.35;
    stateRef.current.targetTiltY = x * 0.45;

    // Drag scratch interaction
    if (stateRef.current.isDragging && stateRef.current.vinylGroup) {
      const deltaX = e.clientX - stateRef.current.lastMouseX;
      stateRef.current.vinylGroup.rotation.y += deltaX * 0.04;
      stateRef.current.lastMouseX = e.clientX;
    }
  };

  const handleMouseDown = (e) => {
    stateRef.current.isDragging = true;
    stateRef.current.lastMouseX = e.clientX;
    setIsScratching(true);
    playVinylScratch();
  };

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
    setIsScratching(false);
  };

  const handleToggleRpm = () => {
    playLaserBlip();
    if (rpmDisplay === '33 ⅓') {
      setRpmDisplay('45');
      stateRef.current.baseSpinSpeed = 0.038;
      stateRef.current.spinSpeed = 0.038;
    } else {
      setRpmDisplay('33 ⅓');
      stateRef.current.baseSpinSpeed = 0.022;
      stateRef.current.spinSpeed = 0.022;
    }
  };

  const handleTapScratch = () => {
    playVinylScratch();
    if (stateRef.current.vinylGroup) {
      stateRef.current.vinylGroup.rotation.y -= 0.6;
    }
    setIsScratching(true);
    setTimeout(() => setIsScratching(false), 200);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        stateRef.current.targetTiltX = 0.42;
        stateRef.current.targetTiltY = 0;
        stateRef.current.isDragging = false;
        setIsScratching(false);
      }}
    >
      {/* 3D Canvas Mount Container */}
      <div
        ref={mountRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleTapScratch}
        className="w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 relative cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        {/* Luminous Aztec Gold & Club Glow Aura behind 3D Deck */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#ffd700]/25 via-cyan-500/15 to-purple-600/25 blur-2xl pointer-events-none -z-10 animate-pulse" />

        {/* Scratching Active HUD Notification */}
        {isScratching && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#050b12]/90 border border-cyan-400/80 px-3 py-1 rounded-full text-[10px] font-cinzel text-cyan-300 tracking-widest font-bold shadow-[0_0_15px_rgba(0,229,255,0.5)] animate-bounce pointer-events-none z-30 flex items-center space-x-1">
            <span>⚡ DJ SCRATCHING ACTIVE</span>
          </div>
        )}
      </div>

      {/* Interactive Deck Telemetry Pill Bar */}
      <div className="flex items-center space-x-3 mt-1 bg-[#060c14]/90 border border-[#ffd700]/30 rounded-full px-4 py-1.5 shadow-[0_0_15px_rgba(0,0,0,0.6)] text-xs font-cinzel">
        <button
          onClick={handleToggleRpm}
          title="Switch Vinyl Speed"
          className="flex items-center space-x-1 text-[#ffd700] hover:text-white transition-colors font-bold group"
        >
          <Disc3 className="w-3.5 h-3.5 text-[#ffd700] group-hover:rotate-180 transition-transform duration-500" />
          <span>SPEED: <span className="text-cyan-300 font-mono">{rpmDisplay} RPM</span></span>
        </button>

        <span className="text-gray-600">•</span>

        <button
          onClick={handleTapScratch}
          className="flex items-center space-x-1 text-cyan-300 hover:text-white transition-colors font-bold"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>CLICK / DRAG TO SCRATCH</span>
        </button>
      </div>
    </div>
  );
};

export default RealisticDJDeck3D;
