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

// Module-level cache to prevent HMR Hook Order changes and memory leaks
let cachedTextures = null;
function getCodeTextures() {
  if (cachedTextures) return cachedTextures;

  cachedTextures = codeSnippets.map(text => {
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

  return cachedTextures;
}

// 3D Experience Card plane using drei <Html transform occlude>
function ExperienceCard3D({ exp, idx, lerpedProgress }) {
  const cardRef = useRef();

  useFrame(() => {
    if (!cardRef.current) return;
    
    // Position/rotation orbital formulas driven by scroll progress (N-1 active phases)
    const p = lerpedProgress.current * (experience.length - 1);
    const offset = idx - p;

    // Visibility range limit (fits the 3-card orbit curve visual in screenshots)
    const isVisible = Math.abs(offset) < 1.1;
    cardRef.current.visible = isVisible;

    if (isVisible) {
      const angle = idx * 1.5; // fixed angle position inside group
      const radius = 3.2;
      
      // Card coordinates relative to parent group
      cardRef.current.position.x = Math.sin(angle) * radius;
      cardRef.current.position.z = Math.cos(angle) * radius;
      cardRef.current.position.y = -offset * 0.45;
      
      // Face camera: group Y-rotation is offset, we compensate here to billboard the card
      const groupRotY = -lerpedProgress.current * Math.PI * 1.2;
      cardRef.current.rotation.y = -groupRotY;
      cardRef.current.rotation.x = Math.abs(offset) * 0.08;

      // Scale down slightly when far away
      const scale = 1 - Math.abs(offset) * 0.22;
      cardRef.current.scale.set(scale, scale, 1);
    }
  });

  const [opacity, setOpacity] = useState(0);

  useFrame(() => {
    const p = lerpedProgress.current * (experience.length - 1);
    const offset = idx - p;
    const dist = Math.abs(offset);
    
    // Sharp cross-fade: card goes completely transparent when rotated to the opposite side
    const currentOpacity = dist < 1.1 ? Math.pow((1.1 - dist) / 1.1, 1.8) : 0;
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
        {/* Solid dark panel backdrop + blur to completely block background code text */}
        <div className="w-[450px] p-6 bg-slate-950/95 backdrop-blur-lg border border-cyan-500/20 rounded-2xl text-left select-none hover:border-cyan-500/35 transition-colors shadow-2xl relative">
          
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
                <CheckCircle2 className="w-4.5 h-4.5 text-cyan-500/60 flex-shrink-0 mt-0.5" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      </Html>
    </group>
  );
}

// 3D Spinal Vertebra Segment (Biological detailing using multiple primitives matching reference screenshot)
function VertebraSegment3D({ pos, angle, isActive }) {
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isActive ? "#22d3ee" : "#0f172a",
      emissive: isActive ? "#22d3ee" : "#1e293b",
      emissiveIntensity: isActive ? 2.5 : 0.25,
      roughness: 0.2,
      metalness: 0.85,
      transparent: !isActive,
      opacity: !isActive ? 0.65 : 1.0
    });
  }, [isActive]);

  return (
    <group position={pos} rotation={[0, 0, angle]}>
      {/* 1. Central Vertebral Body Disc */}
      <mesh>
        <cylinderGeometry args={[0.22, 0.24, 0.12, 16]} />
        <primitive object={material} />
      </mesh>

      {/* 2. Left Transverse Process Wing */}
      <mesh position={[-0.32, 0, 0]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.22, 0.05, 0.1]} />
        <primitive object={material} />
      </mesh>

      {/* 3. Right Transverse Process Wing */}
      <mesh position={[0.32, 0, 0]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.22, 0.05, 0.1]} />
        <primitive object={material} />
      </mesh>

      {/* 4. Spinous Process (Spinal rear protrusion) */}
      <mesh position={[0, 0, -0.22]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.25]} />
        <primitive object={material} />
      </mesh>

      {/* Lateral endpoint process nodes */}
      <mesh position={[-0.43, 0, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={isActive ? "#22d3ee" : "#334155"} />
      </mesh>
      <mesh position={[0.43, 0, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={isActive ? "#22d3ee" : "#334155"} />
      </mesh>
    </group>
  );
}

// 3D Vertebral Spine Container (Using actual Three.js curve and cylinder geometry)
function Spine3D({ lerpedProgress }) {
  const spineRef = useRef();
  const numSegs = 16;
  const height = 4.2;
  const sway = 0.24;

  // 1. Create a THREE.CatmullRomCurve3 S-curve path
  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const y = 2.1 - t * height;
      const x = Math.sin(t * Math.PI * 2) * sway;
      const z = Math.cos(t * Math.PI * 2) * 0.08;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // 2. Generate vertebra mesh data placed at intervals along the tangent of the curve
  const vertebraData = useMemo(() => {
    const list = [];
    for (let i = 0; i < numSegs; i++) {
      const t = i / (numSegs - 1);
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      
      // Quaternion math to align cylinder up vector with curve tangent
      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangent);
      const euler = new THREE.Euler().setFromQuaternion(quaternion);
      
      list.push({
        pos: [pos.x, pos.y, pos.z],
        rot: [euler.x, euler.y, euler.z]
      });
    }
    return list;
  }, [curve]);

  useFrame(() => {
    if (!spineRef.current) return;
    // Rotate the spine locally on its vertical axis as we scroll
    spineRef.current.rotation.y = lerpedProgress.current * Math.PI * 4;
  });

  return (
    <group ref={spineRef} position={[0, 0, 0]}>
      {/* Main Spinal Column Core (TubeGeometry along the S-curve) */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.02, 8, false]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981" 
          emissiveIntensity={0.6} 
          transparent={true} 
          opacity={0.4} 
        />
      </mesh>

      {/* Vertebra segments (Individual 3D biological vertebral models catching light) */}
      {vertebraData.map((vert, idx) => {
        const activeSegIdx = Math.min(
          Math.floor(lerpedProgress.current * numSegs),
          numSegs - 1
        );
        const isActive = activeSegIdx === idx;
        
        return (
          <VertebraSegment3D
            key={idx}
            pos={vert.pos}
            angle={vert.rot[2]} // Z rotation alignment
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
  const codeTextures = getCodeTextures(); // Hook-free cached texture mapping

  // Scroll Trigger trackers
  const globalScrollProgress = useRef(0);
  const expScrollProgress = useRef(0);
  const lerpedExpProgress = useRef(0);

  // Generate node structures & connection line positions
  const { nodeData, linePositions, packets } = useMemo(() => {
    const nodeCount = 45;
    const positions = [];
    const nodes = [];

    // Spawns nodes strictly in background depth plane (z <= -6.5) to fix overlap collision
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 15.0; // horizontal spread
      const y = -i * 0.8 + 8; // vertical spread
      const z = -6.5 - Math.random() * 8.0; // depth plane strictly behind cards
      
      positions.push(x, y, z);
      
      nodes.push({
        pos: [x, y, z],
        textureIdx: Math.floor(Math.random() * codeSnippets.length),
        scale: 1.3 + Math.random() * 0.7,
        opacity: 0.1 + Math.random() * 0.12
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

  // Bind ScrollTriggers for camera timeline
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
      .to(camera.position, { x: 0, y: -11.5, z: 8.5, ease: "none" })  // Skills -> Experience (Centered camera at x=0 matching reference!)
      .to(camera.position, { x: -2.5, y: -18.5, z: 11.5, ease: "none" }) // Experience -> Projects
      .to(camera.position, { x: 0, y: -25.5, z: 9.5, ease: "none" })    // Projects -> Certifications
      .to(camera.position, { x: 1, y: -31.5, z: 11, ease: "none" });   // Certifications -> Contact

    return () => {
      if (globalTL.scrollTrigger) globalTL.scrollTrigger.kill();
      globalTL.kill();
    };
  }, [camera]);

  const packetGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(packets.length * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [packets]);

  // Dev progress log reference
  const lastLoggedProgress = useRef(-1);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Dynamically look at the center of the active vertical section to keep R3F Canvas view level
    camera.lookAt(0, camera.position.y, 0);

    // Capture experience scroll progress dynamically from window global
    const progressVal = window.experienceScrollProgress || 0;
    expScrollProgress.current = progressVal;

    // Smooth lerp experience scroll progress
    lerpedExpProgress.current += (expScrollProgress.current - lerpedExpProgress.current) * 0.08;

    // Log progress metrics to verify connection works correctly
    if (Math.abs(lerpedExpProgress.current - lastLoggedProgress.current) > 0.05) {
      console.log(`[R3F Experience3D] Scroll Progress: ${lerpedExpProgress.current.toFixed(3)}, Spine Orbit rotation.y: ${(lerpedExpProgress.current * Math.PI * 4).toFixed(3)}`);
      lastLoggedProgress.current = lerpedExpProgress.current;
    }

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
      {/* 1. Floating 3D Code Snippet Sprites (Restricted to background plane) */}
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

      {/* 2. Connection Pipes (Background restricted) */}
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

      {/* 4. Experience 3D orbit carousel nodes (Centered around central spine axis) */}
      <group position={[0, -11.5, -0.6]}>
        
        {/* Real 3D Vertebral Spine column structure (Central Axis) */}
        <Spine3D lerpedProgress={lerpedExpProgress} />

        {/* Orbiting group swinging cards around central spine axis */}
        <group rotation={[0, -lerpedExpProgress.current * Math.PI * 1.2, 0]}>
          {experience.map((exp, idx) => (
            <ExperienceCard3D
              key={idx}
              idx={idx}
              exp={exp}
              lerpedProgress={lerpedExpProgress}
            />
          ))}
        </group>

      </group>
      
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
