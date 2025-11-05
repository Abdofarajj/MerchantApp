import { z } from "zod";

// TODO: ADD ZOD SCHEMA BASED ON API RESPONSE
export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  // TODO: ADD ZOD SCHEMA BASED ON API RESPONSE
});

export type Document = z.infer<typeof DocumentSchema>;
