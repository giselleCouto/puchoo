import { eq, and, desc, sql, gte, lte, like, count, sum, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users, perfis, gruposUsuarios, auditoria,
  colaboradores, dependentes, folhaPagamento, ferias, rescisao,
  esocialEventos, pontoRegistros, pontoEscalas, bancoHoras, feriados,
  beneficios, emprestimosConsignados,
  sstExames, sstAso, sstCat, sstEpis, sstCipa,
  prontuarioMedico, afastamentos,
  avaliacoes, metasOkr, pdi, feedbacks,
  documentosColaborador, comunicados, pesquisaClima,
  visitantes, acessosPortaria,
  quadroVagas, vagasRecrutamento, candidatos,
  chamados, lgpdConsentimentos, lgpdSolicitacoes,
  integracaoPagamentos, treinamentos,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// =============================================
// USERS
// =============================================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) throw new Error("User ID is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { id: user.id };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) { user.role = 'admin'; values.role = 'admin'; updateSet.role = 'admin'; }
    }
    if (Object.keys(updateSet).length === 0) { updateSet.lastSignedIn = new Date(); }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// =============================================
// AUDITORIA
// =============================================
export async function registrarAuditoria(data: {
  userId: string; userName?: string; acao: "inclusao" | "alteracao" | "exclusao" | "consulta";
  modulo: string; descricao?: string; dadosAnteriores?: unknown; dadosNovos?: unknown;
  ip?: string; userAgent?: string;
}) {
  const db = await getDb();
  if (!db) return;
  const id = `aud-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  await db.insert(auditoria).values({ id, ...data });
}

export async function getAuditoriaLogs(filters?: { modulo?: string; userId?: string; dataInicio?: string; dataFim?: string }) {
  const db = await getDb();
  if (!db) return { logs: [], total: 0 };
  const conditions = [];
  if (filters?.modulo) conditions.push(eq(auditoria.modulo, filters.modulo));
  if (filters?.userId) conditions.push(eq(auditoria.userId, filters.userId));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const logs = await db.select().from(auditoria).where(where).orderBy(desc(auditoria.createdAt)).limit(100);
  const [totalResult] = await db.select({ count: count() }).from(auditoria).where(where);
  return { logs, total: totalResult?.count || 0 };
}

// =============================================
// 3.1 FOLHA DE PAGAMENTO - Colaboradores
// =============================================
export async function getColaboradores(filters?: { departamento?: string; status?: string }) {
  const db = await getDb();
  if (!db) return { colaboradores: [], total: 0 };
  const conditions = [];
  if (filters?.departamento) conditions.push(eq(colaboradores.departamento, filters.departamento));
  if (filters?.status) conditions.push(eq(colaboradores.status, filters.status as any));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const result = await db.select().from(colaboradores).where(where).orderBy(colaboradores.nome);
  const [totalResult] = await db.select({ count: count() }).from(colaboradores).where(where);
  return { colaboradores: result, total: totalResult?.count || 0 };
}

export async function getColaboradorById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(colaboradores).where(eq(colaboradores.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function criarColaborador(data: typeof colaboradores.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(colaboradores).values(data);
  return data;
}

export async function atualizarColaborador(id: string, data: Partial<typeof colaboradores.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(colaboradores).set({ ...data, updatedAt: new Date() }).where(eq(colaboradores.id, id));
}

// =============================================
// 3.1 FOLHA DE PAGAMENTO - Folha
// =============================================
export async function getFolhasPagamento(competencia?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (competencia) conditions.push(eq(folhaPagamento.competencia, competencia));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(folhaPagamento).where(where).orderBy(desc(folhaPagamento.createdAt));
}

export async function getResumoFolha(competencia: string) {
  const db = await getDb();
  if (!db) return null;
  const [resumo] = await db.select({
    totalColaboradores: count(),
    totalBruto: sum(folhaPagamento.salarioBruto),
    totalINSS: sum(folhaPagamento.inss),
    totalIRRF: sum(folhaPagamento.irrf),
    totalFGTS: sum(folhaPagamento.fgts),
    totalDescontos: sum(folhaPagamento.outrosDescontos),
    totalLiquido: sum(folhaPagamento.salarioLiquido),
  }).from(folhaPagamento).where(eq(folhaPagamento.competencia, competencia));
  return resumo;
}

export async function criarFolhaPagamento(data: typeof folhaPagamento.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(folhaPagamento).values(data);
  return data;
}

export async function getContracheque(colaboradorId: string, competencia: string) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.select().from(folhaPagamento)
    .where(and(eq(folhaPagamento.colaboradorId, colaboradorId), eq(folhaPagamento.competencia, competencia)));
  return result || null;
}

// =============================================
// 3.1 FOLHA - Férias
// =============================================
export async function getFeriasList(filters?: { status?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.status) conditions.push(eq(ferias.status, filters.status as any));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(ferias).where(where).orderBy(desc(ferias.createdAt));
}

export async function criarFerias(data: typeof ferias.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(ferias).values(data);
  return data;
}

// =============================================
// 3.1 FOLHA - Rescisão
// =============================================
export async function getRescisoes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rescisao).orderBy(desc(rescisao.createdAt));
}

// =============================================
// 3.2 eSocial
// =============================================
export async function getEsocialEventos() {
  const db = await getDb();
  if (!db) return { eventos: [], resumo: { total: 0, processados: 0, pendentes: 0, validados: 0, rejeitados: 0, retificados: 0 } };
  const eventos = await db.select().from(esocialEventos).orderBy(desc(esocialEventos.createdAt));
  const total = eventos.length;
  const processados = eventos.filter(e => e.status === "processado").length;
  const pendentes = eventos.filter(e => e.status === "pendente").length;
  const validados = eventos.filter(e => e.status === "validado").length;
  const rejeitados = eventos.filter(e => e.status === "rejeitado").length;
  const retificados = eventos.filter(e => e.status === "retificado").length;
  return { eventos, resumo: { total, processados, pendentes, validados, rejeitados, retificados } };
}

export async function criarEsocialEvento(data: typeof esocialEventos.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(esocialEventos).values(data);
  return data;
}

// =============================================
// 3.3 CONTROLE DE PONTO
// =============================================
export async function getPontoRegistros(filters?: { data?: string; colaboradorId?: string }) {
  const db = await getDb();
  if (!db) return { registros: [], total: 0 };
  const conditions = [];
  if (filters?.data) conditions.push(sql`${pontoRegistros.dataRegistro} = ${filters.data}`);
  if (filters?.colaboradorId) conditions.push(eq(pontoRegistros.colaboradorId, filters.colaboradorId));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const registros = await db.select().from(pontoRegistros).where(where).orderBy(desc(pontoRegistros.createdAt));
  return { registros, total: registros.length };
}

export async function registrarPonto(data: typeof pontoRegistros.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(pontoRegistros).values(data);
  return data;
}

export async function getPontoEscalas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pontoEscalas);
}

export async function getBancoHorasColaborador(colaboradorId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bancoHoras).where(eq(bancoHoras.colaboradorId, colaboradorId)).orderBy(desc(bancoHoras.competencia));
}

export async function getFeriadosList() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(feriados).orderBy(feriados.data);
}

// =============================================
// 3.4 BENEFÍCIOS
// =============================================
export async function getBeneficiosColaborador(colaboradorId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(beneficios).where(eq(beneficios.colaboradorId, colaboradorId));
}

export async function getBeneficiosResumo() {
  const db = await getDb();
  if (!db) return null;
  const [totalColab] = await db.select({ count: count() }).from(colaboradores).where(eq(colaboradores.status, "ativo"));
  const beneficiosList = await db.select().from(beneficios).where(eq(beneficios.status, "ativo"));
  const custoTotal = beneficiosList.reduce((acc, b) => acc + parseFloat(b.valorEmpresa?.toString() || "0"), 0);
  return {
    totalColaboradores: totalColab?.count || 0,
    custoMensal: custoTotal,
    beneficiosAtivos: beneficiosList.length,
  };
}

export async function getConsignados() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emprestimosConsignados).where(eq(emprestimosConsignados.status, "ativo"));
}

export async function criarBeneficio(data: typeof beneficios.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(beneficios).values(data);
  return data;
}

// =============================================
// 3.5 SST/SESMT
// =============================================
export async function getSstExames(colaboradorId?: string) {
  const db = await getDb();
  if (!db) return [];
  if (colaboradorId) return db.select().from(sstExames).where(eq(sstExames.colaboradorId, colaboradorId)).orderBy(desc(sstExames.dataExame));
  return db.select().from(sstExames).orderBy(desc(sstExames.dataExame));
}

export async function criarSstExame(data: typeof sstExames.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(sstExames).values(data);
  return data;
}

export async function getSstAsos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sstAso).orderBy(desc(sstAso.dataEmissao));
}

export async function getSstCats() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sstCat).orderBy(desc(sstCat.dataAcidente));
}

export async function getSstEpis() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sstEpis).orderBy(desc(sstEpis.dataEntrega));
}

export async function getSstCipaMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sstCipa).where(eq(sstCipa.status, "ativo"));
}

// =============================================
// 3.6 MEDICINA OCUPACIONAL
// =============================================
export async function getProntuarios() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(prontuarioMedico).orderBy(desc(prontuarioMedico.dataConsulta));
}

export async function getAfastamentosList(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) return db.select().from(afastamentos).where(eq(afastamentos.status, status as any)).orderBy(desc(afastamentos.dataInicio));
  return db.select().from(afastamentos).orderBy(desc(afastamentos.dataInicio));
}

// =============================================
// 3.7 DESEMPENHO
// =============================================
export async function getAvaliacoesList(ciclo?: string) {
  const db = await getDb();
  if (!db) return [];
  if (ciclo) return db.select().from(avaliacoes).where(eq(avaliacoes.ciclo, ciclo)).orderBy(desc(avaliacoes.createdAt));
  return db.select().from(avaliacoes).orderBy(desc(avaliacoes.createdAt));
}

export async function getMetasOkrList(colaboradorId?: string) {
  const db = await getDb();
  if (!db) return [];
  if (colaboradorId) return db.select().from(metasOkr).where(eq(metasOkr.colaboradorId, colaboradorId));
  return db.select().from(metasOkr).orderBy(desc(metasOkr.createdAt));
}

export async function getPdiList(colaboradorId?: string) {
  const db = await getDb();
  if (!db) return [];
  if (colaboradorId) return db.select().from(pdi).where(eq(pdi.colaboradorId, colaboradorId));
  return db.select().from(pdi).orderBy(desc(pdi.createdAt));
}

export async function getFeedbacksList() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt));
}

// =============================================
// 3.9 PORTAL DO COLABORADOR
// =============================================
export async function getDocumentosColaboradorList(colaboradorId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(documentosColaborador).where(eq(documentosColaborador.colaboradorId, colaboradorId));
}

export async function getComunicadosList() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comunicados).where(eq(comunicados.ativo, true)).orderBy(desc(comunicados.dataPublicacao));
}

export async function getPesquisasClima() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pesquisaClima).orderBy(desc(pesquisaClima.createdAt));
}

export async function getTreinamentosList() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(treinamentos).orderBy(desc(treinamentos.dataInicio));
}

// =============================================
// 3.11 CONTROLE DE ACESSO
// =============================================
export async function getVisitantesList(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) return db.select().from(visitantes).where(eq(visitantes.status, status as any)).orderBy(desc(visitantes.createdAt));
  return db.select().from(visitantes).orderBy(desc(visitantes.createdAt));
}

export async function registrarVisitante(data: typeof visitantes.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(visitantes).values(data);
  return data;
}

export async function getAcessosPortariaList() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(acessosPortaria).orderBy(desc(acessosPortaria.dataHora)).limit(100);
}

// =============================================
// 3.12 QUADRO DE VAGAS
// =============================================
export async function getQuadroVagasList() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quadroVagas).orderBy(quadroVagas.departamento);
}

export async function criarQuadroVaga(data: typeof quadroVagas.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(quadroVagas).values(data);
  return data;
}

// =============================================
// 3.13 RECRUTAMENTO
// =============================================
export async function getVagasRecrutamentoList(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) return db.select().from(vagasRecrutamento).where(eq(vagasRecrutamento.status, status as any)).orderBy(desc(vagasRecrutamento.createdAt));
  return db.select().from(vagasRecrutamento).orderBy(desc(vagasRecrutamento.createdAt));
}

export async function criarVagaRecrutamento(data: typeof vagasRecrutamento.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(vagasRecrutamento).values(data);
  return data;
}

export async function getCandidatosList(vagaId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(candidatos).where(eq(candidatos.vagaId, vagaId)).orderBy(desc(candidatos.pontuacaoIA));
}

export async function atualizarCandidato(id: string, data: Partial<typeof candidatos.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(candidatos).set({ ...data, updatedAt: new Date() }).where(eq(candidatos.id, id));
}

// =============================================
// 3.14 SUPORTE
// =============================================
export async function getChamadosList(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) return db.select().from(chamados).where(eq(chamados.status, status as any)).orderBy(desc(chamados.createdAt));
  return db.select().from(chamados).orderBy(desc(chamados.createdAt));
}

export async function criarChamado(data: typeof chamados.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(chamados).values(data);
  return data;
}

// =============================================
// LGPD
// =============================================
export async function getLgpdConsentimentos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lgpdConsentimentos).orderBy(desc(lgpdConsentimentos.createdAt));
}

export async function criarLgpdConsentimento(data: typeof lgpdConsentimentos.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(lgpdConsentimentos).values(data);
  return data;
}

export async function getLgpdSolicitacoes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lgpdSolicitacoes).orderBy(desc(lgpdSolicitacoes.createdAt));
}

// =============================================
// INTEGRAÇÃO BANCÁRIA
// =============================================
export async function getIntegracaoPagamentos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(integracaoPagamentos).orderBy(desc(integracaoPagamentos.createdAt));
}

export async function criarIntegracaoPagamento(data: typeof integracaoPagamentos.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(integracaoPagamentos).values(data);
  return data;
}

// =============================================
// PERFIS E PERMISSÕES
// =============================================
export async function getPerfisList() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(perfis).orderBy(perfis.nome);
}

export async function criarPerfil(data: typeof perfis.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(perfis).values(data);
  return data;
}

export async function atualizarPerfil(id: string, data: Partial<typeof perfis.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(perfis).set({ ...data, updatedAt: new Date() }).where(eq(perfis.id, id));
}

export async function deletarPerfil(id: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(perfis).where(eq(perfis.id, id));
}

export async function getGruposUsuariosList() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gruposUsuarios).orderBy(gruposUsuarios.nome);
}
