import './VectorControllerPanel.css';

export default function VectorControllerPanel({
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
                name: orderToAlpha(prev.length + 1),
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

    const orderToAlpha = (order) => {
        order -= 1;
        const letters = 26;
        const charCode = 65 + (order % letters);
        const suffix = Math.floor(order / letters);

        return String.fromCharCode(charCode) + (suffix === 0 ? "" : suffix);
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

    return (
        <div className={`vector-controller-panel-container face-dot-vector-function-controller-container card ${toggleMenu ? '' : 'collapsed'} ${toggleStepFunction == 'vector' ? (selectedFace ? 'size_1_2' : 'size_1_1') : (selectedFace ? 'size_1_4' : 'size_1_3')}`}>
            <div className='heading'>
                <h2>Vector Controller</h2>
                <div className='control'>
                    <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                    <input
                        type='text'
                        value={JSON.stringify(dots, null, 0)}
                        onChange={(e) => setDots(JSON.parse(e.target.value))}
                        className='input json-output'
                    />
                    <button className='btn' onClick={addDot}><i className='fa-solid fa-plus' /></button>
                    <button className='btn' onClick={swapController}><i className='fa-solid fa-arrows-rotate' /></button>
                </div>
            </div>

            <div className='list'>
                {dots.map((face) => (
                    <div key={face.id} className={`card ${face.visible == 0 ? 'invisible' : ''} ${face.id == selectedDotId ? 'dash-box' : ''}`}>
                        <div className='header'>
                            <input
                                type='color'
                                value={face.color?.slice(0, 7) || '#FFFFFF'}
                                onChange={(e) => updateDot(face.id, 'color', e.target.value?.toUpperCase())}
                                className='input color-input'
                                style={{ opacity: hexRgbaToPercent(face.color || '#FFFFFFFF') || 1 }}
                            />
                            <div className='input-group'>
                                <input
                                    type='text'
                                    placeholder=''
                                    value={face?.name || ''}
                                    onChange={(e) => updateDot(face?.id, 'name', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='Name'>Name</label>
                            </div>
                            <div className='input-group'>
                                <input
                                    type='number'
                                    placeholder=''
                                    value={face?.xCoordinate || 0}
                                    onChange={(e) => updateDot(face?.id, 'xCoordinate', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='X'>X</label>
                            </div>
                            <div className='input-group'>
                                <input
                                    type='number'
                                    placeholder=''
                                    value={face?.yCoordinate || 0}
                                    onChange={(e) => updateDot(face?.id, 'yCoordinate', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='Y'>Y</label>
                            </div>
                            <div className='input-group'>
                                <input
                                    type='number'
                                    placeholder=''
                                    value={face?.zCoordinate || 0}
                                    onChange={(e) => updateDot(face?.id, 'zCoordinate', e.target.value)}
                                    className='input'
                                />
                                <label htmlFor='Z'>Z</label>
                            </div>
                            <div className='btns'>
                                <button className={`btn-click ${selectedDotId == face.id ? 'selected' : ''}`} onClick={() => toggleSelectDot(face.id)}><i className='fa-solid fa-gear' /></button>
                                <div className='collapse-hidden'>
                                    <button className={`btn-click ${face.visible == 1 ? 'visible-select' : ''}`} onClick={() => updateDot(face.id, 'visible', face.visible == 1 ? 0 : 1)}><i className='fa-solid fa-eye' /></button>
                                    <button className='btn-click remove-click' onClick={() => removeDot(face.id)}><i className='fa-solid fa-trash-can' /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
