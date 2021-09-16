import { rule, shield, and, race } from "graphql-shield";
import { createRateLimitRule } from "graphql-rate-limit";
import { Context } from "./context";
import { getRepository } from "typeorm";
import { Event as EventEntity } from "./entity/Event";

const { NODE_ENV = "production" } = process.env;

const isAuthenticated = rule()((parent, args, { user }: Context) => {
  return Boolean(user?.id);
});
const rateLimitRule = createRateLimitRule({
  identifyContext: ({ user }: Context) => user?.id || "",
})({ window: "1s", max: 100 });

const isEventOwner = rule()(async (parent, args, { user }: Context, info) => {
  const event = await getRepository(EventEntity).findOneOrFail(parent.id, {
    relations: ["owner"],
  });

  return event.owner.id === user?.id;
});
const isEventGuest = rule()(async (parent, args, { user }: Context, info) => {
  const event = await getRepository(EventEntity)
    .createQueryBuilder("event")
    .innerJoinAndSelect("event.guestes", "guest", "guest.id = :guestId", {
      guestId: user?.id,
    })
    .where("event.id = :eventId", { eventId: parent.id })
    .getOne();

  return event?.guestes[0]?.id === user?.id;
});

const permissions = shield(
  {
    Query: {
      "*": rateLimitRule,

      // Event
      eventById: rateLimitRule,
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

    Event: {
      owner: race(isEventOwner, isEventGuest),
      guestes: race(isEventOwner, isEventGuest),
      audiences: race(isEventOwner, isEventGuest),
      questions: isAuthenticated,
      createdAt: race(isEventOwner, isEventGuest),
      updatedAt: race(isEventOwner, isEventGuest),
    },
  },
  {
    fallbackRule: rateLimitRule,
    allowExternalErrors: NODE_ENV !== "production",
  }
);

export default permissions;
