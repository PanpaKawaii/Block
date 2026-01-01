import { useEffect, useRef, useState } from 'react';
import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
import './LineControllerPanel.css';

export default function LineControllerPanel({
    dots,
    setFaces,
    selectedFace,
    vectors,
    setVectors,
    selectedVectorId,
    setSelectedVectorId,
    selectedVector,
    toggleMenu,
    toggleStepFunction,
    collapseController,
    swapController,
    hexRgbaToPercent,
    lines,
    setLines,
    selectedLineId,
    setSelectedLineId
}) {
    const [openedLineId, setOpenedLineId] = useState([]);
    const toggleOpenLine = (lineId) => {
        setOpenedLineId(prev => {
            if (prev.includes(lineId)) {
                return prev.filter(id => id != lineId);
            } else {
                return [...prev, lineId];
            }
        });
    };

    const toggleSelectLine = (lineId) => {
        setSelectedLineId(prev => {
            if (prev && prev == lineId) {
                return null;
            } else {
                return lineId;
            }
        });
    };

    const addLine = () => {
        const newId = crypto.randomUUID();
        setLines((prev) => [
            ...prev,
            {
                id: newId,
                parameterA: 0,
                parameterB: 0,
                parameterC: 0,
                pointX0: 0,
                pointY0: 0,
                pointZ0: 0,
                name: `Line ${prev.length + 1}`,
                nameSize: 12,
                xCoordinateName: 0,
                yCoordinateName: 0,
                color: '#68FCFF',
                nameColor: '#80FCFF',
                visible: 1,
                nameVisible: 1,
            }
        ]);
    };

    const removeLine = (lineId) => {
        setLines((prev) => prev.filter((line) => line.id !== lineId));
    };

    const updateLine = (lineId, attribute, newValue) => {
        setLines((prev) =>
            prev.map((line) =>
                line.id === lineId
                    ? {
                        ...line,
                        [attribute]: (
                            attribute == 'nameSize'
                            || attribute == 'visible'
                            || attribute == 'nameVisible'
                        ) ? Math.max(0, Number(newValue)) : (
                            attribute == 'parameterA'
                            || attribute == 'parameterB'
                            || attribute == 'parameterC'
                            || attribute == 'xCoordinateName'
                            || attribute == 'yCoordinateName'
                            || attribute == 'pointX0'
                            || attribute == 'pointY0'
                            || attribute == 'pointZ0'
                        ) ? Number(newValue) : newValue
                    }
                    : line
            )
        );
    };

    const updateLineParameter = (lineId, A, B, C, X0, Y0, Z0) => {
        setLines((prev) =>
            prev.map((line) =>
                line.id === lineId
                    ? {
                        ...line,
                        parameterA: A,
                        parameterB: B,
                        parameterC: C,
                        pointX0: X0,
                        pointY0: Y0,
                        pointZ0: Z0,
                    }
                    : line
            )
        );
    };

    return (
        <div className={`line-controller-panel-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'line' ? (selectedFace ? 'size_1_2' : 'size_1_1') : (selectedFace ? 'size_1_4' : 'size_1_3')}`}>
            <div className='heading'>
                <h2>Line Controller</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <input
                        type='text'
                        value={JSON.stringify(lines, null, 0)}
                        onChange={(e) => setLines(JSON.parse(e.target.value))}
                        className='input json-output'
                    />
                    <button className='btn' onClick={addLine}><i className='fa-solid fa-plus' /></button>
                    <ButtonList
                        icon={'arrows-rotate'}
                        onToggle={swapController}
                    />
                </div>
            </div>

            <div className='list'>
                {lines.map((line) => (
                    <div key={line.id} className={`card ${line.visible == 0 ? 'invisible' : ''} ${line.id == selectedLineId ? 'dash-box' : ''}`}>
                        <div className='header'>
                            <input
                                type='color'
                                value={line.color?.slice(0, 7) || '#FFFFFF'}
                                onChange={(e) => updateLine(line.id, 'color', e.target.value?.toUpperCase())}
                                className='input color-input'
                                style={{ opacity: hexRgbaToPercent(line.color || '#FFFFFFFF') || 1 }}
                            />
                            <div className='input-group'>
                                <input
                                    type='text'
                                    placeholder=''
                                    value={line?.name || ''}
                                    onChange={(e) => updateLine(line?.id, 'name', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='Name'>Name</label>
                            </div>
                            <div className='btns'>
                                <button className={`btn-click ${selectedLineId == line.id ? 'selected' : ''}`} onClick={() => toggleSelectLine(line.id)}><i className='fa-solid fa-gear' /></button>
                                <button className={`btn-click ${openedLineId.includes(line.id) ? 'opened-select' : ''}`} onClick={() => toggleOpenLine(line.id)}><i className='fa-solid fa-hand' /></button>
                                <div className='collapse-hidden'>
                                    <button className={`btn-click ${line.visible == 1 ? 'visible-select' : ''}`} onClick={() => updateLine(line.id, 'visible', line.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                    <button className='btn-click remove-click' onClick={() => removeLine(line.id)}><i className='fa-solid fa-trash-can' /></button>
                                </div>
                            </div>
                        </div>

                        {openedLineId.includes(line.id) &&
                            <div className='parameters'>
                                <div className='row row-1'>
                                    <div className='input-group'>
                                        <input
                                            type='number'
                                            placeholder=''
                                            value={line?.parameterA || 0}
                                            onChange={(e) => updateLine(line?.id, 'parameterA', e.target.value)}
                                            className='input'
                                        />
                                        <label htmlFor='X'>X</label>
                                    </div>
                                    <div className='input-group'>
                                        <input
                                            type='number'
                                            placeholder=''
                                            value={line?.parameterB || 0}
                                            onChange={(e) => updateLine(line?.id, 'parameterB', e.target.value)}
                                            className='input'
                                        />
                                        <label htmlFor='Y'>Y</label>
                                    </div>
                                    <div className='input-group'>
                                        <input
                                            type='number'
                                            placeholder=''
                                            value={line?.parameterC || 0}
                                            onChange={(e) => updateLine(line?.id, 'parameterC', e.target.value)}
                                            className='input'
                                        />
                                        <label htmlFor='Z'>Z</label>
                                    </div>
                                    <select
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const selectDot = dots.find(dot => dot.id == value);
                                            const selectVector = vectors.find(vector => vector.id == value);
                                            const X = selectDot?.xCoordinate || selectVector?.xCoordinateB - selectVector?.xCoordinateA || 0;
                                            const Y = selectDot?.yCoordinate || selectVector?.yCoordinateB - selectVector?.yCoordinateA || 0;
                                            const Z = selectDot?.zCoordinate || selectVector?.zCoordinateB - selectVector?.zCoordinateA || 0;
                                            updateLineParameter(line?.id, X, Y, Z, line?.pointX0, line?.pointY0, line?.pointZ0);
                                        }}
                                        className='select'
                                    >
                                        <option value={''} className='option'>O</option>
                                        {dots.map((dot, index) => (
                                            <option key={index} value={dot.id} className='option'>{dot.name}</option>
                                        ))}
                                        {vectors.map((vector, index) => (
                                            <option key={index} value={vector.id} className='option'>{vector.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='row row-2'>
                                    <div className='input-group'>
                                        <input
                                            type='number'
                                            placeholder=''
                                            value={line?.pointX0 || 0}
                                            onChange={(e) => updateLine(line?.id, 'pointX0', e.target.value)}
                                            className='input'
                                        />
                                        <label htmlFor='X'>X</label>
                                    </div>
                                    <div className='input-group'>
                                        <input
                                            type='number'
                                            placeholder=''
                                            value={line?.pointY0 || 0}
                                            onChange={(e) => updateLine(line?.id, 'pointY0', e.target.value)}
                                            className='input'
                                        />
                                        <label htmlFor='Y'>Y</label>
                                    </div>
                                    <div className='input-group'>
                                        <input
                                            type='number'
                                            placeholder=''
                                            value={line?.pointZ0 || 0}
                                            onChange={(e) => updateLine(line?.id, 'pointZ0', e.target.value)}
                                            className='input'
                                        />
                                        <label htmlFor='Z'>Z</label>
                                    </div>
                                    <select
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const selectDot = dots.find(dot => dot.id == value);
                                            const X = selectDot?.xCoordinate || 0;
                                            const Y = selectDot?.yCoordinate || 0;
                                            const Z = selectDot?.zCoordinate || 0;
                                            updateLineParameter(line?.id, line?.parameterA, line?.parameterB, line?.parameterC, X, Y, Z);
                                        }}
                                        className='select'
                                    >
                                        <option value={''} className='option'>O</option>
                                        {dots.map((dot, index) => (
                                            <option key={index} value={dot.id} className='option'>{dot.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}
