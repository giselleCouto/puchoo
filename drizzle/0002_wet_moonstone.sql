CREATE TABLE `mensagens_contato` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telefone` varchar(30),
	`assunto` varchar(300) NOT NULL,
	`mensagem` text NOT NULL,
	`lida` boolean DEFAULT false,
	`respondida` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `mensagens_contato_id` PRIMARY KEY(`id`)
);
