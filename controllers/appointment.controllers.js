import appointmentModel from "../models/appointment.model.js";

export const appointment=async(req,res)=>{
    try{
         console.log('User:', req.user); // ← Check if this exists
    console.log('Request body:', req.body);
    const userId = req.user?.id; // ← Try to get from auth middleware
    // If no user in request, require userId from body
    if (!userId && !req.body.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const{dateTimeF}=req.body;
    if(!dateTimeF){
        return res.json({message:'there is no slot selected'})
    }
const dateTime=new Date(dateTimeF);
const newAppointment=await appointmentModel.create({datetime:dateTime,  userId: userId || req.body.userId
})
res.status(201).json(newAppointment)}

    catch (error) {
           console.error('Appointment creation error:', error); 
    res.status(500).json({ error: error.message });
}
}