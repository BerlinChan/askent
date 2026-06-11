import React from "react";
import { Tab, TabProps } from "@mui/material";
import { withStyles } from "@mui/styles";

export const SubTab = withStyles({
  root: {
    minHeight: 38,
    minWidth: 120
  }
})((props: TabProps) => <Tab {...props} disableRipple />);
