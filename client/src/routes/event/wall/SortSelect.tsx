import React from "react";
import { Typography, Menu, MenuItem, Fade } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { FormattedMessage } from "react-intl";
import { QueryResult } from "@apollo/react-common";
import {
  QuestionsByEventWallQuery,
  QuestionsByEventWallQueryVariables,
  QuestionFilter,
  QuestionOrder
} from "../../../generated/graphqlHooks";
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

const menuList: Array<{
  label: React.ReactElement;
  value: QuestionFilter | QuestionOrder;
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
  },
  {
    label: <FormattedMessage id="Starred" defaultMessage="Starred" />,
    value: QuestionFilter.Starred
  }
];
interface Props {
  orderSelectedState: [
    QuestionFilter | QuestionOrder,
    React.Dispatch<React.SetStateAction<QuestionFilter | QuestionOrder>>
  ];
  questionsWallQueryResult: QueryResult<
    QuestionsByEventWallQuery,
    QuestionsByEventWallQueryVariables
  >;
}

const SortSelect: React.FC<Props> = ({
  orderSelectedState,
  questionsWallQueryResult
}) => {
  const classes = useStyles();
  const { data } = questionsWallQueryResult;
  const [orderSelected, setOrderSelected] = orderSelectedState;
  const [sortEl, setSortEl] = React.useState<null | HTMLElement>(null);
  const { mouseStop } = useMouseMove();

  const handleSortOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortEl(event.currentTarget);
  };
  const handleSortClose = () => {
    setSortEl(null);
  };
  const handleSortChange = (selected: QuestionFilter | QuestionOrder) =>
    setOrderSelected(selected);

  return (
    <React.Fragment>
      <Typography className={classes.sortSelect} onClick={handleSortOpen}>
        <QuestionAnswerIcon className={classes.icon} />
        <FormattedMessage id="Top_questions" defaultMessage="Top questions" />(
        {data?.questionsByEventWall.totalCount})
        <Fade in={!mouseStop}>
          <ArrowDropDownIcon className="arrowIcon" />
        </Fade>
      </Typography>

      <Menu
        anchorEl={sortEl}
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
        open={Boolean(sortEl)}
        onClose={handleSortClose}
      >
        {menuList.map(item => (
          <MenuItem
            className={classes.menuItem}
            key={item.value}
            selected={orderSelected === item.value}
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
