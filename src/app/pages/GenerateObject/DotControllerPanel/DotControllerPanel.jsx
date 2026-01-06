import { useState } from 'react';
import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
import CopyPasteButton from '../../../components/CopyPasteButton/CopyPasteButton.jsx';
import MovingLabelInput from '../../../components/MovingLabelInput/MovingLabelInput.jsx';
import './DotControllerPanel.css';

export default function DotControllerPanel({
    setFaces,
    selectedFace,
    dots,
    setDots,
    selectedDotId,
    setSelectedDotId,
    selectedDot,
    toggleMenu,
    toggleStepFunction,
    collapseController,
    swapController,
    hexRgbaToPercent
}) {
    const [openedDotId, setOpenedDotId] = useState([]);
    const toggleOpenDot = (dotId) => {
        setOpenedDotId(prev => {
            if (prev.includes(dotId)) {
                return prev.filter(id => id != dotId);
            } else {
                return [...prev, dotId];
            }
        });
    };

    const toggleSelectDot = (dotId) => {
        setSelectedDotId(prev => {
            if (prev && prev == dotId) {
                return null;
            } else {
                return dotId;
            }
        });
    };

    const addDot = () => {
        const newId = crypto.randomUUID();
        setDots((prev) => [
            {
                id: newId,
                size: 4,
                xCoordinate: 0,
                yCoordinate: 0,
                zCoordinate: 0,
                name: orderToAlphaDot(prev.length + 1),
                nameSize: 12,
                xCoordinateName: 0,
                yCoordinateName: 0,
                color: '#68FCFF',
                nameColor: '#80FCFF',
                visible: 1,
                nameVisible: 1,
                vectorVisible: 1,
                vectorNameVisible: 1,
            },
            ...prev,
        ]);
    };

    const removeDot = (dotId) => {
        setDots((prev) => prev.filter((dot) => dot.id !== dotId));
    };

    const updateDot = (dotId, attribute, newValue) => {
        setDots((prev) =>
            prev.map((dot) =>
                dot.id === dotId
                    ? {
                        ...dot,
                        [attribute]: (
                            attribute == 'size'
                            || attribute == 'nameSize'
                            || attribute == 'visible'
                            || attribute == 'nameVisible'
                            || attribute == 'vectorVisible'
                            || attribute == 'vectorNameVisible'
                        ) ? Math.max(0, Number(newValue)) : (
                            attribute == 'xCoordinate'
                            || attribute == 'yCoordinate'
                            || attribute == 'zCoordinate'
                            || attribute == 'xCoordinateName'
                            || attribute == 'yCoordinateName'
                        ) ? Number(newValue) : newValue
                    }
                    : dot
            )
        );
    };

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

    return (
        <div className={`dot-controller-panel-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'dot' ? (selectedFace ? 'size_1_2' : 'size_1_1') : (selectedFace ? 'size_1_4' : 'size_1_3')}`}>
            <div className='heading'>
                <h2>Dot  Ctrler</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <CopyPasteButton data={dots} setData={setDots} />
                    <button className='btn' onClick={addDot}><i className='fa-solid fa-plus' /></button>
                    <button className='btn btn-remove' onClick={() => setDots([])}><i className='fa-solid fa-trash-can' /></button>
                    <ButtonList
                        icon={'arrow-right-arrow-left'}
                        onToggle={swapController}
                    />
                </div>
            </div>

            <div className='list'>
                {dots.map((dot) => (
                    <div key={dot.id} className={`card ${dot.visible == 0 ? 'invisible' : ''} ${dot.id == selectedDotId ? 'dash-box' : ''}`}>
                        <div className='header'>
                            <input
                                type='color'
                                value={dot.color?.slice(0, 7) || '#FFFFFF'}
                                onChange={(e) => updateDot(dot.id, 'color', e.target.value?.toUpperCase())}
                                className='input color-input'
                                style={{ opacity: hexRgbaToPercent(dot.color || '#FFFFFFFF') || 1 }}
                            />
                            <div className={`name-group ${(openedDotId.includes(dot.id) || toggleMenu) ? 'expanse' : ''}`}>
                                <MovingLabelInput
                                    type={'text'}
                                    value={dot?.name}
                                    onValueChange={(propE) => updateDot(dot?.id, 'name', propE.value)}
                                    extraClassName={''}
                                    extraStyle={{}}
                                    label={'Name'}
                                    labelStyle={'left moving'}
                                />
                                {!openedDotId.includes(dot.id) && <div className='tag'>({dot.xCoordinate}, {dot.yCoordinate}, {dot.zCoordinate})</div>}
                            </div>
                            <div className='btns'>
                                <button className={`btn-click ${selectedDotId == dot.id ? 'selected' : ''}`} onClick={() => toggleSelectDot(dot.id)}><i className='fa-solid fa-gear' /></button>
                                <button className={`btn-click ${openedDotId.includes(dot.id) ? 'opened-select' : ''}`} onClick={() => toggleOpenDot(dot.id)}><i className='fa-solid fa-hand' /></button>
                                <div className='collapse-hidden'>
                                    <button className={`btn-click ${dot.visible == 1 ? 'visible-select' : ''}`} onClick={() => updateDot(dot.id, 'visible', dot.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                    <button className={`btn-click ${dot.vectorVisible == 1 ? 'visible-select' : ''}`} onClick={() => updateDot(dot.id, 'vectorVisible', dot.vectorVisible == 1 ? 0 : 1)}><i className='fa-solid fa-arrow-up-right-from-square' /></button>
                                    <button className='btn-click remove-click' onClick={() => removeDot(dot.id)}><i className='fa-solid fa-trash-can' /></button>
                                </div>
                            </div>
                        </div>

                        {openedDotId.includes(dot.id) &&
                            <form>
                                <div className='row'>
                                    <MovingLabelInput
                                        type={'number'}
                                        value={dot?.xCoordinate}
                                        onValueChange={(propE) => updateDot(dot?.id, 'xCoordinate', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'X'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={dot?.yCoordinate}
                                        onValueChange={(propE) => updateDot(dot?.id, 'yCoordinate', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Y'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={dot?.zCoordinate}
                                        onValueChange={(propE) => updateDot(dot?.id, 'zCoordinate', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Z'}
                                        labelStyle={'center stay'}
                                    />
                                </div>
                            </form>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}
