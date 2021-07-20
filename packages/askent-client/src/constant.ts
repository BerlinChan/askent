
export const AUTH_TOKEN = "AUTH_TOKEN";

export const DEFAULT_PAGE_OFFSET = 0;
export const DEFAULT_PAGE_LIMIT = 50;

export const USER_NAME_MAX_LENGTH = 30;
export const USER_EMAIL_MAX_LENGTH = 30;
export const USER_PASSWORD_MAX_LENGTH = 30;
export const QUESTION_CONTENT_MAX_LENGTH = 300;
export const REPLY_CONTENT_MAX_LENGTH = 1000;
export const EVENT_NAME_MAX_LENGTH = 20;
export const EVENT_CODE_MAX_LENGTH = 20;

export const HASURA_LIVE_QUERY = /LiveQuery/;

export enum QuestionFilter {
  Review = "Review",
  Publish = "Publish",
  Archive = "Archive",

  Starred = "Starred",
  // Anwsered = 'Anwsered',
  // Dismissed = 'Dismissed',
}

export enum QuestionOrder {
  Popular = "Popular",
  Recent = "Recent",
  Oldest = "Oldest",
  Starred = "Starred",
}
