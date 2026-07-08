export const postKeys = {
  all: ["posts"] as const,
  list: () => [...postKeys.all] as const,
};
