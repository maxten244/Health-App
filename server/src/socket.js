import { Server } from 'socket.io';

let io = null;

export function initSocket(httpServer) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  io = new Server(httpServer, {
    cors: { origin: clientUrl, methods: ['GET', 'POST'] },
  });
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });
  return io;
}

export function getIo() {
  return io;
}
