import { Express } from 'express';
import { Server } from 'socket.io';
import { AuthSocket } from '../../types';
import EVENTS from '../constants/events';
import { getSummary } from './getSummary';

export const handleSocket = (app: Express, io: Server, socket: AuthSocket) => {
  socket.on(EVENTS.GET_SUMMARY, getSummary(app, io, socket));
  socket.on(EVENTS.DISCONNECT, () => {
    const user = socket.user;
    if (user) {
      console.log(`User ${user.id} disconnected`);
      return;
    }
    console.log(`A user disconnected`);
  });
};
