import { Text } from "@/components/text";
import { env } from "@/lib/env";

/**
 * Marca da aplicação como wordmark na cor da marca. Placeholder genérico do
 * template (usa o nome do projeto) — troque por uma imagem/SVG do logo real.
 */
export function BrandLogo() {
  return (
    <Text variant="h1" color="brand" weight="bold">
      {env.EXPO_PUBLIC_PROJECT_NAME}
    </Text>
  );
}
