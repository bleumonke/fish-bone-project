import React, { useRef, useState, useEffect } from 'react';
import { Diagram, Bone } from '../types';

interface IshikawaDiagramProps {
  diagram: Diagram;
}

const BONE_LENGTH = 100;
const CHILD_BONE_LENGTH = 60;
const BONE_GAP = 90;
const degToRad = (deg: number) => (deg * Math.PI) / 180;

const IshikawaDiagram: React.FC<IshikawaDiagramProps> = ({ diagram }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 900,
    height: 600,
  });

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const { width, height } = dimensions;
  const spineX = width / 2;
  const spineStartY = 80;
  const spineEndY = height - 80;
  const spineLength = spineEndY - spineStartY;
  const centerY = spineStartY + spineLength / 2;
  const bonesCount = (diagram.bones ?? []).length;

  const getBoneY = (idx: number) => {
    const step = BONE_GAP;
    if (bonesCount === 1) return centerY;
    if (bonesCount % 2 === 1) {
      const mid = Math.floor(bonesCount / 2);
      return centerY + (idx - mid) * step;
    } else {
      const mid = bonesCount / 2;
      return idx < mid
        ? centerY - (mid - idx - 0.5) * step
        : centerY + (idx - mid + 0.5) * step;
    }
  };

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => {
    dragging.current = false;
    lastPos.current = null;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !lastPos.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const d = -e.deltaY * 0.001;
    setTransform(prev => {
      let s = Math.min(Math.max(prev.scale + d, 0.2), 3);
      return { ...prev, scale: s };
    });
  };

  const LABEL_OFFSET = 20;
  const VERTICAL_OFFSET = 12;

  const renderBone = (
    bone: Bone,
    startX: number,
    startY: number,
    angleDeg: number,
    isLeftBranch: boolean
  ) => {
    const rad = degToRad(angleDeg);
    const endX = startX + Math.cos(rad) * BONE_LENGTH;
    const endY = startY + Math.sin(rad) * BONE_LENGTH;

    const labelX = startX + Math.cos(rad) * LABEL_OFFSET;
    const labelY = startY + Math.sin(rad) * LABEL_OFFSET - VERTICAL_OFFSET;

    return (
      <g key={bone.id} style={{ opacity: 0, animation: 'fadeIn 0.5s forwards' }}>
        <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="black" strokeWidth={2} />
        <text
          x={labelX}
          y={labelY}
          fontSize={14}
          fill="black"
          style={{ userSelect: 'none', dominantBaseline: 'middle' }}
          transform={`rotate(${isLeftBranch ? -45 : 45}, ${labelX}, ${labelY})`}
          textAnchor={isLeftBranch ? 'end' : 'start'}
        >
          {bone.name}
        </text>

        {bone.children && bone.children.length > 0 && (
          <g>
            {bone.children.map((child, idx) => {
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;
              const offset = idx % 2 === 0 ? -45 : 45;
              const childAngle = angleDeg + offset;
              const radC = degToRad(childAngle);
              const childX = midX + Math.cos(radC) * CHILD_BONE_LENGTH;
              const childY = midY + Math.sin(radC) * CHILD_BONE_LENGTH;

              // Offset label perpendicular to the branch line:
              const labelOffset = 8; // px
              const perpAngleRad = radC + Math.PI / 2; // perpendicular angle
              const labelXChild = childX + Math.cos(perpAngleRad) * labelOffset;
              const labelYChild = childY + Math.sin(perpAngleRad) * labelOffset;

              return (
                <g key={child.id}>
                  <line x1={midX} y1={midY} x2={childX} y2={childY} stroke="black" strokeWidth={1.5} />
                  <text
                    x={labelXChild}
                    y={labelYChild}
                    fontSize={12}
                    fill="black"
                    style={{ userSelect: 'none', dominantBaseline: 'middle' }}
                    transform={`rotate(${childAngle}, ${labelXChild}, ${labelYChild})`}
                    textAnchor={childAngle < 90 || childAngle > 270 ? 'start' : 'end'}
                  >
                    {child.name}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </g>
    );
  };

  const renderMainBones = () =>
    (diagram.bones ?? []).map((b, i) => {
      const x = spineX;
      const y = getBoneY(i);
      const left = i % 2 === 0;
      const ang = left ? 135 : 45;
      return renderBone(b, x, y, ang, left);
    });

  const fishHeadPoints = `
    ${spineX - 20},${spineStartY + 30}
    ${spineX},${spineStartY}
    ${spineX + 20},${spineStartY + 30}
  `;

  return (
    <>
      <style>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          style={{ background: '#f5f5f5', cursor: dragging.current ? 'grabbing' : 'grab' }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
          onWheel={onWheel}
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
            <line x1={spineX} y1={spineStartY} x2={spineX} y2={spineEndY} stroke="black" strokeWidth={4} />
            <polygon points={fishHeadPoints} fill="black" />
            {renderMainBones()}
          </g>
        </svg>
      </div>
    </>
  );
};

export default IshikawaDiagram;