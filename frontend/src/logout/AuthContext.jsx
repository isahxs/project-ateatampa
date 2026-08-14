import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:7006";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [logado, setLogado ] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [carregando, setCarregando] = useState(true);

    const verificarAuth = () => {
        axios.get(`${API_URL}/auth`, { withCredentials: true })
        .then((res) => {
            if (res.data.valid && res.data.tipo === "usuario") {
                setLogado(true);
                setNomeUsuario(res.data.name);
            } else {
                setLogado(false);
                setNomeUsuario("");
            }  
        }) 
        .catch(() => setLogado(false))
        .finally(() => setCarregando(false));
    }

    useEffect(() => {
        verificarAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ logado, nomeUsuario, setLogado, setNomeUsuario, verificarAuth }}>
            {children}
        </AuthContext.Provider>
    );

};


export const useAuth = () => useContext(AuthContext);