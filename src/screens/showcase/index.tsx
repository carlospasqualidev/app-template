import { Screen } from "@/components/screen";

import { ButtonSection } from "./buttonSection";
import { FormSection } from "./formSection";
import { ModalSection } from "./modalSection";
import { ToastSection } from "./toastSection";
import { TypographySection } from "./typographySection";

export function ShowcaseScreen() {
  return (
    <Screen
      title="Componentes"
      description="Playground para implementar e testar os componentes do template."
    >
      <TypographySection />
      <ButtonSection />
      <FormSection />
      <ToastSection />
      <ModalSection />
    </Screen>
  );
}
