import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [nomebolo, setNomeBolo] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagem) {
      alert("Por favor, selecione uma imagem!");
      return;
    }

    const formData = new FormData();
    formData.append("nomebolo", nomebolo);
    formData.append("preco", preco);
    formData.append("descricao", descricao);
    formData.append("imagem", imagem);

    try {
      const API_URL = 'http://localhost:7006';

      const response = await fetch(`${API_URL}/dashboard`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "sucesso") {
        alert("Produto cadastrado com sucesso!");
        handleReset();
      } else {
        alert("Erro no servidor: " + data.mensagem);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o backend.");
    }
  };

  const handleReset = () => {
    setNomeBolo("");
    setPreco("");
    setDescricao("");
    setImagem(null);
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <div className="bloco">
        <div className="container-bloco">
          <h1>Cadastro de produtos</h1>

          <div className="titulo">
            <label htmlFor="name">Título</label>
            <input
              type="text"
              name="name"
              placeholder="Nome do produto"
              value={nomebolo}
              onChange={(e) => setNomeBolo(e.target.value)}
              required
            />
          </div>

          <div className="preco-bloco">
            <label htmlFor="preco">Preço</label>
            <input
              type="text"
              name="preco"
              placeholder="Preço do produto"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <div className="descricao-bloco">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              name="descricao"
              placeholder="Descrição do produto"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
          </div>

          <div className="img-bolo">
            <label htmlFor="imagem">Insira a imagem</label>
            <input
              type="file"
              name="imagem"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files[0])}
              required
            />
          </div>

          <div className="botoes">
            <div className="limpar">
              <input type="reset" value="limpar" />
            </div>

            <div className="enviar">
              <input type="submit" value="enviar" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Dashboard;