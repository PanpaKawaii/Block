import { useState } from 'react';
import './FaceController.css';

export default function FaceController({ faces, setFaces }) {

    const [selectedFaceId, setSelectedFaceId] = useState(null);
    const toggleSelectFace = (faceId) => {
        setSelectedFaceId(prev => {
            if (prev && prev == faceId) {
                return null;
            } else {
                return faceId;
            }
        })
    }
    const [opennedFaceId, setOpennedFaceId] = useState([]);
    const toggleOpenFace = (faceId) => {
        setOpennedFaceId(prev => {
            if (prev.includes(faceId)) {
                return prev.filter(id => id != faceId);
            } else {
                return [...prev, faceId];
            }
        })
    }

    const addFace = () => {
        setFaces((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                visible: 1,
                name: `Face ${prev.length + 1}`,
                width: 100,
                height: 100,
                steps: [
                    { id: crypto.randomUUID(), type: 'clipPath', value: '0,0 100,0 100,100 0,100', visible: 1 },
                ]
            }
        ]);
    };

    const removeFace = (faceId) => {
        setFaces((prev) => prev.filter((face) => face.id !== faceId));
    };

    const updateFace = (faceId, attribute, newValue) => {
        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        [attribute]: (attribute == 'width' || attribute == 'height' || attribute == 'visible') ? Number(newValue) : newValue
                    }
                    : face
            )
        );
        // setSelectedFaceId((prev) =>
        //     prev && prev.id === faceId
        //         ? {
        //             ...prev,
        //             [attribute]: Number(newValue)
        //         }
        //         : prev
        // );
    };

    const addStep = (faceId, type) => {
        const defaultValue =
            type.includes('translate') ? '0'
                : type.includes('rotate') ? '0'
                    : type.includes('scale') ? '1'
                        // : '0% 0%, 100% 0, 100% 100%, 0% 100%';
                        : '0,0 100,0 100,100 0,100';

        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        steps: [
                            ...face.steps,
                            { id: crypto.randomUUID(), type, value: defaultValue, visible: 1 }
                        ]
                    }
                    : face
            )
        );
    };

    const removeStep = (faceId, stepId) => {
        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        steps: face.steps.filter((step) => step.id !== stepId)
                    }
                    : face
            )
        );
    };

    const updateStep = (faceId, stepId, newType, newValue, newVisible) => {
        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        steps: face.steps.map((step) =>
                            step.id === stepId ? { ...step, type: newType, value: newValue, visible: newVisible } : step
                        )
                    }
                    : face
            )
        );
    };

    const selectedFace = faces.find(face => face.id === selectedFaceId);
    console.log('selectedFace', selectedFace);

    return (
        <>
            <div className={`face-controller-container card ${selectedFace ? 'size2' : 'size1'}`}>
                <div className='heading'>
                    <h2>Face Controller Panel</h2>
                    <button className='btn add-btn' onClick={addFace}><i className='fa-solid fa-plus' /></button>
                </div>

                <div className='faces-list'>
                    {faces.map((face) => (
                        <div key={face.id} className='face-card card'>
                            <div className='face-header'>
                                <h3>{face.name}</h3>
                                <div className='btns'>
                                    <button className={`btn-face ${selectedFaceId == face.id && 'selected-face'}`} onClick={() => toggleSelectFace(face.id)}><i className='fa-solid fa-gear' /></button>
                                    <button className={`btn-face ${opennedFaceId.includes(face.id) && 'openned-face'}`} onClick={() => toggleOpenFace(face.id)}><i className='fa-solid fa-hand' /></button>
                                    <button className={`btn-face ${face.visible == 1 && 'visible-face'}`} onClick={() => updateFace(face.id, 'visible', face.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                    <button className='btn-face remove-face' onClick={() => removeFace(face.id)}><i className='fa-solid fa-xmark' /></button>
                                </div>
                            </div>

                            {opennedFaceId.includes(face.id) &&
                                <>
                                    <div className='steps'>
                                        {face.steps.map((step) => (
                                            <div key={step.id} className='step-row'>
                                                <select
                                                    value={step.type}
                                                    onChange={(e) => updateStep(face.id, step.id, e.target.value, step.value, step.visible)}
                                                    className='select'
                                                >
                                                    <option value='translateX' className='option'>translateX</option>
                                                    <option value='translateY' className='option'>translateY</option>
                                                    <option value='translateZ' className='option'>translateZ</option>
                                                    <option value='rotateX' className='option'>rotateX</option>
                                                    <option value='rotateY' className='option'>rotateY</option>
                                                    <option value='rotateZ' className='option'>rotateZ</option>
                                                    <option value='scale' className='option'>scale</option>
                                                    <option value='clipPath' className='option'>clip-path</option>
                                                </select>

                                                <input
                                                    type='text'
                                                    value={step.value}
                                                    onChange={(e) => updateStep(face.id, step.id, step.type, e.target.value, step.visible)}
                                                    className={`input ${step.type}`}
                                                />

                                                <div className='btns'>
                                                    <button className={`btn-step ${step.visible == 1 && 'visible-step'}`} onClick={() => updateStep(face.id, step.id, step.type, step.value, step.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                                    <button className='btn-step remove-step' onClick={() => removeStep(face.id, step.id)}><i className='fa-solid fa-xmark' /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='add-step-box'>
                                        <button className='btn' onClick={() => addStep(face.id, 'translateX')}>ADD STEP</button>
                                        {/* <button onClick={() => addStep(face.id, 'translateX')}>translateX</button>
                                        <button onClick={() => addStep(face.id, 'translateY')}>translateY</button>
                                        <button onClick={() => addStep(face.id, 'translateZ')}>translateZ</button>
                                        <button onClick={() => addStep(face.id, 'rotateX')}>rotateX</button>
                                        <button onClick={() => addStep(face.id, 'rotateY')}>rotateY</button>
                                        <button onClick={() => addStep(face.id, 'rotateZ')}>rotateZ</button>
                                        <button onClick={() => addStep(face.id, 'scale')}>scale</button>
                                        <button onClick={() => addStep(face.id, 'clipPath')}>clip-path</button> */}
                                    </div>
                                </>
                            }
                        </div>
                    ))}
                </div>
            </div>

            <div className={`sub-face-controller-container card ${selectedFace ? 'size3' : 'size4'}`}>
                <div className='heading'>
                    <h2>Face Detail</h2>
                    <button className='btn-close' onClick={() => setSelectedFaceId(null)}><i className='fa-solid fa-xmark' /></button>
                </div>

                <div>
                    <div className='form-group'>
                        <label>Name</label>
                        <input
                            type='text'
                            value={selectedFace?.name || ''}
                            onChange={(e) => updateFace(selectedFace?.id, 'name', e.target.value)}
                            // className={`input ${''}`}
                            className='input'
                        />
                    </div>
                    <div className='form-group'>
                        <label>Width</label>
                        <input
                            type='number'
                            value={selectedFace?.width || 0}
                            onChange={(e) => updateFace(selectedFace?.id, 'width', e.target.value)}
                            className='input'
                        />
                    </div>
                    <div className='form-group'>
                        <label>Height</label>
                        <input
                            type='number'
                            value={selectedFace?.height || 0}
                            onChange={(e) => updateFace(selectedFace?.id, 'height', e.target.value)}
                            className='input'
                        />
                    </div>
                    <textarea
                        type='textarea'
                        value={JSON.stringify(selectedFace, null, 0)}
                        className='input'
                    />
                    {/* <pre>{JSON.stringify(selectedFace || '', null, 0).replace(/,\n/g, ',').replace(/],/g, '],\n')}</pre> */}
                </div>
            </div>
        </>
    );
}
