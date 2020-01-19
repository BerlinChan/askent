import { Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const SubTabs = withStyles({
  root: {
    minHeight: 38
  }
})(Tabs);

export const SubTab = withStyles({
  root: {
    minHeight: 38,
    minWidth: 120
  }
})(Tab);
