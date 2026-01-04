import { useMemo, useRef, useState } from 'react';
import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
import StyleLabelSelect from '../../../components/StyleLabelSelect/StyleLabelSelect.jsx';
import './FunctionControllerPanel.css';

export default function FunctionControllerPanel({
    faces,
    setFaces,
    selectedFace,
    selectedFaceId,
    toggleSelectFace,
    toggleOpenFace,
    openedFaceId,
    addFace,
    removeFace,
    updateFace,
    vectors,
    dots,
    setDots,
    setLines,
    toggleMenu,
    toggleStepFunction,
    collapseController,
    swapController,
    hexRgbaToPercent,
    handleShowCoordinateAxes,
    showCoordinateAxes
}) {
    const [groupFacesDotsVectors, setGroupFacesDotsVectors] = useState([]);

    const crossProductVector = (AB, AC) => {
        return {
            x: (AB.y * AC.z) - (AC.y * AB.z),
            y: (AB.z * AC.x) - (AC.z * AB.x),
            z: (AB.x * AC.y) - (AC.x * AB.y),
        };
    };

    const createVectorFromPoint = (A, B) => {
        return {
            x: B.x - A.x,
            y: B.y - A.y,
            z: B.z - A.z,
        };
    };

    const calculateVectorLength = (...coords) => {
        return Math.sqrt(
            coords.reduce((sum, value) => sum + value ** 2, 0)
        );
    };

    const simplifyVector = (...coords) => {
        if (coords.length === 0) return [];

        const divisor = coords.reduce((a, b) => {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b !== 0) {
                [a, b] = [b, a % b];
            }
            return a;
        });
        if (divisor === 0) return coords;

        return coords.map(v => v / divisor);
    };

    const findCenterGravityPoint = (dotA, dotB, dotC) => {
        return {
            x: Number(((dotA.xCoordinate + dotB.xCoordinate + dotC.xCoordinate) / 3)?.toFixed(2)),
            y: Number(((dotA.yCoordinate + dotB.yCoordinate + dotC.yCoordinate) / 3)?.toFixed(2)),
            z: Number(((dotA.zCoordinate + dotB.zCoordinate + dotC.zCoordinate) / 3)?.toFixed(2)),
        };
    };

    const getEquationString = (dotsLocation, FaceEquation) => {
        let n = {};
        let A = dotsLocation?.[0];
        if (dotsLocation?.length == 3) {
            let B = dotsLocation?.[1];
            let C = dotsLocation?.[2];
            const AB = createVectorFromPoint(A, B);
            const AC = createVectorFromPoint(A, C);
            n = crossProductVector(AB, AC);
        } else {
            n = {
                x: FaceEquation.x,
                y: FaceEquation.y,
                z: FaceEquation.z,
            };
        }
        const fA = n.x;
        const fB = n.y;
        const fC = n.z;
        const fD = 0 - (fA * A.x + fB * A.y + fC * A.z);
        const f = `${numberToString(fA, 1)}x ${numberToString(fB, 0)}y ${numberToString(fC, 0)}z ${numberToString(fD, 0)} = 0`;
        return f;
    };

    const getEquationWallString = (dotsLocation, FaceEquation) => {
        let n = {};
        let A = dotsLocation?.[0];
        if (dotsLocation?.length == 3) {
            let B = dotsLocation?.[1];
            let C = dotsLocation?.[2];
            const AB = createVectorFromPoint(A, B);
            const AC = createVectorFromPoint(A, C);
            n = crossProductVector(AB, AC);
        } else {
            n = {
                x: FaceEquation.x,
                y: FaceEquation.y,
                z: FaceEquation.z,
            };
        }
        const fA = n.x;
        const fB = n.y;
        const fC = n.z;
        const fD = 0 - (fA * A.x + fB * A.y + fC * A.z);
        const f = `x/(${((-1) * fD / fA)?.toFixed(3)}) + y/(${((-1) * fD / fB)?.toFixed(3)}) + z/(${((-1) * fD / fC)?.toFixed(3)}) (${((-1) * fD / fD)?.toFixed(3)}) = 0`;
        return f;
    };

    const getEquationObjectVector = (A, vector) => {
        const n = {
            x: 0 - Number(vector.xCoordinate),
            y: 0 - Number(vector.yCoordinate),
            z: 0 - Number(vector.zCoordinate),
        };
        console.log('n', n);
        const fA = n.x;
        const fB = n.y;
        const fC = n.z;
        const fD = 0 - (fA * A.x + fB * A.y + fC * A.z);
        const FaceEquation = {
            x: fA,
            y: fB,
            z: fC,
            D: fD,
        };
        return FaceEquation;
    };

    const getEquationObject = (A, B, C) => {
        const AB = createVectorFromPoint(A, B);
        const AC = createVectorFromPoint(A, C);
        const n = crossProductVector(AB, AC);
        console.log('n', n);
        const fA = n.x;
        const fB = n.y;
        const fC = n.z;
        const fD = 0 - (fA * A.x + fB * A.y + fC * A.z);
        const FaceEquation = {
            x: fA,
            y: fB,
            z: fC,
            D: fD,
        };
        return FaceEquation;
    };

    const numberToString = (number, position) => {
        return `${number >= 0 ? (position != 1 ? '+ ' : '') : (position != 1 ? '- ' : '-')}${Math.abs(number)}`;
    };

    const findFaceEquationAndCenterGravityPoint = (faceId, action) => {
        const relatedDots = groupFacesDotsVectors?.find(g => g.faceId == faceId);
        console.log('relatedDots', relatedDots);
        if (
            !relatedDots
            || (!relatedDots.vectorId && (!relatedDots.dotA || !relatedDots.dotB || !relatedDots.dotC))
            || (relatedDots.vectorId && !relatedDots.dotA)
        ) {
            console.log('Not enough point');
            return;
        }

        const dotA = dots.find(d => d.id == relatedDots.dotA);
        const dotB = dots.find(d => d.id == relatedDots.dotB);
        const dotC = dots.find(d => d.id == relatedDots.dotC);
        console.log('dotA', dotA);
        console.log('dotB', dotB);
        console.log('dotC', dotC);

        const selectedVector = mergedCoordinates?.find(m => m.id == relatedDots?.vectorId);
        console.log('selectedVector', selectedVector);

        let dotsLocation = [];
        let FaceEquation = {};
        let dotG = {};
        if (selectedVector && action == 'move') {
            dotsLocation = [
                { x: dotA.xCoordinate, y: dotA.yCoordinate, z: dotA.zCoordinate },
            ];
            console.log('dotsLocation', dotsLocation);

            FaceEquation = getEquationObjectVector(dotsLocation[0], selectedVector);
            console.log('FaceEquation', FaceEquation);

            dotG = { x: dotA.xCoordinate, y: dotA.yCoordinate, z: dotA.zCoordinate };
            console.log('dotG', dotG);
        } else {
            dotsLocation = [
                { x: dotA.xCoordinate, y: dotA.yCoordinate, z: dotA.zCoordinate },
                { x: dotB.xCoordinate, y: dotB.yCoordinate, z: dotB.zCoordinate },
                { x: dotC.xCoordinate, y: dotC.yCoordinate, z: dotC.zCoordinate },
            ];
            console.log('dotsLocation', dotsLocation);

            FaceEquation = getEquationObject(dotsLocation[0], dotsLocation[1], dotsLocation[2]);
            console.log('FaceEquation', FaceEquation);

            dotG = findCenterGravityPoint(dotA, dotB, dotC);
            console.log('dotG', dotG);
        }

        return {
            dotsLocation,
            FaceEquation,
            dotG,
        }
    };

    const findLinesCross = (Vector1, Point1, Vector2, Point2) => {
        console.log('%%% findLinesCross %%%');
        const { x: x1, y: y1, z: z1 } = Point1 ?? {};
        const { x: x2, y: y2, z: z2 } = Point2 ?? {};
        console.log('Point1', { x: x1, y: y1, z: z1 });
        console.log('Point2', { x: x2, y: y2, z: z2 });
        console.log('+++++++++++++++++++++++++');
        const [a1, b1, c1] = simplifyVector(Vector1.x, Vector1.y, Vector1.z) ?? [];
        const [a2, b2, c2] = simplifyVector(Vector2.x, Vector2.y, Vector2.z) ?? [];
        console.log('Vector1', { x: a1, y: b1, z: c1 });
        console.log('Vector2', { x: a2, y: b2, z: c2 });
        console.log('=========================');

        const t1 = ((b2 * (x1 - x2)) - (a2 * (y1 - y2))) / (((b1 * a2) - (a1 * b2)) == 0 ? 0.000001 : ((b1 * a2) - (a1 * b2)));
        const s1 = (x1 - x2 + (a1 * t1)) / (a2 == 0 ? 0.000001 : a2);
        const t2 = ((c2 * (x1 - x2)) - (a2 * (z1 - z2))) / (((c1 * a2) - (a1 * c2)) == 0 ? 0.000001 : ((c1 * a2) - (a1 * c2)));
        const s2 = (x1 - x2 + (a1 * t2)) / (a2 == 0 ? 0.000001 : a2);
        const t3 = ((b2 * (z1 - z2)) - (c2 * (y1 - y2))) / (((b1 * c2) - (c1 * b2)) == 0 ? 0.000001 : ((b1 * c2) - (c1 * b2)));
        const s3 = (z1 - z2 + (c1 * t3)) / (c2 == 0 ? 0.000001 : c2);

        // console.log('t1', t1);
        // console.log('s1', s1);
        // console.log('t2', t2);
        // console.log('s2', s2);
        // console.log('t3', t3);
        // console.log('s3', s3);

        const x = x1 + (a1 * (t1 || t2 || t3));
        const y = y1 + (b1 * (t1 || t2 || t3));
        const z = z1 + (c1 * (t1 || t2 || t3));

        const point = {
            x: x1 + (a1 * (t1 || t2 || t3)),
            y: y1 + (b1 * (t1 || t2 || t3)),
            z: z1 + (c1 * (t1 || t2 || t3)),
        }

        // setDots((prev) => [
        //     ...prev,
        //     {
        //         id: crypto.randomUUID(),
        //         size: 4,
        //         xCoordinate: x,
        //         yCoordinate: y,
        //         zCoordinate: z,
        //         // name: `G(${dotG.x},${dotG.y},${dotG.z})`,
        //         name: `Point`,
        //         nameSize: 12,
        //         xCoordinateName: 0,
        //         yCoordinateName: 0,
        //         color: '#68FCFF',
        //         nameColor: '#80FCFF',
        //         visible: 1,
        //         nameVisible: 1,
        //         vectorVisible: 0,
        //         vectorNameVisible: 0,
        //     }
        // ]);

        // setLines((prev) => [
        //     ...prev,
        //     {
        //         id: crypto.randomUUID(),
        //         parameterA: a2,
        //         parameterB: b2,
        //         parameterC: c2,
        //         pointX0: x2,
        //         pointY0: y2,
        //         pointZ0: z2,
        //         name: `Line ${prev.length + 1}`,
        //         nameSize: 12,
        //         xCoordinateName: 0,
        //         yCoordinateName: 0,
        //         color: '#68FCFF',
        //         nameColor: '#80FCFF',
        //         visible: 1,
        //         nameVisible: 1,
        //     }
        // ]);

        return point;
    };

    const checkUpDown = (d_AG_y, Z, X, yD0, zD0, yG, zG) => {
        d_AG_y = (Z == 0 && X == 0) ?
            (zD0 >= zG ?
                -Math.abs(d_AG_y)
                : Math.abs(d_AG_y)
            )
            : (yD0 >= yG ?
                Math.abs(d_AG_y)
                : -Math.abs(d_AG_y)
            );
        // console.log(d_AG_y);
        return d_AG_y;
    };

    const checkLeftRight = (d_AG_x, Z, X, xD0, xRA, zD0, zRA) => {
        d_AG_x = (X == 0) ?
            (Z == 0 ?
                (xD0 >= xRA ?
                    Math.abs(d_AG_x)
                    : -Math.abs(d_AG_x)
                )
                : (Z > 0 ?
                    (xD0 >= xRA ?
                        Math.abs(d_AG_x)
                        : -Math.abs(d_AG_x)
                    )
                    : (xD0 >= xRA ?
                        -Math.abs(d_AG_x)
                        : Math.abs(d_AG_x)
                    )
                )
            )
            : (X > 0 ?
                (Z == 0 ?
                    (zD0 >= zRA ?
                        -Math.abs(d_AG_x)
                        : Math.abs(d_AG_x)
                    )
                    : (Z > 0 ?
                        (xD0 >= xRA ?
                            Math.abs(d_AG_x)
                            : -Math.abs(d_AG_x)
                        )
                        : (xD0 >= xRA ?
                            -Math.abs(d_AG_x)
                            : Math.abs(d_AG_x)
                        )
                    )
                )
                : (Z == 0 ?
                    (zD0 >= zRA ?
                        Math.abs(d_AG_x)
                        : -Math.abs(d_AG_x)
                    )
                    : (Z > 0 ?
                        (xD0 >= xRA ?
                            Math.abs(d_AG_x)
                            : -Math.abs(d_AG_x)
                        )
                        : (xD0 >= xRA ?
                            -Math.abs(d_AG_x)
                            : Math.abs(d_AG_x)
                        )
                    )
                )
            );
        // console.log(d_AG_x);
        return d_AG_x;
    };

    const distanceToG = (faceId, action) => {
        const result = findFaceEquationAndCenterGravityPoint(faceId, action);
        const { dotsLocation, FaceEquation, dotG } = result ?? {};
        console.log('{ dotsLocation, FaceEquation, dotG }', dotsLocation, FaceEquation, dotG);
        if (!dotsLocation || !FaceEquation || !dotG) return;

        //Vector phap tuyen n
        const n = { x: FaceEquation.x, y: FaceEquation.y, z: FaceEquation.z };
        console.log('---------------------------------VectorN', n);

        //Vector go to G
        const AG = createVectorFromPoint(dotsLocation?.[0], dotG);
        const BG = createVectorFromPoint(dotsLocation?.[1], dotG);
        const CG = createVectorFromPoint(dotsLocation?.[2], dotG);

        //Vector chi phuong u
        const u = crossProductVector(n, ((n.x == 0 && n.z == 0) ? { x: 0, y: 0, z: 1 } : { x: 0, y: 1, z: 0 }));
        console.log('---------------------------------VectorU', u);
        const AGxU = crossProductVector(AG, u);
        const BGxU = crossProductVector(BG, u);
        const CGxU = crossProductVector(CG, u);
        const lengthAGxU = calculateVectorLength(AGxU.x, AGxU.y, AGxU.z);
        const lengthBGxU = calculateVectorLength(BGxU.x, BGxU.y, BGxU.z);
        const lengthCGxU = calculateVectorLength(CGxU.x, CGxU.y, CGxU.z);
        const lengthVectorU = calculateVectorLength(u.x, u.y, u.z);
        let d_AG_y = lengthAGxU / (lengthVectorU == 0 ? 0.000001 : lengthVectorU);
        let d_BG_y = lengthBGxU / (lengthVectorU == 0 ? 0.000001 : lengthVectorU);
        let d_CG_y = lengthCGxU / (lengthVectorU == 0 ? 0.000001 : lengthVectorU);
        // console.log('ddddddddddyyyyyyyyyy');
        // console.log('d_AG_y', d_AG_y);
        // console.log('d_BG_y', d_BG_y);
        // console.log('d_CG_y', d_CG_y);
        const yD0 = dotsLocation?.[0]?.y;
        const yD1 = dotsLocation?.[1]?.y;
        const yD2 = dotsLocation?.[2]?.y;

        //Vector chi phuong v
        const v = crossProductVector(u, n);
        console.log('---------------------------------VectorV', v);
        const AGxV = crossProductVector(AG, v);
        const BGxV = crossProductVector(BG, v);
        const CGxV = crossProductVector(CG, v);
        const lengthAGxV = calculateVectorLength(AGxV.x, AGxV.y, AGxV.z);
        const lengthBGxV = calculateVectorLength(BGxV.x, BGxV.y, BGxV.z);
        const lengthCGxV = calculateVectorLength(CGxV.x, CGxV.y, CGxV.z);
        const lengthVectorV = calculateVectorLength(v.x, v.y, v.z);
        let d_AG_x = lengthAGxV / (lengthVectorV == 0 ? 0.000001 : lengthVectorV);
        let d_BG_x = lengthBGxV / (lengthVectorV == 0 ? 0.000001 : lengthVectorV);
        let d_CG_x = lengthCGxV / (lengthVectorV == 0 ? 0.000001 : lengthVectorV);
        // console.log('ddddddddddxxxxxxxxxx');
        // console.log('d_AG_x', d_AG_x);
        // console.log('d_BG_x', d_BG_x);
        // console.log('d_CG_x', d_CG_x);
        const xD0 = dotsLocation?.[0]?.x;
        const zD0 = dotsLocation?.[0]?.z;
        const xD1 = dotsLocation?.[1]?.x;
        const zD1 = dotsLocation?.[1]?.z;
        const xD2 = dotsLocation?.[2]?.x;
        const zD2 = dotsLocation?.[2]?.z;

        const D = FaceEquation.D;
        const X = FaceEquation.x / (D == 0 ? 0.000001 : -D);
        // const Y = FaceEquation.y / (D == 0 ? 0.000001 : -D);
        const Z = FaceEquation.z / (D == 0 ? 0.000001 : -D);
        const refA = findLinesCross(v, dotG, u, dotsLocation?.[0]);
        const refB = findLinesCross(v, dotG, u, dotsLocation?.[1]);
        const refC = findLinesCross(v, dotG, u, dotsLocation?.[2]);
        const { x: xRA, z: zRA } = refA ?? {};
        const { x: xRB, z: zRB } = refB ?? {};
        const { x: xRC, z: zRC } = refC ?? {};
        // console.log('{ x: xRA, z: zRA }', { x: xRA, z: zRA });
        // console.log('{ x: xRB, z: zRB }', { x: xRB, z: zRB });
        // console.log('{ x: xRC, z: zRC }', { x: xRC, z: zRC });

        d_AG_x = checkLeftRight(d_AG_x, Z, X, xD0, xRA, zD0, zRA);
        d_BG_x = checkLeftRight(d_BG_x, Z, X, xD1, xRB, zD1, zRB);
        d_CG_x = checkLeftRight(d_CG_x, Z, X, xD2, xRC, zD2, zRC);
        d_AG_y = checkUpDown(d_AG_y, Z, X, yD0, zD0, dotG.y, dotG.z);
        d_BG_y = checkUpDown(d_BG_y, Z, X, yD1, zD1, dotG.y, dotG.z);
        d_CG_y = checkUpDown(d_CG_y, Z, X, yD2, zD2, dotG.y, dotG.z);

        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        shape: `${face.width / 2 + d_AG_x},${face.height / 2 + d_AG_y} ${face.width / 2 + d_BG_x},${face.height / 2 + d_BG_y} ${face.width / 2 + d_CG_x},${face.height / 2 + d_CG_y}`,
                    }
                    : face
            )
        );

        // setLines((prev) => [
        //     ...prev,
        //     {
        //         id: crypto.randomUUID(),
        //         parameterA: v.x,
        //         parameterB: v.y,
        //         parameterC: v.z,
        //         pointX0: dotG.x,
        //         pointY0: dotG.y,
        //         pointZ0: dotG.z,
        //         name: `Line ${prev.length + 1}`,
        //         nameSize: 12,
        //         xCoordinateName: 0,
        //         yCoordinateName: 0,
        //         color: '#68FCFF',
        //         nameColor: '#80FCFF',
        //         visible: 1,
        //         nameVisible: 1,
        //     }
        // ]);
    };

    const calculateAngle = (axe, FaceEquation) => {
        const D = FaceEquation.D;
        const X = FaceEquation.x / (D == 0 ? 0.000001 : -D);
        const Y = FaceEquation.y / (D == 0 ? 0.000001 : -D);
        const Z = FaceEquation.z / (D == 0 ? 0.000001 : -D);
        const underY = calculateVectorLength(X, Z);
        const vectorLength = calculateVectorLength(X, Y, Z);
        let xOz = Math.abs(Math.atan(X / (Z == 0 ? 0.000001 : Z)) * 180 / Math.PI);
        xOz = (X == 0) ?
            (Z == 0 ?
                0
                : (Z > 0 ?
                    0
                    : 180
                )
            )
            : (X > 0 ?
                (Z == 0 ?
                    90
                    : (Z > 0 ?
                        xOz
                        : 180 - xOz
                    )
                )
                : (Z == 0 ?
                    -90
                    : (Z > 0 ?
                        -xOz
                        : 180 + xOz
                    )
                )
            );
        const Oxyz = (underY == 0) ? 90 : Math.abs(Math.atan(Y / underY) * 180 / Math.PI);

        return axe == 'y' ? xOz
            : (axe == 'x' ? (Y >= 0 ? -Oxyz : Oxyz)
                : (axe == 'z' ? 1 / vectorLength : 0));
    };

    const updateFaceEquation = (faceId, action) => {
        const result = findFaceEquationAndCenterGravityPoint(faceId, action);
        const { dotsLocation, FaceEquation, dotG } = result ?? {};
        console.log('{ dotsLocation, FaceEquation, dotG }', dotsLocation, FaceEquation, dotG);
        if (!dotsLocation || !FaceEquation || !dotG) return;

        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        name: getEquationString(dotsLocation, FaceEquation),
                        width: 500,
                        height: 500,
                        shape: '0,0 500,0 500,500 0,500',
                        steps: [
                            { id: crypto.randomUUID(), type: 'translateX', value: dotG.x, visible: 1 },
                            { id: crypto.randomUUID(), type: 'translateY', value: dotG.y, visible: 1 },
                            { id: crypto.randomUUID(), type: 'translateZ', value: dotG.z, visible: 1 },
                            { id: crypto.randomUUID(), type: 'rotateY', value: calculateAngle('y', FaceEquation), visible: 1 },
                            { id: crypto.randomUUID(), type: 'rotateX', value: calculateAngle('x', FaceEquation), visible: 1 },
                        ]
                    }
                    : face
            )
        );

        // setDots((prev) => [
        //     ...prev,
        //     {
        //         id: crypto.randomUUID(),
        //         size: 4,
        //         xCoordinate: dotG.x,
        //         yCoordinate: dotG.y,
        //         zCoordinate: dotG.z,
        //         // name: `G(${dotG.x},${dotG.y},${dotG.z})`,
        //         name: `Gp`,
        //         nameSize: 12,
        //         xCoordinateName: 0,
        //         yCoordinateName: 0,
        //         color: '#68FCFF',
        //         nameColor: '#80FCFF',
        //         visible: 1,
        //         nameVisible: 1,
        //         vectorVisible: 1,
        //         vectorNameVisible: 1,
        //     }
        // ]);
    };

    const selectRefPoint = useRef(null);
    const selectRefPoint1 = useRef(null);
    const selectRefPoint2 = useRef(null);
    const selectRefPoint3 = useRef(null);
    const selectRefVector = useRef(null);
    const mergedCoordinates = useMemo(() => {
        return [
            ...dots.map(dot => ({
                id: dot.id,
                type: 'dot',
                name: dot.name,
                xCoordinate: dot.xCoordinate,
                yCoordinate: dot.yCoordinate,
                zCoordinate: dot.zCoordinate,
            })),
            ...vectors.map(vector => ({
                id: vector.id,
                type: 'vector',
                name: vector.name,
                xCoordinate: vector.xCoordinateB - vector.xCoordinateA,
                yCoordinate: vector.yCoordinateB - vector.yCoordinateA,
                zCoordinate: vector.zCoordinateB - vector.zCoordinateA,
            }))
        ];
    }, [dots, vectors]);

    return (
        <div className={`function-controller-panel-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'function' ? (selectedFace ? 'size_1_2' : 'size_1_1') : (selectedFace ? 'size_1_4' : 'size_1_3')}`}>
            <div className='heading'>
                <h2>Function  Ctrler</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <input
                        type='text'
                        value={JSON.stringify(faces, null, 0)}
                        onChange={(e) => setFaces(JSON.parse(e.target.value))}
                        className='input json-output'
                    />
                    <button className='btn' onClick={addFace}><i className='fa-solid fa-plus' /></button>
                    <button className='btn btn-remove' onClick={() => setFaces([])}><i className='fa-solid fa-trash-can' /></button>
                    <ButtonList
                        icon={'arrow-right-arrow-left'}
                        onToggle={swapController}
                    />
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
                                    {/* <button className='btn-click' onClick={() => copyFace(face.id)}><i className='fa-solid fa-copy' /></button> */}
                                    <button className='btn-click remove-click' onClick={() => removeFace(face.id)}><i className='fa-solid fa-trash-can' /></button>
                                </div>
                            </div>
                        </div>

                        {openedFaceId.includes(face.id) &&
                            <div className='function-dots-vector'>
                                <div className='row row-1'>
                                    <div className='selects'>
                                        <StyleLabelSelect
                                            reference={selectRefPoint1}
                                            list={dots}
                                            value={groupFacesDotsVectors.find(g => g.faceId == face.id)?.dotA || ''}
                                            onValueChange={(propE) => {
                                                const value = propE.value;
                                                setGroupFacesDotsVectors(prev => {
                                                    const index = prev.findIndex(g => g.faceId == face.id);
                                                    if (index !== -1) {
                                                        const newArr = [...prev];
                                                        newArr[index] = { ...newArr[index], dotA: value };
                                                        return newArr;
                                                    }
                                                    return [...prev, { faceId: face.id, dotA: value, dotB: '', dotC: '', vectorId: '', }];
                                                });
                                                if (selectRefVector.current) {
                                                    selectRefVector.current.value = '';
                                                }
                                            }}
                                            extraClassName={''}
                                            extraStyle={{ flex: 1.5, opacity: selectRefPoint1.current?.value ? 1 : 0.4 }}
                                            label={'Point 1'}
                                            labelStyle={'center'}
                                        />
                                        <StyleLabelSelect
                                            reference={selectRefPoint2}
                                            list={dots}
                                            value={groupFacesDotsVectors.find(g => g.faceId == face.id)?.dotB || ''}
                                            onValueChange={(propE) => {
                                                const value = propE.value;
                                                setGroupFacesDotsVectors(prev => {
                                                    const index = prev.findIndex(g => g.faceId == face.id);
                                                    if (index !== -1) {
                                                        const newArr = [...prev];
                                                        newArr[index] = { ...newArr[index], dotB: value };
                                                        return newArr;
                                                    }
                                                    return [...prev, { faceId: face.id, dotA: '', dotB: value, dotC: '', vectorId: '', }];
                                                });
                                                if (selectRefVector.current) {
                                                    selectRefVector.current.value = '';
                                                }
                                            }}
                                            extraClassName={''}
                                            extraStyle={{ flex: 1.5, opacity: selectRefPoint2.current?.value ? 1 : 0.4 }}
                                            label={'Point 2'}
                                            labelStyle={'center'}
                                        />
                                        <StyleLabelSelect
                                            reference={selectRefPoint3}
                                            list={dots}
                                            value={groupFacesDotsVectors.find(g => g.faceId == face.id)?.dotC || ''}
                                            onValueChange={(propE) => {
                                                const value = propE.value;
                                                setGroupFacesDotsVectors(prev => {
                                                    const index = prev.findIndex(g => g.faceId == face.id);
                                                    if (index !== -1) {
                                                        const newArr = [...prev];
                                                        newArr[index] = { ...newArr[index], dotC: value };
                                                        return newArr;
                                                    }
                                                    return [...prev, { faceId: face.id, dotA: '', dotB: '', dotC: value, vectorId: '', }];
                                                });
                                                if (selectRefVector.current) {
                                                    selectRefVector.current.value = '';
                                                }
                                            }}
                                            extraClassName={''}
                                            extraStyle={{ flex: 1.5, opacity: selectRefPoint3.current?.value ? 1 : 0.4 }}
                                            label={'Point 3'}
                                            labelStyle={'center'}
                                        />
                                    </div>
                                    <div className='btns'>
                                        <button className='btn' onClick={() => updateFaceEquation(face.id, 'cut')}
                                            disabled={(() => {
                                                const FaceInGroup = groupFacesDotsVectors.find(g => g.faceId === face.id);
                                                return !FaceInGroup?.dotA || !FaceInGroup?.dotB || !FaceInGroup?.dotC;
                                            })()}
                                        >
                                            <i className='fa-solid fa-arrows-up-down-left-right' />
                                        </button>
                                        <button className='btn' onClick={() => distanceToG(face.id, 'cut')}
                                            disabled={(() => {
                                                const FaceInGroup = groupFacesDotsVectors.find(g => g.faceId === face.id);
                                                return !FaceInGroup?.dotA || !FaceInGroup?.dotB || !FaceInGroup?.dotC;
                                            })()}
                                        >
                                            <i className='fa-solid fa-cut' />
                                        </button>
                                    </div>
                                </div>
                                <div className='row row-2'>
                                    <div className='selects'>
                                        <StyleLabelSelect
                                            reference={selectRefPoint}
                                            list={dots}
                                            value={groupFacesDotsVectors.find(g => g.faceId == face.id)?.dotA || ''}
                                            onValueChange={(propE) => {
                                                const value = propE.value;
                                                setGroupFacesDotsVectors(prev => {
                                                    const index = prev.findIndex(g => g.faceId == face.id);
                                                    if (index !== -1) {
                                                        const newArr = [...prev];
                                                        newArr[index] = { ...newArr[index], dotA: value };
                                                        return newArr;
                                                    }
                                                    return [...prev, { faceId: face.id, dotA: value, dotB: '', dotC: '', vectorId: '', }];
                                                });
                                                if (selectRefVector.current) {
                                                    selectRefVector.current.value = '';
                                                }
                                            }}
                                            extraClassName={''}
                                            extraStyle={{ flex: 1, opacity: selectRefPoint.current?.value ? 1 : 0.4 }}
                                            label={'Point'}
                                            labelStyle={'center'}
                                        />
                                        <StyleLabelSelect
                                            reference={selectRefVector}
                                            list={mergedCoordinates}
                                            value={groupFacesDotsVectors.find(g => g.faceId == face.id)?.vectorId || ''}
                                            onValueChange={(propE) => {
                                                const value = propE.value;
                                                setGroupFacesDotsVectors(prev => {
                                                    const index = prev.findIndex(g => g.faceId == face.id);
                                                    if (index !== -1) {
                                                        const newArr = [...prev];
                                                        newArr[index] = { ...newArr[index], vectorId: value };
                                                        return newArr;
                                                    }
                                                    return [...prev, { faceId: face.id, dotA: '', dotB: '', dotC: '', vectorId: value, }];
                                                });
                                                if (selectRefPoint1.current) {
                                                    selectRefPoint1.current.value = '';
                                                }
                                                if (selectRefPoint2.current) {
                                                    selectRefPoint2.current.value = '';
                                                }
                                                if (selectRefPoint3.current) {
                                                    selectRefPoint3.current.value = '';
                                                }
                                            }}
                                            extraClassName={''}
                                            extraStyle={{ flex: 2, opacity: selectRefVector.current?.value ? 1 : 0.4 }}
                                            label={'Vector'}
                                            labelStyle={'center'}
                                        />
                                    </div>
                                    <div className='btns'>
                                        <button className='btn' onClick={() => updateFaceEquation(face.id, 'move')}
                                            disabled={(() => {
                                                const FaceInGroup = groupFacesDotsVectors.find(g => g.faceId === face.id);
                                                return !FaceInGroup?.dotA || !FaceInGroup?.vectorId;
                                            })()}
                                        >
                                            <i className='fa-solid fa-arrows-up-down-left-right' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div >
    )
}
