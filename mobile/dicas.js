import List from "./src/pages/List"

sudo npm install -g expo-cli (sudo para administrador)
expo init mobile
blank
name: AirCnC
Y

cd mobile
yarn start

Abrir o Expo no celular e scannear pelo celular

Se for usar o Genymotion:
Abri o emulador e clicar em  "Run on Android device/emulator"

================================================================

Criar uma pasta 'src' na raiz e dentro a pasta 'pages', e dentro de 'pages'
criar os arquivos 'Login.js', 'List.js', 'Book.js':

import React from "react";
import { View } from "react-native";

export default function Login() {
  return <View />;
}

// --------------------------------------------------------------

Fazer a rotas da aplicacao
expo install react-native-gesture-handler react-native-reanimated
yarn add react-navigation

Dentro da 'src' criar o arquivo 'routes.js'

'routes.js':
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import Login from "./pages/Login";
import List from "./pages/List";
import Book from "./pages/Book";

const Routes = createAppContainer(
  createSwitchNavigator({
    Login,
    List,
    Book
  })
);

export default Routes;

// -----------------------------------------------

E la no 'App.js' importar esse Routes

'App.js':
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Routes from "./src/routes";

export default function App() {
  return <Routes />;
}


// -------------------------------------------------------

Se der erro so reiniciar a aplicacao

O Login eh a primeira tela, depois List, e no final Book

Colocar a pasta 'assets' na 'src'

// -------------------------------------------------------

Fazer a pagina 'Login.js':

'Login.js':
import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import logo from "../assets/logo.png";

export default function Login() {
  return (
    <KeyboardAvoidingView
      // enabled={Platform.OS === "ios"} tava dando erro com o android tb, mas por padrao ele roda
      behavior="padding"
      style={styles.container}
    >
      <Image source={logo}></Image>

      <View style={styles.form}>
        <Text style={styles.label}>SEU EMAIL *</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#999"
          keyboardType="email-address" // Teclado do celular que mostra o "@"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>TECNOLOGIAS *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tecnologias de interesse"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Encontrar spots</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  form: {
    alignSelf: "stretch",
    paddingHorizontal: 30,
    marginTop: 30
  },

  label: {
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#444",
    height: 44,
    marginBottom: 20,
    borderRadius: 2
  },

  button: {
    height: 42,
    backgroundColor: "#f05a5b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  }
});

==============================================

Fazer a comunicacao com a API

yarn add axios

Na 'src' criar a pasta 'services' e dentro o arquivo 'api.js'

'api.js':
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.107:3333" // No emulador: "http://localhost:3333"
});

export default api;


// --------------------------------------------------------

Rodar o backend

Conectar a pagina login com a api para recuper o email e o id do email

import React, { useState, useEffect } from "react";
import {
  View,
  AsyncStorage, // eh como se fosse o localStorage
  KeyboardAvoidingView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import api from "../services/api";

import logo from "../assets/logo.png";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [techs, setTechs] = useState("");

  // Para nao deixar voltar para tela inicial
  // useEffect = realizar uma acao assim que o usuario chega na tela, se deixar o "[]" vazio, so vai executar uma vez no comeco, quando o componente eh montado na tela
  // Vai buscar no AsyncStorage, se ja existe um usuario, se existir, navegue ele imediatamente para a pagina 'List'
  useEffect(() => {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        navigation.navigate("List");
      }
    });
  }, []);

  async function handleSubmit() {
    const response = await api.post("/sessions", {
      email
    });

    const { _id } = response.data; // Vai recuperar o id do usuario

    await AsyncStorage.setItem("user", _id); // Vai salvar no celular
    await AsyncStorage.setItem("techs", techs);

    navigation.navigate("List"); // Eh igual ao history do React, serve para mudar de pagina
  }

  return (
    <KeyboardAvoidingView
      // enabled={Platform.OS === "ios"} tava dando erro com o android tb, mas por padrao ele roda
      behavior="padding"
      style={styles.container}
    >
      <Image source={logo}></Image>

      <View style={styles.form}>
        <Text style={styles.label}>SEU EMAIL *</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#999"
          keyboardType="email-address" // Teclado do celular que mostra o "@"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>TECNOLOGIAS *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tecnologias de interesse"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Encontrar spots</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  form: {
    alignSelf: "stretch",
    paddingHorizontal: 30,
    marginTop: 30
  },

  label: {
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#444",
    height: 44,
    marginBottom: 20,
    borderRadius: 2
  },

  button: {
    height: 42,
    backgroundColor: "#f05a5b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  }
});


// -------------------------------------------------------------

Rota List

Reaproveitar, fazendo components
Na 'src' criar a pasta 'components' e dentro o arquivo 'SpotList.js'

'SpotList.js':
import React from "react";
import { View, Text } from "react-native";

export default function SpotList({ tech }) {
  return <Text>{tech}</Text>;
}

// -------------------------------------------------------------
importo esse SpotList la no 'List.js'

'List.js':
import SpotList from "../components/SpotList";
return (
  <SafeAreaView style={styles.container}>
    <Image style={styles.logo} source={logo} />

    <SpotList tech="ReactJS" />
  </SafeAreaView>
);

// -------------------------------------------------------------
Mudei la no Model de Spot do backend, o IP da maquina para buscar aas imagens

'List.js':
import React, { useState, useEffect } from "react";
import {
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

  // Assim que essa pagina for montada, a variavel techs, ja vai estar preenchida com as tecnologias, o setTechs que botou no techs
  useEffect(() => {
    AsyncStorage.getItem("techs").then(storagedTechs => {
      const techsArray = storagedTechs.split(",").map(tech => tech.trim()); // Antes: [ReactJS, Node.js], Depois: [ReactJS], [Node.js]

      setTechs(techsArray);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <ScrollView>
        {techs.map(tech => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" && StatusBar.currentHeight // Para dispositivos android que possuem notch
  },

  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 10
  }
});

// ScrollView - Barra de rolagem vertical

// ----------------------------------------------------------------------

'SpotList.js':
import React, { useState, useEffect } from "react";
import { withNavigation } from "react-navigation";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";

import api from "../services/api";

function SpotList({ tech, navigation }) {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    async function loadSpots() {
      const response = await api.get("/spots", {
        params: { tech } // params - para passar pelo query params igual do insomnia. E o tech ta vindo pela propriedade desse componente, ta vindo de todos os techs salvos no celular
      });

      setSpots(response.data); // Para preencher o spots, com as informacoes de cada tecnologia
    }

    loadSpots();
  }, []);

  // importar o withNavigation, para poder usar o navigation, em um componente que nao seja uma pagina
  // tira o export default que estava junto com 'function SpotList', joga la pro final e coloca o withNavigation com o SpotList dentro: export default withNavigation(SpotList);
  // colocar navigation como parametro do function SpotList: function SpotList({ tech, navigation })
  // Quando clicar no botao "Solicitar reserva", vai ser redirecionado para a pagina Book
  // E vai redirecionar para pagina da tecnologia pelo id, o onPress vai receber por parametro: onPress={() => handleNavigate(item._id)}
  function handleNavigate(id) {
    navigation.navigate("Book", { id }); // ID do SPOT que quero reservar
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Empresas que usam <Text style={styles.bold}>{tech}</Text>
      </Text>

      <FlatList
        style={styles.list}
        data={spots}
        keyExtractor={spot => spot._id} // Que seja apenas uma informacao, o id unico
        horizontal // A lista eh horizontal
        showsHorizontalScrollIndicator={false} // Nao mostra a barra de rolagem horizontal
        // Esse item eh o spot, pq o renderItem ta percorrendo a FlatList
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image
              style={styles.thumbnail}
              source={{ uri: item.thumbnail_url }}
            />

            <Text style={styles.company}>{item.company}</Text>

            <Text style={styles.price}>
              {item.price ? `R$${item.price}/dia` : "GRATUITO"}
            </Text>

            <TouchableOpacity
              onPress={() => handleNavigate(item._id)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Solicitar reserva</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// No TouchableOpacity ele ta buscando o ID do SPOT que quero reservar

const styles = StyleSheet.create({
  container: {
    marginTop: 30
  },

  title: {
    fontSize: 20,
    color: "#444",
    paddingHorizontal: 20,
    marginBottom: 15
  },

  bold: {
    fontWeight: "bold"
  },

  list: {
    paddingHorizontal: 20
  },

  listItem: {
    marginRight: 15
  },

  thumbnail: {
    width: 200,
    height: 120,
    resizeMode: "cover",
    borderRadius: 2
  },

  company: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10
  },

  price: {
    fontSize: 15,
    color: "#999",
    marginTop: 5
  },

  button: {
    height: 32,
    backgroundColor: "#f05a5b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginTop: 15
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15
  }
});

export default withNavigation(SpotList);


// ----------------------------------------------------------------------

'Book.js':

import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from "react-native";

import api from "../services/api";

export default function Book({ navigation }) {
  const [date, setDate] = useState("");
  const id = navigation.getParam("id"); // ID do SPOT que quero reservar

  async function handleSubmit() {
    const user_id = await AsyncStorage.getItem("user");

    await api.post(
      `/spots/${id}/bookings`,
      {
        date // como pede no req.body
      },
      {
        headers: { user_id }
      }
    );

    Alert.alert("Solicitacao de reserva enviada");

    navigation.navigate("List");
  }

  function handleCancel() {
    navigation.navigate("List");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>DATA DE INTERESSE</Text>
      <TextInput
        style={styles.input}
        placeholder="Qual data voce quer reservar?"
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Solicitar reserva</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCancel}
        style={[styles.button, styles.cancelButton]}
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 30,
    flex: 1,
    paddingTop: Platform.OS === "android" && StatusBar.currentHeight // Para dispositivos android que possuem notch
  },

  label: {
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
    marginTop: 30
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#444",
    height: 44,
    marginBottom: 20,
    borderRadius: 2
  },

  button: {
    height: 42,
    backgroundColor: "#f05a5b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2
  },

  cancelButton: {
    backgroundColor: "#ccc",
    marginTop: 10
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  }
});

// ---------------------------------------------------------------

E conectar o mongoDB com o mongoDBCompass para visualizar o banco de dados
PRESTA ATENCAO VOCE NAO E MAIS LEIGO