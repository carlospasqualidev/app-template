import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Newspaper, Trash2 } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ConfirmDialog } from "@/components/confirmDialog";
import { Empty } from "@/components/empty";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { toast } from "@/lib/toast";
import { deletePost, getPosts, type Post } from "@/services/posts/postsApi";

import { PostListSkeleton } from "./postListSkeleton";
import { postKeys } from "./queryKeys";

function Separator() {
  return <View style={styles.separator} />;
}

export function PostsScreen() {
  const { theme } = useUnistyles();
  const iconColor = theme.colors.textMuted;
  const queryClient = useQueryClient();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const { data, isPending, isError, refetch, isRefetching } = useQuery({
    queryKey: postKeys.list(),
    queryFn: getPosts,
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: postKeys.list() });
      const previous = queryClient.getQueryData<Post[]>(postKeys.list());
      queryClient.setQueryData<Post[]>(postKeys.list(), (old) =>
        old?.filter((post) => post.id !== id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postKeys.list(), context.previous);
      }
      toast.error("Falha ao excluir o post.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <Card>
          <View style={styles.cardRow}>
            <Text
              variant="p2"
              weight="semibold"
              numberOfLines={1}
              style={styles.cardTitle}
            >
              {item.title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Excluir post"
              hitSlop={8}
              onPress={() => setPostToDelete(item)}
            >
              <Trash2 size={18} color={iconColor} />
            </Pressable>
          </View>
          <Text variant="p3" color="muted" numberOfLines={2}>
            {item.body}
          </Text>
        </Card>
      );
    },
    [iconColor],
  );

  return (
    <Screen
      title="Feed"
      description="Lista com TanStack Query + FlashList + skeleton."
      scrollable={false}
    >
      {isPending ? (
        <PostListSkeleton />
      ) : isError ? (
        <View style={styles.center}>
          <Text variant="p2" color="muted" align="center">
            Não foi possível carregar o feed.
          </Text>
          <Button variant="outline" onPress={() => refetch()}>
            Tentar novamente
          </Button>
        </View>
      ) : data.length === 0 ? (
        <Empty
          icon={Newspaper}
          title="Nenhum post"
          description="Quando houver conteúdo, ele aparece aqui."
        />
      ) : (
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.listContent}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ConfirmDialog
        visible={postToDelete !== null}
        onClose={() => setPostToDelete(null)}
        onConfirm={async () => {
          if (postToDelete) {
            await deleteMutation.mutateAsync(postToDelete.id);
          }
        }}
        title="Excluir post"
        description={
          postToDelete ? `Excluir "${postToDelete.title}"?` : undefined
        }
        confirmLabel="Excluir"
        destructive
      />
    </Screen>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(2),
  },
  listContent: {
    paddingBottom: theme.gap(11) + rt.insets.bottom,
  },
  separator: {
    height: theme.gap(1.5),
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
  },
  cardTitle: {
    flex: 1,
  },
}));
