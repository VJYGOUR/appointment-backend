/**
 * Generates time slots for a specific date within a given time range and interval.
 * @param {Date} date The date object to generate slots for, in the correct timezone.
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
  const IST_OFFSET_MINUTES = 330; // 5.5 hours * 60 minutes/hour

  // 1. Create a new Date object representing the start of the day in UTC
  const current = new Date(date);
  current.setUTCHours(0, 0, 0, 0);

  // 2. Adjust for the IST timezone offset to get the start of the IST day
  current.setMinutes(current.getMinutes() + IST_OFFSET_MINUTES);

  // 3. Set the start hour and end hour for the slots based on the desired IST time
  const startSlotTime = new Date(current);
  startSlotTime.setHours(startHour, 0, 0, 0);

  const endSlotTime = new Date(current);
  endSlotTime.setHours(endHour, 0, 0, 0);

  // 4. Loop to generate slots
  while (startSlotTime < endSlotTime) {
    slots.push(startSlotTime.toISOString());
    startSlotTime.setMinutes(startSlotTime.getMinutes() + intervalMinutes);
  }

  return slots;
}
