import appointmentModel from "../models/appointment.model.js";
import { generateSlots } from "../utils/generateSlot.js";
import { DateTime } from "luxon";

const getSlots = async (req, res) => {
  try {
    const { date } = req.params;
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    // Convert the incoming UTC date string to a Luxon DateTime object in the Asia/Kolkata timezone
    const dateInIst = DateTime.fromISO(date, { zone: "utc" }).setZone(
      "Asia/Kolkata"
    );

    // Step 1: Generate all possible slots for the correct day in IST
    const allSlots = generateSlots(dateInIst.toJSDate());

    // Step 2: Correctly define the query range in IST for the database
    const startTime = dateInIst.startOf("day").toJSDate();
    const endTime = dateInIst.endOf("day").toJSDate();

    // Fetch booked appointments for the correct day in IST
    const bookedAppointments = await appointmentModel.find({
      datetime: { $gte: startTime, $lte: endTime },
    });

    // Step 3: Extract booked times in ISO format for comparison
    const bookedTimes = bookedAppointments.map((appt) =>
      new Date(appt.datetime).toISOString()
    );

    // Step 4: Filter out booked slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(new Date(slot).toISOString())
    );

    // Step 5: Send response with available slots
    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getSlots;
