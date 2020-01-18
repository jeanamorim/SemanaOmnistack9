const Booking = require("../models/Booking");

module.exports = {
  async store(req, res) {
    const { booking_id } = req.params; // esse booking_id ta vindo da rota "/bookings/:booking_id/approvals"

    const booking = await Booking.findById(booking_id).populate("spot");

    // Aqui vai colocar o campo approved como TRUE, esse campo ta la no MODEL Booking
    booking.approved = true;

    // Aqui vai salvar a informacao
    await booking.save();

    // Procura por uma conexao em websocket do usuario que esta fazendo a reserva.
    const bookingUserSocket = req.connectedUsers[booking.user];

    // Se existir essa conexao em tempo real, vai enviar uma mensagem para o usuario que esta fazendo a reserva. como nome da mensagem e o booking, que eh todo objeto de booking que esta logo acima
    // VAI ENVIAR A MENSAGEM
    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit("booking_response", booking);
    }

    return res.json(booking);
  }
};
