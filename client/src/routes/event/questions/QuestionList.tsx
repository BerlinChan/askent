import React from "react";
import {
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
  QuestionsByEventQuery,
  QuestionsByEventQueryVariables
} from "../../../generated/graphqlHooks";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    },
    listItem: { flexWrap: "wrap", position: "relative" },
    questionMeta: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(1)
    },
    questionContent: { width: "100%" },
    questionMoreButton: {
      position: "absolute",
      top: 8,
      right: 8
    }
  })
);

interface Props {
  questionsByEventQuery: QueryResult<
    QuestionsByEventQuery,
    QuestionsByEventQueryVariables
  >;
}

const QuestionList: React.FC<Props> = ({ questionsByEventQuery }) => {
  const classes = useStyles();
  const { data: questionsData } = questionsByEventQuery;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { formatMessage } = useIntl();

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  return (
    <List className={classes.list}>
      {questionsData?.questionsByEvent.map((item, index) => (
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
              <Typography component="span" variant="body2" color="textPrimary">
                {item.username ? (
                  item.username
                ) : (
                  <FormattedMessage id="Anonymous" defaultMessage="Anonymous" />
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
          <IconButton
            size="small"
            className={classes.questionMoreButton}
            onClick={handleMoreClick}
          >
            <MoreHorizIcon fontSize="inherit" />
          </IconButton>
          <Menu
            MenuListProps={{ dense: true }}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={Boolean(anchorEl)}
            onClose={handleMoreClose}
          >
            <MenuItem onClick={handleMoreClose}>
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
        </ListItem>
      ))}
    </List>
  );
};

export default QuestionList;
