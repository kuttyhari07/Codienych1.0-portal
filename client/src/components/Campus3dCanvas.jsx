import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Compass, Sparkles, MapPin, ArrowRight, Eye } from 'lucide-react';
import { playLaserBlip } from '../utils/cyberSound';

const Campus3dCanvas = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [isHoveredCenter, setIsHoveredCenter] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030810, 0.018);

    // Camera (Isometric angle)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(38, 34, 45);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x4a6572, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffdf88, 2.2);
    sunLight.position.set(25, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Aztec Gold & Cyan Accent Spotlights
    const cyanLight = new THREE.PointLight(0x00e5ff, 3, 40);
    cyanLight.position.set(-15, 12, -10);
    scene.add(cyanLight);

    const goldLight = new THREE.PointLight(0xffd700, 4, 45);
    goldLight.position.set(0, 15, 0);
    scene.add(goldLight);

    // Campus Root Group (for rotation)
    const campusGroup = new THREE.Group();
    scene.add(campusGroup);

    // 1. Campus Ground Terrain
    const groundGeo = new THREE.CylinderGeometry(28, 29, 1.5, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x08131e,
      roughness: 0.85,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.75;
    ground.receiveShadow = true;
    campusGroup.add(ground);

    // Gold Aztec Ring Border around Campus
    const ringGeo = new THREE.RingGeometry(27.8, 28.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide });
    const borderRing = new THREE.Mesh(ringGeo, ringMat);
    borderRing.rotation.x = -Math.PI / 2;
    borderRing.position.y = 0.02;
    campusGroup.add(borderRing);

    // 2. Walkways / Roads
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x14202c, roughness: 0.7 });
    const road1 = new THREE.Mesh(new THREE.PlaneGeometry(6, 44), roadMat);
    road1.rotation.x = -Math.PI / 2;
    road1.position.set(0, 0.01, 2);
    campusGroup.add(road1);

    const road2 = new THREE.Mesh(new THREE.PlaneGeometry(42, 5), roadMat);
    road2.rotation.x = -Math.PI / 2;
    road2.position.set(0, 0.01, 0);
    campusGroup.add(road2);

    // Central Plaza circle
    const plazaGeo = new THREE.CircleGeometry(7.5, 36);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0x1e2e3d, roughness: 0.6 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(0, 0.02, 0);
    campusGroup.add(plaza);

    // 3. Campus Buildings
    const buildingMatDark = new THREE.MeshStandardMaterial({ color: 0x102130, roughness: 0.5, metalness: 0.3 });
    const buildingMatGold = new THREE.MeshStandardMaterial({ color: 0x223544, roughness: 0.4, metalness: 0.5 });
    const windowGlowMat = new THREE.MeshBasicMaterial({ color: 0xffe27a });
    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });

    const createBuilding = (w, h, d, x, z, rotation = 0, isItBlock = false) => {
      const bGroup = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(w, h, d);
      const body = new THREE.Mesh(bodyGeo, isItBlock ? buildingMatGold : buildingMatDark);
      body.castShadow = true;
      body.receiveShadow = true;
      body.position.y = h / 2;
      bGroup.add(body);

      // Windows stripes
      const winGeo = new THREE.BoxGeometry(w * 0.92, h * 0.12, d * 1.02);
      const win = new THREE.Mesh(winGeo, isItBlock ? cyanGlowMat : windowGlowMat);
      win.position.y = h * 0.45;
      bGroup.add(win);

      const win2 = win.clone();
      win2.position.y = h * 0.72;
      bGroup.add(win2);

      // Roof detail
      const roofGeo = new THREE.BoxGeometry(w * 0.6, h * 0.15, d * 0.6);
      const roof = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: 0xb8860b }));
      roof.position.y = h + (h * 0.15) / 2;
      bGroup.add(roof);

      bGroup.position.set(x, 0, z);
      bGroup.rotation.y = rotation;
      campusGroup.add(bGroup);
      return bGroup;
    };

    // A. Main Administrative & Academic Block (North)
    createBuilding(14, 6.5, 4.5, 0, -11, 0, false);

    // B. IT & Computing Technology Hub (East - The Hackathon Arena)
    createBuilding(10, 7.5, 5, 12, -2, -Math.PI / 10, true);

    // C. Engineering Science & Academic Wing (West)
    createBuilding(11, 6, 4.8, -12, -2, Math.PI / 10, false);

    // D. Central Digital Library & Seminar Hall (South-West)
    createBuilding(7, 5, 5, -9, 10, -Math.PI / 6, false);

    // E. Innovation Lab & Auditorium (South-East)
    createBuilding(8, 5.2, 5, 9, 10, Math.PI / 6, false);

    // F. Campus Grand Entrance Arch (South Gate)
    const archMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.6, roughness: 0.3 });
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.5, 1.2), archMat);
    p1.position.set(-3, 2.25, 20);
    campusGroup.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.5, 1.2), archMat);
    p2.position.set(3, 2.25, 20);
    campusGroup.add(p2);

    const beam = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1, 1.4), archMat);
    beam.position.set(0, 4.5, 20);
    campusGroup.add(beam);

    // 4. Campus Foliage / Trees
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817 });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x18422d, roughness: 0.9 });
    const treeGeo = new THREE.ConeGeometry(1.2, 3, 6);
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 5);

    const treePositions = [
      [-6, -6], [-5, 6], [5, 6], [6, -6],
      [-17, 4], [17, 4], [-17, -8], [17, -8],
      [-3, 14], [3, 14], [-14, 15], [14, 15]
    ];

    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, treeTrunkMat);
      trunk.position.y = 0.6;
      tree.add(trunk);
      const foliage = new THREE.Mesh(treeGeo, treeFoliageMat);
      foliage.position.y = 2.4;
      tree.add(foliage);
      tree.position.set(tx, 0, tz);
      campusGroup.add(tree);
    });

    // 5. CENTER BEACON / INTERACTIVE PORTAL TARGET
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(0, 0, 0);

    // Central glowing beacon cylinder / energy beam
    const beamGeo = new THREE.CylinderGeometry(0.35, 0.35, 16, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.65,
    });
    const energyBeam = new THREE.Mesh(beamGeo, beamMat);
    energyBeam.position.y = 8;
    beaconGroup.add(energyBeam);

    // Pulsating Landmark Diamond Crystal
    const diamondGeo = new THREE.OctahedronGeometry(1.5, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffa500,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8,
    });
    const beaconDiamond = new THREE.Mesh(diamondGeo, diamondMat);
    beaconDiamond.position.y = 5.5;
    beaconGroup.add(beaconDiamond);

    // Ripple Rings on the ground
    const ring1Geo = new THREE.RingGeometry(1.8, 2.2, 32);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const pulseRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    pulseRing1.rotation.x = -Math.PI / 2;
    pulseRing1.position.y = 0.08;
    beaconGroup.add(pulseRing1);

    const ring2Geo = new THREE.RingGeometry(3.2, 3.6, 32);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const pulseRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    pulseRing2.rotation.x = -Math.PI / 2;
    pulseRing2.position.y = 0.07;
    beaconGroup.add(pulseRing2);

    // Invisible Hit Box for easy clicking
    const hitGeo = new THREE.CylinderGeometry(4.5, 4.5, 14, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.position.y = 7;
    hitMesh.name = 'beaconHit';
    beaconGroup.add(hitMesh);

    campusGroup.add(beaconGroup);

    // 6. Floating Aztec Gold Dust / Mist Particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 45;
      particlePos[i + 1] = Math.random() * 15 + 1;
      particlePos[i + 2] = (Math.random() - 0.5) * 45;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.35,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    campusGroup.add(particles);

    // Mouse & Raycasting Controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let autoRotate = true;

    const onPointerDown = (e) => {
      isDragging = true;
      autoRotate = false;
      setIsInteracting(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Check hit on center beacon
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([hitMesh, beaconDiamond, energyBeam], true);

      if (intersects.length > 0) {
        setIsHoveredCenter(true);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setIsHoveredCenter(false);
        renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        targetRotationY += deltaX * 0.007;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = (e) => {
      isDragging = false;
      setTimeout(() => setAutoRotateTrue(), 4000);
    };

    let autoRotateTimer;
    const setAutoRotateTrue = () => {
      clearTimeout(autoRotateTimer);
      autoRotateTimer = setTimeout(() => {
        autoRotate = true;
        setIsInteracting(false);
      }, 3000);
    };

    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([hitMesh, beaconDiamond, energyBeam, plaza], true);

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

      // Smooth rotation
      if (autoRotate) {
        targetRotationY += 0.003;
      }
      campusGroup.rotation.y += (targetRotationY - campusGroup.rotation.y) * 0.08;

      // Beacon Animations
      beaconDiamond.rotation.y = elapsedTime * 1.5;
      beaconDiamond.position.y = 5.5 + Math.sin(elapsedTime * 2.5) * 0.4;

      const ringScale1 = 1 + Math.sin(elapsedTime * 3) * 0.25;
      pulseRing1.scale.set(ringScale1, ringScale1, 1);
      pulseRing1.material.opacity = 0.4 + Math.cos(elapsedTime * 3) * 0.4;

      const ringScale2 = 1 + Math.sin(elapsedTime * 2 + 1) * 0.2;
      pulseRing2.scale.set(ringScale2, ringScale2, 1);
      pulseRing2.material.opacity = 0.3 + Math.cos(elapsedTime * 2 + 1) * 0.3;

      // Energy beam pulse
      energyBeam.material.opacity = 0.45 + Math.sin(elapsedTime * 4) * 0.25;

      // Particles float
      const positions = particleGeo.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(elapsedTime + positions[i]) * 0.015;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
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
      clearTimeout(autoRotateTimer);
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
        className="w-full h-[360px] sm:h-[460px] md:h-[500px] relative rounded-3xl overflow-hidden border-2 border-[#ffd700]/60 shadow-[0_0_50px_rgba(255,215,0,0.25)] bg-[#030810] cursor-grab active:cursor-grabbing"
      >
        {/* Top Tag Telemetry */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none px-2">
          <div className="flex items-center space-x-2 bg-[#08121a]/85 border border-[#ffd700]/50 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] sm:text-xs font-cinzel text-[#ffd700]">
            <Compass className="w-3.5 h-3.5 text-[#ffd700] animate-spin" style={{ animationDuration: '20s' }} />
            <span className="font-bold tracking-wider">3D ESEC CAMPUS RECON // LIVE ARENA</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 bg-[#08121a]/85 border border-[#00e5ff]/50 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-mono text-[#00e5ff]">
            <Eye className="w-3 h-3 text-[#00e5ff]" />
            <span>DRAG TO ROTATE 360°</span>
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
            {/* Animated Pin */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd700] via-[#f39c12] to-[#b8860b] text-black flex items-center justify-center shadow-[0_0_30px_#ffd700] border-2 border-white animate-bounce">
              <MapPin className="w-6 h-6 fill-black" />
            </div>

            {/* Glowing Pill Tag */}
            <div className="mt-2 bg-[#061019]/95 border-2 border-[#ffd700] px-4 py-1.5 rounded-full shadow-[0_0_25px_rgba(255,215,0,0.6)] backdrop-blur-md flex items-center space-x-2 group-hover:border-[#00e5ff] group-hover:shadow-[0_0_35px_rgba(0,229,255,0.7)] transition-all">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
              <span className="font-cinzel font-black text-xs sm:text-sm text-[#ffd700] tracking-wider uppercase">
                IT HACKATHON ARENA
              </span>
              <span className="font-pirate text-sm text-[#00e5ff] tracking-widest pl-1">
                [ CLICK TO ENTER ]
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Hint Banner */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
          <span className="font-cinzel text-[10px] sm:text-xs text-[#e5c158] bg-[#030810]/80 px-4 py-1 rounded-full border border-[#ffd700]/30 shadow-md">
            ⚓ Click Center Arena Beacon to Enter Event Portal ⚓
          </span>
        </div>
      </div>

      {/* Immediate Enter Button below 3D Campus */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
        <button
          onClick={() => {
            playLaserBlip();
            navigate('/portal');
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-cinzel font-extrabold text-sm sm:text-base text-black bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] transition-all shadow-[0_0_25px_rgba(255,215,0,0.5)] transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
        >
          <span>BOARD EVENT PORTAL NOW</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/register')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-cinzel font-bold text-xs sm:text-sm text-[#ffd700] bg-[#0c1e2d] border border-[#ffd700]/60 hover:bg-[#ffd700] hover:text-black transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
        >
          <span>JOIN THE CREW (REGISTER)</span>
        </button>
      </div>
    </div>
  );
};

export default Campus3dCanvas;
