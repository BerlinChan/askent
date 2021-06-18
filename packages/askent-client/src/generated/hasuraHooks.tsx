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
  question_reviewstatus_enum: any;
  reply_reviewstatus_enum: any;
  role_name_enum: any;
  timestamp: any;
  uuid: any;
};

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: Maybe<Scalars['Boolean']>;
  _gt?: Maybe<Scalars['Boolean']>;
  _gte?: Maybe<Scalars['Boolean']>;
  _in?: Maybe<Array<Scalars['Boolean']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Boolean']>;
  _lte?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Scalars['Boolean']>;
  _nin?: Maybe<Array<Scalars['Boolean']>>;
};

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: Maybe<Scalars['Int']>;
  _gt?: Maybe<Scalars['Int']>;
  _gte?: Maybe<Scalars['Int']>;
  _in?: Maybe<Array<Scalars['Int']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Int']>;
  _lte?: Maybe<Scalars['Int']>;
  _neq?: Maybe<Scalars['Int']>;
  _nin?: Maybe<Array<Scalars['Int']>>;
};

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  _nlike?: Maybe<Scalars['String']>;
  _nsimilar?: Maybe<Scalars['String']>;
  _similar?: Maybe<Scalars['String']>;
};

/** columns and relationships of "event" */
export type Event = {
  __typename?: 'event';
  /** An array relationship */
  audiences: Array<EventAudiences>;
  /** An aggregated array relationship */
  audiences_aggregate: EventAudiences_Aggregate;
  code: Scalars['String'];
  createdAt: Scalars['timestamp'];
  deletedAt?: Maybe<Scalars['timestamp']>;
  endAt: Scalars['timestamp'];
  /** An array relationship */
  guestes: Array<EventGuestes>;
  /** An aggregated array relationship */
  guestes_aggregate: EventGuestes_Aggregate;
  id: Scalars['uuid'];
  moderation?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  /** An object relationship */
  owner?: Maybe<User>;
  ownerId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  questions: Array<Question>;
  /** An aggregated array relationship */
  questions_aggregate: Question_Aggregate;
  startAt: Scalars['timestamp'];
  updatedAt: Scalars['timestamp'];
};


/** columns and relationships of "event" */
export type EventAudiencesArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


/** columns and relationships of "event" */
export type EventAudiences_AggregateArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


/** columns and relationships of "event" */
export type EventGuestesArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


/** columns and relationships of "event" */
export type EventGuestes_AggregateArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


/** columns and relationships of "event" */
export type EventQuestionsArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


/** columns and relationships of "event" */
export type EventQuestions_AggregateArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};

/** columns and relationships of "eventAudiences" */
export type EventAudiences = {
  __typename?: 'eventAudiences';
  /** An object relationship */
  event: Event;
  eventId: Scalars['uuid'];
  /** An object relationship */
  user: User;
  userId: Scalars['uuid'];
};

/** aggregated selection of "eventAudiences" */
export type EventAudiences_Aggregate = {
  __typename?: 'eventAudiences_aggregate';
  aggregate?: Maybe<EventAudiences_Aggregate_Fields>;
  nodes: Array<EventAudiences>;
};

/** aggregate fields of "eventAudiences" */
export type EventAudiences_Aggregate_Fields = {
  __typename?: 'eventAudiences_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<EventAudiences_Max_Fields>;
  min?: Maybe<EventAudiences_Min_Fields>;
};


/** aggregate fields of "eventAudiences" */
export type EventAudiences_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<EventAudiences_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "eventAudiences" */
export type EventAudiences_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<EventAudiences_Max_Order_By>;
  min?: Maybe<EventAudiences_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "eventAudiences". All fields are combined with a logical 'AND'. */
export type EventAudiences_Bool_Exp = {
  _and?: Maybe<Array<Maybe<EventAudiences_Bool_Exp>>>;
  _not?: Maybe<EventAudiences_Bool_Exp>;
  _or?: Maybe<Array<Maybe<EventAudiences_Bool_Exp>>>;
  event?: Maybe<Event_Bool_Exp>;
  eventId?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  userId?: Maybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type EventAudiences_Max_Fields = {
  __typename?: 'eventAudiences_max_fields';
  eventId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "eventAudiences" */
export type EventAudiences_Max_Order_By = {
  eventId?: Maybe<Order_By>;
  userId?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type EventAudiences_Min_Fields = {
  __typename?: 'eventAudiences_min_fields';
  eventId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "eventAudiences" */
export type EventAudiences_Min_Order_By = {
  eventId?: Maybe<Order_By>;
  userId?: Maybe<Order_By>;
};

/** ordering options when selecting data from "eventAudiences" */
export type EventAudiences_Order_By = {
  event?: Maybe<Event_Order_By>;
  eventId?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  userId?: Maybe<Order_By>;
};

/** primary key columns input for table: "eventAudiences" */
export type EventAudiences_Pk_Columns_Input = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};

/** select columns of table "eventAudiences" */
export enum EventAudiences_Select_Column {
  /** column name */
  EventId = 'eventId',
  /** column name */
  UserId = 'userId'
}

/** columns and relationships of "eventGuestes" */
export type EventGuestes = {
  __typename?: 'eventGuestes';
  /** An object relationship */
  event: Event;
  eventId: Scalars['uuid'];
  /** An object relationship */
  user: User;
  userId: Scalars['uuid'];
};

/** aggregated selection of "eventGuestes" */
export type EventGuestes_Aggregate = {
  __typename?: 'eventGuestes_aggregate';
  aggregate?: Maybe<EventGuestes_Aggregate_Fields>;
  nodes: Array<EventGuestes>;
};

/** aggregate fields of "eventGuestes" */
export type EventGuestes_Aggregate_Fields = {
  __typename?: 'eventGuestes_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<EventGuestes_Max_Fields>;
  min?: Maybe<EventGuestes_Min_Fields>;
};


/** aggregate fields of "eventGuestes" */
export type EventGuestes_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<EventGuestes_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "eventGuestes" */
export type EventGuestes_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<EventGuestes_Max_Order_By>;
  min?: Maybe<EventGuestes_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "eventGuestes". All fields are combined with a logical 'AND'. */
export type EventGuestes_Bool_Exp = {
  _and?: Maybe<Array<Maybe<EventGuestes_Bool_Exp>>>;
  _not?: Maybe<EventGuestes_Bool_Exp>;
  _or?: Maybe<Array<Maybe<EventGuestes_Bool_Exp>>>;
  event?: Maybe<Event_Bool_Exp>;
  eventId?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  userId?: Maybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type EventGuestes_Max_Fields = {
  __typename?: 'eventGuestes_max_fields';
  eventId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "eventGuestes" */
export type EventGuestes_Max_Order_By = {
  eventId?: Maybe<Order_By>;
  userId?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type EventGuestes_Min_Fields = {
  __typename?: 'eventGuestes_min_fields';
  eventId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "eventGuestes" */
export type EventGuestes_Min_Order_By = {
  eventId?: Maybe<Order_By>;
  userId?: Maybe<Order_By>;
};

/** ordering options when selecting data from "eventGuestes" */
export type EventGuestes_Order_By = {
  event?: Maybe<Event_Order_By>;
  eventId?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  userId?: Maybe<Order_By>;
};

/** primary key columns input for table: "eventGuestes" */
export type EventGuestes_Pk_Columns_Input = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};

/** select columns of table "eventGuestes" */
export enum EventGuestes_Select_Column {
  /** column name */
  EventId = 'eventId',
  /** column name */
  UserId = 'userId'
}

/** aggregated selection of "event" */
export type Event_Aggregate = {
  __typename?: 'event_aggregate';
  aggregate?: Maybe<Event_Aggregate_Fields>;
  nodes: Array<Event>;
};

/** aggregate fields of "event" */
export type Event_Aggregate_Fields = {
  __typename?: 'event_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Event_Max_Fields>;
  min?: Maybe<Event_Min_Fields>;
};


/** aggregate fields of "event" */
export type Event_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Event_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "event" */
export type Event_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Event_Max_Order_By>;
  min?: Maybe<Event_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "event". All fields are combined with a logical 'AND'. */
export type Event_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Event_Bool_Exp>>>;
  _not?: Maybe<Event_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Event_Bool_Exp>>>;
  audiences?: Maybe<EventAudiences_Bool_Exp>;
  code?: Maybe<String_Comparison_Exp>;
  createdAt?: Maybe<Timestamp_Comparison_Exp>;
  deletedAt?: Maybe<Timestamp_Comparison_Exp>;
  endAt?: Maybe<Timestamp_Comparison_Exp>;
  guestes?: Maybe<EventGuestes_Bool_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  moderation?: Maybe<Boolean_Comparison_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  owner?: Maybe<User_Bool_Exp>;
  ownerId?: Maybe<Uuid_Comparison_Exp>;
  questions?: Maybe<Question_Bool_Exp>;
  startAt?: Maybe<Timestamp_Comparison_Exp>;
  updatedAt?: Maybe<Timestamp_Comparison_Exp>;
};

/** aggregate max on columns */
export type Event_Max_Fields = {
  __typename?: 'event_max_fields';
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  endAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['uuid']>;
  startAt?: Maybe<Scalars['timestamp']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "event" */
export type Event_Max_Order_By = {
  code?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  endAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  ownerId?: Maybe<Order_By>;
  startAt?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Event_Min_Fields = {
  __typename?: 'event_min_fields';
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  endAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['uuid']>;
  startAt?: Maybe<Scalars['timestamp']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "event" */
export type Event_Min_Order_By = {
  code?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  endAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  ownerId?: Maybe<Order_By>;
  startAt?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** ordering options when selecting data from "event" */
export type Event_Order_By = {
  audiences_aggregate?: Maybe<EventAudiences_Aggregate_Order_By>;
  code?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  endAt?: Maybe<Order_By>;
  guestes_aggregate?: Maybe<EventGuestes_Aggregate_Order_By>;
  id?: Maybe<Order_By>;
  moderation?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  owner?: Maybe<User_Order_By>;
  ownerId?: Maybe<Order_By>;
  questions_aggregate?: Maybe<Question_Aggregate_Order_By>;
  startAt?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** primary key columns input for table: "event" */
export type Event_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "event" */
export enum Event_Select_Column {
  /** column name */
  Code = 'code',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  EndAt = 'endAt',
  /** column name */
  Id = 'id',
  /** column name */
  Moderation = 'moderation',
  /** column name */
  Name = 'name',
  /** column name */
  OwnerId = 'ownerId',
  /** column name */
  StartAt = 'startAt',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** column ordering options */
export enum Order_By {
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** query root */
export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "event" */
  event: Array<Event>;
  /** fetch data from the table: "eventAudiences" */
  eventAudiences: Array<EventAudiences>;
  /** fetch aggregated fields from the table: "eventAudiences" */
  eventAudiences_aggregate: EventAudiences_Aggregate;
  /** fetch data from the table: "eventAudiences" using primary key columns */
  eventAudiences_by_pk?: Maybe<EventAudiences>;
  /** fetch data from the table: "eventGuestes" */
  eventGuestes: Array<EventGuestes>;
  /** fetch aggregated fields from the table: "eventGuestes" */
  eventGuestes_aggregate: EventGuestes_Aggregate;
  /** fetch data from the table: "eventGuestes" using primary key columns */
  eventGuestes_by_pk?: Maybe<EventGuestes>;
  /** fetch aggregated fields from the table: "event" */
  event_aggregate: Event_Aggregate;
  /** fetch data from the table: "event" using primary key columns */
  event_by_pk?: Maybe<Event>;
  /** fetch data from the table: "question" */
  question: Array<Question>;
  /** fetch aggregated fields from the table: "question" */
  question_aggregate: Question_Aggregate;
  /** fetch data from the table: "question" using primary key columns */
  question_by_pk?: Maybe<Question>;
  /** fetch data from the table: "question_query_meta" */
  question_query_meta: Array<Question_Query_Meta>;
  /** fetch aggregated fields from the table: "question_query_meta" */
  question_query_meta_aggregate: Question_Query_Meta_Aggregate;
  /** fetch data from the table: "question_query_meta" using primary key columns */
  question_query_meta_by_pk?: Maybe<Question_Query_Meta>;
  /** fetch data from the table: "reply" */
  reply: Array<Reply>;
  /** fetch aggregated fields from the table: "reply" */
  reply_aggregate: Reply_Aggregate;
  /** fetch data from the table: "reply" using primary key columns */
  reply_by_pk?: Maybe<Reply>;
  /** fetch data from the table: "reply_query_meta" */
  reply_query_meta: Array<Reply_Query_Meta>;
  /** fetch aggregated fields from the table: "reply_query_meta" */
  reply_query_meta_aggregate: Reply_Query_Meta_Aggregate;
  /** fetch data from the table: "reply_query_meta" using primary key columns */
  reply_query_meta_by_pk?: Maybe<Reply_Query_Meta>;
  /** fetch data from the table: "role" */
  role: Array<Role>;
  /** fetch aggregated fields from the table: "role" */
  role_aggregate: Role_Aggregate;
  /** fetch data from the table: "role" using primary key columns */
  role_by_pk?: Maybe<Role>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch data from the table: "userRoles" */
  userRoles: Array<UserRoles>;
  /** fetch aggregated fields from the table: "userRoles" */
  userRoles_aggregate: UserRoles_Aggregate;
  /** fetch data from the table: "userRoles" using primary key columns */
  userRoles_by_pk?: Maybe<UserRoles>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "usersVoteUpQuestions" */
  usersVoteUpQuestions: Array<UsersVoteUpQuestions>;
  /** fetch aggregated fields from the table: "usersVoteUpQuestions" */
  usersVoteUpQuestions_aggregate: UsersVoteUpQuestions_Aggregate;
  /** fetch data from the table: "usersVoteUpQuestions" using primary key columns */
  usersVoteUpQuestions_by_pk?: Maybe<UsersVoteUpQuestions>;
};


/** query root */
export type Query_RootEventArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


/** query root */
export type Query_RootEventAudiencesArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


/** query root */
export type Query_RootEventAudiences_AggregateArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


/** query root */
export type Query_RootEventAudiences_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** query root */
export type Query_RootEventGuestesArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


/** query root */
export type Query_RootEventGuestes_AggregateArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


/** query root */
export type Query_RootEventGuestes_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** query root */
export type Query_RootEvent_AggregateArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


/** query root */
export type Query_RootEvent_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootQuestionArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


/** query root */
export type Query_RootQuestion_AggregateArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


/** query root */
export type Query_RootQuestion_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootQuestion_Query_MetaArgs = {
  distinct_on?: Maybe<Array<Question_Query_Meta_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Query_Meta_Order_By>>;
  where?: Maybe<Question_Query_Meta_Bool_Exp>;
};


/** query root */
export type Query_RootQuestion_Query_Meta_AggregateArgs = {
  distinct_on?: Maybe<Array<Question_Query_Meta_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Query_Meta_Order_By>>;
  where?: Maybe<Question_Query_Meta_Bool_Exp>;
};


/** query root */
export type Query_RootQuestion_Query_Meta_By_PkArgs = {
  id: Scalars['String'];
};


/** query root */
export type Query_RootReplyArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


/** query root */
export type Query_RootReply_AggregateArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


/** query root */
export type Query_RootReply_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootReply_Query_MetaArgs = {
  distinct_on?: Maybe<Array<Reply_Query_Meta_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Query_Meta_Order_By>>;
  where?: Maybe<Reply_Query_Meta_Bool_Exp>;
};


/** query root */
export type Query_RootReply_Query_Meta_AggregateArgs = {
  distinct_on?: Maybe<Array<Reply_Query_Meta_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Query_Meta_Order_By>>;
  where?: Maybe<Reply_Query_Meta_Bool_Exp>;
};


/** query root */
export type Query_RootReply_Query_Meta_By_PkArgs = {
  id: Scalars['String'];
};


/** query root */
export type Query_RootRoleArgs = {
  distinct_on?: Maybe<Array<Role_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Role_Order_By>>;
  where?: Maybe<Role_Bool_Exp>;
};


/** query root */
export type Query_RootRole_AggregateArgs = {
  distinct_on?: Maybe<Array<Role_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Role_Order_By>>;
  where?: Maybe<Role_Bool_Exp>;
};


/** query root */
export type Query_RootRole_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootUserArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


/** query root */
export type Query_RootUserRolesArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


/** query root */
export type Query_RootUserRoles_AggregateArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


/** query root */
export type Query_RootUserRoles_By_PkArgs = {
  roleId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** query root */
export type Query_RootUser_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


/** query root */
export type Query_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootUsersVoteUpQuestionsArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


/** query root */
export type Query_RootUsersVoteUpQuestions_AggregateArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


/** query root */
export type Query_RootUsersVoteUpQuestions_By_PkArgs = {
  questionId: Scalars['uuid'];
  userId: Scalars['uuid'];
};

/** columns and relationships of "question" */
export type Question = {
  __typename?: 'question';
  anonymous: Scalars['Boolean'];
  /** An object relationship */
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['uuid']>;
  content: Scalars['String'];
  createdAt: Scalars['timestamp'];
  deletedAt?: Maybe<Scalars['timestamp']>;
  /** An object relationship */
  event?: Maybe<Event>;
  eventId?: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  /** An array relationship */
  replies: Array<Reply>;
  /** An aggregated array relationship */
  replies_aggregate: Reply_Aggregate;
  replyCount: Scalars['Int'];
  reviewStatus: Scalars['question_reviewstatus_enum'];
  star: Scalars['Boolean'];
  top: Scalars['Boolean'];
  updatedAt: Scalars['timestamp'];
  voteUpCount: Scalars['Int'];
  /** An array relationship */
  voteUpUsers: Array<UsersVoteUpQuestions>;
  /** An aggregated array relationship */
  voteUpUsers_aggregate: UsersVoteUpQuestions_Aggregate;
};


/** columns and relationships of "question" */
export type QuestionRepliesArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


/** columns and relationships of "question" */
export type QuestionReplies_AggregateArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


/** columns and relationships of "question" */
export type QuestionVoteUpUsersArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


/** columns and relationships of "question" */
export type QuestionVoteUpUsers_AggregateArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};

/** aggregated selection of "question" */
export type Question_Aggregate = {
  __typename?: 'question_aggregate';
  aggregate?: Maybe<Question_Aggregate_Fields>;
  nodes: Array<Question>;
};

/** aggregate fields of "question" */
export type Question_Aggregate_Fields = {
  __typename?: 'question_aggregate_fields';
  avg?: Maybe<Question_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Question_Max_Fields>;
  min?: Maybe<Question_Min_Fields>;
  stddev?: Maybe<Question_Stddev_Fields>;
  stddev_pop?: Maybe<Question_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Question_Stddev_Samp_Fields>;
  sum?: Maybe<Question_Sum_Fields>;
  var_pop?: Maybe<Question_Var_Pop_Fields>;
  var_samp?: Maybe<Question_Var_Samp_Fields>;
  variance?: Maybe<Question_Variance_Fields>;
};


/** aggregate fields of "question" */
export type Question_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Question_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "question" */
export type Question_Aggregate_Order_By = {
  avg?: Maybe<Question_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Question_Max_Order_By>;
  min?: Maybe<Question_Min_Order_By>;
  stddev?: Maybe<Question_Stddev_Order_By>;
  stddev_pop?: Maybe<Question_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Question_Stddev_Samp_Order_By>;
  sum?: Maybe<Question_Sum_Order_By>;
  var_pop?: Maybe<Question_Var_Pop_Order_By>;
  var_samp?: Maybe<Question_Var_Samp_Order_By>;
  variance?: Maybe<Question_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Question_Avg_Fields = {
  __typename?: 'question_avg_fields';
  replyCount?: Maybe<Scalars['Float']>;
  voteUpCount?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "question" */
export type Question_Avg_Order_By = {
  replyCount?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "question". All fields are combined with a logical 'AND'. */
export type Question_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Question_Bool_Exp>>>;
  _not?: Maybe<Question_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Question_Bool_Exp>>>;
  anonymous?: Maybe<Boolean_Comparison_Exp>;
  author?: Maybe<User_Bool_Exp>;
  authorId?: Maybe<Uuid_Comparison_Exp>;
  content?: Maybe<String_Comparison_Exp>;
  createdAt?: Maybe<Timestamp_Comparison_Exp>;
  deletedAt?: Maybe<Timestamp_Comparison_Exp>;
  event?: Maybe<Event_Bool_Exp>;
  eventId?: Maybe<Uuid_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  replies?: Maybe<Reply_Bool_Exp>;
  replyCount?: Maybe<Int_Comparison_Exp>;
  reviewStatus?: Maybe<Question_Reviewstatus_Enum_Comparison_Exp>;
  star?: Maybe<Boolean_Comparison_Exp>;
  top?: Maybe<Boolean_Comparison_Exp>;
  updatedAt?: Maybe<Timestamp_Comparison_Exp>;
  voteUpCount?: Maybe<Int_Comparison_Exp>;
  voteUpUsers?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};

/** aggregate max on columns */
export type Question_Max_Fields = {
  __typename?: 'question_max_fields';
  authorId?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  eventId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  replyCount?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
  voteUpCount?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "question" */
export type Question_Max_Order_By = {
  authorId?: Maybe<Order_By>;
  content?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  eventId?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  replyCount?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Question_Min_Fields = {
  __typename?: 'question_min_fields';
  authorId?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  eventId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  replyCount?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
  voteUpCount?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "question" */
export type Question_Min_Order_By = {
  authorId?: Maybe<Order_By>;
  content?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  eventId?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  replyCount?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** ordering options when selecting data from "question" */
export type Question_Order_By = {
  anonymous?: Maybe<Order_By>;
  author?: Maybe<User_Order_By>;
  authorId?: Maybe<Order_By>;
  content?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  event?: Maybe<Event_Order_By>;
  eventId?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  replies_aggregate?: Maybe<Reply_Aggregate_Order_By>;
  replyCount?: Maybe<Order_By>;
  reviewStatus?: Maybe<Order_By>;
  star?: Maybe<Order_By>;
  top?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
  voteUpUsers_aggregate?: Maybe<UsersVoteUpQuestions_Aggregate_Order_By>;
};

/** primary key columns input for table: "question" */
export type Question_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** columns and relationships of "question_query_meta" */
export type Question_Query_Meta = {
  __typename?: 'question_query_meta';
  createdAt: Scalars['timestamp'];
  /** Id value is query's hash */
  id: Scalars['String'];
  list: Scalars['String'];
  query: Scalars['String'];
  updatedAt: Scalars['timestamp'];
};

/** aggregated selection of "question_query_meta" */
export type Question_Query_Meta_Aggregate = {
  __typename?: 'question_query_meta_aggregate';
  aggregate?: Maybe<Question_Query_Meta_Aggregate_Fields>;
  nodes: Array<Question_Query_Meta>;
};

/** aggregate fields of "question_query_meta" */
export type Question_Query_Meta_Aggregate_Fields = {
  __typename?: 'question_query_meta_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Question_Query_Meta_Max_Fields>;
  min?: Maybe<Question_Query_Meta_Min_Fields>;
};


/** aggregate fields of "question_query_meta" */
export type Question_Query_Meta_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Question_Query_Meta_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "question_query_meta" */
export type Question_Query_Meta_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Question_Query_Meta_Max_Order_By>;
  min?: Maybe<Question_Query_Meta_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "question_query_meta". All fields are combined with a logical 'AND'. */
export type Question_Query_Meta_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Question_Query_Meta_Bool_Exp>>>;
  _not?: Maybe<Question_Query_Meta_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Question_Query_Meta_Bool_Exp>>>;
  createdAt?: Maybe<Timestamp_Comparison_Exp>;
  id?: Maybe<String_Comparison_Exp>;
  list?: Maybe<String_Comparison_Exp>;
  query?: Maybe<String_Comparison_Exp>;
  updatedAt?: Maybe<Timestamp_Comparison_Exp>;
};

/** aggregate max on columns */
export type Question_Query_Meta_Max_Fields = {
  __typename?: 'question_query_meta_max_fields';
  createdAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['String']>;
  list?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "question_query_meta" */
export type Question_Query_Meta_Max_Order_By = {
  createdAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  list?: Maybe<Order_By>;
  query?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Question_Query_Meta_Min_Fields = {
  __typename?: 'question_query_meta_min_fields';
  createdAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['String']>;
  list?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "question_query_meta" */
export type Question_Query_Meta_Min_Order_By = {
  createdAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  list?: Maybe<Order_By>;
  query?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** ordering options when selecting data from "question_query_meta" */
export type Question_Query_Meta_Order_By = {
  createdAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  list?: Maybe<Order_By>;
  query?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** primary key columns input for table: "question_query_meta" */
export type Question_Query_Meta_Pk_Columns_Input = {
  /** Id value is query's hash */
  id: Scalars['String'];
};

/** select columns of table "question_query_meta" */
export enum Question_Query_Meta_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  List = 'list',
  /** column name */
  Query = 'query',
  /** column name */
  UpdatedAt = 'updatedAt'
}


/** expression to compare columns of type question_reviewstatus_enum. All fields are combined with logical 'AND'. */
export type Question_Reviewstatus_Enum_Comparison_Exp = {
  _eq?: Maybe<Scalars['question_reviewstatus_enum']>;
  _gt?: Maybe<Scalars['question_reviewstatus_enum']>;
  _gte?: Maybe<Scalars['question_reviewstatus_enum']>;
  _in?: Maybe<Array<Scalars['question_reviewstatus_enum']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['question_reviewstatus_enum']>;
  _lte?: Maybe<Scalars['question_reviewstatus_enum']>;
  _neq?: Maybe<Scalars['question_reviewstatus_enum']>;
  _nin?: Maybe<Array<Scalars['question_reviewstatus_enum']>>;
};

/** select columns of table "question" */
export enum Question_Select_Column {
  /** column name */
  Anonymous = 'anonymous',
  /** column name */
  AuthorId = 'authorId',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  EventId = 'eventId',
  /** column name */
  Id = 'id',
  /** column name */
  ReplyCount = 'replyCount',
  /** column name */
  ReviewStatus = 'reviewStatus',
  /** column name */
  Star = 'star',
  /** column name */
  Top = 'top',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  VoteUpCount = 'voteUpCount'
}

/** aggregate stddev on columns */
export type Question_Stddev_Fields = {
  __typename?: 'question_stddev_fields';
  replyCount?: Maybe<Scalars['Float']>;
  voteUpCount?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "question" */
export type Question_Stddev_Order_By = {
  replyCount?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Question_Stddev_Pop_Fields = {
  __typename?: 'question_stddev_pop_fields';
  replyCount?: Maybe<Scalars['Float']>;
  voteUpCount?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "question" */
export type Question_Stddev_Pop_Order_By = {
  replyCount?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Question_Stddev_Samp_Fields = {
  __typename?: 'question_stddev_samp_fields';
  replyCount?: Maybe<Scalars['Float']>;
  voteUpCount?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "question" */
export type Question_Stddev_Samp_Order_By = {
  replyCount?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Question_Sum_Fields = {
  __typename?: 'question_sum_fields';
  replyCount?: Maybe<Scalars['Int']>;
  voteUpCount?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "question" */
export type Question_Sum_Order_By = {
  replyCount?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Question_Var_Pop_Fields = {
  __typename?: 'question_var_pop_fields';
  replyCount?: Maybe<Scalars['Float']>;
  voteUpCount?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "question" */
export type Question_Var_Pop_Order_By = {
  replyCount?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Question_Var_Samp_Fields = {
  __typename?: 'question_var_samp_fields';
  replyCount?: Maybe<Scalars['Float']>;
  voteUpCount?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "question" */
export type Question_Var_Samp_Order_By = {
  replyCount?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Question_Variance_Fields = {
  __typename?: 'question_variance_fields';
  replyCount?: Maybe<Scalars['Float']>;
  voteUpCount?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "question" */
export type Question_Variance_Order_By = {
  replyCount?: Maybe<Order_By>;
  voteUpCount?: Maybe<Order_By>;
};

/** columns and relationships of "reply" */
export type Reply = {
  __typename?: 'reply';
  anonymous: Scalars['Boolean'];
  /** An object relationship */
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['uuid']>;
  content: Scalars['String'];
  createdAt: Scalars['timestamp'];
  deletedAt?: Maybe<Scalars['timestamp']>;
  id: Scalars['uuid'];
  /** If author is a moderator of the event? */
  isModerator: Scalars['Boolean'];
  /** An object relationship */
  question?: Maybe<Question>;
  questionId?: Maybe<Scalars['uuid']>;
  reviewStatus: Scalars['reply_reviewstatus_enum'];
  updatedAt: Scalars['timestamp'];
};

/** aggregated selection of "reply" */
export type Reply_Aggregate = {
  __typename?: 'reply_aggregate';
  aggregate?: Maybe<Reply_Aggregate_Fields>;
  nodes: Array<Reply>;
};

/** aggregate fields of "reply" */
export type Reply_Aggregate_Fields = {
  __typename?: 'reply_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Reply_Max_Fields>;
  min?: Maybe<Reply_Min_Fields>;
};


/** aggregate fields of "reply" */
export type Reply_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Reply_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "reply" */
export type Reply_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Reply_Max_Order_By>;
  min?: Maybe<Reply_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "reply". All fields are combined with a logical 'AND'. */
export type Reply_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Reply_Bool_Exp>>>;
  _not?: Maybe<Reply_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Reply_Bool_Exp>>>;
  anonymous?: Maybe<Boolean_Comparison_Exp>;
  author?: Maybe<User_Bool_Exp>;
  authorId?: Maybe<Uuid_Comparison_Exp>;
  content?: Maybe<String_Comparison_Exp>;
  createdAt?: Maybe<Timestamp_Comparison_Exp>;
  deletedAt?: Maybe<Timestamp_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  isModerator?: Maybe<Boolean_Comparison_Exp>;
  question?: Maybe<Question_Bool_Exp>;
  questionId?: Maybe<Uuid_Comparison_Exp>;
  reviewStatus?: Maybe<Reply_Reviewstatus_Enum_Comparison_Exp>;
  updatedAt?: Maybe<Timestamp_Comparison_Exp>;
};

/** aggregate max on columns */
export type Reply_Max_Fields = {
  __typename?: 'reply_max_fields';
  authorId?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  questionId?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "reply" */
export type Reply_Max_Order_By = {
  authorId?: Maybe<Order_By>;
  content?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  questionId?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Reply_Min_Fields = {
  __typename?: 'reply_min_fields';
  authorId?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  questionId?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "reply" */
export type Reply_Min_Order_By = {
  authorId?: Maybe<Order_By>;
  content?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  questionId?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** ordering options when selecting data from "reply" */
export type Reply_Order_By = {
  anonymous?: Maybe<Order_By>;
  author?: Maybe<User_Order_By>;
  authorId?: Maybe<Order_By>;
  content?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  isModerator?: Maybe<Order_By>;
  question?: Maybe<Question_Order_By>;
  questionId?: Maybe<Order_By>;
  reviewStatus?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** primary key columns input for table: "reply" */
export type Reply_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** columns and relationships of "reply_query_meta" */
export type Reply_Query_Meta = {
  __typename?: 'reply_query_meta';
  createdAt: Scalars['timestamp'];
  /** Id value is query's hash */
  id: Scalars['String'];
  list: Scalars['String'];
  query: Scalars['String'];
  updatedAt: Scalars['timestamp'];
};

/** aggregated selection of "reply_query_meta" */
export type Reply_Query_Meta_Aggregate = {
  __typename?: 'reply_query_meta_aggregate';
  aggregate?: Maybe<Reply_Query_Meta_Aggregate_Fields>;
  nodes: Array<Reply_Query_Meta>;
};

/** aggregate fields of "reply_query_meta" */
export type Reply_Query_Meta_Aggregate_Fields = {
  __typename?: 'reply_query_meta_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Reply_Query_Meta_Max_Fields>;
  min?: Maybe<Reply_Query_Meta_Min_Fields>;
};


/** aggregate fields of "reply_query_meta" */
export type Reply_Query_Meta_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Reply_Query_Meta_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "reply_query_meta" */
export type Reply_Query_Meta_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Reply_Query_Meta_Max_Order_By>;
  min?: Maybe<Reply_Query_Meta_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "reply_query_meta". All fields are combined with a logical 'AND'. */
export type Reply_Query_Meta_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Reply_Query_Meta_Bool_Exp>>>;
  _not?: Maybe<Reply_Query_Meta_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Reply_Query_Meta_Bool_Exp>>>;
  createdAt?: Maybe<Timestamp_Comparison_Exp>;
  id?: Maybe<String_Comparison_Exp>;
  list?: Maybe<String_Comparison_Exp>;
  query?: Maybe<String_Comparison_Exp>;
  updatedAt?: Maybe<Timestamp_Comparison_Exp>;
};

/** aggregate max on columns */
export type Reply_Query_Meta_Max_Fields = {
  __typename?: 'reply_query_meta_max_fields';
  createdAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['String']>;
  list?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "reply_query_meta" */
export type Reply_Query_Meta_Max_Order_By = {
  createdAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  list?: Maybe<Order_By>;
  query?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Reply_Query_Meta_Min_Fields = {
  __typename?: 'reply_query_meta_min_fields';
  createdAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['String']>;
  list?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "reply_query_meta" */
export type Reply_Query_Meta_Min_Order_By = {
  createdAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  list?: Maybe<Order_By>;
  query?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** ordering options when selecting data from "reply_query_meta" */
export type Reply_Query_Meta_Order_By = {
  createdAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  list?: Maybe<Order_By>;
  query?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** primary key columns input for table: "reply_query_meta" */
export type Reply_Query_Meta_Pk_Columns_Input = {
  /** Id value is query's hash */
  id: Scalars['String'];
};

/** select columns of table "reply_query_meta" */
export enum Reply_Query_Meta_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  List = 'list',
  /** column name */
  Query = 'query',
  /** column name */
  UpdatedAt = 'updatedAt'
}


/** expression to compare columns of type reply_reviewstatus_enum. All fields are combined with logical 'AND'. */
export type Reply_Reviewstatus_Enum_Comparison_Exp = {
  _eq?: Maybe<Scalars['reply_reviewstatus_enum']>;
  _gt?: Maybe<Scalars['reply_reviewstatus_enum']>;
  _gte?: Maybe<Scalars['reply_reviewstatus_enum']>;
  _in?: Maybe<Array<Scalars['reply_reviewstatus_enum']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['reply_reviewstatus_enum']>;
  _lte?: Maybe<Scalars['reply_reviewstatus_enum']>;
  _neq?: Maybe<Scalars['reply_reviewstatus_enum']>;
  _nin?: Maybe<Array<Scalars['reply_reviewstatus_enum']>>;
};

/** select columns of table "reply" */
export enum Reply_Select_Column {
  /** column name */
  Anonymous = 'anonymous',
  /** column name */
  AuthorId = 'authorId',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  IsModerator = 'isModerator',
  /** column name */
  QuestionId = 'questionId',
  /** column name */
  ReviewStatus = 'reviewStatus',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "role" */
export type Role = {
  __typename?: 'role';
  createdAt: Scalars['timestamp'];
  deletedAt?: Maybe<Scalars['timestamp']>;
  id: Scalars['uuid'];
  name: Scalars['role_name_enum'];
  updatedAt: Scalars['timestamp'];
  /** An array relationship */
  users: Array<UserRoles>;
  /** An aggregated array relationship */
  users_aggregate: UserRoles_Aggregate;
};


/** columns and relationships of "role" */
export type RoleUsersArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


/** columns and relationships of "role" */
export type RoleUsers_AggregateArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};

/** aggregated selection of "role" */
export type Role_Aggregate = {
  __typename?: 'role_aggregate';
  aggregate?: Maybe<Role_Aggregate_Fields>;
  nodes: Array<Role>;
};

/** aggregate fields of "role" */
export type Role_Aggregate_Fields = {
  __typename?: 'role_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Role_Max_Fields>;
  min?: Maybe<Role_Min_Fields>;
};


/** aggregate fields of "role" */
export type Role_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Role_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "role" */
export type Role_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Role_Max_Order_By>;
  min?: Maybe<Role_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "role". All fields are combined with a logical 'AND'. */
export type Role_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Role_Bool_Exp>>>;
  _not?: Maybe<Role_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Role_Bool_Exp>>>;
  createdAt?: Maybe<Timestamp_Comparison_Exp>;
  deletedAt?: Maybe<Timestamp_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  name?: Maybe<Role_Name_Enum_Comparison_Exp>;
  updatedAt?: Maybe<Timestamp_Comparison_Exp>;
  users?: Maybe<UserRoles_Bool_Exp>;
};

/** aggregate max on columns */
export type Role_Max_Fields = {
  __typename?: 'role_max_fields';
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "role" */
export type Role_Max_Order_By = {
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Role_Min_Fields = {
  __typename?: 'role_min_fields';
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "role" */
export type Role_Min_Order_By = {
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};


/** expression to compare columns of type role_name_enum. All fields are combined with logical 'AND'. */
export type Role_Name_Enum_Comparison_Exp = {
  _eq?: Maybe<Scalars['role_name_enum']>;
  _gt?: Maybe<Scalars['role_name_enum']>;
  _gte?: Maybe<Scalars['role_name_enum']>;
  _in?: Maybe<Array<Scalars['role_name_enum']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['role_name_enum']>;
  _lte?: Maybe<Scalars['role_name_enum']>;
  _neq?: Maybe<Scalars['role_name_enum']>;
  _nin?: Maybe<Array<Scalars['role_name_enum']>>;
};

/** ordering options when selecting data from "role" */
export type Role_Order_By = {
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
  users_aggregate?: Maybe<UserRoles_Aggregate_Order_By>;
};

/** primary key columns input for table: "role" */
export type Role_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "role" */
export enum Role_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** subscription root */
export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "event" */
  event: Array<Event>;
  /** fetch data from the table: "eventAudiences" */
  eventAudiences: Array<EventAudiences>;
  /** fetch aggregated fields from the table: "eventAudiences" */
  eventAudiences_aggregate: EventAudiences_Aggregate;
  /** fetch data from the table: "eventAudiences" using primary key columns */
  eventAudiences_by_pk?: Maybe<EventAudiences>;
  /** fetch data from the table: "eventGuestes" */
  eventGuestes: Array<EventGuestes>;
  /** fetch aggregated fields from the table: "eventGuestes" */
  eventGuestes_aggregate: EventGuestes_Aggregate;
  /** fetch data from the table: "eventGuestes" using primary key columns */
  eventGuestes_by_pk?: Maybe<EventGuestes>;
  /** fetch aggregated fields from the table: "event" */
  event_aggregate: Event_Aggregate;
  /** fetch data from the table: "event" using primary key columns */
  event_by_pk?: Maybe<Event>;
  /** fetch data from the table: "question" */
  question: Array<Question>;
  /** fetch aggregated fields from the table: "question" */
  question_aggregate: Question_Aggregate;
  /** fetch data from the table: "question" using primary key columns */
  question_by_pk?: Maybe<Question>;
  /** fetch data from the table: "question_query_meta" */
  question_query_meta: Array<Question_Query_Meta>;
  /** fetch aggregated fields from the table: "question_query_meta" */
  question_query_meta_aggregate: Question_Query_Meta_Aggregate;
  /** fetch data from the table: "question_query_meta" using primary key columns */
  question_query_meta_by_pk?: Maybe<Question_Query_Meta>;
  /** fetch data from the table: "reply" */
  reply: Array<Reply>;
  /** fetch aggregated fields from the table: "reply" */
  reply_aggregate: Reply_Aggregate;
  /** fetch data from the table: "reply" using primary key columns */
  reply_by_pk?: Maybe<Reply>;
  /** fetch data from the table: "reply_query_meta" */
  reply_query_meta: Array<Reply_Query_Meta>;
  /** fetch aggregated fields from the table: "reply_query_meta" */
  reply_query_meta_aggregate: Reply_Query_Meta_Aggregate;
  /** fetch data from the table: "reply_query_meta" using primary key columns */
  reply_query_meta_by_pk?: Maybe<Reply_Query_Meta>;
  /** fetch data from the table: "role" */
  role: Array<Role>;
  /** fetch aggregated fields from the table: "role" */
  role_aggregate: Role_Aggregate;
  /** fetch data from the table: "role" using primary key columns */
  role_by_pk?: Maybe<Role>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch data from the table: "userRoles" */
  userRoles: Array<UserRoles>;
  /** fetch aggregated fields from the table: "userRoles" */
  userRoles_aggregate: UserRoles_Aggregate;
  /** fetch data from the table: "userRoles" using primary key columns */
  userRoles_by_pk?: Maybe<UserRoles>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "usersVoteUpQuestions" */
  usersVoteUpQuestions: Array<UsersVoteUpQuestions>;
  /** fetch aggregated fields from the table: "usersVoteUpQuestions" */
  usersVoteUpQuestions_aggregate: UsersVoteUpQuestions_Aggregate;
  /** fetch data from the table: "usersVoteUpQuestions" using primary key columns */
  usersVoteUpQuestions_by_pk?: Maybe<UsersVoteUpQuestions>;
};


/** subscription root */
export type Subscription_RootEventArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEventAudiencesArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEventAudiences_AggregateArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEventAudiences_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootEventGuestesArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEventGuestes_AggregateArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEventGuestes_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootEvent_AggregateArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEvent_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootQuestionArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootQuestion_AggregateArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootQuestion_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootQuestion_Query_MetaArgs = {
  distinct_on?: Maybe<Array<Question_Query_Meta_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Query_Meta_Order_By>>;
  where?: Maybe<Question_Query_Meta_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootQuestion_Query_Meta_AggregateArgs = {
  distinct_on?: Maybe<Array<Question_Query_Meta_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Query_Meta_Order_By>>;
  where?: Maybe<Question_Query_Meta_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootQuestion_Query_Meta_By_PkArgs = {
  id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootReplyArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootReply_AggregateArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootReply_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootReply_Query_MetaArgs = {
  distinct_on?: Maybe<Array<Reply_Query_Meta_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Query_Meta_Order_By>>;
  where?: Maybe<Reply_Query_Meta_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootReply_Query_Meta_AggregateArgs = {
  distinct_on?: Maybe<Array<Reply_Query_Meta_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Query_Meta_Order_By>>;
  where?: Maybe<Reply_Query_Meta_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootReply_Query_Meta_By_PkArgs = {
  id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootRoleArgs = {
  distinct_on?: Maybe<Array<Role_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Role_Order_By>>;
  where?: Maybe<Role_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRole_AggregateArgs = {
  distinct_on?: Maybe<Array<Role_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Role_Order_By>>;
  where?: Maybe<Role_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRole_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootUserArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUserRolesArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUserRoles_AggregateArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUserRoles_By_PkArgs = {
  roleId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootUsersVoteUpQuestionsArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUsersVoteUpQuestions_AggregateArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUsersVoteUpQuestions_By_PkArgs = {
  questionId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** expression to compare columns of type timestamp. All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamp']>;
  _gt?: Maybe<Scalars['timestamp']>;
  _gte?: Maybe<Scalars['timestamp']>;
  _in?: Maybe<Array<Scalars['timestamp']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamp']>;
  _lte?: Maybe<Scalars['timestamp']>;
  _neq?: Maybe<Scalars['timestamp']>;
  _nin?: Maybe<Array<Scalars['timestamp']>>;
};

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  anonymous: Scalars['Boolean'];
  /** An array relationship */
  attendedEvents: Array<EventAudiences>;
  /** An aggregated array relationship */
  attendedEvents_aggregate: EventAudiences_Aggregate;
  avatar?: Maybe<Scalars['String']>;
  createdAt: Scalars['timestamp'];
  deletedAt?: Maybe<Scalars['timestamp']>;
  email?: Maybe<Scalars['String']>;
  /** An array relationship */
  events: Array<Event>;
  /** An aggregated array relationship */
  events_aggregate: Event_Aggregate;
  fingerprint?: Maybe<Scalars['String']>;
  /** An array relationship */
  guestEvents: Array<EventGuestes>;
  /** An aggregated array relationship */
  guestEvents_aggregate: EventGuestes_Aggregate;
  id: Scalars['uuid'];
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  /** An array relationship */
  questions: Array<Question>;
  /** An aggregated array relationship */
  questions_aggregate: Question_Aggregate;
  /** An array relationship */
  replies: Array<Reply>;
  /** An aggregated array relationship */
  replies_aggregate: Reply_Aggregate;
  /** An array relationship */
  roles: Array<UserRoles>;
  /** An aggregated array relationship */
  roles_aggregate: UserRoles_Aggregate;
  updatedAt: Scalars['timestamp'];
  /** An array relationship */
  voteUpQuestions: Array<UsersVoteUpQuestions>;
  /** An aggregated array relationship */
  voteUpQuestions_aggregate: UsersVoteUpQuestions_Aggregate;
};


/** columns and relationships of "user" */
export type UserAttendedEventsArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserAttendedEvents_AggregateArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserEventsArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserEvents_AggregateArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserGuestEventsArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserGuestEvents_AggregateArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserQuestionsArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserQuestions_AggregateArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserRepliesArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserReplies_AggregateArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserRolesArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserRoles_AggregateArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserVoteUpQuestionsArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserVoteUpQuestions_AggregateArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};

/** columns and relationships of "userRoles" */
export type UserRoles = {
  __typename?: 'userRoles';
  /** An object relationship */
  role: Role;
  roleId: Scalars['uuid'];
  /** An object relationship */
  user: User;
  userId: Scalars['uuid'];
};

/** aggregated selection of "userRoles" */
export type UserRoles_Aggregate = {
  __typename?: 'userRoles_aggregate';
  aggregate?: Maybe<UserRoles_Aggregate_Fields>;
  nodes: Array<UserRoles>;
};

/** aggregate fields of "userRoles" */
export type UserRoles_Aggregate_Fields = {
  __typename?: 'userRoles_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<UserRoles_Max_Fields>;
  min?: Maybe<UserRoles_Min_Fields>;
};


/** aggregate fields of "userRoles" */
export type UserRoles_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<UserRoles_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "userRoles" */
export type UserRoles_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<UserRoles_Max_Order_By>;
  min?: Maybe<UserRoles_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "userRoles". All fields are combined with a logical 'AND'. */
export type UserRoles_Bool_Exp = {
  _and?: Maybe<Array<Maybe<UserRoles_Bool_Exp>>>;
  _not?: Maybe<UserRoles_Bool_Exp>;
  _or?: Maybe<Array<Maybe<UserRoles_Bool_Exp>>>;
  role?: Maybe<Role_Bool_Exp>;
  roleId?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  userId?: Maybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type UserRoles_Max_Fields = {
  __typename?: 'userRoles_max_fields';
  roleId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "userRoles" */
export type UserRoles_Max_Order_By = {
  roleId?: Maybe<Order_By>;
  userId?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type UserRoles_Min_Fields = {
  __typename?: 'userRoles_min_fields';
  roleId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "userRoles" */
export type UserRoles_Min_Order_By = {
  roleId?: Maybe<Order_By>;
  userId?: Maybe<Order_By>;
};

/** ordering options when selecting data from "userRoles" */
export type UserRoles_Order_By = {
  role?: Maybe<Role_Order_By>;
  roleId?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  userId?: Maybe<Order_By>;
};

/** primary key columns input for table: "userRoles" */
export type UserRoles_Pk_Columns_Input = {
  roleId: Scalars['uuid'];
  userId: Scalars['uuid'];
};

/** select columns of table "userRoles" */
export enum UserRoles_Select_Column {
  /** column name */
  RoleId = 'roleId',
  /** column name */
  UserId = 'userId'
}

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<User_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user" */
export type User_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<User_Max_Order_By>;
  min?: Maybe<User_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: Maybe<Array<Maybe<User_Bool_Exp>>>;
  _not?: Maybe<User_Bool_Exp>;
  _or?: Maybe<Array<Maybe<User_Bool_Exp>>>;
  anonymous?: Maybe<Boolean_Comparison_Exp>;
  attendedEvents?: Maybe<EventAudiences_Bool_Exp>;
  avatar?: Maybe<String_Comparison_Exp>;
  createdAt?: Maybe<Timestamp_Comparison_Exp>;
  deletedAt?: Maybe<Timestamp_Comparison_Exp>;
  email?: Maybe<String_Comparison_Exp>;
  events?: Maybe<Event_Bool_Exp>;
  fingerprint?: Maybe<String_Comparison_Exp>;
  guestEvents?: Maybe<EventGuestes_Bool_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  password?: Maybe<String_Comparison_Exp>;
  questions?: Maybe<Question_Bool_Exp>;
  replies?: Maybe<Reply_Bool_Exp>;
  roles?: Maybe<UserRoles_Bool_Exp>;
  updatedAt?: Maybe<Timestamp_Comparison_Exp>;
  voteUpQuestions?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  avatar?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  email?: Maybe<Scalars['String']>;
  fingerprint?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "user" */
export type User_Max_Order_By = {
  avatar?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  fingerprint?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  password?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  avatar?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  email?: Maybe<Scalars['String']>;
  fingerprint?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "user" */
export type User_Min_Order_By = {
  avatar?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  fingerprint?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  password?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
};

/** ordering options when selecting data from "user" */
export type User_Order_By = {
  anonymous?: Maybe<Order_By>;
  attendedEvents_aggregate?: Maybe<EventAudiences_Aggregate_Order_By>;
  avatar?: Maybe<Order_By>;
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  events_aggregate?: Maybe<Event_Aggregate_Order_By>;
  fingerprint?: Maybe<Order_By>;
  guestEvents_aggregate?: Maybe<EventGuestes_Aggregate_Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  password?: Maybe<Order_By>;
  questions_aggregate?: Maybe<Question_Aggregate_Order_By>;
  replies_aggregate?: Maybe<Reply_Aggregate_Order_By>;
  roles_aggregate?: Maybe<UserRoles_Aggregate_Order_By>;
  updatedAt?: Maybe<Order_By>;
  voteUpQuestions_aggregate?: Maybe<UsersVoteUpQuestions_Aggregate_Order_By>;
};

/** primary key columns input for table: "user" */
export type User_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "user" */
export enum User_Select_Column {
  /** column name */
  Anonymous = 'anonymous',
  /** column name */
  Avatar = 'avatar',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Email = 'email',
  /** column name */
  Fingerprint = 'fingerprint',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Password = 'password',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "usersVoteUpQuestions" */
export type UsersVoteUpQuestions = {
  __typename?: 'usersVoteUpQuestions';
  /** An object relationship */
  question: Question;
  questionId: Scalars['uuid'];
  /** An object relationship */
  user: User;
  userId: Scalars['uuid'];
};

/** aggregated selection of "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Aggregate = {
  __typename?: 'usersVoteUpQuestions_aggregate';
  aggregate?: Maybe<UsersVoteUpQuestions_Aggregate_Fields>;
  nodes: Array<UsersVoteUpQuestions>;
};

/** aggregate fields of "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Aggregate_Fields = {
  __typename?: 'usersVoteUpQuestions_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<UsersVoteUpQuestions_Max_Fields>;
  min?: Maybe<UsersVoteUpQuestions_Min_Fields>;
};


/** aggregate fields of "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<UsersVoteUpQuestions_Max_Order_By>;
  min?: Maybe<UsersVoteUpQuestions_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "usersVoteUpQuestions". All fields are combined with a logical 'AND'. */
export type UsersVoteUpQuestions_Bool_Exp = {
  _and?: Maybe<Array<Maybe<UsersVoteUpQuestions_Bool_Exp>>>;
  _not?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
  _or?: Maybe<Array<Maybe<UsersVoteUpQuestions_Bool_Exp>>>;
  question?: Maybe<Question_Bool_Exp>;
  questionId?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  userId?: Maybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type UsersVoteUpQuestions_Max_Fields = {
  __typename?: 'usersVoteUpQuestions_max_fields';
  questionId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Max_Order_By = {
  questionId?: Maybe<Order_By>;
  userId?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type UsersVoteUpQuestions_Min_Fields = {
  __typename?: 'usersVoteUpQuestions_min_fields';
  questionId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Min_Order_By = {
  questionId?: Maybe<Order_By>;
  userId?: Maybe<Order_By>;
};

/** ordering options when selecting data from "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Order_By = {
  question?: Maybe<Question_Order_By>;
  questionId?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  userId?: Maybe<Order_By>;
};

/** primary key columns input for table: "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Pk_Columns_Input = {
  questionId: Scalars['uuid'];
  userId: Scalars['uuid'];
};

/** select columns of table "usersVoteUpQuestions" */
export enum UsersVoteUpQuestions_Select_Column {
  /** column name */
  QuestionId = 'questionId',
  /** column name */
  UserId = 'userId'
}


/** expression to compare columns of type uuid. All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: Maybe<Scalars['uuid']>;
  _gt?: Maybe<Scalars['uuid']>;
  _gte?: Maybe<Scalars['uuid']>;
  _in?: Maybe<Array<Scalars['uuid']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['uuid']>;
  _lte?: Maybe<Scalars['uuid']>;
  _neq?: Maybe<Scalars['uuid']>;
  _nin?: Maybe<Array<Scalars['uuid']>>;
};

export type QuestionLiveQueryFieldsFragment = (
  { __typename?: 'question' }
  & Pick<Question, 'id' | 'createdAt' | 'updatedAt' | 'voteUpCount' | 'replyCount' | 'content' | 'reviewStatus' | 'star' | 'top'>
  & { author?: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id' | 'name' | 'avatar'>
  )> }
);

export type QuestionLiveQuerySubscriptionVariables = Exact<{
  distinct_on?: Maybe<Array<Question_Select_Column> | Question_Select_Column>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  order_by?: Maybe<Array<Question_Order_By> | Question_Order_By>;
  where: Question_Bool_Exp;
}>;


export type QuestionLiveQuerySubscription = (
  { __typename?: 'subscription_root' }
  & { question: Array<(
    { __typename?: 'question' }
    & QuestionLiveQueryFieldsFragment
  )> }
);

export type QuestionCountLiveQuerySubscriptionVariables = Exact<{
  where: Question_Bool_Exp;
}>;


export type QuestionCountLiveQuerySubscription = (
  { __typename?: 'subscription_root' }
  & { question_aggregate: (
    { __typename?: 'question_aggregate' }
    & { aggregate?: Maybe<(
      { __typename?: 'question_aggregate_fields' }
      & Pick<Question_Aggregate_Fields, 'count'>
    )> }
  ) }
);

export type ReplyLiveQueryFieldsFragment = (
  { __typename?: 'reply' }
  & Pick<Reply, 'id' | 'createdAt' | 'updatedAt' | 'content' | 'reviewStatus' | 'isModerator'>
  & { author?: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id' | 'name' | 'avatar'>
  )> }
);

export type ReplyLiveQuerySubscriptionVariables = Exact<{
  questionId: Scalars['uuid'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  order_by?: Maybe<Array<Reply_Order_By> | Reply_Order_By>;
  where?: Maybe<Reply_Bool_Exp>;
}>;


export type ReplyLiveQuerySubscription = (
  { __typename?: 'subscription_root' }
  & { question: Array<(
    { __typename?: 'question' }
    & { replies: Array<(
      { __typename?: 'reply' }
      & ReplyLiveQueryFieldsFragment
    )> }
    & QuestionLiveQueryFieldsFragment
  )> }
);

export type EventDetailLiveQueryFieldsFragment = (
  { __typename?: 'event' }
  & Pick<Event, 'id' | 'name' | 'code' | 'startAt' | 'endAt' | 'moderation'>
);

export type EventDetailLiveQuerySubscriptionVariables = Exact<{
  distinct_on?: Maybe<Array<Event_Select_Column> | Event_Select_Column>;
  where?: Maybe<Event_Bool_Exp>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By> | Event_Order_By>;
}>;


export type EventDetailLiveQuerySubscription = (
  { __typename?: 'subscription_root' }
  & { event: Array<(
    { __typename?: 'event' }
    & EventDetailLiveQueryFieldsFragment
  )> }
);

export type QuestionLiveQueryAudienceFieldsFragment = (
  { __typename?: 'question' }
  & { voteUpUsers: Array<(
    { __typename?: 'usersVoteUpQuestions' }
    & Pick<UsersVoteUpQuestions, 'userId'>
  )> }
  & QuestionLiveQueryFieldsFragment
);

export type QuestionLiveQueryAudienceSubscriptionVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  where?: Maybe<Question_Bool_Exp>;
  order_by?: Maybe<Array<Question_Order_By> | Question_Order_By>;
}>;


export type QuestionLiveQueryAudienceSubscription = (
  { __typename?: 'subscription_root' }
  & { question: Array<(
    { __typename?: 'question' }
    & QuestionLiveQueryAudienceFieldsFragment
  )> }
);

export type QuestionCountLiveQueryAudienceSubscriptionVariables = Exact<{
  where?: Maybe<Question_Bool_Exp>;
}>;


export type QuestionCountLiveQueryAudienceSubscription = (
  { __typename?: 'subscription_root' }
  & { question_aggregate: (
    { __typename?: 'question_aggregate' }
    & { aggregate?: Maybe<(
      { __typename?: 'question_aggregate_fields' }
      & Pick<Question_Aggregate_Fields, 'count'>
    )> }
  ) }
);

export const ReplyLiveQueryFieldsFragmentDoc = gql`
    fragment ReplyLiveQueryFields on reply {
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
export const EventDetailLiveQueryFieldsFragmentDoc = gql`
    fragment EventDetailLiveQueryFields on event {
  id
  name
  code
  startAt
  endAt
  moderation
}
    `;
export const QuestionLiveQueryFieldsFragmentDoc = gql`
    fragment QuestionLiveQueryFields on question {
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
export const QuestionLiveQueryAudienceFieldsFragmentDoc = gql`
    fragment QuestionLiveQueryAudienceFields on question {
  ...QuestionLiveQueryFields
  voteUpUsers {
    userId
  }
}
    ${QuestionLiveQueryFieldsFragmentDoc}`;
export const QuestionLiveQueryDocument = gql`
    subscription QuestionLiveQuery($distinct_on: [question_select_column!], $limit: Int!, $offset: Int!, $order_by: [question_order_by!], $where: question_bool_exp!) {
  question(
    distinct_on: $distinct_on
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    ...QuestionLiveQueryFields
  }
}
    ${QuestionLiveQueryFieldsFragmentDoc}`;

/**
 * __useQuestionLiveQuerySubscription__
 *
 * To run a query within a React component, call `useQuestionLiveQuerySubscription` and pass it any options that fit your needs.
 * When your component renders, `useQuestionLiveQuerySubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuestionLiveQuerySubscription({
 *   variables: {
 *      distinct_on: // value for 'distinct_on'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      order_by: // value for 'order_by'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useQuestionLiveQuerySubscription(baseOptions: Apollo.SubscriptionHookOptions<QuestionLiveQuerySubscription, QuestionLiveQuerySubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<QuestionLiveQuerySubscription, QuestionLiveQuerySubscriptionVariables>(QuestionLiveQueryDocument, options);
      }
export type QuestionLiveQuerySubscriptionHookResult = ReturnType<typeof useQuestionLiveQuerySubscription>;
export type QuestionLiveQuerySubscriptionResult = Apollo.SubscriptionResult<QuestionLiveQuerySubscription>;
export const QuestionCountLiveQueryDocument = gql`
    subscription QuestionCountLiveQuery($where: question_bool_exp!) {
  question_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useQuestionCountLiveQuerySubscription__
 *
 * To run a query within a React component, call `useQuestionCountLiveQuerySubscription` and pass it any options that fit your needs.
 * When your component renders, `useQuestionCountLiveQuerySubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuestionCountLiveQuerySubscription({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useQuestionCountLiveQuerySubscription(baseOptions: Apollo.SubscriptionHookOptions<QuestionCountLiveQuerySubscription, QuestionCountLiveQuerySubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<QuestionCountLiveQuerySubscription, QuestionCountLiveQuerySubscriptionVariables>(QuestionCountLiveQueryDocument, options);
      }
export type QuestionCountLiveQuerySubscriptionHookResult = ReturnType<typeof useQuestionCountLiveQuerySubscription>;
export type QuestionCountLiveQuerySubscriptionResult = Apollo.SubscriptionResult<QuestionCountLiveQuerySubscription>;
export const ReplyLiveQueryDocument = gql`
    subscription ReplyLiveQuery($questionId: uuid!, $limit: Int!, $offset: Int!, $order_by: [reply_order_by!], $where: reply_bool_exp) {
  question(where: {id: {_eq: $questionId}}) {
    ...QuestionLiveQueryFields
    replies(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
      ...ReplyLiveQueryFields
    }
  }
}
    ${QuestionLiveQueryFieldsFragmentDoc}
${ReplyLiveQueryFieldsFragmentDoc}`;

/**
 * __useReplyLiveQuerySubscription__
 *
 * To run a query within a React component, call `useReplyLiveQuerySubscription` and pass it any options that fit your needs.
 * When your component renders, `useReplyLiveQuerySubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReplyLiveQuerySubscription({
 *   variables: {
 *      questionId: // value for 'questionId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      order_by: // value for 'order_by'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useReplyLiveQuerySubscription(baseOptions: Apollo.SubscriptionHookOptions<ReplyLiveQuerySubscription, ReplyLiveQuerySubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ReplyLiveQuerySubscription, ReplyLiveQuerySubscriptionVariables>(ReplyLiveQueryDocument, options);
      }
export type ReplyLiveQuerySubscriptionHookResult = ReturnType<typeof useReplyLiveQuerySubscription>;
export type ReplyLiveQuerySubscriptionResult = Apollo.SubscriptionResult<ReplyLiveQuerySubscription>;
export const EventDetailLiveQueryDocument = gql`
    subscription EventDetailLiveQuery($distinct_on: [event_select_column!], $where: event_bool_exp, $limit: Int, $offset: Int, $order_by: [event_order_by!]) {
  event(
    distinct_on: $distinct_on
    where: $where
    limit: $limit
    offset: $offset
    order_by: $order_by
  ) {
    ...EventDetailLiveQueryFields
  }
}
    ${EventDetailLiveQueryFieldsFragmentDoc}`;

/**
 * __useEventDetailLiveQuerySubscription__
 *
 * To run a query within a React component, call `useEventDetailLiveQuerySubscription` and pass it any options that fit your needs.
 * When your component renders, `useEventDetailLiveQuerySubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventDetailLiveQuerySubscription({
 *   variables: {
 *      distinct_on: // value for 'distinct_on'
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      order_by: // value for 'order_by'
 *   },
 * });
 */
export function useEventDetailLiveQuerySubscription(baseOptions?: Apollo.SubscriptionHookOptions<EventDetailLiveQuerySubscription, EventDetailLiveQuerySubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<EventDetailLiveQuerySubscription, EventDetailLiveQuerySubscriptionVariables>(EventDetailLiveQueryDocument, options);
      }
export type EventDetailLiveQuerySubscriptionHookResult = ReturnType<typeof useEventDetailLiveQuerySubscription>;
export type EventDetailLiveQuerySubscriptionResult = Apollo.SubscriptionResult<EventDetailLiveQuerySubscription>;
export const QuestionLiveQueryAudienceDocument = gql`
    subscription QuestionLiveQueryAudience($limit: Int!, $offset: Int!, $where: question_bool_exp, $order_by: [question_order_by!]) {
  question(limit: $limit, offset: $offset, where: $where, order_by: $order_by) {
    ...QuestionLiveQueryAudienceFields
  }
}
    ${QuestionLiveQueryAudienceFieldsFragmentDoc}`;

/**
 * __useQuestionLiveQueryAudienceSubscription__
 *
 * To run a query within a React component, call `useQuestionLiveQueryAudienceSubscription` and pass it any options that fit your needs.
 * When your component renders, `useQuestionLiveQueryAudienceSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuestionLiveQueryAudienceSubscription({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      where: // value for 'where'
 *      order_by: // value for 'order_by'
 *   },
 * });
 */
export function useQuestionLiveQueryAudienceSubscription(baseOptions: Apollo.SubscriptionHookOptions<QuestionLiveQueryAudienceSubscription, QuestionLiveQueryAudienceSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<QuestionLiveQueryAudienceSubscription, QuestionLiveQueryAudienceSubscriptionVariables>(QuestionLiveQueryAudienceDocument, options);
      }
export type QuestionLiveQueryAudienceSubscriptionHookResult = ReturnType<typeof useQuestionLiveQueryAudienceSubscription>;
export type QuestionLiveQueryAudienceSubscriptionResult = Apollo.SubscriptionResult<QuestionLiveQueryAudienceSubscription>;
export const QuestionCountLiveQueryAudienceDocument = gql`
    subscription QuestionCountLiveQueryAudience($where: question_bool_exp) {
  question_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useQuestionCountLiveQueryAudienceSubscription__
 *
 * To run a query within a React component, call `useQuestionCountLiveQueryAudienceSubscription` and pass it any options that fit your needs.
 * When your component renders, `useQuestionCountLiveQueryAudienceSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuestionCountLiveQueryAudienceSubscription({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useQuestionCountLiveQueryAudienceSubscription(baseOptions?: Apollo.SubscriptionHookOptions<QuestionCountLiveQueryAudienceSubscription, QuestionCountLiveQueryAudienceSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<QuestionCountLiveQueryAudienceSubscription, QuestionCountLiveQueryAudienceSubscriptionVariables>(QuestionCountLiveQueryAudienceDocument, options);
      }
export type QuestionCountLiveQueryAudienceSubscriptionHookResult = ReturnType<typeof useQuestionCountLiveQueryAudienceSubscription>;
export type QuestionCountLiveQueryAudienceSubscriptionResult = Apollo.SubscriptionResult<QuestionCountLiveQueryAudienceSubscription>;