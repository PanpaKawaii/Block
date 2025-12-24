import './ColorInput.css';

export default function ColorInput({ selectedFace, attribute, label, updateFace, hexRgbaToPercent, updateHexAlphaByPercent }) {
    return (
        <div className='color-input-container'>
            {/* <label>{label}</label> */}
            <input
                type='color'
                value={selectedFace?.[attribute]?.slice(0, 7) || '#FFFFFF'}
                onChange={(e) => updateFace(selectedFace?.id, attribute, e.target.value?.toUpperCase())}
                className='input color-input'
                style={{ opacity: hexRgbaToPercent(selectedFace?.[attribute] || '#FFFFFFFF') || 1 }}
            />
            <input
                type='text'
                value={selectedFace?.[attribute]}
                onChange={(e) => updateFace(selectedFace?.id, attribute, e.target.value?.toUpperCase())}
                className='input hex-input'
            />
            <input
                type='number'
                min={0}
                max={100}
                value={(hexRgbaToPercent(selectedFace?.[attribute] || '#FFFFFFFF') * 100)?.toFixed(0) || 100}
                onChange={(e) => updateFace(selectedFace?.id, attribute, updateHexAlphaByPercent(selectedFace?.[attribute], e.target.value || 100))}
                className='input alpha-input'
            />
        </div>
    )
}
