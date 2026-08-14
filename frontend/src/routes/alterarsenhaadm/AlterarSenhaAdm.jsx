import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import "./AlterarSenhaAdm.css";
import logoPrincipal from "../../assets/logocadastro.png";
import logoCadastro from "../../assets/logoprincipal-Photoroom.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

const API_URL = "http://localhost:7006";

const AlterarSenhaAdm = () => {
  const navigate = useNavigate();

  //Valores das senhas
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  //Para esconder ou mostrar a senha
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleAlterarSenha = async (e) => {
    e.preventDefault();

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.warn("Por favor, preencha todos os campos!");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("A nova senha e a confirmação não coincidem!");
      return;
    }

    if (novaSenha.length < 6) {
      toast.warn("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/alterarsenhaadm`,
        { senhaAtual, novaSenha },
        { withCredentials: true }
      );

      toast.success("Senha alterada com sucesso!");
      setTimeout(() => navigate("/loginadm"), 2000);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Erro ao tentar alterar a senha"
      );
    }
  };

  return (
    <div className="alterar-senha-container">
      {/* Formulário */}
      <div className="alterar-senha-adm-form-section">
        <div className="alterar-senha-adm-content">
          <img src={logoPrincipal} alt="Logo Até a Tampa" className="alterar-senha-adm-logo" />

          <h2>Alterar Senha Adm</h2>

          <form onSubmit={handleAlterarSenha}>
            {/* Nova senha */}
            <div className="input-group">
              <label>Nova Senha*</label>
              <div className="input-password-wrapper">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  placeholder="Insira a nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-eye"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                >
                  {showNovaSenha ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Confirmar senha */}
            <div className="input-group">
              <label>Confirmar Senha*</label>
              <div className="input-password-wrapper">
                <input
                  type={showConfirmarSenha ? "text" : "password"}
                  placeholder="Confirme a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-eye"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                >
                  {showConfirmarSenha ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Botões */}
            <div className="alterar-senha-adm-buttons">
              <button type="submit" className="btn-salvar-adm">
                Alterar
              </button>
              <button
                type="button"
                className="btn-cancelar-adm"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Imagem ao lado */}
      <div className="alterar-senha-adm-image-section">
        <img src={logoCadastro} alt="Confeiteira confeitando bolo" />
      </div>

      <ToastContainer autoClose={2000} position="top-right" />
    </div>
  )
}

export default AlterarSenhaAdm;