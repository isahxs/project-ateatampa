import { useNavigate } from "react-router-dom";
import express from "express";
import cors from "cors";
import mysql from "mysql";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./db.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

//config cors
const app = express();
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:5173'],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true
}));

//config session
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 *60 * 24
    } //tempo de cookie
}));

//proteção para quando tiver um erro não derrubar o servidor inteiro (mesmo que exista um bug)
process.on("uncaughtException", (err) => {
  console.error("Erro não tratado (servidor continua rodando):", err);
});

//middleware de autenticação
const verificarLogin = (req, res, next) => {
    if (req.session.username) {
    next();
    } else {
        return res.status(401).json({ error: "Usuário não autenticado"});
    }
}

//Cadastro de produtos no banco e configuração do multer para upload de imagens
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, "uploads");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname);
        const nomeArquivo = Date.now() + '-' + Math.round(Math.random() * 1E9) + extensao;
        cb(null, nomeArquivo);
    }
});

const upload = multer({ storage });

// Servir as imagens estaticamente
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Cadastro de produtos no banco
app.post("/dashboard", verificarLogin, upload.single("imagem"), (req, res) => {
    try {
        const { nomebolo, preco, descricao } = req.body;
 
        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma imagem foi selecionada." });
        }
 
        const nomeImage = req.file.filename; 
   
        const sql = 'INSERT INTO dashboard (nome, preco, descricao, img) VALUES(?, ?, ?, ?)';
 
        db.query(sql, [nomebolo, preco, descricao, nomeImage], (err, result) => {
            if (err) {
                console.error("Erro no MySQL:", err);
                return res.status(500).json({ error: "Erro ao salvar no banco de dados." });
            }
 
            return res.json({
                status: "sucesso",
                message: "Produto cadastrado com sucesso",
                imagem: nomeImage
            });
        });
    } catch (error) {
        console.error("Erro interno:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
});

//Listar produtos
app.get("/dashboard", (req, res) => {
    const sql = "SELECT * FROM dashboard";
    db.query(sql, (err, data) => { 
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar os produtos" });
        }

        return res.json(data);
    });
});

//Post de meus pedidos do carrinho
app.post("/pedidos", verificarLogin, (req, res) => {
    try {
        const { itens, total } = req.body; // itens: [{ nome, preco, quantidade }]
        const idUsuario = req.session.userId;

        if (!itens || itens.length === 0) {
            return res.status(400).json({ error: "Carrinho vazio" });
        }

        const sqlPedido = "INSERT INTO pedidos (id_usuario, total) VALUES (?, ?)";

        db.query(sqlPedido, [idUsuario, total], (err, result) => {
            if (err) {
                console.error("Erro ao criar pedido:", err);
                return res.status(500).json({ error: "Erro ao salvar pedido" });
            }

            const idPedido = result.insertId;

            const sqlItens = "INSERT INTO itens_pedido (id_pedido, nome_bolo, preco_unitario, quantidade, img, id_bolo) VALUES ?";
            const valores = itens.map((item) => [idPedido, item.nome, item.preco, item.quantidade, item.img, item.id]);

            db.query(sqlItens, [valores], (err2) => {
                if (err2) {
                    console.error("Erro ao salvar itens do pedido:", err2);
                    return res.status(500).json({ error: "Pedido criado, mas erro ao salvar itens" });
                }

                return res.json({ status: "sucesso", id_pedido: idPedido });
            });
        });
    } catch (error) {
        console.error("Erro interno:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
});

//Get dos pedido do carrinho
app.get("/meuspedidos", verificarLogin, (req, res) => {
    const idUsuario = req.session.userId;

    const sqlPedidos = "SELECT * FROM pedidos WHERE id_usuario = ? ORDER BY criado_em DESC";

    db.query(sqlPedidos, [idUsuario], (err, pedidos) => {
        if (err) {
            console.error("Erro ao buscar pedidos:", err);
            return res.status(500).json({ error: "Erro ao buscar pedidos" });
        }

        if (pedidos.length === 0) {
            return res.json([]);
        }

        const idsPedidos = pedidos.map((p) => p.id_pedido);
        const sqlItens = "SELECT * FROM itens_pedido WHERE id_pedido IN (?)";

        db.query(sqlItens, [idsPedidos], (err2, itens) => {
            if (err2) {
                console.error("Erro ao buscar itens:", err2);
                return res.status(500).json({ error: "Erro ao buscar itens dos pedidos" });
            }

            const pedidosComItens = pedidos.map((pedido) => ({
                ...pedido,
                itens: itens.filter((item) => item.id_pedido === pedido.id_pedido),
            }));

            return res.json(pedidosComItens);
        });
    });
});

//create de usuário no banco
app.post("/cadastrousuario", async (req, res) => {
    try {

        const nomeusuario = req.body.nomeusuario.trim();
        const email = req.body.email.toLowerCase().trim();
        const senha = req.body.senha.trim();

        const hash = await bcrypt.hash(senha, 10);

        const sql = `INSERT INTO cadastrousuario(nomeusuario, email, senha) VALUES (?, ?, ?)`;

        db.query(
            sql,
            [nomeusuario, email, hash],
            (err, data) => {

                if(err){
                    console.log(err);
                    return res.status(500).json({
                        error: "Erro ao cadastrar usuário"
                    });
                }

                return res.json({
                    message: "Usuário cadastrado com sucesso"
                });
            }
        );

    } catch {
        return res.status(500).json({
            error: "Erro interno"
        });
    }
});

//create de adm no banco
app.post("/cadastroadm", async (req, res) => {
    try {

        const nomeadm = req.body.nomeadm.trim();
        const email = req.body.email.toLowerCase().trim();
        const senha = req.body.senha.trim();

        const hash = await bcrypt.hash(senha, 10);

        const sql = `INSERT INTO cadastroadm(nomeadm, email, senha) VALUES (?, ?, ?)`;

        db.query(
            sql,
            [nomeadm, email, hash],
            (err, data) => {

                if(err){
                    return res.status(500).json({
                        error: "Erro ao cadastrar administrador"
                    });
                }

                return res.json({
                    message: "Administrador cadastrado com sucesso"
                });
            }
        );

    } catch {
        return res.status(500).json({
            error: "Erro interno"
        });
    }
});

// Login - via POST de usuário
app.post("/loginusuario", (req, res) => {

    const email = req.body.email.toLowerCase().trim();
    const senha = req.body.senha.trim();

    const sql = `SELECT * FROM cadastrousuario WHERE email = ?`;

    db.query(sql, [email], async (err, data) => {

        if(err){
            return res.status(500).json({
                error: "Erro no login"
            });
        }

        if(data.length === 0){
            return res.status(401).json({
                error: "Email ou senha inválidos"
            });
        }

        const match = await bcrypt.compare(senha, data[0].senha);

        if(!match){
            return res.status(401).json({error: "Email ou senha inválidos"});
        }

        req.session.username = data[0].nomeusuario;
        req.session.userId = data[0].id;
        req.session.tipo = "usuario";

        return res.json({
            message: "Login realizado com sucesso",
            name: data[0].nomeusuario
        });
    });
});

// Login - via POST de adm
app.post("/loginadm", (req, res) => {

    const email = req.body.email.toLowerCase().trim();
    const senha = req.body.senha.trim();

    const sql = `SELECT * FROM cadastroadm WHERE email = ?`;

    db.query(sql, [email], async (err, data) => {

        if(err){
            return res.status(500).json({
                error: "Erro no login"
            });
        }

        if(data.length === 0){
            return res.status(401).json({
                error: "Email ou senha inválidos"
            });
        }

        const match = await bcrypt.compare(
            senha,
            data[0].senha
        );

        if(!match){
            return res.status(401).json({
                error: "Email ou senha inválidos"
            });
        }

        req.session.username = data[0].nomeadm;
        req.session.tipo = "admin";

        return res.json({
            message: "Login realizado com sucesso",
            name: data[0].nomeadm
        });
    });
});

//rota de logout
app.post("/logout", (req, res)=> {
    req.session.destroy((err)=> {
    if (err) {
            return res.status(500).json({ error: "Erro ao encerrar sessão"});
        }
        res.clearCookie("connect.sid"); 
        return res.json({ message: "Logout realizado com sucesso" });
    });
});

//verificar o login
app.get("/auth", (req, res) => {
    if (req.session.username){
        return res.json({
            valid: true,
            name: req.session.username,
            tipo: req.session.tipo
        });
    } else {
        return res.json({
            valid: false
        })
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
})