import React, { useState, useMemo } from "react";
import api from "../../services/api";

import camera from "../../assets/camera.svg";

import "./styles.css";

export default function New({ history }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [company, setCompany] = useState("");
  const [techs, setTechs] = useState("");
  const [price, setPrice] = useState("");

  // Toda vez que a imagem da preview mudar, vai usar o useMemo, porque ele remonta sempre quando recebe um novo valor na variavel
  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null; // Vai criar uma url pra uma variavel temporaria, para a imagem
  }, [thumbnail]);

  // Aqui eh o formato Multipart Form
  // E previnir o submit para nao levar pra outro lugar
  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData();
    const user_id = localStorage.getItem("user"); // Pegando o id do user no localStorage

    data.append("thumbnail", thumbnail);
    data.append("company", company);
    data.append("techs", techs);
    data.append("price", price);

    await api.post("/spots", data, {
      headers: { user_id } // Ta enviando o user_id que foi pegado la do localStorage, e colocando no headers
    });

    history.push("/dashboard"); // Enviar para a pagina dashboard, tem que passar o history como parametro da funcao da pagina
  }

  return (
    <form onSubmit={handleSubmit}>
      <label
        id="thumbnail"
        style={{ backgroundImage: `url(${preview})` }}
        className={thumbnail ? "has-thumbnail" : ""} // Classe condicional, a condicao vai estar no css, Se tiver uma thumbnail, vai tirar a borda e tirar a img da camera.
      >
        <input
          type="file"
          onChange={event => setThumbnail(event.target.files[0])} // Quando colocar um arquivo aqui, ele vai para o thumbnail, ai o preview vai ver se existe uma thumnail, e vai montar uma url temporaria para essa thumbnail, e colocar o preview como background do label, o input ta dentro do label entao vai ficar tudo junto
        />
        <img src={camera} alt="Select img" />
      </label>

      <label htmlFor="company">EMPRESA *</label>
      <input
        id="company"
        placeholder="Sua empresa incrivel"
        value={company}
        onChange={event => setCompany(event.target.value)}
      />

      <label htmlFor="company">
        TECNOLOGIAS * <span>(separadas por virgula)</span>
      </label>
      <input
        id="techs"
        placeholder="Quais tecnologias usam?"
        value={techs}
        onChange={event => setTechs(event.target.value)}
      />

      <label htmlFor="price">
        VALOR DA DIARIA * <span>(em branco para gratuito)</span>
      </label>
      <input
        id="price"
        placeholder="Valor cobrado por dia"
        value={price}
        onChange={event => setPrice(event.target.value)}
      />

      <button type="submit" className="btn">
        Cadastrar
      </button>
    </form>
  );
}
