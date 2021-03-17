import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel: React.FC<TabPanelProps> = props => {
  const { children, value, index } = props;

  return <React.Fragment>{value === index && children}</React.Fragment>;
};

export default TabPanel;
