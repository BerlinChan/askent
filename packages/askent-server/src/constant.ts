import { registerEnumType } from "type-graphql";

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

export enum EventOwnerFilter {
  Owner = "Owner",
  Guest = "Guest",
}
registerEnumType(EventOwnerFilter, { name: "EventOwnerFilter" });

export enum EventDateStatus {
  Active = "Active",
  Upcoming = "Upcoming",
  Past = "Past",
}
registerEnumType(EventDateStatus, { name: "EventDateStatus" });
