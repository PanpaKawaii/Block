import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchData } from '../../../mocks/CallingAPI';
import { useAuth } from '../../hooks/AuthContext/AuthContext';
import GenerateObjectController from '../GenerateObject/GenerateObjectController';

export default function MyBlockController() {
    const { user } = useAuth();

    const location = useLocation();
    console.log('location.state', location.state);

    const [thisBlock, setThisBlock] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('user')) navigate('/');
        const blockId = location.state;
        console.log('blockId', blockId);
        (async () => {
            setError(null);
            setLoading(true);
            const token = '';
            try {
                const UserResponse = await fetchData(`users/${user?.id}`, token);
                console.log('UserResponse', UserResponse);
                const Block = UserResponse?.blocks?.find(b => b.id == blockId);
                console.log('Block', Block);

                setThisBlock(Block);
            } catch (error) {
                setError('Error');
            } finally {
                setLoading(false);
            }
        })();
    }, [location.state]);

    const { faces, dots, vectors, lines } = thisBlock;
    console.log('faces', faces);
    console.log('dots', dots);
    console.log('vectors', vectors);
    console.log('lines', lines);

    if (loading) return <div style={{ minHeight: '100vh' }}>Loading...</div>;
    if (error) return <div style={{ minHeight: '100vh' }}>{error}</div>;
    return (
        <GenerateObjectController pFace={faces} pDot={dots} pVector={vectors} pLine={lines} />
    )
}
