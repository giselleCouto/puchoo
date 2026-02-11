import {
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  int,
  decimal,
  boolean,
  date,
  json,
} from "drizzle-orm/mysql-core";

// =============================================
// CORE: Usuários e Perfis
// =============================================
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Perfis de acesso granulares (3.15.7, 3.15.8)
export const perfis = mysqlTable("perfis", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  permissoes: json("permissoes"), // JSON com permissões por módulo
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Grupos de usuários (3.15.9)
export const gruposUsuarios = mysqlTable("grupos_usuarios", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  perfilId: varchar("perfilId", { length: 64 }),
  descricao: text("descricao"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// TRILHA DE AUDITORIA (3.15.1, 3.15.2)
// =============================================
export const auditoria = mysqlTable("auditoria", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  userName: varchar("userName", { length: 255 }),
  acao: mysqlEnum("acao", ["inclusao", "alteracao", "exclusao", "consulta"]).notNull(),
  modulo: varchar("modulo", { length: 100 }).notNull(),
  descricao: text("descricao"),
  dadosAnteriores: json("dadosAnteriores"),
  dadosNovos: json("dadosNovos"),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.1 FOLHA DE PAGAMENTO
// =============================================
export const colaboradores = mysqlTable("colaboradores", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull(),
  rg: varchar("rg", { length: 20 }),
  ctps: varchar("ctps", { length: 20 }),
  pis: varchar("pis", { length: 14 }),
  dataNascimento: date("dataNascimento"),
  dataAdmissao: date("dataAdmissao").notNull(),
  dataDemissao: date("dataDemissao"),
  cargo: varchar("cargo", { length: 100 }),
  departamento: varchar("departamento", { length: 100 }),
  lotacao: varchar("lotacao", { length: 100 }),
  centroCusto: varchar("centroCusto", { length: 50 }),
  sindicato: varchar("sindicato", { length: 200 }),
  salarioBase: decimal("salarioBase", { precision: 12, scale: 2 }),
  tipoContrato: mysqlEnum("tipoContrato", ["clt", "temporario", "estagiario", "terceirizado", "requisitado"]).default("clt"),
  regimeTrabalho: mysqlEnum("regimeTrabalho", ["presencial", "remoto", "hibrido"]).default("presencial"),
  jornadaSemanal: int("jornadaSemanal").default(44),
  bancoNome: varchar("bancoNome", { length: 100 }),
  bancoAgencia: varchar("bancoAgencia", { length: 10 }),
  bancoConta: varchar("bancoConta", { length: 20 }),
  status: mysqlEnum("status", ["ativo", "afastado", "ferias", "demitido", "experiencia"]).default("ativo"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const dependentes = mysqlTable("dependentes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }),
  parentesco: varchar("parentesco", { length: 50 }),
  dataNascimento: date("dataNascimento"),
  irrf: boolean("irrf").default(false),
  salarioFamilia: boolean("salarioFamilia").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const folhaPagamento = mysqlTable("folha_pagamento", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  competencia: varchar("competencia", { length: 7 }).notNull(), // YYYY-MM
  tipo: mysqlEnum("tipo", ["mensal", "ferias", "13_primeira", "13_segunda", "rescisao", "adiantamento"]).default("mensal"),
  salarioBruto: decimal("salarioBruto", { precision: 12, scale: 2 }),
  horasExtras: decimal("horasExtras", { precision: 12, scale: 2 }).default("0"),
  adicionalNoturno: decimal("adicionalNoturno", { precision: 12, scale: 2 }).default("0"),
  inss: decimal("inss", { precision: 12, scale: 2 }).default("0"),
  irrf: decimal("irrf", { precision: 12, scale: 2 }).default("0"),
  fgts: decimal("fgts", { precision: 12, scale: 2 }).default("0"),
  outrosDescontos: decimal("outrosDescontos", { precision: 12, scale: 2 }).default("0"),
  outrosProventos: decimal("outrosProventos", { precision: 12, scale: 2 }).default("0"),
  salarioLiquido: decimal("salarioLiquido", { precision: 12, scale: 2 }),
  status: mysqlEnum("status", ["aberta", "processada", "fechada", "estornada"]).default("aberta"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const ferias = mysqlTable("ferias", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  periodoAquisitivo: varchar("periodoAquisitivo", { length: 21 }), // YYYY-MM-DD a YYYY-MM-DD
  dataInicio: date("dataInicio").notNull(),
  dataFim: date("dataFim").notNull(),
  dias: int("dias").notNull(),
  abonoPecuniario: boolean("abonoPecuniario").default(false),
  valorFerias: decimal("valorFerias", { precision: 12, scale: 2 }),
  tercoConstitucional: decimal("tercoConstitucional", { precision: 12, scale: 2 }),
  status: mysqlEnum("status", ["solicitada", "aprovada", "rejeitada", "gozando", "concluida"]).default("solicitada"),
  aprovadoPor: varchar("aprovadoPor", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const rescisao = mysqlTable("rescisao", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  dataDemissao: date("dataDemissao").notNull(),
  tipoDesligamento: varchar("tipoDesligamento", { length: 100 }),
  codigoDesligamento: varchar("codigoDesligamento", { length: 10 }),
  avisoPrevio: boolean("avisoPrevio").default(false),
  dataAvisoPrevio: date("dataAvisoPrevio"),
  saldoSalario: decimal("saldoSalario", { precision: 12, scale: 2 }),
  feriasProporcionais: decimal("feriasProporcionais", { precision: 12, scale: 2 }),
  decimoTerceiro: decimal("decimoTerceiro", { precision: 12, scale: 2 }),
  multaFgts: decimal("multaFgts", { precision: 12, scale: 2 }),
  totalBruto: decimal("totalBruto", { precision: 12, scale: 2 }),
  totalDescontos: decimal("totalDescontos", { precision: 12, scale: 2 }),
  totalLiquido: decimal("totalLiquido", { precision: 12, scale: 2 }),
  status: mysqlEnum("status", ["pendente", "calculada", "homologada"]).default("pendente"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.2 eSocial
// =============================================
export const esocialEventos = mysqlTable("esocial_eventos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tipo: varchar("tipo", { length: 10 }).notNull(), // S-1000, S-1200, etc.
  descricao: text("descricao"),
  colaboradorId: varchar("colaboradorId", { length: 64 }),
  xmlConteudo: text("xmlConteudo"),
  protocolo: varchar("protocolo", { length: 50 }),
  status: mysqlEnum("status", ["pendente", "validado", "enviado", "processado", "rejeitado", "retificado"]).default("pendente"),
  inconsistencias: json("inconsistencias"),
  dataEnvio: timestamp("dataEnvio"),
  dataRetorno: timestamp("dataRetorno"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.3 CONTROLE DE PONTO E PORTARIA 671
// =============================================
export const pontoRegistros = mysqlTable("ponto_registros", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  dataRegistro: date("dataRegistro").notNull(),
  horaRegistro: varchar("horaRegistro", { length: 5 }).notNull(), // HH:MM
  tipo: mysqlEnum("tipo", ["entrada", "saida", "intervalo_inicio", "intervalo_fim"]).notNull(),
  metodo: mysqlEnum("metodo", ["biometria", "facial", "geolocalizacao", "manual", "terminal"]).default("manual"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  fotoUrl: text("fotoUrl"),
  dispositivo: varchar("dispositivo", { length: 100 }),
  validado: boolean("validado").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const pontoEscalas = mysqlTable("ponto_escalas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  tipo: mysqlEnum("tipo", ["fixa", "revezamento", "flexivel", "12x36"]).default("fixa"),
  horaEntrada: varchar("horaEntrada", { length: 5 }),
  horaSaida: varchar("horaSaida", { length: 5 }),
  intervaloInicio: varchar("intervaloInicio", { length: 5 }),
  intervaloFim: varchar("intervaloFim", { length: 5 }),
  toleranciaMinutos: int("toleranciaMinutos").default(10),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const bancoHoras = mysqlTable("banco_horas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  competencia: varchar("competencia", { length: 7 }).notNull(),
  saldoAnterior: decimal("saldoAnterior", { precision: 8, scale: 2 }).default("0"),
  creditoHoras: decimal("creditoHoras", { precision: 8, scale: 2 }).default("0"),
  debitoHoras: decimal("debitoHoras", { precision: 8, scale: 2 }).default("0"),
  saldoAtual: decimal("saldoAtual", { precision: 8, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const feriados = mysqlTable("feriados", {
  id: varchar("id", { length: 64 }).primaryKey(),
  data: date("data").notNull(),
  descricao: varchar("descricao", { length: 200 }).notNull(),
  tipo: mysqlEnum("tipo", ["municipal", "estadual", "federal"]).default("federal"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.4 GESTÃO DE BENEFÍCIOS
// =============================================
export const beneficios = mysqlTable("beneficios", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  tipo: mysqlEnum("tipo", ["vt", "va", "vr", "plano_saude", "plano_odonto", "auxilio_creche", "seguro_vida", "consignado", "outro"]).notNull(),
  descricao: varchar("descricao", { length: 200 }),
  valorEmpresa: decimal("valorEmpresa", { precision: 12, scale: 2 }).default("0"),
  valorColaborador: decimal("valorColaborador", { precision: 12, scale: 2 }).default("0"),
  faixaDesconto: decimal("faixaDesconto", { precision: 5, scale: 2 }),
  dataInicio: date("dataInicio"),
  dataFim: date("dataFim"),
  status: mysqlEnum("status", ["ativo", "suspenso", "cancelado"]).default("ativo"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const emprestimosConsignados = mysqlTable("emprestimos_consignados", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  fornecedor: varchar("fornecedor", { length: 200 }),
  valorTotal: decimal("valorTotal", { precision: 12, scale: 2 }).notNull(),
  parcelas: int("parcelas").notNull(),
  valorParcela: decimal("valorParcela", { precision: 12, scale: 2 }).notNull(),
  parcelasRestantes: int("parcelasRestantes"),
  taxaJuros: decimal("taxaJuros", { precision: 5, scale: 2 }),
  dataInicio: date("dataInicio"),
  status: mysqlEnum("status", ["ativo", "quitado", "cancelado"]).default("ativo"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.5 SEGURANÇA DO TRABALHO (SST/SESMT)
// =============================================
export const sstExames = mysqlTable("sst_exames", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  tipo: mysqlEnum("tipo", ["admissional", "periodico", "demissional", "retorno", "mudanca_funcao"]).notNull(),
  descricao: varchar("descricao", { length: 200 }),
  dataExame: date("dataExame").notNull(),
  dataValidade: date("dataValidade"),
  resultado: mysqlEnum("resultado", ["apto", "inapto", "apto_restricao", "pendente"]).default("pendente"),
  medicoResponsavel: varchar("medicoResponsavel", { length: 200 }),
  crm: varchar("crm", { length: 20 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const sstAso = mysqlTable("sst_aso", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  exameId: varchar("exameId", { length: 64 }),
  tipo: mysqlEnum("tipo", ["admissional", "periodico", "demissional", "retorno", "mudanca_funcao"]).notNull(),
  dataEmissao: date("dataEmissao").notNull(),
  resultado: mysqlEnum("resultado", ["apto", "inapto", "apto_restricao"]).notNull(),
  restricoes: text("restricoes"),
  medicoResponsavel: varchar("medicoResponsavel", { length: 200 }),
  crm: varchar("crm", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const sstCat = mysqlTable("sst_cat", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  dataAcidente: date("dataAcidente").notNull(),
  horaAcidente: varchar("horaAcidente", { length: 5 }),
  localAcidente: varchar("localAcidente", { length: 200 }),
  descricao: text("descricao"),
  tipoAcidente: mysqlEnum("tipoAcidente", ["tipico", "trajeto", "doenca_ocupacional"]).default("tipico"),
  parteCorpo: varchar("parteCorpo", { length: 100 }),
  gravidade: mysqlEnum("gravidade", ["leve", "moderado", "grave", "fatal"]).default("leve"),
  diasAfastamento: int("diasAfastamento").default(0),
  protocoloInss: varchar("protocoloInss", { length: 50 }),
  status: mysqlEnum("status", ["aberta", "enviada", "processada"]).default("aberta"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const sstEpis = mysqlTable("sst_epis", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  equipamento: varchar("equipamento", { length: 200 }).notNull(),
  ca: varchar("ca", { length: 20 }), // Certificado de Aprovação
  dataEntrega: date("dataEntrega").notNull(),
  dataDevolucao: date("dataDevolucao"),
  dataValidade: date("dataValidade"),
  quantidade: int("quantidade").default(1),
  reciboAssinado: boolean("reciboAssinado").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const sstCipa = mysqlTable("sst_cipa", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  funcao: mysqlEnum("funcao", ["presidente", "vice_presidente", "secretario", "membro_titular", "membro_suplente"]).notNull(),
  mandatoInicio: date("mandatoInicio").notNull(),
  mandatoFim: date("mandatoFim").notNull(),
  status: mysqlEnum("status", ["ativo", "encerrado"]).default("ativo"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.6 MEDICINA OCUPACIONAL
// =============================================
export const prontuarioMedico = mysqlTable("prontuario_medico", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  dataConsulta: date("dataConsulta").notNull(),
  tipo: varchar("tipo", { length: 100 }),
  anamnese: text("anamnese"),
  diagnostico: text("diagnostico"),
  cid: varchar("cid", { length: 10 }),
  conduta: text("conduta"),
  medicoResponsavel: varchar("medicoResponsavel", { length: 200 }),
  crm: varchar("crm", { length: 20 }),
  restricoes: text("restricoes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const afastamentos = mysqlTable("afastamentos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  tipo: mysqlEnum("tipo", ["doenca", "acidente", "maternidade", "paternidade", "inss", "outro"]).notNull(),
  dataInicio: date("dataInicio").notNull(),
  dataFim: date("dataFim"),
  previsaoRetorno: date("previsaoRetorno"),
  cid: varchar("cid", { length: 10 }),
  atestadoUrl: text("atestadoUrl"),
  diasAbonados: int("diasAbonados").default(0),
  status: mysqlEnum("status", ["ativo", "prorrogado", "encerrado"]).default("ativo"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.7 GESTÃO DE DESEMPENHO
// =============================================
export const avaliacoes = mysqlTable("avaliacoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  avaliadorId: varchar("avaliadorId", { length: 64 }).notNull(),
  ciclo: varchar("ciclo", { length: 20 }).notNull(), // ex: "2024-S1"
  tipo: mysqlEnum("tipo", ["90", "180", "270", "360"]).default("90"),
  competencias: json("competencias"), // JSON com notas por competência
  notaFinal: decimal("notaFinal", { precision: 4, scale: 2 }),
  comentarios: text("comentarios"),
  status: mysqlEnum("status", ["pendente", "em_andamento", "concluida", "calibrada"]).default("pendente"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const metasOkr = mysqlTable("metas_okr", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  ciclo: varchar("ciclo", { length: 20 }).notNull(),
  objetivo: text("objetivo").notNull(),
  resultadoChave: text("resultadoChave"),
  metaValor: decimal("metaValor", { precision: 8, scale: 2 }),
  realizado: decimal("realizado", { precision: 8, scale: 2 }).default("0"),
  percentual: decimal("percentual", { precision: 5, scale: 2 }).default("0"),
  peso: decimal("peso", { precision: 5, scale: 2 }).default("1"),
  status: mysqlEnum("status", ["nao_iniciada", "em_andamento", "concluida", "cancelada"]).default("nao_iniciada"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const pdi = mysqlTable("pdi", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  competencia: varchar("competencia", { length: 200 }),
  acaoDesenvolvimento: text("acaoDesenvolvimento"),
  prazo: date("prazo"),
  responsavel: varchar("responsavel", { length: 200 }),
  status: mysqlEnum("status", ["pendente", "em_andamento", "concluido"]).default("pendente"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const feedbacks = mysqlTable("feedbacks", {
  id: varchar("id", { length: 64 }).primaryKey(),
  deUserId: varchar("deUserId", { length: 64 }).notNull(),
  paraUserId: varchar("paraUserId", { length: 64 }).notNull(),
  tipo: mysqlEnum("tipo", ["elogio", "construtivo", "reconhecimento"]).default("construtivo"),
  mensagem: text("mensagem").notNull(),
  publico: boolean("publico").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.9 PORTAL DO COLABORADOR
// =============================================
export const documentosColaborador = mysqlTable("documentos_colaborador", {
  id: varchar("id", { length: 64 }).primaryKey(),
  colaboradorId: varchar("colaboradorId", { length: 64 }).notNull(),
  tipo: varchar("tipo", { length: 100 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  arquivoUrl: text("arquivoUrl"),
  dataEmissao: date("dataEmissao"),
  dataValidade: date("dataValidade"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const comunicados = mysqlTable("comunicados", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  conteudo: text("conteudo").notNull(),
  tipo: mysqlEnum("tipo", ["aviso", "comunicado", "endomarketing", "treinamento"]).default("aviso"),
  publicadoPor: varchar("publicadoPor", { length: 64 }),
  dataPublicacao: timestamp("dataPublicacao").defaultNow(),
  dataExpiracao: timestamp("dataExpiracao"),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const pesquisaClima = mysqlTable("pesquisa_clima", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  perguntas: json("perguntas"),
  dataInicio: date("dataInicio"),
  dataFim: date("dataFim"),
  status: mysqlEnum("status", ["rascunho", "ativa", "encerrada"]).default("rascunho"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.11 CONTROLE DE ACESSO E PORTARIA
// =============================================
export const visitantes = mysqlTable("visitantes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  documento: varchar("documento", { length: 20 }).notNull(),
  tipoDocumento: mysqlEnum("tipoDocumento", ["rg", "cpf", "cnh", "passaporte"]).default("rg"),
  empresa: varchar("empresa", { length: 200 }),
  telefone: varchar("telefone", { length: 20 }),
  fotoUrl: text("fotoUrl"),
  motivoVisita: text("motivoVisita"),
  pessoaVisitada: varchar("pessoaVisitada", { length: 200 }),
  dataEntrada: timestamp("dataEntrada"),
  dataSaida: timestamp("dataSaida"),
  cracha: varchar("cracha", { length: 20 }),
  status: mysqlEnum("status", ["agendado", "presente", "saiu"]).default("agendado"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const acessosPortaria = mysqlTable("acessos_portaria", {
  id: varchar("id", { length: 64 }).primaryKey(),
  pessoaId: varchar("pessoaId", { length: 64 }),
  tipoPessoa: mysqlEnum("tipoPessoa", ["colaborador", "visitante", "terceiro"]).default("colaborador"),
  dispositivo: varchar("dispositivo", { length: 100 }),
  metodoAcesso: mysqlEnum("metodoAcesso", ["senha", "cartao", "facial", "biometria"]).default("cartao"),
  direcao: mysqlEnum("direcao", ["entrada", "saida"]).notNull(),
  localAcesso: varchar("localAcesso", { length: 100 }),
  autorizado: boolean("autorizado").default(true),
  dataHora: timestamp("dataHora").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// 3.12 QUADRO DE VAGAS
// =============================================
export const quadroVagas = mysqlTable("quadro_vagas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  cargo: varchar("cargo", { length: 200 }).notNull(),
  departamento: varchar("departamento", { length: 200 }),
  centroCusto: varchar("centroCusto", { length: 50 }),
  vagasEfetivas: int("vagasEfetivas").default(0),
  vagasPrevistas: int("vagasPrevistas").default(0),
  vagasOcupadas: int("vagasOcupadas").default(0),
  orcamento: decimal("orcamento", { precision: 12, scale: 2 }),
  status: mysqlEnum("status", ["ativo", "congelado", "encerrado"]).default("ativo"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// =============================================
// 3.13 RECRUTAMENTO E SELEÇÃO
// =============================================
export const vagasRecrutamento = mysqlTable("vagas_recrutamento", {
  id: varchar("id", { length: 64 }).primaryKey(),
  quadroVagaId: varchar("quadroVagaId", { length: 64 }),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  requisitos: text("requisitos"),
  departamento: varchar("departamento", { length: 200 }),
  salarioMin: decimal("salarioMin", { precision: 12, scale: 2 }),
  salarioMax: decimal("salarioMax", { precision: 12, scale: 2 }),
  tipoContrato: varchar("tipoContrato", { length: 50 }),
  dataAbertura: date("dataAbertura"),
  dataEncerramento: date("dataEncerramento"),
  status: mysqlEnum("status", ["rascunho", "aberta", "em_selecao", "encerrada", "cancelada"]).default("rascunho"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const candidatos = mysqlTable("candidatos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  vagaId: varchar("vagaId", { length: 64 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 20 }),
  cpf: varchar("cpf", { length: 14 }),
  curriculoUrl: text("curriculoUrl"),
  pontuacaoIA: decimal("pontuacaoIA", { precision: 5, scale: 2 }),
  etapaAtual: mysqlEnum("etapaAtual", ["inscrito", "triagem", "entrevista", "teste", "aprovado", "reprovado", "contratado"]).default("inscrito"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// =============================================
// 3.14 SUPORTE AO CLIENTE
// =============================================
export const chamados = mysqlTable("chamados", {
  id: varchar("id", { length: 64 }).primaryKey(),
  solicitanteId: varchar("solicitanteId", { length: 64 }).notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  tipo: mysqlEnum("tipo", ["duvida", "erro", "melhoria", "incidente"]).default("duvida"),
  criticidade: mysqlEnum("criticidade", ["urgencia", "alta", "normal", "baixa"]).default("normal"),
  status: mysqlEnum("status", ["aberto", "em_atendimento", "aguardando_cliente", "resolvido", "fechado"]).default("aberto"),
  dataAbertura: timestamp("dataAbertura").defaultNow(),
  dataRetorno: timestamp("dataRetorno"),
  dataSolucaoPaliativa: timestamp("dataSolucaoPaliativa"),
  dataSolucaoDefinitiva: timestamp("dataSolucaoDefinitiva"),
  atribuidoA: varchar("atribuidoA", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// =============================================
// LGPD (3.15.28 - 3.15.31)
// =============================================
export const lgpdConsentimentos = mysqlTable("lgpd_consentimentos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titularId: varchar("titularId", { length: 64 }).notNull(),
  titularNome: varchar("titularNome", { length: 255 }),
  titularCpf: varchar("titularCpf", { length: 14 }),
  finalidade: varchar("finalidade", { length: 200 }).notNull(),
  baseJuridica: varchar("baseJuridica", { length: 200 }),
  dataConsentimento: timestamp("dataConsentimento").defaultNow(),
  dataRevogacao: timestamp("dataRevogacao"),
  status: mysqlEnum("status", ["ativo", "revogado", "expirado"]).default("ativo"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const lgpdSolicitacoes = mysqlTable("lgpd_solicitacoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titularId: varchar("titularId", { length: 64 }).notNull(),
  titularNome: varchar("titularNome", { length: 255 }),
  tipo: mysqlEnum("tipo", ["acesso", "correcao", "exclusao", "portabilidade", "anonimizacao"]).notNull(),
  descricao: text("descricao"),
  status: mysqlEnum("status", ["pendente", "em_analise", "atendida", "negada"]).default("pendente"),
  prazoResposta: date("prazoResposta"),
  resposta: text("resposta"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// =============================================
// INTEGRAÇÃO BANCÁRIA
// =============================================
export const integracaoPagamentos = mysqlTable("integracao_pagamentos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  banco: varchar("banco", { length: 100 }).notNull(),
  tipo: mysqlEnum("tipo", ["pix", "ted", "cnab", "boleto"]).notNull(),
  valorTotal: decimal("valorTotal", { precision: 14, scale: 2 }).notNull(),
  quantidadePagamentos: int("quantidadePagamentos").default(0),
  referencia: varchar("referencia", { length: 100 }),
  status: mysqlEnum("status", ["pendente", "processando", "concluido", "erro"]).default("pendente"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// =============================================
// TREINAMENTOS (3.9.7, 3.9.15)
// =============================================
export const treinamentos = mysqlTable("treinamentos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  instrutor: varchar("instrutor", { length: 200 }),
  cargaHoraria: int("cargaHoraria"),
  dataInicio: date("dataInicio"),
  dataFim: date("dataFim"),
  vagas: int("vagas"),
  inscritos: int("inscritos").default(0),
  tipo: mysqlEnum("tipo", ["presencial", "online", "hibrido"]).default("presencial"),
  status: mysqlEnum("status", ["agendado", "em_andamento", "concluido", "cancelado"]).default("agendado"),
  createdAt: timestamp("createdAt").defaultNow(),
});
