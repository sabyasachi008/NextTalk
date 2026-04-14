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
    date: Date;
}

export interface ServerToClientEvents {
    message: (params: Message) => void;
}

export interface ClientToServerEvents {
    message: (params: MessageDTO) => void;
}

export * from './server';