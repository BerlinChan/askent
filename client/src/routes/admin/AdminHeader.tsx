import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Container,
  Box,
  Link,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  Avatar,
  Typography,
  TextField,
  InputAdornment
} from "@material-ui/core";
import { useRouteMatch } from "react-router-dom";
import { RouteTabs } from "../../components/Tabs";
import { useMeQuery } from "../../generated/graphqlHooks";
import SearchIcon from "@material-ui/icons/Search";
import { useIntl } from "react-intl";

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
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0.2, 0.4),
      backgroundColor: theme.palette.divider
    },
    userInfo: {},
    email: {
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightBold
    },
    name: {
      fontSize: theme.typography.pxToRem(14)
    }
  })
);

function AdminHeader() {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  let { url } = useRouteMatch();
  const { data: userData } = useMeQuery();

  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          <Link color="inherit" component={RouterLink} to="/" variant="h6">
            Askent
          </Link>
          <Box className={classes.actions}>
            <TextField
              className={classes.searchInput}
              placeholder={formatMessage({
                id: "SEARCH_EVENTS",
                defaultMessage: "Search events"
              })}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="inherit" />
                  </InputAdornment>
                )
              }}
            />
            <Link color="inherit" component={RouterLink} to="/admin">
              Admin
            </Link>
            <Box className={classes.userInfo}>
              <Typography className={classes.email}>
                {userData?.me.email}
              </Typography>
              <Typography className={classes.name}>
                {userData?.me.name}
              </Typography>
            </Box>

            <IconButton size="small">
              <Avatar>H</Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <Paper elevation={0} square>
        <Container maxWidth="lg">
          <RouteTabs
            tabs={[
              { label: "活动", to: `${url}/events` },
              { label: "分析", to: `${url}/analytics` }
            ]}
            indicatorColor="primary"
            textColor="primary"
          />
        </Container>
      </Paper>
    </AppBar>
  );
}

export default AdminHeader;
