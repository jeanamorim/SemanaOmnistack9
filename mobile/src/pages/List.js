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
