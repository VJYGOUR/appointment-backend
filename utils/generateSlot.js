export function generateSlots(
  date,
  startHour = 9,
  endHour = 17,
  intervalMinutes = 30
) {
  const slots = [];
  const current = new Date(date);
  current.setHours(startHour, 0, 0, 0);
  const end = newDate(date);
  end.setHours(endHour, 0, 0, 0);
  while (current < end) {
    //push time to array
    slots.push(newDate(current));
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }
  return slots;
}
