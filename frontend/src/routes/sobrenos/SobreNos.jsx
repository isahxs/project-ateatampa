import React from 'react';

import "./SobreNos.css"

import BoloSobreNos from '../../assets/BoloSobreNos.jpg';

const SobreNos = () => {
  return (
    <div>
      <section className="sobre-section" id="sobre">
        <div className="sobre-container">
            <h1>Conheça nossa história</h1>

            <main className="sobre-content">
                <section className="sobre-text">
                    <p>
                        Meu nome é Gabriella e a minha história, assim como a do Até a Tampa, nasceu em um dos momentos mais desafiadores da minha vida. Durante a minha gestação de gêmeos, um erro médico tirou de nós um dos nossos bebês.
                        O nosso pequeno guerreiro que permaneceu conosco veio ao mundo com microcefalia, hidrocefalia e paralisia cerebral — e, desde então, nossa jornada se tornou um caminho de superação, fé e amor incondicional.
                    </p>
                </section>

                <section className="sobre-text">
                    <p>
                        Em meio a tantas mudanças e emoções intensas, meu marido me incentivou a encontrar algo que me trouxesse leveza, propósito e também ajudasse na renda da nossa família.
                        Foi assim que surgiu a ideia dos bolos de pote.
                        Eu escolhi não transformar nossa história na minha história, e sim na nossa.
                    </p>
                </section>

                <section className="sobre-text">
                    <p>
                        O Até a Tampa foi criado com afeto desde o primeiro dia.
                        Cada receita carrega cuidado, dedicação e o desejo de entregar mais do que um doce: conforto, alegria e amor em cada detalhe.
                        Meu compromisso é que, ao provar nossos bolos, você sinta exatamente isso.
                    </p>
                </section>

                <section className="sobre-image">
                    <img src={BoloSobreNos} alt="bolo de pote" />
                </section>

            </main>

        </div>
      </section>
    </div>
  )
}

export default SobreNos