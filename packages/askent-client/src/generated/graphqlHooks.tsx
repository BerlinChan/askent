import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String'];
  user: User;
};

export type CreateQuestionInput = {
  eventId: Scalars['ID'];
  content: Scalars['String'];
  anonymous?: Maybe<Scalars['Boolean']>;
};

export type CreateReplyInput = {
  questionId: Scalars['ID'];
  content: Scalars['String'];
  anonymous: Scalars['Boolean'];
};


export type Event = {
  __typename?: 'Event';
  id: Scalars['ID'];
  code: Scalars['String'];
  name: Scalars['String'];
  startAt: Scalars['DateTime'];
  endAt: Scalars['DateTime'];
  moderation: Scalars['Boolean'];
  dateStatus: EventDateStatus;
  owner: User;
  guestes: Array<User>;
  audiences: Array<User>;
  questions: Array<Question>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export enum EventDateStatus {
  Active = 'Active',
  Upcoming = 'Upcoming',
  Past = 'Past'
}

export enum EventOwnerFilter {
  Owner = 'Owner',
  Guest = 'Guest'
}

export type EventPaged = IPagedType & {
  __typename?: 'EventPaged';
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  totalCount: Scalars['Int'];
  hasNextPage: Scalars['Boolean'];
  list: Array<Event>;
};

export type IPagedType = {
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  totalCount: Scalars['Int'];
  hasNextPage: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a user as guest administrator, who can cooperating manage the event. */
  addGuest: User;
  createEvent: Event;
  /** Create question */
  createQuestion: Question;
  createReply: Reply;
  createRole: Role;
  /** Delete all Review questions by event. */
  deleteAllReviewQuestions: Scalars['Int'];
  deleteEvent: Event;
  /** Delete a question by id. */
  deleteQuestion: Question;
  /** Delete a reply by id. */
  deleteReply: Reply;
  /** 加入活动。 */
  joinEvent: Scalars['ID'];
  login: AuthPayload;
  /**
   * Audience 登陆。
   *   若 fingerprint 的 User 已存在则返回 token，
   *   若 fingerprint 的 User 不存在则 create 并返回 token
   */
  loginAudience: AuthPayload;
  packageInfo: PackageInfo;
  /** Publish all Review questions by event. */
  publishAllReviewQuestions: Scalars['Int'];
  removeGuest: Scalars['ID'];
  seedEvent: Scalars['Int'];
  seedQuestion: Scalars['Int'];
  seedReply: Scalars['Int'];
  seedRole: Scalars['Int'];
  /** Signup a new user. */
  signup: AuthPayload;
  updateEvent: Event;
  /** Update a question content. */
  updateQuestionContent: Question;
  /** Update a question review status. */
  updateQuestionReviewStatus: Question;
  /** Update a question star. */
  updateQuestionStar: Question;
  /** Top a question. Can only top one question at a time. */
  updateQuestionTop: Question;
  /** Update a reply's content. */
  updateReplyContent: Reply;
  /** Update a reply's review status. */
  updateReplyReviewStatus: Reply;
  updateUser: User;
  /** Vote a question. */
  voteUpQuestion: Question;
};


export type MutationAddGuestArgs = {
  email: Scalars['String'];
  eventId: Scalars['ID'];
};


export type MutationCreateEventArgs = {
  code: Scalars['String'];
  name: Scalars['String'];
  startAt: Scalars['DateTime'];
  endAt: Scalars['DateTime'];
};


export type MutationCreateQuestionArgs = {
  input: CreateQuestionInput;
};


export type MutationCreateReplyArgs = {
  input: CreateReplyInput;
};


export type MutationCreateRoleArgs = {
  name: RoleName;
};


export type MutationDeleteAllReviewQuestionsArgs = {
  eventId: Scalars['ID'];
};


export type MutationDeleteEventArgs = {
  eventId: Scalars['ID'];
};


export type MutationDeleteQuestionArgs = {
  questionId: Scalars['ID'];
};


export type MutationDeleteReplyArgs = {
  replyId: Scalars['ID'];
};


export type MutationJoinEventArgs = {
  eventId: Scalars['ID'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginAudienceArgs = {
  fingerprint: Scalars['String'];
};


export type MutationPackageInfoArgs = {
  version?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};


export type MutationPublishAllReviewQuestionsArgs = {
  eventId: Scalars['ID'];
};


export type MutationRemoveGuestArgs = {
  guestId: Scalars['ID'];
  eventId: Scalars['ID'];
};


export type MutationSeedQuestionArgs = {
  eventId: Scalars['String'];
};


export type MutationSeedReplyArgs = {
  anonymous?: Maybe<Scalars['Boolean']>;
  questionId: Scalars['String'];
};


export type MutationSignupArgs = {
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};


export type MutationUpdateQuestionContentArgs = {
  questionId: Scalars['ID'];
  content: Scalars['String'];
};


export type MutationUpdateQuestionReviewStatusArgs = {
  reviewStatus: ReviewStatus;
  questionId: Scalars['ID'];
};


export type MutationUpdateQuestionStarArgs = {
  star: Scalars['Boolean'];
  questionId: Scalars['ID'];
};


export type MutationUpdateQuestionTopArgs = {
  top: Scalars['Boolean'];
  questionId: Scalars['ID'];
};


export type MutationUpdateReplyContentArgs = {
  content: Scalars['String'];
  replyId: Scalars['ID'];
};


export type MutationUpdateReplyReviewStatusArgs = {
  reviewStatus: ReviewStatus;
  replyId: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationVoteUpQuestionArgs = {
  questionId: Scalars['ID'];
};

export type Pgp = {
  __typename?: 'PGP';
  pubKey: Scalars['String'];
};

export type PackageInfo = {
  __typename?: 'PackageInfo';
  version: Scalars['String'];
  description: Scalars['String'];
};

export type PaginationInput = {
  /** Default offset 0. */
  offset?: Maybe<Scalars['Int']>;
  /** Default limit 50 */
  limit?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  /** Check if a email has already exist. */
  checkEmailExist: Scalars['Boolean'];
  /** Check if a event code has already exist. */
  checkEventCodeExist: Scalars['Boolean'];
  eventById: Event;
  /** Get events by code. */
  eventsByCode: Array<Event>;
  /** Get all my events. */
  eventsByMe: EventPaged;
  isEventAudience: Scalars['Boolean'];
  me: User;
  packageInfo: PackageInfo;
  /** For demo use */
  pgp: Pgp;
  roles: Array<Role>;
};


export type QueryCheckEmailExistArgs = {
  email: Scalars['String'];
};


export type QueryCheckEventCodeExistArgs = {
  code: Scalars['String'];
};


export type QueryEventByIdArgs = {
  eventId: Scalars['ID'];
};


export type QueryEventsByCodeArgs = {
  code?: Maybe<Scalars['String']>;
};


export type QueryEventsByMeArgs = {
  dateStatusFilter?: Maybe<EventDateStatus>;
  eventOwnerFilter?: Maybe<EventOwnerFilter>;
  searchString?: Maybe<Scalars['String']>;
  pagination: PaginationInput;
};


export type QueryIsEventAudienceArgs = {
  eventId: Scalars['ID'];
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID'];
  content: Scalars['String'];
  anonymous: Scalars['Boolean'];
  reviewStatus: ReviewStatus;
  star: Scalars['Boolean'];
  top: Scalars['Boolean'];
  voteUpCount: Scalars['Int'];
  replyCount: Scalars['Int'];
  event: Event;
  author?: Maybe<User>;
  voted: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Reply = {
  __typename?: 'Reply';
  id: Scalars['ID'];
  content: Scalars['String'];
  reviewStatus: ReviewStatus;
  /** If author is a moderator of the event? */
  isModerator: Scalars['Boolean'];
  anonymous: Scalars['Boolean'];
  question: Question;
  author?: Maybe<User>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

/** Question's or Reply's review status */
export enum ReviewStatus {
  Review = 'Review',
  Publish = 'Publish',
  Archive = 'Archive'
}

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export enum RoleName {
  User = 'User',
  Audience = 'Audience'
}

export type UpdateEventInput = {
  eventId: Scalars['ID'];
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  startAt?: Maybe<Scalars['DateTime']>;
  endAt?: Maybe<Scalars['DateTime']>;
  moderation?: Maybe<Scalars['Boolean']>;
};

export type UpdateUserInput = {
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  anonymous?: Maybe<Scalars['Boolean']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  anonymous?: Maybe<Scalars['Boolean']>;
  avatar?: Maybe<Scalars['String']>;
  roles: Array<Role>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
};

export type GuestesByEventQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type GuestesByEventQuery = (
  { __typename?: 'Query' }
  & { eventById: (
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
    & { guestes: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'email'>
    )> }
  ) }
);

export type AddGuestMutationVariables = Exact<{
  email: Scalars['String'];
  eventId: Scalars['ID'];
}>;


export type AddGuestMutation = (
  { __typename?: 'Mutation' }
  & { addGuest: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'email'>
  ) }
);

export type RemoveGuestMutationVariables = Exact<{
  eventId: Scalars['ID'];
  guestId: Scalars['ID'];
}>;


export type RemoveGuestMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeGuest'>
);

export type QuestionFieldsFragment = (
  { __typename?: 'Question' }
  & Pick<Question, 'id' | 'createdAt' | 'updatedAt' | 'voteUpCount' | 'replyCount' | 'content' | 'reviewStatus' | 'star' | 'top'>
  & { author?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'avatar'>
  )> }
);

export type DeleteQuestionMutationVariables = Exact<{
  questionId: Scalars['ID'];
}>;


export type DeleteQuestionMutation = (
  { __typename?: 'Mutation' }
  & { deleteQuestion: (
    { __typename?: 'Question' }
    & Pick<Question, 'id'>
  ) }
);

export type DeleteAllReviewQuestionsMutationVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type DeleteAllReviewQuestionsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteAllReviewQuestions'>
);

export type PublishAllReviewQuestionsMutationVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type PublishAllReviewQuestionsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'publishAllReviewQuestions'>
);

export type UpdateQuestionReviewStatusMutationVariables = Exact<{
  questionId: Scalars['ID'];
  reviewStatus: ReviewStatus;
}>;


export type UpdateQuestionReviewStatusMutation = (
  { __typename?: 'Mutation' }
  & { updateQuestionReviewStatus: (
    { __typename?: 'Question' }
    & QuestionFieldsFragment
  ) }
);

export type UpdateQuestionStarMutationVariables = Exact<{
  questionId: Scalars['ID'];
  star: Scalars['Boolean'];
}>;


export type UpdateQuestionStarMutation = (
  { __typename?: 'Mutation' }
  & { updateQuestionStar: (
    { __typename?: 'Question' }
    & QuestionFieldsFragment
  ) }
);

export type UpdateQuestionTopMutationVariables = Exact<{
  questionId: Scalars['ID'];
  top: Scalars['Boolean'];
}>;


export type UpdateQuestionTopMutation = (
  { __typename?: 'Mutation' }
  & { updateQuestionTop: (
    { __typename?: 'Question' }
    & QuestionFieldsFragment
  ) }
);

export type UpdateQuestionContentMutationVariables = Exact<{
  questionId: Scalars['ID'];
  content: Scalars['String'];
}>;


export type UpdateQuestionContentMutation = (
  { __typename?: 'Mutation' }
  & { updateQuestionContent: (
    { __typename?: 'Question' }
    & QuestionFieldsFragment
  ) }
);

export type ReplyFieldsFragment = (
  { __typename?: 'Reply' }
  & Pick<Reply, 'id' | 'createdAt' | 'updatedAt' | 'content' | 'reviewStatus' | 'isModerator'>
  & { author?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'avatar'>
  )> }
);

export type CreateReplyMutationVariables = Exact<{
  input: CreateReplyInput;
}>;


export type CreateReplyMutation = (
  { __typename?: 'Mutation' }
  & { createReply: (
    { __typename?: 'Reply' }
    & ReplyFieldsFragment
  ) }
);

export type UpdateReplyContentMutationVariables = Exact<{
  replyId: Scalars['ID'];
  content: Scalars['String'];
}>;


export type UpdateReplyContentMutation = (
  { __typename?: 'Mutation' }
  & { updateReplyContent: (
    { __typename?: 'Reply' }
    & ReplyFieldsFragment
  ) }
);

export type UpdateReplyReviewStatusMutationVariables = Exact<{
  replyId: Scalars['ID'];
  reviewStatus: ReviewStatus;
}>;


export type UpdateReplyReviewStatusMutation = (
  { __typename?: 'Mutation' }
  & { updateReplyReviewStatus: (
    { __typename?: 'Reply' }
    & ReplyFieldsFragment
  ) }
);

export type DeleteReplyMutationVariables = Exact<{
  replyId: Scalars['ID'];
}>;


export type DeleteReplyMutation = (
  { __typename?: 'Mutation' }
  & { deleteReply: (
    { __typename?: 'Reply' }
    & Pick<Reply, 'id'>
  ) }
);

export type EventFieldsFragment = (
  { __typename?: 'Event' }
  & Pick<Event, 'id' | 'name' | 'code' | 'startAt' | 'endAt' | 'dateStatus'>
);

export type EventDetailFieldsFragment = (
  { __typename?: 'Event' }
  & Pick<Event, 'id' | 'name' | 'code' | 'startAt' | 'endAt' | 'dateStatus' | 'moderation'>
  & { owner: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'email'>
  ) }
);

export type EventsByMeQueryVariables = Exact<{
  searchString?: Maybe<Scalars['String']>;
  pagination: PaginationInput;
  eventOwnerFilter?: Maybe<EventOwnerFilter>;
  dateStatusFilter?: Maybe<EventDateStatus>;
}>;


export type EventsByMeQuery = (
  { __typename?: 'Query' }
  & { eventsByMe: (
    { __typename?: 'EventPaged' }
    & Pick<EventPaged, 'limit' | 'offset' | 'totalCount' | 'hasNextPage'>
    & { list: Array<(
      { __typename?: 'Event' }
      & EventFieldsFragment
    )> }
  ) }
);

export type EventByIdQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type EventByIdQuery = (
  { __typename?: 'Query' }
  & { eventById: (
    { __typename?: 'Event' }
    & EventDetailFieldsFragment
  ) }
);

export type CheckEventCodeExistQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type CheckEventCodeExistQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'checkEventCodeExist'>
);

export type CreateEventMutationVariables = Exact<{
  code: Scalars['String'];
  name: Scalars['String'];
  startAt: Scalars['DateTime'];
  endAt: Scalars['DateTime'];
}>;


export type CreateEventMutation = (
  { __typename?: 'Mutation' }
  & { createEvent: (
    { __typename?: 'Event' }
    & EventFieldsFragment
  ) }
);

export type UpdateEventMutationVariables = Exact<{
  input: UpdateEventInput;
}>;


export type UpdateEventMutation = (
  { __typename?: 'Mutation' }
  & { updateEvent: (
    { __typename?: 'Event' }
    & EventDetailFieldsFragment
  ) }
);

export type DeleteEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type DeleteEventMutation = (
  { __typename?: 'Mutation' }
  & { deleteEvent: (
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
  ) }
);

export type PgpQueryVariables = Exact<{ [key: string]: never; }>;


export type PgpQuery = (
  { __typename?: 'Query' }
  & { pgp: (
    { __typename?: 'PGP' }
    & Pick<Pgp, 'pubKey'>
  ) }
);

export type PackageInfoMutationVariables = Exact<{
  version?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
}>;


export type PackageInfoMutation = (
  { __typename?: 'Mutation' }
  & { packageInfo: (
    { __typename?: 'PackageInfo' }
    & Pick<PackageInfo, 'version' | 'description'>
  ) }
);

export type EventForLoginQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type EventForLoginQuery = (
  { __typename?: 'Query' }
  & { eventById: (
    { __typename?: 'Event' }
    & Pick<Event, 'id' | 'name' | 'code' | 'startAt' | 'endAt'>
  ) }
);

export type QuestionAudienceFieldsFragment = (
  { __typename?: 'Question' }
  & Pick<Question, 'id' | 'anonymous' | 'createdAt' | 'updatedAt' | 'content' | 'reviewStatus' | 'top' | 'star' | 'voted' | 'voteUpCount' | 'replyCount'>
  & { author?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'avatar'>
  )> }
);

export type CreateQuestionMutationVariables = Exact<{
  input: CreateQuestionInput;
}>;


export type CreateQuestionMutation = (
  { __typename?: 'Mutation' }
  & { createQuestion: (
    { __typename?: 'Question' }
    & QuestionAudienceFieldsFragment
  ) }
);

export type VoteUpQuestionMutationVariables = Exact<{
  questionId: Scalars['ID'];
}>;


export type VoteUpQuestionMutation = (
  { __typename?: 'Mutation' }
  & { voteUpQuestion: (
    { __typename?: 'Question' }
    & QuestionAudienceFieldsFragment
  ) }
);

export type LoginAudienceMutationVariables = Exact<{
  fingerprint: Scalars['String'];
}>;


export type LoginAudienceMutation = (
  { __typename?: 'Mutation' }
  & { loginAudience: (
    { __typename?: 'AuthPayload' }
    & Pick<AuthPayload, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'name'>
    ) }
  ) }
);

export type IsEventAudienceQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type IsEventAudienceQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isEventAudience'>
);

export type JoinEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type JoinEventMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'joinEvent'>
);

export type QuestionWallFieldsFragment = (
  { __typename?: 'Question' }
  & Pick<Question, 'id' | 'createdAt' | 'updatedAt' | 'content' | 'reviewStatus' | 'top' | 'star' | 'voteUpCount' | 'replyCount'>
  & { author?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'avatar'>
  )> }
);

export type EventCodeOptionsQueryVariables = Exact<{
  code?: Maybe<Scalars['String']>;
}>;


export type EventCodeOptionsQuery = (
  { __typename?: 'Query' }
  & { eventsByCode: Array<(
    { __typename?: 'Event' }
    & Pick<Event, 'id' | 'code' | 'name' | 'startAt' | 'endAt'>
  )> }
);

export type UserInfoFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'name' | 'anonymous' | 'email' | 'avatar'>
  & { roles: Array<(
    { __typename?: 'Role' }
    & Pick<Role, 'id' | 'name'>
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & UserInfoFragment
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'User' }
    & UserInfoFragment
  ) }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'AuthPayload' }
    & Pick<AuthPayload, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'name' | 'email'>
    ) }
  ) }
);

export type SignupMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignupMutation = (
  { __typename?: 'Mutation' }
  & { signup: (
    { __typename?: 'AuthPayload' }
    & Pick<AuthPayload, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'name' | 'email'>
    ) }
  ) }
);

export type CheckEmailExistQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type CheckEmailExistQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'checkEmailExist'>
);

export const QuestionFieldsFragmentDoc = gql`
    fragment QuestionFields on Question {
  id
  createdAt
  updatedAt
  voteUpCount
  replyCount
  content
  reviewStatus
  star
  top
  author {
    id
    name
    avatar
  }
}
    `;
export const ReplyFieldsFragmentDoc = gql`
    fragment ReplyFields on Reply {
  id
  createdAt
  updatedAt
  content
  reviewStatus
  isModerator
  author {
    id
    name
    avatar
  }
}
    `;
export const EventFieldsFragmentDoc = gql`
    fragment EventFields on Event {
  id
  name
  code
  startAt
  endAt
  dateStatus
}
    `;
export const EventDetailFieldsFragmentDoc = gql`
    fragment EventDetailFields on Event {
  id
  name
  code
  startAt
  endAt
  dateStatus
  moderation
  owner {
    id
    name
    email
  }
}
    `;
export const QuestionAudienceFieldsFragmentDoc = gql`
    fragment QuestionAudienceFields on Question {
  id
  anonymous
  createdAt
  updatedAt
  content
  reviewStatus
  top
  star
  voted
  voteUpCount
  replyCount
  author {
    id
    name
    avatar
  }
}
    `;
export const QuestionWallFieldsFragmentDoc = gql`
    fragment QuestionWallFields on Question {
  id
  createdAt
  updatedAt
  content
  reviewStatus
  top
  star
  voteUpCount
  replyCount
  author {
    id
    name
    avatar
  }
}
    `;
export const UserInfoFragmentDoc = gql`
    fragment UserInfo on User {
  id
  name
  anonymous
  email
  avatar
  roles {
    id
    name
  }
}
    `;
export const GuestesByEventDocument = gql`
    query GuestesByEvent($eventId: ID!) {
  eventById(eventId: $eventId) {
    id
    guestes {
      id
      name
      email
    }
  }
}
    `;

/**
 * __useGuestesByEventQuery__
 *
 * To run a query within a React component, call `useGuestesByEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useGuestesByEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGuestesByEventQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useGuestesByEventQuery(baseOptions: Apollo.QueryHookOptions<GuestesByEventQuery, GuestesByEventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GuestesByEventQuery, GuestesByEventQueryVariables>(GuestesByEventDocument, options);
      }
export function useGuestesByEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GuestesByEventQuery, GuestesByEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GuestesByEventQuery, GuestesByEventQueryVariables>(GuestesByEventDocument, options);
        }
export type GuestesByEventQueryHookResult = ReturnType<typeof useGuestesByEventQuery>;
export type GuestesByEventLazyQueryHookResult = ReturnType<typeof useGuestesByEventLazyQuery>;
export type GuestesByEventQueryResult = Apollo.QueryResult<GuestesByEventQuery, GuestesByEventQueryVariables>;
export const AddGuestDocument = gql`
    mutation AddGuest($email: String!, $eventId: ID!) {
  addGuest(email: $email, eventId: $eventId) {
    id
    name
    email
  }
}
    `;
export type AddGuestMutationFn = Apollo.MutationFunction<AddGuestMutation, AddGuestMutationVariables>;

/**
 * __useAddGuestMutation__
 *
 * To run a mutation, you first call `useAddGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addGuestMutation, { data, loading, error }] = useAddGuestMutation({
 *   variables: {
 *      email: // value for 'email'
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useAddGuestMutation(baseOptions?: Apollo.MutationHookOptions<AddGuestMutation, AddGuestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddGuestMutation, AddGuestMutationVariables>(AddGuestDocument, options);
      }
export type AddGuestMutationHookResult = ReturnType<typeof useAddGuestMutation>;
export type AddGuestMutationResult = Apollo.MutationResult<AddGuestMutation>;
export type AddGuestMutationOptions = Apollo.BaseMutationOptions<AddGuestMutation, AddGuestMutationVariables>;
export const RemoveGuestDocument = gql`
    mutation RemoveGuest($eventId: ID!, $guestId: ID!) {
  removeGuest(eventId: $eventId, guestId: $guestId)
}
    `;
export type RemoveGuestMutationFn = Apollo.MutationFunction<RemoveGuestMutation, RemoveGuestMutationVariables>;

/**
 * __useRemoveGuestMutation__
 *
 * To run a mutation, you first call `useRemoveGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeGuestMutation, { data, loading, error }] = useRemoveGuestMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      guestId: // value for 'guestId'
 *   },
 * });
 */
export function useRemoveGuestMutation(baseOptions?: Apollo.MutationHookOptions<RemoveGuestMutation, RemoveGuestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveGuestMutation, RemoveGuestMutationVariables>(RemoveGuestDocument, options);
      }
export type RemoveGuestMutationHookResult = ReturnType<typeof useRemoveGuestMutation>;
export type RemoveGuestMutationResult = Apollo.MutationResult<RemoveGuestMutation>;
export type RemoveGuestMutationOptions = Apollo.BaseMutationOptions<RemoveGuestMutation, RemoveGuestMutationVariables>;
export const DeleteQuestionDocument = gql`
    mutation DeleteQuestion($questionId: ID!) {
  deleteQuestion(questionId: $questionId) {
    id
  }
}
    `;
export type DeleteQuestionMutationFn = Apollo.MutationFunction<DeleteQuestionMutation, DeleteQuestionMutationVariables>;

/**
 * __useDeleteQuestionMutation__
 *
 * To run a mutation, you first call `useDeleteQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteQuestionMutation, { data, loading, error }] = useDeleteQuestionMutation({
 *   variables: {
 *      questionId: // value for 'questionId'
 *   },
 * });
 */
export function useDeleteQuestionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteQuestionMutation, DeleteQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteQuestionMutation, DeleteQuestionMutationVariables>(DeleteQuestionDocument, options);
      }
export type DeleteQuestionMutationHookResult = ReturnType<typeof useDeleteQuestionMutation>;
export type DeleteQuestionMutationResult = Apollo.MutationResult<DeleteQuestionMutation>;
export type DeleteQuestionMutationOptions = Apollo.BaseMutationOptions<DeleteQuestionMutation, DeleteQuestionMutationVariables>;
export const DeleteAllReviewQuestionsDocument = gql`
    mutation DeleteAllReviewQuestions($eventId: ID!) {
  deleteAllReviewQuestions(eventId: $eventId)
}
    `;
export type DeleteAllReviewQuestionsMutationFn = Apollo.MutationFunction<DeleteAllReviewQuestionsMutation, DeleteAllReviewQuestionsMutationVariables>;

/**
 * __useDeleteAllReviewQuestionsMutation__
 *
 * To run a mutation, you first call `useDeleteAllReviewQuestionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAllReviewQuestionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAllReviewQuestionsMutation, { data, loading, error }] = useDeleteAllReviewQuestionsMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useDeleteAllReviewQuestionsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAllReviewQuestionsMutation, DeleteAllReviewQuestionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAllReviewQuestionsMutation, DeleteAllReviewQuestionsMutationVariables>(DeleteAllReviewQuestionsDocument, options);
      }
export type DeleteAllReviewQuestionsMutationHookResult = ReturnType<typeof useDeleteAllReviewQuestionsMutation>;
export type DeleteAllReviewQuestionsMutationResult = Apollo.MutationResult<DeleteAllReviewQuestionsMutation>;
export type DeleteAllReviewQuestionsMutationOptions = Apollo.BaseMutationOptions<DeleteAllReviewQuestionsMutation, DeleteAllReviewQuestionsMutationVariables>;
export const PublishAllReviewQuestionsDocument = gql`
    mutation PublishAllReviewQuestions($eventId: ID!) {
  publishAllReviewQuestions(eventId: $eventId)
}
    `;
export type PublishAllReviewQuestionsMutationFn = Apollo.MutationFunction<PublishAllReviewQuestionsMutation, PublishAllReviewQuestionsMutationVariables>;

/**
 * __usePublishAllReviewQuestionsMutation__
 *
 * To run a mutation, you first call `usePublishAllReviewQuestionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishAllReviewQuestionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishAllReviewQuestionsMutation, { data, loading, error }] = usePublishAllReviewQuestionsMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function usePublishAllReviewQuestionsMutation(baseOptions?: Apollo.MutationHookOptions<PublishAllReviewQuestionsMutation, PublishAllReviewQuestionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishAllReviewQuestionsMutation, PublishAllReviewQuestionsMutationVariables>(PublishAllReviewQuestionsDocument, options);
      }
export type PublishAllReviewQuestionsMutationHookResult = ReturnType<typeof usePublishAllReviewQuestionsMutation>;
export type PublishAllReviewQuestionsMutationResult = Apollo.MutationResult<PublishAllReviewQuestionsMutation>;
export type PublishAllReviewQuestionsMutationOptions = Apollo.BaseMutationOptions<PublishAllReviewQuestionsMutation, PublishAllReviewQuestionsMutationVariables>;
export const UpdateQuestionReviewStatusDocument = gql`
    mutation UpdateQuestionReviewStatus($questionId: ID!, $reviewStatus: ReviewStatus!) {
  updateQuestionReviewStatus(questionId: $questionId, reviewStatus: $reviewStatus) {
    ...QuestionFields
  }
}
    ${QuestionFieldsFragmentDoc}`;
export type UpdateQuestionReviewStatusMutationFn = Apollo.MutationFunction<UpdateQuestionReviewStatusMutation, UpdateQuestionReviewStatusMutationVariables>;

/**
 * __useUpdateQuestionReviewStatusMutation__
 *
 * To run a mutation, you first call `useUpdateQuestionReviewStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuestionReviewStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuestionReviewStatusMutation, { data, loading, error }] = useUpdateQuestionReviewStatusMutation({
 *   variables: {
 *      questionId: // value for 'questionId'
 *      reviewStatus: // value for 'reviewStatus'
 *   },
 * });
 */
export function useUpdateQuestionReviewStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuestionReviewStatusMutation, UpdateQuestionReviewStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuestionReviewStatusMutation, UpdateQuestionReviewStatusMutationVariables>(UpdateQuestionReviewStatusDocument, options);
      }
export type UpdateQuestionReviewStatusMutationHookResult = ReturnType<typeof useUpdateQuestionReviewStatusMutation>;
export type UpdateQuestionReviewStatusMutationResult = Apollo.MutationResult<UpdateQuestionReviewStatusMutation>;
export type UpdateQuestionReviewStatusMutationOptions = Apollo.BaseMutationOptions<UpdateQuestionReviewStatusMutation, UpdateQuestionReviewStatusMutationVariables>;
export const UpdateQuestionStarDocument = gql`
    mutation UpdateQuestionStar($questionId: ID!, $star: Boolean!) {
  updateQuestionStar(questionId: $questionId, star: $star) {
    ...QuestionFields
  }
}
    ${QuestionFieldsFragmentDoc}`;
export type UpdateQuestionStarMutationFn = Apollo.MutationFunction<UpdateQuestionStarMutation, UpdateQuestionStarMutationVariables>;

/**
 * __useUpdateQuestionStarMutation__
 *
 * To run a mutation, you first call `useUpdateQuestionStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuestionStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuestionStarMutation, { data, loading, error }] = useUpdateQuestionStarMutation({
 *   variables: {
 *      questionId: // value for 'questionId'
 *      star: // value for 'star'
 *   },
 * });
 */
export function useUpdateQuestionStarMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuestionStarMutation, UpdateQuestionStarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuestionStarMutation, UpdateQuestionStarMutationVariables>(UpdateQuestionStarDocument, options);
      }
export type UpdateQuestionStarMutationHookResult = ReturnType<typeof useUpdateQuestionStarMutation>;
export type UpdateQuestionStarMutationResult = Apollo.MutationResult<UpdateQuestionStarMutation>;
export type UpdateQuestionStarMutationOptions = Apollo.BaseMutationOptions<UpdateQuestionStarMutation, UpdateQuestionStarMutationVariables>;
export const UpdateQuestionTopDocument = gql`
    mutation UpdateQuestionTop($questionId: ID!, $top: Boolean!) {
  updateQuestionTop(questionId: $questionId, top: $top) {
    ...QuestionFields
  }
}
    ${QuestionFieldsFragmentDoc}`;
export type UpdateQuestionTopMutationFn = Apollo.MutationFunction<UpdateQuestionTopMutation, UpdateQuestionTopMutationVariables>;

/**
 * __useUpdateQuestionTopMutation__
 *
 * To run a mutation, you first call `useUpdateQuestionTopMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuestionTopMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuestionTopMutation, { data, loading, error }] = useUpdateQuestionTopMutation({
 *   variables: {
 *      questionId: // value for 'questionId'
 *      top: // value for 'top'
 *   },
 * });
 */
export function useUpdateQuestionTopMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuestionTopMutation, UpdateQuestionTopMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuestionTopMutation, UpdateQuestionTopMutationVariables>(UpdateQuestionTopDocument, options);
      }
export type UpdateQuestionTopMutationHookResult = ReturnType<typeof useUpdateQuestionTopMutation>;
export type UpdateQuestionTopMutationResult = Apollo.MutationResult<UpdateQuestionTopMutation>;
export type UpdateQuestionTopMutationOptions = Apollo.BaseMutationOptions<UpdateQuestionTopMutation, UpdateQuestionTopMutationVariables>;
export const UpdateQuestionContentDocument = gql`
    mutation UpdateQuestionContent($questionId: ID!, $content: String!) {
  updateQuestionContent(questionId: $questionId, content: $content) {
    ...QuestionFields
  }
}
    ${QuestionFieldsFragmentDoc}`;
export type UpdateQuestionContentMutationFn = Apollo.MutationFunction<UpdateQuestionContentMutation, UpdateQuestionContentMutationVariables>;

/**
 * __useUpdateQuestionContentMutation__
 *
 * To run a mutation, you first call `useUpdateQuestionContentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuestionContentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuestionContentMutation, { data, loading, error }] = useUpdateQuestionContentMutation({
 *   variables: {
 *      questionId: // value for 'questionId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useUpdateQuestionContentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuestionContentMutation, UpdateQuestionContentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuestionContentMutation, UpdateQuestionContentMutationVariables>(UpdateQuestionContentDocument, options);
      }
export type UpdateQuestionContentMutationHookResult = ReturnType<typeof useUpdateQuestionContentMutation>;
export type UpdateQuestionContentMutationResult = Apollo.MutationResult<UpdateQuestionContentMutation>;
export type UpdateQuestionContentMutationOptions = Apollo.BaseMutationOptions<UpdateQuestionContentMutation, UpdateQuestionContentMutationVariables>;
export const CreateReplyDocument = gql`
    mutation CreateReply($input: CreateReplyInput!) {
  createReply(input: $input) {
    ...ReplyFields
  }
}
    ${ReplyFieldsFragmentDoc}`;
export type CreateReplyMutationFn = Apollo.MutationFunction<CreateReplyMutation, CreateReplyMutationVariables>;

/**
 * __useCreateReplyMutation__
 *
 * To run a mutation, you first call `useCreateReplyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReplyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReplyMutation, { data, loading, error }] = useCreateReplyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateReplyMutation(baseOptions?: Apollo.MutationHookOptions<CreateReplyMutation, CreateReplyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReplyMutation, CreateReplyMutationVariables>(CreateReplyDocument, options);
      }
export type CreateReplyMutationHookResult = ReturnType<typeof useCreateReplyMutation>;
export type CreateReplyMutationResult = Apollo.MutationResult<CreateReplyMutation>;
export type CreateReplyMutationOptions = Apollo.BaseMutationOptions<CreateReplyMutation, CreateReplyMutationVariables>;
export const UpdateReplyContentDocument = gql`
    mutation UpdateReplyContent($replyId: ID!, $content: String!) {
  updateReplyContent(replyId: $replyId, content: $content) {
    ...ReplyFields
  }
}
    ${ReplyFieldsFragmentDoc}`;
export type UpdateReplyContentMutationFn = Apollo.MutationFunction<UpdateReplyContentMutation, UpdateReplyContentMutationVariables>;

/**
 * __useUpdateReplyContentMutation__
 *
 * To run a mutation, you first call `useUpdateReplyContentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReplyContentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReplyContentMutation, { data, loading, error }] = useUpdateReplyContentMutation({
 *   variables: {
 *      replyId: // value for 'replyId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useUpdateReplyContentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReplyContentMutation, UpdateReplyContentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReplyContentMutation, UpdateReplyContentMutationVariables>(UpdateReplyContentDocument, options);
      }
export type UpdateReplyContentMutationHookResult = ReturnType<typeof useUpdateReplyContentMutation>;
export type UpdateReplyContentMutationResult = Apollo.MutationResult<UpdateReplyContentMutation>;
export type UpdateReplyContentMutationOptions = Apollo.BaseMutationOptions<UpdateReplyContentMutation, UpdateReplyContentMutationVariables>;
export const UpdateReplyReviewStatusDocument = gql`
    mutation UpdateReplyReviewStatus($replyId: ID!, $reviewStatus: ReviewStatus!) {
  updateReplyReviewStatus(replyId: $replyId, reviewStatus: $reviewStatus) {
    ...ReplyFields
  }
}
    ${ReplyFieldsFragmentDoc}`;
export type UpdateReplyReviewStatusMutationFn = Apollo.MutationFunction<UpdateReplyReviewStatusMutation, UpdateReplyReviewStatusMutationVariables>;

/**
 * __useUpdateReplyReviewStatusMutation__
 *
 * To run a mutation, you first call `useUpdateReplyReviewStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReplyReviewStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReplyReviewStatusMutation, { data, loading, error }] = useUpdateReplyReviewStatusMutation({
 *   variables: {
 *      replyId: // value for 'replyId'
 *      reviewStatus: // value for 'reviewStatus'
 *   },
 * });
 */
export function useUpdateReplyReviewStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReplyReviewStatusMutation, UpdateReplyReviewStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReplyReviewStatusMutation, UpdateReplyReviewStatusMutationVariables>(UpdateReplyReviewStatusDocument, options);
      }
export type UpdateReplyReviewStatusMutationHookResult = ReturnType<typeof useUpdateReplyReviewStatusMutation>;
export type UpdateReplyReviewStatusMutationResult = Apollo.MutationResult<UpdateReplyReviewStatusMutation>;
export type UpdateReplyReviewStatusMutationOptions = Apollo.BaseMutationOptions<UpdateReplyReviewStatusMutation, UpdateReplyReviewStatusMutationVariables>;
export const DeleteReplyDocument = gql`
    mutation DeleteReply($replyId: ID!) {
  deleteReply(replyId: $replyId) {
    id
  }
}
    `;
export type DeleteReplyMutationFn = Apollo.MutationFunction<DeleteReplyMutation, DeleteReplyMutationVariables>;

/**
 * __useDeleteReplyMutation__
 *
 * To run a mutation, you first call `useDeleteReplyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReplyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReplyMutation, { data, loading, error }] = useDeleteReplyMutation({
 *   variables: {
 *      replyId: // value for 'replyId'
 *   },
 * });
 */
export function useDeleteReplyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReplyMutation, DeleteReplyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReplyMutation, DeleteReplyMutationVariables>(DeleteReplyDocument, options);
      }
export type DeleteReplyMutationHookResult = ReturnType<typeof useDeleteReplyMutation>;
export type DeleteReplyMutationResult = Apollo.MutationResult<DeleteReplyMutation>;
export type DeleteReplyMutationOptions = Apollo.BaseMutationOptions<DeleteReplyMutation, DeleteReplyMutationVariables>;
export const EventsByMeDocument = gql`
    query EventsByMe($searchString: String, $pagination: PaginationInput!, $eventOwnerFilter: EventOwnerFilter, $dateStatusFilter: EventDateStatus) {
  eventsByMe(
    searchString: $searchString
    pagination: $pagination
    eventOwnerFilter: $eventOwnerFilter
    dateStatusFilter: $dateStatusFilter
  ) {
    limit
    offset
    totalCount
    hasNextPage
    list {
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;

/**
 * __useEventsByMeQuery__
 *
 * To run a query within a React component, call `useEventsByMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsByMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsByMeQuery({
 *   variables: {
 *      searchString: // value for 'searchString'
 *      pagination: // value for 'pagination'
 *      eventOwnerFilter: // value for 'eventOwnerFilter'
 *      dateStatusFilter: // value for 'dateStatusFilter'
 *   },
 * });
 */
export function useEventsByMeQuery(baseOptions: Apollo.QueryHookOptions<EventsByMeQuery, EventsByMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventsByMeQuery, EventsByMeQueryVariables>(EventsByMeDocument, options);
      }
export function useEventsByMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsByMeQuery, EventsByMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventsByMeQuery, EventsByMeQueryVariables>(EventsByMeDocument, options);
        }
export type EventsByMeQueryHookResult = ReturnType<typeof useEventsByMeQuery>;
export type EventsByMeLazyQueryHookResult = ReturnType<typeof useEventsByMeLazyQuery>;
export type EventsByMeQueryResult = Apollo.QueryResult<EventsByMeQuery, EventsByMeQueryVariables>;
export const EventByIdDocument = gql`
    query EventById($eventId: ID!) {
  eventById(eventId: $eventId) {
    ...EventDetailFields
  }
}
    ${EventDetailFieldsFragmentDoc}`;

/**
 * __useEventByIdQuery__
 *
 * To run a query within a React component, call `useEventByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventByIdQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useEventByIdQuery(baseOptions: Apollo.QueryHookOptions<EventByIdQuery, EventByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventByIdQuery, EventByIdQueryVariables>(EventByIdDocument, options);
      }
export function useEventByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventByIdQuery, EventByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventByIdQuery, EventByIdQueryVariables>(EventByIdDocument, options);
        }
export type EventByIdQueryHookResult = ReturnType<typeof useEventByIdQuery>;
export type EventByIdLazyQueryHookResult = ReturnType<typeof useEventByIdLazyQuery>;
export type EventByIdQueryResult = Apollo.QueryResult<EventByIdQuery, EventByIdQueryVariables>;
export const CheckEventCodeExistDocument = gql`
    query CheckEventCodeExist($code: String!) {
  checkEventCodeExist(code: $code)
}
    `;

/**
 * __useCheckEventCodeExistQuery__
 *
 * To run a query within a React component, call `useCheckEventCodeExistQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckEventCodeExistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckEventCodeExistQuery({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useCheckEventCodeExistQuery(baseOptions: Apollo.QueryHookOptions<CheckEventCodeExistQuery, CheckEventCodeExistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckEventCodeExistQuery, CheckEventCodeExistQueryVariables>(CheckEventCodeExistDocument, options);
      }
export function useCheckEventCodeExistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckEventCodeExistQuery, CheckEventCodeExistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckEventCodeExistQuery, CheckEventCodeExistQueryVariables>(CheckEventCodeExistDocument, options);
        }
export type CheckEventCodeExistQueryHookResult = ReturnType<typeof useCheckEventCodeExistQuery>;
export type CheckEventCodeExistLazyQueryHookResult = ReturnType<typeof useCheckEventCodeExistLazyQuery>;
export type CheckEventCodeExistQueryResult = Apollo.QueryResult<CheckEventCodeExistQuery, CheckEventCodeExistQueryVariables>;
export const CreateEventDocument = gql`
    mutation CreateEvent($code: String!, $name: String!, $startAt: DateTime!, $endAt: DateTime!) {
  createEvent(code: $code, name: $name, startAt: $startAt, endAt: $endAt) {
    ...EventFields
  }
}
    ${EventFieldsFragmentDoc}`;
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      code: // value for 'code'
 *      name: // value for 'name'
 *      startAt: // value for 'startAt'
 *      endAt: // value for 'endAt'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, options);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const UpdateEventDocument = gql`
    mutation UpdateEvent($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    ...EventDetailFields
  }
}
    ${EventDetailFieldsFragmentDoc}`;
export type UpdateEventMutationFn = Apollo.MutationFunction<UpdateEventMutation, UpdateEventMutationVariables>;

/**
 * __useUpdateEventMutation__
 *
 * To run a mutation, you first call `useUpdateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventMutation, { data, loading, error }] = useUpdateEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEventMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventMutation, UpdateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument, options);
      }
export type UpdateEventMutationHookResult = ReturnType<typeof useUpdateEventMutation>;
export type UpdateEventMutationResult = Apollo.MutationResult<UpdateEventMutation>;
export type UpdateEventMutationOptions = Apollo.BaseMutationOptions<UpdateEventMutation, UpdateEventMutationVariables>;
export const DeleteEventDocument = gql`
    mutation DeleteEvent($eventId: ID!) {
  deleteEvent(eventId: $eventId) {
    id
  }
}
    `;
export type DeleteEventMutationFn = Apollo.MutationFunction<DeleteEventMutation, DeleteEventMutationVariables>;

/**
 * __useDeleteEventMutation__
 *
 * To run a mutation, you first call `useDeleteEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventMutation, { data, loading, error }] = useDeleteEventMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useDeleteEventMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventMutation, DeleteEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEventMutation, DeleteEventMutationVariables>(DeleteEventDocument, options);
      }
export type DeleteEventMutationHookResult = ReturnType<typeof useDeleteEventMutation>;
export type DeleteEventMutationResult = Apollo.MutationResult<DeleteEventMutation>;
export type DeleteEventMutationOptions = Apollo.BaseMutationOptions<DeleteEventMutation, DeleteEventMutationVariables>;
export const PgpDocument = gql`
    query PGP {
  pgp {
    pubKey
  }
}
    `;

/**
 * __usePgpQuery__
 *
 * To run a query within a React component, call `usePgpQuery` and pass it any options that fit your needs.
 * When your component renders, `usePgpQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePgpQuery({
 *   variables: {
 *   },
 * });
 */
export function usePgpQuery(baseOptions?: Apollo.QueryHookOptions<PgpQuery, PgpQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PgpQuery, PgpQueryVariables>(PgpDocument, options);
      }
export function usePgpLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PgpQuery, PgpQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PgpQuery, PgpQueryVariables>(PgpDocument, options);
        }
export type PgpQueryHookResult = ReturnType<typeof usePgpQuery>;
export type PgpLazyQueryHookResult = ReturnType<typeof usePgpLazyQuery>;
export type PgpQueryResult = Apollo.QueryResult<PgpQuery, PgpQueryVariables>;
export const PackageInfoDocument = gql`
    mutation PackageInfo($version: String, $description: String) {
  packageInfo(version: $version, description: $description) @client {
    version
    description
  }
}
    `;
export type PackageInfoMutationFn = Apollo.MutationFunction<PackageInfoMutation, PackageInfoMutationVariables>;

/**
 * __usePackageInfoMutation__
 *
 * To run a mutation, you first call `usePackageInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePackageInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [packageInfoMutation, { data, loading, error }] = usePackageInfoMutation({
 *   variables: {
 *      version: // value for 'version'
 *      description: // value for 'description'
 *   },
 * });
 */
export function usePackageInfoMutation(baseOptions?: Apollo.MutationHookOptions<PackageInfoMutation, PackageInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PackageInfoMutation, PackageInfoMutationVariables>(PackageInfoDocument, options);
      }
export type PackageInfoMutationHookResult = ReturnType<typeof usePackageInfoMutation>;
export type PackageInfoMutationResult = Apollo.MutationResult<PackageInfoMutation>;
export type PackageInfoMutationOptions = Apollo.BaseMutationOptions<PackageInfoMutation, PackageInfoMutationVariables>;
export const EventForLoginDocument = gql`
    query EventForLogin($eventId: ID!) {
  eventById(eventId: $eventId) {
    id
    name
    code
    startAt
    endAt
  }
}
    `;

/**
 * __useEventForLoginQuery__
 *
 * To run a query within a React component, call `useEventForLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventForLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventForLoginQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useEventForLoginQuery(baseOptions: Apollo.QueryHookOptions<EventForLoginQuery, EventForLoginQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventForLoginQuery, EventForLoginQueryVariables>(EventForLoginDocument, options);
      }
export function useEventForLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventForLoginQuery, EventForLoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventForLoginQuery, EventForLoginQueryVariables>(EventForLoginDocument, options);
        }
export type EventForLoginQueryHookResult = ReturnType<typeof useEventForLoginQuery>;
export type EventForLoginLazyQueryHookResult = ReturnType<typeof useEventForLoginLazyQuery>;
export type EventForLoginQueryResult = Apollo.QueryResult<EventForLoginQuery, EventForLoginQueryVariables>;
export const CreateQuestionDocument = gql`
    mutation CreateQuestion($input: CreateQuestionInput!) {
  createQuestion(input: $input) {
    ...QuestionAudienceFields
  }
}
    ${QuestionAudienceFieldsFragmentDoc}`;
export type CreateQuestionMutationFn = Apollo.MutationFunction<CreateQuestionMutation, CreateQuestionMutationVariables>;

/**
 * __useCreateQuestionMutation__
 *
 * To run a mutation, you first call `useCreateQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuestionMutation, { data, loading, error }] = useCreateQuestionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateQuestionMutation(baseOptions?: Apollo.MutationHookOptions<CreateQuestionMutation, CreateQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateQuestionMutation, CreateQuestionMutationVariables>(CreateQuestionDocument, options);
      }
export type CreateQuestionMutationHookResult = ReturnType<typeof useCreateQuestionMutation>;
export type CreateQuestionMutationResult = Apollo.MutationResult<CreateQuestionMutation>;
export type CreateQuestionMutationOptions = Apollo.BaseMutationOptions<CreateQuestionMutation, CreateQuestionMutationVariables>;
export const VoteUpQuestionDocument = gql`
    mutation VoteUpQuestion($questionId: ID!) {
  voteUpQuestion(questionId: $questionId) {
    ...QuestionAudienceFields
  }
}
    ${QuestionAudienceFieldsFragmentDoc}`;
export type VoteUpQuestionMutationFn = Apollo.MutationFunction<VoteUpQuestionMutation, VoteUpQuestionMutationVariables>;

/**
 * __useVoteUpQuestionMutation__
 *
 * To run a mutation, you first call `useVoteUpQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteUpQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteUpQuestionMutation, { data, loading, error }] = useVoteUpQuestionMutation({
 *   variables: {
 *      questionId: // value for 'questionId'
 *   },
 * });
 */
export function useVoteUpQuestionMutation(baseOptions?: Apollo.MutationHookOptions<VoteUpQuestionMutation, VoteUpQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteUpQuestionMutation, VoteUpQuestionMutationVariables>(VoteUpQuestionDocument, options);
      }
export type VoteUpQuestionMutationHookResult = ReturnType<typeof useVoteUpQuestionMutation>;
export type VoteUpQuestionMutationResult = Apollo.MutationResult<VoteUpQuestionMutation>;
export type VoteUpQuestionMutationOptions = Apollo.BaseMutationOptions<VoteUpQuestionMutation, VoteUpQuestionMutationVariables>;
export const LoginAudienceDocument = gql`
    mutation LoginAudience($fingerprint: String!) {
  loginAudience(fingerprint: $fingerprint) {
    token
    user {
      name
    }
  }
}
    `;
export type LoginAudienceMutationFn = Apollo.MutationFunction<LoginAudienceMutation, LoginAudienceMutationVariables>;

/**
 * __useLoginAudienceMutation__
 *
 * To run a mutation, you first call `useLoginAudienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginAudienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginAudienceMutation, { data, loading, error }] = useLoginAudienceMutation({
 *   variables: {
 *      fingerprint: // value for 'fingerprint'
 *   },
 * });
 */
export function useLoginAudienceMutation(baseOptions?: Apollo.MutationHookOptions<LoginAudienceMutation, LoginAudienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginAudienceMutation, LoginAudienceMutationVariables>(LoginAudienceDocument, options);
      }
export type LoginAudienceMutationHookResult = ReturnType<typeof useLoginAudienceMutation>;
export type LoginAudienceMutationResult = Apollo.MutationResult<LoginAudienceMutation>;
export type LoginAudienceMutationOptions = Apollo.BaseMutationOptions<LoginAudienceMutation, LoginAudienceMutationVariables>;
export const IsEventAudienceDocument = gql`
    query IsEventAudience($eventId: ID!) {
  isEventAudience(eventId: $eventId)
}
    `;

/**
 * __useIsEventAudienceQuery__
 *
 * To run a query within a React component, call `useIsEventAudienceQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsEventAudienceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsEventAudienceQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useIsEventAudienceQuery(baseOptions: Apollo.QueryHookOptions<IsEventAudienceQuery, IsEventAudienceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsEventAudienceQuery, IsEventAudienceQueryVariables>(IsEventAudienceDocument, options);
      }
export function useIsEventAudienceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsEventAudienceQuery, IsEventAudienceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsEventAudienceQuery, IsEventAudienceQueryVariables>(IsEventAudienceDocument, options);
        }
export type IsEventAudienceQueryHookResult = ReturnType<typeof useIsEventAudienceQuery>;
export type IsEventAudienceLazyQueryHookResult = ReturnType<typeof useIsEventAudienceLazyQuery>;
export type IsEventAudienceQueryResult = Apollo.QueryResult<IsEventAudienceQuery, IsEventAudienceQueryVariables>;
export const JoinEventDocument = gql`
    mutation JoinEvent($eventId: ID!) {
  joinEvent(eventId: $eventId)
}
    `;
export type JoinEventMutationFn = Apollo.MutationFunction<JoinEventMutation, JoinEventMutationVariables>;

/**
 * __useJoinEventMutation__
 *
 * To run a mutation, you first call `useJoinEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinEventMutation, { data, loading, error }] = useJoinEventMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useJoinEventMutation(baseOptions?: Apollo.MutationHookOptions<JoinEventMutation, JoinEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinEventMutation, JoinEventMutationVariables>(JoinEventDocument, options);
      }
export type JoinEventMutationHookResult = ReturnType<typeof useJoinEventMutation>;
export type JoinEventMutationResult = Apollo.MutationResult<JoinEventMutation>;
export type JoinEventMutationOptions = Apollo.BaseMutationOptions<JoinEventMutation, JoinEventMutationVariables>;
export const EventCodeOptionsDocument = gql`
    query EventCodeOptions($code: String) {
  eventsByCode(code: $code) {
    id
    code
    name
    startAt
    endAt
  }
}
    `;

/**
 * __useEventCodeOptionsQuery__
 *
 * To run a query within a React component, call `useEventCodeOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventCodeOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventCodeOptionsQuery({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useEventCodeOptionsQuery(baseOptions?: Apollo.QueryHookOptions<EventCodeOptionsQuery, EventCodeOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventCodeOptionsQuery, EventCodeOptionsQueryVariables>(EventCodeOptionsDocument, options);
      }
export function useEventCodeOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventCodeOptionsQuery, EventCodeOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventCodeOptionsQuery, EventCodeOptionsQueryVariables>(EventCodeOptionsDocument, options);
        }
export type EventCodeOptionsQueryHookResult = ReturnType<typeof useEventCodeOptionsQuery>;
export type EventCodeOptionsLazyQueryHookResult = ReturnType<typeof useEventCodeOptionsLazyQuery>;
export type EventCodeOptionsQueryResult = Apollo.QueryResult<EventCodeOptionsQuery, EventCodeOptionsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(password: $password, email: $email) {
    token
    user {
      name
      email
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const SignupDocument = gql`
    mutation Signup($name: String!, $email: String!, $password: String!) {
  signup(name: $name, password: $password, email: $email) {
    token
    user {
      name
      email
    }
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const CheckEmailExistDocument = gql`
    query CheckEmailExist($email: String!) {
  checkEmailExist(email: $email)
}
    `;

/**
 * __useCheckEmailExistQuery__
 *
 * To run a query within a React component, call `useCheckEmailExistQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckEmailExistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckEmailExistQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCheckEmailExistQuery(baseOptions: Apollo.QueryHookOptions<CheckEmailExistQuery, CheckEmailExistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckEmailExistQuery, CheckEmailExistQueryVariables>(CheckEmailExistDocument, options);
      }
export function useCheckEmailExistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckEmailExistQuery, CheckEmailExistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckEmailExistQuery, CheckEmailExistQueryVariables>(CheckEmailExistDocument, options);
        }
export type CheckEmailExistQueryHookResult = ReturnType<typeof useCheckEmailExistQuery>;
export type CheckEmailExistLazyQueryHookResult = ReturnType<typeof useCheckEmailExistLazyQuery>;
export type CheckEmailExistQueryResult = Apollo.QueryResult<CheckEmailExistQuery, CheckEmailExistQueryVariables>;