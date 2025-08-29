import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  datetime: { type: Date, required: true },  // stores date + time together
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" }
});

export default mongoose.model("Appointment", appointmentSchema);
