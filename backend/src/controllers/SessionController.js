const User = require("../models/User");

module.exports = {
  async store(req, res) {
    const { email } = req.body; // Vai pegar o email que esta no req.body

    let user = await User.findOne({ email });

    // Se ja existir um email, ele vai retornar o mesmo usuario.

    // Se nao encontrar um email, entao ele vai criar um novo usuario.
    if (!user) {
      const user = await User.create({ email }); // Vai criar um usuario com o model User, que tem o email, e vai receber o email do req.body. Cadastrando la no MongoDB
    }

    return res.json(user);
  }
};
