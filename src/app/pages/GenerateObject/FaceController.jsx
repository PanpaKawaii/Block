import { useState } from 'react';
// import { Link } from 'react-router-dom';
import ButtonList from '../../components/ButtonList/ButtonList.jsx';
import ColorInput from '../../components/ColorInput/ColorInput.jsx';
import CopyPasteButton from '../../components/CopyPasteButton/CopyPasteButton.jsx';
import ClickPercentBox from './ClickPercentBox/ClickPercentBox.jsx';
import DotControllerPanel from './DotControllerPanel/DotControllerPanel.jsx';
import FunctionControllerPanel from './FunctionControllerPanel/FunctionControllerPanel.jsx';
import LineControllerPanel from './LineControllerPanel/LineControllerPanel.jsx';
import SceneController from './SceneController/SceneController.jsx';
import VectorControllerPanel from './VectorControllerPanel/VectorControllerPanel.jsx';

import './FaceController.css';

export default function FaceController({
    faces,
    setFaces,
    dots,
    setDots,
    vectors,
    setVectors,
    sceneStyle,
    setSceneStyle,
    selectedFaceId,
    setSelectedFaceId,
    selectedDotId,
    setSelectedDotId,
    selectedVectorId,
    setSelectedVectorId,
    showCoordinateAxes,
    setShowCoordinateAxes,
    lines,
    setLines,
    selectedLineId,
    setSelectedLineId
}) {
    const handleShowCoordinateAxes = (faceId) => {
        setShowCoordinateAxes(prev => {
            if (prev.includes(faceId)) {
                return prev.filter(id => id != faceId);
            } else {
                return [...prev, faceId];
            }
        });
    };

    const [toggleStepFunction, setToggleStepFunction] = useState('face');
    const swapController = (item) => {
        setToggleStepFunction(item);
        setOpenedFaceId([]);
    };

    const [toggleMenu, setToggleMenu] = useState(true);
    const collapseController = () => {
        setToggleMenu(p => !p);
        setOpenedFaceId([]);
    };

    const [openedFaceId, setOpenedFaceId] = useState([]);
    const toggleOpenFace = (faceId) => {
        setOpenedFaceId(prev => {
            if (prev.includes(faceId)) {
                return prev.filter(id => id != faceId);
            } else {
                return [...prev, faceId];
            }
        });
    };

    const [openEditShape, setOpenEditShape] = useState(false);
    const toggleSelectFace = (faceId) => {
        setSelectedFaceId(prev => {
            if (prev && prev == faceId) {
                return null;
            } else {
                return faceId;
            }
        });
    };

    const copyFace = (faceId) => {
        const newId = crypto.randomUUID();
        setFaces((prev) => [
            ...prev,
            {
                ...prev.find(face => face.id == faceId),
                id: newId,
                name: `Face ${prev.length + 1}`,
            }
        ]);
        toggleOpenFace(newId);
    };

    const addFace = () => {
        const newId = crypto.randomUUID();
        setFaces((prev) => [
            {
                id: newId,
                shape: '0,0 200,0 200,200 0,200',
                name: `Face ${prev.length + 1}`,
                width: 200,
                height: 200,
                glow: 4,
                nameSize: 12,
                borderWidth: 2,
                color: '#68FCFF33',
                nameColor: '#80FCFFFF',
                borderColor: '#68FCFFFF',
                visible: 1,
                nameVisible: 1,
                borderVisible: 1,
                glowVisible: 1,
                steps: []
            },
            ...prev,
        ]);
        toggleOpenFace(newId);
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
                        [attribute]: (
                            attribute == 'width'
                            || attribute == 'height'
                            || attribute == 'glow'
                            || attribute == 'nameSize'
                            || attribute == 'borderWidth'
                            || attribute == 'visible'
                            || attribute == 'nameVisible'
                            || attribute == 'borderVisible'
                            || attribute == 'glowVisible'
                        ) ? Math.max(0, Number(newValue)) : newValue
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
                        steps: face.steps?.filter((step) => step.id !== stepId)
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
                        steps: face.steps?.map((step) =>
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
    const selectedDot = dots.find(dot => dot.id === selectedDotId);
    console.log('selectedDot', selectedDot);
    const selectedVector = vectors.find(vector => vector.id === selectedVectorId);
    console.log('selectedVector', selectedVector);
    const selectedLine = lines.find(line => line.id === selectedLineId);
    console.log('selectedLine', selectedLine);

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

    const changeUUID = () => {
        setFaces(prev => prev.map((face, index) => ({
            ...face,
            id: crypto.randomUUID(),
            name: `Face ${index + 1}`,
            color: face.color == '#68FCFF33' ? '#68FCFFFF' : '#184BB4FF'
        })));
    };

    return (
        <>
            <SceneController
                sceneStyle={sceneStyle}
                setSceneStyle={setSceneStyle}
                showCoordinateAxes={showCoordinateAxes}
                handleShowCoordinateAxes={handleShowCoordinateAxes}
            />

            <div className={`face-controller-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'face' ? (selectedFace ? 'size_1_2' : 'size_1_1') : (selectedFace ? 'size_1_4' : 'size_1_3')}`}>
                <div className='heading'>
                    <h2>Face  Ctrler</h2>
                    <div className='control'>
                        <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                        <CopyPasteButton data={faces} setData={setFaces} />
                        <button className='btn' onClick={addFace}><i className='fa-solid fa-plus' /></button>
                        <button className='btn btn-remove' onClick={() => setFaces([])}><i className='fa-solid fa-trash-can' /></button>
                        <ButtonList
                            icon={'arrow-right-arrow-left'}
                            onToggle={swapController}
                        />
                    </div>
                    {/* <button className='btn' onClick={changeUUID}><i className='fa-solid fa-file' /></button> */}
                    {/* <Link to='/' state={'5fa8b8df-595a-4f13-b808-7f58b404dd87'}><button className='btn'>/</button></Link> */}
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

                            {openedFaceId.includes(face.id) &&
                                <>
                                    <form>
                                        {face.steps?.map((step) => (
                                            <div key={step.id} className={`row ${step.visible == 0 ? 'invisible' : ''}`}>
                                                <select
                                                    value={step.type}
                                                    onChange={(e) => updateStep(face.id, step.id, e.target.value, step.value, step.visible)}
                                                    className='select'
                                                >
                                                    <option value='translateX' className='option'>Translate X</option>
                                                    <option value='translateY' className='option'>Translate Y</option>
                                                    <option value='translateZ' className='option'>Translate Z</option>
                                                    <option value='rotateX' className='option'>Rotate X</option>
                                                    <option value='rotateY' className='option'>Rotate Y</option>
                                                    <option value='rotateZ' className='option'>Rotate Z</option>
                                                    <option value='scale' className='option'>Scale</option>
                                                </select>

                                                <input
                                                    type='number'
                                                    value={step.value}
                                                    onChange={(e) => updateStep(face.id, step.id, step.type, e.target.value, step.visible)}
                                                    className={`input ${step.type}`}
                                                />

                                                <div className='btns'>
                                                    <button type='button' className={`btn-step ${step.visible == 1 ? 'visible-step' : ''}`} onClick={() => updateStep(face.id, step.id, step.type, step.value, step.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                                    <button type='button' className='btn-step remove-step' onClick={() => removeStep(face.id, step.id)}><i className='fa-solid fa-ban' /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </form>
                                    <button className='btn btn-add' onClick={() => addStep(face.id, 'translateX')}>ADD STEP</button>
                                </>
                            }
                        </div>
                    ))}
                </div>
            </div>

            <DotControllerPanel
                setFaces={setFaces}
                selectedFace={selectedFace}
                dots={dots}
                setDots={setDots}
                selectedDotId={selectedDotId}
                setSelectedDotId={setSelectedDotId}
                selectedDot={selectedDot}
                toggleMenu={toggleMenu}
                toggleStepFunction={toggleStepFunction}
                collapseController={collapseController}
                swapController={swapController}
                hexRgbaToPercent={hexRgbaToPercent}
            />

            <VectorControllerPanel
                dots={dots}
                setFaces={setFaces}
                selectedFace={selectedFace}
                vectors={vectors}
                setVectors={setVectors}
                selectedVectorId={selectedVectorId}
                setSelectedVectorId={setSelectedVectorId}
                selectedVector={selectedVector}
                toggleMenu={toggleMenu}
                toggleStepFunction={toggleStepFunction}
                collapseController={collapseController}
                swapController={swapController}
                hexRgbaToPercent={hexRgbaToPercent}
            />

            <LineControllerPanel
                dots={dots}
                setFaces={setFaces}
                selectedFace={selectedFace}
                vectors={vectors}
                setVectors={setVectors}
                selectedVectorId={selectedVectorId}
                setSelectedVectorId={setSelectedVectorId}
                selectedVector={selectedVector}
                toggleMenu={toggleMenu}
                toggleStepFunction={toggleStepFunction}
                collapseController={collapseController}
                swapController={swapController}
                hexRgbaToPercent={hexRgbaToPercent}
                lines={lines}
                setLines={setLines}
                selectedLineId={selectedLineId}
                setSelectedLineId={setSelectedLineId}
            />

            <FunctionControllerPanel
                faces={faces}
                setFaces={setFaces}
                selectedFace={selectedFace}
                selectedFaceId={selectedFaceId}
                toggleSelectFace={toggleSelectFace}
                toggleOpenFace={toggleOpenFace}
                openedFaceId={openedFaceId}
                addFace={addFace}
                removeFace={removeFace}
                updateFace={updateFace}
                vectors={vectors}
                dots={dots}
                setDots={setDots}
                setLines={setLines}
                toggleMenu={toggleMenu}
                toggleStepFunction={toggleStepFunction}
                collapseController={collapseController}
                swapController={swapController}
                hexRgbaToPercent={hexRgbaToPercent}
                handleShowCoordinateAxes={handleShowCoordinateAxes}
                showCoordinateAxes={showCoordinateAxes}
            />

            <div className={`sub-face-controller-container face-dot-vector-function-controller-container card ${selectedFace ? 'size_2_1' : 'size_2_2'}`}>
                <div className='heading'>
                    <h2>Face Detail</h2>
                    <button className='btn-close' onClick={() => setSelectedFaceId(null)}><i className='fa-regular fa-circle-xmark' /></button>
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
                    <div className={`form-group form-name ${selectedFace?.nameVisible == 0 ? 'invisible' : ''}`}>
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
                        <button type='button' className={`btn-name ${selectedFace?.nameVisible == 1 ? 'visible-name' : ''}`} onClick={() => updateFace(selectedFace?.id, 'nameVisible', selectedFace?.nameVisible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                    </div>
                    <div className={`form-group form-border ${selectedFace?.borderVisible == 0 ? 'invisible' : ''}`}>
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
                        <button type='button' className={`btn-border ${selectedFace?.borderVisible == 1 ? 'visible-border' : ''}`} onClick={() => updateFace(selectedFace?.id, 'borderVisible', selectedFace?.borderVisible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                    </div>
                    <div className={`form-group form-glow ${selectedFace?.glowVisible == 0 ? 'invisible' : ''}`}>
                        <div className='input-group'>
                            <input
                                type='number'
                                placeholder=''
                                value={selectedFace?.glow || 0}
                                onChange={(e) => updateFace(selectedFace?.id, 'glow', e.target.value)}
                                className='input'
                            />
                            <label htmlFor='glow'>Glow</label>
                        </div>
                        <button type='button' className={`btn-glow ${selectedFace?.glowVisible == 1 ? 'visible-glow' : ''}`} onClick={() => updateFace(selectedFace?.id, 'glowVisible', selectedFace?.glowVisible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                    </div>
                    <div className='form-group form-shape'>
                        <div className='input-group'>
                            <textarea
                                type='textarea'
                                placeholder=''
                                value={selectedFace?.shape || ''}
                                onChange={(e) => updateFace(selectedFace?.id, 'shape', e.target.value)}
                                className='input'
                                rows='5'
                                cols='4'
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                            />
                            <label htmlFor='shape'>Shape</label>
                        </div>
                        <button type='button' className='btn' onClick={() => setOpenEditShape(true)}>Edit Shape</button>
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

            {openEditShape && <ClickPercentBox selectedFaceId={selectedFaceId} shape={selectedFace?.shape} setOpenEditShape={setOpenEditShape} updateFace={updateFace} width={selectedFace?.width} height={selectedFace?.height} />}
        </>
    )
}
