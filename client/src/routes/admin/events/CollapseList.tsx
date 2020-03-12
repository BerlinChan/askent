import React from "react";
import { Box, Typography, Divider } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    collapseList: {},
    item: {
      marginBottom: theme.spacing(2)
    },
    title: {
      display: "flex",
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
  titleIcon: React.ReactElement;
  titleText: React.ReactElement;
  body: React.ReactElement;
};
interface Props {
  list: Array<CollapseItem>;
}

const CollapseList: React.ComponentType<Props> = ({ list }) => {
  const classes = useStyles();

  return (
    <Box className={classes.collapseList}>
      {list.map((item, index) => (
        <Box className={classes.item} key={index}>
          <Box className={classes.title}>
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
          </Box>
          <Box className={classes.body}>{item.body}</Box>
          <Divider />
        </Box>
      ))}
    </Box>
  );
};

export default CollapseList;
