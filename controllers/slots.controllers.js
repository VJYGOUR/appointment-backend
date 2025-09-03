import appointmentModel from "../models/appointment.model.js";
import { generateSlots } from "../utils/generateSlot.js";
import { DateTime } from "luxon";

const getSlots = async (req, res) => {
  try {
    const { date } = req.params;
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    // 1. Convert the incoming UTC date string to a Luxon DateTime object in the Asia/Kolkata timezone.
    const dateInIst = DateTime.fromISO(date, { zone: "utc" }).setZone(
      "Asia/Kolkata"
    );

    // 2. Generate all possible slots for the correct day in IST.
    // The generateSlots function will now receive a Date object that is already correct for the IST time zone.
    const allSlots = generateSlots(dateInIst.toJSDate());

    // 3. Correctly define the query range in IST for the database.
    // This is the most crucial fix to ensure the database query finds appointments for the correct day.
    const startTime = dateInIst.startOf("day").toJSDate();
    const endTime = dateInIst.endOf("day").toJSDate();

    // 4. Fetch booked appointments for the correct day in IST.
    const bookedAppointments = await appointmentModel.find({
      datetime: { $gte: startTime, $lte: endTime },
    });

    // 5. Extract booked times in ISO format for consistent comparison.
    const bookedTimes = bookedAppointments.map((appt) =>
      new Date(appt.datetime).toISOString()
    );

    // 6. Filter out booked slots.
    const availableSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(new Date(slot).toISOString())
    );

    // 7. Send response with available slots.
    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getSlots;
