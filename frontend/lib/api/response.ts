import { z } from "zod";

export const apiErrorSchema = z.object({
  status: z.literal("fail"),
  statusCode: z.number().int().min(400).max(599),
  message: z.string().min(1),
});

export const apiSuccessSchema = z.object({
  status: z.literal("success"),
  data: z.unknown(),
});
