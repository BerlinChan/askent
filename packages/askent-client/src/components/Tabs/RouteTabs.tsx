import React from "react";
import { useHistory, useLocation } from "react-router-dom";
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
  let { pathname } = useLocation();
  const history = useHistory();

  const getTabsValue = () => {
    const findIndex = tabs.findIndex(tabItem => tabItem.to === pathname);
    return findIndex < 0 ? 0 : findIndex;
  };

  return (
    <Tabs
      value={getTabsValue()}
      onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
        history.replace(tabs[newValue].to);
      }}
      {...props}
    >
      {tabs.map((tabItem, index) => (
        <Tab
          key={index}
          label={tabItem.label}
          icon={tabItem.icon}
          classes={tabClasses}
        />
      ))}
    </Tabs>
  );
};
