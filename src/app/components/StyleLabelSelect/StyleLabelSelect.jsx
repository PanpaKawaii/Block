import './StyleLabelSelect.css';

export default function StyleLabelSelect({
    reference = null,
    list = [],
    value = '',
    onValueChange,
    extraClassName = '',
    extraStyle = {},
    label = '',
    labelStyle = ''
}) {
    return (
        <div className='style-label-select-container' style={extraStyle}>
            <select
                ref={reference}
                value={list?.find(m => m.id == value)?.id}
                onChange={(e) => {
                    const val = e.target.value;
                    const select = list?.find(m => m.id == val);
                    const X = select?.xCoordinate || 0;
                    const Y = select?.yCoordinate || 0;
                    const Z = select?.zCoordinate || 0;
                    onValueChange({ X: X, Y: Y, Z: Z });
                }}
                className={`select ${extraClassName}`}
            >
                <option value={''} className='option' disabled>--</option>
                <option value={'Oxyz'} className='option'>O</option>
                {list.map((item, index) => (
                    <option key={index} value={item.id} className='option'>{item.name}</option>
                ))}
            </select>
            <label htmlFor={label} className={labelStyle}>{label}</label>
        </div>
    )
}
