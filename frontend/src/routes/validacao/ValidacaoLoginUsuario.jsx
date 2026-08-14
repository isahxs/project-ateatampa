
const ValidacaoLoginUsuario = ({ email, senha }) => {

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
        return "O e-mail é obrigatório";
    }

    if (!emailValido.test(email)) {
        return "E-mail inválido!";
    }

    if (!senha.trim()) {
        return "A senha é obrigatória!";
    }

    if (senha.length < 6) {
        return "Senha inválida";
    }

    return null; 
};

export default ValidacaoLoginUsuario;
