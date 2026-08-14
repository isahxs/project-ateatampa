import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  // Adicionar produto ou incrementar
  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prevCarrinho) => {
      const itemExistente = prevCarrinho.find((item) => item.id === produto.id);

      if (itemExistente) {
        return prevCarrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...prevCarrinho, { ...produto, quantidade: 1 }];
    });
  };

  // Alterar quantidade
  const atualizarQuantidade = (id, delta) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.map((item) => {
        if (item.id === id) {
          const novaQuantidade = item.quantidade + delta;
          return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : item;
          }
          return item;
        })
    );
  };

  // Remover item
  const removerDoCarrinho = (id) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((item) => item.id !== id));
  };

  //Limpar carrinho de uma vez
  const limparCarrinho = () => {
    setCarrinho([]);
  };

  //Total de itens, somando as quantidades no carrinho
  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        atualizarQuantidade,
        removerDoCarrinho,
        limparCarrinho,
        totalItens,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);