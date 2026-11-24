import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Switch } from "@/components/form";
import { Text } from "@/components/text";

interface IProfileMenuItemBaseProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  destructive?: boolean;
}

interface IProfileMenuLinkProps extends IProfileMenuItemBaseProps {
  onPress: () => void;
  /** Valor atual exibido antes da seta (ex.: "Automático"). */
  value?: string;
  /** Esconde a seta quando a linha é uma ação, não uma navegação (ex.: sair). */
  showChevron?: boolean;
}

interface IProfileMenuToggleProps extends IProfileMenuItemBaseProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export type ProfileMenuItemProps =
  IProfileMenuLinkProps | IProfileMenuToggleProps;

function isToggle(
  props: ProfileMenuItemProps,
): props is IProfileMenuToggleProps {
  return "checked" in props;
}

/**
 * Linha do menu de perfil: ícone, rótulo, descrição opcional e, à direita,
 * a seta de navegação (com valor atual) ou um interruptor. A linha inteira
 * é o alvo de toque; no interruptor, o toque na linha alterna o valor.
 */
export function ProfileMenuItem(props: ProfileMenuItemProps) {
  const { theme } = useUnistyles();
  const { icon: Icon, label, description, destructive = false } = props;
  styles.useVariants({ destructive });

  const iconColor = destructive ? theme.colors.destructive : theme.colors.brand;
  const toggle = isToggle(props);

  return (
    <Pressable
      accessibilityRole={toggle ? "switch" : "button"}
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={toggle ? { checked: props.checked } : undefined}
      onPress={
        toggle ? () => props.onCheckedChange(!props.checked) : props.onPress
      }
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.iconBubble}>
        <Icon size={20} color={iconColor} />
      </View>

      <View style={styles.texts}>
        <Text variant="p2" weight="medium" style={styles.label}>
          {label}
        </Text>
        {description ? (
          <Text variant="p3" color="muted">
            {description}
          </Text>
        ) : null}
      </View>

      {toggle ? (
        // O papel de interruptor já está na linha; o leitor de tela não
        // precisa anunciar o controle de novo.
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Switch value={props.checked} onValueChange={props.onCheckedChange} />
        </View>
      ) : (
        <>
          {props.value ? (
            <Text variant="p3" color="muted">
              {props.value}
            </Text>
          ) : null}
          {props.showChevron === false ? null : (
            <ChevronRight size={18} color={theme.colors.textMuted} />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1.5),
    minHeight: 56,
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1.5),
  },
  pressed: {
    backgroundColor: theme.colors.secondary,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brandSubtle,
    variants: {
      destructive: {
        true: { backgroundColor: theme.colors.secondary },
      },
    },
  },
  texts: {
    flex: 1,
  },
  label: {
    variants: {
      destructive: {
        true: { color: theme.colors.destructive },
      },
    },
  },
}));
