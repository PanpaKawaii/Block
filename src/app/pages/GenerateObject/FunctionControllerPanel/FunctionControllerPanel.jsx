import { useState } from 'react';
import './FunctionControllerPanel.css';

export default function FunctionControllerPanel({
    faces,
    setFaces,
    selectedFace,
    selectedFaceId,
    openedFaceId,
    updateFace,
    dots,
    setDots,
    selectedDotId,
    setSelectedDotId,
    selectedDot,
    toggleMenu,
    toggleStepFunction,
    collapseController,
    swapController,
    hexRgbaToPercent,
    handleShowCoordinateAxes,
    showCoordinateAxes
}) {
    const [groupFacesDotsVectors, setGroupFacesDotsVectors] = useState([]);

    const getEquationString = (A, B, C) => {
        const AB = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z };
        const AC = { x: C.x - A.x, y: C.y - A.y, z: C.z - A.z };
        const n = {
            x: (AB.y * AC.z) - (AC.y * AB.z),
            y: (AB.z * AC.x) - (AC.z * AB.x),
            z: (AB.x * AC.y) - (AC.x * AB.y),
        }
        const fA = (n.x / 10000)?.toFixed(3);
        const fB = (n.y / 10000)?.toFixed(3);
        const fC = (n.z / 10000)?.toFixed(3);
        const fD = ((-fA * A.x - fB * A.y - fC * A.z) / 10000)?.toFixed(3);
        const f = `${getString(fA, 1)}x ${getString(fB, 0)}y ${getString(fC, 0)}z ${getString(fD, 0)} = 0`;
        return f;
    };

    const getEquationWallString = (A, B, C) => {
        const AB = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z };
        const AC = { x: C.x - A.x, y: C.y - A.y, z: C.z - A.z };
        const n = {
            x: (AB.y * AC.z) - (AC.y * AB.z),
            y: (AB.z * AC.x) - (AC.z * AB.x),
            z: (AB.x * AC.y) - (AC.x * AB.y),
        }
        const fA = n.x;
        const fB = n.y;
        const fC = n.z;
        const fD = -fA * A.x - fB * A.y - fC * A.z;
        const f = `x/(${((-1) * fD / fA)?.toFixed(3)}) + y/(${((-1) * fD / fB)?.toFixed(3)}) + z/(${((-1) * fD / fC)?.toFixed(3)}) (${((-1) * fD / fD)?.toFixed(3)}) = 0`;
        return f;
    };

    const getEquationObject = (A, B, C) => {
        const AB = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z };
        const AC = { x: C.x - A.x, y: C.y - A.y, z: C.z - A.z };
        const n = {
            x: (AB.y * AC.z) - (AC.y * AB.z),
            y: (AB.z * AC.x) - (AC.z * AB.x),
            z: (AB.x * AC.y) - (AC.x * AB.y),
        }
        console.log('n', n);
        const fA = n.x;
        const fB = n.y;
        const fC = n.z;
        const fD = -fA * A.x - fB * A.y - fC * A.z;
        const f = `${getString(fA, 1)}x ${getString(fB, 0)}y ${getString(fC, 0)}z ${getString(fD, 0)} = 0`;
        const FaceFunction = {
            A: fA,
            B: fB,
            C: fC,
            D: fD,
        }
        return FaceFunction;
    };

    const getString = (number, position) => {
        return `${number >= 0 ? (position != 1 ? '+ ' : '') : (position != 1 ? '- ' : '-')}${Math.abs(number)}`;
    };

    const getVectorLength = (V) => {
        return Number(Math.sqrt(V.A * V.A + V.B * V.B + V.C * V.C));
    };

    const getLengthAxe = (a, b) => {
        const lengthA = Number(a);
        const lengthB = Number(b);
        return Number(Math.sqrt((lengthA * lengthA) + (lengthB * lengthB)));
    };

    const getAngle = (axe, points) => {
        const FaceFunction = getEquationObject(points[0], points[1], points[2]);

        // let Angle = 0;
        // if (axe == 'y' && VectorLength != 0) {
        //     Angle = Math.atan(FaceFunction.A / FaceFunction.C) * 180 / Math.PI;
        // } else if (axe == 'x' && VectorLength != 0) {
        //     // Angle = Math.atan(FaceFunction.B / (Math.sqrt((FaceFunction.A * FaceFunction.A) + (FaceFunction.C) * (FaceFunction.C)) + 0.000001) * (Math.abs(FaceFunction.D) / FaceFunction.D)) * 180 / Math.PI;
        //     Angle = Math.atan(FaceFunction.B / (getLengthAxe(FaceFunction.A, FaceFunction.C) + 0.000001) * (Math.abs(FaceFunction.D) / FaceFunction.D)) * 180 / Math.PI;
        // } else return 0;
        // console.log('Angle', Angle);

        const D = FaceFunction.D;
        const X = FaceFunction.A / (D == 0 ? 0.000001 : -D);
        const Y = FaceFunction.B / (D == 0 ? 0.000001 : -D);
        const Z = FaceFunction.C / (D == 0 ? 0.000001 : -D);
        const underY = Math.sqrt(X * X + Z * Z);
        // const vectorLength = Math.sqrt(X * X + Y * Y + Z * Z);
        let xOz = (X == 0) ? (Z == 0 ? 0 : (Z > 0 ? -90 : 90)) : Math.atan(Z / X) * 180 / Math.PI;
        xOz = (Z >= 0 && X >= 0) ? 0 - xOz : xOz;
        xOz = (Z < 0 && X < 0) ? 180 - xOz : xOz;
        xOz = (Z < 0 && X >= 0) ? 0 - xOz : xOz;
        xOz = (Z >= 0 && X < 0) ? 180 - xOz : xOz
        xOz = (X == 0) ? (Z == 0 ? 90 : (Z > 0 ? 0 : 180)) : xOz + 90;
        console.log('=========== xOz ===========', xOz);
        const Oxyz = (underY == 0) ? 90 : Math.atan(Y / underY) * 180 / Math.PI;
        console.log('=========== Oxyz ===========', Oxyz);

        return axe == 'y' ? xOz
            : (axe == 'x' ? (Y >= 0 ? 0 - Math.abs(Oxyz) : Math.abs(Oxyz)) : 0);
    };

    const addFace = () => {
        setFaces((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(), shape: '0,0 500,0 500,500 0,500', name: `Face ${prev.length + 1}`, width: 500, height: 500, glow: 4, nameSize: 12, borderWidth: 2, color: '#68FCFF33', nameColor: '#80FCFFFF', borderColor: '#68FCFFFF', visible: 1, nameVisible: 1, borderVisible: 1, glowVisible: 1,
                steps: [
                    { id: crypto.randomUUID(), type: 'clipPath', value: '0,0 500,0 500,500 0,500', visible: 1 },
                    // { id: crypto.randomUUID(), type: 'rotateY', value: getAngle('y', [{ x: 150, y: -40, z: 40 }, { x: 40, y: -200, z: 40 }, { x: 40, y: -40, z: 250 }]), visible: 1 },
                    // { id: crypto.randomUUID(), type: 'rotateX', value: getAngle('x', [{ x: 150, y: -40, z: 40 }, { x: 40, y: -200, z: 40 }, { x: 40, y: -40, z: 250 }]), visible: 1 },
                    // { id: crypto.randomUUID(), type: 'translateZ', value: '150', visible: 1 },
                    // { id: crypto.randomUUID(), type: 'translateX', value: '-100', visible: 1 },
                    // { id: crypto.randomUUID(), type: 'rotateY', value: getAngle('y', [{ x: 100, y: 0, z: 0 }, { x: 0, y: 200, z: 0 }, { x: 0, y: 0, z: 300 }]), visible: 1 },
                    // { id: crypto.randomUUID(), type: 'rotateX', value: getAngle('x', [{ x: 100, y: 0, z: 0 }, { x: 0, y: 200, z: 0 }, { x: 0, y: 0, z: 300 }]), visible: 1 },
                    // { id: crypto.randomUUID(), type: 'translateZ', value: '86.9789933327', visible: 1 },
                    // { id: crypto.randomUUID(), type: 'translateX', value: '-100', visible: 1 },
                    { id: crypto.randomUUID(), type: 'rotateY', value: getAngle('y', [{ x: 100, y: -200, z: 0 }, { x: 100, y: 100, z: 100 }, { x: 0, y: 100, z: -200 }]), visible: 1 },
                    { id: crypto.randomUUID(), type: 'rotateX', value: getAngle('x', [{ x: 100, y: -200, z: 0 }, { x: 100, y: 100, z: 100 }, { x: 0, y: 100, z: -200 }]), visible: 1 },
                    { id: crypto.randomUUID(), type: 'translateZ', value: '-74', visible: 1 },
                ]
            },
        ]);
    };

    const updateFaceFunction = (faceId) => {
        const relatedDots = groupFacesDotsVectors?.find(g => g.faceId == faceId);
        console.log('relatedDots', relatedDots);
        if (!relatedDots || !relatedDots.dotA || !relatedDots.dotB || !relatedDots.dotC) {
            console.log('Not enough point');
            return;
        }
        const dotA = dots.find(d => d.id == relatedDots.dotA);
        const dotB = dots.find(d => d.id == relatedDots.dotB);
        const dotC = dots.find(d => d.id == relatedDots.dotC);
        console.log('dotA', dotA);
        console.log('dotB', dotB);
        console.log('dotC', dotC);
        const dotsLocation = [
            { x: dotA.xCoordinate, y: dotA.yCoordinate, z: dotA.zCoordinate },
            { x: dotB.xCoordinate, y: dotB.yCoordinate, z: dotB.zCoordinate },
            { x: dotC.xCoordinate, y: dotC.yCoordinate, z: dotC.zCoordinate },
        ];
        console.log('dotsLocation', dotsLocation);

        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        name: getEquationString(dotsLocation[0], dotsLocation[1], dotsLocation[2]),
                        width: 500,
                        height: 500,
                        shape: '0,0 500,0 500,500 0,500',
                        steps: [
                            { id: crypto.randomUUID(), type: 'clipPath', value: '0,0 500,0 500,500 0,500', visible: 1 },
                            { id: crypto.randomUUID(), type: 'rotateY', value: getAngle('y', dotsLocation), visible: 1 },
                            { id: crypto.randomUUID(), type: 'rotateX', value: getAngle('x', dotsLocation), visible: 1 },
                            // { id: crypto.randomUUID(), type: 'translateZ', value: '80', visible: 1 },

                            // { id: crypto.randomUUID(), type: 'translateZ', value: '86.9789933327', visible: 1 },
                            // { id: crypto.randomUUID(), type: 'translateX', value: '-100', visible: 1 },
                        ]
                    }
                    : face
            )
        );

        // setFaces((prev) =>
        //     prev.map((face) =>
        //         face.id === faceId
        //             ? {
        //                 ...face,
        //                 steps: [
        //                     { id: crypto.randomUUID(), type: 'clipPath', value: '0,0 500,0 500,500 0,500', visible: 1 },
        //                     // { id: crypto.randomUUID(), type: 'rotateY', value: getAngle('y', [{ x: 150, y: -40, z: 40 }, { x: 40, y: -200, z: 40 }, { x: 40, y: -40, z: 250 }]), visible: 1 },
        //                     // { id: crypto.randomUUID(), type: 'rotateX', value: getAngle('x', [{ x: 150, y: -40, z: 40 }, { x: 40, y: -200, z: 40 }, { x: 40, y: -40, z: 250 }]), visible: 1 },
        //                     // { id: crypto.randomUUID(), type: 'translateZ', value: '150', visible: 1 },
        //                     // { id: crypto.randomUUID(), type: 'translateX', value: '-100', visible: 1 },
        //                     // { id: crypto.randomUUID(), type: 'rotateY', value: getAngle('y', [{ x: 100, y: 0, z: 0 }, { x: 0, y: 200, z: 0 }, { x: 0, y: 0, z: 300 }]), visible: 1 },
        //                     // { id: crypto.randomUUID(), type: 'rotateX', value: getAngle('x', [{ x: 100, y: 0, z: 0 }, { x: 0, y: 200, z: 0 }, { x: 0, y: 0, z: 300 }]), visible: 1 },
        //                     // { id: crypto.randomUUID(), type: 'translateZ', value: '86.9789933327', visible: 1 },
        //                     // { id: crypto.randomUUID(), type: 'translateX', value: '-100', visible: 1 },
        //                     { id: crypto.randomUUID(), type: 'rotateY', value: getAngle('y', [{ x: 100, y: -200, z: 0 }, { x: 100, y: 100, z: 100 }, { x: 0, y: 100, z: -200 }]), visible: 1 },
        //                     { id: crypto.randomUUID(), type: 'rotateX', value: getAngle('x', [{ x: 100, y: -200, z: 0 }, { x: 100, y: 100, z: 100 }, { x: 0, y: 100, z: -200 }]), visible: 1 },
        //                     { id: crypto.randomUUID(), type: 'translateZ', value: '-74', visible: 1 },
        //                 ]
        //             }
        //             : face
        //     )
        // );
    };

    return (
        <div className={`function-controller-panel-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'function' ? (selectedFace ? 'size_1_2' : 'size_1_1') : (selectedFace ? 'size_1_4' : 'size_1_3')}`}>
            <div className='heading'>
                <h2>Function Controller</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <input
                        type='text'
                        value={JSON.stringify(faces, null, 0)}
                        onChange={(e) => setFaces(JSON.parse(e.target.value))}
                        className='input json-output'
                    />
                    <button className='btn' onClick={addFace}><i className='fa-solid fa-plus' /></button>
                    <button className='btn' onClick={swapController}><i className='fa-solid fa-arrows-rotate' /></button>
                </div>
            </div>

            <div className='list'>
                {faces.map((face) => (
                    <div key={face.id} className={`card ${face.visible == 0 ? 'invisible' : ''} ${face.id == selectedFaceId ? 'dash-box' : ''}`}>
                        <div className='header'>
                            <input
                                type='color'
                                value={face.color?.slice(0, 7) || '#FFFFFF'}
                                onChange={(e) => updateFace(face.id, 'color', e.target.value?.toUpperCase())}
                                className='input color-input'
                                style={{ opacity: hexRgbaToPercent(face.color || '#FFFFFFFF') || 1 }}
                            />
                            <h3 title={face.name}>{face.name}</h3>
                            <div className='btns'>
                                <button className={`btn-click ${selectedFaceId == face.id ? 'selected' : ''}`} onClick={() => toggleSelectFace(face.id)}><i className='fa-solid fa-gear' /></button>
                                <div className='collapse-hidden'>
                                    <button className={`btn-click ${openedFaceId.includes(face.id) ? 'opened-select' : ''}`} onClick={() => toggleOpenFace(face.id)}><i className='fa-solid fa-hand' /></button>
                                    <button className={`btn-click ${face.visible == 1 ? 'visible-select' : ''}`} onClick={() => updateFace(face.id, 'visible', face.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                    <button className={`btn-click ${showCoordinateAxes.includes(face.id) ? 'show-coordinate-axes-select' : ''}`} onClick={() => handleShowCoordinateAxes(face.id)}><i className='fa-solid fa-location-crosshairs' /></button>
                                    <button className='btn-click' onClick={() => copyFace(face.id)}><i className='fa-solid fa-copy' /></button>
                                    <button className='btn-click remove-click' onClick={() => removeFace(face.id)}><i className='fa-solid fa-trash-can' /></button>
                                </div>
                            </div>
                        </div>

                        <div className='function-dots-vector'>
                            <select
                                value={groupFacesDotsVectors.find(g => g.faceId == face.id)?.dotA || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setGroupFacesDotsVectors(prev => {
                                        const index = prev.findIndex(g => g.faceId == face.id);
                                        if (index !== -1) {
                                            const newArr = [...prev];
                                            newArr[index] = { ...newArr[index], dotA: value };
                                            return newArr;
                                        }
                                        return [...prev, { faceId: face.id, dotA: value, dotB: '', dotC: '', vectorId: '', }];
                                    });
                                }}
                                className='select'
                            >
                                <option value={''} className='option'>None</option>
                                {dots.map((dot, index) => (
                                    <option key={index} value={dot.id} className='option'>{dot.name}</option>
                                ))}
                            </select>
                            <select
                                value={groupFacesDotsVectors.find(g => g.faceId == face.id)?.dotB || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setGroupFacesDotsVectors(prev => {
                                        const index = prev.findIndex(g => g.faceId == face.id);
                                        if (index !== -1) {
                                            const newArr = [...prev];
                                            newArr[index] = { ...newArr[index], dotB: value };
                                            return newArr;
                                        }
                                        return [...prev, { faceId: face.id, dotA: '', dotB: value, dotC: '', vectorId: '', }];
                                    });
                                }}
                                className='select'
                            >
                                <option value={''} className='option'>None</option>
                                {dots.map((dot, index) => (
                                    <option key={index} value={dot.id} className='option'>{dot.name}</option>
                                ))}
                            </select>
                            <select
                                value={groupFacesDotsVectors.find(g => g.faceId == face.id)?.dotC || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setGroupFacesDotsVectors(prev => {
                                        const index = prev.findIndex(g => g.faceId == face.id);
                                        if (index !== -1) {
                                            const newArr = [...prev];
                                            newArr[index] = { ...newArr[index], dotC: value };
                                            return newArr;
                                        }
                                        return [...prev, { faceId: face.id, dotA: '', dotB: '', dotC: value, vectorId: '', }];
                                    });
                                }}
                                className='select'
                            >
                                <option value={''} className='option'>None</option>
                                {dots.map((dot, index) => (
                                    <option key={index} value={dot.id} className='option'>{dot.name}</option>
                                ))}
                            </select>
                            <button className='btn' onClick={() => updateFaceFunction(face.id)}>MOVE</button>
                            <button className='btn' onClick={() => updateFaceFunction(face.id)}>CUT</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* <div>ABC</div>
            <div>(150,-40,40) (40,-200,40) (40,-40,250)</div>
            <div>{getEquationString({ x: 150, y: -40, z: 40 }, { x: 40, y: -200, z: 40 }, { x: 40, y: -40, z: 250 })}</div>
            <div>{getEquationWallString({ x: 150, y: -40, z: 40 }, { x: 40, y: -200, z: 40 }, { x: 40, y: -40, z: 250 })}</div>
            <div>{getVectorLength(getEquationObject({ x: 150, y: -40, z: 40 }, { x: 40, y: -200, z: 40 }, { x: 40, y: -40, z: 250 }))}</div>

            <div>DEF</div>
            <div>{getEquationString({ x: 100, y: 0, z: 0 }, { x: 0, y: 200, z: 0 }, { x: 0, y: 0, z: 300 })}</div>
            <div>{getEquationWallString({ x: 100, y: 0, z: 0 }, { x: 0, y: 200, z: 0 }, { x: 0, y: 0, z: 300 })}</div>
            <div>{getVectorLength(getEquationObject({ x: 100, y: 0, z: 0 }, { x: 0, y: 200, z: 0 }, { x: 0, y: 0, z: 300 }))}</div>

            <div>GHI</div>
            <div>{getEquationString({ x: 100, y: -200, z: 0 }, { x: 100, y: 100, z: 100 }, { x: 0, y: 100, z: -200 })}</div>
            <div>{getEquationWallString({ x: 100, y: -200, z: 0 }, { x: 100, y: 100, z: 100 }, { x: 0, y: 100, z: -200 })}</div>
            <div>{getVectorLength(getEquationObject({ x: 100, y: -200, z: 0 }, { x: 100, y: 100, z: 100 }, { x: 0, y: 100, z: -200 }))}</div> */}

            {/* <div>{getEquationString({ x: 1, y: 0, z: 0 }, { x: 0, y: 2, z: 0 }, { x: 0, y: 0, z: 3 })}</div>
            <div>{getVectorLength(getEquationObject({ x: 1, y: 0, z: 0 }, { x: 0, y: 2, z: 0 }, { x: 0, y: 0, z: 3 }))}</div> */}
        </div >
    )
}
