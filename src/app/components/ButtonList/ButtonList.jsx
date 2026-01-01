import { useState } from 'react';
import './ButtonList.css';

export default function ButtonList({
    icon,
    onToggle
}) {
    const [show, setShow] = useState(false);
    const ListSwapController = [
        { value: 'face', icon: '' },
        { value: 'dot', icon: '' },
        { value: 'vector', icon: '' },
        { value: 'line', icon: '' },
        { value: 'function', icon: '' }
    ];
    const handleClick = (item) => {
        onToggle(item);
        setShow(false);
    };
    return (
        <div className='button-list-container'>
            <button className='btn' onClick={() => setShow(p => !p)}><i className={`fa-solid fa-${icon}`} /></button>
            <div className='list-button'>
                {show && ListSwapController?.map((item, index) => (
                    <button className='item' key={index} onClick={() => handleClick(item.value)}>
                        {item.value?.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    )
}
