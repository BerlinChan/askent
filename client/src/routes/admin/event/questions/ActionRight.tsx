import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useIntl } from "react-intl";
import { Box, IconButton, InputAdornment, TextField } from "@material-ui/core";
import { SubTabs, SubTab } from "../../../../components/Tabs";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import SortIcon from "@material-ui/icons/Sort";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchAndSort: {
      display: "flex",
      alignItems: "center"
    },
    iconButton: {
      width: 38,
      height: 38
    },
    searchInputRoot: {
      color: "inherit"
    },
    searchInputInput: {
      transition: theme.transitions.create("width"),
      [theme.breakpoints.up("sm")]: {
        width: 50,
        "&.active": {
          width: 100
        }
      }
    }
  })
);

interface Props {
  tabIndexState: [number, React.Dispatch<React.SetStateAction<number>>];
  searchState: [
    {
      value: string;
      active: boolean;
    },
    React.Dispatch<
      React.SetStateAction<{
        value: string;
        active: boolean;
      }>
    >
  ];
}

const ActionRight: React.FC<Props> = ({ tabIndexState, searchState }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [tabIndex, setTabIndex] = tabIndexState;
  const [searchInput, setSearchInput] = searchState;
  const searchRef = React.useRef<HTMLInputElement>(null);

  const handleTabsChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleSearchFocus = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRef.current?.focus();
    setSearchInput({ ...searchInput, active: true });
  };
  const handleSearchClear = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSearchInput({ value: "", active: false });
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput({ ...searchInput, value: event.target.value });
  };

  return (
    <React.Fragment>
      {searchInput.active ? (
        <div />
      ) : (
        <SubTabs value={tabIndex} onChange={handleTabsChange}>
          <SubTab
            label={formatMessage({
              id: "Live",
              defaultMessage: "Live"
            })}
          />
          <SubTab
            label={formatMessage({
              id: "Archive",
              defaultMessage: "Archive"
            })}
          />
        </SubTabs>
      )}
      <Box className={classes.searchAndSort}>
        <TextField
          inputRef={searchRef}
          placeholder={formatMessage({
            id: "SEARCH",
            defaultMessage: "Search"
          })}
          InputProps={{
            disableUnderline: true,
            classes: {
              root: classes.searchInputRoot,
              input:
                classes.searchInputInput + (searchInput.active ? " active" : "")
            },
            endAdornment: (
              <InputAdornment position="end">
                {searchInput.active ? (
                  <IconButton
                    className={classes.iconButton}
                    onClick={handleSearchClear}
                  >
                    <ClearIcon color="inherit" fontSize="inherit" />
                  </IconButton>
                ) : (
                  <IconButton
                    className={classes.iconButton}
                    onClick={handleSearchFocus}
                  >
                    <SearchIcon color="inherit" fontSize="inherit" />
                  </IconButton>
                )}
              </InputAdornment>
            )
          }}
          value={searchInput.value}
          onFocus={handleSearchFocus}
          onChange={handleSearchChange}
        />
        <IconButton className={classes.iconButton}>
          <SortIcon color="inherit" fontSize="inherit" />
        </IconButton>
      </Box>
    </React.Fragment>
  );
};

export default ActionRight;
