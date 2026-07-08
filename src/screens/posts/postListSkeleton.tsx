import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Card } from "@/components/card";
import { Skeleton } from "@/components/skeleton";

/** Reproduz o layout dos cards do feed enquanto os dados carregam. */
export function PostListSkeleton() {
  return (
    <View style={styles.list}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index}>
          <Skeleton width="70%" height={16} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="88%" height={12} />
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: {
    gap: theme.gap(1.5),
  },
}));
