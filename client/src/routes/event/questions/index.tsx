import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Container,
  FormControl,
  InputLabel,
  InputAdornment,
  FormHelperText
} from "@material-ui/core";
import { ButtonLoading } from "../../../components/Form";
import { useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { InputBase } from "formik-material-ui";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { QUESTION_CONTENT_MAX_LENGTH } from "../../../constant";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    QuestionFormControl: {
      width: "100%"
    },
    questionInput: {},
    helperTextBox: {
      display: "flex",
      justifyContent: "space-between"
    },
    cardActions: {
      justifyContent: "space-between"
    }
  })
);

const LiveQuestions: React.FC = () => {
  const classes = useStyles();
  let { id } = useParams();
  const [focus, setFocus] = React.useState<boolean>(false);

  return (
    <Container maxWidth="md">
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        <FormattedMessage
          id="Ask_the_speaker"
          defaultMessage="Ask the speaker"
        />
      </Typography>
      <Box>{id}</Box>
      <Formik
        initialValues={{
          question: ""
        }}
        validationSchema={Yup.object({
          question: Yup.string()
            .max(QUESTION_CONTENT_MAX_LENGTH)
            .required()
        })}
        onSubmit={async values => {}}
      >
        {formProps => (
          <Card>
            <Form>
              <CardContent>
                <FormControl className={classes.QuestionFormControl}>
                  {focus ? null : (
                    <InputAdornment position="start">
                      <QuestionAnswerIcon />
                    </InputAdornment>
                  )}
                  <InputLabel htmlFor="question">
                    <FormattedMessage
                      id="Type_your_question"
                      defaultMessage="Type your question"
                    />
                  </InputLabel>
                  <InputBase
                    multiline
                    rows={3}
                    rowsMax={8}
                    name="question"
                    className={classes.questionInput}
                    onFocus={() => setFocus(true)}
                    inputProps={{
                      onBlur: () => setFocus(false)
                    }}
                  />
                </FormControl>
              </CardContent>
              <Box className={classes.helperTextBox}>
                <FormHelperText
                  error={Boolean(
                    formProps.touched.question && formProps.errors.question
                  )}
                >
                  {formProps.errors.question}
                </FormHelperText>
                <Typography variant="body2" color="textSecondary">
                  {QUESTION_CONTENT_MAX_LENGTH -
                    formProps.values.question.length}
                </Typography>
              </Box>
              <CardActions className={classes.cardActions}>
                <ButtonLoading
                  variant="contained"
                  color="primary"
                  type="submit"
                  loading={false}
                >
                  <FormattedMessage id="Send" defaultMessage="Send" />
                </ButtonLoading>
              </CardActions>
            </Form>
          </Card>
        )}
      </Formik>
    </Container>
  );
};

export default LiveQuestions;
