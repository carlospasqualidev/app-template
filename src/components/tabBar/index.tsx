import { BlurTargetView } from "expo-blur";
import { type Href } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { useRef } from "react";
import { type View } from "react-native";

import { TabBarBase } from "./tabBar";
import { type IconComponent, TabBarButton } from "./tabBarButton";

export interface ITab {
  name: string;
  href: Href;
  label: string;
  icon: IconComponent;
}

interface ITabBarProps {
  tabs: ITab[];
}

export function TabBar({ tabs }: ITabBarProps) {
  const blurTarget = useRef<View>(null);

  return (
    <Tabs>
      <BlurTargetView ref={blurTarget} style={{ flex: 1 }}>
        <TabSlot />
      </BlurTargetView>
      <TabList asChild>
        <TabBarBase blurTarget={blurTarget}>
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabBarButton icon={tab.icon} label={tab.label} />
            </TabTrigger>
          ))}
        </TabBarBase>
      </TabList>
    </Tabs>
  );
}
