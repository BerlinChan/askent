import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  useIntl,
  FormattedMessage,
  FormattedDate,
  FormattedTime
} from "react-intl";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { QueryResult } from "@apollo/react-common";
import {
  Question,
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables,
  useDeleteQuestionMutation
} from "../../../generated/graphqlHooks";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Confirm from "../../../components/Confirm";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    },
    listItem: {
      flexWrap: "wrap",
      position: "relative",
      "&:hover .questionHover": {
        visibility: "visible"
      },
      "& .questionHover": {
        visibility: "hidden"
      }
    },
    questionMeta: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(1)
    },
    questionContent: { width: "100%" },
    questionActionBox: {
      position: "absolute",
      top: 0,
      right: 8
    },
    questionMoreButton: {}
  })
);

interface Props {
  questionsByEventQuery: QueryResult<
    QuestionsByEventQuery,
    QuestionsByEventQueryVariables
  >;
  filter?: (item: Pick<Question, "star" | "archived" | "published">) => boolean;
}

const QuestionList: React.FC<Props> = ({
  questionsByEventQuery,
  filter = () => true
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { data, refetch } = questionsByEventQuery;
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
      variables: { questionId: deleteConfirm.id }
    });
    refetch();
    handleCloseDelete();
  };

  return (
    <React.Fragment>
      <List className={classes.list}>
        {data?.questionsByEvent.filter(filter).map((item, index) => (
          <ListItem
            key={index}
            className={classes.listItem}
            alignItems="flex-start"
            divider
          >
            <ListItemAvatar>
              <Avatar src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {item.username ? (
                    item.username
                  ) : (
                    <FormattedMessage
                      id="Anonymous"
                      defaultMessage="Anonymous"
                    />
                  )}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <ThumbUpIcon style={{ fontSize: 12 }} />
                  <Typography
                    className={classes.questionMeta}
                    component="span"
                    variant="body2"
                    color="inherit"
                  >
                    {item.voteCount}
                  </Typography>
                  <AccessTimeIcon style={{ fontSize: 12 }} />
                  <Typography
                    className={classes.questionMeta}
                    component="span"
                    variant="body2"
                    color="inherit"
                  >
                    <FormattedDate value={item.updatedAt} />{" "}
                    <FormattedTime value={item.updatedAt} />
                  </Typography>
                </React.Fragment>
              }
            />
            <Typography className={classes.questionContent} variant="body1">
              {item.content}
            </Typography>
            <Box className={classes.questionActionBox}>
              <IconButton
                className={"questionHover"}
                onClick={e => handleMoreClick(e, item.id)}
              >
                <ArchiveIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                size="small"
                onClick={e => handleMoreClick(e, item.id)}
              >
                <MoreHorizIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </ListItem>
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
