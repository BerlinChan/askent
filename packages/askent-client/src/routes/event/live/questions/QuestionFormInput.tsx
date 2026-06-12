import React from "react";
import { Box, InputBase } from "@mui/material";
import { useIntl } from "react-intl";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const useStyles = makeStyles<Theme, {}, string>((theme: Theme) => ({
    inputBox: {
      width: "100%",
      display: "flex",
      flexWrap: "nowrap",
      flexDirection: "row",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    adornmentBox: {
      textAlign: "center",
      marginTop: theme.spacing(0.5),
      opacity: 1,
      width: 32,
      overflow: "hidden",
    },
    questionInput: {
      flex: 1,
      width: "100%",
      fontSize: theme.typography.pxToRem(18),
    },
  }));
interface Props {
  className?: string;
  value?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onFocus?: (value: string) => void;
}

const QuestionFormInput: React.FC<Props> = ({
  className = "",
  value = "",
  disabled = false,
  autoFocus = false,
  onFocus,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();

  const handleInputFocus = (value: string) => {
    onFocus && onFocus(value);
  };

  return (
    <Box className={classes.inputBox + " " + className}>
      <Box className={classes.adornmentBox}>
        <QuestionAnswerIcon color="secondary" />
      </Box>
      <InputBase
        disabled={disabled}
        autoFocus={autoFocus}
        multiline
        minRows={2}
        maxRows={3}
        className={classes.questionInput}
        placeholder={formatMessage({
          id: "Type_your_question",
          defaultMessage: "Type your question",
        })}
        onFocus={() => handleInputFocus(value)}
      />
    </Box>
  );
};

export default QuestionFormInput;
