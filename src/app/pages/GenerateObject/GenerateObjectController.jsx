import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import GenerateObject from './GenerateObject';
import FaceController from './FaceController';

import { FACEs } from '../../../mocks/DatabaseSample';

export default function GenerateObjectController() {
    const location = useLocation();
    console.log('location.state', location.state);

    // const [faces, setFaces] = useState([
    //     {
    //         id: crypto.randomUUID(),
    //         name: 'Front',
    //         steps: [
    //             { id: crypto.randomUUID(), type: 'translateX', value: '10' },
    //             { id: crypto.randomUUID(), type: 'rotateX', value: '45' },
    //         ]
    //     },
    //     {
    //         id: crypto.randomUUID(),
    //         name: 'Right',
    //         steps: [
    //             { id: crypto.randomUUID(), type: 'translateY', value: '0' },
    //         ]
    //     }
    // ]);

    // const [blockId, setBlockId] = useState(location.state || crypto.randomUUID());
    // console.log('blockId', blockId);
    const [faces, setFaces] = useState([]);
    const [selectedFaceId, setSelectedFaceId] = useState(null);
    console.log('faces', faces);

    useEffect(() => {
        // console.log('useEffect START');
        // console.log('FACEs', FACEs);
        const blockId = location.state;
        // console.log('blockId', blockId);
        const filteredFaces = FACEs?.filter(face => face.blockId == blockId);
        setFaces(filteredFaces);
        // console.log('filteredFaces', filteredFaces);
        // console.log('useEffect END');
    }, [location.state]);

    const [showCoordinateAxes, setShowCoordinateAxes] = useState([]);
    const [sceneStyle, setSceneStyle] = useState({
        scale: 1,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
    });

    console.log('sceneStyle', sceneStyle);


    return (
        <>
            <GenerateObject
                faces={faces} sceneStyle={sceneStyle}
                selectedFaceId={selectedFaceId}
                setSelectedFaceId={setSelectedFaceId}
                showCoordinateAxes={showCoordinateAxes}
            />
            <FaceController
                faces={faces}
                setFaces={setFaces}
                sceneStyle={sceneStyle}
                setSceneStyle={setSceneStyle}
                selectedFaceId={selectedFaceId}
                setSelectedFaceId={setSelectedFaceId}
                showCoordinateAxes={showCoordinateAxes}
                setShowCoordinateAxes={setShowCoordinateAxes}
            />
        </>
    )
}
