import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Terminal, CheckCircle2 } from 'lucide-react';
import { experience } from '../data/content';

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

// 3D Experience Card plane using drei <Html transform occlude>
function ExperienceCard3D({ exp, idx, lerpedProgress }) {
  const cardRef = useRef();

  useFrame(() => {
    if (!cardRef.current) return;
    
    // Position/rotation orbital formulas driven by scroll progress (N-1 active phases)
    const p = lerpedProgress.current * (experience.length - 1);
    const offset = idx - p;

    // Visibility range limit (only render nearest cards for high performance)
    const isVisible = Math.abs(offset) < 1.35;
    cardRef.current.visible = isVisible;

    if (isVisible) {
      const angle = offset * 1.5; // spacing orbit angle
      const radius = 3.6;
      
      // Coordinate placement relative to the viewport
      cardRef.current.position.x = -1.35 + Math.sin(angle) * radius;
      cardRef.current.position.z = Math.cos(angle) * radius - 3.6;
      cardRef.current.position.y = -11.5 - offset * 0.45;
      
      // Rotation tilt to face-on the camera when active
      cardRef.current.rotation.y = -angle * 0.85;
      
      // Slight mechanical roll/pitch
      cardRef.current.rotation.x = Math.abs(offset) * 0.05;

      // Scale down slightly when far away
      const scale = 1 - Math.abs(offset) * 0.22;
      cardRef.current.scale.set(scale, scale, 1);
    }
  });

  // Calculate dynamic opacity styling outside for DOM element
  const [opacity, setOpacity] = useState(0);

  useFrame(() => {
    const p = lerpedProgress.current * (experience.length - 1);
    const offset = idx - p;
    const currentOpacity = Math.max(0, 1 - Math.abs(offset) * 1.55);
    setOpacity(currentOpacity);
  });

  return (
    <group ref={cardRef}>
      <Html 
        transform 
        occlude="blending" 
        distanceFactor={6.8}
        style={{ 
          opacity: opacity,
          transition: 'opacity 0.15s ease-out',
          pointerEvents: opacity > 0.4 ? 'auto' : 'none'
        }}
      >
        <div className="w-[450px] p-6 glass-panel border border-cyan-500/20 rounded-2xl text-left select-none hover:border-cyan-500/35 transition-colors shadow-2xl relative">
          
          {/* Header Badge */}
          <div className="flex items-center justify-between gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/25 text-cyan-400 font-mono text-[10px] uppercase font-semibold">
              {exp.type}
            </span>
            {exp.highlights && (
              <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 font-mono font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                {exp.highlights}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-50 font-display">
            {exp.role}
          </h3>
          <div className="text-sm font-semibold text-slate-350 mt-1">
            {exp.company}
          </div>

          {/* Details metadata */}
          <div className="flex items-center gap-4 mt-3 mb-5 font-mono text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{exp.period}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{exp.location}</span>
            </div>
          </div>

          {/* Highlights logs */}
          <ul className="space-y-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
            {exp.achievements.map((ach, aIdx) => (
              <li key={aIdx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500/60 flex-shrink-0 mt-0.5" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      </Html>
    </group>
  );
}

// 3D Spinal Vertebral Column Segment
function VertebraSegment3D({ pos, angle, isActive }) {
  return (
    <group position={pos} rotation={[0, 0, angle]}>
      {/* Transverse Processes (lateral endpoints) */}
      <mesh position={[-0.22, 0, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={isActive ? "#22d3ee" : "#334155"} />
      </mesh>
      <mesh position={[0.22, 0, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={isActive ? "#22d3ee" : "#334155"} />
      </mesh>

      {/* Vertebra Main Body Capsule */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.045, 0.28, 4, 8]} />
        <meshBasicMaterial 
          color={isActive ? "#22d3ee" : "#0f172a"} 
          transparent={!isActive}
          opacity={!isActive ? 0.35 : 1}
        />
      </mesh>
    </group>
  );
}

// 3D Vertebral Spine Container
function Spine3D({ lerpedProgress }) {
  const spineRef = useRef();
  const numSegs = 16;

  // Pre-calculate anatomical 3D S-curve vertices
  const spineSegments = useMemo(() => {
    const segments = [];
    const height = 3.6; // height span in 3D
    const sway = 0.22;  // sway curvature width
    
    for (let i = 0; i < numSegs; i++) {
      const t = i / (numSegs - 1);
      const y = 1.8 - t * height;
      const x = Math.sin(t * Math.PI * 2) * sway;
      const z = Math.cos(t * Math.PI * 2) * 0.08; // subtle depth S-curve
      
      const dx = sway * Math.PI * 2 * Math.cos(t * Math.PI * 2);
      const dy = -height;
      const angle = Math.atan2(dx, dy);
      
      segments.push({ pos: [x, y, z], angle });
    }
    return segments;
  }, []);

  useFrame(() => {
    if (!spineRef.current) return;
    // Rotate spine continuously based on scroll progress
    spineRef.current.rotation.y = lerpedProgress.current * Math.PI * 4;
  });

  return (
    <group ref={spineRef} position={[2.0, -11.5, -0.6]}>
      {spineSegments.map((seg, idx) => {
        // Highlight active vertebra segment based on progress
        const activeSegIdx = Math.min(
          Math.floor(lerpedProgress.current * numSegs),
          numSegs - 1
        );
        const isActive = activeSegIdx === idx;
        
        return (
          <VertebraSegment3D
            key={idx}
            pos={seg.pos}
            angle={seg.angle}
            isActive={isActive}
          />
        );
      })}
    </group>
  );
}

function PipelineScene() {
  const { camera } = useThree();
  const sceneRef = useRef();
  const linesRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const codeTextures = useCodeTextures();

  // Scroll Trigger trackers for global and experience sections
  const globalScrollProgress = useRef(0);
  const expScrollProgress = useRef(0);
  const lerpedExpProgress = useRef(0);

  // Generate node structures & connection line positions
  const { nodeData, linePositions, packets } = useMemo(() => {
    const nodeCount = 45;
    const positions = [];
    const nodes = [];

    // Generate node positions vertically down in a helix/spiral
    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 14;
      const radius = 3.5 + Math.random() * 1.5;
      const x = Math.cos(theta) * radius;
      const y = -i * 0.8 + 8;
      const z = Math.sin(theta) * radius;
      
      positions.push(x, y, z);
      
      nodes.push({
        pos: [x, y, z],
        textureIdx: Math.floor(Math.random() * codeSnippets.length),
        scale: 1.2 + Math.random() * 0.6,
        opacity: 0.15 + Math.random() * 0.15
      });
    }

    // Connect nodes into pipeline path
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

  // Bind ScrollTriggers for camera timeline and experience scroll
  useEffect(() => {
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    // Global Camera scroll timeline scrub
    const globalTL = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          globalScrollProgress.current = self.progress;
        }
      }
    });

    globalTL.to(camera.position, { x: 2, y: 1.5, z: 9, ease: "none" })      // Hero -> About
      .to(camera.position, { x: -3.5, y: -4.5, z: 10, ease: "none" })  // About -> Skills
      .to(camera.position, { x: 3.5, y: -11.5, z: 8.5, ease: "none" }) // Skills -> Experience (Camera focuses here)
      .to(camera.position, { x: -2.5, y: -18.5, z: 11.5, ease: "none" }) // Experience -> Projects
      .to(camera.position, { x: 0, y: -25.5, z: 9.5, ease: "none" })    // Projects -> Certifications
      .to(camera.position, { x: 1, y: -31.5, z: 11, ease: "none" });   // Certifications -> Contact

    // Experience-specific Pinned ScrollTrigger
    const expTrigger = ScrollTrigger.create({
      trigger: "#experience",
      start: "top top",
      end: "+=200%",
      scrub: true,
      onUpdate: (self) => {
        expScrollProgress.current = self.progress;
      }
    });

    return () => {
      if (globalTL.scrollTrigger) globalTL.scrollTrigger.kill();
      globalTL.kill();
      expTrigger.kill();
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

    // Lerp experience scroll progress for smooth transition motions
    lerpedExpProgress.current += (expScrollProgress.current - lerpedExpProgress.current) * 0.08;

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
      {/* 1. Floating 3D Code Snippet Sprites */}
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

      {/* 2. Connection Pipes */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#1e293b"
          transparent={true}
          opacity={0.35}
          linewidth={1}
        />
      </lineSegments>

      {/* 3. Fast Data Packets */}
      <points geometry={packetGeometry}>
        <pointsMaterial
          color="#34d399"
          size={0.25}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.9}
        />
      </points>

      {/* 4. Experience 3D orbit carousel nodes */}
      <group>
        {experience.map((exp, idx) => (
          <ExperienceCard3D
            key={idx}
            idx={idx}
            exp={exp}
            lerpedProgress={lerpedExpProgress}
          />
        ))}
      </group>

      {/* 5. 3D Spine column structure */}
      <Spine3D lerpedProgress={lerpedExpProgress} />
      
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
