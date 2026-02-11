import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { getDb } from "./db";
import { colaboradores, folhaPagamento, pontoRegistros, sstExames, sstAso, ferias } from "../drizzle/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// ============================================================
// PDF Generation Helpers
// ============================================================

function createPDFHeader(doc: PDFKit.PDFDocument, title: string, subtitle: string) {
  doc.fontSize(18).font("Helvetica-Bold").text("PUCHOO AI - Gestão de Pessoas", { align: "center" });
  doc.moveDown(0.3);
  doc.fontSize(14).font("Helvetica-Bold").text(title, { align: "center" });
  doc.moveDown(0.2);
  doc.fontSize(9).font("Helvetica").text(subtitle, { align: "center" });
  doc.moveDown(0.2);
  doc.fontSize(8).font("Helvetica").text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, { align: "center" });
  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);
}

function addTableRow(doc: PDFKit.PDFDocument, columns: string[], widths: number[], isHeader = false) {
  const startX = 50;
  const y = doc.y;
  if (isHeader) {
    doc.font("Helvetica-Bold").fontSize(8);
  } else {
    doc.font("Helvetica").fontSize(8);
  }
  let x = startX;
  columns.forEach((col, i) => {
    doc.text(col || "-", x, y, { width: widths[i], align: "left" });
    x += widths[i];
  });
  doc.moveDown(0.5);
  if (isHeader) {
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.3);
  }
}

// ============================================================
// Contracheque PDF
// ============================================================

export async function gerarContracheque(colaboradorId: string, competencia: string): Promise<Buffer> {
  const db = await getDb();
  const chunks: Buffer[] = [];

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  createPDFHeader(doc, "CONTRACHEQUE", `Competência: ${competencia}`);

  if (db) {
    const [colab] = await db.select().from(colaboradores).where(eq(colaboradores.id, colaboradorId)).limit(1);
    const folhas = await db.select().from(folhaPagamento)
      .where(and(eq(folhaPagamento.colaboradorId, colaboradorId), eq(folhaPagamento.competencia, competencia)));

    if (colab) {
      doc.fontSize(10).font("Helvetica-Bold").text("Dados do Colaborador");
      doc.moveDown(0.3);
      doc.fontSize(9).font("Helvetica");
      doc.text(`Nome: ${colab.nome}`);
      doc.text(`CPF: ${colab.cpf}`);
      doc.text(`Cargo: ${colab.cargo || "N/A"}`);
      doc.text(`Departamento: ${colab.departamento || "N/A"}`);
      doc.text(`PIS: ${colab.pis || "N/A"}`);  // matricula -> pis
      doc.moveDown(1);
    }

    doc.fontSize(10).font("Helvetica-Bold").text("Demonstrativo de Pagamento");
    doc.moveDown(0.5);

    const widths = [200, 80, 80, 80];
    addTableRow(doc, ["Descrição", "Referência", "Proventos", "Descontos"], widths, true);

    let totalProventos = 0;
    let totalDescontos = 0;

    if (folhas.length > 0) {
      const f = folhas[0];
      const salario = parseFloat(f.salarioBruto?.toString() || "0");
      const inss = parseFloat(f.inss?.toString() || "0");
      const irrf = parseFloat(f.irrf?.toString() || "0");
      const fgts = parseFloat(f.fgts?.toString() || "0");

      addTableRow(doc, ["Salário Base", "30 dias", salario.toFixed(2), ""], widths);
      totalProventos += salario;

      if (inss > 0) {
        addTableRow(doc, ["INSS", "", "", inss.toFixed(2)], widths);
        totalDescontos += inss;
      }
      if (irrf > 0) {
        addTableRow(doc, ["IRRF", "", "", irrf.toFixed(2)], widths);
        totalDescontos += irrf;
      }
      if (fgts > 0) {
        addTableRow(doc, ["FGTS (informativo)", "", fgts.toFixed(2), ""], widths);
      }
    } else {
      addTableRow(doc, ["Sem dados para esta competência", "", "", ""], widths);
    }

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.3);
    doc.fontSize(9).font("Helvetica-Bold");
    doc.text(`Total Proventos: R$ ${totalProventos.toFixed(2)}`, 50);
    doc.text(`Total Descontos: R$ ${totalDescontos.toFixed(2)}`, 50);
    doc.text(`Líquido: R$ ${(totalProventos - totalDescontos).toFixed(2)}`, 50);
  } else {
    doc.fontSize(10).text("Banco de dados não disponível. Dados de demonstração.");
  }

  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

// ============================================================
// Espelho de Ponto PDF
// ============================================================

export async function gerarEspelhoPonto(colaboradorId: string, mes: string, ano: string): Promise<Buffer> {
  const db = await getDb();
  const chunks: Buffer[] = [];

  const doc = new PDFDocument({ size: "A4", margin: 50, layout: "landscape" });
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  createPDFHeader(doc, "ESPELHO DE PONTO ELETRÔNICO", `Período: ${mes}/${ano} | Portaria 671/2021`);

  if (db) {
    const [colab] = await db.select().from(colaboradores).where(eq(colaboradores.id, colaboradorId)).limit(1);

    if (colab) {
      doc.fontSize(9).font("Helvetica");
      doc.text(`Colaborador: ${colab.nome} | CPF: ${colab.cpf} | Cargo: ${colab.cargo || "N/A"}`);
      doc.moveDown(0.5);
    }

    const dataInicio = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    const dataFim = new Date(parseInt(ano), parseInt(mes), 0);

    const registros = await db.select().from(pontoRegistros)
      .where(and(
        eq(pontoRegistros.colaboradorId, colaboradorId),
        gte(pontoRegistros.dataRegistro, dataInicio),
        lte(pontoRegistros.dataRegistro, dataFim)
      ))
      .orderBy(pontoRegistros.dataRegistro);

    const widths = [80, 70, 70, 70, 70, 70, 70, 80];
    addTableRow(doc, ["Data", "Entrada", "Saída Almoço", "Retorno", "Saída", "Horas Trab.", "Extras", "Status"], widths, true);

    if (registros.length > 0) {
      for (const r of registros) {
        const data = r.dataRegistro ? new Date(r.dataRegistro).toLocaleDateString("pt-BR") : "-";
        const entrada = r.tipo === "entrada" ? r.horaRegistro : "-";
        const saidaAlmoco = r.tipo === "intervalo_inicio" ? r.horaRegistro : "-";
        const retornoAlmoco = r.tipo === "intervalo_fim" ? r.horaRegistro : "-";
        const saida = r.tipo === "saida" ? r.horaRegistro : "-";
        const horasTrab = "-";
        const extras = "-";
        const status = r.tipo || "normal";
        addTableRow(doc, [data, entrada, saidaAlmoco, retornoAlmoco, saida, horasTrab, extras, status], widths);
      }
    } else {
      addTableRow(doc, ["Sem registros para o período", "", "", "", "", "", "", ""], widths);
    }

    doc.moveDown(1);
    doc.fontSize(8).font("Helvetica").text("Assinatura do Colaborador: ___________________________", 50);
    doc.moveDown(0.5);
    doc.text("Assinatura do Gestor: ___________________________", 50);
  }

  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

// ============================================================
// Relatório SST PDF
// ============================================================

export async function gerarRelatorioSST(): Promise<Buffer> {
  const db = await getDb();
  const chunks: Buffer[] = [];

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  createPDFHeader(doc, "RELATÓRIO DE SAÚDE E SEGURANÇA DO TRABALHO", "SST/SESMT - Conforme NRs e eSocial");

  if (db) {
    const exames = await db.select().from(sstExames).orderBy(desc(sstExames.createdAt)).limit(50);
    const asos = await db.select().from(sstAso).orderBy(desc(sstAso.createdAt)).limit(50);

    doc.fontSize(12).font("Helvetica-Bold").text("1. Exames Ocupacionais");
    doc.moveDown(0.5);

    const widthsExames = [120, 80, 80, 80, 80];
    addTableRow(doc, ["Colaborador", "Tipo", "Data", "Resultado", "Status"], widthsExames, true);

    for (const e of exames.slice(0, 20)) {
      addTableRow(doc, [
        e.colaboradorId?.substring(0, 15) || "-",
        e.tipo || "-",
        e.dataExame ? new Date(e.dataExame).toLocaleDateString("pt-BR") : "-",
        e.resultado || "-",
        e.resultado || "-",
      ], widthsExames);
    }

    doc.moveDown(1);
    doc.fontSize(12).font("Helvetica-Bold").text("2. ASOs Emitidos");
    doc.moveDown(0.5);

    const widthsAso = [120, 80, 80, 100, 80];
    addTableRow(doc, ["Colaborador", "Tipo", "Data", "Médico", "Aptidão"], widthsAso, true);

    for (const a of asos.slice(0, 20)) {
      addTableRow(doc, [
        a.colaboradorId?.substring(0, 15) || "-",
        a.tipo || "-",
        a.dataEmissao ? new Date(a.dataEmissao).toLocaleDateString("pt-BR") : "-",
        a.medicoResponsavel?.substring(0, 15) || "-",
        a.resultado || "-",
      ], widthsAso);
    }

    doc.moveDown(1);
    doc.fontSize(10).font("Helvetica-Bold").text("Resumo:");
    doc.fontSize(9).font("Helvetica");
    doc.text(`Total de exames: ${exames.length}`);
    doc.text(`Total de ASOs: ${asos.length}`);
  }

  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

// ============================================================
// Relatório Folha Excel
// ============================================================

export async function gerarRelatorioFolhaExcel(competencia: string): Promise<Buffer> {
  const db = await getDb();
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "PUCHOO AI";
  workbook.created = new Date();

  // Sheet 1: Folha de Pagamento
  const sheet = workbook.addWorksheet("Folha de Pagamento");
  sheet.columns = [
    { header: "Colaborador", key: "colaborador", width: 30 },
    { header: "CPF", key: "cpf", width: 15 },
    { header: "Cargo", key: "cargo", width: 20 },
    { header: "Departamento", key: "departamento", width: 20 },
    { header: "Salário Bruto", key: "bruto", width: 15, style: { numFmt: "#,##0.00" } },
    { header: "INSS", key: "inss", width: 12, style: { numFmt: "#,##0.00" } },
    { header: "IRRF", key: "irrf", width: 12, style: { numFmt: "#,##0.00" } },
    { header: "FGTS", key: "fgts", width: 12, style: { numFmt: "#,##0.00" } },
    { header: "Descontos", key: "descontos", width: 12, style: { numFmt: "#,##0.00" } },
    { header: "Líquido", key: "liquido", width: 15, style: { numFmt: "#,##0.00" } },
    { header: "Status", key: "status", width: 12 },
  ];

  // Style header
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A5F" } };
  headerRow.alignment = { horizontal: "center" };

  if (db) {
    const folhas = await db.select().from(folhaPagamento)
      .where(eq(folhaPagamento.competencia, competencia));

    const colabs = await db.select().from(colaboradores);
    const colabMap = new Map(colabs.map(c => [c.id, c]));

    for (const f of folhas) {
      const colab = colabMap.get(f.colaboradorId);
      const bruto = parseFloat(f.salarioBruto?.toString() || "0");
      const inss = parseFloat(f.inss?.toString() || "0");
      const irrf = parseFloat(f.irrf?.toString() || "0");
      const fgts = parseFloat(f.fgts?.toString() || "0");
      const descontos = inss + irrf;
      const liquido = parseFloat(f.salarioLiquido?.toString() || "0");

      sheet.addRow({
        colaborador: colab?.nome || f.colaboradorId,
        cpf: colab?.cpf || "-",
        cargo: colab?.cargo || "-",
        departamento: colab?.departamento || "-",
        bruto, inss, irrf, fgts, descontos, liquido,
        status: f.status || "processada",
      });
    }

    // Totals row
    const lastRow = sheet.lastRow?.number || 1;
    const totalRow = sheet.addRow({
      colaborador: "TOTAL",
      bruto: { formula: `SUM(E2:E${lastRow})` },
      inss: { formula: `SUM(F2:F${lastRow})` },
      irrf: { formula: `SUM(G2:G${lastRow})` },
      fgts: { formula: `SUM(H2:H${lastRow})` },
      descontos: { formula: `SUM(I2:I${lastRow})` },
      liquido: { formula: `SUM(J2:J${lastRow})` },
    });
    totalRow.font = { bold: true };
  }

  // Sheet 2: Férias
  const sheetFerias = workbook.addWorksheet("Férias");
  sheetFerias.columns = [
    { header: "Colaborador", key: "colaborador", width: 30 },
    { header: "Período Aquisitivo", key: "periodo", width: 20 },
    { header: "Data Início", key: "inicio", width: 15 },
    { header: "Data Fim", key: "fim", width: 15 },
    { header: "Dias", key: "dias", width: 10 },
    { header: "Abono", key: "abono", width: 10 },
    { header: "Status", key: "status", width: 15 },
  ];

  const headerRowFerias = sheetFerias.getRow(1);
  headerRowFerias.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRowFerias.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E7D32" } };

  if (db) {
    const feriasList = await db.select().from(ferias).orderBy(desc(ferias.createdAt));
    const colabs = await db.select().from(colaboradores);
    const colabMap = new Map(colabs.map(c => [c.id, c]));

    for (const f of feriasList) {
      const colab = colabMap.get(f.colaboradorId);
      sheetFerias.addRow({
        colaborador: colab?.nome || f.colaboradorId,
        periodo: f.periodoAquisitivo || "-",
        inicio: f.dataInicio ? new Date(f.dataInicio).toLocaleDateString("pt-BR") : "-",
        fim: f.dataFim ? new Date(f.dataFim).toLocaleDateString("pt-BR") : "-",
        dias: f.dias || 0,
        abono: f.abonoPecuniario ? "Sim" : "Não",
        status: f.status || "-",
      });
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ============================================================
// Relatório Ponto Excel
// ============================================================

export async function gerarRelatorioPontoExcel(mes: string, ano: string): Promise<Buffer> {
  const db = await getDb();
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "PUCHOO AI";

  const sheet = workbook.addWorksheet("Registros de Ponto");
  sheet.columns = [
    { header: "Colaborador", key: "colaborador", width: 30 },
    { header: "Data", key: "data", width: 15 },
    { header: "Entrada", key: "entrada", width: 12 },
    { header: "Saída Almoço", key: "saidaAlmoco", width: 12 },
    { header: "Retorno", key: "retorno", width: 12 },
    { header: "Saída", key: "saida", width: 12 },
    { header: "Horas Trab.", key: "horasTrab", width: 12 },
    { header: "Horas Extras", key: "extras", width: 12 },
    { header: "Status", key: "status", width: 12 },
    { header: "Tipo", key: "tipo", width: 15 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1565C0" } };

  if (db) {
    const dataInicio = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    const dataFim = new Date(parseInt(ano), parseInt(mes), 0);

    const registros = await db.select().from(pontoRegistros)
      .where(and(
        gte(pontoRegistros.dataRegistro, dataInicio),
        lte(pontoRegistros.dataRegistro, dataFim)
      ))
      .orderBy(pontoRegistros.dataRegistro);

    const colabs = await db.select().from(colaboradores);
    const colabMap = new Map(colabs.map(c => [c.id, c]));

    for (const r of registros) {
      const colab = colabMap.get(r.colaboradorId);
      sheet.addRow({
        colaborador: colab?.nome || r.colaboradorId,
        data: r.dataRegistro ? new Date(r.dataRegistro).toLocaleDateString("pt-BR") : "-",
        entrada: r.tipo === "entrada" ? r.horaRegistro : "-",
        saidaAlmoco: r.tipo === "intervalo_inicio" ? r.horaRegistro : "-",
        retorno: r.tipo === "intervalo_fim" ? r.horaRegistro : "-",
        saida: r.tipo === "saida" ? r.horaRegistro : "-",
        horasTrab: "-",
        extras: "-",
        status: r.tipo || "normal",
        tipo: r.metodo || "-",
      });
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
