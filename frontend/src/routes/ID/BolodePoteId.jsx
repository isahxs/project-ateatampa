import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useProdutos } from '../../hooks/useProdutos';
import { useCart } from "../../somacarrinho/CartContext";
import { formatarPreco } from "../../formatnumbers/utils";
import { BiMinus, BiPlus, BiArrowBack } from "react-icons/bi";
import { FaShoppingBag, FaLeaf, FaSnowflake } from "react-icons/fa";
import "./BolodePoteId.css";

const BolodePoteId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adicionarAoCarrinho } = useCart();
  const {produtos, loading } = useProdutos();
  const [qtd, setQtd] = useState(1);

  if (loading)
  return <p className="status-msg">Carregando detalhes...</p>
  
  const item = produtos.find((b) => String(b.id) === id);

  if (!item)
  return <p className="status-msg">Bolo não encontrado</p>
  
  //Preço tratado como número, seja ele como string ("40,00") ou número (40)
  const precoNumero =typeof item.preco === "string"
  ? parseFloat(item.preco.replace(",", "."))
  : item.preco;

  const handleAdicionar = () => { // Adiciona a quantidade selecionada ao carrinho
    for (let i = 0; i < qtd; i++) {
       adicionarAoCarrinho(item);
    }
    navigate("/carrinho");
  };

  if (loading) return <p className="status-msg">Carregando detalhes...</p>;
  if (!item) return <p className="status-msg">Bolo não encontrado</p>;

  return (
    <div className="detalhes-page">
      <div className="detalhes-container">
        
        {/* Botão Voltar */}
        <Link to="/bolosdepote" className="btn-voltar">
          <BiArrowBack /> Voltar para o menu
        </Link>

        <div className="detalhes-card">
          
          {/* Lado Esquerdo: Imagem com tratamento de moldura */}
          <div className="detalhes-img-wrapper">
            <img 
              src={item.img} 
              alt={item.nome} 
              className={item.img.includes("public") ? "img-recortada" : "img-padrao"} 
            />
          </div>

          {/* Lado Direito: Informações do Produto */}
          <div className="detalhes-info">
            <h1 className="produto-titulo">{item.nome}</h1>
            
            <div className="produto-preco-tag">
              <span className="moeda">R$</span>
              <span className="valor">{formatarPreco(item.preco)}</span>
            </div>

            <p className="produto-descricao">
              {item.descricao || "Delicioso bolo de pote preparado com ingredientes selecionados, camadas bem recheadas e muito carinho."}
            </p>

            {/* Destaques / Benefícios do Produto */}
            <div className="produto-features">
              <div className="feature-item">
                <FaLeaf /> <span>Ingredientes Frescos</span>
              </div>
              <div className="feature-item">
                <FaSnowflake /> <span>Manter Refrigerado</span>
              </div>
            </div>

            <hr className="divisor" />

            {/* Ações de Compra */}
            <div className="acoes-compra">
              <div className="qtd-selector">
                <button onClick={() => setQtd((p) => (p > 1 ? p - 1 : 1))}>
                  <BiMinus />
                </button>
                <span>{qtd}</span>
                <button onClick={() => setQtd((p) => p + 1)}>
                  <BiPlus />
                </button>
              </div>

              <button className="btn-add-carrinho" onClick={handleAdicionar}>
                <FaShoppingBag /> Adicionar ao carrinho
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BolodePoteId;