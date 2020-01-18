yarn add socket.io

Em 'server.js': Permitir que o servidor ouca os protocolos HTTP e o WebSocket

const socketio = require('socket.io');
const http = require('http');

const server = http.Server(app); // Pegando meu servidor http e extraindo ele de dentro do express
const io = socketio(server); // Aqui o server passa a conseguir ouvir o protocolo websocket

server.listen(3333);

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

// io - Para anotar todos os usuario que estao na aplicacao
io.on("connection", socket => {
  console.log("Usuario conectado", socket.id);
});

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@omnistack-owvmk.mongodb.net/semana09?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// req.query = Acessar query params (para filtros)
// req.params = Acessar routes params (para edicao e delete)
// req.body = Acessar corpo da requisicao (para criacao, edicao)

app.use(cors()); // ou podia ser app.use(cors(origin: "http://localhost:3333")), ai so ia deixar essa rota acessar
app.use(express.json()); // Para o express entender uma requisicao no formato JSON
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads"))); // Cria a rota files e colocar um arquivo estatico, e no caso estou buscando da pasta upload
app.use(routes); // para usar as rotas do arquivo routes

server.listen(3333);

// ------------------------------------------------------------------------

Ir para o frontend para testar

instalar a dependencia de client
yarn add socket.io-client

yarn start

// -------------------------------------------------------

Fazer a conexao com o websocket
Vai fazer a conexao na tela de Dashboard, onde vai receber os avisos

'index.js' da 'Dashboard'
importar o socketio
import socketio from 'socket.io-client'

Criar um novo useEffect para disparar uma funcao assim que o componente for exibido em tela

const [spots, setSpots] = useState([]);

// Para se conectar com o backend
useEffect(() => {
  const socket = socketio('http://localhost:3333')
}, []);

Voltar para o backend, e la vai mostrar o console log do id que coloquei no 'server.js' do backend

'server.js' do backend:
io.on("connection", socket => {
  console.log("Usuario conectado", socket.id);

  socket.emit("Hello", "World");
})

// -----------------------------------------------------------------

Voltar no frontend
'index.js' da pasta 'Dashboard': colocar um console log e quando atualizar a pagina, vai receber a mensagem

// Para se conectar com o backend
useEffect(() => {
  const socket = socketio("http://localhost:3333");

  // Toda vez que voce receber uma messagem com o nome 'hello', pega os dados dela, e da um console.log(data)
  socket.on("hello", data => { // O FRONTEND TA OUVINDO e vai dar o console.log
    console.log(data);
  });
}, []);

// -----------------------------------------------------------------
'server.js' no 'backend':
io.on("connection", socket => {
  console.log("Usuario conectado", socket.id);

  socket.on("omni", data => { // OUVIR uma mensagem, O BACKEND TA OUVINDO e vai dar o console.log
    console.log(data);
  });
});

// -----------------------------------------------------------------
frontend 'index.js' da pasta 'Dashboard': 

// Toda vez que voce receber uma messagem com o nome 'hello', pega os dados dela, e da um console.log(data)
socket.emit("omni", "Stack");

TA COMUNICANDO O FRONTEND com o BACKEND, uma acao no frontend, da a resposta no backend

// -----------------------------------------------------------------

Distinguir qual usuario eh qual

'server.js' no 'backend':
// io - Para anotar todos os usuario que estao na aplicacao
io.on("connection", socket => {
  console.log("Usuario conectado", socket.id);
});

Fazer um relacionamento do 'socket.id' com o usuario que esta conectado
O frontend tem a informacao do usuario que ta conectado na aplicacao, com o localStorage

Importar a informacao do usuario do localStorage, dentro o useEffect do socket
E vai enviar a informacao do usuario junto para o websocket, junto com a localhost

Frontend: 'index.js' da 'Dashboard'

// Para se conectar com o backend
useEffect(() => {
  const user_id = localStorage.getItem("user");
  const socket = socketio("http://localhost:3333", {
    query: {
      user_id
    }
  });
}, []);

// -----------------------------------------------------------------

'server.js' no 'backend':

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

===============================================================================

Controller responsavel pela solicitacao de reserva eh o 'BookingController.js'
Depois que criar a reserva, enviar uma mensagem em tempo real para o user dono do spot, nao eh o user_id

No Backend 'BookingController.js':

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

O BACKEND TA ENVIANDO A MENSAGEM
// ---------------------------------------------------------------------------------
O FRONTEND TA ESCUTANDO A MENSAGEM

Voltar no frontend, 'index.js' da pasta 'Dashboard', colocar o socket.on() para escutar a mensagem e dar um console.log

 // Para se conectar com o backend
 useEffect(() => {
  const user_id = localStorage.getItem("user");
  const socket = socketio("http://localhost:3333", {
    query: {
      user_id
    }
  });

  // Ouvir
  socket.on("booking_request", data => {
    console.log(data);
  });
}, []);

// --------------------------------------------------------------------

Ir no insomnia, logar, pegar o id do spot, e colocar na rota de booking,
base_url/spots/5d9785749e170d45061b855b/bookings DIEGO

E dentro do Header, colocar id do usuario que quer fazer a reserva
user_id | 5d937927ce5b2d3d2f8a5c45 Alan

O ALAN QUER FAZER UM RESERVA NO SPOT DO DIEGO

Ai quando o diego estiver logado no google chrome, ele vai receber um console.log dos
dados do alan que quis criar uma reserva.

E QUANDO CLICA PRA RESERVAR APARECE EM TEMPO REAL! SEM PRECISAR ATUALIZAR A TELA

// ---------------------------------------------------------------------------

Agora mostrar a mensagem em tela

Voltar para o frontend

Frontend 'index.js' da pasta 'Dashboard':
const [request, setRequest] = useState([]); // Cada uma das solicitacoes de reserva, vai ser salvo nesse state

criar uma nova ul
vai percorrer todas aas request

colocar essa ul bem no comeco

<ul className="notifications">
  {requests.map(request => (
    <li key={request.id}>
      <p>
        <strong>{request.user.email}</strong> esta solicitando uma reserva
        em <strong>{request.spot.company}</strong> para a data:{" "}
        <strong>{request.date}</strong>
      </p>
      <button>ACEITAR</button>
      <button>REJEITAR</button>
    </li>
  ))}
</ul>

// ------------------------------------------------------------------------
Frontend 'index.js' da pasta 'Dashboard':

PRECISA OUVIR O EVENTO DE QUANDO RECEBE UMA NOVA REQUISICAO
(mobile faz o agendamento > backend recebe > manda notificacao pro frontend)

Usar o useMemo, para memorizar o valor de uma variavel ate que alguma coisa mude
// Para se conectar com o backend com o socketio
  // Usar o useMemo para memorizar a variavel socket, assim so vai executar uma vez, e so vai executar outra vez caso a variavel user_id mude.
  const user_id = localStorage.getItem("user");

  const socket = useMemo(
    () =>
      socketio("http://localhost:3333", {
        query: {
          user_id
        }
      }),
    [user_id]
  );

  // Ouvir o socketio
  useEffect(() => {
    socket.on("booking_request", data => {
      setRequests([...requests, data]); // Vai salvar todas a reservas que ja tem que vai adionar a reserva atual com todas juntas.
    });
  }, [requests, socket]); // Toda vez que alguma dessas duas variaveis mudar ele vai recalcular o valor ali de dentro

// ------------------------------------------------------------------------------

Frontend 'index.js' da pasta 'Dashboard':

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import socketio from "socket.io-client";
import api from "../../services/api";

import "./styles.css";

export default function Dashboard() {
  const [spots, setSpots] = useState([]); // Vai armazenar todos os spots que receber do response.data
  const [requests, setRequests] = useState([]); // Cada uma das solicitacoes de reserva, vai ser salvo nesse state

  // Para se conectar com o backend com o socketio
  // Usar o useMemo para memorizar a variavel socket, assim so vai executar uma vez, e so vai executar outra vez caso a variavel user_id mude.
  const user_id = localStorage.getItem("user");

  const socket = useMemo(
    () =>
      socketio("http://localhost:3333", {
        query: {
          user_id
        }
      }),
    [user_id]
  );

  // Ouvir o socketio
  useEffect(() => {
    socket.on("booking_request", data => {
      setRequests([...requests, data]); // Vai salvar todas a reservas que ja tem que vai adionar a reserva atual com todas juntas.
    });
  }, [requests, socket]); // Toda vez que alguma dessas duas variaveis mudar ele vai recalcular o valor ali de dentro

  // Ele vai executar quando uma variavel sofrer alteracao, quando o [] estiver vazio, so vai executar uma vez
  // A rota dashboard precisa do user_id, entao busca no localStorage, e passa para o header o user_id
  useEffect(() => {
    async function loadSpots() {
      const user_id = localStorage.getItem("user"); // Buscar o id do user, na parte application do google chrom, no localStorage
      const response = await api.get("/dashboard", {
        headers: {
          user_id
        }
      });
      setSpots(response.data); // Vai armazenar todos os spots que receber do response.data
    }

    loadSpots();
  }, []);

  // O map vai percorrer todo array que veio do response.data
  return (
    <>
      <ul className="notifications">
        {requests.map(request => (
          <li key={request.id}>
            <p>
              <strong>{request.user.email}</strong> esta solicitando uma reserva
              em <strong>{request.spot.company}</strong> para a data:{" "}
              <strong>{request.date}</strong>
            </p>
            <button className="accept">ACEITAR</button>
            <button className="reject">REJEITAR</button>
          </li>
        ))}
      </ul>

      <ul className="spot-list">
        {spots.map(spot => (
          <li key={spot._id}>
            <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
            <strong>{spot.company}</strong>
            <span>{spot.price ? `R$${spot.price}/dia` : "GRATUITO"}</span>
          </li>
        ))}
      </ul>

      <Link to={"/new"}>
        <button className="btn">Cadastrar novo spot</button>
      </Link>
    </>
  );
}

// --------------------------------------------------------------------------------

TESTAR

Fazer uma nova solicitacao de reserva
E vai aparecer na tela de Dashboard do dono do spot

// --------------------------------------------------------------------------------


ESTILIZAR ESSE AVISO

Frontend: 'styles.css' da pasta 'Dashboard'

adicionar a estilizacao da className notifications

ul.notifications {
  list-style: none;
  margin-bottom: 15px;
}

ul.notifications li {
  font-size: 16px;
  line-height: 24px;
}

ul.notifications li button {
  margin-right: 10px;
  border: 0;
  font-weight: bold;
  margin-top: 10px;
  cursor: pointer;
  background: none;
}

ul.notifications li button.accept {
  color: #84c870;
}

ul.notifications li button.reject {
  color: #e55e5e;
}

// ----------------------------------------------------------------------

Fazer aas funcionalidade de ACEITAR E REJEITAR
Criar duas rotas no backend uma para aceitar outra para rejeitar

Ir para o Backend
Criar o 'ApprovalController.js' e o 'RejectionController.js':
module.exports = {
  async store(req, res) {
    return res.json({ ok: true });
  }
};


Backend 'routes.js' criar a rota 

routes.post("/bookings/:booking_id/approvals", ApprovalController.store); // Vai na pagina de bookings, pegar o id da reserva e vai aprovar
routes.post("/bookings/:booking_id/rejections", RejectionController.store); // Vai na pagina de bookings, pegar o id da reserva e vai rejeitar

// --------------------------------------------------------------------------------
Lembrar la na 'Booking.js' que toda reserva tem um, approved: Boolean, e vamos agora dar um valor para ele

Em 'ApprovalController.js':
const Booking = require("../models/Booking");

module.exports = {
  async store(req, res) {
    const { booking_id } = req.params; // esse booking_id ta vindo da rota "/bookings/:booking_id/approvals"

    const booking = await Booking.findById(booking_id).populate("spot");

    // Aqui vai colocar o campo approved como TRUE, esse campo ta la no MODEL Booking
    booking.approved = true;

    // Aqui vai salvar a informacao
    await booking.save();

    return res.json(booking);
  }
};

// ---------------------------------------------------------

TESTAR, ir no insomnia, criar outra rota
POST - Approve
"/bookings/:booking_id/approvals"
base_url/bookings/5d978ef685e96c50e3ad7551/approvals

Ai ele vai retornar o booking apprroved, com aas infos do spot tambem

Ir no MongoDB e atualizar, vai ta como approved : true, o spot passado pela url

// ------------------------------------------------------------------------------

'RejectionController.js':so deixar como false

const Booking = require("../models/Booking");

module.exports = {
  async store(req, res) {
    const { booking_id } = req.params; // esse booking_id ta vindo da rota "/bookings/:booking_id/approvals"

    const booking = await Booking.findById(booking_id).populate("spot");

    // Aqui vai colocar o campo approved como TRUE, esse campo ta la no MODEL Booking
    booking.approved = false;

    // Aqui vai salvar a informacao
    await booking.save();

    return res.json(booking);
  }
};

// ------------------------------------------------------------------------------
TESTAR, ir no insomnia, criar outra rota
POST - Reject
"/bookings/:booking_id/rejections"
base_url/bookings/5d978d40e453604ead36b0c5/rejections

Ai ele vai retornar o booking apprroved, com aas infos do spot tambem

Ir no MongoDB e atualizar, vai ta como approved : false, o spot passado pela url

// ------------------------------------------------------------------------------

DAR FUNCIONALIDADES NO BOTOES PARA FAZEREM ESSA CHAMADA NO BACKEND

Frontend 'index.js' da 'Dashboard';

async function handleAccept(id) {
  await api.post(`/bookings/${id}/approvals`); // Essa rota ele aprova automaticamente, nao precisa passar nada

  // Vai filtrar os requests que estao no state, e vai remover a requisicao que acabou de aprovar
  // Se os id que tem em requests, forem diferentes, eles permanecem. Se for igual vai ser removido
  setRequests(requests.filter(requests => requests._id !== id));
}

async function handleReject(id) {
  await api.post(`/bookings/${id}/rejections`); // Essa rota ele cancela automaticamente, nao precisa passar nada

  setRequests(requests.filter(requests => requests._id !== id));
}

<button className="accept" onClick={() => handleAccept(request._id)} >ACEITAR</button>
<button className="reject" onClick={() => handleReject(request._id)} >REJEITAR</button>

E TESTAR criando uma nova RESERVA
ACEITAR OU REJEITAR
E ver no MongoDB

=================================================================================

PARTE DO MOBILE
cuidado que o IP pode mudar, mudar 'Mobile, api.js'
expo start

Logar com um no Frontend, e outro no mobile

Rodar o Frontend, e criar uma empresa

Ir no mobile e Solicitar a reserva

Vai Aparecer no Navegador a notificacao no Navegador

// -------------------------------------------------------------

Enviar mensagem(alert) para o mobile se foi aceita ou nao

Ir no backend

Backend 'ApprovalController.js' e 'RejectionController.js': colocar a conexao em tempo real o dono do spot e o usuario que cadastrou a reserva

Adicionar isso logo depois do await booking.save();

// Procura por uma conexao em websocket do usuario que esta fazendo a reserva.
const bookingUserSocket = req.connectedUsers[booking.user];

// Se existir essa conexao em tempo real, vai enviar uma mensagem para o usuario que esta fazendo a reserva. como nome da mensagem e o booking, que eh todo objeto de booking que esta logo acima
// VAI ENVIAR A MENSAGEM
if (bookingUserSocket) {
  req.io.to(bookingUserSocket).emit("booking_response", booking);
}

// ------------------------------------------------------------------------------

Voltar para o mobile

yarn add socket.io-client

Fazer a inicializacao do socketio na tela de 'List', listagem, depois da tela de Login, onde aparece todas as tecnologias;

'List.js':
import socketio from 'socket.io-client';

importar o Alert do React Native

criar um useEffect para conectar o socketio com o backend

  // Buscar o id do usuario que esta salvo como 'user' na tabela do AsyncStorage
  // then = entao
  // Se existir o usuario entao conecte ao socketio, passando esse id do usuario na query. Ta fazendo o map com user_id
  useEffect(() => {
    AsyncStorage.getItem("user").then(user_id => {
      const socket = socketio("http://192.168.1.107:3333", {
        query: { user_id }
      });

      // Aqui vai OUVIR
      // Toda vez que receber uma booking_response, emita um ALERTA NA TELA. Se booking.aprroved for TRUE = APROVADA, FALSE = REJEITADA
      // Receba os dados do booking, dados la do backend, la em Approval e Rejection Controllers
      socket.on("bookin_response", booking => {
        Alert.alert(
          `Sua reserva em ${booking.spot.company} em ${booking.date} foi ${
            booking.aprroved ? "APROVADA" : "REJEITADA"
          }`
        );
      });
    });
  }, []);

// ----------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import socketio from "socket.io-client";
import {
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  StyleSheet,
  Image,
  AsyncStorage
} from "react-native";

import SpotList from "../components/SpotList";

import logo from "../assets/logo.png";

export default function List() {
  const [techs, setTechs] = useState([]);

  // Buscar o id do usuario que esta salvo como 'user' na tabela do AsyncStorage
  // then = entao
  // Se existir o usuario entao conecte ao socketio, passando esse id do usuario na query. Ta fazendo o map com user_id
  useEffect(() => {
    AsyncStorage.getItem("user").then(user_id => {
      const socket = socketio("http://192.168.1.107:3333", {
        query: { user_id }
      });

      // Aqui vai OUVIR o booking_response
      // Toda vez que receber uma booking_response, emita um ALERTA NA TELA. Se booking.aprroved for TRUE = APROVADA, FALSE = REJEITADA
      // Receba os dados do booking, dados la do backend, la em Approval e Rejection Controllers
      socket.on("booking_response", booking => {
        Alert.alert(
          `Sua reserva em ${booking.spot.company} em ${booking.date} foi ${
            booking.approved ? "APROVADA" : "REJEITADA"
          }`
        );
      });
    });
  }, []);

// ----------------------------------------------------------------------------

Da um alerta amarelo mas eh normal
TIRAR ALERTA AMARELO

Ir em Mobile 'App.js': importar o YellowBox

import React from "react";
import { YellowBox } from "react-native";

import Routes from "./src/routes";

YellowBox.ignoreWarnings(["Unrecognized WebSocket"]);

export default function App() {
  return <Routes />;
}

// ----------------------------------------------------------------------------

E TESTAR!!!!!!!!!!!!!!!!!



