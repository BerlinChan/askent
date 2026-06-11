import React from "react";
import { DialogTitle, IconButton, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

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
    <DialogTitle className={classes.dialogTitle}>
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
