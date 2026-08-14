import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiTrash2, FiCheck, FiLogOut } from "react-icons/fi";
import axios from "axios";
import "./Dashboard.css";

const API_URL = "http://localhost:7006";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  // Campos do formulário
  const [nomebolo, setNomeBolo] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);

  // Verificação de autenticação ao carregar a página 
  useEffect(() => {
    axios.get(`${API_URL}/auth`, { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          setAdminName(res.data.name);
          setLoading(false);
        } else {
          navigate("/loginadm");
        }
      })
      .catch((err) => {
        console.error("Sessão inválida:", err);
        navigate("/loginadm");
      });
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
      .then(() => {
        navigate("/loginadm");
      })
      .catch((error) => {
        console.error("Erro ao tentar encerrar sessão", error);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLimpar = () => {
    setNomeBolo("");
    setPreco("");
    setDescricao("");
    setImagem(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagem) {
      alert("Por favor, selecione uma imagem!");
      return;
    }

    const precoNumero = parseFloat(preco.replace(",", "."));
    if (isNaN(precoNumero)) {
      alert("Preço inválido!");
      return;
    }
    const precoFormatado = precoNumero.toFixed(2).replace(".", ",");

    const formData = new FormData();
    formData.append("nomebolo", nomebolo);
    formData.append("preco", precoFormatado);
    formData.append("descricao", descricao);
    formData.append("imagem", imagem);

    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        method: "POST",
        credentials: "include", // manda o cookie de sessão, senão o verificarLogin rejeita
        body: formData,
      });

      const data = await response.json();

      if (data.status === "sucesso") {
        alert("Produto cadastrado com sucesso!");
        navigate("/bolosdepote"),
        handleLimpar();
      } else {
        alert("Erro no servidor: " + data.error);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o backend.");
    }
  };

  if (loading) {
    return <div className="loading">Verificando permissões...</div>;
  }

  return (
    <div className="cadastro-wrapper">
      <div className="cadastro-card">
        <div className="header-logout">
          <p>Bem-vindo(a), <strong>{adminName}</strong></p>
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut /> Sair
          </button>
        </div>

        <h1 className="cadastro-titulo">Cadastrar novo produto</h1>
        <p className="cadastro-subtitulo">
          Preencha as informações para adicionar um novo bolo ao menu
        </p>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-group">
            <label htmlFor="nomebolo">Nome do Produto</label>
            <input
              type="text"
              id="nomebolo"
              name="nomebolo"
              placeholder="Ex: Bolo de Chocolate com Morango"
              value={nomebolo}
              onChange={(e) => setNomeBolo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preco">Preço (R$)</label>
            <input
              type="text"
              id="preco"
              name="preco"
              placeholder="Ex: 40,00"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              rows="4"
              placeholder="Descreva os ingredientes, camadas ou destaques do produto"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Imagem do Produto</label>
            <div className="upload-box">
              <input
                type="file"
                id="imagem"
                accept="image/*"
                onChange={handleImageChange}
                className="input-file-hidden"
                required
              />
              <label htmlFor="imagem" className="upload-label">
                {preview ? (
                  <div className="upload-preview">
                    <img src={preview} alt="Pré-visualização" />
                    <span>Clique para trocar a imagem</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <FiUpload className="upload-icon" />
                    <span>Clique para selecionar uma foto</span>
                    <small>PNG, JPG ou WEBP</small>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="form-acoes">
            <button type="button" className="btn-limpar" onClick={handleLimpar}>
              <FiTrash2 /> Limpar
            </button>
            <button type="submit" className="btn-enviar">
              <FiCheck /> Cadastrar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;