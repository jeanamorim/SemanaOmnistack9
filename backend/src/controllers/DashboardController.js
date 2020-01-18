const Spot = require("../models/Spot");

module.exports = {
  async show(req, res) {
    const { user_id } = req.headers;

    const spots = await Spot.find({ user: user_id }); // Procurando o campo user do banco de dados, seja igual ao user_id que esta logado, ele esta logado porque o header esta com user_id

    return res.json(spots);
  }
};
