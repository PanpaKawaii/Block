import { useState } from 'react';
import ButtonList from '../../../components/ButtonList/ButtonList.jsx';
import './VectorControllerPanel.css';

export default function VectorControllerPanel({
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
    const toggleOpenVector = (faceId) => {
        setOpenedVectorId(prev => {
            if (prev.includes(faceId)) {
                return prev.filter(id => id != faceId);
            } else {
                return [...prev, faceId];
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
            ...prev,
            {
                id: newId,
                size: 4,
                xCoordinateA: 0,
                yCoordinateB: 0,
                zCoordinateC: 0,
                name: orderToAlphaVector(prev.length + 1),
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
                    : vector
            )
        );
    };

    const orderToAlphaVector = (order) => {
        order -= 1;
        const letters = 26;
        const charCode = 65 + (order % letters);
        const suffix = Math.floor(order / letters);

        const newName = String.fromCharCode(charCode) + (suffix === 0 ? '' : suffix);
        if (vectors.find(vector => vector.name == newName)) {
            return orderToAlphaVector(order + 2);
        } else return newName;
    };

    return (
        <div className={`vector-controller-panel-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'vector' ? (selectedFace ? 'size_1_2' : 'size_1_1') : (selectedFace ? 'size_1_4' : 'size_1_3')}`}>
            <div className='heading'>
                <h2>Vector Controller</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <input
                        type='text'
                        value={JSON.stringify(vectors, null, 0)}
                        onChange={(e) => setVectors(JSON.parse(e.target.value))}
                        className='input json-output'
                    />
                    <button className='btn' onClick={addVector}><i className='fa-solid fa-plus' /></button>
                    <ButtonList
                        icon={'arrows-rotate'}
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
                            <div className='input-group'>
                                <input
                                    type='text'
                                    placeholder=''
                                    value={vector?.name || ''}
                                    onChange={(e) => updateVector(vector?.id, 'name', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='Name'>Name</label>
                            </div>
                            <div className='input-group'>
                                <input
                                    type='number'
                                    placeholder=''
                                    value={vector?.xCoordinate || 0}
                                    onChange={(e) => updateVector(vector?.id, 'xCoordinate', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='X'>X</label>
                            </div>
                            <div className='input-group'>
                                <input
                                    type='number'
                                    placeholder=''
                                    value={vector?.yCoordinate || 0}
                                    onChange={(e) => updateVector(vector?.id, 'yCoordinate', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='Y'>Y</label>
                            </div>
                            <div className='input-group'>
                                <input
                                    type='number'
                                    placeholder=''
                                    value={vector?.zCoordinate || 0}
                                    onChange={(e) => updateVector(vector?.id, 'zCoordinate', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='Z'>Z</label>
                            </div>
                            <div className='btns'>
                                <button className={`btn-click ${selectedVectorId == vector.id ? 'selected' : ''}`} onClick={() => toggleSelectVector(vector.id)}><i className='fa-solid fa-gear' /></button>
                                <div className='collapse-hidden'>
                                    <button className={`btn-click ${vector.visible == 1 ? 'visible-select' : ''}`} onClick={() => updateVector(vector.id, 'visible', vector.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                    <button className={`btn-click ${vector.vectorVisible == 1 ? 'visible-select' : ''}`} onClick={() => updateVector(vector.id, 'vectorVisible', vector.vectorVisible == 1 ? 0 : 1)}><i className='fa-solid fa-arrow-up-right-from-square' /></button>
                                    <button className='btn-click remove-click' onClick={() => removeVector(vector.id)}><i className='fa-solid fa-trash-can' /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
