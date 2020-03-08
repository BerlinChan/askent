import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useIntl, FormattedMessage } from "react-intl";
import {
  Box,
  Chip,
  Grow,
  Paper,
  Popper,
  Menu,
  MenuList,
  MenuItem,
  Checkbox,
  ListItemText,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  ClickAwayListener
} from "@material-ui/core";
import { QueryResult } from "@apollo/react-common";
import {
  ReviewStatus,
  QuestionFilter,
  QuestionOrder,
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables
} from "../../../../generated/graphqlHooks";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import SortIcon from "@material-ui/icons/Sort";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterBox: {
      display: "flex",
      alignItems: "center",
      width: 320,
      cursor: "pointer",
      height: "100%",
      overflowX: "hidden",
      borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[1]
    },
    totalCount: { margin: theme.spacing(0, 1) },
    chip: { marginRight: theme.spacing(1) },
    filterMenu: {
      width: 320
    },
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
        "&:focus": {
          width: 100
        }
      }
    }
  })
);

export const getQuestionFilterLabel = (
  value: ReviewStatus | QuestionFilter
) => {
  switch (value) {
    case ReviewStatus.Publish:
      return <FormattedMessage id="Published" defaultMessage="Published" />;
    case ReviewStatus.Archive:
      return <FormattedMessage id="Archived" defaultMessage="Archived" />;
    case QuestionFilter.Starred:
      return <FormattedMessage id="Starred" defaultMessage="Starred" />;
  }
};
export const getQuestionOrderLabel = (value: QuestionOrder) => {
  switch (value) {
    case QuestionOrder.Popular:
      return <FormattedMessage id="Popular" defaultMessage="Popular" />;
    case QuestionOrder.Recent:
      return <FormattedMessage id="Recent" defaultMessage="Recent" />;
    case QuestionOrder.Oldest:
      return <FormattedMessage id="Oldest" defaultMessage="Oldest" />;
  }
};
export type QuestionQueryStateType = {
  filterSelected: Array<QuestionFilter>;
  searchString: string;
  orderSelected: QuestionOrder;
};
interface Props {
  questionQueryState: [
    QuestionQueryStateType,
    React.Dispatch<React.SetStateAction<QuestionQueryStateType>>
  ];
  questionsQueryResult: QueryResult<
    QuestionsByEventQuery,
    QuestionsByEventQueryVariables
  >;
}

const ActionRight: React.FC<Props> = ({
  questionQueryState,
  questionsQueryResult
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [
    filterAnchorEl,
    setFilterAnchorEl
  ] = React.useState<null | HTMLElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
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
      filterSelected: queryState.filterSelected.includes(value)
        ? queryState.filterSelected.filter(item => item !== value)
        : queryState.filterSelected.concat([value])
    });
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

  const handleSortOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };
  const handleSortClose = () => {
    setSortAnchorEl(null);
  };
  const handleSortOptionClick = (value: QuestionOrder) => {
    setQueryState({
      ...queryState,
      orderSelected: value
    });
    setSortAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box className={classes.filterBox} onClick={handleFilterOpen}>
        <Typography className={classes.totalCount} color="textSecondary">
          {questionsQueryResult.data?.questionsByEvent.totalCount}
        </Typography>
        {queryState.filterSelected.map((selectedItem, index) => (
          <Chip
            className={classes.chip}
            key={index}
            size="small"
            label={getQuestionFilterLabel(selectedItem)}
            onDelete={
              queryState.filterSelected.length > 1
                ? () => handleFilterOptionClick(selectedItem)
                : undefined
            }
          />
        ))}

        <Popper
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          placement="bottom-start"
          transition
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: "left top"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleFilterClose}>
                  <MenuList
                    className={classes.filterMenu}
                    autoFocusItem={Boolean(filterAnchorEl)}
                  >
                    {Object.values(QuestionFilter)
                      .filter(item => item !== QuestionFilter.Review)
                      .map((filterItem, index) => (
                        <MenuItem
                          key={index}
                          disabled={
                            queryState.filterSelected[0] === filterItem &&
                            queryState.filterSelected.length <= 1
                          }
                          onClick={e => handleFilterOptionClick(filterItem)}
                        >
                          <Checkbox
                            checked={queryState.filterSelected.includes(
                              filterItem
                            )}
                          />
                          <ListItemText
                            primary={getQuestionFilterLabel(filterItem)}
                          />
                        </MenuItem>
                      ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
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
              input: classes.searchInputInput
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
                      defaultMessage: "Search"
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
            )
          }}
          value={queryState.searchString}
          onChange={handleSearchChange}
        />
        <Tooltip title={formatMessage({ id: "Sort", defaultMessage: "Sort" })}>
          <IconButton className={classes.iconButton} onClick={handleSortOpen}>
            <SortIcon color="inherit" fontSize="inherit" />
          </IconButton>
        </Tooltip>

        <Menu
          keepMounted
          anchorEl={sortAnchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={Boolean(sortAnchorEl)}
          onClose={handleSortClose}
        >
          {Object.values(QuestionOrder).map((orderItem, index) => (
            <MenuItem
              key={index}
              selected={queryState.orderSelected === orderItem}
              onClick={e => handleSortOptionClick(orderItem)}
            >
              {getQuestionOrderLabel(orderItem)}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </React.Fragment>
  );
};

export default ActionRight;
