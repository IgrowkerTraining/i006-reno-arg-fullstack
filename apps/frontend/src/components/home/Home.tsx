import React from 'react'
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

const Home: React.FC = () => {

    const { user, logout } = useAuth();
    return (
        <>
            <h2 className='text-3xl font-bold mb-4'>Dashboard RenoArg</h2>
            {user && (<p className="text-2xl">Bienvenid@ {user.name}</p>)}
            <Button variant="secondary" className="mt-4 px-4 py-2" onClick={logout}>
                Cerrar sesión
            </Button>
        </>
    )
}

export default Home