import { useState } from 'react';
import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
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
            ...prev,
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
            }
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
                        ) ? Math.max(0, Number(newValue)) : (
                            attribute == 'xCoordinate'
                            || attribute == 'yCoordinate'
                            || attribute == 'zCoordinate'
                            || attribute == 'yCoordinateName'
                            || attribute == 'zCoordinateName'
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
                <h2>Dot Controller</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <input
                        type='text'
                        value={JSON.stringify(dots, null, 0)}
                        onChange={(e) => setDots(JSON.parse(e.target.value))}
                        className='input json-output'
                    />
                    <button className='btn' onClick={addDot}><i className='fa-solid fa-plus' /></button>
                    <ButtonList
                        icon={'arrows-rotate'}
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
                            <div className={`input-group ${(openedDotId.includes(dot.id) || toggleMenu) ? 'expanse' : ''}`} title={`(${dot.xCoordinate}, ${dot.yCoordinate}, ${dot.zCoordinate})`}>
                                <input
                                    type='text'
                                    placeholder=''
                                    value={dot?.name || ''}
                                    onChange={(e) => updateDot(dot?.id, 'name', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='Name'>Name</label>
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
                            <div className='coordinates'>
                                <div className='input-group'>
                                    <input
                                        type='number'
                                        placeholder=''
                                        value={dot?.xCoordinate || 0}
                                        onChange={(e) => updateDot(dot?.id, 'xCoordinate', e.target.value)}
                                        className='input'
                                    />
                                    <label htmlFor='X'>X</label>
                                </div>
                                <div className='input-group'>
                                    <input
                                        type='number'
                                        placeholder=''
                                        value={dot?.yCoordinate || 0}
                                        onChange={(e) => updateDot(dot?.id, 'yCoordinate', e.target.value)}
                                        className='input'
                                    />
                                    <label htmlFor='Y'>Y</label>
                                </div>
                                <div className='input-group'>
                                    <input
                                        type='number'
                                        placeholder=''
                                        value={dot?.zCoordinate || 0}
                                        onChange={(e) => updateDot(dot?.id, 'zCoordinate', e.target.value)}
                                        className='input'
                                    />
                                    <label htmlFor='Z'>Z</label>
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}
