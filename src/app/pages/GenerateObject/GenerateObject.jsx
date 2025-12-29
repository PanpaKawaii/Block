import React, { useEffect, useRef } from 'react';
import CoordinateAxes from './CoordinateAxes/CoordinateAxes';
import './GenerateObject.css';

export default function GenerateObject({ faces, sceneStyle, selectedFaceId, setSelectedFaceId, showCoordinateAxes }) {
    const containerRef = useRef(null);
    const objectRef = useRef(null);
    const dragging = useRef(false);
    const rotation = useRef({ x: 0, y: 0 });

    const applyRotation = () => {
        const { x, y } = rotation.current;
        objectRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
    };

    useEffect(() => {
        const container = containerRef.current;

        const down = () => (dragging.current = true);
        const up = () => (dragging.current = false);

        const move = (e) => {
            if (!dragging.current) return;
            rotation.current.y += e.movementX * 0.5;
            rotation.current.x -= e.movementY * 0.5;
            applyRotation();
        };

        container.addEventListener('pointerdown', down);
        window.addEventListener('pointerup', up);
        window.addEventListener('pointermove', move);

        return () => {
            container.removeEventListener('pointerdown', down);
            window.removeEventListener('pointerup', up);
            window.removeEventListener('pointermove', move);
        };
    }, []);

    const polygonToPath = (points) => {
        if (!points) return '';
        const coords = points.trim().split(/\s+/);
        let d = `M ${coords[0].replace(',', ' ')}`;
        for (let i = 1; i < coords.length; i++) {
            d += ` L ${coords[i].replace(',', ' ')}`;
        }
        return d + ' Z';
    };

    return (
        <div className='generate-object-container'>
            <div
                ref={containerRef}
                className='scene-object'
                style={{ transform: `scale(${sceneStyle?.scale || 1})  translateX(${sceneStyle?.translateX || 0}px) translateY(${sceneStyle?.translateY || 0}px) translateZ(${sceneStyle?.translateZ || 0}px)` }}
            >
                <div
                    ref={objectRef}
                    className='object'
                >
                    {faces.map(face => {
                        const styleObj = {};
                        let polygonPoints = null;

                        face.steps.forEach(step => {
                            if ((step.type.startsWith('translate')
                                || step.type.startsWith('rotate')
                                || step.type == 'scale')
                                && step.visible == 1) {

                                styleObj.transform = (styleObj.transform || '') +
                                    ` ${step.type}(${step.value}${step.type.includes('rotate') ? 'deg' : (step.type.includes('translate') ? 'px' : '')})`;
                            }

                            if (step.type === 'clipPath' && step.visible == 1) {
                                polygonPoints = step.value;
                            }
                        });

                        let testPath = `m 10 10 l 50 0 v 40 h -50 z`;
                        testPath = `M 15 0 H 85 L 100 15 V 85 L 85 100 H 15 L 0 85 V 15 Z`;
                        testPath = `M 10 0 H 90 A 10 10 0 0 1 100 10 V 90 A 10 10 0 0 1 90 100 H 10 A 10 10 0 0 1 0 90 V 10 A 10 10 0 0 1 10 0 Z`;

                        return face.visible == 1 ? (
                            <React.Fragment key={face.id}>
                                <svg
                                    className='face-svg'
                                    width={`${face.width || '0'}`}
                                    height={`${face.height || '0'}`}
                                    viewBox={`0 0 ${face.width || '0'} ${face.height || '0'}`}
                                    style={styleObj}
                                >
                                    {face.glowVisible &&
                                        <defs>
                                            <filter
                                                id={`glow-${face.id}`}
                                                x='-60%'
                                                y='-60%'
                                                width='220%'
                                                height='220%'
                                            >
                                                <feGaussianBlur stdDeviation={face.glow || '0'} result='blur' />
                                                <feMerge>
                                                    <feMergeNode />
                                                    <feMergeNode in='SourceGraphic' />
                                                </feMerge>
                                            </filter>
                                        </defs>
                                    }
                                    <path
                                        d={face.shape ? (face.shape?.includes('M') ? face.shape : polygonToPath(face.shape)) : (polygonPoints?.includes('M') ? polygonPoints : polygonToPath(polygonPoints))}
                                        fill={face.color || '#fff'}
                                        stroke={face.borderColor || '#fff'}
                                        strokeWidth={face.borderVisible === 1 ? face.borderWidth : 0}
                                        vectorEffect='non-scaling-stroke'
                                        filter={`url(#glow-${face.id})`}

                                        strokeLinecap={face.id == selectedFaceId ? 'round' : ''}
                                        strokeDasharray={face.id == selectedFaceId ? '8 6' : ''}
                                        className={face.id == selectedFaceId ? 'dashoffset' : ''}

                                        onClick={() => setSelectedFaceId(prev => {
                                            if (prev && prev == face.id) {
                                                return null;
                                            } else {
                                                return face.id;
                                            }
                                        })}
                                    />
                                    <text
                                        x={face.width / 2}
                                        y={face.height / 2 + 1}
                                        textAnchor='middle'
                                        dominantBaseline='middle'
                                        fill={face.nameColor}
                                        fontSize={face.nameSize}
                                    >
                                        {face.nameVisible === 1 ? face.name : ''}
                                    </text>
                                </svg>
                                {showCoordinateAxes.includes(face.id) && <CoordinateAxes width={2 * face.width} height={40} styleObj={styleObj} />}
                            </React.Fragment>
                        ) : null;
                    })}
                    {showCoordinateAxes.includes('Oxyz') && <CoordinateAxes width={800} height={40} styleObj={{}} />}
                </div>
            </div>
        </div>
    )
}
