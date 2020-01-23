import React from "react";
import {
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useIntl, FormattedMessage } from "react-intl";
import { QueryResult } from "@apollo/react-common";
import {
  Question,
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  EventQuery,
  EventQueryVariables,
  useDeleteQuestionMutation,
  QuestionsByEventDocument
} from "../../../generated/graphqlHooks";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Confirm from "../../../components/Confirm";
import QuestionItem from "./QuestionItem";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    }
  })
);

interface Props {
  eventQuery: QueryResult<EventQuery, EventQueryVariables>;
  questionsByEventQuery: QueryResult<
    QuestionsByEventQuery,
    QuestionsByEventQueryVariables
  >;
  filter?: (item: Pick<Question, "star" | "archived" | "published">) => boolean;
}

const QuestionList: React.FC<Props> = ({
  eventQuery,
  questionsByEventQuery,
  filter = () => true
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { data } = questionsByEventQuery;
  const [moreMenu, setMoreMenu] = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: ""
  });
  const [deleteQuestionMutation] = useDeleteQuestionMutation();

  const handleMoreClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setMoreMenu({ anchorEl: event.currentTarget, id });
  };
  const handleMoreClose = () => {
    setMoreMenu({ anchorEl: null, id: "" });
  };

  const handleOpenDelete = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };
  const handleCloseDelete = () => {
    setDeleteConfirm({ open: false, id: "" });
    handleMoreClose();
  };
  const handleDelete = async () => {
    await deleteQuestionMutation({
      variables: { questionId: deleteConfirm.id },
      update: (cache, mutationResult) => {
        const questions = cache.readQuery<
          QuestionsByEventQuery,
          QuestionsByEventQueryVariables
        >({
          query: QuestionsByEventDocument,
          variables: { eventId: eventQuery.data?.event.id as string }
        });
        cache.writeQuery<QuestionsByEventQuery, QuestionsByEventQueryVariables>(
          {
            query: QuestionsByEventDocument,
            variables: { eventId: eventQuery.data?.event.id as string },
            data: {
              questionsByEvent: (questions?.questionsByEvent || []).filter(
                item => item.id !== mutationResult.data?.deleteQuestion.id
              )
            }
          }
        );
      }
    });
    handleCloseDelete();
  };
  const [editContent, setEditContent] = React.useState("");
  const handleEditContent = async () => {};

  return (
    <React.Fragment>
      <List className={classes.list} disablePadding>
        {data?.questionsByEvent
          .sort((a, b) => (b.top ? 1 : -1))
          .filter(filter)
          .map((item, index) => (
            <QuestionItem
              key={index}
              question={item}
              eventQuery={eventQuery}
              handleMoreClick={handleMoreClick}
            />
          ))}
      </List>

      <Menu
        MenuListProps={{ dense: true }}
        anchorEl={moreMenu.anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={Boolean(moreMenu.anchorEl)}
        onClose={handleMoreClose}
      >
        <MenuItem onClick={() => handleOpenDelete(moreMenu.id)}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({
              id: "Delete",
              defaultMessage: "Delete"
            })}
          />
        </MenuItem>
        <MenuItem onClick={() => setEditContent(moreMenu.id)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({
              id: "Edit",
              defaultMessage: "Edit"
            })}
          />
        </MenuItem>
      </Menu>
      <Confirm
        open={deleteConfirm.open}
        contentText={
          <FormattedMessage
            id="Delete_this_question?"
            defaultMessage="Delete this question?"
          />
        }
        okText={<FormattedMessage id="Delete" defaultMessage="Delete" />}
        onCancel={handleCloseDelete}
        onOk={handleDelete}
      />
    </React.Fragment>
  );
};

export default QuestionList;
