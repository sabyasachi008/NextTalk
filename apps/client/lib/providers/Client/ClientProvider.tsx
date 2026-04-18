'use client';


import { PropsWithChildren, createContext, useEffect, useState } from 'react';

import { Socket, io } from 'socket.io-client';


interface Client{
    client : Socket | null;
}

const DEFAULT_VALUE : Client = {
    client : null,
};

