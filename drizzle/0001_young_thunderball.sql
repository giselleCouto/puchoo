CREATE TABLE `acessos_portaria` (
	`id` varchar(64) NOT NULL,
	`pessoaId` varchar(64),
	`tipoPessoa` enum('colaborador','visitante','terceiro') DEFAULT 'colaborador',
	`dispositivo` varchar(100),
	`metodoAcesso` enum('senha','cartao','facial','biometria') DEFAULT 'cartao',
	`direcao` enum('entrada','saida') NOT NULL,
	`localAcesso` varchar(100),
	`autorizado` boolean DEFAULT true,
	`dataHora` timestamp DEFAULT (now()),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `acessos_portaria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `afastamentos` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`tipo` enum('doenca','acidente','maternidade','paternidade','inss','outro') NOT NULL,
	`dataInicio` date NOT NULL,
	`dataFim` date,
	`previsaoRetorno` date,
	`cid` varchar(10),
	`atestadoUrl` text,
	`diasAbonados` int DEFAULT 0,
	`status` enum('ativo','prorrogado','encerrado') DEFAULT 'ativo',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `afastamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditoria` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`userName` varchar(255),
	`acao` enum('inclusao','alteracao','exclusao','consulta') NOT NULL,
	`modulo` varchar(100) NOT NULL,
	`descricao` text,
	`dadosAnteriores` json,
	`dadosNovos` json,
	`ip` varchar(45),
	`userAgent` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `auditoria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `avaliacoes` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`avaliadorId` varchar(64) NOT NULL,
	`ciclo` varchar(20) NOT NULL,
	`tipo` enum('90','180','270','360') DEFAULT '90',
	`competencias` json,
	`notaFinal` decimal(4,2),
	`comentarios` text,
	`status` enum('pendente','em_andamento','concluida','calibrada') DEFAULT 'pendente',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `avaliacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `banco_horas` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`competencia` varchar(7) NOT NULL,
	`saldoAnterior` decimal(8,2) DEFAULT '0',
	`creditoHoras` decimal(8,2) DEFAULT '0',
	`debitoHoras` decimal(8,2) DEFAULT '0',
	`saldoAtual` decimal(8,2) DEFAULT '0',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `banco_horas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `beneficios` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`tipo` enum('vt','va','vr','plano_saude','plano_odonto','auxilio_creche','seguro_vida','consignado','outro') NOT NULL,
	`descricao` varchar(200),
	`valorEmpresa` decimal(12,2) DEFAULT '0',
	`valorColaborador` decimal(12,2) DEFAULT '0',
	`faixaDesconto` decimal(5,2),
	`dataInicio` date,
	`dataFim` date,
	`status` enum('ativo','suspenso','cancelado') DEFAULT 'ativo',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `beneficios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `candidatos` (
	`id` varchar(64) NOT NULL,
	`vagaId` varchar(64) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`email` varchar(320),
	`telefone` varchar(20),
	`cpf` varchar(14),
	`curriculoUrl` text,
	`pontuacaoIA` decimal(5,2),
	`etapaAtual` enum('inscrito','triagem','entrevista','teste','aprovado','reprovado','contratado') DEFAULT 'inscrito',
	`observacoes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `candidatos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chamados` (
	`id` varchar(64) NOT NULL,
	`solicitanteId` varchar(64) NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`tipo` enum('duvida','erro','melhoria','incidente') DEFAULT 'duvida',
	`criticidade` enum('urgencia','alta','normal','baixa') DEFAULT 'normal',
	`status` enum('aberto','em_atendimento','aguardando_cliente','resolvido','fechado') DEFAULT 'aberto',
	`dataAbertura` timestamp DEFAULT (now()),
	`dataRetorno` timestamp,
	`dataSolucaoPaliativa` timestamp,
	`dataSolucaoDefinitiva` timestamp,
	`atribuidoA` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `chamados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `colaboradores` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64),
	`nome` varchar(255) NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`rg` varchar(20),
	`ctps` varchar(20),
	`pis` varchar(14),
	`dataNascimento` date,
	`dataAdmissao` date NOT NULL,
	`dataDemissao` date,
	`cargo` varchar(100),
	`departamento` varchar(100),
	`lotacao` varchar(100),
	`centroCusto` varchar(50),
	`sindicato` varchar(200),
	`salarioBase` decimal(12,2),
	`tipoContrato` enum('clt','temporario','estagiario','terceirizado','requisitado') DEFAULT 'clt',
	`regimeTrabalho` enum('presencial','remoto','hibrido') DEFAULT 'presencial',
	`jornadaSemanal` int DEFAULT 44,
	`bancoNome` varchar(100),
	`bancoAgencia` varchar(10),
	`bancoConta` varchar(20),
	`status` enum('ativo','afastado','ferias','demitido','experiencia') DEFAULT 'ativo',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `colaboradores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comunicados` (
	`id` varchar(64) NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`conteudo` text NOT NULL,
	`tipo` enum('aviso','comunicado','endomarketing','treinamento') DEFAULT 'aviso',
	`publicadoPor` varchar(64),
	`dataPublicacao` timestamp DEFAULT (now()),
	`dataExpiracao` timestamp,
	`ativo` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `comunicados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dependentes` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cpf` varchar(14),
	`parentesco` varchar(50),
	`dataNascimento` date,
	`irrf` boolean DEFAULT false,
	`salarioFamilia` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `dependentes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documentos_colaborador` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`tipo` varchar(100) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`arquivoUrl` text,
	`dataEmissao` date,
	`dataValidade` date,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `documentos_colaborador_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emprestimos_consignados` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`fornecedor` varchar(200),
	`valorTotal` decimal(12,2) NOT NULL,
	`parcelas` int NOT NULL,
	`valorParcela` decimal(12,2) NOT NULL,
	`parcelasRestantes` int,
	`taxaJuros` decimal(5,2),
	`dataInicio` date,
	`status` enum('ativo','quitado','cancelado') DEFAULT 'ativo',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `emprestimos_consignados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `esocial_eventos` (
	`id` varchar(64) NOT NULL,
	`tipo` varchar(10) NOT NULL,
	`descricao` text,
	`colaboradorId` varchar(64),
	`xmlConteudo` text,
	`protocolo` varchar(50),
	`status` enum('pendente','validado','enviado','processado','rejeitado','retificado') DEFAULT 'pendente',
	`inconsistencias` json,
	`dataEnvio` timestamp,
	`dataRetorno` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `esocial_eventos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedbacks` (
	`id` varchar(64) NOT NULL,
	`deUserId` varchar(64) NOT NULL,
	`paraUserId` varchar(64) NOT NULL,
	`tipo` enum('elogio','construtivo','reconhecimento') DEFAULT 'construtivo',
	`mensagem` text NOT NULL,
	`publico` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `feedbacks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feriados` (
	`id` varchar(64) NOT NULL,
	`data` date NOT NULL,
	`descricao` varchar(200) NOT NULL,
	`tipo` enum('municipal','estadual','federal') DEFAULT 'federal',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `feriados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ferias` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`periodoAquisitivo` varchar(21),
	`dataInicio` date NOT NULL,
	`dataFim` date NOT NULL,
	`dias` int NOT NULL,
	`abonoPecuniario` boolean DEFAULT false,
	`valorFerias` decimal(12,2),
	`tercoConstitucional` decimal(12,2),
	`status` enum('solicitada','aprovada','rejeitada','gozando','concluida') DEFAULT 'solicitada',
	`aprovadoPor` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `ferias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `folha_pagamento` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`competencia` varchar(7) NOT NULL,
	`tipo` enum('mensal','ferias','13_primeira','13_segunda','rescisao','adiantamento') DEFAULT 'mensal',
	`salarioBruto` decimal(12,2),
	`horasExtras` decimal(12,2) DEFAULT '0',
	`adicionalNoturno` decimal(12,2) DEFAULT '0',
	`inss` decimal(12,2) DEFAULT '0',
	`irrf` decimal(12,2) DEFAULT '0',
	`fgts` decimal(12,2) DEFAULT '0',
	`outrosDescontos` decimal(12,2) DEFAULT '0',
	`outrosProventos` decimal(12,2) DEFAULT '0',
	`salarioLiquido` decimal(12,2),
	`status` enum('aberta','processada','fechada','estornada') DEFAULT 'aberta',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `folha_pagamento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grupos_usuarios` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(100) NOT NULL,
	`perfilId` varchar(64),
	`descricao` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `grupos_usuarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `integracao_pagamentos` (
	`id` varchar(64) NOT NULL,
	`banco` varchar(100) NOT NULL,
	`tipo` enum('pix','ted','cnab','boleto') NOT NULL,
	`valorTotal` decimal(14,2) NOT NULL,
	`quantidadePagamentos` int DEFAULT 0,
	`referencia` varchar(100),
	`status` enum('pendente','processando','concluido','erro') DEFAULT 'pendente',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `integracao_pagamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lgpd_consentimentos` (
	`id` varchar(64) NOT NULL,
	`titularId` varchar(64) NOT NULL,
	`titularNome` varchar(255),
	`titularCpf` varchar(14),
	`finalidade` varchar(200) NOT NULL,
	`baseJuridica` varchar(200),
	`dataConsentimento` timestamp DEFAULT (now()),
	`dataRevogacao` timestamp,
	`status` enum('ativo','revogado','expirado') DEFAULT 'ativo',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `lgpd_consentimentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lgpd_solicitacoes` (
	`id` varchar(64) NOT NULL,
	`titularId` varchar(64) NOT NULL,
	`titularNome` varchar(255),
	`tipo` enum('acesso','correcao','exclusao','portabilidade','anonimizacao') NOT NULL,
	`descricao` text,
	`status` enum('pendente','em_analise','atendida','negada') DEFAULT 'pendente',
	`prazoResposta` date,
	`resposta` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `lgpd_solicitacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metas_okr` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`ciclo` varchar(20) NOT NULL,
	`objetivo` text NOT NULL,
	`resultadoChave` text,
	`metaValor` decimal(8,2),
	`realizado` decimal(8,2) DEFAULT '0',
	`percentual` decimal(5,2) DEFAULT '0',
	`peso` decimal(5,2) DEFAULT '1',
	`status` enum('nao_iniciada','em_andamento','concluida','cancelada') DEFAULT 'nao_iniciada',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `metas_okr_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pdi` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`competencia` varchar(200),
	`acaoDesenvolvimento` text,
	`prazo` date,
	`responsavel` varchar(200),
	`status` enum('pendente','em_andamento','concluido') DEFAULT 'pendente',
	`observacoes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `pdi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `perfis` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(100) NOT NULL,
	`descricao` text,
	`permissoes` json,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `perfis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pesquisa_clima` (
	`id` varchar(64) NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`perguntas` json,
	`dataInicio` date,
	`dataFim` date,
	`status` enum('rascunho','ativa','encerrada') DEFAULT 'rascunho',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `pesquisa_clima_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ponto_escalas` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(100) NOT NULL,
	`tipo` enum('fixa','revezamento','flexivel','12x36') DEFAULT 'fixa',
	`horaEntrada` varchar(5),
	`horaSaida` varchar(5),
	`intervaloInicio` varchar(5),
	`intervaloFim` varchar(5),
	`toleranciaMinutos` int DEFAULT 10,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `ponto_escalas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ponto_registros` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`dataRegistro` date NOT NULL,
	`horaRegistro` varchar(5) NOT NULL,
	`tipo` enum('entrada','saida','intervalo_inicio','intervalo_fim') NOT NULL,
	`metodo` enum('biometria','facial','geolocalizacao','manual','terminal') DEFAULT 'manual',
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`fotoUrl` text,
	`dispositivo` varchar(100),
	`validado` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `ponto_registros_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prontuario_medico` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`dataConsulta` date NOT NULL,
	`tipo` varchar(100),
	`anamnese` text,
	`diagnostico` text,
	`cid` varchar(10),
	`conduta` text,
	`medicoResponsavel` varchar(200),
	`crm` varchar(20),
	`restricoes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `prontuario_medico_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quadro_vagas` (
	`id` varchar(64) NOT NULL,
	`cargo` varchar(200) NOT NULL,
	`departamento` varchar(200),
	`centroCusto` varchar(50),
	`vagasEfetivas` int DEFAULT 0,
	`vagasPrevistas` int DEFAULT 0,
	`vagasOcupadas` int DEFAULT 0,
	`orcamento` decimal(12,2),
	`status` enum('ativo','congelado','encerrado') DEFAULT 'ativo',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `quadro_vagas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rescisao` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`dataDemissao` date NOT NULL,
	`tipoDesligamento` varchar(100),
	`codigoDesligamento` varchar(10),
	`avisoPrevio` boolean DEFAULT false,
	`dataAvisoPrevio` date,
	`saldoSalario` decimal(12,2),
	`feriasProporcionais` decimal(12,2),
	`decimoTerceiro` decimal(12,2),
	`multaFgts` decimal(12,2),
	`totalBruto` decimal(12,2),
	`totalDescontos` decimal(12,2),
	`totalLiquido` decimal(12,2),
	`status` enum('pendente','calculada','homologada') DEFAULT 'pendente',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `rescisao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sst_aso` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`exameId` varchar(64),
	`tipo` enum('admissional','periodico','demissional','retorno','mudanca_funcao') NOT NULL,
	`dataEmissao` date NOT NULL,
	`resultado` enum('apto','inapto','apto_restricao') NOT NULL,
	`restricoes` text,
	`medicoResponsavel` varchar(200),
	`crm` varchar(20),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sst_aso_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sst_cat` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`dataAcidente` date NOT NULL,
	`horaAcidente` varchar(5),
	`localAcidente` varchar(200),
	`descricao` text,
	`tipoAcidente` enum('tipico','trajeto','doenca_ocupacional') DEFAULT 'tipico',
	`parteCorpo` varchar(100),
	`gravidade` enum('leve','moderado','grave','fatal') DEFAULT 'leve',
	`diasAfastamento` int DEFAULT 0,
	`protocoloInss` varchar(50),
	`status` enum('aberta','enviada','processada') DEFAULT 'aberta',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sst_cat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sst_cipa` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`funcao` enum('presidente','vice_presidente','secretario','membro_titular','membro_suplente') NOT NULL,
	`mandatoInicio` date NOT NULL,
	`mandatoFim` date NOT NULL,
	`status` enum('ativo','encerrado') DEFAULT 'ativo',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sst_cipa_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sst_epis` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`equipamento` varchar(200) NOT NULL,
	`ca` varchar(20),
	`dataEntrega` date NOT NULL,
	`dataDevolucao` date,
	`dataValidade` date,
	`quantidade` int DEFAULT 1,
	`reciboAssinado` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sst_epis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sst_exames` (
	`id` varchar(64) NOT NULL,
	`colaboradorId` varchar(64) NOT NULL,
	`tipo` enum('admissional','periodico','demissional','retorno','mudanca_funcao') NOT NULL,
	`descricao` varchar(200),
	`dataExame` date NOT NULL,
	`dataValidade` date,
	`resultado` enum('apto','inapto','apto_restricao','pendente') DEFAULT 'pendente',
	`medicoResponsavel` varchar(200),
	`crm` varchar(20),
	`observacoes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sst_exames_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `treinamentos` (
	`id` varchar(64) NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`instrutor` varchar(200),
	`cargaHoraria` int,
	`dataInicio` date,
	`dataFim` date,
	`vagas` int,
	`inscritos` int DEFAULT 0,
	`tipo` enum('presencial','online','hibrido') DEFAULT 'presencial',
	`status` enum('agendado','em_andamento','concluido','cancelado') DEFAULT 'agendado',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `treinamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vagas_recrutamento` (
	`id` varchar(64) NOT NULL,
	`quadroVagaId` varchar(64),
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`requisitos` text,
	`departamento` varchar(200),
	`salarioMin` decimal(12,2),
	`salarioMax` decimal(12,2),
	`tipoContrato` varchar(50),
	`dataAbertura` date,
	`dataEncerramento` date,
	`status` enum('rascunho','aberta','em_selecao','encerrada','cancelada') DEFAULT 'rascunho',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `vagas_recrutamento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitantes` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`documento` varchar(20) NOT NULL,
	`tipoDocumento` enum('rg','cpf','cnh','passaporte') DEFAULT 'rg',
	`empresa` varchar(200),
	`telefone` varchar(20),
	`fotoUrl` text,
	`motivoVisita` text,
	`pessoaVisitada` varchar(200),
	`dataEntrada` timestamp,
	`dataSaida` timestamp,
	`cracha` varchar(20),
	`status` enum('agendado','presente','saiu') DEFAULT 'agendado',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `visitantes_id` PRIMARY KEY(`id`)
);
