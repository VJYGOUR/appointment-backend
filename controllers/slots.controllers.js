import appointmentModel from "../models/appointment.model.js";
import { generateSlots } from "../utils/generateSlot.js";
import { DateTime } from 'luxon';
const getSlots = async (req, res) => {
  try {
    const { date } = req.params; 
    console.log(date)// ✅ no need for .params if you send in body
    if (!date) return res.status(400).json({ error: "Date is required" });
 const dateInIst = DateTime.fromISO(date, { zone: 'utc' }).setZone('Asia/Kolkata');
    // Extract the date string in YYYY-MM-DD format for THAT timezone
    const localDateString = dateInIst.toISODate(); // "2025-08-12"
    // Step 1: Generate all possible slots
    const allSlots = generateSlots(localDateString);

    // Step 2: Get booked appointments for that day
    const startTime = new Date(localDateString);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date(localDateString);
    endTime.setHours(23, 59, 59, 999);

    const bookedAppointments = await appointmentModel.find({
      datetime: { $gte: startTime, $lte: endTime }
    });

    // Step 3: Extract booked times (normalized)
    const bookedTimes = bookedAppointments.map(appt =>
      new Date(appt.datetime).toISOString()
    );

    // Step 4: Remove booked slots from all slots
    const availableSlots = allSlots.filter(
      slot => !bookedTimes.includes(new Date(slot).toISOString())
    );

    // Step 5: Send response
    res.json({ localDateString, availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getSlots;
