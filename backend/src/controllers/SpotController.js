const User = require("../models/User");
const Spot = require("../models/Spot");

module.exports = {
  async index(req, res) {
    const { tech } = req.query; // Vai buscar esse tech la da Query

    const spots = await Spot.find({ techs: tech }); // Vai buscar da tabela de Spot do mongo techs, a tecnologia que foi passado por parametro tech. Se existe tech dentro das Techs

    return res.json(spots);
  },

  async store(req, res) {
    const { filename } = req.file; // Nome de como foi salvo na pasta uploads
    const { company, techs, price } = req.body;
    const { user_id } = req.headers;

    // Verifica se o usuario existe
    const user = await User.findById(user_id);

    // Se o usuario nao existir, dar um aviso de erro
    if (!user) {
      return res.status(400).json({ error: "User does not exists" });
    }

    const spot = await Spot.create({
      user: user_id,
      thumbnail: filename,
      company,
      techs: techs.split(",").map(tech => tech.trim()), // Separa por virgula, e depois tira o espaco de cada separado
      price
    });

    return res.json(spot);
  }
};
