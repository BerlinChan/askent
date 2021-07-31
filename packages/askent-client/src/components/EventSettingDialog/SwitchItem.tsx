import React from "react";
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    switchItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  })
);

interface Props {
  label: React.ReactElement;
  description: React.ReactElement;
  switchField: React.ReactElement;
}

const SwitchItem: React.FC<Props> = ({
  label,
  description,
  switchField
}) => {
  const classes = useStyles();

  return (
    <div className={classes.switchItem}>
      <div>
        <Typography variant="body1">{label}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </div>
      {switchField}
    </div>
  );
};

export default SwitchItem;
