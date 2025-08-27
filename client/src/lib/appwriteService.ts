import { databases, DATABASE_ID, SERVERS_COLLECTION_ID, Query } from "@/lib/appwrite";
import { Server, InsertServer, Service } from "@shared/schema";
import { ID } from "appwrite";

export interface AppwriteServer {
  $id: string;
  name: string;
  ip: string;
  os?: string;
  provider?: string;
  location?: string;
  notes?: string;
  services: string; // JSON string
  userId: string;
  $createdAt: string;
  $updatedAt: string;
}

export const appwriteService = {
  async getServers(userId: string): Promise<Server[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SERVERS_COLLECTION_ID,
        [Query.equal("userId", userId)]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        ip: doc.ip,
        os: doc.os || "",
        provider: doc.provider || "",
        location: doc.location || "",
        notes: doc.notes || "",
        services: JSON.parse(doc.services || "[]") as Service[],
        createdAt: new Date(doc.$createdAt),
        updatedAt: new Date(doc.$updatedAt),
      }));
    } catch (error) {
      console.error("Error getting servers:", error);
      return [];
    }
  },

  async addServer(userId: string, serverData: InsertServer): Promise<Server | null> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        SERVERS_COLLECTION_ID,
        ID.unique(),
        {
          name: serverData.name,
          ip: serverData.ip,
          os: serverData.os || "",
          provider: serverData.provider || "",
          location: serverData.location || "",
          notes: serverData.notes || "",
          services: JSON.stringify(serverData.services),
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      return {
        id: response.$id,
        name: response.name,
        ip: response.ip,
        os: response.os || "",
        provider: response.provider || "",
        location: response.location || "",
        notes: response.notes || "",
        services: JSON.parse(response.services || "[]") as Service[],
        createdAt: new Date(response.$createdAt),
        updatedAt: new Date(response.$updatedAt),
      };
    } catch (error) {
      console.error("Error adding server:", error);
      return null;
    }
  },

  async updateServer(serverId: string, serverData: InsertServer): Promise<Server | null> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        SERVERS_COLLECTION_ID,
        serverId,
        {
          name: serverData.name,
          ip: serverData.ip,
          os: serverData.os || "",
          provider: serverData.provider || "",
          location: serverData.location || "",
          notes: serverData.notes || "",
          services: JSON.stringify(serverData.services),
          updatedAt: new Date().toISOString(),
        }
      );

      return {
        id: response.$id,
        name: response.name,
        ip: response.ip,
        os: response.os || "",
        provider: response.provider || "",
        location: response.location || "",
        notes: response.notes || "",
        services: JSON.parse(response.services || "[]") as Service[],
        createdAt: new Date(response.$createdAt),
        updatedAt: new Date(response.$updatedAt),
      };
    } catch (error) {
      console.error("Error updating server:", error);
      return null;
    }
  },

  async deleteServer(serverId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        SERVERS_COLLECTION_ID,
        serverId
      );
      return true;
    } catch (error) {
      console.error("Error deleting server:", error);
      return false;
    }
  },

  searchServers(servers: Server[], query: string): Server[] {
    const lowercaseQuery = query.toLowerCase();
    
    return servers.filter(server => 
      server.name.toLowerCase().includes(lowercaseQuery) ||
      server.ip?.toLowerCase().includes(lowercaseQuery) ||
      server.provider?.toLowerCase().includes(lowercaseQuery) ||
      server.services.some(service => 
        service.name.toLowerCase().includes(lowercaseQuery)
      )
    );
  }
};