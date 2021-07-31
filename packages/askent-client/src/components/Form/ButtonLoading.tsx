import React from "react";
import { Button, CircularProgress, ButtonProps } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonWrapper: {
      position: "relative",
      "&.fullWidth": { width: "100%" }
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
  fullWidth?: boolean;
}

export const ButtonLoading: React.FC<Props & ButtonProps> = ({
  children,
  loading,
  fullWidth = false,
  ...props
}) => {
  const classes = useStyles();

  return (
    <div className={classes.buttonWrapper + (fullWidth ? " fullWidth" : "")}>
      <Button
        disabled={loading || props.disabled}
        fullWidth={fullWidth}
        {...props}
      >
        {children}
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};
