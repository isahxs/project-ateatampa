import React, { useState } from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify";

import "./DigitarCodigoUsuario.css";
import logoPrincipal from "../../assets/logocadastro.png";
import logoCadastro from "../../assets/logoprincipal-Photoroom.png";


const DigitarCodigoUsuario = () => {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();

    if (!codigo.trim()) {
      toast.warn("Por favor, informe o código recebido no e-mail");
      return;
    }

    try {
      setLoading(true);

      toast.success("Código validado com sucesso!");
      setTimeout(() => navigate("/loginusuario"), 3000);
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
    <div className="recuperar-senha-container">
      {/* Formulário */}
      <div className="recuperar-senha-form-section">
        <div className="recuperar-senha-content">
          <img src={logoPrincipal} alt="Logo Até a Tampa" className="recuperar-senha-logo" />

          <h2>Recuperar senha</h2>
          <p className="subtitle">Digite o código enviado no seu e-mail - Expira em 5 minutos</p>

          <form onSubmit={handleEnviarCodigo}>
            {/* E-mail */}
            <div className="input-group">
              <label>Código recebido</label>
              <input
                type="text"
                placeholder="Digite o código nesse campo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>

            {/* Botão */}
            <button type="submit" className="btn-recuperar" disabled={loading}>
              {loading ? "Enviando..." : "Recuperar senha"}
            </button>

            {/* Voltar */}
            <div className="back-link">
              <Link to="/loginusuario">Voltar para a tela de login</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Imagem */}
      <div className="recuperar-senha-image-section">
        <img src={logoCadastro} alt="Confeiteira confeitando bolo" />
      </div>

      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  )
}

export default DigitarCodigoUsuario;