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
