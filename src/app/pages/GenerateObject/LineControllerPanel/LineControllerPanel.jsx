import { useMemo, useState } from 'react';
import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
import CopyPasteButton from '../../../components/CopyPasteButton/CopyPasteButton.jsx';
import MovingLabelInput from '../../../components/MovingLabelInput/MovingLabelInput.jsx';
import StyleLabelSelect from '../../../components/StyleLabelSelect/StyleLabelSelect.jsx';
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
            {
                id: newId,
                xCoordinateA: 0,
                yCoordinateA: 0,
                zCoordinateA: 0,
                xCoordinateB: 0,
                yCoordinateB: 0,
                zCoordinateB: 0,
                name: `Line ${prev.length + 1}`,
                nameSize: 12,
                xCoordinateName: 0,
                yCoordinateName: 0,
                color: '#68FCFF',
                nameColor: '#80FCFF',
                visible: 1,
                nameVisible: 1,
            },
            ...prev,
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
                            attribute == 'xCoordinateA'
                            || attribute == 'yCoordinateA'
                            || attribute == 'zCoordinateA'
                            || attribute == 'xCoordinateB'
                            || attribute == 'yCoordinateB'
                            || attribute == 'zCoordinateB'
                            || attribute == 'xCoordinateName'
                            || attribute == 'yCoordinateName'
                        ) ? Number(newValue) : newValue
                    }
                    : line
            )
        );
    };

    const updateLineParameter = (lineId, xA, yA, zA, xB, yB, zB) => {
        setLines((prev) =>
            prev.map((line) =>
                line.id === lineId
                    ? {
                        ...line,
                        xCoordinateA: xA,
                        yCoordinateA: yA,
                        zCoordinateA: zA,
                        xCoordinateB: xB,
                        yCoordinateB: yB,
                        zCoordinateB: zB,
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
                <h2>Line  Ctrler</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <CopyPasteButton data={lines} setData={setLines} />
                    <button className='btn' onClick={addLine}><i className='fa-solid fa-plus' /></button>
                    <button className='btn btn-remove' onClick={() => setLines([])}><i className='fa-solid fa-trash-can' /></button>
                    <ButtonList
                        icon={'arrow-right-arrow-left'}
                        onToggle={swapController}
                    />
                </div>
            </div>

            <div className='list'>
                {lines.map((line, index) => (
                    <div key={line.id} className={`card ${line.visible == 0 ? 'invisible' : ''} ${line.id == selectedLineId ? 'dash-box' : ''}`}>
                        <div className='header'>
                            <input
                                type='color'
                                value={line.color?.slice(0, 7) || '#FFFFFF'}
                                onChange={(e) => updateLine(line.id, 'color', e.target.value?.toUpperCase())}
                                className='input color-input'
                                style={{ opacity: hexRgbaToPercent(line.color || '#FFFFFFFF') || 1 }}
                            />
                            <MovingLabelInput
                                type={'text'}
                                value={line?.name || ''}
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
                            <form>
                                <div className='row row-1'>
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.xCoordinateA || 0}
                                        onValueChange={(propE) => updateLine(line?.id, 'xCoordinateA', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'X1'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.yCoordinateA || 0}
                                        onValueChange={(propE) => updateLine(line?.id, 'yCoordinateA', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Y1'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.zCoordinateA || 0}
                                        onValueChange={(propE) => updateLine(line?.id, 'zCoordinateA', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Z1'}
                                        labelStyle={'center stay'}
                                    />
                                    <StyleLabelSelect
                                        id={`point-1-${index}`}
                                        list={dots}
                                        value={dots.find(d => d.xCoordinate == line.xCoordinateA && d.yCoordinate == line.yCoordinateA && d.zCoordinate == line.zCoordinateA)?.id}
                                        onValueChange={(propE) => {
                                            updateLineParameter(line?.id, propE.X, propE.Y, propE.Z, line?.xCoordinateB, line?.yCoordinateB, line?.zCoordinateB);
                                            const select = document.getElementById(`vector-${index}`);
                                            if (select) {
                                                select.value = '';
                                            }
                                        }}
                                        extraClassName={''}
                                        extraStyle={{ flex: 1.5, opacity: dots.find(d => d.xCoordinate == line.xCoordinateA && d.yCoordinate == line.yCoordinateA && d.zCoordinate == line.zCoordinateA) ? 1 : 0.4 }}
                                        label={'Point 1'}
                                        labelStyle={'center'}
                                    />
                                </div>
                                <div className='row row-2'>
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.xCoordinateB || 0}
                                        onValueChange={(propE) => updateLine(line?.id, 'xCoordinateB', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'X2'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.yCoordinateB || 0}
                                        onValueChange={(propE) => updateLine(line?.id, 'yCoordinateB', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Y2'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={line?.zCoordinateB || 0}
                                        onValueChange={(propE) => updateLine(line?.id, 'zCoordinateB', propE.value)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Z2'}
                                        labelStyle={'center stay'}
                                    />
                                    <StyleLabelSelect
                                        id={`point-2-${index}`}
                                        list={dots}
                                        value={dots.find(d => d.xCoordinate == line.xCoordinateB && d.yCoordinate == line.yCoordinateB && d.zCoordinate == line.zCoordinateB)?.id}
                                        onValueChange={(propE) => {
                                            updateLineParameter(line?.id, line?.xCoordinateA, line?.yCoordinateA, line?.zCoordinateA, propE.X, propE.Y, propE.Z);
                                            const select = document.getElementById(`vector-${index}`);
                                            if (select) {
                                                select.value = '';
                                            }
                                        }}
                                        extraClassName={''}
                                        extraStyle={{ flex: 1.5, opacity: dots.find(d => d.xCoordinate == line.xCoordinateB && d.yCoordinate == line.yCoordinateB && d.zCoordinate == line.zCoordinateB) ? 1 : 0.4 }}
                                        label={'Point 2'}
                                        labelStyle={'center'}
                                    />
                                </div>
                                <div className='row row-3'>
                                    <MovingLabelInput
                                        type={'number'}
                                        value={Number(line?.xCoordinateB) - Number(line?.xCoordinateA) || 0}
                                        onValueChange={(propE) => updateLine(line?.id, 'xCoordinateB', propE.value + line?.xCoordinateA)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Param A'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={Number(line?.yCoordinateB) - Number(line?.yCoordinateA) || 0}
                                        onValueChange={(propE) => updateLine(line?.id, 'yCoordinateB', propE.value + line?.yCoordinateA)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Param B'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={Number(line?.zCoordinateB) - Number(line?.zCoordinateA) || 0}
                                        onValueChange={(propE) => updateLine(line?.id, 'zCoordinateB', propE.value + line?.zCoordinateA)}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Param C'}
                                        labelStyle={'center stay'}
                                    />
                                    <StyleLabelSelect
                                        id={`vector-${index}`}
                                        list={mergedCoordinates}
                                        value={mergedCoordinates.find(m =>
                                            (m.xCoordinate == (line.xCoordinateB - line.xCoordinateA) && m.yCoordinate == (line.yCoordinateB - line.yCoordinateA) && m.zCoordinate == (line.zCoordinateB - line.zCoordinateA))
                                            || (m.xCoordinate == (line.xCoordinateA - line.xCoordinateB) && m.yCoordinate == (line.yCoordinateA - line.yCoordinateB) && m.zCoordinate == (line.zCoordinateA - line.zCoordinateB))
                                        )?.id}
                                        onValueChange={(propE) => {
                                            updateLineParameter(line?.id, line?.xCoordinateA, line?.yCoordinateA, line?.zCoordinateA, propE.X + line?.xCoordinateA, propE.Y + line?.yCoordinateA, propE.Z + line?.zCoordinateA);
                                            const select = document.getElementById(`point-2-${index}`);
                                            if (select) {
                                                select.value = '';
                                            }
                                        }}
                                        extraClassName={''}
                                        extraStyle={{
                                            flex: 1.5,
                                            opacity: mergedCoordinates.find(m =>
                                                (m.xCoordinate == (line.xCoordinateB - line.xCoordinateA) && m.yCoordinate == (line.yCoordinateB - line.yCoordinateA) && m.zCoordinate == (line.zCoordinateB - line.zCoordinateA))
                                                || (m.xCoordinate == (line.xCoordinateA - line.xCoordinateB) && m.yCoordinate == (line.yCoordinateA - line.yCoordinateB) && m.zCoordinate == (line.zCoordinateA - line.zCoordinateB))
                                            ) ? 1 : 0.4,
                                        }}
                                        label={'Vector'}
                                        labelStyle={'center'}
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
