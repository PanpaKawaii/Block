import ButtonList from '../ButtonList/ButtonList';
import CopyPasteButton from '../CopyPasteButton/CopyPasteButton';
import './ControlPanel.css';

export default function ControlPanel({
    children,
    titleName = '',
    extraClassName = '',
    collapseMenu = false,
    size = '',
    collapseController = () => { },
    entity = [],
    setEntity = () => { },
    addEntity = () => { },
    swapController = () => { }
}) {
    return (
        <div className={`control-panel-container card ${collapseMenu ? 'collapsed' : ''} ${extraClassName} ${size}`}>
            <div className='title-name'>
                <h2>{titleName}</h2>
            </div>
            <div className='line'></div>
            <div className='control-btns'>
                <button className='btn btn-collapsed' onClick={collapseController}><i className='fa-solid fa-chevron-right' /></button>
                <CopyPasteButton data={entity} setData={setEntity} />
                <button className='btn' onClick={addEntity}><i className='fa-solid fa-plus' /></button>
                <button className='btn btn-remove' onClick={() => setEntity([])}><i className='fa-solid fa-trash-can' /></button>
                <ButtonList onToggle={swapController} />
            </div>
            {/* <button className='btn' onClick={changeAttribute}><i className='fa-solid fa-file' /></button> */}
            {/* <Link to='/' state={'5fa8b8df-595a-4f13-b808-7f58b404dd87'}><button className='btn'>/</button></Link> */}
            <div className='line'></div>
            <div className='panel-content'>
                {children}
            </div>
        </div>
    )
}
