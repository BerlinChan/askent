import React from "react";
import { FormattedMessage } from "react-intl";
import TabPanelGeneral from "./TabPanelGeneral";
import TabPanelFeatures from "./TabPanelFeatures";
import { EventSettingValues } from "../index";

export const tabList = [
  <FormattedMessage id="General" defaultMessage="General" />,
  <FormattedMessage id="Features" defaultMessage="Features" />,
  <FormattedMessage id="Customization" defaultMessage="Customization" />,
  <FormattedMessage id="Integrations" defaultMessage="Integrations" />,
  <FormattedMessage id="Share_access" defaultMessage="Share access" />
];

interface Props {
  index: number;
  defaultFocus?: keyof EventSettingValues;
}

export const TabPanel: React.FC<Props> = ({ index, defaultFocus = "name" }) => {
  const TabPanelList = [
    <TabPanelGeneral defaultFocus={defaultFocus} />,
    <TabPanelFeatures />,
    <div>Item Three</div>,
    <div>Item Four</div>,
    <div>Item Five</div>
  ];

  return TabPanelList[index];
};
