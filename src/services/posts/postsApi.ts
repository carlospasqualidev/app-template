import { z } from "zod";

// Schema é a fonte de verdade do shape — nunca confie no dado do servidor sem
// tipar/validar (ver Segurança).
export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof postSchema>;

const postsSchema = z.array(postSchema);

/* -----------------------------------------------------------------------------
 * MODO FAKE DOS POSTS (sem backend)
 * -----------------------------------------------------------------------------
 * O `../server-template` não tem rota de posts: o Feed é só a tela de
 * referência do padrão (query + mutation otimista + FlashList + estados).
 * Os posts vivem em memória: excluir remove de verdade até o app reiniciar.
 *
 * COMO PLUGAR O BACKEND REAL:
 *   1. Apague daqui até "FIM DO MODO FAKE".
 *   2. Descomente o bloco "IMPLEMENTAÇÃO REAL" no fim do arquivo.
 *   3. Garanta que `EXPO_PUBLIC_API_URL` aponta para o backend.
 * -------------------------------------------------------------------------- */

const FAKE_LATENCY_MS = 400;

const fakePosts: Post[] = [
  {
    id: 1,
    title: "Reunião de planejamento",
    body: "A reunião de planejamento do trimestre foi remarcada para quinta-feira, às 10h.",
  },
  {
    id: 2,
    title: "Novo horário de atendimento",
    body: "A partir da próxima semana, o atendimento funciona das 8h às 18h, de segunda a sexta.",
  },
  {
    id: 3,
    title: "Manutenção programada",
    body: "O sistema ficará indisponível no domingo, das 2h às 4h, para manutenção.",
  },
  {
    id: 4,
    title: "Boas-vindas à equipe",
    body: "Damos as boas-vindas às pessoas que chegaram ao time comercial este mês.",
  },
  {
    id: 5,
    title: "Pesquisa de satisfação",
    body: "Responda à pesquisa interna até sexta-feira. Leva menos de cinco minutos.",
  },
  {
    id: 6,
    title: "Feriado municipal",
    body: "Não haverá expediente na próxima segunda-feira por causa do feriado municipal.",
  },
];

function waitFakeLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS));
}

export async function getPosts(): Promise<Post[]> {
  await waitFakeLatency();
  return postsSchema.parse(fakePosts.map((post) => ({ ...post })));
}

export async function deletePost(id: number): Promise<void> {
  await waitFakeLatency();
  const index = fakePosts.findIndex((post) => post.id === id);
  if (index >= 0) {
    fakePosts.splice(index, 1);
  }
}

/* -----------------------------------------------------------------------------
 * FIM DO MODO FAKE
 * -------------------------------------------------------------------------- */

/* -----------------------------------------------------------------------------
 * IMPLEMENTAÇÃO REAL (descomente ao plugar o backend)
 * -----------------------------------------------------------------------------
 * import { api } from "@/services/api";
 *
 * export async function getPosts(): Promise<Post[]> {
 *   const data = await api.get<unknown>("/posts");
 *   return postsSchema.parse(data);
 * }
 *
 * export async function deletePost(id: number): Promise<void> {
 *   await api.delete(`/posts/${id}`);
 * }
 * -------------------------------------------------------------------------- */
