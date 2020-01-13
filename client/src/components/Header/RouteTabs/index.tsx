import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { TabsProps, Tabs, Tab } from "@material-ui/core";

interface Props {
  tabs: Array<{ label: string; to: string }>;
}

const RouteTabs: React.FC<Props & Partial<TabsProps>> = ({
  tabs,
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
        <Tab label={tabItem.label} key={index} />
      ))}
    </Tabs>
  );
};

export default RouteTabs;
