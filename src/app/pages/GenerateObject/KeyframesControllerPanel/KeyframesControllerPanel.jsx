import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
import CopyPasteButton from '../../../components/CopyPasteButton/CopyPasteButton.jsx';
import MovingLabelInput from '../../../components/MovingLabelInput/MovingLabelInput.jsx';
import StyleLabelSelect from '../../../components/StyleLabelSelect/StyleLabelSelect.jsx';
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
    addFace,
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

    const orderToAlphaDot = (order) => {
        order -= 1;
        const letters = 26;
        const charCode = 65 + (order % letters);
        const suffix = Math.floor(order / letters);

        const newName = String.fromCharCode(charCode) + (suffix === 0 ? '' : suffix);
        if (dots.find(dot => dot.name == newName)) {
            return orderToAlphaDot(order + 2);
        } else return newName;
    };

    const addAnimation = (faceId) => {
        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        animation: {
                            id: crypto.randomUUID(),
                            name: crypto.randomUUID().split('-').join(''),
                            duration: 2,
                            timingFunction: 'ease-in-out',
                            delay: 0,
                            iterationCount: 'infinite',
                            direction: 'normal',
                            fillMode: 'forwards',
                            actions: [
                                {
                                    id: crypto.randomUUID(),
                                    timeline: 50,
                                    visible: 1,
                                    steps: [
                                        { id: crypto.randomUUID(), type: 'translateX', value: '0', visible: 1 },
                                        { id: crypto.randomUUID(), type: 'rotateY', value: '0', visible: 1 },
                                        { id: crypto.randomUUID(), type: 'scale', value: '0.6', visible: 1 },
                                        { id: crypto.randomUUID(), type: 'opacity', value: '1', visible: 1 },
                                    ]
                                },
                                {
                                    id: crypto.randomUUID(),
                                    timeline: 0,
                                    visible: 1,
                                    steps: [
                                        { id: crypto.randomUUID(), type: 'translateX', value: '0', visible: 1 },
                                        { id: crypto.randomUUID(), type: 'rotateY', value: '0', visible: 1 },
                                        { id: crypto.randomUUID(), type: 'scale', value: '0.5', visible: 1 },
                                        { id: crypto.randomUUID(), type: 'opacity', value: '1', visible: 1 },
                                    ]
                                },
                                {
                                    id: crypto.randomUUID(),
                                    timeline: 100,
                                    visible: 1,
                                    steps: [
                                        { id: crypto.randomUUID(), type: 'translateX', value: '200', visible: 1 },
                                        { id: crypto.randomUUID(), type: 'rotateY', value: '360', visible: 1 },
                                        { id: crypto.randomUUID(), type: 'scale', value: '1.5', visible: 1 },
                                        { id: crypto.randomUUID(), type: 'opacity', value: '0.2', visible: 1 },
                                    ]
                                }
                            ]
                        }
                    }
                    : face
            )
        );
    };

    const removeAnimationFromFace = (faceId) => {
        setFaces(prevFaces =>
            prevFaces.map(face => {
                if (face.id !== faceId) return face;
                const { animation, ...restFace } = face;
                return restFace;
            })
        );
    };

    const updateAnimation = (faceId, attribute, newValue) => {
        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        animation: {
                            ...face.animation,
                            [attribute]: (
                                attribute == 'duration'
                                || attribute == 'delay'
                            ) ? Math.max(0, Number(newValue)) : newValue
                        }
                    }
                    : face
            )
        );
    };

    const addStep = (faceId, actionId, stepIndex) => {
        setFaces(prevFaces =>
            prevFaces.map(face => {
                if (face.id !== faceId) return face;
                const newActions = face.animation.actions.map(action => {
                    if (action.id !== actionId) return action;
                    const newSteps = [...action.steps];
                    newSteps.splice(
                        stepIndex,
                        0,
                        {
                            id: crypto.randomUUID(),
                            type: 'translateX',
                            value: '0',
                            visible: 1,
                        },
                    );
                    return {
                        ...action,
                        steps: newSteps,
                    };
                });
                return {
                    ...face,
                    animation: {
                        ...face.animation,
                        actions: newActions,
                    },
                };
            })
        );
    };

    const removeStep = (faceId, actionId, stepId) => {
        setFaces(prevFaces =>
            prevFaces.map(face => {
                if (face.id !== faceId) return face;
                const newActions = face.animation.actions.map(action => {
                    if (action.id !== actionId) return action;
                    return {
                        ...action,
                        steps: action.steps?.filter((step) => step.id !== stepId),
                    };
                });
                return {
                    ...face,
                    animation: {
                        ...face.animation,
                        actions: newActions,
                    },
                };
            })
        );
    };

    const updateStep = (faceId, actionId, stepId, newType, newValue, newVisible) => {
        setFaces(prevFaces =>
            prevFaces.map(face => {
                if (face.id !== faceId) return face;
                const newActions = face.animation.actions.map(action => {
                    if (action.id !== actionId) return action;
                    return {
                        ...action,
                        steps: action.steps?.map((step) =>
                            step.id === stepId ? { ...step, type: newType, value: newValue, visible: newVisible } : step
                        ),
                    };
                });
                return {
                    ...face,
                    animation: {
                        ...face.animation,
                        actions: newActions,
                    },
                };
            })
        );
    };

    const SelectedAnimation = selectedFace?.animation;
    console.log('SelectedAnimation', SelectedAnimation);

    const ListTimingFunction = [
        { id: 'ease', name: 'Ease' },
        { id: 'linear', name: 'Linear' },
        { id: 'ease-in', name: 'Ease-in' },
        { id: 'ease-out', name: 'Ease-out' },
        { id: 'ease-in-out', name: 'Ease-in-out' },
    ];
    const ListIterationCount = [
        { id: 'infinite', name: 'Infinite' },
    ];
    const ListDirection = [
        { id: 'normal', name: 'Normal' },
        { id: 'reverse', name: 'Reverse' },
        { id: 'alternate', name: 'Alternate' },
        { id: 'alternate-reverse', name: 'Alternate-reverse' },
    ];
    const ListFillMode = [
        { id: 'forwards', name: 'Forwards' },
        { id: 'backwards', name: 'Backwards' },
        { id: 'both', name: 'Both' },
    ];

    return (
        <div className={`keyframes-controller-panel-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'keyframes' ? 'size_1_1' : 'size_1_3'}`}>
            <div className='heading'>
                <h2>KF Ctrler</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <CopyPasteButton data={dots} setData={setDots} />
                    <button className='btn' onClick={addFace}><i className='fa-solid fa-plus' /></button>
                    <button className='btn btn-remove' onClick={() => setFaces([])}><i className='fa-solid fa-trash-can' /></button>
                    <ButtonList
                        icon={'arrow-right-arrow-left'}
                        onToggle={swapController}
                    />
                </div>
            </div>

            <div className='heading-btn'>
                {selectedFace ?
                    <>
                        <button className='btn'
                            onClick={() => {
                                setSelectedFaceId('');
                            }}>
                            <i className='fa-solid fa-chevron-left' />
                        </button>

                        {!SelectedAnimation ?
                            <button className='btn' onClick={() => addAnimation(selectedFaceId)}><i className='fa-solid fa-plus' /></button>
                            :
                            <button className='btn'
                                onClick={() => {
                                    removeAnimationFromFace(selectedFaceId);
                                    setSelectedFaceId('');
                                }}>
                                <i className='fa-solid fa-trash-can' />
                            </button>
                        }
                    </>
                    :
                    <div className='grid-row'>
                        {faces.map((face) => (
                            <div key={face.id} className='grid-col'>
                                <button className='btn'
                                    onClick={() => {
                                        setSelectedFaceId(face.id);
                                    }}>
                                    {face.name}
                                </button>
                            </div>
                        ))}
                    </div>
                }
            </div>

            {SelectedAnimation &&
                <div className='selected-animation'>
                    <div className='animation-attribute'>
                        <MovingLabelInput
                            type={'text'}
                            value={SelectedAnimation?.name || ''}
                            onValueChange={(propE) => updateAnimation(selectedFace?.id, 'name', propE.value)}
                            extraClassName={''}
                            extraStyle={{}}
                            label={'Name'}
                            labelStyle={'left stay'}
                            disable={true}
                        />
                        <div className='row row-1'>
                            <MovingLabelInput
                                type={'number'}
                                value={SelectedAnimation?.duration || 0}
                                onValueChange={(propE) => updateAnimation(selectedFace?.id, 'duration', propE.value)}
                                extraClassName={''}
                                extraStyle={{}}
                                label={'Duration'}
                                labelStyle={'left stay'}
                            />
                            <MovingLabelInput
                                type={'number'}
                                value={SelectedAnimation?.delay || 0}
                                onValueChange={(propE) => updateAnimation(selectedFace?.id, 'delay', propE.value)}
                                extraClassName={''}
                                extraStyle={{}}
                                label={'Delay'}
                                labelStyle={'left stay'}
                            />
                        </div>
                        <div className='row row-2'>
                            <StyleLabelSelect
                                list={ListTimingFunction}
                                value={ListTimingFunction?.find(l => l.id == SelectedAnimation.timingFunction)?.id}
                                onValueChange={(propE) => updateAnimation(selectedFace?.id, 'timingFunction', propE.value)}
                                extraClassName={''}
                                extraStyle={{ flex: 1.5, opacity: true ? 1 : 0.4 }}
                                label={'Timing Function'}
                                labelStyle={'center'}
                            />
                            <StyleLabelSelect
                                list={ListIterationCount}
                                value={ListIterationCount?.find(l => l.id == SelectedAnimation.iterationCount)?.id}
                                onValueChange={(propE) => updateAnimation(selectedFace?.id, 'iterationCount', propE.value)}
                                extraClassName={''}
                                extraStyle={{ flex: 1.5, opacity: true ? 1 : 0.4 }}
                                label={'Iteration Count'}
                                labelStyle={'center'}
                                disable={true}
                            />
                            <StyleLabelSelect
                                list={ListDirection}
                                value={ListDirection?.find(l => l.id == SelectedAnimation.direction)?.id}
                                onValueChange={(propE) => updateAnimation(selectedFace?.id, 'direction', propE.value)}
                                extraClassName={''}
                                extraStyle={{ flex: 1.5, opacity: true ? 1 : 0.4 }}
                                label={'Direction'}
                                labelStyle={'center'}
                            />
                            <StyleLabelSelect
                                list={ListFillMode}
                                value={ListFillMode?.find(l => l.id == SelectedAnimation.fillMode)?.id}
                                onValueChange={(propE) => updateAnimation(selectedFace?.id, 'fillMode', propE.value)}
                                extraClassName={''}
                                extraStyle={{ flex: 1.5, opacity: true ? 1 : 0.4 }}
                                label={'Fill Mode'}
                                labelStyle={'center'}
                            />
                        </div>
                    </div>

                    <div className='list'>
                        {SelectedAnimation?.actions?.map((action, aIndex) => (
                            <div key={action.id} className='card'>
                                <input
                                    type='number' value={action.timeline}
                                    onChange={(e) => { }}
                                    className='input'
                                />
                                <form className='steps'>
                                    {action?.steps?.map((step, sIndex) => (
                                        <div key={step.id} className={`row ${step.visible == 0 ? 'invisible' : ''}`}>
                                            <select
                                                value={step.type}
                                                onChange={(e) => updateStep(selectedFaceId, action.id, step.id, e.target.value, step.value, step.visible)}
                                                className='select'
                                            >
                                                <option value='translateX' className='option'>Translate X</option>
                                                <option value='translateY' className='option'>Translate Y</option>
                                                <option value='translateZ' className='option'>Translate Z</option>
                                                <option value='rotateX' className='option'>Rotate X</option>
                                                <option value='rotateY' className='option'>Rotate Y</option>
                                                <option value='rotateZ' className='option'>Rotate Z</option>
                                                <option value='scale' className='option'>Scale</option>
                                                <option value='opacity' className='option'>Opacity</option>
                                            </select>

                                            <input
                                                type='number' value={step.value}
                                                onChange={(e) => updateStep(selectedFaceId, action.id, step.id, step.type, e.target.value, step.visible)}
                                                className={`input ${step.type}`}
                                            />
                                            <div className='btns'>
                                                <button type='button' className={`btn-step ${step.visible == 1 ? 'visible-step' : ''}`} onClick={() => updateStep(selectedFaceId, action.id, step.id, step.type, step.value, step.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                                <button type='button' className='btn-step' onClick={() => addStep(selectedFaceId, action.id, sIndex + 1)}><i className='fa-solid fa-plus' /></button>
                                                <button type='button' className='btn-step remove-step' onClick={() => removeStep(selectedFaceId, action.id, step.id)}><i className='fa-solid fa-ban' /></button>
                                            </div>
                                        </div>
                                    ))}
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}
