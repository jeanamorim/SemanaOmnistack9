const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  date: String,
  approved: Boolean,

  // Qual usuario
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // se referindo ao model User
  },

  // Qual reserva
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spot" // se referindo ao model User
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
