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
            <button
              className="accept"
              onClick={() => handleAccept(request._id)}
            >
              ACEITAR
            </button>
            <button
              className="reject"
              onClick={() => handleReject(request._id)}
            >
              REJEITAR
            </button>
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
