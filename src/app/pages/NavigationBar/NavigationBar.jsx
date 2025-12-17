import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext/AuthContext.jsx';
import './NavigationBar.css';

export default function NavigationBar() {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    console.log('NavigationBar', location.pathname);

    const [toggleMenu, setToggleMenu] = useState(true);

    const menuItems = [
        { name: 'HOME', icon: 'cube', path: '/' },
        { name: 'MY BLOCK', icon: 'box-open', path: '/my-block' },
    ];

    useEffect(() => {
        if (!localStorage.getItem('user')) navigate('/');
    }, [user?.id]);

    return (
        <>
            <div className={`navigation-bar-container ${toggleMenu ? '' : 'collapsed'}`}>
                <Link to='/'>
                    <div className='logo glow'>BLOCK</div>
                </Link>
                <button className='btn btn-collapsed' onClick={() => setToggleMenu(p => !p)}><i className='fa-solid fa-chevron-left' /></button>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <div className='box' style={{ '--i': menuItems.length - index }}>
                                <Link to={`${item.path}`}>
                                    <div className='face-text'><span>{item.name}</span></div>
                                    <div className='face-icon'><i className={`fa-solid fa-${item.icon}`} /></div>
                                </Link>
                            </div>
                        </li>
                    ))}
                    <li>
                        <div className='box' onClick={logout}>
                            <button>
                                <div className='face-text'><span>LOGOUT</span></div>
                                <div className='face-icon'><i className={`fa-solid fa-right-to-bracket`} /></div>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
            <Outlet />
        </>
    )
}
