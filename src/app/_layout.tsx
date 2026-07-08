import { Blocks, Compass, User } from "lucide-react-native";

import { TabBar, type ITab } from "@/components/tabBar";

const tabs: ITab[] = [
  { name: "index", href: "/", label: "Componentes", icon: Blocks },
  { name: "explore", href: "/explore", label: "Buscar", icon: Compass },
  { name: "profile", href: "/profile", label: "Perfil", icon: User },
];

export default function RootLayout() {
  return <TabBar tabs={tabs} />;
}
