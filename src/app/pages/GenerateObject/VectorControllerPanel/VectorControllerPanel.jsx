import { useRef, useState } from 'react';
import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
import CopyPasteButton from '../../../components/CopyPasteButton/CopyPasteButton.jsx';
import MovingLabelInput from '../../../components/MovingLabelInput/MovingLabelInput.jsx';
import StyleLabelSelect from '../../../components/StyleLabelSelect/StyleLabelSelect.jsx';
import './VectorControllerPanel.css';

export default function VectorControllerPanel({
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
    hexRgbaToPercent
}) {
    const [openedVectorId, setOpenedVectorId] = useState([]);
    const toggleOpenVector = (vectorId) => {
        setOpenedVectorId(prev => {
            if (prev.includes(vectorId)) {
                return prev.filter(id => id != vectorId);
            } else {
                return [...prev, vectorId];
            }
        });
    };

    const toggleSelectVector = (vectorId) => {
        setSelectedVectorId(prev => {
            if (prev && prev == vectorId) {
                return null;
            } else {
                return vectorId;
            }
        });
    };

    const addVector = () => {
        const newId = crypto.randomUUID();
        setVectors((prev) => [
            {
                id: newId,
                xCoordinateA: 0,
                yCoordinateA: 0,
                zCoordinateA: 0,
                xCoordinateB: 0,
                yCoordinateB: 0,
                zCoordinateB: 0,
                name: 'O-O',
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

    const removeVector = (vectorId) => {
        setVectors((prev) => prev.filter((vector) => vector.id !== vectorId));
    };

    const updateVector = (vectorId, attribute, newValue) => {
        setVectors((prev) =>
            prev.map((vector) =>
                vector.id === vectorId
                    ? {
                        ...vector,
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
                    : vector
            )
        );
    };

    const updateVectorLocation = (vectorId, xA, yA, zA, xB, yB, zB, name, index) => {
        setVectors((prev) =>
            prev.map((vector) =>
                vector.id === vectorId
                    ? {
                        ...vector,
                        name: index == 1 ? name + '-' + vector.name?.split('-')?.[1] : vector.name?.split('-')?.[0] + '-' + name,
                        xCoordinateA: xA,
                        yCoordinateA: yA,
                        zCoordinateA: zA,
                        xCoordinateB: xB,
                        yCoordinateB: yB,
                        zCoordinateB: zB,
                    }
                    : vector
            )
        );
    };

    const selectRefVector1 = useRef(null);
    const selectRefVector2 = useRef(null);

    return (
        <div className={`vector-controller-panel-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'vector' ? (selectedFace ? 'size_1_2' : 'size_1_1') : (selectedFace ? 'size_1_4' : 'size_1_3')}`}>
            <div className='heading'>
                <h2>Vector  Ctrler</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <CopyPasteButton data={vectors} setData={setVectors} />
                    <button className='btn' onClick={addVector}><i className='fa-solid fa-plus' /></button>
                    <button className='btn btn-remove' onClick={() => setVectors([])}><i className='fa-solid fa-trash-can' /></button>
                    <ButtonList
                        icon={'arrow-right-arrow-left'}
                        onToggle={swapController}
                    />
                </div>
            </div>

            <div className='list'>
                {vectors.map((vector) => (
                    <div key={vector.id} className={`card ${vector.visible == 0 ? 'invisible' : ''} ${vector.id == selectedVectorId ? 'dash-box' : ''}`}>
                        <div className='header'>
                            <input
                                type='color'
                                value={vector.color?.slice(0, 7) || '#FFFFFF'}
                                onChange={(e) => updateVector(vector.id, 'color', e.target.value?.toUpperCase())}
                                className='input color-input'
                                style={{ opacity: hexRgbaToPercent(vector.color || '#FFFFFFFF') || 1 }}
                            />
                            <MovingLabelInput
                                type={'text'}
                                value={vector?.name || ''}
                                onValueChange={(propE) => updateVector(vector?.id, 'name', propE.value)}
                                extraClassName={''}
                                extraStyle={{}}
                                label={'Name'}
                                labelStyle={'left moving'}
                            />
                            <div className='btns'>
                                <button className={`btn-click ${selectedVectorId == vector.id ? 'selected' : ''}`} onClick={() => toggleSelectVector(vector.id)}><i className='fa-solid fa-gear' /></button>
                                <button className={`btn-click ${openedVectorId.includes(vector.id) ? 'opened-select' : ''}`} onClick={() => toggleOpenVector(vector.id)}><i className='fa-solid fa-hand' /></button>
                                <div className='collapse-hidden'>
                                    <button className={`btn-click ${vector.visible == 1 ? 'visible-select' : ''}`} onClick={() => updateVector(vector.id, 'visible', vector.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                    <button className='btn-click remove-click' onClick={() => removeVector(vector.id)}><i className='fa-solid fa-trash-can' /></button>
                                </div>
                            </div>
                        </div>

                        {openedVectorId.includes(vector.id) &&
                            <form>
                                <div className='row row-1'>
                                    <MovingLabelInput
                                        type={'number'}
                                        value={vector?.xCoordinateA || 0}
                                        onValueChange={(propE) => {
                                            updateVector(vector?.id, 'xCoordinateA', propE.value);
                                            if (selectRefVector1.current) {
                                                selectRefVector1.current.value = '';
                                            }
                                        }}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'X1'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={vector?.yCoordinateA || 0}
                                        onValueChange={(propE) => {
                                            updateVector(vector?.id, 'yCoordinateA', propE.value);
                                            if (selectRefVector1.current) {
                                                selectRefVector1.current.value = '';
                                            }
                                        }}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Y1'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={vector?.zCoordinateA || 0}
                                        onValueChange={(propE) => {
                                            updateVector(vector?.id, 'zCoordinateA', propE.value);
                                            if (selectRefVector1.current) {
                                                selectRefVector1.current.value = '';
                                            }
                                        }}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Z1'}
                                        labelStyle={'center stay'}
                                    />
                                    <StyleLabelSelect
                                        reference={selectRefVector1}
                                        list={dots}
                                        value={vector}
                                        onValueChange={(propE) => {
                                            const value = propE.value;
                                            const selectDot = dots.find(dot => dot.id == value);
                                            const X = selectDot?.xCoordinate || 0;
                                            const Y = selectDot?.yCoordinate || 0;
                                            const Z = selectDot?.zCoordinate || 0;
                                            const name = selectDot?.name || 'O';
                                            updateVectorLocation(vector?.id, X, Y, Z, vector?.xCoordinateB, vector?.yCoordinateB, vector?.zCoordinateB, name, 1);
                                        }}
                                        extraClassName={''}
                                        extraStyle={{ flex: 1.5, opacity: selectRefVector1.current?.value ? 1 : 0.4 }}
                                        label={'Point 1'}
                                        labelStyle={'center'}
                                    />
                                </div>
                                <div className='row row-2'>
                                    <MovingLabelInput
                                        type={'number'}
                                        value={vector?.xCoordinateB || 0}
                                        onValueChange={(propE) => {
                                            updateVector(vector?.id, 'xCoordinateB', propE.value);
                                            if (selectRefVector2.current) {
                                                selectRefVector2.current.value = '';
                                            }
                                        }}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'X2'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={vector?.yCoordinateB || 0}
                                        onValueChange={(propE) => {
                                            updateVector(vector?.id, 'yCoordinateB', propE.value);
                                            if (selectRefVector2.current) {
                                                selectRefVector2.current.value = '';
                                            }
                                        }}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Y2'}
                                        labelStyle={'center stay'}
                                    />
                                    <MovingLabelInput
                                        type={'number'}
                                        value={vector?.zCoordinateB || 0}
                                        onValueChange={(propE) => {
                                            updateVector(vector?.id, 'zCoordinateB', propE.value);
                                            if (selectRefVector2.current) {
                                                selectRefVector2.current.value = '';
                                            }
                                        }}
                                        extraClassName={''}
                                        extraStyle={{}}
                                        label={'Z2'}
                                        labelStyle={'center stay'}
                                    />
                                    <StyleLabelSelect
                                        reference={selectRefVector2}
                                        list={dots}
                                        value={vector}
                                        onValueChange={(propE) => {
                                            const value = propE.value;
                                            const selectDot = dots.find(dot => dot.id == value);
                                            const X = selectDot?.xCoordinate || 0;
                                            const Y = selectDot?.yCoordinate || 0;
                                            const Z = selectDot?.zCoordinate || 0;
                                            const name = selectDot?.name || 'O';
                                            updateVectorLocation(vector?.id, vector?.xCoordinateA, vector?.yCoordinateA, vector?.zCoordinateA, X, Y, Z, name, 2);
                                        }}
                                        extraClassName={''}
                                        extraStyle={{ flex: 1.5, opacity: selectRefVector2.current?.value ? 1 : 0.4 }}
                                        label={'Point 2'}
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
