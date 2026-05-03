'use client';

import { useContext } from 'react';
import { ClientContext } from '../../providers/Client/ClientProvider';


export const useClient = () =>{ 
    const context = useContext(ClientContext);
    if(!context) {
        throw new Error('This cannot be used outside the clientProvider component');
    }

    return context;
}