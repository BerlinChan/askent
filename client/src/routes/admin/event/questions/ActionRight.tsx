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

export const questionFilterOptions: Array<{
  label: React.ReactElement;
  value: ReviewStatus | QuestionFilter;
}> = [
  {
    label: <FormattedMessage id="Published" defaultMessage="Published" />,
    value: ReviewStatus.Publish
  },
  {
    label: <FormattedMessage id="Archived" defaultMessage="Archived" />,
    value: ReviewStatus.Archive
  },
  {
    label: <FormattedMessage id="Starred" defaultMessage="Starred" />,
    value: QuestionFilter.Starred
  }
];
export const questionOrderOptions: Array<{
  label: React.ReactElement;
  value: QuestionOrder;
}> = [
  {
    label: <FormattedMessage id="Popular" defaultMessage="Popular" />,
    value: QuestionOrder.Popular
  },
  {
    label: <FormattedMessage id="Recent" defaultMessage="Recent" />,
    value: QuestionOrder.Recent
  },
  {
    label: <FormattedMessage id="Oldest" defaultMessage="Oldest" />,
    value: QuestionOrder.Oldest
  }
];
export type QuestionQueryStateType = {
  filterOptionIndexes: Array<number>;
  searchString: string;
  orderOptionIndex: number;
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
  const handleFilterOptionClick = (index: number) => {
    setQueryState({
      ...queryState,
      filterOptionIndexes: queryState.filterOptionIndexes.includes(index)
        ? queryState.filterOptionIndexes.filter(item => item !== index)
        : queryState.filterOptionIndexes.concat([index])
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
  const handleSortOptionClick = (index: number) => {
    setQueryState({
      ...queryState,
      orderOptionIndex: index
    });
    setSortAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box className={classes.filterBox} onClick={handleFilterOpen}>
        <Typography className={classes.totalCount} color="textSecondary">
          {questionsQueryResult.data?.questionsByEvent.totalCount}
        </Typography>
        {queryState.filterOptionIndexes.map(filterIndex => (
          <Chip
            className={classes.chip}
            key={filterIndex}
            size="small"
            label={questionFilterOptions[filterIndex].label}
            onDelete={
              queryState.filterOptionIndexes.length > 1
                ? () => handleFilterOptionClick(filterIndex)
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
                    {questionFilterOptions.map((optionItem, index) => (
                      <MenuItem
                        key={index}
                        disabled={
                          queryState.filterOptionIndexes[0] === index &&
                          queryState.filterOptionIndexes.length <= 1
                        }
                        onClick={e => handleFilterOptionClick(index)}
                      >
                        <Checkbox
                          checked={queryState.filterOptionIndexes.includes(
                            index
                          )}
                        />
                        <ListItemText primary={optionItem.label} />
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
          {questionOrderOptions.map((optionItem, index) => (
            <MenuItem
              key={index}
              selected={queryState.orderOptionIndex === index}
              onClick={e => handleSortOptionClick(index)}
            >
              {optionItem.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </React.Fragment>
  );
};

export default ActionRight;
