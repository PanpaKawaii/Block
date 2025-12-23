import { useEffect, useRef } from 'react';
import './GenerateObject.css';

export default function GenerateObject({ faces }) {
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

    return (
        <div className='generateobject-container'>
            <div
                ref={containerRef}
                className='scene-object'
            >
                <div
                    ref={objectRef}
                    className='object'
                >
                    {/* {faces.map(face => {
                        const styleObj = {};
                        face.steps.forEach(step => {
                            if (step.type == 'translateX') {
                                styleObj.transform = (styleObj.transform || '') + ` translateX(${step.value}px)`;
                            }
                            if (step.type == 'translateY') {
                                styleObj.transform = (styleObj.transform || '') + ` translateY(${step.value}px)`;
                            }
                            if (step.type == 'translateZ') {
                                styleObj.transform = (styleObj.transform || '') + ` translateZ(${step.value}px)`;
                            }
                            if (step.type == 'rotateX') {
                                styleObj.transform = (styleObj.transform || '') + ` rotateX(${step.value}deg)`;
                            }
                            if (step.type == 'rotateY') {
                                styleObj.transform = (styleObj.transform || '') + ` rotateY(${step.value}deg)`;
                            }
                            if (step.type == 'rotateZ') {
                                styleObj.transform = (styleObj.transform || '') + ` rotateZ(${step.value}deg)`;
                            }
                            if (step.type == 'scale') {
                                styleObj.transform = (styleObj.transform || '') + ` scale(${step.value})`;
                            }
                            if (step.type == 'clipPath') {
                                styleObj.clipPath = `polygon(${step.value})`;
                            }
                        });
                        return (
                            <div
                                key={face.id}
                                className='face face-box'
                                style={styleObj}
                            >
                                {face.name}
                            </div>
                        );
                    })} */}

                    {faces.map(face => {
                        const styleObj = {};
                        let polygonPoints = null;

                        face.steps.forEach(step => {
                            if ((step.type.startsWith('translate')
                                || step.type.startsWith('rotate')
                                || step.type == 'scale')
                                && step.visible == 1) {

                                styleObj.transform = (styleObj.transform || '') +
                                    ` ${step.type}(${step.value}${step.type.includes('rotate') ? 'deg' : 'px'})`;
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
                                <polygon
                                    points={polygonPoints || '0,0 100,0 100,100 0,100'}
                                    fill={face.color || '#FFFFFF'}
                                    stroke={face.borderColor || '#FFFFFF'}
                                    strokeWidth={face.borderVisible == 1 ? (face.borderWidth || '0') : '0'}
                                />
                                <text
                                    x='50'
                                    y='55'
                                    textAnchor='middle'
                                    fill='var(--accent)'
                                    fontSize='12'
                                >
                                    {face.nameVisible == 1 ? face.name : ''}
                                </text>
                            </svg>
                        ) : null;
                    })}

                </div>
            </div>
        </div>
    )
}
