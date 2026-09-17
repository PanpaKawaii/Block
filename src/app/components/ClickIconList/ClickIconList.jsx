import { useState } from 'react';
import useClickOutside from '../../hooks/ClickOutside/useClickOutside';
import './ClickIconList.css';

export default function ClickIconList({
    disabled = false,
    list = []
}) {
    const [open, setOpen] = useState(false);
    const clickIconListRef = useClickOutside(() => setOpen(false));
    const handleClick = (item) => {
        item.onToggle();
        setOpen(false);
    };
    return (
        <div ref={clickIconListRef} className={`click-icon-list-container ${open ? 'open' : ''}`}>
            <button className='btn' onClick={() => setOpen(p => !p)} disabled={disabled}>
                <i className='fa-solid fa-ellipsis-vertical' />
            </button>
            <div className='list-button'>
                {open && list?.map((item, index) => (
                    <button className={`item ${item.className}`} key={index} onClick={() => handleClick(item)} disabled={item.disabled}>
                        {item.icon && <i className={item.icon} />}
                    </button>
                ))}
            </div>
        </div>
    )
}
