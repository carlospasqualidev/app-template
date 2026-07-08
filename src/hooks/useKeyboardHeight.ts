import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

/**
 * Altura atual do teclado (0 quando fechado). Usado para ancorar superfícies
 * acima do teclado — o `Modal` nativo no Android não respeita o resize da janela.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) =>
      setHeight(event.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(hideEvent, () => setHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return height;
}
