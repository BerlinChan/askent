import React from "react";
import { DialogTitle, IconButton, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  })
);

interface Props {
  title: React.ReactElement | string;
  onClose: () => void;
}

const DialogTitleWithClose: React.FC<Props> = ({ title, onClose }) => {
  const classes = useStyles();

  return (
    <DialogTitle disableTypography className={classes.dialogTitle}>
      <Typography variant="subtitle1" color="textSecondary">
        {title}
      </Typography>
      <IconButton onClick={onClose} size="small">
        <CloseIcon color="inherit" fontSize="small" />
      </IconButton>
    </DialogTitle>
  );
};

export default DialogTitleWithClose;
