import { Screen } from "@/components/screen";

import { TypographySection } from "./typographySection";

export function ShowcaseScreen() {
  return (
    <Screen
      title="Componentes"
      description="Playground para implementar e testar os componentes do template."
    >
      <TypographySection />
    </Screen>
  );
}
