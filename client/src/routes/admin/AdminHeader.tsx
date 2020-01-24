import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import {
  createStyles,
  makeStyles,
  Theme,
  fade
} from "@material-ui/core/styles";
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
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon
} from "@material-ui/core";
import { useRouteMatch } from "react-router-dom";
import { RouteTabs } from "../../components/Tabs";
import { useMeQuery } from "../../generated/graphqlHooks";
import SearchIcon from "@material-ui/icons/Search";
import { useIntl, FormattedMessage } from "react-intl";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { AUTH_TOKEN } from "../../constant";

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

interface Props {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
}

const AdminHeader: React.FC<Props> = ({ searchString, setSearchString }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  let { url } = useRouteMatch();
  const history = useHistory();
  const { data: userData } = useMeQuery();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

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
            <Box className={classes.userInfo}>
              <Typography className={classes.email}>
                {userData?.me.email}
              </Typography>
              <Typography className={classes.name}>
                {userData?.me.name}
              </Typography>
            </Box>

            <IconButton size="small" onClick={handleMenuOpen}>
              <Avatar>H</Avatar>
            </IconButton>
            <Menu
              keepMounted
              anchorEl={menuAnchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  localStorage.removeItem(AUTH_TOKEN);
                  history.replace("/");
                  handleMenuClose();
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <FormattedMessage id="Logout" defaultMessage="Logout" />
              </MenuItem>
            </Menu>
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
};

export default AdminHeader;
