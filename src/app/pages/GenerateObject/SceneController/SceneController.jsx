import './SceneController.css';

export default function SceneController({
    sceneStyle,
    setSceneStyle,
    showCoordinateAxes,
    handleShowCoordinateAxes
}) {
    return (
        <div className='scene-controller-container'>
            <form>
                <button type='button' className={`btn btn-xyz ${!showCoordinateAxes.includes('Oxyz') ? 'off' : ''}`} onClick={() => handleShowCoordinateAxes('Oxyz')}>Oxyz</button>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, scale: Math.max(0.1, Math.min(Number(Number(p.scale) - 0.5), 10)) }))}>
                        <i className='fa-solid fa-minus' />
                    </button>
                    <div className='input-group'>
                        <input
                            type='number'
                            placeholder=''
                            value={(sceneStyle.scale * 100)?.toFixed(0) || 100}
                            onChange={(e) => setSceneStyle(p => ({ ...p, scale: Math.max(0.1, Math.min(Number(e.target.value / 100), 10)) }))}
                            className='input'
                        />
                        <label htmlFor='Zoom'>Zoom</label>
                    </div>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, scale: Math.max(0.1, Math.min(Number(Number(p.scale) + 0.5), 10)) }))}>
                        <i className='fa-solid fa-plus' />
                    </button>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateX: Math.max(-1000, Math.min(Number(Number(p.translateX) - 50), 1000)) }))}>
                        <i className='fa-solid fa-chevron-left' />
                    </button>
                    <div className='input-group'>
                        <input
                            type='number'
                            placeholder=''
                            value={sceneStyle.translateX || 0}
                            onChange={(e) => setSceneStyle(p => ({ ...p, translateX: Math.max(-1000, Math.min(Number(e.target.value), 1000)) }))}
                            className='input'
                        />
                        <label htmlFor='translateX'>Left/Right</label>
                    </div>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateX: Math.max(-1000, Math.min(Number(Number(p.translateX) + 50), 1000)) }))}>
                        <i className='fa-solid fa-chevron-right' />
                    </button>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateY: Math.max(-500, Math.min(Number(Number(p.translateY) - 50), 500)) }))}>
                        <i className='fa-solid fa-chevron-up' />
                    </button>
                    <div className='input-group'>
                        <input
                            type='number'
                            placeholder=''
                            value={sceneStyle.translateY || 0}
                            onChange={(e) => setSceneStyle(p => ({ ...p, translateY: Math.max(-500, Math.min(Number(e.target.value), 500)) }))}
                            className='input'
                        />
                        <label htmlFor='translateY'>Up/Down</label>
                    </div>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateY: Math.max(-500, Math.min(Number(Number(p.translateY) + 50), 500)) }))}>
                        <i className='fa-solid fa-chevron-down' />
                    </button>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateZ: Math.max(-500, Math.min(Number(Number(p.translateZ) + 50), 500)) }))}>
                        <i className='fa-regular fa-circle-dot' />
                    </button>
                    <div className='input-group'>
                        <input
                            type='number'
                            placeholder=''
                            value={sceneStyle.translateZ || 0}
                            onChange={(e) => setSceneStyle(p => ({ ...p, translateZ: Math.max(-500, Math.min(Number(e.target.value), 500)) }))}
                            className='input'
                        />
                        <label htmlFor='translateZ'>Forward/Backward</label>
                    </div>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateZ: Math.max(-500, Math.min(Number(Number(p.translateZ) - 50), 500)) }))}>
                        <i className='fa-regular fa-circle-xmark' />
                    </button>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, rotateZ: Math.max(-720, Math.min(Number(Number(p.rotateZ) + 60), 720)) }))}>
                        <i className='fa-solid fa-rotate-left' />
                    </button>
                    <div className='input-group'>
                        <input
                            type='number'
                            placeholder=''
                            value={sceneStyle.rotateZ || 0}
                            onChange={(e) => setSceneStyle(p => ({ ...p, rotateZ: Math.max(-720, Math.min(Number(e.target.value), 720)) }))}
                            className='input'
                        />
                        <label htmlFor='rotateZ'>Rotate</label>
                    </div>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, rotateZ: Math.max(-720, Math.min(Number(Number(p.rotateZ) - 60), 720)) }))}>
                        <i className='fa-solid fa-rotate-right' />
                    </button>
                </div>
                <button type='button' className='btn' onClick={() => setSceneStyle({ scale: 1, translateX: 0, translateY: 0, translateZ: 0, rotateZ: 0 })}>
                    <i className='fa-solid fa-arrows-rotate' />
                </button>
            </form>
        </div>
    )
}
