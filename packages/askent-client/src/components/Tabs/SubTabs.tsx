import React from "react";
import { Tabs, TabsProps } from "@mui/material";
import { withStyles, createStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

interface StyledTabsProps {
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

export const SubTabs = withStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: 38
    },
    indicator: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
      "& > div": {
        maxWidth: 80,
        width: "100%",
        backgroundColor: theme.palette.secondary.main
      }
    }
  })
)((props: StyledTabsProps & Omit<TabsProps, keyof StyledTabsProps>) => (
  <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />
));
