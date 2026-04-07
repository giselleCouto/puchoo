import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, sql } from "drizzle-orm";
import {
  colaboradores,
  folhaPagamento,
  pontoRegistros,
  pontoEscalas,
  bancoHoras,
  ferias,
  auditoria,
} from "../../drizzle/schema";

// =============================================
// HELPERS
// =============================================
function genTestId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

const TEST_PREFIX = "INTTEST_";

// =============================================
// TESTES DE INTEGRAÇÃO - FOLHA DE PAGAMENTO
// =============================================
describe("Integração: Folha de Pagamento", () => {
  let db: ReturnType<typeof drizzle> | null = null;
  const testIds: string[] = [];

  beforeAll(async () => {
    if (process.env.DATABASE_URL) {
      try {
        db = drizzle(process.env.DATABASE_URL);
      } catch {
        db = null;
      }
    }
  });

  afterAll(async () => {
    // Limpar dados de teste
    if (db && testIds.length > 0) {
      try {
        for (const id of testIds) {
          await db.delete(folhaPagamento).where(eq(folhaPagamento.colaboradorId, id));
          await db.delete(ferias).where(eq(ferias.colaboradorId, id));
          await db.delete(colaboradores).where(eq(colaboradores.id, id));
        }
        // Limpar auditoria de teste
        await db.delete(auditoria).where(
          sql`${auditoria.descricao} LIKE ${'%' + TEST_PREFIX + '%'}`
        );
      } catch (e) {
        console.warn("Erro ao limpar dados de teste:", e);
      }
    }
  });

  // ----- CRUD de Colaboradores -----

  it("deve criar um colaborador com dados obrigatórios", async () => {
    if (!db) return;
    const id = genTestId();
    testIds.push(id);

    await db.insert(colaboradores).values({
      id,
      nome: `${TEST_PREFIX}João Silva`,
      cpf: "123.456.789-00",
      dataAdmissao: new Date("2024-01-15"),
      cargo: "Analista de RH",
      departamento: "Recursos Humanos",
      salarioBase: "5500.00",
      tipoContrato: "clt",
      status: "ativo",
    });

    const [result] = await db
      .select()
      .from(colaboradores)
      .where(eq(colaboradores.id, id))
      .limit(1);

    expect(result).toBeDefined();
    expect(result.nome).toBe(`${TEST_PREFIX}João Silva`);
    expect(result.cpf).toBe("123.456.789-00");
    expect(result.cargo).toBe("Analista de RH");
    expect(result.departamento).toBe("Recursos Humanos");
    expect(result.salarioBase).toBe("5500.00");
    expect(result.tipoContrato).toBe("clt");
    expect(result.status).toBe("ativo");
  });

  it("deve atualizar dados de um colaborador", async () => {
    if (!db) return;
    const id = genTestId();
    testIds.push(id);

    await db.insert(colaboradores).values({
      id,
      nome: `${TEST_PREFIX}Maria Santos`,
      cpf: "987.654.321-00",
      dataAdmissao: new Date("2023-06-01"),
      salarioBase: "4000.00",
      status: "ativo",
    });

    // Atualizar salário e cargo
    await db
      .update(colaboradores)
      .set({
        salarioBase: "5000.00",
        cargo: "Coordenadora de RH",
        updatedAt: new Date(),
      })
      .where(eq(colaboradores.id, id));

    const [updated] = await db
      .select()
      .from(colaboradores)
      .where(eq(colaboradores.id, id))
      .limit(1);

    expect(updated.salarioBase).toBe("5000.00");
    expect(updated.cargo).toBe("Coordenadora de RH");
  });

  it("deve listar colaboradores ativos por departamento", async () => {
    if (!db) return;
    const id1 = genTestId();
    const id2 = genTestId();
    testIds.push(id1, id2);

    await db.insert(colaboradores).values([
      {
        id: id1,
        nome: `${TEST_PREFIX}Pedro TI`,
        cpf: "111.222.333-44",
        dataAdmissao: new Date("2024-01-01"),
        departamento: "TI_TEST",
        status: "ativo",
      },
      {
        id: id2,
        nome: `${TEST_PREFIX}Ana TI`,
        cpf: "555.666.777-88",
        dataAdmissao: new Date("2024-02-01"),
        departamento: "TI_TEST",
        status: "ativo",
      },
    ]);

    const results = await db
      .select()
      .from(colaboradores)
      .where(
        and(
          eq(colaboradores.departamento, "TI_TEST"),
          eq(colaboradores.status, "ativo")
        )
      );

    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.every((c) => c.departamento === "TI_TEST")).toBe(true);
    expect(results.every((c) => c.status === "ativo")).toBe(true);
  });

  // ----- Processamento de Folha -----

  it("deve processar folha de pagamento com cálculos corretos de INSS, IRRF e FGTS", async () => {
    if (!db) return;
    const colabId = genTestId();
    const folhaId = genTestId();
    testIds.push(colabId);

    // Criar colaborador com salário de R$ 5.500,00
    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Carlos Folha`,
      cpf: "222.333.444-55",
      dataAdmissao: new Date("2024-01-01"),
      salarioBase: "5500.00",
      status: "ativo",
    });

    // Calcular encargos
    const salario = 5500.0;
    const inss = Math.min(salario * 0.14, 908.86);
    const baseIRRF = salario - inss;
    let irrf = 0;
    if (baseIRRF > 4664.68) irrf = baseIRRF * 0.275 - 896.0;
    else if (baseIRRF > 3751.06) irrf = baseIRRF * 0.225 - 662.77;
    else if (baseIRRF > 2826.66) irrf = baseIRRF * 0.15 - 381.44;
    else if (baseIRRF > 2259.21) irrf = baseIRRF * 0.075 - 169.44;
    if (irrf < 0) irrf = 0;
    const fgts = salario * 0.08;
    const liquido = salario - inss - irrf;

    // Inserir folha processada
    await db.insert(folhaPagamento).values({
      id: folhaId,
      colaboradorId: colabId,
      competencia: "2025-03",
      tipo: "mensal",
      salarioBruto: salario.toFixed(2),
      inss: inss.toFixed(2),
      irrf: irrf.toFixed(2),
      fgts: fgts.toFixed(2),
      salarioLiquido: liquido.toFixed(2),
      status: "processada",
    });

    // Verificar folha
    const [folha] = await db
      .select()
      .from(folhaPagamento)
      .where(eq(folhaPagamento.id, folhaId))
      .limit(1);

    expect(folha).toBeDefined();
    expect(folha.colaboradorId).toBe(colabId);
    expect(folha.competencia).toBe("2025-03");
    expect(folha.status).toBe("processada");

    const brutoDb = parseFloat(folha.salarioBruto?.toString() || "0");
    const inssDb = parseFloat(folha.inss?.toString() || "0");
    const irrfDb = parseFloat(folha.irrf?.toString() || "0");
    const fgtsDb = parseFloat(folha.fgts?.toString() || "0");
    const liquidoDb = parseFloat(folha.salarioLiquido?.toString() || "0");

    expect(brutoDb).toBe(5500.0);
    expect(inssDb).toBeCloseTo(inss, 2);
    expect(irrfDb).toBeCloseTo(irrf, 2);
    expect(fgtsDb).toBeCloseTo(fgts, 2);
    expect(liquidoDb).toBeCloseTo(liquido, 2);

    // Verificar que INSS não ultrapassa o teto
    expect(inssDb).toBeLessThanOrEqual(908.86);

    // Verificar que líquido = bruto - INSS - IRRF
    expect(liquidoDb).toBeCloseTo(brutoDb - inssDb - irrfDb, 2);
  });

  it("deve processar folha para salário mínimo sem IRRF", async () => {
    if (!db) return;
    const colabId = genTestId();
    const folhaId = genTestId();
    testIds.push(colabId);

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Ana Mínimo`,
      cpf: "333.444.555-66",
      dataAdmissao: new Date("2024-01-01"),
      salarioBase: "1518.00",
      status: "ativo",
    });

    const salario = 1518.0;
    const inss = Math.min(salario * 0.14, 908.86);
    const baseIRRF = salario - inss;
    // Base IRRF < 2259.21, portanto IRRF = 0
    const fgts = salario * 0.08;
    const liquido = salario - inss;

    await db.insert(folhaPagamento).values({
      id: folhaId,
      colaboradorId: colabId,
      competencia: "2025-03",
      tipo: "mensal",
      salarioBruto: salario.toFixed(2),
      inss: inss.toFixed(2),
      irrf: "0.00",
      fgts: fgts.toFixed(2),
      salarioLiquido: liquido.toFixed(2),
      status: "processada",
    });

    const [folha] = await db
      .select()
      .from(folhaPagamento)
      .where(eq(folhaPagamento.id, folhaId))
      .limit(1);

    expect(parseFloat(folha.irrf?.toString() || "0")).toBe(0);
    expect(parseFloat(folha.salarioLiquido?.toString() || "0")).toBeCloseTo(
      liquido,
      2
    );
  });

  it("deve gerar resumo da folha com totais corretos", async () => {
    if (!db) return;
    const colabId1 = genTestId();
    const colabId2 = genTestId();
    testIds.push(colabId1, colabId2);
    const competencia = "2025-99"; // Competência fictícia para isolar teste

    // Criar 2 colaboradores
    await db.insert(colaboradores).values([
      {
        id: colabId1,
        nome: `${TEST_PREFIX}Resumo A`,
        cpf: "444.555.666-77",
        dataAdmissao: new Date("2024-01-01"),
        salarioBase: "3000.00",
        status: "ativo",
      },
      {
        id: colabId2,
        nome: `${TEST_PREFIX}Resumo B`,
        cpf: "777.888.999-00",
        dataAdmissao: new Date("2024-01-01"),
        salarioBase: "4000.00",
        status: "ativo",
      },
    ]);

    // Inserir folhas
    await db.insert(folhaPagamento).values([
      {
        id: genTestId(),
        colaboradorId: colabId1,
        competencia,
        tipo: "mensal",
        salarioBruto: "3000.00",
        inss: "420.00",
        irrf: "0.00",
        fgts: "240.00",
        salarioLiquido: "2580.00",
        status: "processada",
      },
      {
        id: genTestId(),
        colaboradorId: colabId2,
        competencia,
        tipo: "mensal",
        salarioBruto: "4000.00",
        inss: "560.00",
        irrf: "50.00",
        fgts: "320.00",
        salarioLiquido: "3390.00",
        status: "processada",
      },
    ]);

    // Consultar resumo
    const [resumo] = await db
      .select({
        totalColaboradores: sql<number>`COUNT(*)`,
        totalBruto: sql<string>`SUM(${folhaPagamento.salarioBruto})`,
        totalINSS: sql<string>`SUM(${folhaPagamento.inss})`,
        totalIRRF: sql<string>`SUM(${folhaPagamento.irrf})`,
        totalFGTS: sql<string>`SUM(${folhaPagamento.fgts})`,
        totalLiquido: sql<string>`SUM(${folhaPagamento.salarioLiquido})`,
      })
      .from(folhaPagamento)
      .where(eq(folhaPagamento.competencia, competencia));

    expect(resumo.totalColaboradores).toBe(2);
    expect(parseFloat(resumo.totalBruto)).toBe(7000.0);
    expect(parseFloat(resumo.totalINSS)).toBe(980.0);
    expect(parseFloat(resumo.totalIRRF)).toBe(50.0);
    expect(parseFloat(resumo.totalFGTS)).toBe(560.0);
    expect(parseFloat(resumo.totalLiquido)).toBe(5970.0);
  });

  // ----- Férias -----

  it("deve criar e aprovar solicitação de férias", async () => {
    if (!db) return;
    const colabId = genTestId();
    const feriasId = genTestId();
    testIds.push(colabId);

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Férias Teste`,
      cpf: "888.999.000-11",
      dataAdmissao: new Date("2023-01-01"),
      status: "ativo",
    });

    // Solicitar férias
    await db.insert(ferias).values({
      id: feriasId,
      colaboradorId: colabId,
      periodoAquisitivo: "2023-01 a 2023-12",
      dataInicio: new Date("2025-07-01"),
      dataFim: new Date("2025-07-30"),
      dias: 30,
      abonoPecuniario: false,
      valorFerias: "5500.00",
      tercoConstitucional: "1833.33",
      status: "solicitada",
    });

    // Verificar que foi criada como "solicitada"
    const [solicitada] = await db
      .select()
      .from(ferias)
      .where(eq(ferias.id, feriasId))
      .limit(1);

    expect(solicitada.status).toBe("solicitada");
    expect(solicitada.dias).toBe(30);

    // Aprovar férias
    await db
      .update(ferias)
      .set({ status: "aprovada", aprovadoPor: "admin_test" })
      .where(eq(ferias.id, feriasId));

    const [aprovada] = await db
      .select()
      .from(ferias)
      .where(eq(ferias.id, feriasId))
      .limit(1);

    expect(aprovada.status).toBe("aprovada");
    expect(aprovada.aprovadoPor).toBe("admin_test");
  });

  it("deve calcular terço constitucional de férias corretamente", async () => {
    if (!db) return;
    const colabId = genTestId();
    const feriasId = genTestId();
    testIds.push(colabId);

    const salario = 6000.0;
    const terco = salario / 3;

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Terço Férias`,
      cpf: "111.000.999-88",
      dataAdmissao: new Date("2023-01-01"),
      salarioBase: salario.toFixed(2),
      status: "ativo",
    });

    await db.insert(ferias).values({
      id: feriasId,
      colaboradorId: colabId,
      dataInicio: new Date("2025-08-01"),
      dataFim: new Date("2025-08-30"),
      dias: 30,
      valorFerias: salario.toFixed(2),
      tercoConstitucional: terco.toFixed(2),
      status: "aprovada",
    });

    const [result] = await db
      .select()
      .from(ferias)
      .where(eq(ferias.id, feriasId))
      .limit(1);

    const valorFerias = parseFloat(result.valorFerias?.toString() || "0");
    const tercoDb = parseFloat(result.tercoConstitucional?.toString() || "0");

    expect(tercoDb).toBeCloseTo(valorFerias / 3, 2);
  });

  // ----- Contracheque -----

  it("deve gerar contracheque com proventos e descontos detalhados", async () => {
    if (!db) return;
    const colabId = genTestId();
    const folhaId = genTestId();
    testIds.push(colabId);

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Contracheque Teste`,
      cpf: "222.111.000-99",
      dataAdmissao: new Date("2024-01-01"),
      salarioBase: "7000.00",
      status: "ativo",
    });

    await db.insert(folhaPagamento).values({
      id: folhaId,
      colaboradorId: colabId,
      competencia: "2025-03",
      tipo: "mensal",
      salarioBruto: "7000.00",
      horasExtras: "350.00",
      adicionalNoturno: "140.00",
      inss: "908.86",
      irrf: "450.00",
      fgts: "560.00",
      outrosDescontos: "100.00",
      salarioLiquido: "6031.14",
      status: "processada",
    });

    // Buscar folha e colaborador
    const [folha] = await db
      .select()
      .from(folhaPagamento)
      .where(eq(folhaPagamento.id, folhaId))
      .limit(1);

    const [colab] = await db
      .select()
      .from(colaboradores)
      .where(eq(colaboradores.id, colabId))
      .limit(1);

    expect(folha).toBeDefined();
    expect(colab).toBeDefined();

    const bruto = parseFloat(folha.salarioBruto?.toString() || "0");
    const hExtras = parseFloat(folha.horasExtras?.toString() || "0");
    const adNoturno = parseFloat(folha.adicionalNoturno?.toString() || "0");
    const inssVal = parseFloat(folha.inss?.toString() || "0");
    const irrfVal = parseFloat(folha.irrf?.toString() || "0");
    const outrosDesc = parseFloat(folha.outrosDescontos?.toString() || "0");
    const liquidoVal = parseFloat(folha.salarioLiquido?.toString() || "0");

    const totalProventos = bruto + hExtras + adNoturno;
    const totalDescontos = inssVal + irrfVal + outrosDesc;

    expect(totalProventos).toBe(7490.0);
    expect(totalDescontos).toBeCloseTo(1458.86, 2);
    expect(liquidoVal).toBeCloseTo(totalProventos - totalDescontos, 2);
  });
});

// =============================================
// TESTES DE INTEGRAÇÃO - PONTO
// =============================================
describe("Integração: Controle de Ponto", () => {
  let db: ReturnType<typeof drizzle> | null = null;
  const testIds: string[] = [];

  beforeAll(async () => {
    if (process.env.DATABASE_URL) {
      try {
        db = drizzle(process.env.DATABASE_URL);
      } catch {
        db = null;
      }
    }
  });

  afterAll(async () => {
    if (db && testIds.length > 0) {
      try {
        for (const id of testIds) {
          await db.delete(pontoRegistros).where(eq(pontoRegistros.colaboradorId, id));
          await db.delete(bancoHoras).where(eq(bancoHoras.colaboradorId, id));
          await db.delete(colaboradores).where(eq(colaboradores.id, id));
        }
        // Limpar escalas de teste
        await db.delete(pontoEscalas).where(
          sql`${pontoEscalas.nome} LIKE ${'%' + TEST_PREFIX + '%'}`
        );
      } catch (e) {
        console.warn("Erro ao limpar dados de teste:", e);
      }
    }
  });

  // ----- Registro de Ponto -----

  it("deve registrar entrada e saída de ponto", async () => {
    if (!db) return;
    const colabId = genTestId();
    testIds.push(colabId);

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Ponto Entrada`,
      cpf: "333.222.111-00",
      dataAdmissao: new Date("2024-01-01"),
      status: "ativo",
    });

    const entradaId = genTestId();
    const saidaId = genTestId();
    const hoje = new Date();

    // Registrar entrada
    await db.insert(pontoRegistros).values({
      id: entradaId,
      colaboradorId: colabId,
      dataRegistro: hoje,
      horaRegistro: "08:00",
      tipo: "entrada",
      metodo: "biometria",
      validado: true,
    });

    // Registrar saída
    await db.insert(pontoRegistros).values({
      id: saidaId,
      colaboradorId: colabId,
      dataRegistro: hoje,
      horaRegistro: "17:00",
      tipo: "saida",
      metodo: "biometria",
      validado: true,
    });

    const registros = await db
      .select()
      .from(pontoRegistros)
      .where(eq(pontoRegistros.colaboradorId, colabId));

    expect(registros.length).toBe(2);

    const entrada = registros.find((r) => r.tipo === "entrada");
    const saida = registros.find((r) => r.tipo === "saida");

    expect(entrada).toBeDefined();
    expect(entrada!.horaRegistro).toBe("08:00");
    expect(entrada!.metodo).toBe("biometria");

    expect(saida).toBeDefined();
    expect(saida!.horaRegistro).toBe("17:00");
  });

  it("deve registrar jornada completa com 4 batidas", async () => {
    if (!db) return;
    const colabId = genTestId();
    testIds.push(colabId);

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Jornada Completa`,
      cpf: "444.333.222-11",
      dataAdmissao: new Date("2024-01-01"),
      status: "ativo",
    });

    const hoje = new Date();
    const batidas = [
      { id: genTestId(), hora: "08:00", tipo: "entrada" as const },
      { id: genTestId(), hora: "12:00", tipo: "intervalo_inicio" as const },
      { id: genTestId(), hora: "13:00", tipo: "intervalo_fim" as const },
      { id: genTestId(), hora: "17:00", tipo: "saida" as const },
    ];

    for (const batida of batidas) {
      await db.insert(pontoRegistros).values({
        id: batida.id,
        colaboradorId: colabId,
        dataRegistro: hoje,
        horaRegistro: batida.hora,
        tipo: batida.tipo,
        metodo: "facial",
        validado: true,
      });
    }

    const registros = await db
      .select()
      .from(pontoRegistros)
      .where(eq(pontoRegistros.colaboradorId, colabId))
      .orderBy(pontoRegistros.horaRegistro);

    expect(registros.length).toBe(4);
    expect(registros[0].tipo).toBe("entrada");
    expect(registros[1].tipo).toBe("intervalo_inicio");
    expect(registros[2].tipo).toBe("intervalo_fim");
    expect(registros[3].tipo).toBe("saida");

    // Calcular horas trabalhadas: (12:00-08:00) + (17:00-13:00) = 4 + 4 = 8h
    const entradaMin = 8 * 60;
    const intervInicioMin = 12 * 60;
    const intervFimMin = 13 * 60;
    const saidaMin = 17 * 60;
    const horasTrabalhadas =
      (intervInicioMin - entradaMin + (saidaMin - intervFimMin)) / 60;

    expect(horasTrabalhadas).toBe(8);
  });

  it("deve registrar ponto com geolocalização", async () => {
    if (!db) return;
    const colabId = genTestId();
    testIds.push(colabId);

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Ponto Geo`,
      cpf: "555.444.333-22",
      dataAdmissao: new Date("2024-01-01"),
      status: "ativo",
    });

    const pontoId = genTestId();
    await db.insert(pontoRegistros).values({
      id: pontoId,
      colaboradorId: colabId,
      dataRegistro: new Date(),
      horaRegistro: "08:05",
      tipo: "entrada",
      metodo: "geolocalizacao",
      latitude: "-3.1190275",
      longitude: "-60.0217314",
      dispositivo: "iPhone 15 Pro",
      validado: true,
    });

    const [registro] = await db
      .select()
      .from(pontoRegistros)
      .where(eq(pontoRegistros.id, pontoId))
      .limit(1);

    expect(registro).toBeDefined();
    expect(registro.metodo).toBe("geolocalizacao");
    expect(parseFloat(registro.latitude?.toString() || "0")).toBeCloseTo(
      -3.119,
      2
    );
    expect(parseFloat(registro.longitude?.toString() || "0")).toBeCloseTo(
      -60.022,
      2
    );
    expect(registro.dispositivo).toBe("iPhone 15 Pro");
  });

  // ----- Escalas de Ponto -----

  it("deve criar e consultar escalas de trabalho", async () => {
    if (!db) return;
    const escalaId = genTestId();

    await db.insert(pontoEscalas).values({
      id: escalaId,
      nome: `${TEST_PREFIX}Escala Padrão`,
      tipo: "fixa",
      horaEntrada: "08:00",
      horaSaida: "17:00",
      intervaloInicio: "12:00",
      intervaloFim: "13:00",
      toleranciaMinutos: 10,
    });

    const [escala] = await db
      .select()
      .from(pontoEscalas)
      .where(eq(pontoEscalas.id, escalaId))
      .limit(1);

    expect(escala).toBeDefined();
    expect(escala.tipo).toBe("fixa");
    expect(escala.horaEntrada).toBe("08:00");
    expect(escala.horaSaida).toBe("17:00");
    expect(escala.toleranciaMinutos).toBe(10);

    // Limpar
    await db.delete(pontoEscalas).where(eq(pontoEscalas.id, escalaId));
  });

  it("deve criar escala 12x36", async () => {
    if (!db) return;
    const escalaId = genTestId();

    await db.insert(pontoEscalas).values({
      id: escalaId,
      nome: `${TEST_PREFIX}Escala 12x36`,
      tipo: "12x36",
      horaEntrada: "07:00",
      horaSaida: "19:00",
      toleranciaMinutos: 5,
    });

    const [escala] = await db
      .select()
      .from(pontoEscalas)
      .where(eq(pontoEscalas.id, escalaId))
      .limit(1);

    expect(escala.tipo).toBe("12x36");
    expect(escala.horaEntrada).toBe("07:00");
    expect(escala.horaSaida).toBe("19:00");

    await db.delete(pontoEscalas).where(eq(pontoEscalas.id, escalaId));
  });

  // ----- Banco de Horas -----

  it("deve registrar crédito e débito no banco de horas", async () => {
    if (!db) return;
    const colabId = genTestId();
    testIds.push(colabId);

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Banco Horas`,
      cpf: "666.555.444-33",
      dataAdmissao: new Date("2024-01-01"),
      status: "ativo",
    });

    // Mês 1: crédito de 10h
    const bh1Id = genTestId();
    await db.insert(bancoHoras).values({
      id: bh1Id,
      colaboradorId: colabId,
      competencia: "2025-01",
      saldoAnterior: "0.00",
      creditoHoras: "10.00",
      debitoHoras: "0.00",
      saldoAtual: "10.00",
    });

    // Mês 2: débito de 4h
    const bh2Id = genTestId();
    await db.insert(bancoHoras).values({
      id: bh2Id,
      colaboradorId: colabId,
      competencia: "2025-02",
      saldoAnterior: "10.00",
      creditoHoras: "2.00",
      debitoHoras: "4.00",
      saldoAtual: "8.00",
    });

    const historico = await db
      .select()
      .from(bancoHoras)
      .where(eq(bancoHoras.colaboradorId, colabId))
      .orderBy(bancoHoras.competencia);

    expect(historico.length).toBe(2);

    const mes1 = historico[0];
    const mes2 = historico[1];

    expect(parseFloat(mes1.saldoAtual?.toString() || "0")).toBe(10.0);
    expect(parseFloat(mes2.saldoAnterior?.toString() || "0")).toBe(10.0);
    expect(parseFloat(mes2.creditoHoras?.toString() || "0")).toBe(2.0);
    expect(parseFloat(mes2.debitoHoras?.toString() || "0")).toBe(4.0);
    expect(parseFloat(mes2.saldoAtual?.toString() || "0")).toBe(8.0);

    // Verificar continuidade: saldoAtual(mes1) == saldoAnterior(mes2)
    expect(parseFloat(mes1.saldoAtual?.toString() || "0")).toBe(
      parseFloat(mes2.saldoAnterior?.toString() || "0")
    );
  });

  // ----- Espelho de Ponto -----

  it("deve gerar espelho de ponto mensal com múltiplos dias", async () => {
    if (!db) return;
    const colabId = genTestId();
    testIds.push(colabId);

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Espelho Ponto`,
      cpf: "777.666.555-44",
      dataAdmissao: new Date("2024-01-01"),
      status: "ativo",
    });

    // Registrar 3 dias de trabalho
    const dias = ["2025-03-03", "2025-03-04", "2025-03-05"];
    for (const dia of dias) {
      const batidas = [
        { hora: "08:00", tipo: "entrada" as const },
        { hora: "12:00", tipo: "intervalo_inicio" as const },
        { hora: "13:00", tipo: "intervalo_fim" as const },
        { hora: "17:00", tipo: "saida" as const },
      ];
      for (const b of batidas) {
        await db.insert(pontoRegistros).values({
          id: genTestId(),
          colaboradorId: colabId,
          dataRegistro: new Date(dia),
          horaRegistro: b.hora,
          tipo: b.tipo,
          metodo: "biometria",
          validado: true,
        });
      }
    }

    // Consultar registros do colaborador
    const registros = await db
      .select()
      .from(pontoRegistros)
      .where(eq(pontoRegistros.colaboradorId, colabId));

    expect(registros.length).toBe(12); // 3 dias x 4 batidas

    // Agrupar por dia
    const diasMap = new Map<string, typeof registros>();
    for (const r of registros) {
      const key = r.dataRegistro?.toString() || "";
      if (!diasMap.has(key)) diasMap.set(key, []);
      diasMap.get(key)!.push(r);
    }

    expect(diasMap.size).toBe(3);

    // Cada dia deve ter 4 registros
    for (const [, regs] of diasMap) {
      expect(regs.length).toBe(4);
      expect(regs.some((r) => r.tipo === "entrada")).toBe(true);
      expect(regs.some((r) => r.tipo === "intervalo_inicio")).toBe(true);
      expect(regs.some((r) => r.tipo === "intervalo_fim")).toBe(true);
      expect(regs.some((r) => r.tipo === "saida")).toBe(true);
    }
  });

  // ----- Validação de Métodos de Registro -----

  it("deve aceitar todos os métodos de registro de ponto", async () => {
    if (!db) return;
    const colabId = genTestId();
    testIds.push(colabId);

    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Métodos Ponto`,
      cpf: "888.777.666-55",
      dataAdmissao: new Date("2024-01-01"),
      status: "ativo",
    });

    const metodos = [
      "biometria",
      "facial",
      "geolocalizacao",
      "manual",
      "terminal",
    ] as const;

    for (const metodo of metodos) {
      await db.insert(pontoRegistros).values({
        id: genTestId(),
        colaboradorId: colabId,
        dataRegistro: new Date(),
        horaRegistro: "08:00",
        tipo: "entrada",
        metodo,
        validado: true,
      });
    }

    const registros = await db
      .select()
      .from(pontoRegistros)
      .where(eq(pontoRegistros.colaboradorId, colabId));

    expect(registros.length).toBe(5);
    const metodosRegistrados = registros.map((r) => r.metodo);
    for (const m of metodos) {
      expect(metodosRegistrados).toContain(m);
    }
  });
});

// =============================================
// TESTES DE INTEGRAÇÃO - FLUXO COMPLETO
// =============================================
describe("Integração: Fluxo Completo (Admissão → Ponto → Folha)", () => {
  let db: ReturnType<typeof drizzle> | null = null;
  const testIds: string[] = [];

  beforeAll(async () => {
    if (process.env.DATABASE_URL) {
      try {
        db = drizzle(process.env.DATABASE_URL);
      } catch {
        db = null;
      }
    }
  });

  afterAll(async () => {
    if (db && testIds.length > 0) {
      try {
        for (const id of testIds) {
          await db.delete(folhaPagamento).where(eq(folhaPagamento.colaboradorId, id));
          await db.delete(pontoRegistros).where(eq(pontoRegistros.colaboradorId, id));
          await db.delete(bancoHoras).where(eq(bancoHoras.colaboradorId, id));
          await db.delete(ferias).where(eq(ferias.colaboradorId, id));
          await db.delete(colaboradores).where(eq(colaboradores.id, id));
        }
      } catch (e) {
        console.warn("Erro ao limpar dados de teste:", e);
      }
    }
  });

  it("deve executar fluxo completo: admissão → registro de ponto → processamento de folha", async () => {
    if (!db) return;
    const colabId = genTestId();
    testIds.push(colabId);

    // 1. ADMISSÃO: Cadastrar colaborador
    await db.insert(colaboradores).values({
      id: colabId,
      nome: `${TEST_PREFIX}Fluxo Completo`,
      cpf: "999.888.777-66",
      dataAdmissao: new Date("2025-01-02"),
      cargo: "Desenvolvedor Full Stack",
      departamento: "Tecnologia",
      salarioBase: "8000.00",
      tipoContrato: "clt",
      jornadaSemanal: 44,
      regimeTrabalho: "presencial",
      status: "ativo",
    });

    const [colab] = await db
      .select()
      .from(colaboradores)
      .where(eq(colaboradores.id, colabId))
      .limit(1);

    expect(colab).toBeDefined();
    expect(colab.status).toBe("ativo");

    // 2. PONTO: Registrar 5 dias de trabalho (semana)
    const diasSemana = [
      "2025-03-03",
      "2025-03-04",
      "2025-03-05",
      "2025-03-06",
      "2025-03-07",
    ];

    for (const dia of diasSemana) {
      const batidas = [
        { hora: "08:00", tipo: "entrada" as const },
        { hora: "12:00", tipo: "intervalo_inicio" as const },
        { hora: "13:00", tipo: "intervalo_fim" as const },
        { hora: "17:00", tipo: "saida" as const },
      ];
      for (const b of batidas) {
        await db.insert(pontoRegistros).values({
          id: genTestId(),
          colaboradorId: colabId,
          dataRegistro: new Date(dia),
          horaRegistro: b.hora,
          tipo: b.tipo,
          metodo: "biometria",
          validado: true,
        });
      }
    }

    const registros = await db
      .select()
      .from(pontoRegistros)
      .where(eq(pontoRegistros.colaboradorId, colabId));

    expect(registros.length).toBe(20); // 5 dias x 4 batidas

    // 3. FOLHA: Processar folha de pagamento
    const salario = 8000.0;
    const inss = Math.min(salario * 0.14, 908.86);
    const baseIRRF = salario - inss;
    let irrf = 0;
    if (baseIRRF > 4664.68) irrf = baseIRRF * 0.275 - 896.0;
    else if (baseIRRF > 3751.06) irrf = baseIRRF * 0.225 - 662.77;
    else if (baseIRRF > 2826.66) irrf = baseIRRF * 0.15 - 381.44;
    else if (baseIRRF > 2259.21) irrf = baseIRRF * 0.075 - 169.44;
    if (irrf < 0) irrf = 0;
    const fgts = salario * 0.08;
    const liquido = salario - inss - irrf;

    const folhaId = genTestId();
    await db.insert(folhaPagamento).values({
      id: folhaId,
      colaboradorId: colabId,
      competencia: "2025-03",
      tipo: "mensal",
      salarioBruto: salario.toFixed(2),
      inss: inss.toFixed(2),
      irrf: irrf.toFixed(2),
      fgts: fgts.toFixed(2),
      salarioLiquido: liquido.toFixed(2),
      status: "processada",
    });

    const [folha] = await db
      .select()
      .from(folhaPagamento)
      .where(eq(folhaPagamento.id, folhaId))
      .limit(1);

    expect(folha).toBeDefined();
    expect(folha.status).toBe("processada");
    expect(parseFloat(folha.salarioBruto?.toString() || "0")).toBe(8000.0);

    // 4. BANCO DE HORAS: Registrar saldo
    const bhId = genTestId();
    await db.insert(bancoHoras).values({
      id: bhId,
      colaboradorId: colabId,
      competencia: "2025-03",
      saldoAnterior: "0.00",
      creditoHoras: "0.00",
      debitoHoras: "0.00",
      saldoAtual: "0.00",
    });

    const [bh] = await db
      .select()
      .from(bancoHoras)
      .where(eq(bancoHoras.id, bhId))
      .limit(1);

    expect(bh).toBeDefined();
    expect(parseFloat(bh.saldoAtual?.toString() || "0")).toBe(0);

    // 5. VERIFICAÇÃO FINAL: Tudo consistente
    const [colabFinal] = await db
      .select()
      .from(colaboradores)
      .where(eq(colaboradores.id, colabId))
      .limit(1);

    expect(colabFinal.status).toBe("ativo");
    expect(colabFinal.nome).toContain("Fluxo Completo");
  });
});
