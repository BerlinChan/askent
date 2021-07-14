import { rule, shield, and } from "graphql-shield";
import { createRateLimitRule } from "graphql-rate-limit";
import { Context } from "./context";

const isAuthenticated = rule()((parent, args, { user }: Context) => {
  return Boolean(user?.id);
});
const rateLimitRule = createRateLimitRule({
  identifyContext: ({ user }: Context) => user?.id || "",
})({ window: "1s", max: 10 });

const permissions = shield(
  {
    Query: {
      "*": rateLimitRule,

      // Event
      eventById: and(isAuthenticated, rateLimitRule),
      eventsByMe: and(isAuthenticated, rateLimitRule),
      eventsByCode: rateLimitRule,
      checkEventCodeExist: rateLimitRule,
      isEventAudience: rateLimitRule,

      // User
      me: and(isAuthenticated, rateLimitRule),
      checkEmailExist: rateLimitRule,
      pgp: rateLimitRule,
    },
    Mutation: {
      "*": rateLimitRule,

      // Event
      createEvent: and(isAuthenticated, rateLimitRule),
      updateEvent: and(isAuthenticated, rateLimitRule),
      deleteEvent: and(isAuthenticated, rateLimitRule),
      joinEvent: and(isAuthenticated, rateLimitRule),
      addGuest: and(isAuthenticated, rateLimitRule),
      removeGuest: and(isAuthenticated, rateLimitRule),

      // Question
      createQuestion: and(isAuthenticated, rateLimitRule),
      updateQuestionReviewStatus: and(isAuthenticated, rateLimitRule),
      updateQuestionContent: and(isAuthenticated, rateLimitRule),
      updateQuestionStar: and(isAuthenticated, rateLimitRule),
      updateQuestionTop: and(isAuthenticated, rateLimitRule),
      deleteQuestion: and(isAuthenticated, rateLimitRule),
      deleteAllReviewQuestions: and(isAuthenticated, rateLimitRule),
      publishAllReviewQuestions: and(isAuthenticated, rateLimitRule),
      voteUpQuestion: and(isAuthenticated, rateLimitRule),

      // Reply
      createReply: and(isAuthenticated, rateLimitRule),
      updateReplyContent: and(isAuthenticated, rateLimitRule),
      updateReplyReviewStatus: and(isAuthenticated, rateLimitRule),
      deleteReply: and(isAuthenticated, rateLimitRule),

      // User
      login: rateLimitRule,
      loginAudience: rateLimitRule,
      signup: rateLimitRule,
      updateUser: and(isAuthenticated, rateLimitRule),
    },
  },
  {
    fallbackRule: rateLimitRule,
  }
);

export default permissions;
