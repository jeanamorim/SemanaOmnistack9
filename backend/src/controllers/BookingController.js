const Booking = require("../models/Booking");

module.exports = {
  // Criacao de uma nova reserva
  async store(req, res) {
    const { user_id } = req.headers; // Usuario que quer fazer a reserva
    const { spot_id } = req.params; // Usuario que criou o spot
    const { date } = req.body;

    const booking = await Booking.create({
      user: user_id,
      spot: spot_id,
      date
    });

    await booking
      .populate("spot")
      .populate("user")
      .execPopulate();

    // O dono do spot vai buscar o ID do usuario conectado, para ver se tem uma conexao em tempo real
    const ownerSocket = req.connectedUsers[booking.spot.user];

    // Se existir essa conexao em tempo real, vai enviar uma mensagem para o dono do spot, como nome da mensagem e o booking, que eh todo objeto de booking que esta logo acima
    if (ownerSocket) {
      req.io.to(ownerSocket).emit("booking_request", booking);
    }

    return res.json(booking);
  }
};
