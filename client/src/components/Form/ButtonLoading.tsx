import React from "react";
import { Button, CircularProgress, ButtonProps } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonWrapper: {
      position: "relative"
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    }
  })
);

interface Props {
  loading: boolean;
}

export const ButtonLoading: React.FC<Props & ButtonProps> = ({
  children,
  loading,
  ...props
}) => {
  const classes = useStyles();

  return (
    <div className={classes.buttonWrapper}>
      <Button disabled={loading || props.disabled} {...props}>
        {children}
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};
