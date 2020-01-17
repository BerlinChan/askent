import React from "react";
import { IconButtonProps, IconButton, Tooltip } from "@material-ui/core";

export interface handleToggleInterface {
  (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    currentStatus: boolean
  ): void;
}

interface Props {
  id: string;
  status: boolean;
  onTitle: string;
  offTitle: string;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;

  handleToggle: handleToggleInterface;
}

const QuestionToggleButton: React.FC<Props & IconButtonProps> = ({
  id,
  status,
  onTitle,
  offTitle,
  onIcon,
  offIcon,
  handleToggle,
  ...rest
}) => {
  return (
    <Tooltip title={status ? onTitle : offTitle}>
      <IconButton {...rest} onClick={e => handleToggle(e, id, status)}>
        {status ? onIcon : offIcon}
      </IconButton>
    </Tooltip>
  );
};

export default QuestionToggleButton;
