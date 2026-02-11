import { describe, it, expect } from "vitest";

// Test that the router module exports correctly
describe("App Router", () => {
  it("should export appRouter", async () => {
    const { appRouter } = await import("../routers");
    expect(appRouter).toBeDefined();
  });

  it("should have all required module routers", async () => {
    const { appRouter } = await import("../routers");
    const procedures = appRouter._def.procedures;

    // Core routers
    expect(procedures).toHaveProperty("auth.me");
    expect(procedures).toHaveProperty("auth.logout");

    // 3.1 Folha de Pagamento
    expect(procedures).toHaveProperty("folha.getColaboradores");
    expect(procedures).toHaveProperty("folha.processarFolha");
    expect(procedures).toHaveProperty("folha.getResumoFolha");
    expect(procedures).toHaveProperty("folha.getContracheque");
    expect(procedures).toHaveProperty("folha.simularFolha");
    expect(procedures).toHaveProperty("folha.getFerias");
    expect(procedures).toHaveProperty("folha.getRescisoes");
    expect(procedures).toHaveProperty("folha.getRelatorios");

    // 3.2 eSocial
    expect(procedures).toHaveProperty("esocial.getEventos");
    expect(procedures).toHaveProperty("esocial.enviarEvento");
    expect(procedures).toHaveProperty("esocial.getConformidade");
    expect(procedures).toHaveProperty("esocial.preAnalise");

    // 3.3 Ponto
    expect(procedures).toHaveProperty("ponto.getRegistros");
    expect(procedures).toHaveProperty("ponto.registrarPonto");
    expect(procedures).toHaveProperty("ponto.getEstatisticas");
    expect(procedures).toHaveProperty("ponto.getEscalas");
    expect(procedures).toHaveProperty("ponto.getBancoHoras");
    expect(procedures).toHaveProperty("ponto.getEspelhoPonto");
    expect(procedures).toHaveProperty("ponto.getOcorrencias");

    // 3.4 Benefícios
    expect(procedures).toHaveProperty("beneficios.getResumo");
    expect(procedures).toHaveProperty("beneficios.getBeneficiosColaborador");
    expect(procedures).toHaveProperty("beneficios.getConsignados");
    expect(procedures).toHaveProperty("beneficios.getRelatorios");

    // 3.5 SST
    expect(procedures).toHaveProperty("sst.getDashboard");
    expect(procedures).toHaveProperty("sst.getExames");
    expect(procedures).toHaveProperty("sst.registrarASO");
    expect(procedures).toHaveProperty("sst.getCATs");
    expect(procedures).toHaveProperty("sst.getEPIs");
    expect(procedures).toHaveProperty("sst.getCIPA");
    expect(procedures).toHaveProperty("sst.getLaudos");

    // 3.6 Medicina Ocupacional
    expect(procedures).toHaveProperty("medicina.getProntuarios");
    expect(procedures).toHaveProperty("medicina.getAfastamentos");
    expect(procedures).toHaveProperty("medicina.getGestantes");
    expect(procedures).toHaveProperty("medicina.getExamesOcupacionais");

    // 3.7 Desempenho
    expect(procedures).toHaveProperty("desempenho.getDashboard");
    expect(procedures).toHaveProperty("desempenho.getAvaliacoes");
    expect(procedures).toHaveProperty("desempenho.getOKRs");
    expect(procedures).toHaveProperty("desempenho.getPDIs");
    expect(procedures).toHaveProperty("desempenho.getFeedbacks");

    // 3.9 Portal do Colaborador
    expect(procedures).toHaveProperty("portal.getContracheques");
    expect(procedures).toHaveProperty("portal.getInformeRendimentos");
    expect(procedures).toHaveProperty("portal.getFerias");
    expect(procedures).toHaveProperty("portal.solicitarFerias");
    expect(procedures).toHaveProperty("portal.getDocumentos");
    expect(procedures).toHaveProperty("portal.getTreinamentos");
    expect(procedures).toHaveProperty("portal.getAvaliacoesPendentes");
    expect(procedures).toHaveProperty("portal.getComunicados");
    expect(procedures).toHaveProperty("portal.getPesquisaClima");

    // 3.11 Controle de Acesso
    expect(procedures).toHaveProperty("acesso.getDashboard");
    expect(procedures).toHaveProperty("acesso.getVisitantes");
    expect(procedures).toHaveProperty("acesso.registrarVisitante");
    expect(procedures).toHaveProperty("acesso.getLogAcessos");

    // 3.12 Quadro de Vagas
    expect(procedures).toHaveProperty("quadroVagas.getResumo");
    expect(procedures).toHaveProperty("quadroVagas.getVagas");
    expect(procedures).toHaveProperty("quadroVagas.criarProposta");

    // 3.13 Recrutamento
    expect(procedures).toHaveProperty("recrutamento.getDashboard");
    expect(procedures).toHaveProperty("recrutamento.getVagas");
    expect(procedures).toHaveProperty("recrutamento.getCandidatos");
    expect(procedures).toHaveProperty("recrutamento.criarVaga");
    expect(procedures).toHaveProperty("recrutamento.avancarCandidato");

    // 3.14 Suporte
    expect(procedures).toHaveProperty("suporte.getChamados");
    expect(procedures).toHaveProperty("suporte.abrirChamado");
    expect(procedures).toHaveProperty("suporte.getFAQ");

    // LGPD
    expect(procedures).toHaveProperty("lgpd.getEstatisticas");
    expect(procedures).toHaveProperty("lgpd.getConsentimentos");
    expect(procedures).toHaveProperty("lgpd.registrarConsentimento");
    expect(procedures).toHaveProperty("lgpd.getSolicitacoes");
    expect(procedures).toHaveProperty("lgpd.getTrilhaAuditoria");

    // Integração Bancária
    expect(procedures).toHaveProperty("bancaria.getBancos");
    expect(procedures).toHaveProperty("bancaria.processarPagamentos");
    expect(procedures).toHaveProperty("bancaria.getTransacoes");

    // Auditoria
    expect(procedures).toHaveProperty("auditoria.getLogs");
  });

  it("should have correct number of top-level routers", async () => {
    const { appRouter } = await import("../routers");
    const routerKeys = Object.keys(appRouter._def.record);
    // system, auth, folha, esocial, ponto, beneficios, sst, medicina, desempenho, portal, acesso, quadroVagas, recrutamento, suporte, lgpd, bancaria, auditoria
    expect(routerKeys.length).toBeGreaterThanOrEqual(15);
  });
});

describe("Schema", () => {
  it("should export all required tables", async () => {
    const schema = await import("../../drizzle/schema");

    // Core tables
    expect(schema.users).toBeDefined();
    expect(schema.colaboradores).toBeDefined();

    // Folha
    expect(schema.folhaPagamento).toBeDefined();
    expect(schema.ferias).toBeDefined();
    expect(schema.rescisao).toBeDefined();

    // eSocial
    expect(schema.esocialEventos).toBeDefined();

    // Ponto
    expect(schema.pontoRegistros).toBeDefined();
    expect(schema.pontoEscalas).toBeDefined();
    expect(schema.bancoHoras).toBeDefined();

    // Benefícios
    expect(schema.beneficios).toBeDefined();
    expect(schema.emprestimosConsignados).toBeDefined();

    // SST
    expect(schema.sstExames).toBeDefined();
    expect(schema.sstAso).toBeDefined();
    expect(schema.sstCat).toBeDefined();
    expect(schema.sstEpis).toBeDefined();
    expect(schema.sstCipa).toBeDefined();

    // Medicina
    expect(schema.prontuarioMedico).toBeDefined();
    expect(schema.afastamentos).toBeDefined();

    // Desempenho
    expect(schema.avaliacoes).toBeDefined();
    expect(schema.metasOkr).toBeDefined();
    expect(schema.pdi).toBeDefined();
    expect(schema.feedbacks).toBeDefined();

    // Portal
    expect(schema.documentosColaborador).toBeDefined();
    expect(schema.treinamentos).toBeDefined();
    expect(schema.comunicados).toBeDefined();
    expect(schema.pesquisaClima).toBeDefined();

    // Acesso
    expect(schema.acessosPortaria).toBeDefined();
    expect(schema.visitantes).toBeDefined();

    // Quadro de Vagas
    expect(schema.quadroVagas).toBeDefined();

    // Recrutamento
    expect(schema.vagasRecrutamento).toBeDefined();
    expect(schema.candidatos).toBeDefined();

    // Suporte
    expect(schema.chamados).toBeDefined();

    // LGPD
    expect(schema.lgpdConsentimentos).toBeDefined();
    expect(schema.lgpdSolicitacoes).toBeDefined();

    // Auditoria
    expect(schema.auditoria).toBeDefined();
  });
});
