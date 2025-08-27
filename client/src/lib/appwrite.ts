import { Client, Account, Databases, Query } from "appwrite";

// 环境变量验证
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_SERVERS_COLLECTION_ID = import.meta.env
  .VITE_APPWRITE_SERVERS_COLLECTION_ID;

// 检查必需的环境变量
if (!APPWRITE_ENDPOINT) {
  throw new Error("VITE_APPWRITE_ENDPOINT 环境变量未设置");
}
if (!APPWRITE_PROJECT_ID) {
  throw new Error("VITE_APPWRITE_PROJECT_ID 环境变量未设置");
}
if (!APPWRITE_DATABASE_ID) {
  throw new Error("VITE_APPWRITE_DATABASE_ID 环境变量未设置");
}
if (!APPWRITE_SERVERS_COLLECTION_ID) {
  throw new Error("VITE_APPWRITE_SERVERS_COLLECTION_ID 环境变量未设置");
}

const client = new Client();

// 配置客户端
client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

// 创建服务实例
export const account = new Account(client);
export const databases = new Databases(client);

// 数据库和集合ID
export const DATABASE_ID = APPWRITE_DATABASE_ID;
export const SERVERS_COLLECTION_ID = APPWRITE_SERVERS_COLLECTION_ID;

// 测试认证状态
export const testAuth = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
};

export { client, Query };
