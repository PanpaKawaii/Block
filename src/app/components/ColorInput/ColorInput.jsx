import MovingLabelInput from '../MovingLabelInput/MovingLabelInput.jsx';
import './ColorInput.css';

export default function ColorInput({
    selectedFace,
    attribute,
    label,
    updateFace,
    hexRgbaToPercent,
    updateHexAlphaByPercent
}) {
    return (
        <div className='color-input-container'>
            <input
                type='color'
                placeholder=''
                value={selectedFace?.[attribute]?.slice(0, 7) || '#FFFFFF'}
                onChange={(e) => updateFace(selectedFace?.id, attribute, e.target.value?.toUpperCase())}
                className='input color-input'
                style={{ opacity: hexRgbaToPercent(selectedFace?.[attribute] || '#FFFFFFFF') || 1 }}
            />
            <MovingLabelInput
                type={'text'}
                value={selectedFace?.[attribute] || ''}
                onValueChange={(propE) => updateFace(selectedFace?.id, attribute, propE.value?.toUpperCase())}
                extraClassName={'hex-input'}
                extraStyle={{ flex: 2 }}
                label={label}
                labelStyle={'left moving'}
            />
            <MovingLabelInput
                type={'number'}
                value={(hexRgbaToPercent(selectedFace?.[attribute] || '#FFFFFFFF') * 100)?.toFixed(0) || 100}
                onValueChange={(propE) => updateFace(selectedFace?.id, attribute, updateHexAlphaByPercent(selectedFace?.[attribute], propE.value || 100))}
                extraClassName={'alpha-input'}
                extraStyle={{ flex: 1 }}
                label={'Alpha'}
                labelStyle={'left moving'}
            />
        </div>
    )
}
