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
            <div className='input-group flex-2'>
                <input
                    type='text'
                    placeholder=''
                    value={selectedFace?.[attribute] || ''}
                    onChange={(e) => updateFace(selectedFace?.id, attribute, e.target.value?.toUpperCase())}
                    className='input hex-input'
                />
                <label htmlFor={label}>{label}</label>
            </div>
            <div className='input-group'>
                <input
                    type='number'
                    placeholder=''
                    value={(hexRgbaToPercent(selectedFace?.[attribute] || '#FFFFFFFF') * 100)?.toFixed(0) || 100}
                    onChange={(e) => updateFace(selectedFace?.id, attribute, updateHexAlphaByPercent(selectedFace?.[attribute], e.target.value || 100))}
                    className='input alpha-input'
                />
                <label htmlFor='Alpha'>Alpha</label>
            </div>
        </div>
    )
}
