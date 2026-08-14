import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useProdutos } from '../../hooks/useProdutos';
import { formatarPreco } from "../../formatnumbers/utils";
import "./BolosdePote.css";

function BolosdePote() {
  const navigate = useNavigate();
  const { produtos, loading } = useProdutos();

  if(loading) {
    return <div className='loading'>Carregando bolos...</div>
  }

  return (
    <main className="main-container">
 
      <div className="titulo-area">
        <h2>Nosso menu de bolos </h2>
        <p>Aproveite nossa variedade de sabores.</p>
      </div>
 
     <div className="itens-area">
       {produtos.map((item) => (
        <div className="card-bolo" key={item.id} onClick={() => navigate(`/bolos/${item.id}`)}>
              <div className="item--img">
                <img src={item.img} alt={item.nome} />
              </div>
              <Link to={`/bolos/${item.id}`}
                className="btn-comprar"
                >
                Comprar
              </Link>
 
              <div className="item--price">R$ {formatarPreco(item.preco)}</div>
              <div className="item--name">{item.nome}</div>
              
              <Link to={`/bolos/${item.id}`}
                style={{ textDecoration: 'none'}}
                >
                <div className="details">Clique aqui para ver mais detalhes</div>
              </Link>  
        </div>
        ))}
      </div>
 
    </main>
  );
}
 
export default BolosdePote;