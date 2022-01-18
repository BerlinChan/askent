import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useIntl, FormattedMessage } from "react-intl";
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { QuestionFilter, QuestionOrder } from "../../../../constant";
import QuestionOrderMenu from "../../../../components/QuestionOrderMenu";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import SortIcon from "@material-ui/icons/Sort";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterBox: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      width: 320,
      cursor: "pointer",
      padding: theme.spacing(0, 1),
      borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
      "& .arrowDown": { color: theme.palette.text.secondary },
    },
    filterMenuList: { width: 320 },
    searchAndSort: { display: "flex", alignItems: "center" },
    iconButton: { width: 38, height: 38, padding: 8 },
    searchInputRoot: { color: "inherit" },
    searchInputInput: {
      transition: theme.transitions.create("width"),
      [theme.breakpoints.up("sm")]: {
        width: 50,
        "&:focus": {
          width: 100,
        },
      },
    },
  })
);

const getQuestionFilterLabel = (value: QuestionFilter) => {
  switch (value) {
    case QuestionFilter.Publish:
      return <FormattedMessage id="Published" defaultMessage="Published" />;
    case QuestionFilter.Archive:
      return <FormattedMessage id="Archived" defaultMessage="Archived" />;
    case QuestionFilter.Starred:
      return <FormattedMessage id="Starred" defaultMessage="Starred" />;
  }
};
export type QuestionQueryStateType = {
  filter: QuestionFilter;
  searchString?: string;
  limit: number;
  offset: number;
};
interface Props {
  questionQueryState: [
    QuestionQueryStateType,
    React.Dispatch<React.SetStateAction<QuestionQueryStateType>>
  ];
  orderSelectedState: [
    QuestionOrder,
    React.Dispatch<React.SetStateAction<QuestionOrder>>
  ];
}

const ActionRight: React.FC<Props> = ({
  questionQueryState,
  orderSelectedState,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [filterAnchorEl, setFilterAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const orderMenuElState = React.useState<null | HTMLElement>(null);
  const [queryState, setQueryState] = questionQueryState;

  const handleFilterOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const handleFilterOptionClick = (value: QuestionFilter) => {
    setQueryState({
      ...queryState,
      filter: value,
    });
    handleFilterClose();
  };

  const handleSearchClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    searchRef.current?.focus();
  };
  const handleSearchClear = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setQueryState({ ...queryState, searchString: "" });
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryState({ ...queryState, searchString: event.target.value });
  };

  const handleOrderMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    orderMenuElState[1](event.currentTarget);
  };

  return (
    <React.Fragment>
      <Tooltip
        arrow
        placement="top"
        title={formatMessage({ id: "Filter", defaultMessage: "Filter" })}
      >
        <Box className={classes.filterBox} onClick={handleFilterOpen}>
          <ArrowDropDownIcon className="arrowDown" />
          <Typography variant="body1">
            {getQuestionFilterLabel(queryState.filter)}
          </Typography>
        </Box>
      </Tooltip>
      <Box className={classes.searchAndSort}>
        <TextField
          inputRef={searchRef}
          placeholder={formatMessage({
            id: "SEARCH",
            defaultMessage: "Search",
          })}
          InputProps={{
            disableUnderline: true,
            classes: {
              root: classes.searchInputRoot,
              input: classes.searchInputInput,
            },
            endAdornment: (
              <InputAdornment position="end">
                {queryState.searchString ? (
                  <IconButton
                    className={classes.iconButton}
                    onClick={handleSearchClear}
                  >
                    <ClearIcon color="inherit" fontSize="inherit" />
                  </IconButton>
                ) : (
                  <Tooltip
                    title={formatMessage({
                      id: "Search",
                      defaultMessage: "Search",
                    })}
                  >
                    <IconButton
                      className={classes.iconButton}
                      onClick={handleSearchClick}
                    >
                      <SearchIcon color="inherit" fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                )}
              </InputAdornment>
            ),
          }}
          value={queryState.searchString}
          onChange={handleSearchChange}
        />
        <Tooltip title={formatMessage({ id: "Sort", defaultMessage: "Sort" })}>
          <IconButton
            className={classes.iconButton}
            onClick={handleOrderMenuOpen}
          >
            <SortIcon color="inherit" fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        keepMounted
        classes={{ list: classes.filterMenuList }}
        anchorEl={filterAnchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        {Object.values(QuestionFilter)
          .filter((item) => item !== QuestionFilter.Review)
          .map((filterItem) => (
            <MenuItem
              key={filterItem}
              selected={filterItem === queryState.filter}
              onClick={(e) => handleFilterOptionClick(filterItem)}
            >
              {getQuestionFilterLabel(filterItem)}
            </MenuItem>
          ))}
      </Menu>
      <QuestionOrderMenu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        menuElState={orderMenuElState}
        orderSelectedState={orderSelectedState}
      />
    </React.Fragment>
  );
};

export default ActionRight;
