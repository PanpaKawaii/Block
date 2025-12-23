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
                name: `Face ${prev.length + 1}`,
                width: 100,
                height: 100,
                color: '#68FCFF80',
                borderWidth: 2,
                borderColor: '#68FCFFFF',
                visible: 1,
                nameVisible: 1,
                borderVisible: 1,
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
                        [attribute]: (attribute == 'width' || attribute == 'height' || attribute == 'borderWidth' || attribute == 'visible' || attribute == 'nameVisible' || attribute == 'borderVisible') ? Number(newValue) : newValue
                    }
                    : face
            )
        );
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

    const hexRgbaToPercent = (hexRgba) => {
        const hexAlpha = hexRgba.slice(7, 9) || 'ff';
        const alpha = parseInt(hexAlpha, 16);
        return (alpha / 255)?.toFixed(2) || 1;
    };
    const updateHexAlphaByPercent = (oldHex, percent) => {
        const p = Math.max(0, Math.min(100, percent));
        const alphaHex = Math.round((p / 100) * 255)
            .toString(16)
            .padStart(2, '0')
            .toUpperCase();
        const rgbHex = oldHex.slice(0, 7);
        console.log('OLD:', oldHex);
        console.log('HEX RGBA:', rgbHex + alphaHex);
        return rgbHex + alphaHex;
    };

    const selectedFace = faces.find(face => face.id === selectedFaceId);
    console.log('selectedFace', selectedFace);

    return (
        <>
            <div className={`face-controller-container card ${selectedFace ? 'size2' : 'size1'}`}>
                <div className='heading'>
                    <h2>Face Controller Panel</h2>
                    <input
                        type='text'
                        value={JSON.stringify(faces, null, 0)}
                        onChange={(e) => setFaces(JSON.parse(e.target.value))}
                        className='input json-output'
                    />
                    <button className='btn add-btn' onClick={addFace}><i className='fa-solid fa-plus' /></button>
                </div>

                <div className='faces-list'>
                    {faces.map((face) => (
                        <div key={face.id} className={`face-card card ${face.visible == 0 && 'invisible'}`}>
                            <div className='face-header'>
                                <input
                                    type='color'
                                    value={face.color?.slice(0, 7) || '#ffffff'}
                                    onChange={(e) => updateFace(face.id, 'color', e.target.value?.toUpperCase())}
                                    className='input color-input'
                                    style={{ opacity: hexRgbaToPercent(face.color || '#ffffffff') || 1 }}
                                />
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
                                            <div key={step.id} className={`step-row ${step.visible == 0 && 'invisible'}`}>
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

                <form>
                    <div className='form-group color-picker-wrapper'>
                        <label>Color</label>
                        <input
                            type='color'
                            value={selectedFace?.color?.slice(0, 7) || '#ffffff'}
                            onChange={(e) => updateFace(selectedFace?.id, 'color', e.target.value?.toUpperCase())}
                            className='input color-input'
                            style={{ opacity: hexRgbaToPercent(selectedFace?.color || '#ffffffff') || 1 }}
                        />
                        <input
                            type='text'
                            value={selectedFace?.color}
                            onChange={(e) => updateFace(selectedFace?.id, 'color', e.target.value?.toUpperCase())}
                            className='input hex-input'
                        />
                        <input
                            type='number'
                            min={0}
                            max={100}
                            value={(hexRgbaToPercent(selectedFace?.color || '#ffffffff') * 100)?.toFixed(0) || 100}
                            onChange={(e) => updateFace(selectedFace?.id, 'color', updateHexAlphaByPercent(selectedFace?.color, e.target.value || 100))}
                            className='input alpha-input'
                        />
                    </div>

                    <div className={`form-group ${selectedFace?.nameVisible == 0 && 'invisible'}`}>
                        <label>Name</label>
                        <input
                            type='text'
                            value={selectedFace?.name || ''}
                            onChange={(e) => updateFace(selectedFace?.id, 'name', e.target.value)}
                            className='input'
                        />
                        <button type='button' className={`btn-name ${selectedFace?.nameVisible == 1 && 'visible-name'}`} onClick={() => updateFace(selectedFace?.id, 'nameVisible', selectedFace?.nameVisible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
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

                    <div className={`form-group color-picker-wrapper ${selectedFace?.borderVisible == 0 && 'invisible'}`}>
                        <input
                            type='number'
                            value={selectedFace?.borderWidth || 0}
                            onChange={(e) => updateFace(selectedFace?.id, 'borderWidth', e.target.value)}
                            className='input border-width-input'
                        />
                        <input
                            type='color'
                            value={selectedFace?.borderColor?.slice(0, 7) || '#ffffff'}
                            onChange={(e) => updateFace(selectedFace?.id, 'borderColor', e.target.value?.toUpperCase())}
                            className='input color-input'
                            style={{ opacity: hexRgbaToPercent(selectedFace?.borderColor || '#ffffffff') || 1 }}
                        />
                        <input
                            type='text'
                            value={selectedFace?.borderColor}
                            onChange={(e) => updateFace(selectedFace?.id, 'borderColor', e.target.value?.toUpperCase())}
                            className='input hex-input'
                        />
                        <input
                            type='number'
                            min={0}
                            max={100}
                            value={(hexRgbaToPercent(selectedFace?.borderColor || '#ffffffff') * 100)?.toFixed(0) || 100}
                            onChange={(e) => updateFace(selectedFace?.id, 'borderColor', updateHexAlphaByPercent(selectedFace?.borderColor, e.target.value || 100))}
                            className='input alpha-input'
                        />
                        <button type='button' className={`btn-border ${selectedFace?.borderVisible == 1 && 'visible-border'}`} onClick={() => updateFace(selectedFace?.id, 'borderVisible', selectedFace?.borderVisible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                    </div>

                    {/* <textarea
                        type='textarea'
                        value={JSON.stringify(selectedFace, null, 0)}
                        className='input'
                        disabled
                    /> */}
                    {/* <pre>{JSON.stringify(selectedFace || '', null, 0).replace(/,\n/g, ',').replace(/],/g, '],\n')}</pre> */}
                </form>
            </div>
        </>
    );
}
