API

mkdir backend
cd backend
yarn init -y

yarn add express

// -------------------------------------------------------------------

Na raiz criar a pasta 'src' e dentro cirar o arquivo 'server.js'

'server.js':
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.listen(3333);

// -------------------------------------------------------------------

node src/server.js

// -------------------------------------------------------------------

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  return res.json({ message: "Hello Rocketseat" });
});

app.listen(3333);

// -------------------------------------------------------------------
Para atualizar o node toda hora:
yarn add nodemon -D

adicionar scripts no 'package.json':
"name": "backend",
"version": "1.0.0",
"main": "index.js",
"license": "MIT",
"scripts": {
  "dev": "nodemon src/server.js"
},

// -------------------------------------------------------------------

GET - Buscar informacao
POST - Criar
PUT - Alterar 
DELETE - Deletar

// -------------------------------------------------------------------

Instalar o insomnia

fazer uma rota POST com a url: http://localhost:3333/users 

const express = require("express");

const app = express();

app.post("/users", (req, res) => {
  return res.json({ message: "Hello Rocketseat" });
});

app.listen(3333);

e dar um send

// -------------------------------------------------------------------

Colocar no query: idade 20
http://localhost:3333/users?idade=20

const express = require("express");

const app = express();

// req.query = Acessar query params (para filtros)

app.get("/users", (req, res) => {
  return res.json({ idade: req.query.idade });
});

app.listen(3333);

e dar um send, vai retornar a idade 20

// -------------------------------------------------------------------

Usando o Put para editar usuario

http://localhost:3333/users/1

const express = require("express");

const app = express();

// req.query = Acessar query params (para filtros)
// req.params = Acessar routes params (para edicao e delete)

app.put("/users/:id", (req, res) => {
  return res.json({ id: req.params.id });
});

app.listen(3333);


// -------------------------------------------------------------------

Usando o req.body

No insomnia:
{
	"nome": "Diego",
	"email": "diego@rocketseat.com.br" 
}

const express = require("express");

const app = express();

//GET, POST, PUT, DELETE

// req.query = Acessar query params (para filtros)
// req.params = Acessar routes params (para edicao e delete)
// req.body = Acessar corpo da requisicao (para criacao, edicao)

app.use(express.json()); // Para o express entender uma requisicao no formato JSON

app.post("/users", (req, res) => {
  return res.json(req.body);
});

app.listen(3333);


======================================================================

Iniciando a aplicacao

Separando rotas
Na 'src' criar o 'routes.js'

'routes.js':
const express = require("express");

const routes = express.Router();

routes.post("/users", (req, res) => {
  return res.json(req.body);
});

module.exports = routes;


// -------------------------------------------------------------

'server.js':
const express = require("express");
const routes = require("./routes");

const app = express();

// req.query = Acessar query params (para filtros)
// req.params = Acessar routes params (para edicao e delete)
// req.body = Acessar corpo da requisicao (para criacao, edicao)

app.use(express.json()); // Para o express entender uma requisicao no formato JSON

app.use(routes); // para usar as rotas do arquivo routes

app.listen(3333);

// -----------------------------------------------------------------

Conectar a aplicacao com o banco de dados - MongoDB

Ir no MongoDB Atlas

Build a Cluster
Nome: OmniStack

Create Cluster

Esta criando um servidor,
// -----------------------------------------------------------------
Security>Database Access
Add new User
omnistack
omnistack

usuario criado

Network Access (liberar o acessor desse servidor pra algum IP)

ADD IP ADDRES
ALLOW ACCESS FROM ANYWHERE


Clusters na barra lateral
Connect
Connect Your Application
Node.js 3.0, se der erro volta e seleciona a 2.2
Copy
mongodb+srv://omnistack:<password>@omnistack-owvmk.mongodb.net/test?retryWrites=true&w=majority

yarn add mongoose (facilita trabalhar com o mongo)

// ------------------------------------------------
importar o mongoose no 'server.js'

'server.js':

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

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

app.use(express.json()); // Para o express entender uma requisicao no formato JSON

app.use(routes); // para usar as rotas do arquivo routes

app.listen(3333);

// --------------------------------------------------------------------

Criar a rota para receber o email do usuario

Na 'src', criar aas pastas 'controllers' e 'models';

O model representa uma tabela do banco de dados, um schema

Dentro de 'models' criar o arquivo 'User.js'

'User.js':
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String
});

module.exports = mongoose.model("User", UserSchema); // Exporta esse model, ta criando o model que se chama User e o schema, o que ele vai receber, no caso so o Email

// --------------------------------------------------------------------

O controller vai receber a regra de negocio

Na pasta 'controller', criar o arquivo 'SessionController.js'

'SessionController.js':
module.exports = {
  store(req, res) {
    return res.json({ message: "Hello World" });
  }
};

// --------------------------------------------------------------------

'routes.js': adicionar o SessionController:

const express = require("express");
const SessionController = require("./controllers/SessionController");

const routes = express.Router();

routes.post("/sessions", SessionController.store);

module.exports = routes;

// --------------------------------------------------------------------

Mudar aas coisas no insomnia, criar a pasta session, mudar a url para sessionStorage

No Manage Environment colocar o base_url:
{
  "base_url": "http://localhost:3333"
}

E na barra da url colocar:
base_url/sessions

// --------------------------------------------------------------------

Comunicar com o banco de dados

No insomnia enviar apenas o email

'SessionController':
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

// --------------------------------------------------------------------
Outras rotas

Cadastrar os spots, dos lugares para trabalhar

Na 'models' criar o MODEL 'Spot.js'

'Spot.js':
const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema({
  thumbnail: String,
  company: String,
  price: Number,
  techs: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Spot", SpotSchema);

// -----------------------------------------------------------

Na pasta 'controllers' criar o 'SpotController.js'

'SpotController.js': Testando
module.exports = {
  async store(req, res) {
    return res.json({ ok: true });
  }
};

// -----------------------------------------------------------

Criar a rota do spot no arquivo 'routes.js':

const express = require("express");
const SessionController = require("./controllers/SessionController");
const SpotController = require("./controllers/SpotController");

const routes = express.Router();

routes.post("/sessions", SessionController.store);

routes.post("/spots", SpotController.store);

module.exports = routes;

// -----------------------------------------------------------

No insomnia, criar uma pasta, Spot e dentro a rota
base_url/spots
dar um send, e receber o "ok": true

Agora passar aas informacoes que o Spot precisa para ser criado

Ao inves de JSON, usar Multipart Form

thumbnail | escolher o file
company | Rocketseat
price | 68
techs | ReactJS, ReactNative, Node.js

// -----------------------------------------------------------

Para lidar com upload de imagens, arquivos
yarn add multer

Na 'src' criar a pasta 'config' e dentro 'upload.js' para configurar o multer,
configurando como vai ser salvo aas imagens

E na 'raiz' criar a pasta 'uploads' ela vai receber os arquivo de imagens

'upload.js':
const multer = require("multer");
const path = require("path");

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads"),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // Extensao do arquivo
      const name = path.basename(file.originalname, ext); // Nome do arquivo

      cb(null, `${name}-${Date.now()}${ext}`);
    }
  })
};


// -----------------------------------------------------------

'routes.js': importar o multer e uploadConfig
e criar o upload
const upload = multer(uploadConfig);

Um unico arquivo, e thumbnail eh o campo que recebe a imagem.
routes.post("/spots", upload.single('thumbnail'), SpotController.store);

'routes.js':
const express = require("express");
const multer = require("multer");
const uploadConfig = require("./config/upload");

const SessionController = require("./controllers/SessionController");
const SpotController = require("./controllers/SpotController");

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post("/sessions", SessionController.store);

routes.post("/spots", upload.single('thumbnail'), SpotController.store); // Um unico arquivo, e thumbnail eh o campo que recebe a imagem.

module.exports = routes;

// -----------------------------------------------------------

'SpotController.js': para ver o log do body e do file

module.exports = {
  async store(req, res) {
    console.log(req.body);
    console.log(req.file);

    return res.json({ ok: true });
  }
};

// -----------------------------------------------------------
Agora no SpotController criar o spot no banco de dados

Header no insomnia

user_id | 5d9377fdb9691c3bab571dd6

'SpotController.js':
const User = require("../models/User");
const Spot = require("../models/Spot");

module.exports = {
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


Ir no insomnia e dar um send e receber o spot

// -----------------------------------------------------

Fazer a listagem de spots
Fazer um filtro por tecnologia

Ir no insomnia e fazer uma nova rota de GET
GET - Index
base_url/spots

Ir no Query:
tech | ReactJS
http://localhost:3333/spots?tech=ReactJS

// -----------------------------------------------------

No 'SpotController.js' adicionar o index()

async index(req, res) {
  const { tech } = req.query; // Vai buscar esse tech la da Query

  const spots = await Spot.find({ techs: tech }); // Vai buscar da tabela de Spot do mongo techs, a tecnologia que foi passado por parametro tech. Se existe tech dentro das Techs

  return res.json(spots);
},

// -----------------------------------------------------

Criar a rota no 'routes.js' a rota do index

routes.get("/spots", SpotController.index); // Vai buscar a tecnologia passada por parametro da url. http://localhost:3333/spots?tech=ReactJS
routes.post("/spots", upload.single("thumbnail"), SpotController.store); // Um unico arquivo, e thumbnail eh o campo que recebe a imagem.

// -----------------------------------------------------

Ir no insomnia, passa a tech procurado pela query por exemplo

tech | VueJS

dar um send, nao vai existir
mas se criar um spot, com a: techs | VueJS, na parte do Multipart Form

e depois voltar na rota Index, dar um send

vai mostrar a empresa com a tech de VueJS

// -----------------------------------------------------
Rota para listar o spot que o usuario logado ja se cadastrou 

Na pasta 'controllers' criar o arquivo 'DashboardController.js'

No insomnia criar a pasta 'Dashboard'
GET - SHOW

base_url/dashboard

e no Header informar qual e o usuario que esta logado
user_id | 5d9377fdb9691c3bab571dd6


'DashboardController.js':
const Spot = require("../models/Spot");

module.exports = {
  async show(req, res) {
    const { user_id } = req.headers;

    const spots = await Spot.find({ user: user_id }); // Procurando o campo user do banco de dados, seja igual ao user_id que esta logado, ele esta logado porque o header esta com user_id

    return res.json(spots);
  }
};

// -----------------------------------------------------

Criar a rota do Dashboard no 'routes.js'

const express = require("express");
const multer = require("multer");
const uploadConfig = require("./config/upload");

const SessionController = require("./controllers/SessionController");
const SpotController = require("./controllers/SpotController");
const DashboardController = require("./controllers/DashboardController");

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post("/sessions", SessionController.store);

routes.get("/spots", SpotController.index); // Vai buscar a tecnologia passada por parametro da url. http://localhost:3333/spots?tech=ReactJS
routes.post("/spots", upload.single("thumbnail"), SpotController.store); // Um unico arquivo, e thumbnail eh o campo que recebe a imagem.

routes.get("/dashboard", DashboardController.show);

module.exports = routes;

// -----------------------------------------------------

Criar a rota de armazenar aas reservas

Na 'models' criar um model 'Booking.js':

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

// -----------------------------------------------------

Criar o 'BookingController.js':

'BookingController.js':
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

    return res.json(booking);
  }
};

// -----------------------------------------------------

Na 'routes.js' criar a rota do booking:
const BookingController = require("./controllers/BookingController");
routes.post("/spots/:spot_id/bookings", BookingController.store);

// -----------------------------------------------------

No insomnia criar a pasta booking

Criar a rota:
Criar nova reserva Store - POST
base_url/spots/5d9377fdb9691c3bab571dd6/bookings - Id do Spot
"base_url/spots/:spot_id/bookings"

No body em formato Json passar a data
{
	"date": "05 de outubro"
}

No Header, pessoa que quer fazer a reserva
user_id | '5d937927ce5b2d3d2f8a5c45' - Alan que quer criar o reserva

Id do Spot - '5d9377fdb9691c3bab571dd6', que ta sendo passado na url

E o usuario Alan que quer reservar - '5d937927ce5b2d3d2f8a5c45', que ta sendo passado no header

{
  "_id": "5d9399e03792f355ea9e8aa3", O ID DA RESERVA
  "user": "5d937927ce5b2d3d2f8a5c45", O ID DE QUEM QUER RESERVAR - Alan
  "spot": "5d938be63c7f2f4cbb3e5bb3", O ID DO SPOT
  "date": "05 de outubro",
  "__v": 0
}

=====================================================================
Erro no CORS (protege o nosso backend, de ser acessado de lugares que nao queremos que seja acesado)
Como impedir?
yarn add cors

Em 'server.js':

const cors = require("cors");
app.use(cors()); // ou podia ser app.use(cors(origin: "http://localhost:3333")), ai so ia deixar essa rota acessar

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");

const app = express();

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

app.use(routes); // para usar as rotas do arquivo routes

app.listen(3333);

=========================================================================

Fazer alteracao no backend para poder recuperar a imagem

Criar um campo virtual, e esse toJSON vai colocar o campo virtual junto com o Schema normal

Em 'Spot.js'
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
  return `http://localhost:3333/files/${this.thumbnail}`;
});

module.exports = mongoose.model("Spot", SpotSchema);

// ---------------------------------------------------------------

Em 'server.js'
const path = require("path");
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads"))); // Cria a rota files e colocar um arquivo estatico, e no caso estou buscando da pasta upload

'Server.js':
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");

const app = express();

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

app.listen(3333);

// ---------------------------------------------------------------

