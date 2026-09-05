import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LoginRegister from '../../pages/LoginRegister/LoginRegister';
import NavigationBar from '../../pages/NavigationBar/NavigationBar';

import './UserLayout.css';

export default function UserLayout() {
    const location = useLocation();

    const [loginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
        if (location.state?.openLogin == 'true') setLoginOpen(true);
        else if (location.state?.openLogin == 'false') setLoginOpen(false);
    }, [location.state]);

    return (
        <div className='user-layout-container'>
            <NavigationBar setLoginOpen={setLoginOpen} />
            <main className='main'><Outlet /></main>

            {loginOpen &&
                <LoginRegister onClose={setLoginOpen} />
            }
        </div>
    )
}
