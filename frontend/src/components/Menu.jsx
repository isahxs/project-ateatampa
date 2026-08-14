import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../logout/AuthContext";
import { useCart } from "../somacarrinho/CartContext";
import { useProdutos } from "../hooks/useProdutos";
import axios from "axios";

//Logo do site
import Logo from "../assets/AteaTampa.png";

//Ícones
import { MdOutlineShoppingCart } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi2";
import { LuMenu } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";

//CSS e Data para a busca de sabores e páginas
import { paginas } from "../data/dadosBusca"; 
import "./Menu.css";

const API_URL = "http://localhost:7006";

const Menu = () => {
  const navigate = useNavigate();

  //Const para ícone de user trocar assim que o usuário logar no site
  const { logado, nomeUsuario, setLogado, setNomeUsuario } = useAuth();
  const { totalItens } = useCart();
  const { produtos } = useProdutos();

  //Const para menu aberto e fechado no mobile
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const closeMenu = () => setOpen(false);

  //Proceso de confirmação de login do usuário
  const confirmarLogout = () => {
    axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
    .then(() => {
      setLogado(false);
      setNomeUsuario("");
      toast.success("Você saiu da sua conta");
      navigate("/");
    })
    .catch((error) => {
      console.error("Erro ao tentar encerrar sessão", error);
      toast.error("Não foi possível encerrar a sessão");
    });
  };

  const handleLogoutClick = () => {
    toast(
      ({ closeToast }) => (
        <div className="logout-content">
          <p>Deseja mesmo sair da sua conta?</p>
          <div className="logout-buttons">
            <button className="btn-confirm"
              onClick={() => {
              confirmarLogout();
              closeToast();
            }}
            >
              Sim
            </button>
            <button className="btn-cancel" onClick={closeToast}>
              Não
            </button>
          </div>
        </div>
      ),
      { autoClose: 20000, closeOnClick: false, toastId: "logout-confirm" }
    );
  };

  // Função para tratar no campo de pesquisa texto retirando acentos e espaços extras
  const formatarTexto = (texto) =>
    texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  //Funcão no Search
  const handleSearch = (e) => {
    e.preventDefault();
    setMensagemErro("");

    //Se o input de pesquisa estiver vazio, fecha a barra
    if (!searchTerm.trim()) {
      if (searchOpen) {
        setSearchOpen(false);
      }
      return;
    }
      
    const termoBusca = formatarTexto(searchTerm);

    // Procura se é uma página
    const paginaEncontrada = paginas.find((p) =>
      formatarTexto(p.nome).includes(termoBusca)
    );

    if (paginaEncontrada) {
      setSearchTerm("");
      setSearchOpen(false);
      navigate(paginaEncontrada.rota);
      return;
    }

    // Procura se é um bolo pelo nome
    const boloEncontrado = produtos.find((b) =>
      formatarTexto(b.nome).includes(termoBusca)
    );

    if (boloEncontrado) {
      setSearchTerm("");
      setSearchOpen(false);
      navigate(`/bolos/${boloEncontrado.id}`);
      return;
    }

    // Caso Se não encontrar nada
    setMensagemErro("Bolo não encontrado");
    setTimeout(() => setMensagemErro(""), 2000); // Apaga a mensagem após 3s
  };

  return (
    <header className="header">
      <div>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "logo")}>
          <img src={Logo} alt="logo" className="logo" />
        </NavLink>
      </div>

      <nav className={`nav ${open ? "active" : ""}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/sobrenos" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
              Sobre Nós
            </NavLink>
          </li>
          <li>
            <NavLink to="/bolosdepote" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
              Meus Bolos
            </NavLink>
          </li>
          <li>
            <NavLink to="/meuspedidos" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
              Meus Pedidos
            </NavLink>
          </li>
          
        </ul>
      </nav>

      {/* Formulário Search Desktop */}
      <div className="search-container">
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <IoIosSearch />
          </button>
        </form>

        {/* Mensagem de Erro quando não encontra nada */}
        {mensagemErro && <span className="search-error">{mensagemErro}</span>}
      </div>

      <div className="icons">
        {logado ? (
          <button className="logout" onClick={handleLogoutClick} title={`Sair (${nomeUsuario})`}>
            <FiLogOut />
          </button>
        ) : (
          <NavLink to="/loginusuario" className={({ isActive }) => (isActive ? "user active" : "user")}>
            <HiOutlineUser />
          </NavLink>
        )}
        <NavLink to="/carrinho" className={({ isActive }) => (isActive ? "buy active" : "buy")}>
          <MdOutlineShoppingCart />
          {totalItens > 0 && (
            <span className="cart-badge cart-badge-bounce">
              {totalItens}
            </span>)}
        </NavLink>
      </div>

      {/* Mobile Responsivo */}
      <div className="mobile-responsive">
        {!searchOpen && (
          <div className="search-toggle" 
            onClick={() => {
              setSearchOpen(true);
              setSearchTerm("");
            }}
            >
            <IoIosSearch />
          </div>
        )}

        {searchOpen && (
        <div className="search-responsive-container">
          <form className="search-responsive open" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autofocus
            />
            <button type="submit" className="search-button">
              <IoIosSearch />
            </button>
          </form>

          {/* Mensagem de erro */}
          {mensagemErro && <span className="search-error mobile">{mensagemErro}</span>}
         </div> 
        )}

        <div className="icon-mobile">
          {logado ? (
          <button className="logout" onClick={handleLogoutClick} title={`Sair (${nomeUsuario})`}>
            <FiLogOut />
          </button>
        ) : (
          <NavLink to="/loginusuario" className={({ isActive }) => (isActive ? "user active" : "user")}>
            <HiOutlineUser />
          </NavLink>
        )}
        </div>

        <div className="hamburguer" onClick={() => setOpen(!open)}>
          <LuMenu />
        </div>
      </div>
     <ToastContainer autoClose={2000} position="top-right" />
    </header>
  );
};

export default Menu;