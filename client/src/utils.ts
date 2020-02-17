import { isAfter, isBefore } from "date-fns";
import { AdminEventFieldsFragment } from "./generated/graphqlHooks";

export enum EventDateStatus {
  Current,
  Past,
  Future
}
export function getEventDateStatus(
  event: AdminEventFieldsFragment | undefined,
  currentDate: Date
): EventDateStatus | undefined {
  if (event) {
    if (
      isAfter(currentDate, new Date(event.startAt)) &&
      isBefore(currentDate, new Date(event.endAt))
    ) {
      return EventDateStatus.Current;
    } else if (isAfter(currentDate, new Date(event.endAt))) {
      return EventDateStatus.Past;
    } else if (isBefore(currentDate, new Date(event.startAt))) {
      return EventDateStatus.Future;
    }
  }
}
