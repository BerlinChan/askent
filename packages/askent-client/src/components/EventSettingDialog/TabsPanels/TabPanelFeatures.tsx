import React from "react";
import { FormattedMessage } from "react-intl";
import { Field } from "formik";
import { Switch } from "formik-material-ui";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import CollapseList from "../CollapseList";
import SwitchItem from "../SwitchItem";

interface Props {}

const TabPanelFeatures: React.FC<Props> = () => {
  return (
    <CollapseList
      list={[
        {
          key: "audienceQA",
          titleIcon: <QuestionAnswerIcon />,
          titleText: (
            <FormattedMessage id="Audience_Q&A" defaultMessage="Audience Q&A" />
          ),
          body: (
            <React.Fragment>
              <SwitchItem
                label={
                  <FormattedMessage
                    id="Moderation"
                    defaultMessage="Moderation"
                  />
                }
                description={
                  <FormattedMessage
                    id="Easily review all questions before they go live."
                    defaultMessage="Easily review all questions before they go live."
                  />
                }
                switchField={
                  <Field component={Switch} type="checkbox" name="moderation" />
                }
              />
            </React.Fragment>
          ),
        },
      ]}
    />
  );
};

export default TabPanelFeatures;
