import React from "react";
import { Menu, MenuItem, PopoverOrigin } from "@material-ui/core";
import { QuestionOrder } from "../../constant";
import { FormattedMessage } from "react-intl";

export const getQuestionOrderLabel = (value: QuestionOrder) => {
  switch (value) {
    case QuestionOrder.Popular:
      return <FormattedMessage id="Popular" defaultMessage="Popular" />;
    case QuestionOrder.Recent:
      return <FormattedMessage id="Recent" defaultMessage="Recent" />;
    case QuestionOrder.Oldest:
      return <FormattedMessage id="Oldest" defaultMessage="Oldest" />;
    case QuestionOrder.Starred:
      return <FormattedMessage id="Starred" defaultMessage="Starred" />;
  }
};

interface Props {
  classes?: { menuItem?: string };
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  menuElState: [
    HTMLElement | null,
    React.Dispatch<React.SetStateAction<HTMLElement | null>>
  ];
  orderSelectedState: [
    QuestionOrder,
    React.Dispatch<React.SetStateAction<QuestionOrder>>
  ];
}

const OrderSelectMenu: React.FC<Props> = ({
  classes,
  anchorOrigin,
  transformOrigin,
  menuElState,
  orderSelectedState
}) => {
  const [orderSelected, setOrderSelected] = orderSelectedState;
  const [menuEl, setMenuEl] = menuElState;

  const handleMenuClose = () => {
    setMenuEl(null);
  };
  const handleSortChange = (selected: QuestionOrder) => {
    setOrderSelected(selected);
    handleMenuClose();
  };

  return (
    <Menu
      keepMounted
      anchorEl={menuEl}
      getContentAnchorEl={null}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      open={Boolean(menuEl)}
      onClose={handleMenuClose}
    >
      {Object.values(QuestionOrder).map(item => (
        <MenuItem
          className={classes?.menuItem}
          key={item}
          selected={orderSelected === item}
          onClick={() => handleSortChange(item)}
        >
          {getQuestionOrderLabel(item)}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default OrderSelectMenu;
