import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ValidacaoLoginUsuario from '../validacao/ValidacaoLoginUsuario';
import { useAuth } from '../../logout/AuthContext';
import axios from "axios";

import './LoginUsuario.css';
import logoPrincipal from "../../assets/logocadastro.png";
import logoCadastro from "../../assets/logoprincipal-Photoroom.png";
import { FiEye, FiEyeOff } from "react-icons/fi";


const API_URL = "http://localhost:7006";

const LoginUsuario = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    //Para esconder ou mostrar a senha com o ícone
    const [showSenha, setShowSenha] = useState(false);

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const { setLogado, setNomeUsuario } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        axios.post(`${API_URL}/loginusuario`, { email, senha }, { withCredentials: true })
            .then((res) => {
             setLogado(true);
             setNomeUsuario(res.data.name);
             navigate("/");
            })
            .catch((error) => {
                console.error(error);
            });

        const erroValidacao = ValidacaoLoginUsuario({ email, senha });
        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post(
                (`${API_URL}/loginusuario`),
                { email, senha },
                { withCredentials: true }
            );
            if (response.data.message) {
                setSucesso('Login realizado com sucesso!');
                setTimeout(() => {
                    navigate('/meuspedidos');
                }, 1500);
            }
        } catch (err) {
            setErro(err.response?.data?.error || "Erro ao conectar com o servidor");
        } finally {
            setLoading(false);
        }

    };

 return (   
    <div className="container-fluid min-vh-100" style={{ backgroundColor: '#fdfbf7', color: '#333' }}>
            <div className="row min-vh-100">

                <div className="col-md-6 d-flex justify-content-center align-items-center py-5">
                    <div className="cont-cadastro w-100" style={{ maxWidth: '420px' }}>

                        <section className="cont-logo text-center mb-4">
                            <img
                                src={logoPrincipal}
                                alt="Logo Bolo Encantado"
                                className="img-fluid mb-2" 
                                style={{ maxWidth: '200px' }} 
                            />
                            <h3 className="fw-bold mt-2" style={{ color: '#800000', fontFamily: 'serif' }}>
                                Acesse sua conta
                            </h3>
                        </section>

                        {erro && (
                            <div className="alert alert-danger alert-custom">
                                {erro}
                            </div>
                        )}

                        {sucesso && (
                            <div className="alert alert-success alert-custom">
                                {sucesso}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-muted small fw-semibold">
                                    E-mail
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    className="form-control input-elegante"
                                    placeholder="Insira seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
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
                                        placeholder="Insira sua senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
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

                            <div className="d-grid gap-3 mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primario-elegante w-100 py-2 fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </button>

                                <div className="text-center mt-2">
                                    <span className="text-muted small">Não possui uma conta? </span>
                                    <Link
                                        to="/cadastrousuario"
                                        className="text-decoration-underline fw-bold"
                                        style={{ color: '#800000' }} 
                                    >
                                        Cadastre-se aqui
                                    </Link>
                                </div>
                                <div className="text-center mt-2">
                                    <span className="text-muted small">Deseja recuperar a senha? </span>
                                    <Link
                                        to="/recuperarsenhausuario"
                                        className="text-decoration-underline fw-bold"
                                        style={{ color: '#800000' }} 
                                    >
                                        Recuperar a senha
                                    </Link>
                                </div>

                                <div className='acesso-adm'>
                                    <Link to="/loginadm">Acessar como administrador</Link>
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

export default LoginUsuario;
