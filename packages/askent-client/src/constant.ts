export enum TOKEN_KEY {
  USER = "TOKEN_USER",
  AUDIENCE = "TOKEN_AUDIENCE",
}

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
