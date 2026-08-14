
export const formatarPreco = (valor) => {
  const numero = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : valor;
  if (isNaN(numero)) return valor;
  return numero.toFixed(2).replace(".", ",");
};