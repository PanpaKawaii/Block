import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../mocks/CallingAPI';
import { useAuth } from '../../hooks/AuthContext/AuthContext';

import './MyBlock.css';

export default function MyBlock() {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [refresh, setRefresh] = useState(0);
    const [thisUser, setThisUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUiLCJzdWIiOiJuZ3V5ZW50aGFuaGR1b25nMzc5MjNAZ21haWwuY29tIiwiZW1haWwiOiJuZ3V5ZW50aGFuaGR1b25nMzc5MjNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI1IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ3VzdG9tZXIiLCJqdGkiOiJkM2Y2NmM3Ni1jZTllLTQ4ZTQtYjIyNS1kMDdkMTRkMmY4NjAiLCJleHAiOjE3NjUwOTYwNjUsImlzcyI6Ilhub3ZhQm9va2luZyIsImF1ZCI6Ilhub3ZhV2ViIn0.s4PThbMnfEwawAHBCwXIUhEM6n2h8aJt1pfEkPVw8wY","email":"nguyenthanhduong37923@gmail.com","role":"Customer","id":"2b158164-d176-4625-9057-4215f6610420"}
    useEffect(() => {
        if (!localStorage.getItem('user')) navigate('/');
        (async () => {
            setError(null);
            setLoading(true);
            const token = '';
            try {
                const UserResponse = await fetchData(`users/${user?.id}`, token);
                console.log('UserResponse', UserResponse);

                setThisUser(UserResponse);
            } catch (error) {
                setError('Error');
            } finally {
                setLoading(false);
            }
        })();
    }, [user?.id, refresh]);

    return (
        <div className='my-block-container'>
            <div>thisUser: {JSON.stringify(thisUser)}</div>
            {thisUser?.blocks?.map((b, index) => (
                <div key={index}>
                    <p>Name: {b.name}</p>
                </div>
            ))}
        </div>
    )
}
