import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Compass, Sparkles, Navigation, ArrowRight, Eye, Swords } from 'lucide-react';
import { playLaserBlip } from '../utils/cyberSound';

const PiratesCompass3dCanvas = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [isHoveredCenter, setIsHoveredCenter] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02060c, 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 22, 28);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.2);
    scene.add(ambientLight);

    const warmLight = new THREE.DirectionalLight(0xffdf88, 3.2);
    warmLight.position.set(15, 30, 20);
    warmLight.castShadow = true;
    scene.add(warmLight);

    const blueRimLight = new THREE.PointLight(0x00e5ff, 4, 40);
    blueRimLight.position.set(-18, 8, -15);
    scene.add(blueRimLight);

    const goldCoreLight = new THREE.PointLight(0xffd700, 5, 25);
    goldCoreLight.position.set(0, 6, 0);
    scene.add(goldCoreLight);

    // Master Compass Group
    const compassGroup = new THREE.Group();
    compassGroup.position.set(0, -1, 0);
    scene.add(compassGroup);

    // -------------------------------------------------------------
    // 1. Jack Sparrow's Wooden & Weathered Brass Outer Box / Casing
    // -------------------------------------------------------------
    // Octagonal Outer Base Casing
    const boxGeo = new THREE.CylinderGeometry(13.2, 13.8, 3.2, 8);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x1f140a, // Dark distressed mahogany wood
      roughness: 0.7,
      metalness: 0.15,
    });
    const box = new THREE.Mesh(boxGeo, woodMat);
    box.receiveShadow = true;
    box.castShadow = true;
    box.position.y = -1.6;
    compassGroup.add(box);

    // Antique Brass Inlay Border & Trim
    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc99727,
      metalness: 0.85,
      roughness: 0.35,
    });
    const trimGeo = new THREE.TorusGeometry(13.3, 0.45, 16, 8);
    const trim = new THREE.Mesh(trimGeo, brassTrimMat);
    trim.rotation.x = Math.PI / 2;
    trim.position.y = -0.1;
    compassGroup.add(trim);

    // 8 Brass Corner Corner-Brackets
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI) / 4 + Math.PI / 8;
      const corner = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.2, 1.4), brassTrimMat);
      corner.position.set(Math.cos(ang) * 12.8, -1.6, Math.sin(ang) * 12.8);
      corner.rotation.y = -ang;
      compassGroup.add(corner);
    }

    // Outer Hinge / Brass Latch (Front & Back)
    const latchGeo = new THREE.BoxGeometry(2.2, 1.8, 1.2);
    const latch = new THREE.Mesh(latchGeo, brassTrimMat);
    latch.position.set(0, -1.5, 13.6);
    compassGroup.add(latch);

    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 5, 16), brassTrimMat);
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, -1.5, -13.6);
    compassGroup.add(hinge);

    // -------------------------------------------------------------
    // 2. Brass Bezel & Stepped Inner Bowl
    // -------------------------------------------------------------
    const innerBowlGeo = new THREE.CylinderGeometry(11.2, 10.5, 1.4, 48);
    const bowlMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f16,
      roughness: 0.5,
      metalness: 0.7,
    });
    const bowl = new THREE.Mesh(innerBowlGeo, bowlMat);
    bowl.position.y = -0.3;
    compassGroup.add(bowl);

    const bezelRingGeo = new THREE.TorusGeometry(11.5, 0.6, 16, 64);
    const bezelRing = new THREE.Mesh(bezelRingGeo, brassTrimMat);
    bezelRing.rotation.x = Math.PI / 2;
    bezelRing.position.y = 0.2;
    compassGroup.add(bezelRing);

    // -------------------------------------------------------------
    // 3. Compass Rose Dial Face (North, South, East, West)
    // -------------------------------------------------------------
    // Dynamic Canvas Texture for authentic antique Pirates Compass Face
    const dialCanvas = document.createElement('canvas');
    dialCanvas.width = 1024;
    dialCanvas.height = 1024;
    const ctx = dialCanvas.getContext('2d');

    // Dial background: Weathered antique parchment with circular gradations
    const bgGrad = ctx.createRadialGradient(512, 512, 50, 512, 512, 512);
    bgGrad.addColorStop(0, '#f9ecd0');
    bgGrad.addColorStop(0.55, '#ecd6a4');
    bgGrad.addColorStop(0.85, '#cfad6c');
    bgGrad.addColorStop(1, '#664d1f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Outer Degree Rings & Ticks
    ctx.strokeStyle = '#3b2b13';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(512, 512, 490, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(512, 512, 470, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(512, 512, 420, 0, Math.PI * 2);
    ctx.stroke();

    // 360 Degree Tick Marks
    for (let deg = 0; deg < 360; deg += 2) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 30 === 0;
      const isMedium = deg % 10 === 0;
      const length = isMajor ? 35 : isMedium ? 22 : 12;

      const r1 = 470;
      const r2 = r1 - length;

      const x1 = 512 + Math.cos(rad) * r1;
      const y1 = 512 + Math.sin(rad) * r1;
      const x2 = 512 + Math.cos(rad) * r2;
      const y2 = 512 + Math.sin(rad) * r2;

      ctx.strokeStyle = isMajor ? '#1c1306' : '#523d1c';
      ctx.lineWidth = isMajor ? 4 : isMedium ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 16-Point Ornate Compass Rose Star
    const drawStarPoint = (angle, length, width, colorLeft, colorRight) => {
      ctx.save();
      ctx.translate(512, 512);
      ctx.rotate(angle);

      // Left half
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-width, 0);
      ctx.lineTo(0, -length);
      ctx.closePath();
      ctx.fillStyle = colorLeft;
      ctx.fill();

      // Right half
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(0, -length);
      ctx.closePath();
      ctx.fillStyle = colorRight;
      ctx.fill();

      ctx.restore();
    };

    // Sub-cardinal points (NW, NE, SE, SW)
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + Math.PI / 4;
      drawStarPoint(ang, 290, 48, '#825f23', '#e8c985');
    }

    // 4 Cardinal points: North, South, East, West (Major Star)
    // East, South, West
    drawStarPoint(Math.PI / 2, 380, 68, '#261b0c', '#c2963c'); // East
    drawStarPoint(Math.PI, 380, 68, '#261b0c', '#c2963c'); // South
    drawStarPoint(-Math.PI / 2, 380, 68, '#261b0c', '#c2963c'); // West

    // North Star (Prominent Gold & Fleur-de-lis)
    drawStarPoint(0, 395, 75, '#731414', '#e63946'); // North Crimson & Gold

    // Cardinal Letters: N, S, E, W in Gothic Typography
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // NORTH
    ctx.font = 'bold 95px serif';
    ctx.fillStyle = '#8b0000';
    ctx.fillText('N', 512, 130);

    // Fleur-de-lis / Crown at North
    ctx.font = '55px serif';
    ctx.fillText('⚜', 512, 60);

    // SOUTH
    ctx.font = 'bold 85px serif';
    ctx.fillStyle = '#1c1306';
    ctx.fillText('S', 512, 895);

    // EAST
    ctx.fillText('E', 895, 512);

    // WEST
    ctx.fillText('W', 130, 512);

    // Inner Aztec Celestial Circles
    ctx.strokeStyle = '#85642a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(512, 512, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(512, 512, 170, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dial Texture Map
    const dialTexture = new THREE.CanvasTexture(dialCanvas);
    const dialMeshGeo = new THREE.CircleGeometry(11.2, 64);
    const dialMeshMat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      roughness: 0.65,
      metalness: 0.2,
    });
    const dialMesh = new THREE.Mesh(dialMeshGeo, dialMeshMat);
    dialMesh.rotation.x = -Math.PI / 2;
    dialMesh.rotation.z = Math.PI; // Face North towards -Z
    dialMesh.position.y = 0.05;
    compassGroup.add(dialMesh);

    // -------------------------------------------------------------
    // 4. Jack Sparrow's Magical Floating & Spinning Needle
    // -------------------------------------------------------------
    const needleGroup = new THREE.Group();
    needleGroup.position.y = 0.55;
    compassGroup.add(needleGroup);

    // North Pointer Needle (Golden Arrow with ruby accent)
    const needleNorthGeo = new THREE.ConeGeometry(0.85, 9.2, 4);
    const needleNorthMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xffaa00,
      emissiveIntensity: 0.4,
    });
    const needleNorth = new THREE.Mesh(needleNorthGeo, needleNorthMat);
    needleNorth.rotation.x = -Math.PI / 2;
    needleNorth.position.z = -4.6;
    needleNorth.castShadow = true;
    needleGroup.add(needleNorth);

    // South Pointer Needle (Dark Antiqued Bronze)
    const needleSouthGeo = new THREE.ConeGeometry(0.7, 7.8, 4);
    const needleSouthMat = new THREE.MeshStandardMaterial({
      color: 0x5a3e1b,
      metalness: 0.8,
      roughness: 0.35,
    });
    const needleSouth = new THREE.Mesh(needleSouthGeo, needleSouthMat);
    needleSouth.rotation.x = Math.PI / 2;
    needleSouth.position.z = 3.9;
    needleSouth.castShadow = true;
    needleGroup.add(needleSouth);

    // -------------------------------------------------------------
    // 5. Center Pivot Point (The Clickable Treasure / Portal Core)
    // -------------------------------------------------------------
    const centerPivotGroup = new THREE.Group();
    centerPivotGroup.position.y = 0.6;
    compassGroup.add(centerPivotGroup);

    // Brass Pivot Core
    const pivotBaseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.7, 32);
    const pivotBase = new THREE.Mesh(pivotBaseGeo, brassTrimMat);
    pivotBase.position.y = 0.35;
    centerPivotGroup.add(pivotBase);

    // Glowing Aztec Sun Jewel Pivot (The Portal Trigger)
    const gemGeo = new THREE.SphereGeometry(1.15, 24, 24);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      emissive: 0xffd700,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.9,
    });
    const jewelPivot = new THREE.Mesh(gemGeo, gemMat);
    jewelPivot.position.y = 1.0;
    centerPivotGroup.add(jewelPivot);

    // Pulsating Energy Ring around Center Pivot
    const ringGeo = new THREE.RingGeometry(2.1, 2.6, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const energyRing = new THREE.Mesh(ringGeo, ringMat);
    energyRing.rotation.x = -Math.PI / 2;
    energyRing.position.y = 0.58;
    centerPivotGroup.add(energyRing);

    // Protective Domed Glass Crystal Lens
    const glassGeo = new THREE.SphereGeometry(11.4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.25);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 0.92,
      transparent: true,
      roughness: 0.08,
      ior: 1.5,
    });
    const glassCover = new THREE.Mesh(glassGeo, glassMat);
    glassCover.rotation.x = Math.PI;
    glassCover.position.y = 1.6;
    compassGroup.add(glassCover);

    // Invisible Click Hit Cylinder for Center Area
    const hitGeo = new THREE.CylinderGeometry(4.5, 4.5, 4, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.position.y = 1.2;
    hitMesh.name = 'compassCenterHit';
    compassGroup.add(hitMesh);

    // -------------------------------------------------------------
    // 6. Floating Aztec Gold Dust / Mystical Particles
    // -------------------------------------------------------------
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 32;
      particlePos[i + 1] = Math.random() * 12 + 1;
      particlePos[i + 2] = (Math.random() - 0.5) * 32;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.35,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // -------------------------------------------------------------
    // 7. Interaction & Mystical Needle Motion
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.35;
    let targetRotationY = 0;
    let needleTargetAngle = 0;
    let needleCurrentAngle = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Check hit on Center Pivot / Hit mesh
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([hitMesh, jewelPivot, pivotBase, energyRing], true);

      if (intersects.length > 0) {
        setIsHoveredCenter(true);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setIsHoveredCenter(false);
        renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      // Compass Needle follows user's "true desire" (mouse angle) with Jack Sparrow twitch!
      const targetAngle = Math.atan2(mouse.x, -mouse.y);
      needleTargetAngle = targetAngle;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.008;
        targetRotationX = Math.max(0.1, Math.min(0.8, targetRotationX + deltaY * 0.006));
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([hitMesh, jewelPivot, pivotBase, energyRing, dialMesh, box], true);

      if (intersects.length > 0) {
        playLaserBlip();
        navigate('/portal');
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('click', handleCanvasClick);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Compass body tilting & rotation
      compassGroup.rotation.x += (targetRotationX - compassGroup.rotation.x) * 0.08;
      compassGroup.rotation.y += (targetRotationY - compassGroup.rotation.y) * 0.08;

      // Floating bob motion
      compassGroup.position.y = -1 + Math.sin(elapsedTime * 1.5) * 0.35;

      // Needle Mystical Quiver / Jack Sparrow erratic oscillation
      const quiver = Math.sin(elapsedTime * 9) * 0.08 + Math.cos(elapsedTime * 14) * 0.04;
      needleCurrentAngle += (needleTargetAngle + quiver - needleCurrentAngle) * 0.07;
      needleGroup.rotation.y = needleCurrentAngle;

      // Center jewel pulse
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.15;
      jewelPivot.scale.set(pulse, pulse, pulse);

      // Energy Ring pulse & spin
      energyRing.rotation.z = elapsedTime * 0.8;
      const ringPulse = 1 + Math.sin(elapsedTime * 2.5) * 0.22;
      energyRing.scale.set(ringPulse, ringPulse, 1);
      energyRing.material.opacity = 0.45 + Math.cos(elapsedTime * 2.5) * 0.35;

      // Particles float
      const positions = particleGeo.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(elapsedTime + positions[i]) * 0.012;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', handleResize);
      if (domElem && domElem.parentNode) {
        domElem.parentNode.removeChild(domElem);
      }
      renderer.dispose();
    };
  }, [navigate]);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-[380px] sm:h-[460px] md:h-[500px] relative rounded-3xl overflow-hidden border-2 border-[#ffd700]/70 shadow-[0_0_55px_rgba(255,215,0,0.3)] bg-[#030810]/95 cursor-grab active:cursor-grabbing backdrop-blur-md"
      >
        {/* Top Tag Telemetry */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none px-2">
          <div className="flex items-center space-x-2 bg-[#08121a]/90 border border-[#ffd700]/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-cinzel text-[#ffd700] shadow-md">
            <Compass className="w-3.5 h-3.5 text-[#ffd700] animate-spin" style={{ animationDuration: '18s' }} />
            <span className="font-bold tracking-wider">JACK SPARROW'S CURSED COMPASS</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 bg-[#08121a]/90 border border-[#00e5ff]/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono text-[#00e5ff]">
            <Eye className="w-3 h-3 text-[#00e5ff]" />
            <span>DRAG TO TILT 360° • HOVER TO CHART COURSE</span>
          </div>
        </div>

        {/* Pulsating Interactive Floating Callout (Click Target Overlay) */}
        <div
          onClick={() => {
            playLaserBlip();
            navigate('/portal');
          }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-300 ${
            isHoveredCenter ? 'scale-110' : 'scale-100'
          }`}
        >
          <div className="flex flex-col items-center group">
            {/* Pulsating Golden Diamond Anchor Pin */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd700] via-[#f39c12] to-[#b8860b] text-black flex items-center justify-center shadow-[0_0_35px_#ffd700] border-2 border-white animate-bounce">
              <Navigation className="w-6 h-6 fill-black transform -rotate-45" />
            </div>

            {/* Glowing Pill Tag */}
            <div className="mt-2.5 bg-[#061019]/95 border-2 border-[#ffd700] px-4 py-1.5 rounded-full shadow-[0_0_30px_rgba(255,215,0,0.7)] backdrop-blur-md flex items-center space-x-2 group-hover:border-[#00e5ff] group-hover:shadow-[0_0_40px_rgba(0,229,255,0.8)] transition-all">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
              <span className="font-cinzel font-black text-xs sm:text-sm text-[#ffd700] tracking-wider uppercase">
                COMPASS CENTER
              </span>
              <span className="font-pirate text-sm text-[#00e5ff] tracking-widest pl-1">
                [ CLICK TO UNLOCK COURSE ]
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Hint Banner */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
          <span className="font-cinzel text-[10px] sm:text-xs text-[#e5c158] bg-[#030810]/85 px-4 py-1 rounded-full border border-[#ffd700]/30 shadow-lg">
            🧭 "The compass doesn't point North. It points to what you want most in this world." 🧭
          </span>
        </div>
      </div>

      {/* Immediate Enter Button below 3D Compass */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
        <button
          onClick={() => {
            playLaserBlip();
            navigate('/portal');
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-cinzel font-extrabold text-sm sm:text-base text-black bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] transition-all shadow-[0_0_25px_rgba(255,215,0,0.5)] transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
        >
          <span>CHART COURSE TO EVENT PORTAL</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/register')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-cinzel font-bold text-xs sm:text-sm text-[#ffd700] bg-[#0c1e2d] border border-[#ffd700]/60 hover:bg-[#ffd700] hover:text-black transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
        >
          <Swords className="w-4 h-4" />
          <span>JOIN THE CREW (REGISTER)</span>
        </button>
      </div>
    </div>
  );
};

export default PiratesCompass3dCanvas;
