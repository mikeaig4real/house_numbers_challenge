import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';

export const socket = io( URL, {
    withCredentials: true,
    transports: [ 'websocket' ],
    autoConnect: true,
    reconnectionAttempts: 5,
} );

export const connectSocket = () => {
    if ( !socket.connected ) {
        socket.connect();
    }
};
