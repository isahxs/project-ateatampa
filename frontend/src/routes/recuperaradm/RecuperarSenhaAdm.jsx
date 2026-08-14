import React, { useState } from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import "./RecuperarSenhaAdm.css";
import logoPrincipal from "../../assets/logocadastro.png";
import logoCadastro from "../../assets/logoprincipal-Photoroom.png";

const API_URL = "http://localhost:7006";

const RecuperarSenhaAdm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecuperarSenha = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warn("Por favor, informe o seu e-mail!");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/recuperar-senha`, { email });

      toast.success("E-mail de recuperação enviado com sucesso!");
      setTimeout(() => navigate("/loginadm"), 3000);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Erro ao solicitar recuperação de senha."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recuperar-senha-adm-container">
      {/* Formulário */}
      <div className="recuperar-senha-adm-form-section">
        <div className="recuperar-senha-adm-content">
          <img src={logoPrincipal} alt="Logo Até a Tampa" className="recuperar-senha-adm-logo" />
    
          <h2>Recuperar senha Adm</h2>
          <p className="subtitle">Informe seu e-mail</p>
    
          <form onSubmit={handleRecuperarSenha}>
            {/* E-mail */}
            <div className="input-group">
              <label>E-mail*</label>
              <input
                type="email"
                placeholder="Insira seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
    
            {/* Botão */}
            <button type="submit" className="btn-recuperar-adm" disabled={loading}>
              {loading ? "Enviando..." : "Recuperar senha"}
            </button>

            <div className="text-center mt-2">
              <span className="text-muted small">Deseja alterar a sua senha? </span>
              <Link
                to="/alterarsenhaadm"
                className="text-decoration-underline fw-bold"
                style={{ color: '#161C5C' }}
                >
                  Alterar senha
                </Link>
            </div>
    
            {/* Voltar */}
            <div className="back-link-adm">
              <Link to="/loginadm">Voltar para a tela de login</Link>
            </div>
          </form>
        </div>
      </div>
    
      {/* Imagem */}
      <div className="recuperar-senha-adm-image-section">
        <img src={logoCadastro} alt="Confeiteira confeitando bolo" />
      </div>
    
      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  )
}

export default RecuperarSenhaAdm;