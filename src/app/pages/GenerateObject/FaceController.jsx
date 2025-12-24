import { useState } from 'react';
import ColorInput from '../../components/ColorInput/ColorInput.jsx';
import './FaceController.css';
import { Link } from 'react-router-dom';

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
                nameSize: 12,
                borderWidth: 2,
                color: '#68FCFF80',
                nameColor: '#80FCFFFF',
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
                        [attribute]: (attribute == 'width' || attribute == 'height' || attribute == 'nameSize' || attribute == 'borderWidth' || attribute == 'visible' || attribute == 'nameVisible' || attribute == 'borderVisible') ? Math.max(0, Number(newValue)) : newValue
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

    const jsonToState = (json) => {
        const id = json?.replaceAll('"id"', 'id');
        const name = id?.replaceAll('"name"', 'name');
        const width = name?.replaceAll('"width"', 'width');
        const height = width?.replaceAll('"height"', 'height');
        const nameSize = height?.replaceAll('"nameSize"', 'nameSize');
        const borderWidth = nameSize?.replaceAll('"borderWidth"', 'borderWidth');
        const color = borderWidth?.replaceAll('"color"', 'color');
        const nameColor = color?.replaceAll('"nameColor"', 'nameColor');
        const borderColor = nameColor?.replaceAll('"borderColor"', 'borderColor');
        const visible = borderColor?.replaceAll('"visible"', 'visible');
        const nameVisible = visible?.replaceAll('"nameVisible"', 'nameVisible');
        const borderVisible = nameVisible?.replaceAll('"borderVisible"', 'borderVisible');
        const steps = borderVisible?.replaceAll('"steps"', 'steps');
        const type = steps?.replaceAll('"type"', 'type');
        const value = type?.replaceAll('"value"', 'value');
        return value;
    }

    return (
        <>
            <div className={`face-controller-container card ${selectedFace ? 'size2' : 'size1'}`}>
                <div className='heading'>
                    <h2>Face Controller Panel</h2>
                    <input
                        type='text'
                        value={JSON.stringify(faces, null, 0)}
                        // value={jsonToState(JSON.stringify(faces, null, 0)) || ''}
                        onChange={(e) => setFaces(JSON.parse(e.target.value))}
                        className='input json-output'
                    />
                    <button className='btn add-btn' onClick={addFace}><i className='fa-solid fa-plus' /></button>
                    {/* <Link to='/' state={'5fa8b8df-595a-4f13-b808-7f58b404dd87'}><button className='btn'>/</button></Link> */}
                </div>

                <div className='faces-list'>
                    {faces.map((face) => (
                        <div key={face.id} className={`face-card card ${face.visible == 0 && 'invisible'}`}>
                            <div className='face-header'>
                                <input
                                    type='color'
                                    value={face.color?.slice(0, 7) || '#FFFFFF'}
                                    onChange={(e) => updateFace(face.id, 'color', e.target.value?.toUpperCase())}
                                    className='input color-input'
                                    style={{ opacity: hexRgbaToPercent(face.color || '#FFFFFFFF') || 1 }}
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
                                                    <option value='clipPath' className='option'>clipPath</option>
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
                    <div className='form-group form-color'>
                        <ColorInput
                            selectedFace={selectedFace}
                            attribute={'color'}
                            label={'Face Color'}
                            updateFace={updateFace}
                            hexRgbaToPercent={hexRgbaToPercent}
                            updateHexAlphaByPercent={updateHexAlphaByPercent}
                        />
                        <ColorInput
                            selectedFace={selectedFace}
                            attribute={'nameColor'}
                            label={'Name Color'}
                            updateFace={updateFace}
                            hexRgbaToPercent={hexRgbaToPercent}
                            updateHexAlphaByPercent={updateHexAlphaByPercent}
                        />
                        <ColorInput
                            selectedFace={selectedFace}
                            attribute={'borderColor'}
                            label={'Border Color'}
                            updateFace={updateFace}
                            hexRgbaToPercent={hexRgbaToPercent}
                            updateHexAlphaByPercent={updateHexAlphaByPercent}
                        />
                    </div>

                    <div className={`form-group form-name ${selectedFace?.nameVisible == 0 && 'invisible'}`}>
                        <div className='input-group flex-2'>
                            <input
                                type='text'
                                placeholder=''
                                value={selectedFace?.name || ''}
                                onChange={(e) => updateFace(selectedFace?.id, 'name', e.target.value)}
                                className='input'
                            />
                            <label htmlFor='Name'>Name</label>
                        </div>
                        <div className='input-group'>
                            <input
                                type='number'
                                placeholder=''
                                value={selectedFace?.nameSize || 0}
                                onChange={(e) => updateFace(selectedFace?.id, 'nameSize', e.target.value)}
                                className='input'
                            />
                            <label htmlFor='nameSize'>Name Size</label>
                        </div>
                        <button type='button' className={`btn-name ${selectedFace?.nameVisible == 1 && 'visible-name'}`} onClick={() => updateFace(selectedFace?.id, 'nameVisible', selectedFace?.nameVisible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                    </div>
                    <div className={`form-group form-border ${selectedFace?.borderVisible == 0 && 'invisible'}`}>
                        <div className='input-group'>
                            <input
                                type='number'
                                placeholder=''
                                value={selectedFace?.borderWidth || 0}
                                onChange={(e) => updateFace(selectedFace?.id, 'borderWidth', e.target.value)}
                                className='input'
                            />
                            <label htmlFor='borderWidth'>Border Width</label>
                        </div>
                        <button type='button' className={`btn-border ${selectedFace?.borderVisible == 1 && 'visible-border'}`} onClick={() => updateFace(selectedFace?.id, 'borderVisible', selectedFace?.borderVisible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                    </div>
                    <div className='form-group form-size'>
                        <div className='input-group'>
                            <input
                                type='number'
                                placeholder=''
                                value={selectedFace?.width || 0}
                                onChange={(e) => updateFace(selectedFace?.id, 'width', e.target.value)}
                                className='input'
                            />
                            <label htmlFor='Width'>Width</label>
                        </div>
                        <div className='input-group'>
                            <input
                                type='number'
                                placeholder=''
                                value={selectedFace?.height || 0}
                                onChange={(e) => updateFace(selectedFace?.id, 'height', e.target.value)}
                                className='input'
                            />
                            <label htmlFor='Height'>Height</label>
                        </div>
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
