import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listFooter: {
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(2),
      color: theme.palette.text.secondary
    }
  })
);

interface Props {
  loading?: boolean;
  hasNextPage?: boolean;
}

const ListFooter: React.FC<Props> = ({
  loading = false,
  hasNextPage = false
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.listFooter}>
      {loading ? (
        <CircularProgress size={24} />
      ) : hasNextPage ? (
        <FormattedMessage id="More" defaultMessage="More" />
      ) : (
        <FormattedMessage id="End" defaultMessage="End" />
      )}
    </Box>
  );
};

export default ListFooter;
