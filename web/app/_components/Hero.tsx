"use client";

import fragment from "@/shaders/fragment";
import vertex from "@/shaders/vertex";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const spawnInterval = 0.8;
    let lastSpawn = 0;
    let animationFrame: number;
    let elapsedTime = 0;
    let lastRealTime = Date.now();

    // Textures

    let currentMesh = 0;
    let currentTexture = 0;
    const texturesCount = 20;

    const textureLoader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];

    for (let i = 0; i < texturesCount; i++) {
      const texture = textureLoader.load(`/creations/image-${i + 1}.png`);
      textures.push(texture);
    }

    function getTexture() {
      currentTexture = (currentTexture + 1) % texturesCount;
      return textures[currentTexture];
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.01,
      1000
    );

    camera.position.z = 0;
    camera.position.y = 20;

    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Meshes

    const parameters = {
      branches: 6,
      scale: 3,
      opacity: 0.5,
      radius: 15,
    };

    const group = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(1.8, 1.8);
    const planes: {
      material: THREE.ShaderMaterial;
      mesh: THREE.Mesh;
      startTime: number;
    }[] = [];

    for (let i = 0; i < parameters.branches; i++) {
      const angle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
      spawnPlane(angle);
    }

    scene.add(group);

    // Renderer

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const animate = () => {
      const now = Date.now();
      const delta = (now - lastRealTime) / 1000;
      lastRealTime = now;
      elapsedTime += delta;

      renderer.render(scene, camera);

      if (elapsedTime - lastSpawn > spawnInterval) {
        for (let i = 0; i < parameters.branches; i++) {
          const angle =
            ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
          spawnPlane(angle);
          lastSpawn = elapsedTime;
        }
      }

      planes.forEach((plane, index) => {
        const passedTime = elapsedTime - plane.startTime;
        plane.material.uniforms.uTime.value = passedTime;
        plane.material.uniforms.uOpacity.value = Math.min(
          0.7,
          passedTime * 0.2
        );

        const radius = plane.material.uniforms.uRadius.value;

        plane.material.uniforms.uScale.value =
          parameters.scale * Math.pow(radius / parameters.radius, 2);

        plane.material.uniforms.uRadius.value +=
          0.23 * (passedTime * 0.09) - Math.pow(passedTime * 0.1, 2);

        if (plane.material.uniforms.uRadius.value <= 1.5) {
          scene.remove(plane.mesh);
          plane.material.dispose();
          plane.mesh.geometry.dispose();
          planes.splice(index, 1);
        }
      });

      animationFrame = window.requestAnimationFrame(animate);
    };

    animate();

    function spawnPlane(angle: number) {
      const material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        side: THREE.DoubleSide,
        alphaTest: 0.1,
        uniforms: {
          uRadius: { value: parameters.radius },
          uTime: { value: 0 },
          uStartAngle: { value: angle },
          uScale: { value: parameters.scale },
          uOpacity: { value: parameters.opacity },
          uTexture: { value: getTexture() },
        },
        transparent: true,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = -5;
      mesh.renderOrder = currentMesh;
      currentMesh--;
      group.add(mesh);

      planes.push({
        mesh,
        material,
        startTime: elapsedTime,
      });
    }

    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center -z-10">
      <canvas ref={canvasRef} className="h-full w-full absolute -z-20"></canvas>
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-9xl font-bold">ATOM</h1>
        <p className="text-4xl">Image Sharing Platform</p>
      </div>
    </div>
  );
};

export default Hero;
