import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Compass, Sparkles, Navigation, ArrowRight, Eye, Swords, RotateCcw } from 'lucide-react';
import { playLaserBlip, playChirp } from '../utils/cyberSound';

/**
 * Photorealistic 3D Ancient Pirate Compass (Jack Sparrow's Cursed Compass)
 * Built with Three.js:
 * - Distressed weathered mahogany & antique brass casing with screws, hinges & corner brackets
 * - Super crisp, high-resolution antique parchment compass rose with 32-point star, Fleur-de-lis & degrees
 * - Physical magnetic needle that follows pointer with realistic inertial oscillation
 * - Polished bevel glass dome with real-time specular highlights
 * - Full 3D tilt & rotation via drag or touch
 */
const PiratesCompass3dCanvas = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 18, 22);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // LIGHTING (Bright & Vibrant so Dial is Crystal Clear)
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff0c4, 3.8);
    sunLight.position.set(12, 28, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.4);
    rimLight.position.set(-16, 8, -12);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xffaa22, 2.5, 30);
    warmFill.position.set(0, 8, 4);
    scene.add(warmFill);

    // MASTER COMPASS GROUP
    const compassGroup = new THREE.Group();
    compassGroup.position.set(0, -0.5, 0);
    scene.add(compassGroup);

    // =========================================================================
    // 1. PROCEDURAL ANTIQUE PARCHMENT COMPASS ROSE TEXTURE (2048 x 2048)
    // =========================================================================
    const createCompassRoseTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');
      const cX = 1024;
      const cY = 1024;

      // Base: Warm Antique Cream Parchment with Vignette
      const bgGrad = ctx.createRadialGradient(cX, cY, 100, cX, cY, 1024);
      bgGrad.addColorStop(0, '#fffbf0');
      bgGrad.addColorStop(0.4, '#faecd0');
      bgGrad.addColorStop(0.75, '#e5cca0');
      bgGrad.addColorStop(0.92, '#c7a36a');
      bgGrad.addColorStop(1, '#8c6833');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 2048, 2048);

      // Faint aged paper noise & rings
      ctx.strokeStyle = 'rgba(100, 60, 20, 0.15)';
      for (let r = 200; r < 1000; r += 70) {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cX, cY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Outer Heavy Brass Border Ring
      ctx.strokeStyle = '#5a3d1b';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(cX, cY, 970, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#8a5c20';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cX, cY, 950, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#3e240b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cX, cY, 860, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cX, cY, 810, 0, Math.PI * 2);
      ctx.stroke();

      // 360 Degree Hash Marks
      for (let deg = 0; deg < 360; deg++) {
        const rad = (deg * Math.PI) / 180;
        const isMajor = deg % 10 === 0;
        const isMid = deg % 5 === 0;
        const len = isMajor ? 36 : isMid ? 22 : 12;

        const x1 = cX + Math.sin(rad) * 950;
        const y1 = cY - Math.cos(rad) * 950;
        const x2 = cX + Math.sin(rad) * (950 - len);
        const y2 = cY - Math.cos(rad) * (950 - len);

        ctx.strokeStyle = isMajor ? '#3e240b' : '#6b451f';
        ctx.lineWidth = isMajor ? 5 : isMid ? 3 : 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Degrees numbers every 30 degrees
        if (deg % 30 === 0) {
          const numX = cX + Math.sin(rad) * 895;
          const numY = cY - Math.cos(rad) * 895;
          ctx.save();
          ctx.translate(numX, numY);
          ctx.rotate(rad);
          ctx.fillStyle = '#40260f';
          ctx.font = 'bold 28px Cinzel, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${deg}°`, 0, 0);
          ctx.restore();
        }
      }

      // Roman Numerals around Outer Circle (I to XII)
      const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
      for (let i = 0; i < 12; i++) {
        const rad = (i * 30 * Math.PI) / 180;
        const rX = cX + Math.sin(rad) * 835;
        const rY = cY - Math.cos(rad) * 835;
        ctx.save();
        ctx.translate(rX, rY);
        ctx.rotate(rad);
        ctx.fillStyle = '#7a2214';
        ctx.font = 'bold 36px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(romanNumerals[i], 0, 0);
        ctx.restore();
      }

      // 32-POINT NAUTICAL COMPASS ROSE
      const drawCompassPoint = (angleDeg, length, width, colorA, colorB) => {
        const rad = (angleDeg * Math.PI) / 180;
        const perp = rad + Math.PI / 2;

        const tipX = cX + Math.sin(rad) * length;
        const tipY = cY - Math.cos(rad) * length;

        const leftX = cX + Math.sin(perp) * width;
        const leftY = cY - Math.cos(perp) * width;

        const rightX = cX - Math.sin(perp) * width;
        const rightY = cY + Math.cos(perp) * width;

        // Side A
        ctx.fillStyle = colorA;
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.lineTo(leftX, leftY);
        ctx.lineTo(tipX, tipY);
        ctx.closePath();
        ctx.fill();

        // Side B
        ctx.fillStyle = colorB;
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.lineTo(rightX, rightY);
        ctx.lineTo(tipX, tipY);
        ctx.closePath();
        ctx.fill();

        // Point Outline
        ctx.strokeStyle = '#2b1708';
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      // 16 Tertiary Points
      for (let a = 11.25; a < 360; a += 22.5) {
        drawCompassPoint(a, 560, 42, '#d4ba8a', '#94734a');
      }

      // 8 Secondary Points (NE, SE, SW, NW, etc)
      for (let a = 45; a < 360; a += 90) {
        drawCompassPoint(a, 660, 68, '#c9933b', '#6e4a16');
      }

      // 4 Primary Points (N, E, S, W)
      // East & West
      drawCompassPoint(90, 760, 88, '#e5c158', '#5a3810');
      drawCompassPoint(270, 760, 88, '#e5c158', '#5a3810');

      // South
      drawCompassPoint(180, 760, 88, '#b8860b', '#3b200b');

      // North (Royal Crimson & Aztec Gold Fleur-de-lis)
      drawCompassPoint(0, 780, 92, '#b91c1c', '#6b0d0d');

      // Fleur-de-lis on North Arrow Tip
      ctx.save();
      ctx.translate(cX, cY - 785);
      ctx.fillStyle = '#ffd700';
      ctx.strokeStyle = '#8a1c1c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -18, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Cardinal Letters (Large & Ornate)
      ctx.font = 'bold 74px "Pirata One", Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // N (Crimson)
      ctx.fillStyle = '#8a1c1c';
      ctx.fillText('N', cX, cY - 840);

      // S (Dark Brown)
      ctx.fillStyle = '#3a200a';
      ctx.fillText('S', cX, cY + 840);

      // E
      ctx.fillStyle = '#3a200a';
      ctx.fillText('E', cX + 840, cY);

      // W
      ctx.fillStyle = '#3a200a';
      ctx.fillText('W', cX - 840, cY);

      // Center Inscriptions & Filigree Ring
      ctx.strokeStyle = '#5a3610';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cX, cY, 260, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cX, cY, 150, 0, Math.PI * 2);
      ctx.stroke();

      // Curved Text on Center Ring: "THE PIRATES CARIBBEAN CHART"
      ctx.fillStyle = '#613912';
      ctx.font = 'bold 24px Cinzel, serif';
      ctx.fillText('• JACK SPARROW • 1720 • CARIBBEAN FLEET •', cX, cY + 200);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 16;
      return texture;
    };

    const dialTexture = createCompassRoseTexture();

    // =========================================================================
    // 2. MATERIALS
    // =========================================================================
    const woodCasingMat = new THREE.MeshStandardMaterial({
      color: 0x3d2312,
      roughness: 0.55,
      metalness: 0.12,
    });

    const antiqueBrassMat = new THREE.MeshStandardMaterial({
      color: 0xd4a742,
      roughness: 0.32,
      metalness: 0.88,
      envMapIntensity: 1.8,
    });

    const darkIronMat = new THREE.MeshStandardMaterial({
      color: 0x221a14,
      roughness: 0.6,
      metalness: 0.65,
    });

    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      roughness: 0.5,
      metalness: 0.08,
    });

    // =========================================================================
    // 3. AUTHENTIC 3D CASING & BRASS BEZEL
    // =========================================================================
    const casingRadius = 12.6;
    const casingHeight = 3.6;

    // Outer Octagonal Aged Teak Wood Base
    const woodBase = new THREE.Mesh(
      new THREE.CylinderGeometry(casingRadius, casingRadius + 0.6, casingHeight, 8),
      woodCasingMat
    );
    woodBase.position.y = -casingHeight / 2;
    woodBase.castShadow = true;
    woodBase.receiveShadow = true;
    compassGroup.add(woodBase);

    // 8 Forged Brass Corner Reinforcement Brackets
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.PI / 8;
      const bracket = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, casingHeight + 0.15, 1.4),
        antiqueBrassMat
      );
      bracket.position.set(
        Math.cos(angle) * (casingRadius + 0.1),
        -casingHeight / 2,
        Math.sin(angle) * (casingRadius + 0.1)
      );
      bracket.rotation.y = -angle;
      compassGroup.add(bracket);

      // Gold Rivet Studs
      [-0.9, 0.9].forEach(yOff => {
        const rivet = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 8, 8),
          antiqueBrassMat
        );
        rivet.position.set(
          Math.cos(angle) * (casingRadius + 0.82),
          -casingHeight / 2 + yOff,
          Math.sin(angle) * (casingRadius + 0.82)
        );
        compassGroup.add(rivet);
      });
    }

    // Heavy Brass Stepped Bezel Rim
    const bezelOuter = new THREE.Mesh(
      new THREE.TorusGeometry(casingRadius - 0.2, 0.65, 20, 64),
      antiqueBrassMat
    );
    bezelOuter.rotation.x = Math.PI / 2;
    bezelOuter.position.y = 0.1;
    compassGroup.add(bezelOuter);

    const bezelInner = new THREE.Mesh(
      new THREE.TorusGeometry(10.8, 0.45, 16, 64),
      antiqueBrassMat
    );
    bezelInner.rotation.x = Math.PI / 2;
    bezelInner.position.y = 0.35;
    compassGroup.add(bezelInner);

    // Sunken Inner Bowl
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(10.6, 9.8, 1.4, 48),
      darkIronMat
    );
    bowl.position.y = -0.4;
    compassGroup.add(bowl);

    // Antique Brass Hinges (Top & Bottom)
    [-1, 1].forEach(dir => {
      const hinge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 4.2, 16),
        antiqueBrassMat
      );
      hinge.rotation.z = Math.PI / 2;
      hinge.position.set(0, -casingHeight / 2, dir * (casingRadius + 0.5));
      compassGroup.add(hinge);
    });

    // =========================================================================
    // 4. CRISP PARCHMENT ROSE DIAL SURFACE
    // =========================================================================
    const dialMesh = new THREE.Mesh(
      new THREE.CircleGeometry(10.5, 64),
      dialMat
    );
    dialMesh.rotation.x = -Math.PI / 2;
    dialMesh.position.y = 0.05;
    compassGroup.add(dialMesh);

    // =========================================================================
    // 5. JACK SPARROW'S MAGICAL NEEDLE (Double-Tapered Arrow & Counterweight)
    // =========================================================================
    const needleAssembly = new THREE.Group();
    needleAssembly.position.y = 0.55;
    compassGroup.add(needleAssembly);

    const needleMatNorth = new THREE.MeshStandardMaterial({
      color: 0xcc2222,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x440000,
      emissiveIntensity: 0.3,
    });

    const needleMatSouth = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.9,
    });

    // North Needle Point (Crimson Arrow with Sharp Edges)
    const northNeedleGeo = new THREE.ConeGeometry(0.72, 8.8, 4);
    const northNeedle = new THREE.Mesh(northNeedleGeo, needleMatNorth);
    northNeedle.rotation.x = -Math.PI / 2;
    northNeedle.position.z = -4.4;
    northNeedle.castShadow = true;
    needleAssembly.add(northNeedle);

    // South Needle Point (Gold Tapered Point)
    const southNeedleGeo = new THREE.ConeGeometry(0.62, 7.2, 4);
    const southNeedle = new THREE.Mesh(southNeedleGeo, needleMatSouth);
    southNeedle.rotation.x = Math.PI / 2;
    southNeedle.position.z = 3.6;
    southNeedle.castShadow = true;
    needleAssembly.add(southNeedle);

    // Center Spindle Pivot
    const pivotBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.6, 0.8, 32),
      antiqueBrassMat
    );
    pivotBase.position.y = 0.15;
    needleAssembly.add(pivotBase);

    // Center Glowing Amber/Gold Jewel Cap
    const centerJewel = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff8800,
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.8,
      })
    );
    centerJewel.position.y = 0.65;
    needleAssembly.add(centerJewel);

    // =========================================================================
    // 6. PROTECTIVE BEVELED CRYSTAL GLASS DOME
    // =========================================================================
    const glassGeo = new THREE.SphereGeometry(10.7, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.24);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 0.45,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      reflectivity: 0.9,
    });
    const glassCover = new THREE.Mesh(glassGeo, glassMat);
    glassCover.rotation.x = Math.PI;
    glassCover.position.y = 1.35;
    compassGroup.add(glassCover);

    // Floating Golden Dust Particles
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 28;
      particlePos[i + 1] = Math.random() * 10 + 1;
      particlePos[i + 2] = (Math.random() - 0.5) * 28;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.25,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // =========================================================================
    // 7. INTERACTION: 3D TILT, NEEDLE TRACKING & CLICK TRIGGER
    // =========================================================================
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.35;
    let rotY = 0;
    let targetNeedleAngle = 0;
    let currentNeedleAngle = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Magnetic Needle tracks pointer angle with erratic "True Desire" jitter!
      targetNeedleAngle = Math.atan2(mX, -mY);

      if (isDragging) {
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;
        rotY += deltaX * 0.007;
        rotX = Math.max(0.05, Math.min(0.75, rotX + deltaY * 0.006));
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const handleClick = () => {
      playLaserBlip();
      // Spin needle dramatically on click then navigate
      targetNeedleAngle += Math.PI * 4;
      setTimeout(() => {
        navigate('/portal');
      }, 450);
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('click', handleClick);

    // ANIMATION LOOP
    let animId;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth Compass body 3D tilting
      compassGroup.rotation.x += (rotX - compassGroup.rotation.x) * 0.08;
      compassGroup.rotation.y += (rotY - compassGroup.rotation.y) * 0.08;

      // Subtle atmospheric ocean buoyancy bob
      compassGroup.position.y = -0.5 + Math.sin(elapsed * 1.6) * 0.25;

      // Magical Jack Sparrow erratic needle quiver
      const quiver = Math.sin(elapsed * 8) * 0.06 + Math.cos(elapsed * 13) * 0.035;
      currentNeedleAngle += (targetNeedleAngle + quiver - currentNeedleAngle) * 0.08;
      needleAssembly.rotation.y = currentNeedleAngle;

      // Subtle jewel pulse
      const jScale = 1 + Math.sin(elapsed * 3) * 0.08;
      centerJewel.scale.set(jScale, jScale, jScale);

      // Float dust particles
      const pos = particleGeo.attributes.position.array;
      for (let p = 1; p < pos.length; p += 3) {
        pos[p] += Math.sin(elapsed + pos[p]) * 0.008;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [navigate]);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full h-[380px] sm:h-[480px] md:h-[520px] relative rounded-3xl overflow-hidden border-2 border-[#ffd700]/70 shadow-[0_0_60px_rgba(255,215,0,0.35)] bg-gradient-to-b from-[#0e0a05] via-[#05090f] to-[#020408] cursor-grab active:cursor-grabbing backdrop-blur-md select-none"
      >
        {/* Top Minimal Pirate Telemetry Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none px-2">
          <div className="flex items-center space-x-2 bg-[#0c0804]/90 border border-[#ffd700]/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-cinzel text-[#ffd700] shadow-lg">
            <Compass className="w-3.5 h-3.5 text-[#ffd700] animate-spin" style={{ animationDuration: '20s' }} />
            <span className="font-extrabold tracking-wider">JACK SPARROW'S CURSED COMPASS</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 bg-[#0c0804]/90 border border-[#ffd700]/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-cinzel text-[#ffe57f]">
            <Eye className="w-3 h-3 text-[#ffd700]" />
            <span>DRAG TO TILT 360° • HOVER DIRECTS NEEDLE</span>
          </div>
        </div>

        {/* Clean Center Hover Cue (Non-obstructive) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center w-full px-4">
          <span className="font-cinzel text-[10px] sm:text-xs text-[#ffd700] bg-[#0c0804]/90 px-4 py-1.5 rounded-full border border-[#ffd700]/40 shadow-xl inline-block">
            🧭 "The compass points to what you want most in this world." • <span className="text-[#00e5ff] font-bold">CLICK COMPASS TO ENTER</span> 🧭
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full px-4">
        <button
          onClick={() => {
            playLaserBlip();
            navigate('/portal');
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-cinzel font-black text-xs sm:text-sm text-black bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe66d] hover:to-[#ffd700] transition-all shadow-[0_0_30px_rgba(255,215,0,0.6)] transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
        >
          <span>CHART COURSE TO VOYAGE PORTAL</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/register')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-cinzel font-bold text-xs sm:text-sm text-[#ffd700] bg-[#120a04] border border-[#ffd700]/60 hover:bg-[#ffd700] hover:text-black transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
        >
          <Swords className="w-4 h-4" />
          <span>JOIN THE CREW (REGISTER)</span>
        </button>
      </div>
    </div>
  );
};

export default PiratesCompass3dCanvas;
