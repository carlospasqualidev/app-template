import { z } from "zod";

import { api } from "@/services/api";

// Schema é a fonte de verdade do shape — nunca confie no dado do servidor sem
// tipar/validar (ver Segurança).
export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof postSchema>;

const postsSchema = z.array(postSchema);

export async function getPosts(): Promise<Post[]> {
  const data = await api.get<unknown>("/posts");
  return postsSchema.parse(data);
}

export async function deletePost(id: number): Promise<void> {
  await api.delete(`/posts/${id}`);
}
