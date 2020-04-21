import React from "react";
import { FormattedMessage } from "react-intl";
import TabPanelGeneral from "./TabPanelGeneral";
import TabPanelFeatures from "./TabPanelFeatures";
import TabPanelGuestes from "./TabPanelGuestes";
import { EventSettingValues } from "../index";

export const tabList = [
  <FormattedMessage id="General" defaultMessage="General" />,
  <FormattedMessage id="Guestes" defaultMessage="Guestes" />,
  <FormattedMessage id="Features" defaultMessage="Features" />,
  <FormattedMessage id="Customization" defaultMessage="Customization" />,
  <FormattedMessage id="Integrations" defaultMessage="Integrations" />,
  <FormattedMessage id="Share_access" defaultMessage="Share access" />,
];

interface Props {
  index: number;
  defaultFocus?: keyof EventSettingValues;
  eventId: string;
}

export const TabPanel: React.FC<Props> = ({
  index,
  defaultFocus = "name",
  eventId,
}) => {
  const TabPanelList = [
    <TabPanelGeneral defaultFocus={defaultFocus} />,
    <TabPanelGuestes eventId={eventId} />,
    <TabPanelFeatures />,
    <div>Item Customization</div>,
    <div>Item Integrations</div>,
    <div>Item Share_access</div>,
  ];

  return TabPanelList[index];
};
