import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Photorealistic 3D Pirate Treasure Chest using Three.js
 * Features authentic aged mahogany wood, forged Aztec gold bands, skull lock,
 * and realistic physical lid swinging open on hinges with glowing gold coins and jewel particles.
 */
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
  const coinsGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const targetLidAngle = useRef(0);
  const currentLidAngle = useRef(0);

  // Mouse tilt
  const mousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.25, y: -0.35 });

  useEffect(() => {
    targetLidAngle.current = isOpen ? -Math.PI * 0.62 : 0;
  }, [isOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 14.5);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.4);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xffe6a3, 3.5);
    mainSun.position.set(8, 12, 10);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    scene.add(mainSun);

    const blueOceanRim = new THREE.DirectionalLight(0x00d4ff, 1.8);
    blueOceanRim.position.set(-10, -3, -8);
    scene.add(blueOceanRim);

    // Inner Treasure Glow (PointLight inside the chest)
    const treasureGlow = new THREE.PointLight(0xffd700, isOpen ? 6 : 0, 12);
    treasureGlow.position.set(0, 1.5, 0);
    scene.add(treasureGlow);
    treasureLightRef.current = treasureGlow;

    // PROCEDURAL WOOD GRAIN TEXTURE
    const createWoodTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Base warm dark mahogany
      ctx.fillStyle = '#2b160a';
      ctx.fillRect(0, 0, 512, 512);

      // Wood plank stripes
      for (let y = 0; y < 512; y += 4) {
        const shade = Math.sin(y * 0.15) * 15 + Math.random() * 20;
        ctx.fillStyle = `rgba(20, 10, 4, ${0.15 + (shade / 255)})`;
        ctx.fillRect(0, y, 512, 3);
      }

      // Horizontal plank grooves
      ctx.fillStyle = '#100803';
      ctx.fillRect(0, 128, 512, 6);
      ctx.fillRect(0, 256, 512, 6);
      ctx.fillRect(0, 384, 512, 6);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const woodTexture = createWoodTexture();

    // MATERIALS
    const woodMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      color: 0x5c3314,
      roughness: 0.65,
      metalness: 0.1,
    });

    const innerWoodMat = new THREE.MeshStandardMaterial({
      color: 0x1f1007,
      roughness: 0.85,
      metalness: 0.05,
    });

    const aztecGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf5c33b,
      metalness: 0.9,
      roughness: 0.28,
      envMapIntensity: 1.5,
    });

    const darkIronMat = new THREE.MeshStandardMaterial({
      color: 0x221a15,
      metalness: 0.7,
      roughness: 0.45,
    });

    const rubyMat = new THREE.MeshStandardMaterial({
      color: 0xdd1133,
      metalness: 0.2,
      roughness: 0.15,
      emissive: 0x880011,
      emissiveIntensity: 0.4,
    });

    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x00cc66,
      metalness: 0.2,
      roughness: 0.15,
      emissive: 0x006622,
      emissiveIntensity: 0.4,
    });

    // MASTER CHEST GROUP
    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, -0.6, 0);
    scene.add(chestGroup);
    chestGroupRef.current = chestGroup;

    // --- 1. CHEST BASE (BOTTOM COMPARTMENT) ---
    const baseGroup = new THREE.Group();
    chestGroup.add(baseGroup);

    const baseWidth = 5.2;
    const baseHeight = 2.4;
    const baseDepth = 3.6;

    // Main Box Body
    const baseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth),
      woodMat
    );
    baseMesh.position.y = baseHeight / 2;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    baseGroup.add(baseMesh);

    // Hollow Top Inset (Carved out look)
    const innerPocket = new THREE.Mesh(
      new THREE.BoxGeometry(baseWidth - 0.5, 0.4, baseDepth - 0.5),
      innerWoodMat
    );
    innerPocket.position.y = baseHeight - 0.15;
    baseGroup.add(innerPocket);

    // Aztec Gold Metal Bands around Base
    const bandThickness = 0.08;
    const bandWidth = 0.42;

    // Front & Back vertical bands
    [-1.8, 0, 1.8].forEach((xPos) => {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(bandWidth, baseHeight + 0.04, baseDepth + bandThickness * 2),
        aztecGoldMat
      );
      band.position.set(xPos, baseHeight / 2, 0);
      baseGroup.add(band);

      // Gold Rivets along the band
      [-0.8, 0, 0.8].forEach((yOffset) => {
        const rivetGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const rivetFront = new THREE.Mesh(rivetGeo, aztecGoldMat);
        rivetFront.position.set(xPos, baseHeight / 2 + yOffset, baseDepth / 2 + 0.05);
        baseGroup.add(rivetFront);

        const rivetBack = new THREE.Mesh(rivetGeo, aztecGoldMat);
        rivetBack.position.set(xPos, baseHeight / 2 + yOffset, -baseDepth / 2 - 0.05);
        baseGroup.add(rivetBack);
      });
    });

    // Horizontal Rim Trims
    const topRim = new THREE.Mesh(
      new THREE.BoxGeometry(baseWidth + 0.12, 0.25, baseDepth + 0.12),
      aztecGoldMat
    );
    topRim.position.y = baseHeight - 0.1;
    baseGroup.add(topRim);

    const botRim = new THREE.Mesh(
      new THREE.BoxGeometry(baseWidth + 0.12, 0.25, baseDepth + 0.12),
      aztecGoldMat
    );
    botRim.position.y = 0.12;
    baseGroup.add(botRim);

    // Heavy Side Drop Handles (Brass Rings)
    [-1, 1].forEach((dir) => {
      const handleMount = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.28, 0.18, 12),
        darkIronMat
      );
      handleMount.rotation.z = Math.PI / 2;
      handleMount.position.set(dir * (baseWidth / 2 + 0.08), baseHeight * 0.55, 0);
      baseGroup.add(handleMount);

      const ringHandle = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.09, 12, 24),
        aztecGoldMat
      );
      ringHandle.rotation.y = Math.PI / 2;
      ringHandle.rotation.x = 0.4;
      ringHandle.position.set(dir * (baseWidth / 2 + 0.2), baseHeight * 0.45, 0);
      baseGroup.add(ringHandle);
    });

    // --- 2. CHEST TREASURE CONTENTS (COINS & GEMS) ---
    const coinsGroup = new THREE.Group();
    coinsGroup.position.set(0, baseHeight - 0.2, 0);
    baseGroup.add(coinsGroup);
    coinsGroupRef.current = coinsGroup;

    // Mound of Aztec Gold Coins
    const coinGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 12);
    for (let i = 0; i < 45; i++) {
      const coin = new THREE.Mesh(coinGeo, aztecGoldMat);
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 1.8;
      coin.position.set(
        Math.cos(angle) * r,
        Math.random() * 0.25 + (1 - r / 2.2) * 0.25,
        Math.sin(angle) * (r * 0.65)
      );
      coin.rotation.set(
        (Math.random() - 0.5) * 0.6,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.6
      );
      coinsGroup.add(coin);
    }

    // Cut Jewels (Rubies & Emeralds)
    const gemGeo = new THREE.OctahedronGeometry(0.24);
    for (let j = 0; j < 8; j++) {
      const gem = new THREE.Mesh(gemGeo, j % 2 === 0 ? rubyMat : emeraldMat);
      gem.position.set(
        (Math.random() - 0.5) * 3.2,
        0.35 + Math.random() * 0.2,
        (Math.random() - 0.5) * 1.8
      );
      gem.rotation.set(Math.random(), Math.random(), Math.random());
      coinsGroup.add(gem);
    }

    // --- 3. HINGED 3D CHEST LID ---
    // Pivot at back-top of chest base: z = -baseDepth / 2, y = baseHeight
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, baseHeight, -baseDepth / 2);
    chestGroup.add(lidPivot);
    lidGroupRef.current = lidPivot;

    const lidMeshGroup = new THREE.Group();
    // Offset so lid rests on top of base
    lidMeshGroup.position.set(0, 0, baseDepth / 2);
    lidPivot.add(lidMeshGroup);

    // Arched Lid Top (Half-cylinder)
    const lidRadius = baseDepth / 2;
    const lidArchGeo = new THREE.CylinderGeometry(
      lidRadius,
      lidRadius,
      baseWidth,
      24,
      1,
      false,
      0,
      Math.PI
    );
    const lidArch = new THREE.Mesh(lidArchGeo, woodMat);
    lidArch.rotation.z = Math.PI / 2;
    lidArch.rotation.y = Math.PI / 2;
    lidArch.castShadow = true;
    lidMeshGroup.add(lidArch);

    // Arched Lid Side Endcaps
    const endcapGeo = new THREE.CircleGeometry(lidRadius, 24, 0, Math.PI);
    [-1, 1].forEach((dir) => {
      const endcap = new THREE.Mesh(endcapGeo, woodMat);
      endcap.position.x = dir * (baseWidth / 2 + 0.02);
      endcap.rotation.y = (dir * Math.PI) / 2;
      lidMeshGroup.add(endcap);
    });

    // Curved Gold Straps on Lid
    [-1.8, 0, 1.8].forEach((xPos) => {
      const lidStrapGeo = new THREE.CylinderGeometry(
        lidRadius + 0.04,
        lidRadius + 0.04,
        bandWidth,
        24,
        1,
        false,
        0,
        Math.PI
      );
      const lidStrap = new THREE.Mesh(lidStrapGeo, aztecGoldMat);
      lidStrap.rotation.z = Math.PI / 2;
      lidStrap.rotation.y = Math.PI / 2;
      lidStrap.position.x = xPos;
      lidMeshGroup.add(lidStrap);
    });

    // Heavy Front Lock Hasp & Skull Latch
    const haspGeo = new THREE.BoxGeometry(0.65, 0.95, 0.18);
    const hasp = new THREE.Mesh(haspGeo, aztecGoldMat);
    hasp.position.set(0, -0.15, baseDepth / 2 + 0.1);
    lidMeshGroup.add(hasp);

    // Skull Keyhole Plate
    const skullBackGeo = new THREE.BoxGeometry(0.85, 1.1, 0.12);
    const skullBack = new THREE.Mesh(skullBackGeo, darkIronMat);
    skullBack.position.set(0, baseHeight - 0.45, baseDepth / 2 + 0.12);
    baseGroup.add(skullBack);

    // Glowing Keyhole Core
    const keyhole = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 0.8,
      })
    );
    keyhole.position.set(0, baseHeight - 0.45, baseDepth / 2 + 0.2);
    baseGroup.add(keyhole);

    // --- 4. FLOATING GOLD SPARKLE PARTICLES ---
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let p = 0; p < particleCount; p++) {
      positions[p * 3] = (Math.random() - 0.5) * 4.5;
      positions[p * 3 + 1] = 1.5 + Math.random() * 3.5;
      positions[p * 3 + 2] = (Math.random() - 0.5) * 3.5;
      velocities.push({
        y: 0.01 + Math.random() * 0.02,
        sway: Math.random() * Math.PI * 2,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe680,
      size: 0.18,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = { points: particles, vels: velocities };

    // MOUSE MOVE / TILT LISTENER
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current = { x, y };
      targetRotation.current = {
        x: 0.25 - y * 0.25,
        y: -0.35 + x * 0.45,
      };
    };

    container.addEventListener('mousemove', handleMouseMove);

    // ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lid rotation on hinges
      currentLidAngle.current += (targetLidAngle.current - currentLidAngle.current) * 0.12;
      if (lidGroupRef.current) {
        lidGroupRef.current.rotation.x = currentLidAngle.current;
      }

      // Smooth interactive 3D chest tilt
      if (chestGroupRef.current) {
        chestGroupRef.current.rotation.x += (targetRotation.current.x - chestGroupRef.current.rotation.x) * 0.08;
        chestGroupRef.current.rotation.y += (targetRotation.current.y - chestGroupRef.current.rotation.y) * 0.08;

        // Subtle idle breathing float
        chestGroupRef.current.position.y = -0.6 + Math.sin(elapsedTime * 1.8) * 0.08;
      }

      // Treasure Glow Intensity
      if (treasureLightRef.current) {
        const isOpenVal = Math.abs(currentLidAngle.current) > 0.4;
        const targetIntensity = isOpenVal ? 5.5 + Math.sin(elapsedTime * 4) * 1.5 : 0;
        treasureLightRef.current.intensity += (targetIntensity - treasureLightRef.current.intensity) * 0.15;
      }

      // Floating Particles
      if (particlesRef.current) {
        const { points, vels } = particlesRef.current;
        const posAttr = points.geometry.attributes.position;
        const isOpenVal = Math.abs(currentLidAngle.current) > 0.2;

        points.material.opacity = isOpenVal ? 0.9 : 0.2;

        for (let i = 0; i < particleCount; i++) {
          let y = posAttr.getY(i);
          y += vels[i].y;
          if (y > 6) {
            y = 1.6;
            posAttr.setX(i, (Math.random() - 0.5) * 3);
            posAttr.setZ(i, (Math.random() - 0.5) * 2);
          }
          posAttr.setY(i, y);
          posAttr.setX(i, posAttr.getX(i) + Math.sin(elapsedTime * 2 + vels[i].sway) * 0.005);
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
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="w-full h-56 sm:h-64 cursor-pointer select-none touch-none"
      title="Click 3D Treasure Chest to Open"
    />
  );
};

export default RealisticTreasureChest3DCanvas;
