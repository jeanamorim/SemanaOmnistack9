const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String
});

module.exports = mongoose.model("User", UserSchema); // Exporta esse model, ta criando o model que se chama User e o schema, o que ele vai receber, no caso so o Email
