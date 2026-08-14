import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useCart } from "../../somacarrinho/CartContext";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BiRefresh } from "react-icons/bi";
import "./MeusPedidos.css";

const API_URL = "http://localhost:7006";

const formatarData = (dataISO) => {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

const formatarPreco = (preco) =>
  typeof preco === "number" ? preco : parseFloat(preco.toString().replace(",", "."));

const classeStatus = (status) => {
  if (status?.toLowerCase().includes("confirma")) return "status-confirmado";
  if (status?.toLowerCase().includes("cancela")) return "status-cancelado";
  return "status-aguardando";
};

const MeusPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { adicionarAoCarrinho } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/meuspedidos`, { withCredentials: true })
      .then((res) => setPedidos(res.data))
      .catch((error) => console.error("Erro ao buscar pedidos:", error))
      .finally(() => setLoading(false));
  }, []);

  const handlePedirNovamente = (pedido) => {
    pedido.itens.forEach((item) => {
      const itemParaCarrinho = {
        id: item.id_bolo,
        nome: item.nome_bolo,
        preco: formatarPreco(item.preco_unitario),
        img: item.img,
      };
      for (let i = 0; i < item.quantidade; i++) {
        adicionarAoCarrinho(itemParaCarrinho);
      }
    });

    toast.success("Itens adicionados ao carrinho!");
    navigate("/carrinho");
  };

  if (loading) return <div className="loading">Carregando seus pedidos...</div>;

  if (pedidos.length === 0) {
    return (
      <div className="pedidos-wrapper">
        <h1 className="titulo-pedidos">Meus Pedidos</h1>
        <div className="pedidos-box-vazio">
          <div className="pedidos-vazio-card">
            <div className="icone-pedidos-vazio"><MdOutlineShoppingCart /></div>
            <h2>Nenhum pedido ainda</h2>
            <p>Que tal dar uma olhada no nosso menu de bolos?</p>
            <Link to="/bolosdepote" className="btn-voltar-compras">Ver o menu</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pedidos-wrapper">
      <h1 className="titulo-pedidos">Meus Pedidos</h1>

      <div className="pedidos-lista">
        {pedidos.map((pedido) => (
          <div className="card-pedido" key={pedido.id_pedido}>

            <div className="pedido-header">
              <div className="pedido-header-info">
                <span className="pedido-numero">Pedido #{pedido.id_pedido}</span>
                <span className="pedido-data">{formatarData(pedido.criado_em)}</span>
              </div>
              <span className={`status-badge ${classeStatus(pedido.status)}`}>
                {pedido.status}
              </span>
            </div>

           <div className="pedido-itens-container">
              <ul className="pedido-itens">
                {pedido.itens.map((item) => (
                  <li key={item.id_item} className="pedido-item-linha">
                    <img src={item.img} alt={item.nome_bolo} className="item-thumb" />
                    <span className="item-nome">{item.quantidade}x {item.nome_bolo}</span>
                    <span className="item-preco">
                      R$ {(formatarPreco(item.preco_unitario) * item.quantidade).toFixed(2).replace(".", ",")}
                    </span>
                </li>
                ))}
              </ul>
            </div>



            <div className="pedido-footer">
              <div className="pedido-total">
                Total: <strong>R$ {formatarPreco(pedido.total).toFixed(2).replace(".", ",")}</strong>
              </div>
              <button className="btn-pedir-novamente" onClick={() => handlePedirNovamente(pedido)}>
                <BiRefresh /> Pedir novamente
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeusPedidos;