import { registerEnumType } from "type-graphql";

export {
  USER_NAME_MAX_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  QUESTION_CONTENT_MAX_LENGTH,
  REPLY_CONTENT_MAX_LENGTH,
  EVENT_NAME_MAX_LENGTH,
  EVENT_CODE_MAX_LENGTH,
  DEFAULT_PAGE_OFFSET,
  DEFAULT_PAGE_LIMIT,
} from "../../askent-client/src/constant";

export const CLAIMS_NAMESPACE = "https://hasura.io/jwt/claims";

export enum ReviewStatus {
  Review = "Review",
  Publish = "Publish",
  Archive = "Archive",
}
registerEnumType(ReviewStatus, {
  name: "ReviewStatus",
  description: "Question's or Reply's review status",
});

export enum RoleName {
  User = "User",
  Audience = "Audience",
}
registerEnumType(RoleName, { name: "RoleName" });

export enum EventDateStatus {
  Active = "Active",
  Upcoming = "Upcoming",
  Past = "Past",
}
registerEnumType(EventDateStatus, { name: "EventDateStatus" });
