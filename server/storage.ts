import { type Server, type InsertServer } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getServer(id: string): Promise<Server | undefined>;
  getServersByUser(userId: string): Promise<Server[]>;
  createServer(server: InsertServer): Promise<Server>;
}

export class MemStorage implements IStorage {
  private servers: Map<string, Server>;

  constructor() {
    this.servers = new Map();
  }

  async getServer(id: string): Promise<Server | undefined> {
    return this.servers.get(id);
  }

  async getServersByUser(userId: string): Promise<Server[]> {
    return Array.from(this.servers.values()).filter(
      (server) => (server as any).userId === userId,
    );
  }

  async createServer(insertServer: InsertServer): Promise<Server> {
    const id = randomUUID();
    const server: Server = { 
      ...insertServer, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.servers.set(id, server);
    return server;
  }
}

export const storage = new MemStorage();
