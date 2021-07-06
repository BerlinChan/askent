import { rule, shield, allow, deny } from "graphql-shield";
import { Context } from "./context";

const isAuthenticated = rule()((parent, args, { user }: Context) => {
  return user !== null;
});

const permissions = shield(
  {
    Query: {
      "*": deny,

      // Event
      eventById: isAuthenticated,
      eventsByMe: isAuthenticated,
      eventsByCode: allow,
      checkEventCodeExist: allow,
      isEventAudience: allow,

      // User
      me: isAuthenticated,
      checkEmailExist: allow,
      pgp: allow,
    },
    Mutation: {
      "*": deny,

      // Event
      createEvent: isAuthenticated,
      updateEvent: isAuthenticated,
      deleteEvent: isAuthenticated,
      joinEvent: isAuthenticated,
      addGuest: isAuthenticated,
      removeGuest: isAuthenticated,

      // Question
      createQuestion: isAuthenticated,
      updateQuestionReviewStatus: isAuthenticated,
      updateQuestionContent: isAuthenticated,
      updateQuestionStar: isAuthenticated,
      updateQuestionTop: isAuthenticated,
      deleteQuestion: isAuthenticated,
      deleteAllReviewQuestions: isAuthenticated,
      publishAllReviewQuestions: isAuthenticated,
      voteUpQuestion: isAuthenticated,

      // Reply
      createReply: isAuthenticated,
      updateReplyContent: isAuthenticated,
      updateReplyReviewStatus: isAuthenticated,
      deleteReply: isAuthenticated,

      // User
      login: allow,
      loginAudience: allow,
      signup: allow,
      updateUser: isAuthenticated,
    },
  },
  {
    fallbackRule: allow,
  }
);

export default permissions;
