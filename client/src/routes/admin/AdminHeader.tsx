import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  fade
} from "@material-ui/core/styles";
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Paper,
  TextField,
  InputAdornment
} from "@material-ui/core";
import { useRouteMatch } from "react-router-dom";
import { RouteTabs } from "../../components/Tabs";
import SearchIcon from "@material-ui/icons/Search";
import { useIntl } from "react-intl";
import HeaderAction from "../../components/HeaderAction";
import Logo from "../../components/Logo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      justifyContent: "space-between"
    },
    actions: {
      display: "flex",
      alignItems: "center",
      flexWrap: "nowrap",
      "& > *": { margin: theme.spacing(1) }
    },
    searchInput: {
      padding: theme.spacing(0.2, 0.4),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      }
    },
    searchInputRoot: {
      color: "inherit"
    },
    searchInputInput: {
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: 120,
        "&:focus": {
          width: 200
        }
      }
    }
  })
);

interface Props {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
}

const AdminHeader: React.FC<Props> = ({ searchString, setSearchString }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  let { url } = useRouteMatch();

  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar} disableGutters>
          <Logo />
          <Box className={classes.actions}>
            <TextField
              className={classes.searchInput}
              placeholder={formatMessage({
                id: "SEARCH_EVENTS",
                defaultMessage: "Search events"
              })}
              InputProps={{
                disableUnderline: true,
                classes: {
                  root: classes.searchInputRoot,
                  input: classes.searchInputInput
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="inherit" />
                  </InputAdornment>
                )
              }}
              value={searchString}
              onChange={e => setSearchString(e.target.value)}
            />
            <HeaderAction />
          </Box>
        </Toolbar>
      </Container>
      <Paper elevation={0} square>
        <Container maxWidth="lg">
          <RouteTabs
            tabs={[
              {
                label: formatMessage({
                  id: "Events",
                  defaultMessage: "Events"
                }),
                to: `${url}/events`
              },
              {
                label: formatMessage({
                  id: "Analitics",
                  defaultMessage: "Analitics"
                }),
                to: `${url}/analytics`
              }
            ]}
            indicatorColor="primary"
            textColor="primary"
          />
        </Container>
      </Paper>
    </AppBar>
  );
};

export default AdminHeader;
