import appointmentModel from "../models/appointment.model.js";
import { generateSlots } from "../utils/generateSlot.js";

const getSlots = async (req, res) => {
  try {
    const { date } = req.body; // ✅ no need for .params if you send in body
    if (!date) return res.status(400).json({ error: "Date is required" });

    // Step 1: Generate all possible slots
    const allSlots = generateSlots(date);

    // Step 2: Get booked appointments for that day
    const startTime = new Date(date);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date(date);
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
    res.json({ date, availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getSlots;
