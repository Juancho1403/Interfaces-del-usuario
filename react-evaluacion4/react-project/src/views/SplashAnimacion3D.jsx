import React, { useEffect, useRef, useState } from 'react';
import TWEEN from '@tweenjs/tween.js';
import './SplashAnimacion3D.css';

const figureNames = ['cabra', 'castillo', 'persona'];
const coloresFigurasSplash = JSON.parse(localStorage.getItem('coloresFigurasSplash'));
const PIECES_DATA = [
  { vertices: [[-100, -50], [0, 50], [100, -50]], states: [ { p: { x: -67.2, y: -40.0 }, r: 111 }, { p: { x: 66.5, y: -0.7 }, r: 180 }, { p: { x: 41.6, y: 78.4 }, r: 225 } ] },
  { vertices: [[-100, -50], [0, 50], [100, -50]], states: [ { p: { x: 54.2, y: -8.3 }, r: 291 }, { p: { x: -67.3, y: 70.7 }, r: 180 }, { p: { x: -29.1, y: 7.7 }, r: 45 } ] },
  { vertices: [[-50, -50], [50, -50], [50, 50]], states: [ { p: { x: 75.6, y: -92.2 }, r: 246 }, { p: { x: -32.7, y: -120.7 }, r: 315 }, { p: { x: 0.0, y: -77.7 }, r: 269 } ] },
  { vertices: [[-75, 25], [25, 25], [75, -25], [-25, -25]], states: [ { p: { x: 29.0, y: 135.3 }, r: 21 }, { p: { x: -68.0, y: -49.0 }, r: 315 }, { p: { x: 25.0, y: -102.7 }, r: 270 } ] },
  { vertices: [[0, -25], [50, 25], [-50, 25]], states: [ { p: { x: -142.1, y: 10.2 }, r: 260 }, { p: { x: 20.4, y: -67.7 }, r: 45 }, { p: { x: 50.0, y: -152.7 }, r: 0 } ] },
  { vertices: [[0, -25], [50, 25], [-50, 25]], states: [ { p: { x: 127.8, y: 44.0 }, r: 21 }, { p: { x: -85.7, y: 3.0 }, r: 315 }, { p: { x: -75.0, y: -134.4 }, r: 270 } ] },
  { vertices: [[-50, 0], [0, -50], [50, 0], [0, 50]], states: [ { p: { x: 90.1, y: 85.1 }, r: 21 }, { p: { x: 130.0, y: -88.4 }, r: 45 }, { p: { x: 31.2, y: 149.1 }, r: 45 } ] },
];

// Definir los colores como variables CSS
const colores = [
  coloresFigurasSplash?.[0] || '#cd0e66',
  coloresFigurasSplash?.[1] || '#0f82f2',
  coloresFigurasSplash?.[2] || '#6d3bbf',
  coloresFigurasSplash?.[3] || '#fd8c00',
  coloresFigurasSplash?.[4] || '#eb4726',
  coloresFigurasSplash?.[5] || '#009ea6',
  coloresFigurasSplash?.[6] || '#22ab24',
];

export default function SplashAnimacion3D({ onFinish }) {
  const figureNameRef = useRef();
  const infoTextRef = useRef();
  const svgRef = useRef();
  const [currentFigureIndex, setCurrentFigureIndex] = useState(0);
  const [piecePositions, setPiecePositions] = useState(PIECES_DATA.map((data, idx) => {
    const initialState = data.states[0];
    return {
      x: initialState.p.x,
      y: initialState.p.y,
      rotation: -initialState.r,
      scaleX: idx === 3 && initialState.r === 270 ? -1 : 1,
      z: 0
    };
  }));

  useEffect(() => {
    // Cargar fuente Inter de Google Fonts (solo una vez)
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    // Timer para cerrar splash
    let splashTimer;
    if (onFinish) {
      splashTimer = setTimeout(() => { onFinish(); }, 30000); // 30 segundos
    }

    // Animation loop
    let animationId;
    function animate(time) {
      animationId = requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    animate();

    // Figure transitions
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

      // Animate pieces to new positions
      piecePositions.forEach((piece, i) => {
        const targetState = PIECES_DATA[i].states[figureIndex];
        const targetPosition = targetState.p;
        const targetRotation = -targetState.r;
        const targetScaleX = i === 3 && targetState.r === 270 ? -1 : 1;

        // First move to background
        new TWEEN.Tween(piece)
          .to({ z: 150 }, 600)
          .easing(TWEEN.Easing.Cubic.Out)
          .onUpdate(() => {
            setPiecePositions(prev => [...prev]);
          })
          .start();

        // Then move to new position
        setTimeout(() => {
          new TWEEN.Tween(piece)
            .to({ 
              x: targetPosition.x, 
              y: targetPosition.y, 
              z: 0, 
              rotation: targetRotation,
              scaleX: targetScaleX
            }, 1000)
            .easing(TWEEN.Easing.Back.Out)
            .delay(i * 300)
            .onUpdate(() => {
              setPiecePositions(prev => [...prev]);
            })
            .start();
        }, 600);
      });
    }

    // Start with first figure
    transitionToFigure(currentFigureIndex);
    
    // Change figure every 10 seconds
    figureInterval = setInterval(() => {
      const nextIndex = (currentFigureIndex + 1) % figureNames.length;
      setCurrentFigureIndex(nextIndex);
      transitionToFigure(nextIndex);
    }, 10000);

    return () => {
      cancelAnimationFrame(animationId);
      if (splashTimer) clearTimeout(splashTimer);
      if (figureInterval) clearInterval(figureInterval);
    };
  }, [currentFigureIndex, onFinish]);

  // Convert vertices to SVG path
  const verticesToPath = (vertices) => {
    if (vertices.length === 0) return '';
    const path = vertices.map((vertex, index) => {
      const [x, y] = vertex;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
    return path + 'Z';
  };

  return (
    <div className="splash-3d-bg">
      <div id="header" className="splash-3d-header">
        <div id="figure-name" ref={figureNameRef} className="splash-3d-figure">Cabra</div>
        <div id="info-text" ref={infoTextRef} className="splash-3d-info">Observa las figuras animadas</div>
      </div>
      <div id="container" className="splash-3d-canvas">
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox="-200 -200 400 400"
          style={{ 
            background: '#1a1a1a',
            ...Object.fromEntries(colores.map((color, i) => [`--color${i+1}`, color]))
          }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {PIECES_DATA.map((data, idx) => {
            const piece = piecePositions[idx];
            const path = verticesToPath(data.vertices);
            const colorVar = `var(--color${idx+1})`;
            return (
              <g key={idx}>
                {/* Glow effect */}
                <path
                  d={path}
                  fill={colorVar}
                  opacity="0.3"
                  filter="url(#glow)"
                  transform={`
                    translate(${piece.x} ${piece.y}) 
                    rotate(${piece.rotation}) 
                    scale(${piece.scaleX} 1)
                  `}
                />
                {/* Main shape */}
                <path
                  d={path}
                  fill={colorVar}
                  stroke="#ffffff"
                  strokeWidth="2"
                  transform={`
                    translate(${piece.x} ${piece.y}) 
                    rotate(${piece.rotation}) 
                    scale(${piece.scaleX} 1)
                  `}
                  style={{
                    filter: `drop-shadow(0 0 10px ${colores[idx]})`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
} 