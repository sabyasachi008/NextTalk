interface User {
    name : string;
    image : string;
};

interface MessageDTO {
    user: User;
    message: string;
}

interface Message {
    user: User;
    message: string;
    date: string;
}

export interface ServerToClientEvents {
    message: (params: MessageDTO) => void;
}

export interface ClientToServerEvents {
    message: (params: Message) => void;
}

export * from './server';