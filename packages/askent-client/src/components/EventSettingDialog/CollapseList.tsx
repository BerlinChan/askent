import React from "react";
import { Box, Typography, Divider, Collapse } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    collapseList: {},
    item: {
      marginBottom: theme.spacing(2)
    },
    head: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer"
    },
    title: {
      display: "flex",
      alignItems: "center",
      color: theme.palette.primary.main
    },
    titleText: {
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.spacing(1)
    },
    body: { paddingLeft: 32, marginBottom: theme.spacing(2) }
  })
);

type CollapseItem = {
  key: React.Key;
  titleIcon: React.ReactElement;
  titleText: React.ReactElement;
  body: React.ReactElement;
};
interface Props {
  list: Array<CollapseItem>;
  defaultActiveKey?: Array<number>;
}

const CollapseList: React.FC<Props> = ({ list, defaultActiveKey = [] }) => {
  const classes = useStyles();
  const [activeKey, setActiveKey] = React.useState<Array<number>>(
    defaultActiveKey
  );

  const handleToggle = (index: number) => {
    setActiveKey(
      activeKey.includes(index)
        ? activeKey.filter(item => item !== index)
        : activeKey.concat([index])
    );
  };

  return (
    <Box className={classes.collapseList}>
      {list.map((item, index) => (
        <Box className={classes.item} key={item.key}>
          <Box className={classes.head} onClick={e => handleToggle(index)}>
            <div className={classes.title}>
              {React.cloneElement(item.titleIcon, {
                color: "inherit"
              })}
              <Typography
                variant="h6"
                color="inherit"
                className={classes.titleText}
              >
                {item.titleText}
              </Typography>
            </div>
            {activeKey.includes(index) ? (
              <ExpandLessIcon color="inherit" fontSize="small" />
            ) : (
              <ExpandMoreIcon color="inherit" fontSize="small" />
            )}
          </Box>
          <Collapse className={classes.body} in={activeKey.includes(index)}>
            {item.body}
          </Collapse>
          <Divider />
        </Box>
      ))}
    </Box>
  );
};

export default CollapseList;
