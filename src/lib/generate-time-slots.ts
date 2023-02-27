import { addHours, addMinutes, getHours, isToday } from "date-fns";

export default function generateTimeSlots(
  startTime: Date,
  endTime: Date,
  slotSizeMinutes: number
) {
  const now = new Date();
  if (now > endTime) return [];

  const isStartToday = isToday(startTime);

  // If we have already passed the start time, use now as startTime
  let start = now > startTime ? now : startTime;

  if (isStartToday) {
    if (now > startTime) {
      const offsetHours = getHours(now);

      // "Pad" the start time with the amount of hours of the current time, to
      // prevent rendering time slots of the past
      start = addHours(start, offsetHours);

      // The start positions might still be in the past in terms of minutes
      // So "pad" the start time with the slot size, to prevent rendering time
      // slots of the past
      while (start <= now) {
        start = addMinutes(start, slotSizeMinutes);
      }
    }
  }

  const end = endTime;

  let slot = start;
  const timeSlots: Date[] = [];
  while (slot < end) {
    timeSlots.push(slot);
    slot = addMinutes(slot, slotSizeMinutes);
  }

  return timeSlots;
}
