import * as tz from "date-fns-tz";
import { addMinutes } from "date-fns";

const { toZonedTime, fromZonedTime } = tz;

export function generateSlots(
  date,
  startHour = 9,
  endHour = 17,
  intervalMinutes = 30
) {
  const slots = [];
  const timeZone = "Asia/Kolkata"; // IST Time Zone

  // Convert the input date to IST
  const baseDate = toZonedTime(new Date(date), timeZone);

  // Set start and end times in IST
  const istStart = new Date(baseDate);
  istStart.setHours(startHour, 0, 0, 0);

  const istEnd = new Date(baseDate);
  istEnd.setHours(endHour, 0, 0, 0);

  let current = istStart;
  while (current < istEnd) {
    // Convert back to UTC for storage/consistency
    const utcSlot = fromZonedTime(current, timeZone);
    slots.push(utcSlot);

    current = addMinutes(current, intervalMinutes);
  }

  return slots;
}
