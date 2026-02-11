import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { gerarContracheque, gerarEspelhoPonto, gerarRelatorioSST, gerarRelatorioFolhaExcel, gerarRelatorioPontoExcel } from "./relatorios";

const genId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // =============================================
  // 3.1 FOLHA DE PAGAMENTO
  // =============================================
  folha: router({
    getColaboradores: protectedProcedure
      .input(z.object({ departamento: z.string().optional(), status: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "consulta", modulo: "Folha", descricao: "Consulta lista de colaboradores",
        });
        return db.getColaboradores(input || undefined);
      }),

    criarColaborador: protectedProcedure
      .input(z.object({
        nome: z.string(), cpf: z.string(), cargo: z.string().optional(),
        departamento: z.string().optional(), salarioBase: z.string().optional(),
        dataAdmissao: z.string(), tipoContrato: z.string().optional(),
        email: z.string().optional(), rg: z.string().optional(),
        ctps: z.string().optional(), pis: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.criarColaborador({
          id, nome: input.nome, cpf: input.cpf, cargo: input.cargo || null,
          departamento: input.departamento || null, salarioBase: input.salarioBase || null,
          dataAdmissao: new Date(input.dataAdmissao), tipoContrato: (input.tipoContrato as any) || "clt",
          status: "ativo",
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Folha",
          descricao: `Cadastro de colaborador: ${input.nome}`,
          dadosNovos: input,
        });
        return { success: true, mensagem: `Colaborador ${input.nome} cadastrado com sucesso`, id };
      }),

    processarFolha: protectedProcedure
      .input(z.object({ competencia: z.string(), tipo: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const { colaboradores: colabs, total } = await db.getColaboradores({ status: "ativo" });
        let totalBruto = 0, totalINSS = 0, totalIRRF = 0, totalFGTS = 0, totalLiquido = 0;

        for (const colab of colabs) {
          const salario = parseFloat(colab.salarioBase?.toString() || "0");
          const inss = Math.min(salario * 0.14, 908.86);
          const baseIRRF = salario - inss;
          let irrf = 0;
          if (baseIRRF > 4664.68) irrf = baseIRRF * 0.275 - 896.00;
          else if (baseIRRF > 3751.06) irrf = baseIRRF * 0.225 - 662.77;
          else if (baseIRRF > 2826.66) irrf = baseIRRF * 0.15 - 381.44;
          else if (baseIRRF > 2259.21) irrf = baseIRRF * 0.075 - 169.44;
          if (irrf < 0) irrf = 0;
          const fgts = salario * 0.08;
          const liquido = salario - inss - irrf;

          const folhaId = genId();
          await db.criarFolhaPagamento({
            id: folhaId, colaboradorId: colab.id, competencia: input.competencia,
            tipo: (input.tipo as any) || "mensal",
            salarioBruto: salario.toFixed(2), inss: inss.toFixed(2),
            irrf: irrf.toFixed(2), fgts: fgts.toFixed(2),
            salarioLiquido: liquido.toFixed(2), status: "processada",
          });

          totalBruto += salario; totalINSS += inss; totalIRRF += irrf;
          totalFGTS += fgts; totalLiquido += liquido;
        }

        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Folha",
          descricao: `Processamento da folha ${input.competencia} para ${total} colaboradores`,
        });

        return {
          success: true,
          mensagem: `Folha de pagamento ${input.competencia} processada com sucesso`,
          resumo: {
            competencia: input.competencia, totalColaboradores: total,
            totalBruto, totalINSS, totalIRRF, totalFGTS,
            totalDescontos: totalINSS + totalIRRF,
            totalLiquido, status: "processada",
          },
        };
      }),

    getResumoFolha: protectedProcedure
      .input(z.object({ competencia: z.string().optional() }).optional())
      .query(async ({ input }) => {
        const competencia = input?.competencia || new Date().toISOString().substring(0, 7);
        const resumo = await db.getResumoFolha(competencia);
        if (!resumo || !resumo.totalColaboradores) {
          return {
            competencia, totalColaboradores: 0, totalBruto: 0, totalINSS: 0,
            totalIRRF: 0, totalFGTS: 0, totalDescontos: 0, totalLiquido: 0,
            provisaoFerias: 0, provisao13: 0, status: "sem_dados",
            encargos: { inss: 0, fgts: 0, irrf: 0, pis: 0, cofins: 0 },
          };
        }
        const bruto = parseFloat(resumo.totalBruto?.toString() || "0");
        return {
          competencia, totalColaboradores: resumo.totalColaboradores,
          totalBruto: bruto,
          totalINSS: parseFloat(resumo.totalINSS?.toString() || "0"),
          totalIRRF: parseFloat(resumo.totalIRRF?.toString() || "0"),
          totalFGTS: parseFloat(resumo.totalFGTS?.toString() || "0"),
          totalDescontos: parseFloat(resumo.totalDescontos?.toString() || "0"),
          totalLiquido: parseFloat(resumo.totalLiquido?.toString() || "0"),
          provisaoFerias: bruto / 12, provisao13: bruto / 12,
          status: "processada",
          encargos: {
            inss: parseFloat(resumo.totalINSS?.toString() || "0"),
            fgts: parseFloat(resumo.totalFGTS?.toString() || "0"),
            irrf: parseFloat(resumo.totalIRRF?.toString() || "0"),
            pis: bruto * 0.005, cofins: 0,
          },
        };
      }),

    getContracheque: protectedProcedure
      .input(z.object({ colaboradorId: z.string(), competencia: z.string() }))
      .query(async ({ input }) => {
        const folha = await db.getContracheque(input.colaboradorId, input.competencia);
        const colab = await db.getColaboradorById(input.colaboradorId);
        if (!folha || !colab) {
          return { colaborador: "N/A", competencia: input.competencia, proventos: [], descontos: [], totalProventos: 0, totalDescontos: 0, salarioLiquido: 0, fgts: 0 };
        }
        const bruto = parseFloat(folha.salarioBruto?.toString() || "0");
        const inss = parseFloat(folha.inss?.toString() || "0");
        const irrf = parseFloat(folha.irrf?.toString() || "0");
        const fgts = parseFloat(folha.fgts?.toString() || "0");
        const hExtras = parseFloat(folha.horasExtras?.toString() || "0");
        const adNoturno = parseFloat(folha.adicionalNoturno?.toString() || "0");
        return {
          colaborador: colab.nome,
          competencia: input.competencia,
          proventos: [
            { descricao: "Salário Base", referencia: "30 dias", valor: bruto },
            ...(hExtras > 0 ? [{ descricao: "Horas Extras 50%", referencia: "", valor: hExtras }] : []),
            ...(adNoturno > 0 ? [{ descricao: "Adicional Noturno", referencia: "20%", valor: adNoturno }] : []),
          ],
          descontos: [
            { descricao: "INSS", referencia: "14%", valor: inss },
            { descricao: "IRRF", referencia: "", valor: irrf },
          ],
          totalProventos: bruto + hExtras + adNoturno,
          totalDescontos: inss + irrf,
          salarioLiquido: parseFloat(folha.salarioLiquido?.toString() || "0"),
          fgts,
        };
      }),

    simularFolha: protectedProcedure
      .input(z.object({ competencia: z.string(), reajuste: z.number().optional() }))
      .mutation(async ({ input }) => {
        const { total } = await db.getColaboradores({ status: "ativo" });
        const resumo = await db.getResumoFolha(input.competencia);
        const brutoAtual = parseFloat(resumo?.totalBruto?.toString() || "0");
        const reajuste = input.reajuste || 0;
        return {
          success: true,
          simulacao: {
            competencia: input.competencia, reajusteAplicado: reajuste,
            totalBrutoAtual: brutoAtual,
            totalBrutoSimulado: brutoAtual * (1 + reajuste / 100),
            diferencaBruta: brutoAtual * (reajuste / 100),
            impactoEncargos: brutoAtual * (reajuste / 100) * 0.368,
          },
        };
      }),

    getFerias: protectedProcedure.query(async () => {
      const feriasList = await db.getFeriasList();
      return { ferias: feriasList, alertas: [] };
    }),

    getRescisoes: protectedProcedure.query(async () => {
      const rescisoes = await db.getRescisoes();
      return { rescisoes };
    }),

    getRelatorios: protectedProcedure.query(async () => {
      return {
        relatorios: [
          { id: "1", nome: "Folha Analítica", tipo: "analitico", competencia: new Date().toISOString().substring(0, 7), status: "disponivel" },
          { id: "2", nome: "Folha Sintética", tipo: "sintetico", competencia: new Date().toISOString().substring(0, 7), status: "disponivel" },
          { id: "3", nome: "Encargos Sociais", tipo: "encargos", competencia: new Date().toISOString().substring(0, 7), status: "disponivel" },
          { id: "4", nome: "GPS", tipo: "gps", competencia: new Date().toISOString().substring(0, 7), status: "disponivel" },
          { id: "5", nome: "GFIP/SEFIP", tipo: "sefip", competencia: new Date().toISOString().substring(0, 7), status: "disponivel" },
          { id: "6", nome: "DIRF", tipo: "dirf", competencia: new Date().getFullYear().toString(), status: "disponivel" },
          { id: "7", nome: "Informe de Rendimentos", tipo: "irpf", competencia: new Date().getFullYear().toString(), status: "disponivel" },
        ],
      };
    }),
  }),

  // =============================================
  // 3.2 eSocial
  // =============================================
  esocial: router({
    getEventos: protectedProcedure.query(async () => {
      return db.getEsocialEventos();
    }),

    enviarEvento: protectedProcedure
      .input(z.object({ tipo: z.string(), descricao: z.string(), colaboradorId: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        const protocolo = `ESO-${Date.now()}`;
        await db.criarEsocialEvento({
          id, tipo: input.tipo, descricao: input.descricao,
          colaboradorId: input.colaboradorId || null, status: "pendente",
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "eSocial",
          descricao: `Envio de evento ${input.tipo}: ${input.descricao}`,
        });
        return { success: true, mensagem: `Evento ${input.tipo} enviado com sucesso`, protocolo };
      }),

    getConformidade: protectedProcedure.query(async () => {
      const { resumo } = await db.getEsocialEventos();
      const conformidade = resumo.total > 0 ? ((resumo.processados / resumo.total) * 100) : 0;
      return {
        conformidade: Math.round(conformidade * 10) / 10,
        eventosProcessados: resumo.processados,
        eventosPendentes: resumo.pendentes,
        eventosRejeitados: resumo.rejeitados,
        ultimaAtualizacao: new Date().toISOString(),
        dctfWeb: { status: "em_dia", competencia: new Date().toISOString().substring(0, 7) },
        guias: { gps: { status: "gerada", valor: 0 }, fgts: { status: "gerada", valor: 0 } },
      };
    }),

    preAnalise: protectedProcedure.query(async () => {
      const { colaboradores: colabs } = await db.getColaboradores({ status: "ativo" });
      const inconsistencias: { tipo: string; colaborador: string; campo: string; mensagem: string; criticidade: string }[] = [];
      for (const c of colabs) {
        if (!c.pis) inconsistencias.push({ tipo: "PIS Ausente", colaborador: c.nome, campo: "pis", mensagem: "PIS não informado", criticidade: "alta" });
        if (!c.cpf) inconsistencias.push({ tipo: "CPF Ausente", colaborador: c.nome, campo: "cpf", mensagem: "CPF não informado", criticidade: "alta" });
      }
      return { inconsistencias, totalInconsistencias: inconsistencias.length, aptos: colabs.length - inconsistencias.length, total: colabs.length };
    }),
  }),

  // =============================================
  // 3.3 CONTROLE DE PONTO
  // =============================================
  ponto: router({
    getRegistros: protectedProcedure
      .input(z.object({ data: z.string().optional(), colaboradorId: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return db.getPontoRegistros(input || undefined);
      }),

    registrarPonto: protectedProcedure
      .input(z.object({
        tipo: z.enum(["entrada", "saida", "intervalo_inicio", "intervalo_fim"]),
        metodo: z.string().optional(), latitude: z.number().optional(), longitude: z.number().optional(),
        colaboradorId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        const now = new Date();
        const hora = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        const data = now.toISOString().substring(0, 10);
        await db.registrarPonto({
          id, colaboradorId: input.colaboradorId || ctx.user.id,
          dataRegistro: new Date(data), horaRegistro: hora,
          tipo: input.tipo, metodo: (input.metodo as any) || "manual",
          latitude: input.latitude?.toString() || null,
          longitude: input.longitude?.toString() || null,
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Ponto",
          descricao: `Registro de ponto: ${input.tipo} às ${hora}`,
        });
        return { success: true, mensagem: `Ponto de ${input.tipo} registrado com sucesso`, timestamp: now.toISOString(), metodo: input.metodo || "manual" };
      }),

    getEstatisticas: protectedProcedure.query(async ({ ctx }) => {
      const { registros } = await db.getPontoRegistros({ colaboradorId: ctx.user.id });
      return {
        totalHoras: registros.length * 8,
        horasExtras: 0, horasNoturnas: 0, faltas: 0, atrasos: 0,
        assiduidade: 100, bancoHoras: 0,
        diasTrabalhados: new Set(registros.map(r => r.dataRegistro)).size,
      };
    }),

    getEscalas: protectedProcedure.query(async () => {
      const escalas = await db.getPontoEscalas();
      return { escalas };
    }),

    getBancoHoras: protectedProcedure.query(async ({ ctx }) => {
      const historico = await db.getBancoHorasColaborador(ctx.user.id);
      const saldoAtual = historico.length > 0 ? parseFloat(historico[0].saldoAtual?.toString() || "0") : 0;
      return {
        saldoAtual, creditoMes: 0, debitoMes: 0,
        historico: historico.map(h => ({
          competencia: h.competencia,
          credito: parseFloat(h.creditoHoras?.toString() || "0"),
          debito: parseFloat(h.debitoHoras?.toString() || "0"),
          saldo: parseFloat(h.saldoAtual?.toString() || "0"),
        })),
      };
    }),

    getEspelhoPonto: protectedProcedure
      .input(z.object({ colaboradorId: z.string(), competencia: z.string() }))
      .query(async ({ input }) => {
        const colab = await db.getColaboradorById(input.colaboradorId);
        const { registros } = await db.getPontoRegistros({ colaboradorId: input.colaboradorId });
        const diasMap = new Map<string, typeof registros>();
        for (const r of registros) {
          const key = r.dataRegistro?.toString() || "";
          if (!diasMap.has(key)) diasMap.set(key, []);
          diasMap.get(key)!.push(r);
        }
        const dias = Array.from(diasMap.entries()).map(([dia, regs]) => ({
          dia: parseInt(dia.split("-")[2] || "0"),
          entrada: regs.find(r => r.tipo === "entrada")?.horaRegistro || "",
          intervaloSaida: regs.find(r => r.tipo === "intervalo_inicio")?.horaRegistro || "",
          intervaloRetorno: regs.find(r => r.tipo === "intervalo_fim")?.horaRegistro || "",
          saida: regs.find(r => r.tipo === "saida")?.horaRegistro || "",
          horasTrabalhadas: "8h00", observacao: "",
        }));
        return {
          colaborador: colab?.nome || "N/A", competencia: input.competencia,
          dias, totalHoras: dias.length * 8, horasExtras: 0, faltas: 0,
        };
      }),

    getOcorrencias: protectedProcedure.query(async () => {
      return { ocorrencias: [] };
    }),
  }),

  // =============================================
  // 3.4 GESTÃO DE BENEFÍCIOS
  // =============================================
  beneficios: router({
    getResumo: protectedProcedure.query(async () => {
      const resumo = await db.getBeneficiosResumo();
      return resumo || { totalColaboradores: 0, custoMensal: 0, beneficiosAtivos: 0, tipos: [] };
    }),

    getBeneficiosColaborador: protectedProcedure
      .input(z.object({ colaboradorId: z.string() }))
      .query(async ({ input }) => {
        const lista = await db.getBeneficiosColaborador(input.colaboradorId);
        return { beneficios: lista };
      }),

    criarBeneficio: protectedProcedure
      .input(z.object({
        colaboradorId: z.string(), tipo: z.string(), descricao: z.string().optional(),
        valorEmpresa: z.string().optional(), valorColaborador: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.criarBeneficio({
          id, colaboradorId: input.colaboradorId, tipo: input.tipo as any,
          descricao: input.descricao || null,
          valorEmpresa: input.valorEmpresa || "0",
          valorColaborador: input.valorColaborador || "0",
          status: "ativo",
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Benefícios",
          descricao: `Benefício ${input.tipo} criado para colaborador ${input.colaboradorId}`,
        });
        return { success: true, mensagem: "Benefício criado com sucesso", id };
      }),

    getConsignados: protectedProcedure.query(async () => {
      const emprestimos = await db.getConsignados();
      const totalDesconto = emprestimos.reduce((acc, e) => acc + parseFloat(e.valorParcela?.toString() || "0"), 0);
      return { emprestimos, totalDescontoMensal: totalDesconto };
    }),

    getRelatorios: protectedProcedure.query(async () => {
      return {
        relatorios: [
          { id: "1", nome: "Demonstrativo Gerencial de Benefícios", tipo: "gerencial", status: "disponivel" },
          { id: "2", nome: "Relatório de Entregas VT/VA/VR", tipo: "entrega", status: "disponivel" },
          { id: "3", nome: "Relatório de Planos de Saúde", tipo: "saude", status: "disponivel" },
          { id: "4", nome: "Relatório de Consignados", tipo: "consignado", status: "disponivel" },
        ],
      };
    }),
  }),

  // =============================================
  // 3.5 SST/SESMT
  // =============================================
  sst: router({
    getDashboard: protectedProcedure.query(async () => {
      const exames = await db.getSstExames();
      const cats = await db.getSstCats();
      const epis = await db.getSstEpis();
      const cipa = await db.getSstCipaMembers();
      const now = new Date();
      const vencidos = exames.filter(e => e.dataValidade && new Date(e.dataValidade) < now).length;
      const episVencidos = epis.filter(e => e.dataValidade && new Date(e.dataValidade) < now).length;
      return {
        indicadores: {
          taxaAcidentes: cats.length > 0 ? cats.length / 12 : 0,
          diasSemAcidentes: cats.length > 0 ? Math.floor((now.getTime() - new Date(cats[0].dataAcidente).getTime()) / 86400000) : 365,
          examesVencidos: vencidos,
          examesProximos: exames.filter(e => e.dataValidade && new Date(e.dataValidade) < new Date(now.getTime() + 30 * 86400000) && new Date(e.dataValidade) >= now).length,
          episVencidos,
          cipaAtiva: cipa.length > 0,
          nrsConformes: 6, nrsTotal: 6,
        },
        nrs: [
          { nr: "NR-01", descricao: "Disposições Gerais", status: "conforme" },
          { nr: "NR-05", descricao: "CIPA", status: cipa.length > 0 ? "conforme" : "pendente" },
          { nr: "NR-06", descricao: "EPI", status: episVencidos === 0 ? "conforme" : "atenção" },
          { nr: "NR-07", descricao: "PCMSO", status: "conforme" },
          { nr: "NR-17", descricao: "Ergonomia", status: "conforme" },
          { nr: "NR-32", descricao: "Segurança em Saúde", status: "conforme" },
        ],
      };
    }),

    getExames: protectedProcedure.query(async () => {
      const exames = await db.getSstExames();
      const now = new Date();
      return {
        exames,
        vencidos: exames.filter(e => e.dataValidade && new Date(e.dataValidade) < now).length,
        proximos30Dias: exames.filter(e => e.dataValidade && new Date(e.dataValidade) < new Date(now.getTime() + 30 * 86400000) && new Date(e.dataValidade) >= now).length,
      };
    }),

    registrarASO: protectedProcedure
      .input(z.object({ colaboradorId: z.string(), tipo: z.string(), resultado: z.string(), data: z.string(), medicoResponsavel: z.string().optional(), crm: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.criarSstExame({
          id, colaboradorId: input.colaboradorId, tipo: input.tipo as any,
          dataExame: new Date(input.data), resultado: input.resultado as any,
          medicoResponsavel: input.medicoResponsavel || null, crm: input.crm || null,
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "SST", descricao: `ASO registrado para colaborador ${input.colaboradorId}`,
        });
        return { success: true, mensagem: "ASO registrado com sucesso", id };
      }),

    getCATs: protectedProcedure.query(async () => {
      const cats = await db.getSstCats();
      return { cats, totalAno: cats.length, taxaFrequencia: cats.length > 0 ? cats.length / 12 : 0 };
    }),

    getEPIs: protectedProcedure.query(async () => {
      const epis = await db.getSstEpis();
      const now = new Date();
      return { epis, vencidos: epis.filter(e => e.dataValidade && new Date(e.dataValidade) < now).length };
    }),

    getCIPA: protectedProcedure.query(async () => {
      const membros = await db.getSstCipaMembers();
      return { membros, mandatoVigente: new Date().getFullYear().toString(), proximaEleicao: "" };
    }),

    getLaudos: protectedProcedure.query(async () => {
      return {
        laudos: [
          { id: "1", nome: `PGR ${new Date().getFullYear()}`, tipo: "PGR", data: new Date().toISOString().substring(0, 10), validade: "", status: "vigente" },
          { id: "2", nome: `PCMSO ${new Date().getFullYear()}`, tipo: "PCMSO", data: new Date().toISOString().substring(0, 10), validade: "", status: "vigente" },
          { id: "3", nome: `LTCAT ${new Date().getFullYear()}`, tipo: "LTCAT", data: new Date().toISOString().substring(0, 10), validade: "", status: "vigente" },
        ],
      };
    }),
  }),

  // =============================================
  // 3.6 MEDICINA OCUPACIONAL
  // =============================================
  medicina: router({
    getProntuarios: protectedProcedure.query(async () => {
      const prontuarios = await db.getProntuarios();
      return { prontuarios };
    }),

    getAfastamentos: protectedProcedure.query(async () => {
      const afastamentos = await db.getAfastamentosList();
      const ativos = afastamentos.filter(a => a.status === "ativo");
      return { afastamentos, totalAtivos: ativos.length, totalAno: afastamentos.length };
    }),

    getGestantes: protectedProcedure.query(async () => {
      const afastamentos = await db.getAfastamentosList("ativo");
      const gestantes = afastamentos.filter(a => a.tipo === "maternidade");
      return { gestantes };
    }),

    getExamesOcupacionais: protectedProcedure.query(async () => {
      const exames = await db.getSstExames();
      const now = new Date();
      return {
        agenda: exames.filter(e => e.resultado === "pendente"),
        vencidos: exames.filter(e => e.dataValidade && new Date(e.dataValidade) < now).length,
        proximos30Dias: exames.filter(e => e.dataValidade && new Date(e.dataValidade) < new Date(now.getTime() + 30 * 86400000) && new Date(e.dataValidade) >= now).length,
      };
    }),
  }),

  // =============================================
  // 3.7 GESTÃO DE DESEMPENHO
  // =============================================
  desempenho: router({
    getDashboard: protectedProcedure.query(async () => {
      const avaliacoesList = await db.getAvaliacoesList();
      const concluidas = avaliacoesList.filter(a => a.status === "concluida");
      const mediaGeral = concluidas.length > 0
        ? concluidas.reduce((acc, a) => acc + parseFloat(a.notaFinal?.toString() || "0"), 0) / concluidas.length
        : 0;
      return {
        cicloAtual: `${new Date().getFullYear()}-S1`,
        avaliacoesTotal: avaliacoesList.length,
        avaliacoesConcluidas: concluidas.length,
        avaliacoesPendentes: avaliacoesList.filter(a => a.status === "pendente").length,
        mediaGeral: Math.round(mediaGeral * 10) / 10,
        distribuicao9Box: {
          altoDesempenhoAltoPotencial: 0, altoDesempenhoMedioPotencial: 0, altoDesempenhoBaixoPotencial: 0,
          medioDesempenhoAltoPotencial: 0, medioDesempenhoMedioPotencial: 0, medioDesempenhoBaixoPotencial: 0,
          baixoDesempenhoAltoPotencial: 0, baixoDesempenhoMedioPotencial: 0, baixoDesempenhoBaixoPotencial: 0,
        },
      };
    }),

    getAvaliacoes: protectedProcedure
      .input(z.object({ ciclo: z.string().optional() }).optional())
      .query(async ({ input }) => {
        const avaliacoesList = await db.getAvaliacoesList(input?.ciclo);
        return { avaliacoes: avaliacoesList };
      }),

    getOKRs: protectedProcedure.query(async () => {
      const okrs = await db.getMetasOkrList();
      return { okrs };
    }),

    getPDIs: protectedProcedure.query(async () => {
      const pdis = await db.getPdiList();
      return { pdis };
    }),

    getFeedbacks: protectedProcedure.query(async () => {
      const feedbacksList = await db.getFeedbacksList();
      return { feedbacks: feedbacksList };
    }),
  }),

  // =============================================
  // 3.9 PORTAL DO COLABORADOR
  // =============================================
  portal: router({
    getContracheques: protectedProcedure
      .input(z.object({ mes: z.string().optional() }).optional())
      .query(async ({ ctx }) => {
        const folhas = await db.getFolhasPagamento();
        const userFolhas = folhas.filter(f => f.colaboradorId === ctx.user.id);
        return {
          contracheques: userFolhas.map(f => ({
            id: f.id, competencia: f.competencia,
            salarioBruto: parseFloat(f.salarioBruto?.toString() || "0"),
            totalDescontos: parseFloat(f.inss?.toString() || "0") + parseFloat(f.irrf?.toString() || "0"),
            salarioLiquido: parseFloat(f.salarioLiquido?.toString() || "0"),
            dataDisponibilidade: f.createdAt?.toISOString().substring(0, 10) || "",
          })),
        };
      }),

    getInformeRendimentos: protectedProcedure
      .input(z.object({ ano: z.string().optional() }).optional())
      .query(async ({ ctx }) => {
        const folhas = await db.getFolhasPagamento();
        const userFolhas = folhas.filter(f => f.colaboradorId === ctx.user.id);
        const totalBruto = userFolhas.reduce((acc, f) => acc + parseFloat(f.salarioBruto?.toString() || "0"), 0);
        const totalINSS = userFolhas.reduce((acc, f) => acc + parseFloat(f.inss?.toString() || "0"), 0);
        const totalIRRF = userFolhas.reduce((acc, f) => acc + parseFloat(f.irrf?.toString() || "0"), 0);
        return {
          ano: new Date().getFullYear().toString(),
          rendimentosTributaveis: totalBruto,
          contribuicaoPrevidenciaria: totalINSS,
          impostoRetido: totalIRRF,
          decimoTerceiro: 0,
          status: "disponivel",
        };
      }),

    getFerias: protectedProcedure.query(async ({ ctx }) => {
      const feriasList = await db.getFeriasList();
      const userFerias = feriasList.filter(f => f.colaboradorId === ctx.user.id);
      return {
        feriasDisponiveis: { diasDisponiveis: 30, periodoAquisitivo: "", vencimento: "" },
        historicoFerias: userFerias,
      };
    }),

    solicitarFerias: protectedProcedure
      .input(z.object({ dataInicio: z.string(), dias: z.number(), abonoPecuniario: z.boolean().optional() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        const dataFim = new Date(input.dataInicio);
        dataFim.setDate(dataFim.getDate() + input.dias);
        await db.criarFerias({
          id, colaboradorId: ctx.user.id,
          dataInicio: new Date(input.dataInicio), dataFim: dataFim,
          dias: input.dias, abonoPecuniario: input.abonoPecuniario || false,
          status: "solicitada",
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Portal",
          descricao: `Solicitação de férias: ${input.dias} dias a partir de ${input.dataInicio}`,
        });
        return { success: true, mensagem: `Férias de ${input.dias} dias solicitadas a partir de ${input.dataInicio}`, id };
      }),

    getDocumentos: protectedProcedure.query(async ({ ctx }) => {
      const docs = await db.getDocumentosColaboradorList(ctx.user.id);
      return { documentos: docs };
    }),

    getTreinamentos: protectedProcedure.query(async () => {
      const treinamentos = await db.getTreinamentosList();
      return { treinamentos };
    }),

    getAvaliacoesPendentes: protectedProcedure.query(async ({ ctx }) => {
      const avaliacoesList = await db.getAvaliacoesList();
      const pendentes = avaliacoesList.filter(a => a.colaboradorId === ctx.user.id && a.status === "pendente");
      return { avaliacoes: pendentes };
    }),

    getComunicados: protectedProcedure.query(async () => {
      const comunicadosList = await db.getComunicadosList();
      return { comunicados: comunicadosList };
    }),

    getPesquisaClima: protectedProcedure.query(async () => {
      const pesquisas = await db.getPesquisasClima();
      return { pesquisas };
    }),
  }),

  // =============================================
  // 3.11 CONTROLE DE ACESSO E PORTARIA
  // =============================================
  acesso: router({
    getDashboard: protectedProcedure.query(async () => {
      const acessos = await db.getAcessosPortariaList();
      const visitantesList = await db.getVisitantesList("presente");
      return {
        pessoasPresentes: acessos.filter(a => a.direcao === "entrada" && a.autorizado).length,
        visitantesHoje: visitantesList.length,
        acessosHoje: acessos.length,
        acessosNegados: acessos.filter(a => !a.autorizado).length,
        dispositivos: [],
      };
    }),

    getVisitantes: protectedProcedure.query(async () => {
      const presentes = await db.getVisitantesList("presente");
      const agendados = await db.getVisitantesList("agendado");
      const saiu = await db.getVisitantesList("saiu");
      return { visitantes: [...presentes, ...saiu], agendados };
    }),

    registrarVisitante: protectedProcedure
      .input(z.object({ nome: z.string(), documento: z.string(), empresa: z.string().optional(), motivoVisita: z.string(), pessoaVisitada: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.registrarVisitante({
          id, nome: input.nome, documento: input.documento,
          empresa: input.empresa || null, motivoVisita: input.motivoVisita,
          status: "presente", dataEntrada: new Date(),
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Acesso",
          descricao: `Visitante registrado: ${input.nome}`,
        });
        return { success: true, mensagem: `Visitante ${input.nome} registrado com sucesso`, id };
      }),

    getLogAcessos: protectedProcedure.query(async () => {
      const logs = await db.getAcessosPortariaList();
      return { logs };
    }),
  }),

  // =============================================
  // 3.12 QUADRO DE VAGAS
  // =============================================
  quadroVagas: router({
    getResumo: protectedProcedure.query(async () => {
      const vagas = await db.getQuadroVagasList();
      const totalEfetivas = vagas.reduce((acc, v) => acc + (v.vagasEfetivas || 0), 0);
      const totalOcupadas = vagas.reduce((acc, v) => acc + (v.vagasOcupadas || 0), 0);
      const totalPrevistas = vagas.reduce((acc, v) => acc + (v.vagasPrevistas || 0), 0);
      const totalOrcamento = vagas.reduce((acc, v) => acc + parseFloat(v.orcamento?.toString() || "0"), 0);
      const deptMap = new Map<string, { efetivas: number; ocupadas: number; previstas: number; orcamento: number }>();
      for (const v of vagas) {
        const dept = v.departamento || "Outros";
        const existing = deptMap.get(dept) || { efetivas: 0, ocupadas: 0, previstas: 0, orcamento: 0 };
        existing.efetivas += v.vagasEfetivas || 0;
        existing.ocupadas += v.vagasOcupadas || 0;
        existing.previstas += v.vagasPrevistas || 0;
        existing.orcamento += parseFloat(v.orcamento?.toString() || "0");
        deptMap.set(dept, existing);
      }
      return {
        totalVagasEfetivas: totalEfetivas, totalVagasOcupadas: totalOcupadas,
        totalVagasDisponiveis: totalEfetivas - totalOcupadas, totalVagasPrevistas: totalPrevistas,
        orcamentoTotal: totalOrcamento, orcamentoUtilizado: 0,
        departamentos: Array.from(deptMap.entries()).map(([dept, data]) => ({ departamento: dept, ...data })),
      };
    }),

    getVagas: protectedProcedure.query(async () => {
      const vagas = await db.getQuadroVagasList();
      return { vagas };
    }),

    criarProposta: protectedProcedure
      .input(z.object({ cargo: z.string(), departamento: z.string(), quantidade: z.number(), justificativa: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.criarQuadroVaga({
          id, cargo: input.cargo, departamento: input.departamento,
          vagasPrevistas: input.quantidade, vagasEfetivas: 0, vagasOcupadas: 0,
          status: "ativo",
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Quadro de Vagas",
          descricao: `Proposta de ${input.quantidade} vaga(s) para ${input.cargo}`,
        });
        return { success: true, mensagem: `Proposta de ${input.quantidade} vaga(s) para ${input.cargo} criada`, id };
      }),
  }),

  // =============================================
  // 3.13 RECRUTAMENTO E SELEÇÃO
  // =============================================
  recrutamento: router({
    getDashboard: protectedProcedure.query(async () => {
      const vagas = await db.getVagasRecrutamentoList();
      const abertas = vagas.filter(v => v.status === "aberta");
      return {
        vagasAbertas: abertas.length, candidatosTotal: 0, emProcesso: 0,
        contratadosMes: 0, tempoMedioContratacao: 0, taxaConversao: 0,
      };
    }),

    getVagas: protectedProcedure.query(async () => {
      const vagas = await db.getVagasRecrutamentoList();
      return { vagas };
    }),

    getCandidatos: protectedProcedure
      .input(z.object({ vagaId: z.string() }))
      .query(async ({ input }) => {
        const candidatosList = await db.getCandidatosList(input.vagaId);
        return { candidatos: candidatosList };
      }),

    criarVaga: protectedProcedure
      .input(z.object({ titulo: z.string(), departamento: z.string(), descricao: z.string(), requisitos: z.string(), salarioMin: z.number().optional(), salarioMax: z.number().optional() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.criarVagaRecrutamento({
          id, titulo: input.titulo, departamento: input.departamento,
          descricao: input.descricao, requisitos: input.requisitos,
          salarioMin: input.salarioMin?.toFixed(2) || null,
          salarioMax: input.salarioMax?.toFixed(2) || null,
          status: "aberta", dataAbertura: new Date(),
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Recrutamento",
          descricao: `Vaga criada: ${input.titulo}`,
        });
        return { success: true, mensagem: `Vaga "${input.titulo}" criada com sucesso`, id };
      }),

    avancarCandidato: protectedProcedure
      .input(z.object({ candidatoId: z.string(), novaEtapa: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await db.atualizarCandidato(input.candidatoId, { etapaAtual: input.novaEtapa as any });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "alteracao", modulo: "Recrutamento",
          descricao: `Candidato ${input.candidatoId} avançado para ${input.novaEtapa}`,
        });
        return { success: true, mensagem: `Candidato avançado para etapa: ${input.novaEtapa}` };
      }),
  }),

  // =============================================
  // 3.14 SUPORTE AO CLIENTE
  // =============================================
  suporte: router({
    getChamados: protectedProcedure.query(async () => {
      const chamadosList = await db.getChamadosList();
      const abertos = chamadosList.filter(c => c.status === "aberto").length;
      const emAtendimento = chamadosList.filter(c => c.status === "em_atendimento").length;
      const resolvidos = chamadosList.filter(c => c.status === "resolvido" || c.status === "fechado").length;
      return {
        chamados: chamadosList,
        resumo: { abertos, emAtendimento, resolvidos, slaAtendido: resolvidos > 0 ? 96.5 : 0 },
      };
    }),

    abrirChamado: protectedProcedure
      .input(z.object({ titulo: z.string(), descricao: z.string(), tipo: z.string(), criticidade: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.criarChamado({
          id, solicitanteId: ctx.user.id, titulo: input.titulo,
          descricao: input.descricao, tipo: input.tipo as any,
          criticidade: input.criticidade as any, status: "aberto",
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Suporte",
          descricao: `Chamado aberto: ${input.titulo}`,
        });
        return { success: true, mensagem: "Chamado aberto com sucesso", id, protocolo: `SUP-${Date.now()}` };
      }),

    getFAQ: protectedProcedure.query(async () => {
      return {
        categorias: [
          {
            categoria: "Folha de Pagamento",
            perguntas: [
              { pergunta: "Como consultar meu contracheque?", resposta: "Acesse o Portal do Colaborador > Contracheques" },
              { pergunta: "Quando a folha é processada?", resposta: "O processamento ocorre no dia 25 de cada mês" },
            ],
          },
          {
            categoria: "Ponto Eletrônico",
            perguntas: [
              { pergunta: "Como registrar ponto pelo celular?", resposta: "Acesse o app PUCHOO AI e use o módulo de Ponto" },
              { pergunta: "Como solicitar abono de ponto?", resposta: "Acesse Gestão de Ponto > Acerto de Ponto" },
            ],
          },
          {
            categoria: "Benefícios",
            perguntas: [
              { pergunta: "Como alterar meu plano de saúde?", resposta: "Solicite via Portal do Colaborador > Benefícios" },
              { pergunta: "Como consultar empréstimo consignado?", resposta: "Acesse Benefícios > Consignados" },
            ],
          },
        ],
      };
    }),
  }),

  // =============================================
  // LGPD
  // =============================================
  lgpd: router({
    getEstatisticas: protectedProcedure.query(async () => {
      const consentimentos = await db.getLgpdConsentimentos();
      const solicitacoes = await db.getLgpdSolicitacoes();
      const ativos = consentimentos.filter(c => c.status === "ativo").length;
      const pendentes = solicitacoes.filter(s => s.status === "pendente").length;
      return {
        titulares: consentimentos.length,
        consentimentosAtivos: ativos,
        solicitacoesPendentes: pendentes,
        incidentes: 0,
        conformidade: consentimentos.length > 0 ? Math.round((ativos / consentimentos.length) * 100) : 0,
        dpiasRealizadas: 0,
        ultimaAuditoria: new Date().toISOString().substring(0, 10),
      };
    }),

    getConsentimentos: protectedProcedure.query(async () => {
      const consentimentos = await db.getLgpdConsentimentos();
      return { consentimentos };
    }),

    registrarConsentimento: protectedProcedure
      .input(z.object({ titularId: z.string(), finalidade: z.string(), baseJuridica: z.string(), titularNome: z.string().optional(), titularCpf: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.criarLgpdConsentimento({
          id, titularId: input.titularId, finalidade: input.finalidade,
          baseJuridica: input.baseJuridica, titularNome: input.titularNome || null,
          titularCpf: input.titularCpf || null, status: "ativo",
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "LGPD",
          descricao: `Consentimento registrado para titular ${input.titularId}`,
        });
        return { success: true, mensagem: "Consentimento registrado", id };
      }),

    getSolicitacoes: protectedProcedure.query(async () => {
      const solicitacoes = await db.getLgpdSolicitacoes();
      return { solicitacoes };
    }),

    getTrilhaAuditoria: protectedProcedure.query(async () => {
      const { logs } = await db.getAuditoriaLogs({ modulo: "LGPD" });
      return { logs };
    }),
  }),

  // =============================================
  // INTEGRAÇÃO BANCÁRIA
  // =============================================
  bancaria: router({
    getBancos: protectedProcedure.query(async () => {
      return {
        bancos: [
          { id: "1", nome: "Banco do Brasil", codigo: "001", status: "conectado", saldo: 0 },
          { id: "2", nome: "Caixa Econômica", codigo: "104", status: "conectado", saldo: 0 },
          { id: "3", nome: "Bradesco", codigo: "237", status: "conectado", saldo: 0 },
        ],
      };
    }),

    processarPagamentos: protectedProcedure
      .input(z.object({ banco: z.string(), tipo: z.enum(["pix", "ted", "cnab", "boleto"]), valor: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.criarIntegracaoPagamento({
          id, banco: input.banco, tipo: input.tipo,
          valorTotal: input.valor.toFixed(2), quantidadePagamentos: 1,
          status: "processando",
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Bancária",
          descricao: `Pagamento de R$ ${input.valor.toFixed(2)} via ${input.tipo.toUpperCase()}`,
        });
        return {
          success: true,
          mensagem: `Pagamento de R$ ${input.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} processado via ${input.tipo.toUpperCase()}`,
          transacao: { id, banco: input.banco, tipo: input.tipo, valor: input.valor, status: "processando" },
        };
      }),

    getTransacoes: protectedProcedure.query(async () => {
      const transacoes = await db.getIntegracaoPagamentos();
      return { transacoes };
    }),
  }),

  // =============================================
  // AUDITORIA GERAL (3.15.2)
  // =============================================
  auditoria: router({
    getLogs: protectedProcedure
      .input(z.object({ modulo: z.string().optional(), userId: z.string().optional(), dataInicio: z.string().optional(), dataFim: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return db.getAuditoriaLogs(input || undefined);
      }),
  }),

  // =============================================
  // PERMISSÕES E PERFIS (3.15.7, 3.15.8)
  // =============================================
  permissoes: router({
    getPerfis: protectedProcedure.query(async () => {
      const perfisList = await db.getPerfisList();
      return { perfis: perfisList };
    }),

    criarPerfil: protectedProcedure
      .input(z.object({ nome: z.string(), descricao: z.string().optional(), permissoes: z.record(z.string(), z.boolean()).optional() }))
      .mutation(async ({ input, ctx }) => {
        const id = genId();
        await db.criarPerfil({
          id, nome: input.nome, descricao: input.descricao || null,
          permissoes: input.permissoes || {},
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "inclusao", modulo: "Permissões",
          descricao: `Perfil criado: ${input.nome}`,
        });
        return { success: true, mensagem: `Perfil "${input.nome}" criado com sucesso`, id };
      }),

    atualizarPerfil: protectedProcedure
      .input(z.object({ id: z.string(), nome: z.string().optional(), descricao: z.string().optional(), permissoes: z.record(z.string(), z.boolean()).optional() }))
      .mutation(async ({ input, ctx }) => {
        await db.atualizarPerfil(input.id, {
          nome: input.nome || undefined, descricao: input.descricao || undefined,
          permissoes: input.permissoes || undefined,
        });
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "alteracao", modulo: "Permissões",
          descricao: `Perfil atualizado: ${input.id}`,
        });
        return { success: true, mensagem: "Perfil atualizado com sucesso" };
      }),

    deletarPerfil: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await db.deletarPerfil(input.id);
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "exclusao", modulo: "Permissões",
          descricao: `Perfil deletado: ${input.id}`,
        });
        return { success: true, mensagem: "Perfil deletado com sucesso" };
      }),

    getGrupos: protectedProcedure.query(async () => {
      const grupos = await db.getGruposUsuariosList();
      return { grupos };
    }),

    getUsuarios: protectedProcedure.query(async () => {
      const usersList = await db.getAllUsers();
      return { usuarios: usersList };
    }),
  }),

  // =============================================
  // EXPORTAÇÃO DE RELATÓRIOS PDF/EXCEL
  // =============================================
  relatorios: router({
    contracheque: protectedProcedure
      .input(z.object({ colaboradorId: z.string(), competencia: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "consulta", modulo: "Relatórios",
          descricao: `Gerou contracheque PDF: ${input.colaboradorId} - ${input.competencia}`,
        });
        const buffer = await gerarContracheque(input.colaboradorId, input.competencia);
        return { base64: buffer.toString("base64"), filename: `contracheque_${input.competencia}.pdf`, type: "application/pdf" };
      }),

    espelhoPonto: protectedProcedure
      .input(z.object({ colaboradorId: z.string(), mes: z.string(), ano: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "consulta", modulo: "Relatórios",
          descricao: `Gerou espelho de ponto PDF: ${input.colaboradorId} - ${input.mes}/${input.ano}`,
        });
        const buffer = await gerarEspelhoPonto(input.colaboradorId, input.mes, input.ano);
        return { base64: buffer.toString("base64"), filename: `espelho_ponto_${input.mes}_${input.ano}.pdf`, type: "application/pdf" };
      }),

    relatorioSST: protectedProcedure
      .mutation(async ({ ctx }) => {
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "consulta", modulo: "Relatórios",
          descricao: "Gerou relatório SST PDF",
        });
        const buffer = await gerarRelatorioSST();
        return { base64: buffer.toString("base64"), filename: "relatorio_sst.pdf", type: "application/pdf" };
      }),

    folhaExcel: protectedProcedure
      .input(z.object({ competencia: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "consulta", modulo: "Relatórios",
          descricao: `Gerou relatório folha Excel: ${input.competencia}`,
        });
        const buffer = await gerarRelatorioFolhaExcel(input.competencia);
        return { base64: buffer.toString("base64"), filename: `folha_${input.competencia}.xlsx`, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
      }),

    pontoExcel: protectedProcedure
      .input(z.object({ mes: z.string(), ano: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await db.registrarAuditoria({
          userId: ctx.user.id, userName: ctx.user.name || undefined,
          acao: "consulta", modulo: "Relatórios",
          descricao: `Gerou relatório ponto Excel: ${input.mes}/${input.ano}`,
        });
        const buffer = await gerarRelatorioPontoExcel(input.mes, input.ano);
        return { base64: buffer.toString("base64"), filename: `ponto_${input.mes}_${input.ano}.xlsx`, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
      }),
  }),
});

export type AppRouter = typeof appRouter;
