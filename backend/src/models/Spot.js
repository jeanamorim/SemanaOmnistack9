const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema(
  {
    thumbnail: String,
    company: String,
    price: Number,
    techs: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" // se referindo ao model User
    }
  },
  {
    toJSON: {
      virtuals: true // Esse toJSON vai colocar o campo virtual junto com o Schema normal
    }
  }
);

SpotSchema.virtual("thumbnail_url").get(function() {
  return `http://192.168.1.107:3333/files/${this.thumbnail}`; // WEB: `http://localhost:3333/files/${this.thumbnail}`. Se pra testar no MOBILE use 192.168.1.107 no lugar do localhost
});

module.exports = mongoose.model("Spot", SpotSchema);
