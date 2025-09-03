/**
 * Generates time slots for a specific date within a given time range and interval.
 * All calculations are done in UTC to ensure consistency across all servers.
 * The IST offset is applied to generate the correct slots.
 * @param {Date} date The date object representing the day to generate slots for.
 * @param {number} startHour The starting hour (24-hour format) in IST.
 * @param {number} endHour The ending hour (24-hour format) in IST.
 * @param {number} intervalMinutes The interval between slots in minutes.
 * @returns {string[]} An array of ISO 8601 date strings representing the available slots.
 */
export function generateSlots(
  date,
  startHour = 9,
  endHour = 17,
  intervalMinutes = 30
) {
  const slots = [];
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

  // Get the start of the day in UTC from the input date.
  const startOfDayUTC = new Date(date);
  startOfDayUTC.setUTCHours(0, 0, 0, 0);

  // Calculate the start time for slots in UTC by adjusting for the IST offset.
  // Example: 9 AM IST is 3:30 AM UTC on the same day.
  const startSlotTime = new Date(
    startOfDayUTC.getTime() - IST_OFFSET + startHour * 60 * 60 * 1000
  );

  // Calculate the end time for slots in UTC by adjusting for the IST offset.
  // Example: 5 PM IST is 11:30 AM UTC on the same day.
  const endSlotTime = new Date(
    startOfDayUTC.getTime() - IST_OFFSET + endHour * 60 * 60 * 1000
  );

  const intervalMilliseconds = intervalMinutes * 60 * 1000;

  // Loop to generate slots
  let currentTime = startSlotTime;
  while (currentTime.getTime() < endSlotTime.getTime()) {
    slots.push(currentTime.toISOString());
    currentTime = new Date(currentTime.getTime() + intervalMilliseconds);
  }

  return slots;
}
