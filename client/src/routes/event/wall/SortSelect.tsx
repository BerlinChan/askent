import React from "react";
import { Typography, Menu, MenuItem, Fade } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { FormattedMessage, useIntl } from "react-intl";
import { QueryResult } from "@apollo/react-common";
import { QueryLazyOptions } from "@apollo/react-hooks";
import {
  WallQuestionsByEventQuery,
  WallQuestionsByEventQueryVariables,
  OrderByArg
} from "../../../generated/graphqlHooks";
import { useParams } from "react-router-dom";
import { DEFAULT_PAGE_FIRST, DEFAULT_PAGE_SKIP } from "../../../constant";
import { useMouseMove } from "../../../hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sortSelect: {
      display: "inline-flex",
      alignItems: "center",
      cursor: "pointer",
      color: "inherit",
      marginLeft: theme.spacing(1),
      fontSize: theme.typography.pxToRem(18),
      "& .arrowIcon": {
        color: "inherit",
        fontSize: theme.typography.pxToRem(16)
      }
    },
    icon: {
      color: "inherit",
      fontSize: theme.typography.pxToRem(18),
      marginRight: theme.typography.pxToRem(4)
    },
    menuItem: {
      width: theme.typography.pxToRem(180)
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
  wallQuestionsByEventLazyQuery: (
    options?: QueryLazyOptions<WallQuestionsByEventQueryVariables> | undefined
  ) => void;
  wallQuestionsResult: QueryResult<
    WallQuestionsByEventQuery,
    WallQuestionsByEventQueryVariables
  >;
}

const SortSelect: React.FC<Props> = ({
  wallQuestionsByEventLazyQuery,
  wallQuestionsResult
}) => {
  const classes = useStyles();
  const { id } = useParams();
  const { formatMessage } = useIntl();
  const { data } = wallQuestionsResult;
  const [sortMenu, setSortMenu] = React.useState<{
    selected: TopSort;
    anchorEl: null | HTMLElement;
  }>({ selected: TopSort.Recent, anchorEl: null });
  const { mouseStop } = useMouseMove();
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
    wallQuestionsByEventLazyQuery({
      variables: {
        eventId: id as string,
        star: selected === TopSort.Starred ? true : undefined,
        pagination: { first: DEFAULT_PAGE_FIRST, skip: DEFAULT_PAGE_SKIP },
        orderBy:
          selected === TopSort.Recent
            ? { createdAt: OrderByArg.Desc }
            : selected === TopSort.Oldest
            ? { createdAt: OrderByArg.Asc }
            : selected === TopSort.Starred
            ? { createdAt: OrderByArg.Desc }
            : selected === TopSort.Popular // TODO: cant orderBy voteCount
            ? {}
            : {}
      }
    });
    setSortMenu({ selected, anchorEl: null });
  };
  const handleSortClose = () => {
    setSortMenu({ ...sortMenu, anchorEl: null });
  };

  return (
    <React.Fragment>
      <Typography className={classes.sortSelect} onClick={handleSortOpen}>
        <QuestionAnswerIcon className={classes.icon} />
        <FormattedMessage id="Top_questions" defaultMessage="Top questions" />(
        {data?.wallQuestionsByEvent.totalCount})
        <Fade in={!mouseStop}>
          <ArrowDropDownIcon className="arrowIcon" />
        </Fade>
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
            className={classes.menuItem}
            key={item.value}
            selected={sortMenu.selected === item.value}
            onClick={() => handleSortChange(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export default SortSelect;
