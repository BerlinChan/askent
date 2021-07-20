import { rule, shield, and, race } from "graphql-shield";
import { createRateLimitRule } from "graphql-rate-limit";
import { Context } from "./context";
import { getRepository } from "typeorm";
import { Event as EventEntity } from "./entity/Event";
import { Question as QuestionEntity } from "./entity/Question";
import { ApolloError } from "apollo-server";

const isAuthenticated = rule()((parent, args, { user }: Context) => {
  return Boolean(user?.id);
});
const rateLimitRule = createRateLimitRule({
  identifyContext: ({ user }: Context) => user?.id || "",
})({ window: "1s", max: 10 });

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

const isQuestionAuthor = rule()(async (parent, args, { user }: Context, info) => {
  const question = await getRepository(QuestionEntity).findOneOrFail(parent.id, {
    relations: ["author"],
  });

  return question.author.id === user?.id;
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
      updateEvent: and(isEventOwner, rateLimitRule),
      deleteEvent: and(isEventOwner, rateLimitRule),
      joinEvent: and(isAuthenticated, rateLimitRule),
      addGuest: and(isEventOwner, rateLimitRule),
      removeGuest: and(isEventOwner, rateLimitRule),

      // Question
      createQuestion: and(isAuthenticated, rateLimitRule),
      updateQuestionReviewStatus: and(isAuthenticated, rateLimitRule),
      updateQuestionContent: and(isQuestionAuthor, rateLimitRule),
      updateQuestionStar: and(isAuthenticated, rateLimitRule),
      updateQuestionTop: and(isAuthenticated, rateLimitRule),
      deleteQuestion: and(isQuestionAuthor, rateLimitRule),
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
    fallbackError: async (thrownThing, parent, args, context, info) => {
      if (thrownThing instanceof ApolloError) {
        // expected errors
        return thrownThing;
      } else if (thrownThing instanceof Error) {
        if (thrownThing.message === "Argument Validation Error") {
          return thrownThing;
        } else {
          // unexpected errors
          console.error(thrownThing);
          return new ApolloError(
            "Internal server error",
            "ERR_INTERNAL_SERVER"
          );
        }
      } else {
        // what the hell got thrown
        console.error("The resolver threw something that is not an error.");
        console.error(thrownThing);
        return new ApolloError("Internal server error", "ERR_INTERNAL_SERVER");
      }
    },
  }
);

export default permissions;
