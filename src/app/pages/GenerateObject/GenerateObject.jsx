import React, { useEffect, useRef } from 'react';
import CoordinateAxes from './CoordinateAxes/CoordinateAxes';
import './GenerateObject.css';

export default function GenerateObject({
    faces,
    dots,
    vectors,
    sceneStyle,
    selectedFaceId,
    setSelectedFaceId,
    selectedDotId,
    setSelectedDotId,
    selectedVectorId,
    setSelectedVectorId,
    showCoordinateAxes
}) {
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
                style={{ transform: `scale(${sceneStyle?.scale || 1}) translateX(${sceneStyle?.translateX || 0}px) translateY(${sceneStyle?.translateY || 0}px) translateZ(${sceneStyle?.translateZ || 0}px) rotateZ(${-sceneStyle?.rotateZ || 0}deg)` }}
            >
                <div
                    ref={objectRef}
                    className='object'
                >
                    {faces.map(face => {
                        const styleObj = {};
                        let polygonPoints = null;

                        face.steps?.forEach(step => {
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
                                        fill={face.color || '#FFFFFF'}
                                        stroke={face.borderColor || '#FFFFFF'}
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
                    {dots.map(dot => {
                        const size = dot.size;
                        const radius = dot.size;
                        const width = 20;
                        const height = 20;
                        const X = dot.xCoordinate;
                        const Y = dot.yCoordinate;
                        const Z = dot.zCoordinate;
                        const underY = Math.sqrt(X * X + Z * Z);
                        const vectorLength = Math.sqrt(X * X + Y * Y + Z * Z);
                        let xOz = (X == 0) ? (Z == 0 ? 0 : (Z > 0 ? -90 : 90)) : Math.atan(Z / X) * 180 / Math.PI;
                        xOz = (Z >= 0 && X >= 0) ? 0 - xOz : xOz;
                        xOz = (Z < 0 && X < 0) ? 180 - xOz : xOz;
                        xOz = (Z < 0 && X >= 0) ? 0 - xOz : xOz;
                        xOz = (Z >= 0 && X < 0) ? 180 - xOz : xOz;
                        xOz = (X == 0) ? (Z == 0 ? 0 : (Z > 0 ? -90 : 90)) : xOz;
                        const Oxyz = (underY == 0) ? (Y >= 0 ? 90 : -90) : Math.atan(Y / underY) * 180 / Math.PI;
                        return (
                            <React.Fragment key={dot.id}>
                                {dot.visible == 1 &&
                                    <svg
                                        className='vector-svg'
                                        width={`${width || '0'}`}
                                        height={`${height || '0'}`}
                                        viewBox={`0 0 ${width || '0'} ${height || '0'}`}
                                        style={{ transform: `translateX(${dot?.xCoordinate || 0}px) translateY(${dot?.yCoordinate || 0}px) translateZ(${dot?.zCoordinate || 0}px)` }}
                                    >
                                        <path
                                            d={`M ${width / 2} ${width / 2 - radius} A ${radius} ${radius} 0 1 1 ${width / 2 - 0.1} ${width / 2 - radius} Z`}
                                            fill={dot.color || '#FFFFFF'}
                                            stroke='#FFFFFF'
                                            strokeWidth={dot.id == selectedDotId ? '1' : '0'}
                                            vectorEffect='non-scaling-stroke'
                                            filter={`url(#glow-${dot.id})`}

                                            strokeLinecap={dot.id == selectedDotId ? 'round' : ''}
                                            strokeDasharray={dot.id == selectedDotId ? '2 3' : ''}
                                            className={dot.id == selectedDotId ? 'dashoffset' : ''}

                                            onClick={() => setSelectedDotId(prev => {
                                                if (prev && prev == dot.id) {
                                                    return null;
                                                } else {
                                                    return dot.id;
                                                }
                                            })}
                                        />
                                        <text
                                            x={dot.xCoordinateName / 2}
                                            y={dot.yCoordinateName / 2 + 1}
                                            textAnchor='middle'
                                            dominantBaseline='middle'
                                            fill={dot.nameColor}
                                            fontSize={dot.nameSize}
                                        >
                                            {dot.nameVisible === 1 ? dot.name : ''}
                                        </text>
                                    </svg>
                                }
                                {dot.vectorVisible == 1 &&
                                    <svg
                                        className='dot-svg'
                                        width={`${vectorLength || '0'}`}
                                        height={`${height || '0'}`}
                                        viewBox={`0 0 ${vectorLength || '0'} ${height || '0'}`}
                                        style={{ transform: `rotateY(${xOz}deg) rotateZ(${Oxyz}deg) translateX(${vectorLength / 2}px)` }}
                                    >
                                        <path
                                            d={`M 0 ${height / 2 - 1} L ${vectorLength - 8} ${height / 2 - 1} L ${vectorLength - 8} ${height / 2 - 4} L ${vectorLength} ${height / 2} L ${vectorLength - 8} ${height / 2 + 4} L ${vectorLength - 8} ${height / 2 + 1} L 0 ${height / 2 + 1} Z`}
                                            fill={dot.color || '#FFFFFF'}
                                            stroke='#FFFFFF'
                                            strokeWidth={dot.id == selectedDotId ? '1' : '0'}
                                            vectorEffect='non-scaling-stroke'
                                            filter={`url(#glow-${dot.id})`}

                                            strokeLinecap={dot.id == selectedDotId ? 'round' : ''}
                                            strokeDasharray={dot.id == selectedDotId ? '2 3' : ''}
                                            className={dot.id == selectedDotId ? 'dashoffset' : ''}

                                            onClick={() => setSelectedDotId(prev => {
                                                if (prev && prev == dot.id) {
                                                    return null;
                                                } else {
                                                    return dot.id;
                                                }
                                            })}
                                        />
                                        <text
                                            x={vectorLength / 2}
                                            y='0'
                                            textAnchor='middle'
                                            dominantBaseline='middle'
                                            fill={dot.nameColor}
                                            fontSize={dot.nameSize}
                                        >
                                            {dot.nameVisible === 1 ? 'O-' + dot.name : ''}
                                        </text>
                                    </svg>
                                }
                            </React.Fragment>
                        )
                    })}
                    {vectors.map(vector => {
                        const height = 20;
                        const xA = vector.xCoordinateA;
                        const yA = vector.yCoordinateA;
                        const zA = vector.zCoordinateA;
                        const xB = vector.xCoordinateB;
                        const yB = vector.yCoordinateB;
                        const zB = vector.zCoordinateB;
                        const xAB = xB - xA;
                        const yAB = yB - yA;
                        const zAB = zB - zA;
                        const underY = Math.sqrt(xAB * xAB + zAB * zAB);
                        const vectorLength = Math.sqrt(xAB * xAB + yAB * yAB + zAB * zAB);
                        let xOz = (xAB == 0) ? (zAB == 0 ? 0 : (zAB > 0 ? -90 : 90)) : Math.atan(zAB / xAB) * 180 / Math.PI;
                        xOz = (zAB >= 0 && xAB >= 0) ? 0 - xOz : xOz;
                        xOz = (zAB < 0 && xAB < 0) ? 180 - xOz : xOz;
                        xOz = (zAB < 0 && xAB >= 0) ? 0 - xOz : xOz;
                        xOz = (zAB >= 0 && xAB < 0) ? 180 - xOz : xOz;
                        xOz = (xAB == 0) ? (zAB == 0 ? 0 : (zAB > 0 ? -90 : 90)) : xOz;
                        const Oxyz = (underY == 0) ? (yAB >= 0 ? 90 : -90) : Math.atan(yAB / underY) * 180 / Math.PI;
                        return (
                            <React.Fragment key={vector.id}>
                                {vector.visible == 1 &&
                                    <svg
                                        className='vector-svg'
                                        width={`${vectorLength || '0'}`}
                                        height={`${height || '0'}`}
                                        viewBox={`0 0 ${vectorLength || '0'} ${height || '0'}`}
                                        style={{ transform: `translateX(${xA}px) translateY(${yA}px) translateZ(${zA}px) rotateY(${xOz}deg) rotateZ(${Oxyz}deg) translateX(${vectorLength / 2}px)` }}
                                    >
                                        <path
                                            d={`M 0 ${height / 2 - 1} L ${vectorLength - 8} ${height / 2 - 1} L ${vectorLength - 8} ${height / 2 - 4} L ${vectorLength} ${height / 2} L ${vectorLength - 8} ${height / 2 + 4} L ${vectorLength - 8} ${height / 2 + 1} L 0 ${height / 2 + 1} Z`}
                                            fill={vector.color || '#FFFFFF'}
                                            stroke='#FFFFFF'
                                            strokeWidth={vector.id == selectedVectorId ? '1' : '0'}
                                            vectorEffect='non-scaling-stroke'
                                            filter={`url(#glow-${vector.id})`}

                                            strokeLinecap={vector.id == selectedVectorId ? 'round' : ''}
                                            strokeDasharray={vector.id == selectedVectorId ? '2 3' : ''}
                                            className={vector.id == selectedVectorId ? 'dashoffset' : ''}

                                            onClick={() => setSelectedVectorId(prev => {
                                                if (prev && prev == vector.id) {
                                                    return null;
                                                } else {
                                                    return vector.id;
                                                }
                                            })}
                                        />
                                        <text
                                            x={vectorLength / 2}
                                            y='0'
                                            textAnchor='middle'
                                            dominantBaseline='middle'
                                            fill={vector.nameColor}
                                            fontSize={vector.nameSize}
                                        >
                                            {vector.nameVisible === 1 ? vector.name : ''}
                                        </text>
                                    </svg>
                                }
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
