import { useEffect, useState } from "react";
import axios from "axios";
import { bolos } from "../data/dadosBusca";

const API_URL = "http://localhost:7006";

export const useProdutos = () => {
    const [produtos, setProdutos] = useState(bolos);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    axios.get(`${API_URL}/dashboard`)
      .then((res) => {
        const produtosDoBanco = res.data.map((p) => ({
          id: `db-${p.id_bolo}`,
          nome: p.nome,
          preco: p.preco,
          img: `${API_URL}/uploads/${p.img}`,
          descricao: p.descricao,
        }));
        setProdutos([...bolos, ...produtosDoBanco]);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos do banco:", error);
    })
    .finally(() => setLoading(false));
  }, []);

  return { produtos, loading };
}

