import React from "react";
import { Box, Typography, Menu, MenuItem } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { FormattedMessage, useIntl } from "react-intl";
import { QueryResult } from "@apollo/react-common";
import {
  WallQuestionsByEventQuery,
  WallQuestionsByEventQueryVariables
} from "../../../generated/graphqlHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sortSelectBox: {
      display: "flex",
      alignItems: "center"
    },
    select: {
      display: "inline",
      cursor: "pointer",
      marginLeft: theme.spacing(1)
    }
  })
);

enum TopSort {
  Popular,
  Recent,
  Oldest,
  Starred
}
interface Props {
  wallQuestionsResult: QueryResult<
    WallQuestionsByEventQuery,
    WallQuestionsByEventQueryVariables
  >;
}

const SortSelect: React.FC<Props> = ({ wallQuestionsResult }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [sortMenu, setSortMenu] = React.useState<{
    selected: TopSort;
    anchorEl: null | HTMLElement;
  }>({ selected: TopSort.Recent, anchorEl: null });
  const menuList = [
    {
      label: formatMessage({ id: "Popular", defaultMessage: "Popular" }),
      value: TopSort.Popular
    },
    {
      label: formatMessage({ id: "Recent", defaultMessage: "Recent" }),
      value: TopSort.Recent
    },
    {
      label: formatMessage({ id: "Oldest", defaultMessage: "Oldest" }),
      value: TopSort.Oldest
    },
    {
      label: formatMessage({ id: "Starred", defaultMessage: "Starred" }),
      value: TopSort.Starred
    }
  ];

  const handleSortOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortMenu({ ...sortMenu, anchorEl: event.currentTarget });
  };
  const handleSortChange = (selected: TopSort) => {
    setSortMenu({ selected, anchorEl: null });
  };
  const handleSortClose = () => {
    setSortMenu({ ...sortMenu, anchorEl: null });
  };

  return (
    <Box className={classes.sortSelectBox}>
      <QuestionAnswerIcon color="inherit" />
      <Typography
        variant="h6"
        color="inherit"
        className={classes.select}
        onClick={handleSortOpen}
      >
        <FormattedMessage id="Top_questions" defaultMessage="Top questions" />(
        {wallQuestionsResult.data?.wallQuestionsByEvent.totalCount})
      </Typography>

      <Menu
        anchorEl={sortMenu.anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        keepMounted
        open={Boolean(sortMenu.anchorEl)}
        onClose={handleSortClose}
      >
        {menuList.map(item => (
          <MenuItem
            key={item.value}
            selected={sortMenu.selected === item.value}
            onClick={() => handleSortChange(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SortSelect;
