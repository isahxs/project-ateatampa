

const ValidacaoCadastroAdm = ({ username, email, senha, confirmarSenha }) => {

    if (!username.trim()) {
        return 'O nome de usuário é obrigatório';
    }

    if (!email.trim()) {
        return 'O e-mail é obrigatório';
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
        return 'Digite um e-mail válido';
    }
    
    if (!senha.trim()) {
        return "A senha é obrigatória";
    }

    if (senha.length < 6) {
        return "A senha deve ter no mínimo 6 caracteres!";
    }

    if (senha !== confirmarSenha) {
        return 'As senhas não coincidem. Tente novamente';
    }

    return null;
};

export default ValidacaoCadastroAdm;
