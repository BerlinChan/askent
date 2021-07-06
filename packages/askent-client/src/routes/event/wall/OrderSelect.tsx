import React from "react";
import { Typography, Fade } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { FormattedMessage } from "react-intl";
import { useMouseMove } from "../../../hooks";
import QuestionOrderMenu from "../../../components/QuestionOrderMenu";
import { QuestionOrder } from "../../../constant";

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
}

const OrderSelect: React.FC<Props> = ({ orderSelectedState }) => {
  const classes = useStyles();
  const menuElState = React.useState<null | HTMLElement>(null);
  const { mouseStop } = useMouseMove();

  const handleSortOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    menuElState[1](event.currentTarget);
  };

  return (
    <React.Fragment>
      <Typography className={classes.sortSelect} onClick={handleSortOpen}>
        <QuestionAnswerIcon className={classes.icon} />
        <FormattedMessage id="Top_questions" defaultMessage="Top questions" />
        totalCount
        <Fade in={!mouseStop}>
          <ArrowDropDownIcon className="arrowIcon" />
        </Fade>
      </Typography>

      <QuestionOrderMenu
        classes={{ menuItem: classes.menuItem }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        menuElState={menuElState}
        orderSelectedState={orderSelectedState}
      />
    </React.Fragment>
  );
};

export default OrderSelect;
