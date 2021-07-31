import React from "react";
import { Tab, TabProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const SubTab = withStyles({
  root: {
    minHeight: 38,
    minWidth: 120
  }
})((props: TabProps) => <Tab {...props} disableRipple />);
