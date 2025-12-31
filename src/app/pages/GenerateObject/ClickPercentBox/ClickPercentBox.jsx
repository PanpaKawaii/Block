import { useEffect, useRef, useState } from 'react';
import './ClickPercentBox.css';

export default function ClickPercentBox({
    selectedFaceId,
    shape,
    setOpenEditShape,
    updateFace,
    width,
    height
}) {
    const boxRef = useRef(null);
    const [points, setPoints] = useState([]);
    const [stringPoints, setStringPoints] = useState('');

    const handleClick = (e) => {
        if (stringPoints.includes('Z')) return;
        const rect = boxRef.current.getBoundingClientRect();

        const x = Number((e.clientX - rect.left)?.toFixed(2));
        const y = Number((e.clientY - rect.top)?.toFixed(2));

        const percentX = (x / (rect.width == 0 ? 0.000001 : rect.width)) * 100;
        const percentY = (y / (rect.height == 0 ? 0.000001 : rect.height)) * 100;

        setPoints((prev) => [
            ...prev,
            {
                x: Number(percentX.toFixed(2)),
                y: Number(percentY.toFixed(2)),
            },
        ]);
        setStringPoints(prev => prev == '' ? `M ${x} ${y}` : prev + ` L ${x} ${y}`);
    };

    useEffect(() => {
        setStringPoints(shape.includes('M') ? shape : polygonToPath(shape));
    }, []);

    const resetPoints = () => {
        setPoints([]);
        setStringPoints('');
    };

    const endDrawing = () => {
        setPoints([]);
        setStringPoints(p => p + ' Z');
    };

    const approveShape = () => {
        updateFace(selectedFaceId, 'shape', stringPoints);
        setOpenEditShape(false);
    };

    const polygonToPath = (shapeInput) => {
        if (!shapeInput) return '';
        const coords = shapeInput.trim().split(/\s+/);
        let d = `M ${coords[0].replace(',', ' ')}`;
        for (let i = 1; i < coords.length; i++) {
            d += ` L ${coords[i].replace(',', ' ')}`;
        }
        return d + ' Z';
    };

    return (
        <div className='click-percent-box-container'>
            <div className='modal-box card'>
                <div className='heading'>
                    <h2>Drawing Shape</h2>
                    <button className='btn-close' onClick={() => setOpenEditShape(false)}><i className='fa-regular fa-circle-xmark' /></button>
                </div>
                <div className='input-group'>
                    <textarea
                        type='textarea'
                        placeholder=''
                        value={stringPoints || ''}
                        onChange={(e) => setStringPoints(e.target.value)}
                        className='input'
                        rows='5'
                        cols='4'
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    />
                    <label htmlFor='Shape'>Shape</label>
                </div>
                <div className='content'>
                    <div className='drawing-board' style={{ width: width, height: height }}>
                        <svg
                            className='drawing-svg'
                            width={`${width || '0'} `}
                            height={`${height || '0'} `}
                            viewBox={`0 0 ${width || '0'} ${height || '0'}`}

                            ref={boxRef}
                            onClick={handleClick}
                        >
                            <defs>
                                <filter
                                    id={`glow-${selectedFaceId}`}
                                    x='-60%'
                                    y='-60%'
                                    width='220%'
                                    height='220%'
                                >
                                    <feGaussianBlur stdDeviation='4' result='blur' />
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in='SourceGraphic' />
                                    </feMerge>
                                </filter>
                            </defs>
                            <path
                                d={stringPoints || ''}
                                fill={'#68FCFF33'}
                                stroke={'#68FCFFFF'}
                                strokeWidth={2}
                                vectorEffect='non-scaling-stroke'
                                filter={`url(#glow-${selectedFaceId})`}

                                strokeLinecap='round'
                                strokeDasharray='8 6'
                                className='dashoffset'
                            />
                        </svg>
                        {points.map((p, index) => (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    left: `${p.x}%`,
                                    top: `${p.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: 4,
                                    height: 4,
                                    background: '#80FCFF',
                                    borderRadius: '50%'
                                }}
                                title={`X: ${p.x}% - Y: ${p.y}%`}
                            />
                        ))}
                    </div>
                    <div className='btns'>
                        <button className='btn' onClick={resetPoints}>RESET</button>
                        <button className='btn' onClick={endDrawing} disabled={stringPoints.includes('Z') || stringPoints == ''}>END</button>
                    </div>
                </div>
                <button className='btn btn-approve' onClick={approveShape}>APPROVE</button>
            </div>
        </div>
    )
}
