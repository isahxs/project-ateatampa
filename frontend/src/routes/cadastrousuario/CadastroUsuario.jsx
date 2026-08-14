import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ValidacaoCadastroUsuario from '../validacao/ValidacaoCadastroUsuario';
import axios from "axios";

import "./CadastroUsuario.css"
import logoPrincipal from "../../assets/logocadastro.png";
import logoCadastro from "../../assets/logoprincipal-Photoroom.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

 
const CadastroUsuario = () => {
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    //Para esconder ou mostrar a senha com o ícone
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const navigate = useNavigate();


    const handleCadastro = async (e) => {
    e.preventDefault();

    setErro('');
    setSucesso('');
        
        const erroValidacao = ValidacaoCadastroUsuario({
            username,
            email,
            senha,
            confirmarSenha
        });

        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:7006/cadastrousuario",
                {
                    nomeusuario: username,
                    email,
                    senha
                }
            );

            console.log(res.data);

            setSucesso("Cadastro realizado com sucesso!");

            setUsername('');
            setEmail('');
            setSenha('');
            setConfirmarSenha('');

            setTimeout(() => {
                navigate('/loginusuario');
            }, 1500);

        } catch (error) {
            console.error(error);
            setErro("Erro ao cadastrar usuário");
        } finally {
            setLoading(false);
        }

  };

    return (  
    <div className="container-fluid" style={{ backgroundColor: '#fdfbf7', color: '#333' }}>
            <div className="row min-vh-100">
                <div className="col-md-6 d-flex justify-content-center align-items-center py-5">
                    <div className="cont-cadastro w-100" style={{ maxWidth: '450px' }}>

                        <section className="cont-logo text-center mb-4">
                            <img
                                src={logoPrincipal}
                                alt="Logo Bolo Encantado"
                                className="img-fluid mb-2" 
                                style={{ maxWidth: '200px' }} 
                            />
                            <h3 className="fw-bold mt-2" style={{ color: '#800000', fontFamily: 'serif' }}>
                                Crie sua conta
                            </h3>
                        </section>

                        {erro && <div className="alert alert-danger">{erro}</div>}
                        {sucesso && <div className="alert alert-success">{sucesso}</div>}

                        <form onSubmit={handleCadastro}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label text-muted small fw-semibold">
                                    Nome de Usuário
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="form-control input-elegante"
                                    placeholder="Insira um nome de usuário"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-muted small fw-semibold">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control input-elegante"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="senha"
                                    className="form-label text-muted small fw-semibold"
                                >
                                    Senha
                                </label>
                                <div className="input-password-wrapper">
                                    <input
                                        type={showSenha ? "text" : "password"}
                                        id="senha"
                                        className="form-control input-elegante"
                                        placeholder="Crie uma senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
                                        minLength={6}
                                    />

                                    <button
                                        type="button"
                                        className="toggle-eye"
                                        onClick={() => setShowSenha(!showSenha)}
                                    >
                                        {showSenha ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="confirmar_senha"
                                    className="form-label text-muted small fw-semibold"
                                >
                                    Confirmar Senha
                                </label>
                                <div className="input-password-wrapper">
                                    <input
                                        type={showConfirmarSenha ? "text" : "password"}
                                        id="confirmar_senha"
                                        className="form-control input-elegante"
                                        placeholder="Repita a senha"
                                        value={confirmarSenha}
                                        onChange={(e) => setConfirmarSenha(e.target.value)}
                                        required
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

                            <div className="d-grid gap-3 mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primario-elegant"
                                    disabled={loading}
                                >
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                </button>

                                <div className="text-center mt-2">
                                    <span className="text-muted small">Já possui uma conta? </span>
                                    <Link
                                        to="/loginusuario"
                                        className="text-decoration-none fw-bold"
                                        style={{ color: '#800000' }}
                                    >
                                        Faça seu login aqui!
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-6 bg-dark d-none d-md-flex justify-content-center align-items-center p-0">
                    <img 
                        src={logoCadastro}
                        alt="Confeitaria"
                        className='img-fluid'
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
                    />
                </div>
            </div>
        </div>
    );

};
 
export default CadastroUsuario;