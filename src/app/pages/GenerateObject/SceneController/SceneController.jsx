import MovingLabelInput from '../../../components/MovingLabelInput/MovingLabelInput.jsx';
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
                    <MovingLabelInput
                        type={'number'}
                        value={(sceneStyle.scale * 100)?.toFixed(0) || 100}
                        onValueChange={(propE) => setSceneStyle(p => ({ ...p, scale: Math.max(0.1, Math.min(Number(propE.value / 100), 10)) }))}
                        extraClassName={''}
                        extraStyle={{}}
                        label={'Zoom'}
                        labelStyle={'center stay'}
                    />
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, scale: Math.max(0.1, Math.min(Number(Number(p.scale) + 0.5), 10)) }))}>
                        <i className='fa-solid fa-plus' />
                    </button>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateX: Math.max(-1000, Math.min(Number(Number(p.translateX) - 50), 1000)) }))}>
                        <i className='fa-solid fa-chevron-left' />
                    </button>
                    <MovingLabelInput
                        type={'number'}
                        value={sceneStyle.translateX || 0}
                        onValueChange={(propE) => setSceneStyle(p => ({ ...p, translateX: Math.max(-1000, Math.min(Number(propE.value), 1000)) }))}
                        extraClassName={''}
                        extraStyle={{}}
                        label={'Left/Right'}
                        labelStyle={'center stay'}
                    />
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateX: Math.max(-1000, Math.min(Number(Number(p.translateX) + 50), 1000)) }))}>
                        <i className='fa-solid fa-chevron-right' />
                    </button>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateY: Math.max(-500, Math.min(Number(Number(p.translateY) - 50), 500)) }))}>
                        <i className='fa-solid fa-chevron-up' />
                    </button>
                    <MovingLabelInput
                        type={'number'}
                        value={sceneStyle.translateY || 0}
                        onValueChange={(propE) => setSceneStyle(p => ({ ...p, translateY: Math.max(-500, Math.min(Number(propE.value), 500)) }))}
                        extraClassName={''}
                        extraStyle={{}}
                        label={'Up/Down'}
                        labelStyle={'center stay'}
                    />
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateY: Math.max(-500, Math.min(Number(Number(p.translateY) + 50), 500)) }))}>
                        <i className='fa-solid fa-chevron-down' />
                    </button>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateZ: Math.max(-500, Math.min(Number(Number(p.translateZ) + 50), 500)) }))}>
                        <i className='fa-regular fa-circle-dot' />
                    </button>
                    <MovingLabelInput
                        type={'number'}
                        value={sceneStyle.translateZ || 0}
                        onValueChange={(propE) => setSceneStyle(p => ({ ...p, translateZ: Math.max(-500, Math.min(Number(propE.value), 500)) }))}
                        extraClassName={''}
                        extraStyle={{}}
                        label={'Forward/Backward'}
                        labelStyle={'center stay'}
                    />
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, translateZ: Math.max(-500, Math.min(Number(Number(p.translateZ) - 50), 500)) }))}>
                        <i className='fa-regular fa-circle-xmark' />
                    </button>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, rotateZ: Math.max(-720, Math.min(Number(Number(p.rotateZ) + 60), 720)) }))}>
                        <i className='fa-solid fa-rotate-left' />
                    </button>
                    <MovingLabelInput
                        type={'number'}
                        value={sceneStyle.rotateZ || 0}
                        onValueChange={(propE) => setSceneStyle(p => ({ ...p, rotateZ: Math.max(-720, Math.min(Number(propE.value), 720)) }))}
                        extraClassName={''}
                        extraStyle={{}}
                        label={'Rotate'}
                        labelStyle={'center stay'}
                    />
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, rotateZ: Math.max(-720, Math.min(Number(Number(p.rotateZ) - 60), 720)) }))}>
                        <i className='fa-solid fa-rotate-right' />
                    </button>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn' onClick={() => setSceneStyle(p => ({ ...p, perspective: Math.max(0, Math.min(Number(Number(p.perspective) - 100), 2000)) }))}>
                        <i className='fa-solid fa-minus' />
                    </button>
                    <MovingLabelInput
                        type={'number'}
                        value={sceneStyle.perspective || 0}
                        onValueChange={(propE) => setSceneStyle(p => ({ ...p, perspective: Math.max(0, Math.min(Number(propE.value), 2000)) }))}
                        extraClassName={''}
                        extraStyle={{}}
                        label={'Perspective'}
                        labelStyle={'center stay'}
                    />
                    <button type='button' className='btn btn-right' onClick={() => setSceneStyle(p => ({ ...p, perspective: Math.max(0, Math.min(Number(Number(p.perspective) + 100), 2000)) }))}>
                        <i className='fa-solid fa-plus' />
                    </button>
                </div>
                <button type='button' className='btn' onClick={() => setSceneStyle({ scale: 1, translateX: 0, translateY: 0, translateZ: 0, rotateZ: 0, perspective: 600 })}>
                    <i className='fa-solid fa-arrows-rotate' />
                </button>
            </form>
        </div>
    )
}
