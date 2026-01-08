import { useState } from 'react';
import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
import CopyPasteButton from '../../../components/CopyPasteButton/CopyPasteButton.jsx';
import './KeyframesControllerPanel.css';

export default function KeyframesControllerPanel({
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
    openedFaceId,
    lines,
    setLines,
    selectedLineId,
    setSelectedLineId,
    selectedFace,
    selectedDot,
    toggleMenu,
    toggleStepFunction,
    collapseController,
    swapController,
    hexRgbaToPercent
}) {
    const addKeyframes = () => {
        // const newId = crypto.randomUUID();
        // setDots((prev) => [
        //     {
        //         id: newId,
        //         size: 4,
        //         xCoordinate: 0,
        //         yCoordinate: 0,
        //         zCoordinate: 0,
        //         name: orderToAlphaDot(prev.length + 1),
        //         nameSize: 12,
        //         xCoordinateName: 0,
        //         yCoordinateName: 0,
        //         color: '#68FCFF',
        //         nameColor: '#80FCFF',
        //         visible: 1,
        //         nameVisible: 1,
        //         vectorVisible: 1,
        //         vectorNameVisible: 1,
        //     },
        //     ...prev,
        // ]);
    };

    const transformMap = {
        translateX: v => `translateX(${v})`,
        translateY: v => `translateY(${v})`,
        translateZ: v => `translateZ(${v})`,
        scale: v => `scale(${v})`,
        rotate: v => `rotate(${v})`,
    };

    const actionsToKeyframes = (name, actions) => {
        const frames = actions
            .sort((a, b) => a.timeline - b.timeline)
            .map(action => {
                const transforms = [];
                const styles = [];

                action.steps.forEach(step => {
                    if (!step.visible) return;

                    if (transformMap[step.type]) {
                        transforms.push(transformMap[step.type](step.value));
                    } else {
                        styles.push(`${step.type}: ${step.value};`);
                    }
                });

                if (transforms.length) {
                    styles.unshift(`transform: ${transforms.join(' ')};`);
                }

                return `
                    ${action.timeline}% {
                        ${styles.join('\n')}
                    }
                `;
            })
            .join('\n');

        return `
            @keyframes ${name} {
                ${frames}
            }
        `;
    };

    const applyKeyframes = (css) => {
        let styleEl = document.getElementById('dynamic-keyframes');

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'dynamic-keyframes';
            document.head.appendChild(styleEl);
        }

        styleEl.innerHTML = css;
    };

    const { animation } = face;

    const keyframesCSS = actionsToKeyframes(
        animation.name,
        animation.actions
    );

    applyKeyframes(keyframesCSS);

    return (
        <div className={`dot-controller-panel-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'keyframes' ? (selectedFace ? 'size_1_2' : 'size_1_1') : (selectedFace ? 'size_1_4' : 'size_1_3')}`}>
            <div className='heading'>
                <h2>KF Ctrler</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <CopyPasteButton data={dots} setData={setDots} />
                    <button className='btn' onClick={addKeyframes}><i className='fa-solid fa-plus' /></button>
                    <button className='btn btn-remove' onClick={() => setDots([])}><i className='fa-solid fa-trash-can' /></button>
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
                                    <button className='btn-click' onClick={() => copyFace(face.id)}><i className='fa-solid fa-copy' /></button>
                                    <button className='btn-click remove-click' onClick={() => removeFace(face.id)}><i className='fa-solid fa-trash-can' /></button>
                                </div>
                            </div>
                        </div>

                        {openedFaceId.includes(face.id) &&
                            <>
                                <form className='steps'>
                                    {face.steps?.map((step, index) => (
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
                                                type='number' value={step.value}
                                                onChange={(e) => updateStep(face.id, step.id, step.type, e.target.value, step.visible)}
                                                className={`input ${step.type}`}
                                            />

                                            <div className='btns'>
                                                <button type='button' className={`btn-step ${step.visible == 1 ? 'visible-step' : ''}`} onClick={() => updateStep(face.id, step.id, step.type, step.value, step.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                                <button type='button' className='btn-step' onClick={() => addStep(face.id, 'translateX', index)}><i className='fa-solid fa-plus' /></button>
                                                <button type='button' className='btn-step remove-step' onClick={() => removeStep(face.id, step.id)}><i className='fa-solid fa-ban' /></button>
                                            </div>
                                        </div>
                                    ))}
                                </form>
                                <button className='btn btn-add' onClick={() => addStep(face.id, 'translateX', face.steps?.length - 1)}>ADD STEP</button>
                            </>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}
