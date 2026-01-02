import { useState, useMemo } from 'react';
import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
import './LineControllerPanel.css';
import MovingLabelInput from '../../../components/MovingLabelInput/MovingLabelInput.jsx';
import StyleLabelSelect from '../../../components/MovingLabelSelect/StyleLabelSelect.jsx';

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

    const mergedCoordinates = useMemo(() => {
        return [
            ...dots.map(dot => ({
                id: dot.id,
                type: 'dot',
                name: dot.name,
                xCoordinate: dot.xCoordinate,
                yCoordinate: dot.yCoordinate,
                zCoordinate: dot.zCoordinate,
            })),
            ...vectors.map(vector => ({
                id: vector.id,
                type: 'vector',
                name: vector.name,
                xCoordinate: vector.xCoordinateB - vector.xCoordinateA,
                yCoordinate: vector.yCoordinateB - vector.yCoordinateA,
                zCoordinate: vector.zCoordinateB - vector.zCoordinateA,
            }))
        ];
    }, [dots, vectors]);

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
                            {/* <div className='input-group'>
                                <input
                                    type='text'
                                    placeholder=''
                                    value={line?.name || ''}
                                    onChange={(e) => updateLine(line?.id, 'name', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='Name'>Name</label>
                            </div> */}
                            <MovingLabelInput
                                type={'text'}
                                value={line?.name}
                                onValueChange={(propE) => updateLine(line?.id, 'name', propE.value)}
                                extraClassName={''}
                                extraStyle={{}}
                                label={'Name'}
                                labelStyle={'left moving'}
                            />
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
                                {/* <div className='row'>
                                    <MovingLabelInput
                                        onValueChange={(propE) => { }}
                                        label={'L S'}
                                        labelStyle={'left stay'}
                                    />
                                    <MovingLabelInput
                                        onValueChange={(propE) => { }}
                                        label={'C S'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        onValueChange={(propE) => { }}
                                        label={'R S'}
                                        labelStyle={'right stay'}
                                    />
                                </div>
                                <div className='row'>
                                    <MovingLabelInput
                                        onValueChange={(propE) => { }}
                                        label={'L M'}
                                        labelStyle={'left moving'}
                                    />
                                    <MovingLabelInput
                                        onValueChange={(propE) => { }}
                                        label={'C M'}
                                        labelStyle={'center moving'}
                                    />
                                    <MovingLabelInput
                                        onValueChange={(propE) => { }}
                                        label={'R M'}
                                        labelStyle={'right moving'}
                                    />
                                </div> */}
                                <div className='row row-1'>
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.parameterA}
                                        onValueChange={(propE) => updateLine(line?.id, 'parameterA', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'ParamA'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.parameterB}
                                        onValueChange={(propE) => updateLine(line?.id, 'parameterB', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'ParamB'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.parameterC}
                                        onValueChange={(propE) => updateLine(line?.id, 'parameterC', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'ParamC'}
                                        labelStyle={'center stay'}
                                    />
                                    <StyleLabelSelect
                                        list={mergedCoordinates}
                                        onValueChange={(propE) => updateLineParameter(line?.id, propE.X, propE.Y, propE.Z, line?.pointX0, line?.pointY0, line?.pointZ0)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Vector'}
                                        labelStyle={'center'}
                                    />
                                </div>
                                <div className='row row-2'>
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.pointX0}
                                        onValueChange={(propE) => updateLine(line?.id, 'pointX0', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Point X0'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.pointY0}
                                        onValueChange={(propE) => updateLine(line?.id, 'pointY0', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Point Y0'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.pointZ0}
                                        onValueChange={(propE) => updateLine(line?.id, 'pointZ0', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Point Z0'}
                                        labelStyle={'center stay'}
                                    />
                                    <StyleLabelSelect
                                        list={dots}
                                        onValueChange={(propE) => updateLineParameter(line?.id, line?.parameterA, line?.parameterB, line?.parameterC, propE.X, propE.Y, propE.Z)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Point'}
                                        labelStyle={'center'}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}
