import './StyleLabelSelect.css';

export default function StyleLabelSelect({
    list = [],
    onValueChange,
    extraClassName = '',
    extraStyle = {},
    label = '',
    labelStyle = ''
}) {
    return (
        <div className='style-label-select-container' style={extraStyle}>
            <select
                onChange={(e) => {
                    const value = e.target.value;
                    const select = list?.find(m => m.id == value);
                    const X = select?.xCoordinate || 0;
                    const Y = select?.yCoordinate || 0;
                    const Z = select?.zCoordinate || 0;
                    onValueChange({ X: X, Y: Y, Z: Z });
                }}
                className={`select ${extraClassName}`}
            >
                <option value={''} className='option'>O</option>
                {list.map((item, index) => (
                    <option key={index} value={item.id} className='option'>{item.name}</option>
                ))}
            </select>
            <label htmlFor={label} className={labelStyle}>{label}</label>
        </div>
    )
}
