import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';
import './SplashAnimacion3D.css';

const figureNames = ['cabra', 'castillo', 'persona'];
const PIECES_DATA = [
  { color: '#cd0e66', vertices: [[-100, -50], [0, 50], [100, -50]], states: [ { p: { x: -67.2, y: -40.0 }, r: 111 }, { p: { x: 66.5, y: -0.7 }, r: 180 }, { p: { x: 41.6, y: 78.4 }, r: 225 } ] },
  { color: '#0f82f2', vertices: [[-100, -50], [0, 50], [100, -50]], states: [ { p: { x: 54.2, y: -8.3 }, r: 291 }, { p: { x: -67.3, y: 70.7 }, r: 180 }, { p: { x: -29.1, y: 7.7 }, r: 45 } ] },
  { color: '#6d3bbf', vertices: [[-50, -50], [50, -50], [50, 50]], states: [ { p: { x: 75.6, y: -92.2 }, r: 246 }, { p: { x: -32.7, y: -120.7 }, r: 315 }, { p: { x: 0.0, y: -77.7 }, r: 269 } ] },
  { color: '#fd8c00', vertices: [[-75, 25], [25, 25], [75, -25], [-25, -25]], states: [ { p: { x: 29.0, y: 135.3 }, r: 21 }, { p: { x: -68.0, y: -49.0 }, r: 315 }, { p: { x: 25.0, y: -102.7 }, r: 270 } ] },
  { color: '#eb4726', vertices: [[0, -25], [50, 25], [-50, 25]], states: [ { p: { x: -142.1, y: 10.2 }, r: 260 }, { p: { x: 20.4, y: -67.7 }, r: 45 }, { p: { x: 50.0, y: -152.7 }, r: 0 } ] },
  { color: '#009ea6', vertices: [[0, -25], [50, 25], [-50, 25]], states: [ { p: { x: 127.8, y: 44.0 }, r: 21 }, { p: { x: -85.7, y: 3.0 }, r: 315 }, { p: { x: -75.0, y: -134.4 }, r: 270 } ] },
  { color: '#22ab24', vertices: [[-50, 0], [0, -50], [50, 0], [0, 50]], states: [ { p: { x: 90.1, y: 85.1 }, r: 21 }, { p: { x: 130.0, y: -88.4 }, r: 45 }, { p: { x: 31.2, y: 149.1 }, r: 45 } ] },
];

export default function SplashAnimacion3D({ onFinish }) {
  const mountRef = useRef();
  const figureNameRef = useRef();
  const infoTextRef = useRef();
  const piecesRef = useRef([]);
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    currentFigureIndex: 0,
    isMounted: true,
  });
  const currentFigureIndexRef = useRef(0);

  useEffect(() => {
    // Cargar fuente Inter de Google Fonts (solo una vez)
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    let { scene, camera, renderer, controls } = stateRef.current;
    let animationId;
    stateRef.current.isMounted = true;

    // Timer para cerrar splash
    let splashTimer;
    if (onFinish) {
      splashTimer = setTimeout(() => { onFinish(); }, 30000); // 30 segundos
    }

    // --- Init ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 300);
    camera.lookAt(scene.position);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 200);
    scene.add(directionalLight);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // --- Pieces ---
    piecesRef.current = [];
    PIECES_DATA.forEach((data, idx) => {
      const shape = new THREE.Shape();
      shape.moveTo(data.vertices[0][0], -data.vertices[0][1]);
      for (let i = 1; i < data.vertices.length; i++) {
        shape.lineTo(data.vertices[i][0], -data.vertices[i][1]);
      }
      const geometry = new THREE.ExtrudeGeometry(shape, {
        steps: 1, depth: 15, bevelEnabled: true,
        bevelThickness: 2, bevelSize: 1, bevelOffset: 0, bevelSegments: 2
      });
      geometry.center();
      const material = new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.1, roughness: 0.6 });
      const mesh = new THREE.Mesh(geometry, material);
      const initialState = data.states[0];
      mesh.position.set(initialState.p.x, initialState.p.y, 0);
      mesh.rotation.z = THREE.MathUtils.degToRad(-initialState.r);
      if (idx === 3 && initialState.r === 270) mesh.scale.x = -1;
      scene.add(mesh);
      piecesRef.current.push(mesh);
    });

    // --- Animation Loop ---
    function animate(time) {
      if (!stateRef.current.isMounted) return;
      animationId = requestAnimationFrame(animate);
      TWEEN.update(time);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // --- Figure Transitions ---
    let figureInterval;
    function transitionToFigure(figureIndex) {
      if (figureNameRef.current) {
        figureNameRef.current.style.opacity = 0;
        setTimeout(() => {
          if (figureNameRef.current) {
            figureNameRef.current.textContent = figureNames[figureIndex];
            figureNameRef.current.style.opacity = 1;
          }
        }, 500);
      }
      piecesRef.current.forEach(piece => {
        new TWEEN.Tween(piece.position)
          .to({ z: 150 }, 600)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
      });
      setTimeout(() => {
        piecesRef.current.forEach((piece, i) => {
          setTimeout(() => {
            const targetState = PIECES_DATA[i].states[figureIndex];
            const targetPosition = targetState.p;
            const targetRotation = THREE.MathUtils.degToRad(-targetState.r);
            new TWEEN.Tween(piece.position)
              .to({ x: targetPosition.x, y: targetPosition.y, z: 0 }, 1000)
              .easing(TWEEN.Easing.Back.Out)
              .start();
            new TWEEN.Tween(piece.rotation)
              .to({ z: targetRotation }, 1000)
              .easing(TWEEN.Easing.Circular.Out)
              .start();
            if (i === 3) {
              const targetScaleX = (targetState.r === 270) ? -1 : 1;
              new TWEEN.Tween(piece.scale)
                .to({ x: targetScaleX }, 1000)
                .easing(TWEEN.Easing.Elastic.Out)
                .start();
            }
          }, i * 300);
        });
      }, 600);
    }
    // Iniciar con la primera figura
    transitionToFigure(currentFigureIndexRef.current);
    // Cambiar de figura cada 10 segundos
    figureInterval = setInterval(() => {
      currentFigureIndexRef.current = (currentFigureIndexRef.current + 1) % figureNames.length;
      transitionToFigure(currentFigureIndexRef.current);
    }, 10000);

    // --- Resize ---
    function handleResize() {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      stateRef.current.isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (renderer) {
        renderer.dispose && renderer.dispose();
        renderer.forceContextLoss && renderer.forceContextLoss();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      cancelAnimationFrame(animationId);
      if (splashTimer) clearTimeout(splashTimer);
      if (figureInterval) clearInterval(figureInterval);
    };
  }, [onFinish]);

  // Splash layout
  return (
    <div className="splash-3d-bg">
      <div id="header" className="splash-3d-header">
        <div id="figure-name" ref={figureNameRef} className="splash-3d-figure">Cabra</div>
        <div id="info-text" ref={infoTextRef} className="splash-3d-info">Arrastra el ratón para rotar la vista | Rueda para acercar/alejar</div>
      </div>
      <div id="container" ref={mountRef} className="splash-3d-canvas"></div>
    </div>
  );
} 