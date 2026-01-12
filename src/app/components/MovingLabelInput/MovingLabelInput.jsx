import './MovingLabelInput.css';

export default function MovingLabelInput({
    type = 'text',
    value,
    onValueChange,
    extraClassName = '',
    extraStyle = {},
    label = '',
    labelStyle = '',
    disable = false
}) {
    return (
        <div className='moving-label-input-container' style={extraStyle}>
            <input
                type={type}
                placeholder=''
                value={value ?? ''}
                onChange={(e) => {
                    const val = type === 'number'
                        ? Number(e.target.value)
                        : e.target.value
                    onValueChange({ value: val })
                }}
                className={`input ${extraClassName}`}
                disabled={disable}
            />
            <label htmlFor={label} className={labelStyle}>{label}</label>
        </div>
    )
}
