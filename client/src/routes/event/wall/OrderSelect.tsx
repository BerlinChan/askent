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
  QuestionOrder
} from "../../../generated/graphqlHooks";
import { useMouseMove } from "../../../hooks";
import { getQuestionOrderLabel } from "../../admin/event/questions/ActionRight";

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

interface Props {
  orderSelectedState: [
    QuestionOrder,
    React.Dispatch<React.SetStateAction<QuestionOrder>>
  ];
  questionsWallQueryResult: QueryResult<
    QuestionsByEventWallQuery,
    QuestionsByEventWallQueryVariables
  >;
}

const OrderSelect: React.FC<Props> = ({
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
  const handleSortChange = (selected: QuestionOrder) => {
    setOrderSelected(selected);
    handleSortClose();
  };

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
        {Object.values(QuestionOrder).map(item => (
          <MenuItem
            className={classes.menuItem}
            key={item}
            selected={orderSelected === item}
            onClick={() => handleSortChange(item)}
          >
            {getQuestionOrderLabel(item)}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export default OrderSelect;
