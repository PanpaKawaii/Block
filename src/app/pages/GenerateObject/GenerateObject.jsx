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
                    {faces.map(face => {
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
                    })}
                </div>
            </div>
        </div>
    )
}
