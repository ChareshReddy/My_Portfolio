import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Core Data Engineer Code Snippets
const codeSnippets = [
  "df.groupBy('region').agg(sum('sales'))",
  "spark.read.format('delta').load()",
  "WindowSpec.partitionBy('cust_id')",
  "dbutils.fs.mv(source, target)",
  "SELECT SUM(amount) FROM raw_sales",
  "df.write.mode('overwrite').save()",
  "spark.sql('OPTIMIZE gold.metrics')",
  "df.filter(df.status == 'SUCCESS')",
  "zOrderBY('transaction_date')",
  "spark.read.json('lakehouse/raw')",
  "schema = StructType([StructField...])",
  "df.withColumn('load_date', current_date())",
  "df.join(dim_df, 'product_id', 'left')",
  "spark.conf.set('spark.shuffle.partitions', 200)",
  "dbutils.notebook.run('etl_silver', 3600)",
  "df.dropDuplicates(['transaction_id'])",
  "deltaTable.alias('t').merge(df.alias('s'))",
  "spark.readStream.format('cloudFiles').load()",
  "df.cache().count()",
  "SELECT * FROM silver.orders WHERE active=1"
];

// Pre-render code snippets onto canvas textures for hardware-accelerated 3D sprites
function useCodeTextures() {
  const textures = useMemo(() => {
    return codeSnippets.map(text => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      ctx.font = 'bold 15px monospace';
      const textWidth = Math.ceil(ctx.measureText(text).width);
      canvas.width = textWidth + 12;
      canvas.height = 28;
      
      // Clear background
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Neon green/cyan text
      ctx.font = 'bold 15px monospace';
      const color = Math.random() > 0.5 ? '#22d3ee' : '#34d399';
      ctx.fillStyle = color;
      ctx.fillText(text, 6, 18);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    });
  }, []);

  useEffect(() => {
    return () => {
      textures.forEach(t => t.dispose());
    };
  }, [textures]);

  return textures;
}

function PipelineScene() {
  const { camera } = useThree();
  const sceneRef = useRef();
  const linesRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const codeTextures = useCodeTextures();

  // Generate node structures & connection line positions
  const { nodeData, linePositions, packets } = useMemo(() => {
    const nodeCount = 45;
    const positions = [];
    const nodes = [];

    // Generate node positions vertically down in a helix/spiral
    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 14; // spiral downwards
      const radius = 3.5 + Math.random() * 1.5;
      const x = Math.cos(theta) * radius;
      const y = -i * 0.8 + 8; // spread vertically down to y=-28
      const z = Math.sin(theta) * radius;
      
      positions.push(x, y, z);
      
      nodes.push({
        pos: [x, y, z],
        textureIdx: Math.floor(Math.random() * codeSnippets.length),
        scale: 1.2 + Math.random() * 0.6,
        opacity: 0.15 + Math.random() * 0.15 // low opacity to prevent text clashing
      });
    }

    // Connect nodes into pipeline path (lines segments)
    const lineIndices = [];
    for (let i = 0; i < nodeCount - 1; i++) {
      lineIndices.push(
        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
        positions[(i + 1) * 3], positions[(i + 1) * 3 + 1], positions[(i + 1) * 3 + 2]
      );
      
      if (i < nodeCount - 3 && Math.random() > 0.65) {
        const nextIdx = i + 3;
        lineIndices.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[nextIdx * 3], positions[nextIdx * 3 + 1], positions[nextIdx * 3 + 2]
        );
      }
    }

    // Data packets properties
    const packetCount = 30;
    const packetData = [];
    for (let i = 0; i < packetCount; i++) {
      const startIndex = Math.floor(Math.random() * (nodeCount - 3));
      packetData.push({
        startIdx: startIndex,
        endIdx: startIndex + 1,
        progress: Math.random(),
        speed: 0.01 + Math.random() * 0.015
      });
    }

    return {
      nodeData: nodes,
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

  // Setup GSAP camera scroll timeline scrub
  useEffect(() => {
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      }
    });

    tl.to(camera.position, { x: 2, y: 1.5, z: 9, ease: "none" })      // Hero -> About
      .to(camera.position, { x: -3.5, y: -4.5, z: 10, ease: "none" })  // About -> Skills
      .to(camera.position, { x: 3.5, y: -11.5, z: 8.5, ease: "none" }) // Skills -> Experience
      .to(camera.position, { x: -2.5, y: -18.5, z: 11.5, ease: "none" }) // Experience -> Projects
      .to(camera.position, { x: 0, y: -25.5, z: 9.5, ease: "none" })    // Projects -> Certifications
      .to(camera.position, { x: 1, y: -31.5, z: 11, ease: "none" });   // Certifications -> Contact

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [camera]);

  const packetGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(packets.length * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [packets]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Mouse tilt Parallax
    if (sceneRef.current) {
      sceneRef.current.rotation.y += (mouse.current.x * 0.12 - sceneRef.current.rotation.y) * 0.05;
      sceneRef.current.rotation.x += (-mouse.current.y * 0.08 - sceneRef.current.rotation.x) * 0.05;
    }

    // Update packets
    if (packetGeometry) {
      const positions = packetGeometry.attributes.position.array;
      const maxNodes = nodeData.length;
      packets.forEach((pkt, i) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          pkt.progress = 0;
          pkt.startIdx = Math.floor(Math.random() * (maxNodes - 2));
          pkt.endIdx = pkt.startIdx + 1;
        }

        const sPos = nodeData[pkt.startIdx].pos;
        const ePos = nodeData[pkt.endIdx].pos;

        positions[i * 3] = sPos[0] + (ePos[0] - sPos[0]) * pkt.progress;
        positions[i * 3 + 1] = sPos[1] + (ePos[1] - sPos[1]) * pkt.progress;
        positions[i * 3 + 2] = sPos[2] + (ePos[2] - sPos[2]) * pkt.progress;
      });
      packetGeometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={sceneRef}>
      {/* 1. Floating 3D Code Snippet Sprites (Replacing static dots) */}
      {nodeData.map((node, i) => (
        <sprite 
          key={i} 
          position={node.pos} 
          scale={[node.scale * 1.5, node.scale * 0.5, 1]}
        >
          <spriteMaterial
            attach="material"
            map={codeTextures[node.textureIdx]}
            transparent={true}
            opacity={node.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}

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
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 15, 5]} intensity={0.6} color="#22d3ee" />
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

  if (useFallback === null) {
    return <div className="fixed inset-0 z-0 bg-slate-950" />;
  }

  if (useFallback) {
    return (
      <div className="fixed inset-0 z-0 bg-slate-950 cyber-grid cyber-grid-dots overflow-hidden">
        <div className="absolute top-[-10%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[80vw] h-[80vw] rounded-full bg-emerald-900/10 blur-[130px] pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 bg-[#020617] overflow-hidden pointer-events-none">
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
