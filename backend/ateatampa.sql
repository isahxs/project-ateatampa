CREATE TABLE dashboard(
    id_bolo INT  AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    img VARCHAR(255),
    id_adm INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_adm) REFERENCES cadastroadm(id)
);

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Aguardando confirmação',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES cadastrousuario(id)
);

CREATE TABLE itens_pedido (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    nome_bolo VARCHAR(100) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
    img VARCHAR(255);
    id_bolo VARCHAR(50);
);
 
CREATE TABLE cadastroadm (
    id INT  AUTO_INCREMENT PRIMARY KEY,
    nomeadm VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE FOREIGN KEY,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);
 
CREATE TABLE cadastrousuario (
    id INT  AUTO_INCREMENT PRIMARY KEY,
    nomeusuario VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE FOREIGN KEY,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    atualizado_em TIMESTAMP DEFAULT ON UPDATE CURRENT_TIMESTAMP()
);
