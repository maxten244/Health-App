import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import net from 'net';
import os from 'os';
import path from 'path';
import { mkdtemp, rm } from 'fs/promises';

let mongoServer;
let mongoDbPath;

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close((err) => {
        if (err) return reject(err);
        resolve(port);
      });
    });
  });
}

beforeAll(async () => {
  mongoDbPath = await mkdtemp(path.join(os.tmpdir(), 'mh-mongo-'));
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const port = await getFreePort();
      mongoServer = await MongoMemoryServer.create({
        instance: {
          port,
          ip: '127.0.0.1',
          dbPath: mongoDbPath,
        },
      });
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!mongoServer) {
    throw lastError;
  }

  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 20000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  if (mongoDbPath) await rm(mongoDbPath, { recursive: true, force: true });
});
