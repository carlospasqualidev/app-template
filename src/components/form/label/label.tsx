import { type ReactNode } from "react";

import { Text } from "@/components/text";

interface ILabelProps {
  children: ReactNode;
}

export function Label({ children }: ILabelProps) {
  return (
    <Text variant="p3" weight="medium">
      {children}
    </Text>
  );
}
