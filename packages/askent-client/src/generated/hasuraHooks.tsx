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


/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
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

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
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

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: Maybe<Scalars['String']>;
  _is_null?: Maybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: Maybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: Maybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: Maybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: Maybe<Scalars['String']>;
};

/** columns and relationships of "event" */
export type Event = {
  __typename?: 'event';
  /** An array relationship */
  audiences: Array<EventAudiences>;
  /** An aggregate relationship */
  audiences_aggregate: EventAudiences_Aggregate;
  code: Scalars['String'];
  createdAt: Scalars['timestamp'];
  deletedAt?: Maybe<Scalars['timestamp']>;
  endAt: Scalars['timestamp'];
  /** An array relationship */
  guestes: Array<EventGuestes>;
  /** An aggregate relationship */
  guestes_aggregate: EventGuestes_Aggregate;
  id: Scalars['uuid'];
  moderation?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  /** An object relationship */
  owner?: Maybe<User>;
  ownerId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  questions: Array<Question>;
  /** An aggregate relationship */
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
  count: Scalars['Int'];
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

/** input type for inserting array relation for remote table "eventAudiences" */
export type EventAudiences_Arr_Rel_Insert_Input = {
  data: Array<EventAudiences_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<EventAudiences_On_Conflict>;
};

/** Boolean expression to filter rows from the table "eventAudiences". All fields are combined with a logical 'AND'. */
export type EventAudiences_Bool_Exp = {
  _and?: Maybe<Array<EventAudiences_Bool_Exp>>;
  _not?: Maybe<EventAudiences_Bool_Exp>;
  _or?: Maybe<Array<EventAudiences_Bool_Exp>>;
  event?: Maybe<Event_Bool_Exp>;
  eventId?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  userId?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "eventAudiences" */
export enum EventAudiences_Constraint {
  /** unique or primary key constraint */
  PkDc9339c2c2f8cea2cb31c3c2134 = 'PK_dc9339c2c2f8cea2cb31c3c2134'
}

/** input type for inserting data into table "eventAudiences" */
export type EventAudiences_Insert_Input = {
  event?: Maybe<Event_Obj_Rel_Insert_Input>;
  eventId?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  userId?: Maybe<Scalars['uuid']>;
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

/** response of any mutation on the table "eventAudiences" */
export type EventAudiences_Mutation_Response = {
  __typename?: 'eventAudiences_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<EventAudiences>;
};

/** on conflict condition type for table "eventAudiences" */
export type EventAudiences_On_Conflict = {
  constraint: EventAudiences_Constraint;
  update_columns?: Array<EventAudiences_Update_Column>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};

/** Ordering options when selecting data from "eventAudiences". */
export type EventAudiences_Order_By = {
  event?: Maybe<Event_Order_By>;
  eventId?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  userId?: Maybe<Order_By>;
};

/** primary key columns input for table: eventAudiences */
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

/** input type for updating data in table "eventAudiences" */
export type EventAudiences_Set_Input = {
  eventId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** update columns of table "eventAudiences" */
export enum EventAudiences_Update_Column {
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
  count: Scalars['Int'];
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

/** input type for inserting array relation for remote table "eventGuestes" */
export type EventGuestes_Arr_Rel_Insert_Input = {
  data: Array<EventGuestes_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<EventGuestes_On_Conflict>;
};

/** Boolean expression to filter rows from the table "eventGuestes". All fields are combined with a logical 'AND'. */
export type EventGuestes_Bool_Exp = {
  _and?: Maybe<Array<EventGuestes_Bool_Exp>>;
  _not?: Maybe<EventGuestes_Bool_Exp>;
  _or?: Maybe<Array<EventGuestes_Bool_Exp>>;
  event?: Maybe<Event_Bool_Exp>;
  eventId?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  userId?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "eventGuestes" */
export enum EventGuestes_Constraint {
  /** unique or primary key constraint */
  Pk_3a6dc9b0d12bf4cc96fec9c0bbf = 'PK_3a6dc9b0d12bf4cc96fec9c0bbf'
}

/** input type for inserting data into table "eventGuestes" */
export type EventGuestes_Insert_Input = {
  event?: Maybe<Event_Obj_Rel_Insert_Input>;
  eventId?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  userId?: Maybe<Scalars['uuid']>;
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

/** response of any mutation on the table "eventGuestes" */
export type EventGuestes_Mutation_Response = {
  __typename?: 'eventGuestes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<EventGuestes>;
};

/** on conflict condition type for table "eventGuestes" */
export type EventGuestes_On_Conflict = {
  constraint: EventGuestes_Constraint;
  update_columns?: Array<EventGuestes_Update_Column>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};

/** Ordering options when selecting data from "eventGuestes". */
export type EventGuestes_Order_By = {
  event?: Maybe<Event_Order_By>;
  eventId?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  userId?: Maybe<Order_By>;
};

/** primary key columns input for table: eventGuestes */
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

/** input type for updating data in table "eventGuestes" */
export type EventGuestes_Set_Input = {
  eventId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** update columns of table "eventGuestes" */
export enum EventGuestes_Update_Column {
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
  count: Scalars['Int'];
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

/** input type for inserting array relation for remote table "event" */
export type Event_Arr_Rel_Insert_Input = {
  data: Array<Event_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Event_On_Conflict>;
};

/** Boolean expression to filter rows from the table "event". All fields are combined with a logical 'AND'. */
export type Event_Bool_Exp = {
  _and?: Maybe<Array<Event_Bool_Exp>>;
  _not?: Maybe<Event_Bool_Exp>;
  _or?: Maybe<Array<Event_Bool_Exp>>;
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

/** unique or primary key constraints on table "event" */
export enum Event_Constraint {
  /** unique or primary key constraint */
  Pk_30c2f3bbaf6d34a55f8ae6e4614 = 'PK_30c2f3bbaf6d34a55f8ae6e4614',
  /** unique or primary key constraint */
  Uq_58f788de12432757f10c683bbd6 = 'UQ_58f788de12432757f10c683bbd6'
}

/** input type for inserting data into table "event" */
export type Event_Insert_Input = {
  audiences?: Maybe<EventAudiences_Arr_Rel_Insert_Input>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  endAt?: Maybe<Scalars['timestamp']>;
  guestes?: Maybe<EventGuestes_Arr_Rel_Insert_Input>;
  id?: Maybe<Scalars['uuid']>;
  moderation?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<User_Obj_Rel_Insert_Input>;
  ownerId?: Maybe<Scalars['uuid']>;
  questions?: Maybe<Question_Arr_Rel_Insert_Input>;
  startAt?: Maybe<Scalars['timestamp']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
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

/** response of any mutation on the table "event" */
export type Event_Mutation_Response = {
  __typename?: 'event_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Event>;
};

/** input type for inserting object relation for remote table "event" */
export type Event_Obj_Rel_Insert_Input = {
  data: Event_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Event_On_Conflict>;
};

/** on conflict condition type for table "event" */
export type Event_On_Conflict = {
  constraint: Event_Constraint;
  update_columns?: Array<Event_Update_Column>;
  where?: Maybe<Event_Bool_Exp>;
};

/** Ordering options when selecting data from "event". */
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

/** primary key columns input for table: event */
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

/** input type for updating data in table "event" */
export type Event_Set_Input = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  endAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  moderation?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['uuid']>;
  startAt?: Maybe<Scalars['timestamp']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** update columns of table "event" */
export enum Event_Update_Column {
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

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "event" */
  delete_event?: Maybe<Event_Mutation_Response>;
  /** delete data from the table: "eventAudiences" */
  delete_eventAudiences?: Maybe<EventAudiences_Mutation_Response>;
  /** delete single row from the table: "eventAudiences" */
  delete_eventAudiences_by_pk?: Maybe<EventAudiences>;
  /** delete data from the table: "eventGuestes" */
  delete_eventGuestes?: Maybe<EventGuestes_Mutation_Response>;
  /** delete single row from the table: "eventGuestes" */
  delete_eventGuestes_by_pk?: Maybe<EventGuestes>;
  /** delete single row from the table: "event" */
  delete_event_by_pk?: Maybe<Event>;
  /** delete data from the table: "question" */
  delete_question?: Maybe<Question_Mutation_Response>;
  /** delete single row from the table: "question" */
  delete_question_by_pk?: Maybe<Question>;
  /** delete data from the table: "reply" */
  delete_reply?: Maybe<Reply_Mutation_Response>;
  /** delete single row from the table: "reply" */
  delete_reply_by_pk?: Maybe<Reply>;
  /** delete data from the table: "role" */
  delete_role?: Maybe<Role_Mutation_Response>;
  /** delete single row from the table: "role" */
  delete_role_by_pk?: Maybe<Role>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete data from the table: "userRoles" */
  delete_userRoles?: Maybe<UserRoles_Mutation_Response>;
  /** delete single row from the table: "userRoles" */
  delete_userRoles_by_pk?: Maybe<UserRoles>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** delete data from the table: "usersVoteUpQuestions" */
  delete_usersVoteUpQuestions?: Maybe<UsersVoteUpQuestions_Mutation_Response>;
  /** delete single row from the table: "usersVoteUpQuestions" */
  delete_usersVoteUpQuestions_by_pk?: Maybe<UsersVoteUpQuestions>;
  /** insert data into the table: "event" */
  insert_event?: Maybe<Event_Mutation_Response>;
  /** insert data into the table: "eventAudiences" */
  insert_eventAudiences?: Maybe<EventAudiences_Mutation_Response>;
  /** insert a single row into the table: "eventAudiences" */
  insert_eventAudiences_one?: Maybe<EventAudiences>;
  /** insert data into the table: "eventGuestes" */
  insert_eventGuestes?: Maybe<EventGuestes_Mutation_Response>;
  /** insert a single row into the table: "eventGuestes" */
  insert_eventGuestes_one?: Maybe<EventGuestes>;
  /** insert a single row into the table: "event" */
  insert_event_one?: Maybe<Event>;
  /** insert data into the table: "question" */
  insert_question?: Maybe<Question_Mutation_Response>;
  /** insert a single row into the table: "question" */
  insert_question_one?: Maybe<Question>;
  /** insert data into the table: "reply" */
  insert_reply?: Maybe<Reply_Mutation_Response>;
  /** insert a single row into the table: "reply" */
  insert_reply_one?: Maybe<Reply>;
  /** insert data into the table: "role" */
  insert_role?: Maybe<Role_Mutation_Response>;
  /** insert a single row into the table: "role" */
  insert_role_one?: Maybe<Role>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert data into the table: "userRoles" */
  insert_userRoles?: Maybe<UserRoles_Mutation_Response>;
  /** insert a single row into the table: "userRoles" */
  insert_userRoles_one?: Maybe<UserRoles>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** insert data into the table: "usersVoteUpQuestions" */
  insert_usersVoteUpQuestions?: Maybe<UsersVoteUpQuestions_Mutation_Response>;
  /** insert a single row into the table: "usersVoteUpQuestions" */
  insert_usersVoteUpQuestions_one?: Maybe<UsersVoteUpQuestions>;
  /** update data of the table: "event" */
  update_event?: Maybe<Event_Mutation_Response>;
  /** update data of the table: "eventAudiences" */
  update_eventAudiences?: Maybe<EventAudiences_Mutation_Response>;
  /** update single row of the table: "eventAudiences" */
  update_eventAudiences_by_pk?: Maybe<EventAudiences>;
  /** update data of the table: "eventGuestes" */
  update_eventGuestes?: Maybe<EventGuestes_Mutation_Response>;
  /** update single row of the table: "eventGuestes" */
  update_eventGuestes_by_pk?: Maybe<EventGuestes>;
  /** update single row of the table: "event" */
  update_event_by_pk?: Maybe<Event>;
  /** update data of the table: "question" */
  update_question?: Maybe<Question_Mutation_Response>;
  /** update single row of the table: "question" */
  update_question_by_pk?: Maybe<Question>;
  /** update data of the table: "reply" */
  update_reply?: Maybe<Reply_Mutation_Response>;
  /** update single row of the table: "reply" */
  update_reply_by_pk?: Maybe<Reply>;
  /** update data of the table: "role" */
  update_role?: Maybe<Role_Mutation_Response>;
  /** update single row of the table: "role" */
  update_role_by_pk?: Maybe<Role>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update data of the table: "userRoles" */
  update_userRoles?: Maybe<UserRoles_Mutation_Response>;
  /** update single row of the table: "userRoles" */
  update_userRoles_by_pk?: Maybe<UserRoles>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
  /** update data of the table: "usersVoteUpQuestions" */
  update_usersVoteUpQuestions?: Maybe<UsersVoteUpQuestions_Mutation_Response>;
  /** update single row of the table: "usersVoteUpQuestions" */
  update_usersVoteUpQuestions_by_pk?: Maybe<UsersVoteUpQuestions>;
};


/** mutation root */
export type Mutation_RootDelete_EventArgs = {
  where: Event_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventAudiencesArgs = {
  where: EventAudiences_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventAudiences_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_EventGuestesArgs = {
  where: EventGuestes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventGuestes_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Event_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_QuestionArgs = {
  where: Question_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Question_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_ReplyArgs = {
  where: Reply_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Reply_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_RoleArgs = {
  where: Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_UserRolesArgs = {
  where: UserRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_UserRoles_By_PkArgs = {
  roleId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_UsersVoteUpQuestionsArgs = {
  where: UsersVoteUpQuestions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_UsersVoteUpQuestions_By_PkArgs = {
  questionId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_EventArgs = {
  objects: Array<Event_Insert_Input>;
  on_conflict?: Maybe<Event_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventAudiencesArgs = {
  objects: Array<EventAudiences_Insert_Input>;
  on_conflict?: Maybe<EventAudiences_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventAudiences_OneArgs = {
  object: EventAudiences_Insert_Input;
  on_conflict?: Maybe<EventAudiences_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventGuestesArgs = {
  objects: Array<EventGuestes_Insert_Input>;
  on_conflict?: Maybe<EventGuestes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventGuestes_OneArgs = {
  object: EventGuestes_Insert_Input;
  on_conflict?: Maybe<EventGuestes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Event_OneArgs = {
  object: Event_Insert_Input;
  on_conflict?: Maybe<Event_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_QuestionArgs = {
  objects: Array<Question_Insert_Input>;
  on_conflict?: Maybe<Question_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Question_OneArgs = {
  object: Question_Insert_Input;
  on_conflict?: Maybe<Question_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ReplyArgs = {
  objects: Array<Reply_Insert_Input>;
  on_conflict?: Maybe<Reply_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Reply_OneArgs = {
  object: Reply_Insert_Input;
  on_conflict?: Maybe<Reply_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RoleArgs = {
  objects: Array<Role_Insert_Input>;
  on_conflict?: Maybe<Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Role_OneArgs = {
  object: Role_Insert_Input;
  on_conflict?: Maybe<Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: Maybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserRolesArgs = {
  objects: Array<UserRoles_Insert_Input>;
  on_conflict?: Maybe<UserRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserRoles_OneArgs = {
  object: UserRoles_Insert_Input;
  on_conflict?: Maybe<UserRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: Maybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersVoteUpQuestionsArgs = {
  objects: Array<UsersVoteUpQuestions_Insert_Input>;
  on_conflict?: Maybe<UsersVoteUpQuestions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersVoteUpQuestions_OneArgs = {
  object: UsersVoteUpQuestions_Insert_Input;
  on_conflict?: Maybe<UsersVoteUpQuestions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_EventArgs = {
  _set?: Maybe<Event_Set_Input>;
  where: Event_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventAudiencesArgs = {
  _set?: Maybe<EventAudiences_Set_Input>;
  where: EventAudiences_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventAudiences_By_PkArgs = {
  _set?: Maybe<EventAudiences_Set_Input>;
  pk_columns: EventAudiences_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_EventGuestesArgs = {
  _set?: Maybe<EventGuestes_Set_Input>;
  where: EventGuestes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventGuestes_By_PkArgs = {
  _set?: Maybe<EventGuestes_Set_Input>;
  pk_columns: EventGuestes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Event_By_PkArgs = {
  _set?: Maybe<Event_Set_Input>;
  pk_columns: Event_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_QuestionArgs = {
  _inc?: Maybe<Question_Inc_Input>;
  _set?: Maybe<Question_Set_Input>;
  where: Question_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Question_By_PkArgs = {
  _inc?: Maybe<Question_Inc_Input>;
  _set?: Maybe<Question_Set_Input>;
  pk_columns: Question_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ReplyArgs = {
  _set?: Maybe<Reply_Set_Input>;
  where: Reply_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Reply_By_PkArgs = {
  _set?: Maybe<Reply_Set_Input>;
  pk_columns: Reply_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_RoleArgs = {
  _set?: Maybe<Role_Set_Input>;
  where: Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Role_By_PkArgs = {
  _set?: Maybe<Role_Set_Input>;
  pk_columns: Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _set?: Maybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_UserRolesArgs = {
  _set?: Maybe<UserRoles_Set_Input>;
  where: UserRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_UserRoles_By_PkArgs = {
  _set?: Maybe<UserRoles_Set_Input>;
  pk_columns: UserRoles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _set?: Maybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UsersVoteUpQuestionsArgs = {
  _set?: Maybe<UsersVoteUpQuestions_Set_Input>;
  where: UsersVoteUpQuestions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_UsersVoteUpQuestions_By_PkArgs = {
  _set?: Maybe<UsersVoteUpQuestions_Set_Input>;
  pk_columns: UsersVoteUpQuestions_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

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
  /** fetch data from the table: "reply" */
  reply: Array<Reply>;
  /** fetch aggregated fields from the table: "reply" */
  reply_aggregate: Reply_Aggregate;
  /** fetch data from the table: "reply" using primary key columns */
  reply_by_pk?: Maybe<Reply>;
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


export type Query_RootEventArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


export type Query_RootEventAudiencesArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


export type Query_RootEventAudiences_AggregateArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


export type Query_RootEventAudiences_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


export type Query_RootEventGuestesArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


export type Query_RootEventGuestes_AggregateArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


export type Query_RootEventGuestes_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


export type Query_RootEvent_AggregateArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


export type Query_RootEvent_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootQuestionArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


export type Query_RootQuestion_AggregateArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


export type Query_RootQuestion_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootReplyArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


export type Query_RootReply_AggregateArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


export type Query_RootReply_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootRoleArgs = {
  distinct_on?: Maybe<Array<Role_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Role_Order_By>>;
  where?: Maybe<Role_Bool_Exp>;
};


export type Query_RootRole_AggregateArgs = {
  distinct_on?: Maybe<Array<Role_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Role_Order_By>>;
  where?: Maybe<Role_Bool_Exp>;
};


export type Query_RootRole_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUserArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


export type Query_RootUserRolesArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


export type Query_RootUserRoles_AggregateArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


export type Query_RootUserRoles_By_PkArgs = {
  roleId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsersVoteUpQuestionsArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


export type Query_RootUsersVoteUpQuestions_AggregateArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


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
  /** An aggregate relationship */
  replies_aggregate: Reply_Aggregate;
  replyCount: Scalars['Int'];
  reviewStatus: Scalars['question_reviewstatus_enum'];
  star: Scalars['Boolean'];
  top: Scalars['Boolean'];
  updatedAt: Scalars['timestamp'];
  voteUpCount: Scalars['Int'];
  /** An array relationship */
  voteUpUsers: Array<UsersVoteUpQuestions>;
  /** An aggregate relationship */
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
  count: Scalars['Int'];
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

/** input type for inserting array relation for remote table "question" */
export type Question_Arr_Rel_Insert_Input = {
  data: Array<Question_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Question_On_Conflict>;
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
  _and?: Maybe<Array<Question_Bool_Exp>>;
  _not?: Maybe<Question_Bool_Exp>;
  _or?: Maybe<Array<Question_Bool_Exp>>;
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

/** unique or primary key constraints on table "question" */
export enum Question_Constraint {
  /** unique or primary key constraint */
  Pk_21e5786aa0ea704ae185a79b2d5 = 'PK_21e5786aa0ea704ae185a79b2d5'
}

/** input type for incrementing numeric columns in table "question" */
export type Question_Inc_Input = {
  replyCount?: Maybe<Scalars['Int']>;
  voteUpCount?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "question" */
export type Question_Insert_Input = {
  anonymous?: Maybe<Scalars['Boolean']>;
  author?: Maybe<User_Obj_Rel_Insert_Input>;
  authorId?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  event?: Maybe<Event_Obj_Rel_Insert_Input>;
  eventId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  replies?: Maybe<Reply_Arr_Rel_Insert_Input>;
  replyCount?: Maybe<Scalars['Int']>;
  reviewStatus?: Maybe<Scalars['question_reviewstatus_enum']>;
  star?: Maybe<Scalars['Boolean']>;
  top?: Maybe<Scalars['Boolean']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
  voteUpCount?: Maybe<Scalars['Int']>;
  voteUpUsers?: Maybe<UsersVoteUpQuestions_Arr_Rel_Insert_Input>;
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

/** response of any mutation on the table "question" */
export type Question_Mutation_Response = {
  __typename?: 'question_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Question>;
};

/** input type for inserting object relation for remote table "question" */
export type Question_Obj_Rel_Insert_Input = {
  data: Question_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Question_On_Conflict>;
};

/** on conflict condition type for table "question" */
export type Question_On_Conflict = {
  constraint: Question_Constraint;
  update_columns?: Array<Question_Update_Column>;
  where?: Maybe<Question_Bool_Exp>;
};

/** Ordering options when selecting data from "question". */
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

/** primary key columns input for table: question */
export type Question_Pk_Columns_Input = {
  id: Scalars['uuid'];
};


/** Boolean expression to compare columns of type "question_reviewstatus_enum". All fields are combined with logical 'AND'. */
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

/** input type for updating data in table "question" */
export type Question_Set_Input = {
  anonymous?: Maybe<Scalars['Boolean']>;
  authorId?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  eventId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  replyCount?: Maybe<Scalars['Int']>;
  reviewStatus?: Maybe<Scalars['question_reviewstatus_enum']>;
  star?: Maybe<Scalars['Boolean']>;
  top?: Maybe<Scalars['Boolean']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
  voteUpCount?: Maybe<Scalars['Int']>;
};

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

/** update columns of table "question" */
export enum Question_Update_Column {
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
  count: Scalars['Int'];
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

/** input type for inserting array relation for remote table "reply" */
export type Reply_Arr_Rel_Insert_Input = {
  data: Array<Reply_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Reply_On_Conflict>;
};

/** Boolean expression to filter rows from the table "reply". All fields are combined with a logical 'AND'. */
export type Reply_Bool_Exp = {
  _and?: Maybe<Array<Reply_Bool_Exp>>;
  _not?: Maybe<Reply_Bool_Exp>;
  _or?: Maybe<Array<Reply_Bool_Exp>>;
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

/** unique or primary key constraints on table "reply" */
export enum Reply_Constraint {
  /** unique or primary key constraint */
  Pk_94fa9017051b40a71e000a2aff9 = 'PK_94fa9017051b40a71e000a2aff9'
}

/** input type for inserting data into table "reply" */
export type Reply_Insert_Input = {
  anonymous?: Maybe<Scalars['Boolean']>;
  author?: Maybe<User_Obj_Rel_Insert_Input>;
  authorId?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  /** If author is a moderator of the event? */
  isModerator?: Maybe<Scalars['Boolean']>;
  question?: Maybe<Question_Obj_Rel_Insert_Input>;
  questionId?: Maybe<Scalars['uuid']>;
  reviewStatus?: Maybe<Scalars['reply_reviewstatus_enum']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
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

/** response of any mutation on the table "reply" */
export type Reply_Mutation_Response = {
  __typename?: 'reply_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Reply>;
};

/** on conflict condition type for table "reply" */
export type Reply_On_Conflict = {
  constraint: Reply_Constraint;
  update_columns?: Array<Reply_Update_Column>;
  where?: Maybe<Reply_Bool_Exp>;
};

/** Ordering options when selecting data from "reply". */
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

/** primary key columns input for table: reply */
export type Reply_Pk_Columns_Input = {
  id: Scalars['uuid'];
};


/** Boolean expression to compare columns of type "reply_reviewstatus_enum". All fields are combined with logical 'AND'. */
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

/** input type for updating data in table "reply" */
export type Reply_Set_Input = {
  anonymous?: Maybe<Scalars['Boolean']>;
  authorId?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  /** If author is a moderator of the event? */
  isModerator?: Maybe<Scalars['Boolean']>;
  questionId?: Maybe<Scalars['uuid']>;
  reviewStatus?: Maybe<Scalars['reply_reviewstatus_enum']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** update columns of table "reply" */
export enum Reply_Update_Column {
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
  /** An aggregate relationship */
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
  count: Scalars['Int'];
  max?: Maybe<Role_Max_Fields>;
  min?: Maybe<Role_Min_Fields>;
};


/** aggregate fields of "role" */
export type Role_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Role_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "role". All fields are combined with a logical 'AND'. */
export type Role_Bool_Exp = {
  _and?: Maybe<Array<Role_Bool_Exp>>;
  _not?: Maybe<Role_Bool_Exp>;
  _or?: Maybe<Array<Role_Bool_Exp>>;
  createdAt?: Maybe<Timestamp_Comparison_Exp>;
  deletedAt?: Maybe<Timestamp_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  name?: Maybe<Role_Name_Enum_Comparison_Exp>;
  updatedAt?: Maybe<Timestamp_Comparison_Exp>;
  users?: Maybe<UserRoles_Bool_Exp>;
};

/** unique or primary key constraints on table "role" */
export enum Role_Constraint {
  /** unique or primary key constraint */
  PkB36bcfe02fc8de3c57a8b2391c2 = 'PK_b36bcfe02fc8de3c57a8b2391c2',
  /** unique or primary key constraint */
  UqAe4578dcaed5adff96595e61660 = 'UQ_ae4578dcaed5adff96595e61660'
}

/** input type for inserting data into table "role" */
export type Role_Insert_Input = {
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['role_name_enum']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
  users?: Maybe<UserRoles_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Role_Max_Fields = {
  __typename?: 'role_max_fields';
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Role_Min_Fields = {
  __typename?: 'role_min_fields';
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "role" */
export type Role_Mutation_Response = {
  __typename?: 'role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Role>;
};


/** Boolean expression to compare columns of type "role_name_enum". All fields are combined with logical 'AND'. */
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

/** input type for inserting object relation for remote table "role" */
export type Role_Obj_Rel_Insert_Input = {
  data: Role_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Role_On_Conflict>;
};

/** on conflict condition type for table "role" */
export type Role_On_Conflict = {
  constraint: Role_Constraint;
  update_columns?: Array<Role_Update_Column>;
  where?: Maybe<Role_Bool_Exp>;
};

/** Ordering options when selecting data from "role". */
export type Role_Order_By = {
  createdAt?: Maybe<Order_By>;
  deletedAt?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  updatedAt?: Maybe<Order_By>;
  users_aggregate?: Maybe<UserRoles_Aggregate_Order_By>;
};

/** primary key columns input for table: role */
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

/** input type for updating data in table "role" */
export type Role_Set_Input = {
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['role_name_enum']>;
  updatedAt?: Maybe<Scalars['timestamp']>;
};

/** update columns of table "role" */
export enum Role_Update_Column {
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
  /** fetch data from the table: "reply" */
  reply: Array<Reply>;
  /** fetch aggregated fields from the table: "reply" */
  reply_aggregate: Reply_Aggregate;
  /** fetch data from the table: "reply" using primary key columns */
  reply_by_pk?: Maybe<Reply>;
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


export type Subscription_RootEventArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


export type Subscription_RootEventAudiencesArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


export type Subscription_RootEventAudiences_AggregateArgs = {
  distinct_on?: Maybe<Array<EventAudiences_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventAudiences_Order_By>>;
  where?: Maybe<EventAudiences_Bool_Exp>;
};


export type Subscription_RootEventAudiences_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


export type Subscription_RootEventGuestesArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


export type Subscription_RootEventGuestes_AggregateArgs = {
  distinct_on?: Maybe<Array<EventGuestes_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<EventGuestes_Order_By>>;
  where?: Maybe<EventGuestes_Bool_Exp>;
};


export type Subscription_RootEventGuestes_By_PkArgs = {
  eventId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


export type Subscription_RootEvent_AggregateArgs = {
  distinct_on?: Maybe<Array<Event_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Event_Order_By>>;
  where?: Maybe<Event_Bool_Exp>;
};


export type Subscription_RootEvent_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootQuestionArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


export type Subscription_RootQuestion_AggregateArgs = {
  distinct_on?: Maybe<Array<Question_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Question_Order_By>>;
  where?: Maybe<Question_Bool_Exp>;
};


export type Subscription_RootQuestion_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootReplyArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


export type Subscription_RootReply_AggregateArgs = {
  distinct_on?: Maybe<Array<Reply_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reply_Order_By>>;
  where?: Maybe<Reply_Bool_Exp>;
};


export type Subscription_RootReply_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootRoleArgs = {
  distinct_on?: Maybe<Array<Role_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Role_Order_By>>;
  where?: Maybe<Role_Bool_Exp>;
};


export type Subscription_RootRole_AggregateArgs = {
  distinct_on?: Maybe<Array<Role_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Role_Order_By>>;
  where?: Maybe<Role_Bool_Exp>;
};


export type Subscription_RootRole_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUserArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


export type Subscription_RootUserRolesArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


export type Subscription_RootUserRoles_AggregateArgs = {
  distinct_on?: Maybe<Array<UserRoles_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UserRoles_Order_By>>;
  where?: Maybe<UserRoles_Bool_Exp>;
};


export type Subscription_RootUserRoles_By_PkArgs = {
  roleId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsersVoteUpQuestionsArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


export type Subscription_RootUsersVoteUpQuestions_AggregateArgs = {
  distinct_on?: Maybe<Array<UsersVoteUpQuestions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<UsersVoteUpQuestions_Order_By>>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};


export type Subscription_RootUsersVoteUpQuestions_By_PkArgs = {
  questionId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
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
  /** An aggregate relationship */
  attendedEvents_aggregate: EventAudiences_Aggregate;
  avatar?: Maybe<Scalars['String']>;
  createdAt: Scalars['timestamp'];
  deletedAt?: Maybe<Scalars['timestamp']>;
  email?: Maybe<Scalars['String']>;
  /** An array relationship */
  events: Array<Event>;
  /** An aggregate relationship */
  events_aggregate: Event_Aggregate;
  fingerprint?: Maybe<Scalars['String']>;
  /** An array relationship */
  guestEvents: Array<EventGuestes>;
  /** An aggregate relationship */
  guestEvents_aggregate: EventGuestes_Aggregate;
  id: Scalars['uuid'];
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  /** An array relationship */
  questions: Array<Question>;
  /** An aggregate relationship */
  questions_aggregate: Question_Aggregate;
  /** An array relationship */
  replies: Array<Reply>;
  /** An aggregate relationship */
  replies_aggregate: Reply_Aggregate;
  /** An array relationship */
  roles: Array<UserRoles>;
  /** An aggregate relationship */
  roles_aggregate: UserRoles_Aggregate;
  updatedAt: Scalars['timestamp'];
  /** An array relationship */
  voteUpQuestions: Array<UsersVoteUpQuestions>;
  /** An aggregate relationship */
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
  count: Scalars['Int'];
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

/** input type for inserting array relation for remote table "userRoles" */
export type UserRoles_Arr_Rel_Insert_Input = {
  data: Array<UserRoles_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<UserRoles_On_Conflict>;
};

/** Boolean expression to filter rows from the table "userRoles". All fields are combined with a logical 'AND'. */
export type UserRoles_Bool_Exp = {
  _and?: Maybe<Array<UserRoles_Bool_Exp>>;
  _not?: Maybe<UserRoles_Bool_Exp>;
  _or?: Maybe<Array<UserRoles_Bool_Exp>>;
  role?: Maybe<Role_Bool_Exp>;
  roleId?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  userId?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "userRoles" */
export enum UserRoles_Constraint {
  /** unique or primary key constraint */
  Pk_046d21329e72c0aedd207bbcdb1 = 'PK_046d21329e72c0aedd207bbcdb1'
}

/** input type for inserting data into table "userRoles" */
export type UserRoles_Insert_Input = {
  role?: Maybe<Role_Obj_Rel_Insert_Input>;
  roleId?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  userId?: Maybe<Scalars['uuid']>;
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

/** response of any mutation on the table "userRoles" */
export type UserRoles_Mutation_Response = {
  __typename?: 'userRoles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<UserRoles>;
};

/** on conflict condition type for table "userRoles" */
export type UserRoles_On_Conflict = {
  constraint: UserRoles_Constraint;
  update_columns?: Array<UserRoles_Update_Column>;
  where?: Maybe<UserRoles_Bool_Exp>;
};

/** Ordering options when selecting data from "userRoles". */
export type UserRoles_Order_By = {
  role?: Maybe<Role_Order_By>;
  roleId?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  userId?: Maybe<Order_By>;
};

/** primary key columns input for table: userRoles */
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

/** input type for updating data in table "userRoles" */
export type UserRoles_Set_Input = {
  roleId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** update columns of table "userRoles" */
export enum UserRoles_Update_Column {
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
  count: Scalars['Int'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<User_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: Maybe<Array<User_Bool_Exp>>;
  _not?: Maybe<User_Bool_Exp>;
  _or?: Maybe<Array<User_Bool_Exp>>;
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

/** unique or primary key constraints on table "user" */
export enum User_Constraint {
  /** unique or primary key constraint */
  PkCace4a159ff9f2512dd42373760 = 'PK_cace4a159ff9f2512dd42373760',
  /** unique or primary key constraint */
  UqB4036ca1a59b8e19708db3c0e68 = 'UQ_b4036ca1a59b8e19708db3c0e68',
  /** unique or primary key constraint */
  UqB613f025993be2d1e51ba4c2b5f = 'UQ_b613f025993be2d1e51ba4c2b5f',
  /** unique or primary key constraint */
  UqE12875dfb3b1d92d7d7c5377e22 = 'UQ_e12875dfb3b1d92d7d7c5377e22'
}

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  anonymous?: Maybe<Scalars['Boolean']>;
  attendedEvents?: Maybe<EventAudiences_Arr_Rel_Insert_Input>;
  avatar?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamp']>;
  deletedAt?: Maybe<Scalars['timestamp']>;
  email?: Maybe<Scalars['String']>;
  events?: Maybe<Event_Arr_Rel_Insert_Input>;
  fingerprint?: Maybe<Scalars['String']>;
  guestEvents?: Maybe<EventGuestes_Arr_Rel_Insert_Input>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  questions?: Maybe<Question_Arr_Rel_Insert_Input>;
  replies?: Maybe<Reply_Arr_Rel_Insert_Input>;
  roles?: Maybe<UserRoles_Arr_Rel_Insert_Input>;
  updatedAt?: Maybe<Scalars['timestamp']>;
  voteUpQuestions?: Maybe<UsersVoteUpQuestions_Arr_Rel_Insert_Input>;
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

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** input type for inserting object relation for remote table "user" */
export type User_Obj_Rel_Insert_Input = {
  data: User_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<User_On_Conflict>;
};

/** on conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: Maybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
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

/** primary key columns input for table: user */
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

/** input type for updating data in table "user" */
export type User_Set_Input = {
  anonymous?: Maybe<Scalars['Boolean']>;
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

/** update columns of table "user" */
export enum User_Update_Column {
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
  count: Scalars['Int'];
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

/** input type for inserting array relation for remote table "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Arr_Rel_Insert_Input = {
  data: Array<UsersVoteUpQuestions_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<UsersVoteUpQuestions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "usersVoteUpQuestions". All fields are combined with a logical 'AND'. */
export type UsersVoteUpQuestions_Bool_Exp = {
  _and?: Maybe<Array<UsersVoteUpQuestions_Bool_Exp>>;
  _not?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
  _or?: Maybe<Array<UsersVoteUpQuestions_Bool_Exp>>;
  question?: Maybe<Question_Bool_Exp>;
  questionId?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  userId?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "usersVoteUpQuestions" */
export enum UsersVoteUpQuestions_Constraint {
  /** unique or primary key constraint */
  Pk_81f8ce9de43c942f2e40405b245 = 'PK_81f8ce9de43c942f2e40405b245'
}

/** input type for inserting data into table "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Insert_Input = {
  question?: Maybe<Question_Obj_Rel_Insert_Input>;
  questionId?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  userId?: Maybe<Scalars['uuid']>;
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

/** response of any mutation on the table "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Mutation_Response = {
  __typename?: 'usersVoteUpQuestions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<UsersVoteUpQuestions>;
};

/** on conflict condition type for table "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_On_Conflict = {
  constraint: UsersVoteUpQuestions_Constraint;
  update_columns?: Array<UsersVoteUpQuestions_Update_Column>;
  where?: Maybe<UsersVoteUpQuestions_Bool_Exp>;
};

/** Ordering options when selecting data from "usersVoteUpQuestions". */
export type UsersVoteUpQuestions_Order_By = {
  question?: Maybe<Question_Order_By>;
  questionId?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  userId?: Maybe<Order_By>;
};

/** primary key columns input for table: usersVoteUpQuestions */
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

/** input type for updating data in table "usersVoteUpQuestions" */
export type UsersVoteUpQuestions_Set_Input = {
  questionId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** update columns of table "usersVoteUpQuestions" */
export enum UsersVoteUpQuestions_Update_Column {
  /** column name */
  QuestionId = 'questionId',
  /** column name */
  UserId = 'userId'
}


/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
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
  & Pick<Question, 'id' | 'anonymous' | 'createdAt' | 'updatedAt' | 'voteUpCount' | 'replyCount' | 'content' | 'reviewStatus' | 'star' | 'top'>
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

export type ReplyLiveQueryAudienceSubscriptionVariables = Exact<{
  questionId: Scalars['uuid'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  order_by?: Maybe<Array<Reply_Order_By> | Reply_Order_By>;
  where?: Maybe<Reply_Bool_Exp>;
}>;


export type ReplyLiveQueryAudienceSubscription = (
  { __typename?: 'subscription_root' }
  & { question: Array<(
    { __typename?: 'question' }
    & { replies: Array<(
      { __typename?: 'reply' }
      & ReplyLiveQueryFieldsFragment
    )> }
    & QuestionLiveQueryAudienceFieldsFragment
  )> }
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
  anonymous
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
export const ReplyLiveQueryAudienceDocument = gql`
    subscription ReplyLiveQueryAudience($questionId: uuid!, $limit: Int!, $offset: Int!, $order_by: [reply_order_by!], $where: reply_bool_exp) {
  question(where: {id: {_eq: $questionId}}) {
    ...QuestionLiveQueryAudienceFields
    replies(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
      ...ReplyLiveQueryFields
    }
  }
}
    ${QuestionLiveQueryAudienceFieldsFragmentDoc}
${ReplyLiveQueryFieldsFragmentDoc}`;

/**
 * __useReplyLiveQueryAudienceSubscription__
 *
 * To run a query within a React component, call `useReplyLiveQueryAudienceSubscription` and pass it any options that fit your needs.
 * When your component renders, `useReplyLiveQueryAudienceSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReplyLiveQueryAudienceSubscription({
 *   variables: {
 *      questionId: // value for 'questionId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      order_by: // value for 'order_by'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useReplyLiveQueryAudienceSubscription(baseOptions: Apollo.SubscriptionHookOptions<ReplyLiveQueryAudienceSubscription, ReplyLiveQueryAudienceSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ReplyLiveQueryAudienceSubscription, ReplyLiveQueryAudienceSubscriptionVariables>(ReplyLiveQueryAudienceDocument, options);
      }
export type ReplyLiveQueryAudienceSubscriptionHookResult = ReturnType<typeof useReplyLiveQueryAudienceSubscription>;
export type ReplyLiveQueryAudienceSubscriptionResult = Apollo.SubscriptionResult<ReplyLiveQueryAudienceSubscription>;