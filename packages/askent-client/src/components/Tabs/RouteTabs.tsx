import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TabsProps, Tabs, Tab, TabClassKey } from "@material-ui/core";

interface Props {
  tabs: Array<{
    label: React.ReactNode;
    to: string;
    icon?: string | React.ReactElement;
  }>;
  tabClasses?: Partial<Record<TabClassKey, string>> | undefined;
}

export const RouteTabs: React.FC<Props & Partial<TabsProps>> = ({
  tabs,
  tabClasses,
  ...props
}) => {
  let { "*": routeName } = useParams();
  const navigate = useNavigate();

  const getTabsValue = () => {
    const findIndex = tabs.findIndex((tabItem) => tabItem.to === routeName);
    return findIndex < 0 ? 0 : findIndex;
  };

  return (
    <Tabs
      value={getTabsValue()}
      onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
        navigate(tabs[newValue].to);
      }}
      {...props}
    >
      {tabs.map((tabItem) => (
        <Tab
          key={tabItem.to}
          label={tabItem.label}
          icon={tabItem.icon}
          classes={tabClasses}
        />
      ))}
    </Tabs>
  );
};
