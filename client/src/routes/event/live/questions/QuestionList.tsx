import React from "react";
import * as R from "ramda";
import {
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables,
  LiveEventQuery,
  LiveEventQueryVariables,
  LiveQuestionsByEventQuery,
  LiveQuestionsByEventQueryVariables,
  QuestionsByMeAudienceQuery,
  QuestionsByMeAudienceQueryVariables,
  useDeleteQuestionMutation,
  LiveQuestionFieldsFragment,
  QuestionReviewStatus
} from "../../../../generated/graphqlHooks";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Confirm from "../../../../components/Confirm";
import EditIcon from "@material-ui/icons/Edit";
import QuestionItem from "./QuestionItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {}
  })
);

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventQueryResult: QueryResult<LiveEventQuery, LiveEventQueryVariables>;
  liveQuestionsResult?: QueryResult<
    LiveQuestionsByEventQuery,
    LiveQuestionsByEventQueryVariables
  >;
  myQuestionsResult?: QueryResult<
    QuestionsByMeAudienceQuery,
    QuestionsByMeAudienceQueryVariables
  >;
  comparator?: R.Comparator<LiveQuestionFieldsFragment, number>[];
}

const QuestionList: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult,
  liveQuestionsResult,
  myQuestionsResult,
  comparator = []
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [moreMenu, setMoreMenu] = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: ""
  });
  const [deleteQuestionMutation] = useDeleteQuestionMutation();
  const editContentInputRef = React.useRef<HTMLInputElement>(null);

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
    handleMoreClose();
  };
  const handleCloseDelete = () => {
    setDeleteConfirm({ open: false, id: "" });
    handleMoreClose();
  };
  const handleDelete = async () => {
    await deleteQuestionMutation({
      variables: { questionId: deleteConfirm.id }
    });
    handleCloseDelete();
  };
  const [editContentIds, setEditContentIds] = React.useState<Array<string>>([]);
  const handleEditContentToggle = (id: string) => {
    const findId = editContentIds.find(item => item === id);
    setEditContentIds(
      findId
        ? editContentIds.filter(item => item !== id)
        : editContentIds.concat([id])
    );
    handleMoreClose();
    setTimeout(() => editContentInputRef.current?.focus(), 100);
  };
  const questionList =
    liveQuestionsResult?.data?.liveQuestionsByEvent ||
    myQuestionsResult?.data?.questionsByMeAudience ||
    [];
  const questionMoreTarget = questionList.find(
    question => question.id === moreMenu.id
  );

  return (
    <React.Fragment>
      <List className={classes.list} disablePadding>
        {R.sortWith<LiveQuestionFieldsFragment>([
          R.descend(R.prop("top")),
          ...comparator
        ])(questionList).map((item, index) => (
          <QuestionItem
            key={index}
            question={item}
            userQueryResult={userQueryResult}
            handleMoreClick={handleMoreClick}
            editContent={editContentIds.includes(item.id)}
            handleEditContentToggle={handleEditContentToggle}
            editContentInputRef={editContentInputRef}
          />
        ))}
      </List>

      <Menu
        MenuListProps={{ dense: true }}
        anchorEl={moreMenu.anchorEl}
        getContentAnchorEl={null}
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
        <MenuItem
          disabled={
            questionMoreTarget?.top ||
            (eventQueryResult.data?.eventById.moderation &&
              questionMoreTarget?.reviewStatus === QuestionReviewStatus.Publish)
          }
          onClick={() => handleEditContentToggle(moreMenu.id)}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({ id: "Edit", defaultMessage: "Edit" })}
          />
        </MenuItem>
        <MenuItem
          disabled={questionMoreTarget?.top}
          onClick={() => handleOpenDelete(moreMenu.id)}
        >
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({
              id: "Withdraw",
              defaultMessage: "Withdraw"
            })}
          />
        </MenuItem>
      </Menu>
      <Confirm
        open={deleteConfirm.open}
        contentText={
          <FormattedMessage
            id="Withdraw_this_question?"
            defaultMessage="Withdraw this question?"
          />
        }
        okText={<FormattedMessage id="Withdraw" defaultMessage="Withdraw" />}
        onCancel={handleCloseDelete}
        onOk={handleDelete}
      />
    </React.Fragment>
  );
};

export default QuestionList;
