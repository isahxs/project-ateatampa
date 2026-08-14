import React from "react";
import { NavLink } from "react-router-dom";
import "./Home.css"
 
import FotoGrid1 from "../../assets/Festa-Amigos1.png";
import FotoGrid2 from "../../assets/Festa-Amigos2.png";
import FotoGrid3 from "../../assets/Festa-Amigos3.png";
import FotoGrid4 from "../../assets/Festa-Amigos4.png";
 
const Home = () => {
return(
 <>
    <section className="hero">
      <div className="grid-images esquerda">
        <img src={FotoGrid1} alt="foto1" />
        <img src={FotoGrid2} alt="foto2" />
      </div>
 
      <div className="info">
        <h1>Conheça nossos sabores</h1>
        <p>
          Você pode fazer a sua encomenda no nosso site e adicionar no carrinho para finalizar o seu pedido.
        </p>
 
       
        <NavLink to="/BolosdePote">
        <button>CLIQUE E ENCOMENDE</button>
        </NavLink>  
 
 
        <p className="whatsapp">
          Em caso de dúvida, fale com a gente pelo WhatsApp!
        </p>
      </div>
 
      <div className="grid-images direita">
        <img src={FotoGrid3} alt="foto3" />
        <img src={FotoGrid4} alt="foto4" />
      </div>
    </section>
 
  <section className="instagram">
    <h2>Instagram</h2>
    <span>@ate_a_tampa</span>

    <div className="insta-grid">
      {[
        "pote-prestigio.png",
        "pote-maracuja.png",
        "pote-limao.png",
        "pote-brigadeiro.png",
        "pote-morango.png",
        "bolofesta-maracuja.png",
        "bolofesta-morango.png",
        "bolofesta-brigadeiro.png",
      ].map((img, index) => (

      <NavLink 
        key={index} 
        to="/bolosdepote" 
        className="insta-item"
        >
        <img src={`/img/${img}`} alt={`Foto Instagram ${index + 1}`} />

      </NavLink>
     ))}
    </div>

  </section>
  </>
  );
};
 
export default Home;
 