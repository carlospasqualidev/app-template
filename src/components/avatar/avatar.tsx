import { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/text";
import { getInitials } from "@/lib/getInitials";

export interface IAvatarProps {
  name: string;
  uri?: string | null;
  size?: number;
}

export function Avatar({ name, uri, size = 40 }: IAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(uri) && !failed;
  const initials = getInitials(name);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: uri ?? undefined }}
          style={styles.image}
          contentFit="cover"
          transition={150}
          onError={() => setFailed(true)}
        />
      ) : (
        <Text
          weight="semibold"
          style={[styles.initials, { fontSize: size * 0.4 }]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: theme.colors.brandSubtle,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    color: theme.colors.brand,
  },
}));
