import { z } from "zod";

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Service name is required"),
  port: z.string().optional(), // 端口字段改为可选
  description: z.string().optional(),
});

export const serverSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Server name is required"),
  ip: z.string().optional(),
  os: z.string().optional(),
  provider: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  services: z.array(serviceSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertServerSchema = serverSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = serviceSchema.omit({
  id: true,
});

export type Server = z.infer<typeof serverSchema>;
export type InsertServer = z.infer<typeof insertServerSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
