import './FaceController.css';

export default function FaceController({ faces, setFaces , setSelectedFace }) {

    const addFace = () => {
        setFaces((prev) => [
            ...prev,
            { id: crypto.randomUUID(), name: `Face ${prev.length + 1}`, steps: [] }
        ]);
    };

    const removeFace = (faceId) => {
        setFaces((prev) => prev.filter((face) => face.id !== faceId));
    };

    const addStep = (faceId, type) => {
        const defaultValue =
            type.includes('translate') ? '0'
                : type.includes('rotate') ? '0'
                    : type.includes('scale') ? '1'
                        : '0% 0%, 100% 0, 100% 100%, 0% 100%';

        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        steps: [
                            ...face.steps,
                            { id: crypto.randomUUID(), type, value: defaultValue }
                        ]
                    }
                    : face
            )
        );
    };

    const removeStep = (faceId, stepId) => {
        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        steps: face.steps.filter((step) => step.id !== stepId)
                    }
                    : face
            )
        );
    };

    const updateStep = (faceId, stepId, newType, newValue) => {
        setFaces((prev) =>
            prev.map((face) =>
                face.id === faceId
                    ? {
                        ...face,
                        steps: face.steps.map((step) =>
                            step.id === stepId ? { ...step, type: newType, value: newValue } : step
                        )
                    }
                    : face
            )
        );
    };

    return (
        <div className='face-controller-container'>
            <h2>Face Controller Panel</h2>
            <button className='add-btn' onClick={addFace}>Add Face</button>

            <div className='faces-list'>
                {faces.map((face) => (
                    <div key={face.id} className='face-card'>
                        <div className='face-header'>
                            <h3>{face.name}</h3>
                            <button className='remove-face' onClick={() => removeFace(face.id)}>×</button>
                        </div>

                        <div className='steps'>
                            {face.steps.map((step) => (
                                <div key={step.id} className='step-row'>
                                    <select
                                        value={step.type}
                                        onChange={(e) => updateStep(face.id, step.id, e.target.value, step.value)}
                                    >
                                        <option value='translateX'>translateX</option>
                                        <option value='translateY'>translateY</option>
                                        <option value='translateZ'>translateZ</option>
                                        <option value='rotateX'>rotateX</option>
                                        <option value='rotateY'>rotateY</option>
                                        <option value='rotateZ'>rotateZ</option>
                                        <option value='scale'>scale</option>
                                        <option value='clipPath'>clip-path</option>
                                    </select>

                                    <input
                                        type='text'
                                        value={step.value}
                                        onChange={(e) => updateStep(face.id, step.id, step.type, e.target.value)}
                                        className={`${step.type}`}
                                    />

                                    <button className='remove-step' onClick={() => removeStep(face.id, step.id)}>×</button>
                                </div>
                            ))}
                        </div>

                        <div className='add-step-box'>
                            <button onClick={() => addStep(face.id, 'translateX')}>ADD STEP</button>
                            {/* <button onClick={() => addStep(face.id, 'translateX')}>translateX</button>
                            <button onClick={() => addStep(face.id, 'translateY')}>translateY</button>
                            <button onClick={() => addStep(face.id, 'translateZ')}>translateZ</button>
                            <button onClick={() => addStep(face.id, 'rotateX')}>rotateX</button>
                            <button onClick={() => addStep(face.id, 'rotateY')}>rotateY</button>
                            <button onClick={() => addStep(face.id, 'rotateZ')}>rotateZ</button>
                            <button onClick={() => addStep(face.id, 'scale')}>scale</button>
                            <button onClick={() => addStep(face.id, 'clipPath')}>clip-path</button> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
