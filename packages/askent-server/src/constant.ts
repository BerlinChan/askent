import { registerEnumType } from "type-graphql";

export const DEFAULT_PAGE_OFFSET = 0;
export const DEFAULT_PAGE_LIMIT = 50;

export const USER_NAME_MAX_LENGTH = 30;
export const USER_EMAIL_MAX_LENGTH = 30;
export const USER_PASSWORD_MAX_LENGTH = 30;
export const QUESTION_CONTENT_MAX_LENGTH = 300;
export const REPLY_CONTENT_MAX_LENGTH = 1000;
export const EVENT_NAME_MAX_LENGTH = 20;
export const EVENT_CODE_MAX_LENGTH = 20;

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
