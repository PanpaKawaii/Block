import { useState } from 'react';

import GenerateObject from './GenerateObject';
import FaceController from './FaceController';

export default function GenerateObjectController() {

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
    const [faces, setFaces] = useState([]);
    const [selectedFace, setSelectedFace] = useState(null);
    console.log('faces', faces);

    return (
        <>
            <GenerateObject faces={faces} />
            <FaceController faces={faces} setFaces={setFaces} setSelectedFace={setSelectedFace} />
        </>
    )
}
