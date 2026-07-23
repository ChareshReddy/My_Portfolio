import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Particle & Connection lines inside the 3D scene
function PipelineScene() {
  const { camera } = useThree();
  const sceneRef = useRef();
  const pointsRef = useRef();
  const linesRef = useRef();
  
  // Mouse position tracker for interactive parallax
  const mouse = useRef({ x: 0, y: 0 });

  // Generate data-nodes and paths
  const { nodePositions, linePositions, packets } = useMemo(() => {
    const nodeCount = 50;
    const positions = [];
    const colors = [];
    
    // Generate nodes spread across a vertical pipeline cylinder space
    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 16; // spiral downwards
      const radius = 3 + Math.random() * 2;
      const x = Math.cos(theta) * radius;
      const y = -i * 0.7 + 10; // spread from y=10 down to y=-25
      const z = Math.sin(theta) * radius;
      positions.push(x, y, z);
    }

    // Connect nodes into pipeline lines
    const lineIndices = [];
    for (let i = 0; i < nodeCount - 1; i++) {
      // Connect sequential nodes (forming a spiral pipeline)
      lineIndices.push(
        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
        positions[(i + 1) * 3], positions[(i + 1) * 3 + 1], positions[(i + 1) * 3 + 2]
      );
      
      // Connect to a random node nearby to make it look like a network graph
      if (i < nodeCount - 3 && Math.random() > 0.6) {
        const nextIdx = i + 3;
        lineIndices.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[nextIdx * 3], positions[nextIdx * 3 + 1], positions[nextIdx * 3 + 2]
        );
      }
    }

    // Moving packets data structures
    const packetCount = 40;
    const packetData = [];
    for (let i = 0; i < packetCount; i++) {
      const startIndex = Math.floor(Math.random() * (nodeCount - 5));
      packetData.push({
        startIdx: startIndex,
        endIdx: startIndex + 1,
        progress: Math.random(),
        speed: 0.015 + Math.random() * 0.02
      });
    }

    return {
      nodePositions: new Float32Array(positions),
      linePositions: new Float32Array(lineIndices),
      packets: packetData
    };
  }, []);

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Setup GSAP ScrollTrigger to move camera smoothly along the pipeline
  useEffect(() => {
    // Initial camera placement
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2, // Smooth scrubbing
      }
    });

    // Animate camera down the pipeline based on scroll progress
    tl.to(camera.position, { x: 2, y: 1.5, z: 9, ease: "none" })      // Hero -> About
      .to(camera.position, { x: -3, y: -4.5, z: 10, ease: "none" })    // About -> Skills
      .to(camera.position, { x: 3, y: -10.5, z: 8, ease: "none" })    // Skills -> Experience
      .to(camera.position, { x: -2, y: -17.5, z: 11, ease: "none" })   // Experience -> Projects
      .to(camera.position, { x: 0, y: -24.5, z: 9, ease: "none" })     // Projects -> Certifications
      .to(camera.position, { x: 1, y: -30.5, z: 11, ease: "none" });    // Certifications -> Contact

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [camera]);

  // Buffer geometries for moving packets
  const packetGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(packets.length * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [packets]);

  // Frame tick animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Mouse tilt Parallax on the scene container
    if (sceneRef.current) {
      sceneRef.current.rotation.y += (mouse.current.x * 0.12 - sceneRef.current.rotation.y) * 0.05;
      sceneRef.current.rotation.x += (-mouse.current.y * 0.08 - sceneRef.current.rotation.x) * 0.05;
    }

    // 2. Animate pipeline nodes pulse
    if (pointsRef.current) {
      const sizes = pointsRef.current.geometry.attributes.position.array;
      // Subtle float vibration
      pointsRef.current.position.y = Math.sin(time * 0.5) * 0.15;
    }

    // 3. Update flowing data packets along pipeline lines
    if (packetGeometry) {
      const positions = packetGeometry.attributes.position.array;
      packets.forEach((pkt, i) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          pkt.progress = 0;
          // Loop or shuffle target node
          const maxNodes = nodePositions.length / 3;
          pkt.startIdx = Math.floor(Math.random() * (maxNodes - 2));
          pkt.endIdx = pkt.startIdx + 1;
        }

        const sx = nodePositions[pkt.startIdx * 3];
        const sy = nodePositions[pkt.startIdx * 3 + 1];
        const sz = nodePositions[pkt.startIdx * 3 + 2];

        const ex = nodePositions[pkt.endIdx * 3];
        const ey = nodePositions[pkt.endIdx * 3 + 1];
        const ez = nodePositions[pkt.endIdx * 3 + 2];

        positions[i * 3] = sx + (ex - sx) * pkt.progress;
        positions[i * 3 + 1] = sy + (ey - sy) * pkt.progress;
        positions[i * 3 + 2] = sz + (ez - sz) * pkt.progress;
      });
      packetGeometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={sceneRef}>
      {/* 1. Node Network Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#22d3ee" // Cyan
          size={0.16}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.7}
        />
      </points>

      {/* 2. Connection Pipes (Line Segments) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#1e293b" // slate-800
          transparent={true}
          opacity={0.35}
          linewidth={1}
        />
      </lineSegments>

      {/* 3. Fast Data Packets */}
      <points geometry={packetGeometry}>
        <pointsMaterial
          color="#34d399" // Emerald
          size={0.25}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.9}
        />
      </points>
      
      {/* Ambient lighting shifts */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 15, 5]} intensity={0.6} color="#22d3ee" />
      <directionalLight position={[-5, -15, -5]} intensity={0.3} color="#10b981" />
    </group>
  );
}

export default function Pipeline3D() {
  const [useFallback, setUseFallback] = useState(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setUseFallback(isMobile || prefersReducedMotion);
  }, []);

  // Avoid hydration flashes
  if (useFallback === null) {
    return <div className="fixed inset-0 -z-50 bg-slate-950" />;
  }

  // Fallback rendering: Render a lightweight, visually matching CSS grid & color blobs
  if (useFallback) {
    return (
      <div className="fixed inset-0 -z-50 bg-slate-950 cyber-grid cyber-grid-dots overflow-hidden">
        <div className="absolute top-[-10%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[80vw] h-[80vw] rounded-full bg-emerald-900/10 blur-[130px] pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-50 bg-[#020617] overflow-hidden pointer-events-none">
      {/* Cyber Grid pattern behind the canvas */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full block"
      >
        <PipelineScene />
      </Canvas>
    </div>
  );
}
