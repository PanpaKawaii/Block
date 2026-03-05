import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../../../mocks/CallingAPI';
import { useAuth } from '../../hooks/AuthContext/AuthContext';

import './MyBlock.css';

export default function MyBlock() {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [thisUser, setThisUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(0);

    // {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUiLCJzdWIiOiJuZ3V5ZW50aGFuaGR1b25nMzc5MjNAZ21haWwuY29tIiwiZW1haWwiOiJuZ3V5ZW50aGFuaGR1b25nMzc5MjNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI1IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ3VzdG9tZXIiLCJqdGkiOiJkM2Y2NmM3Ni1jZTllLTQ4ZTQtYjIyNS1kMDdkMTRkMmY4NjAiLCJleHAiOjE3NjUwOTYwNjUsImlzcyI6Ilhub3ZhQm9va2luZyIsImF1ZCI6Ilhub3ZhV2ViIn0.s4PThbMnfEwawAHBCwXIUhEM6n2h8aJt1pfEkPVw8wY","email":"nguyenthanhduong37923@gmail.com","role":"Customer","id":"2b158164-d176-4625-9057-4215f6610420"}
    // {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUiLCJzdWIiOiJuZ3V5ZW50aGFuaGR1b25nMzc5MjNAZ21haWwuY29tIiwiZW1haWwiOiJuZ3V5ZW50aGFuaGR1b25nMzc5MjNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI1IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ3VzdG9tZXIiLCJqdGkiOiJkM2Y2NmM3Ni1jZTllLTQ4ZTQtYjIyNS1kMDdkMTRkMmY4NjAiLCJleHAiOjE3NjUwOTYwNjUsImlzcyI6Ilhub3ZhQm9va2luZyIsImF1ZCI6Ilhub3ZhV2ViIn0.s4PThbMnfEwawAHBCwXIUhEM6n2h8aJt1pfEkPVw8wY","email":"nguyenthanhduong37923@gmail.com","role":"Customer","id":"2e54fd13-961c-4686-ba79-4c4af23def5e"}

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
            {/* <div>thisUser: {JSON.stringify(thisUser)}</div> */}

            {/* <div className='content'>
                {thisUser?.blocks?.map((b, index) => (
                    <div key={index}>
                        <p>Name: {b.name}</p>
                        <Link to='/my-block-controller' state={b.id}>
                            <button className='btn'>View Details</button>
                        </Link>
                    </div>
                ))}
            </div> */}

            <div className='grid-row'>
                {thisUser?.blocks?.map((b, index) => (
                    <div key={index} className='grid-col'>
                        <p>Name: {b.name}</p>
                        <Link to='/my-block-controller' state={b.id}>
                            <button className='btn'>View Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
