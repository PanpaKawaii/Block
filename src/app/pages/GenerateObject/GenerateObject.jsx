import { useEffect, useRef } from 'react';
import './GenerateObject.css';

export default function GenerateObject({ faces, sceneStyle }) {
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
                style={{ transform: `translate(${sceneStyle?.translateX || 0}px, ${sceneStyle?.translateY || 0}px) scale(${sceneStyle?.scale || 1})` }}
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

                        return face.visible == 1 ? (
                            <svg
                                key={face.id}
                                className='face-svg'
                                width={`${face.width || '0'} `}
                                height={`${face.height || '0'} `}
                                viewBox={`0 0 ${face.width || '0'} ${face.height || '0'}`}
                                style={styleObj}
                            >
                                <defs>
                                    <filter
                                        id={`glow-${face.id}`}
                                        x='-60%'
                                        y='-60%'
                                        width='220%'
                                        height='220%'
                                    >
                                        <feGaussianBlur stdDeviation='6' result='blur' />
                                        {/* <feColorMatrix
                                            type='matrix'
                                            values='
                                                0 0 0 0 0
                                                0 1 1 0 0.9
                                                0 1 1 0 1
                                                0 0 0 1 0
                                            '
                                        /> */}
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in='SourceGraphic' />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <path
                                    d={polygonToPath(polygonPoints)}
                                    fill={face.color || '#fff'}
                                    stroke={face.borderColor || '#fff'}
                                    strokeWidth={face.borderVisible === 1 ? face.borderWidth : 0}
                                    vectorEffect='non-scaling-stroke'
                                    filter={`url(#glow-${face.id})`}

                                    strokeLinecap='round'
                                    strokeDasharray='8 6'
                                    style={{ animation: 'dash 3s linear infinite' }}
                                />
                                <text
                                    x={face.width / 2}
                                    y={face.height / 2 + face.nameSize / 3}
                                    textAnchor='middle'
                                    dominantBaseline='middle'
                                    fill={face.nameColor}
                                    fontSize={face.nameSize}
                                >
                                    {face.nameVisible === 1 ? face.name : ''}
                                </text>
                            </svg>
                        ) : null;
                    })}

                </div>
            </div>
        </div>
    )
}
