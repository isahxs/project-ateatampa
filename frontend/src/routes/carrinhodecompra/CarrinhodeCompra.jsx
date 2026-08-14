import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../logout/AuthContext";
import { useCart } from "../../somacarrinho/CartContext";
import "./CarrinhodeCompra.css";

//Ícones
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { BiMinus, BiPlus, BiX } from "react-icons/bi";
import { MdOutlineShoppingCart } from "react-icons/md";

const API_URL = "http://localhost:7006";
const NUMERO_WHATSAPP = "5511977178338"

const CarrinhodeCompra = () => {
  const { carrinho, atualizarQuantidade, removerDoCarrinho, limparCarrinho } = useCart();
  const { logado } = useAuth();
  const [cep, setCep] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  //Converter preço string ou número 40 para Float
  const formatarPreco = (preco) =>
  typeof preco === "number" ? preco : parseFloat(preco.toString().replace(",", "."));

  // Carrinho vazio
  if (carrinho.length === 0) {
    return (
      <div className="carrinho-wrapper">
        <h1 className="titulo-carrinho">Meu Carrinho</h1>
        
        <div className="carrinho-box-vazio">
          <div className="carrinho-vazio-card">
            <div className="icone-carrinho-vazio">
              <MdOutlineShoppingCart />
            </div>
            
            <h2>Carrinho vazio</h2>

            {logado ? (
              <>
                <p>Você ainda não adicionou nenhum bolo ao carrinho</p>
                <Link to="/bolosdepote" className="btn-voltar-compras">
                  Fazer pedido agora
                </Link>
              </>
            ) : (
             <>
                <p>Cadastre-se no nosso site para adicionar os seus pedidos no carrinho!</p>
                <Link to="/cadastrousuario" className="btn-voltar-compras">
                  Cadastrar agora
                </Link>
              </> 
            )}
          </div>
        </div>
      </div>
    );
  }

  //Cálculo de todos os itens no carrinho
  const totalGeral = carrinho.reduce((acc, item) => {
    return acc + formatarPreco(item.preco) * item.quantidade;
  }, 0);
  
  //Monta a mesagem do whatsapp com o resumo do pedido
  const montarMensagemWhatsapp = () => {
    const linhas = carrinho.map((item) => {
      const precoUnitario = formatarPreco(item.preco);
      return `${item.quantidade}x ${item.nome} - R${(precoUnitario * item.quantidade).toFixed(2).replace(".", ",")}`;

    });
    const mensagem = [
      "Olá! Gostaria de confirmar meu pedido:",
      "",
      ...linhas,
      "",
      `Total: R$ ${totalGeral.toFixed(2).replace(".", ",")}`,
      cep ? `CEP para entrega: ${cep}` : "",
    ].filter(Boolean).join("\n");

    return `https://wa.me;${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  };

  const handleConcluirPedido = async () => {
    setEnviando(true);
    try {
      const itensFormatados = carrinho.map((item) => ({
        id: item.id,
        nome: item.nome,
        preco: formatarPreco(item.preco),
        quantidade: item.quantidade,
        img: item.img,
      }));

      await axios.post(`${API_URL}/pedidos`, {
        itens: itensFormatados,
        total: totalGeral,
      }, { withCredentials: true });

      const linkWhatsapp = montarMensagemWhatsapp();
        limparCarrinho();
        window.open(linkWhatsapp, "_blank");
        navigate("/meuspedidos");
    } catch (error) {
        console.error("Erro ao registrar pedido:", error);
        toast.error("Não foi possível registrar seu pedido");
    } finally {
      setEnviando(false);
    }
  }

 return (
    <div className="carrinho-wrapper">
      <h1 className="titulo-carrinho">Meu Carrinho</h1>

      <div className="carrinho-box">
        <div className="carrinho-grid">
          
          <div className="tabela-scroll">
            <div className="tabela-produtos">
              <div className="tabela-header">
                <span>Produto</span>
                <span>Preço</span>
                <span>Quantidade</span>
                <span>Subtotal</span>
              </div>

              {/* Mapear todos os sabores do carrinho */}
                {carrinho.map((item) => {
                const precoUnitario = formatarPreco(item.preco);
                const subtotalItem = precoUnitario * item.quantidade;

                return (
                  <div key={item.id} className="tabela-linha">
                    <button
                      className="btn-remover"
                      title="Remover item"
                      onClick={() => removerDoCarrinho(item.id)}
                    >
                      <BiX />
                    </button>

                    <div className="produto-info">
                      <img src={item.img} alt={item.nome} />
                      <span className="produto-nome">{item.nome}</span>
                    </div>

                    <div className="produto-preco">
                      R$ {precoUnitario.toFixed(2).replace(".", ",")}
                    </div>

                    <div className="quantidade-control">
                      <button onClick={() => atualizarQuantidade(item.id, -1)}>
                        <BiMinus />
                      </button>
                      <span>{item.quantidade}</span>
                      <button onClick={() => atualizarQuantidade(item.id, 1)}>
                        <BiPlus />
                      </button>
                    </div>

                    <div className="produto-subtotal">
                      R$ {subtotalItem.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card lateral de resumo */}
          <div className="resumo-card">
            <h2>Total no carrinho</h2>

            <div className="resumo-linha">
              <span>Subtotal</span>
              <span>R$ {totalGeral.toFixed(2).replace(".", ",")}</span>
            </div>

            <div className="cep-secao">
              <label htmlFor="cep-input">
                <FaMapMarkerAlt /> CEP para entrega
              </label>
              <input
                id="cep-input"
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
            </div>

            <div className="resumo-linha total-destaque">
              <span className="total-resumo">Total:</span>
              <strong>R$ {totalGeral.toFixed(2).replace(".", ",")}</strong>
            </div>

            <button className="btn-limpar-carrinho" onClick={limparCarrinho}>Limpar carrinho
            </button>

            <button className="btn-whatsapp" onClick={handleConcluirPedido} disabled={enviando}>
              {enviando ? "Enviando..." : "Continuar para o pagamento"} <FaWhatsapp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrinhodeCompra;