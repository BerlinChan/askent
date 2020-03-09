import { isAfter, isBefore, isEqual } from "date-fns";
import {
  AdminEventFieldsFragment,
  EventDateFilter
} from "./generated/graphqlHooks";

export function getEventDateStatus(
  event: AdminEventFieldsFragment | undefined,
  currentDate: Date
): EventDateFilter | undefined {
  if (event) {
    if (
      isAfter(currentDate, new Date(event.startAt)) &&
      isBefore(currentDate, new Date(event.endAt))
    ) {
      return EventDateFilter.Active;
    } else if (
      isAfter(currentDate, new Date(event.endAt)) ||
      isEqual(currentDate, new Date(event.endAt))
    ) {
      return EventDateFilter.Past;
    } else if (
      isBefore(currentDate, new Date(event.startAt)) ||
      isEqual(currentDate, new Date(event.startAt))
    ) {
      return EventDateFilter.Upcoming;
    }
  }
}
