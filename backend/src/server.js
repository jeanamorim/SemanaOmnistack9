const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const socketio = require("socket.io");
const http = require("http");

const routes = require("./routes");

const app = express();
const server = http.Server(app); // Pegando meu servidor http e extraindo ele de dentro do express
const io = socketio(server); // Aqui o server passa a conseguir ouvir o protocolo websocket

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@omnistack-owvmk.mongodb.net/semana09?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const connectedUsers = {}; // Usar o Redis para salvar os usuarios conectados quando estiver em producao

// io - Para anotar todos os usuario que estao na aplicacao
io.on("connection", socket => {
  const { user_id } = socket.handshake.query; // VAI BUSCAR O ID DO USUARIO que esta conectado

  connectedUsers[user_id] = socket.id; // Ta relacionando o ID DO USUARIO, com o ID DE CONEXAO
});

// Deixar essas variaveis disponiveis para todas as rotas, por isso que vem antes das rotas
app.use((req, res, next) => {
  req.io = io; // Todas as rotas tem acesso ao io(socketio) permitir enviar e receber mensagens em tempo real
  req.connectedUsers = connectedUsers; // Os usuario conectados na aplicacao

  return next(); // CONTINUAR A APLICACAO NORMAL, SEM ISSO A APLICACAO PARA POR AQUI E NAO PASSA PARA AS ROTAS
});

// req.query = Acessar query params (para filtros)
// req.params = Acessar routes params (para edicao e delete)
// req.body = Acessar corpo da requisicao (para criacao, edicao)

app.use(cors()); // ou podia ser app.use(cors(origin: "http://localhost:3333")), ai so ia deixar essa rota acessar
app.use(express.json()); // Para o express entender uma requisicao no formato JSON
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads"))); // Cria a rota files e colocar um arquivo estatico, e no caso estou buscando da pasta upload
app.use(routes); // para usar as rotas do arquivo routes

server.listen(3333);
