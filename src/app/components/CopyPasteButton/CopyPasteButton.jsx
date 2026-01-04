import { useState } from 'react';
import './CopyPasteButton.css';

export default function CopyPasteButton({
    data,
    setData
}) {
    const [status, setStatus] = useState('copy');

    const handleCheckThenCopy = (newStatus) => {
        setStatus(newStatus);

        setTimeout(() => {
            setStatus('copy');
        }, 2000);
    };

    const handleCopy = async () => {
        handleCheckThenCopy('check');
        await navigator.clipboard.writeText(
            JSON.stringify(data, null, 0)
        );
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setData(JSON.parse(text));
            handleCheckThenCopy('check');
        } catch (e) {
            handleCheckThenCopy('xmark');
            // alert('Clipboard is not a valid JSON');
        }
    };

    return (
        <button
            className='copy-paste-button-container btn'
            onClick={handleCopy}
            onContextMenu={(e) => {
                e.preventDefault();
                handlePaste()
            }}
            title='Click to copy, right-click to paste'
        >
            <i className={`fa-solid fa-${status}`} />
        </button>
    )
}
