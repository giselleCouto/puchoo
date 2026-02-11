import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, FileText, FileSpreadsheet, Download, Loader2, Stethoscope, DollarSign, Clock } from "lucide-react";
import { useState } from "react";

function downloadBase64File(base64: string, filename: string, mimeType: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Relatorios() {
  const { user } = useAuth();
  const [competencia, setCompetencia] = useState("2025-01");
  const [mes, setMes] = useState("01");
  const [ano, setAno] = useState("2025");
  const [colaboradorId, setColaboradorId] = useState("");

  const contracheque = trpc.relatorios.contracheque.useMutation({
    onSuccess: (data) => downloadBase64File(data.base64, data.filename, data.type),
  });
  const espelhoPonto = trpc.relatorios.espelhoPonto.useMutation({
    onSuccess: (data) => downloadBase64File(data.base64, data.filename, data.type),
  });
  const relatorioSST = trpc.relatorios.relatorioSST.useMutation({
    onSuccess: (data) => downloadBase64File(data.base64, data.filename, data.type),
  });
  const folhaExcel = trpc.relatorios.folhaExcel.useMutation({
    onSuccess: (data) => downloadBase64File(data.base64, data.filename, data.type),
  });
  const pontoExcel = trpc.relatorios.pontoExcel.useMutation({
    onSuccess: (data) => downloadBase64File(data.base64, data.filename, data.type),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-puchoo-warm-50 to-puchoo-warm-100">
      <header className="bg-white shadow-sm border-b border-puchoo-green-50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Voltar</Button></Link>
            <div>
              <h1 className="text-xl font-bold text-puchoo-green-dark">Exportação de Relatórios</h1>
              <p className="text-xs text-puchoo-terracotta">Gere relatórios em PDF e Excel</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros Globais */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Parâmetros de Geração</CardTitle>
            <CardDescription>Configure os filtros para gerar os relatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-puchoo-green-dark block mb-1">Competência (Folha)</label>
                <input
                  type="month"
                  value={competencia}
                  onChange={(e) => {
                    setCompetencia(e.target.value);
                    const [y, m] = e.target.value.split("-");
                    setAno(y);
                    setMes(m);
                  }}
                  className="w-full border border-puchoo-terracotta-light rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-puchoo-green-dark block mb-1">Mês (Ponto)</label>
                <select value={mes} onChange={(e) => setMes(e.target.value)} className="w-full border border-puchoo-terracotta-light rounded-md px-3 py-2 text-sm">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      {new Date(2025, i).toLocaleString("pt-BR", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-puchoo-green-dark block mb-1">Ano</label>
                <select value={ano} onChange={(e) => setAno(e.target.value)} className="w-full border border-puchoo-terracotta-light rounded-md px-3 py-2 text-sm">
                  {[2023, 2024, 2025, 2026].map(y => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-puchoo-green-dark block mb-1">ID Colaborador (individual)</label>
                <input
                  type="text"
                  value={colaboradorId}
                  onChange={(e) => setColaboradorId(e.target.value)}
                  placeholder="ID do colaborador"
                  className="w-full border border-puchoo-terracotta-light rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Relatórios PDF */}
        <h2 className="text-lg font-bold text-puchoo-green-dark mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-puchoo-coral" />
          Relatórios em PDF
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-puchoo-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-puchoo-green" /></div>
                <div>
                  <CardTitle className="text-base">Contracheque</CardTitle>
                  <CardDescription className="text-xs">PDF individual por colaborador</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-puchoo-terracotta mb-3">Gera o demonstrativo de pagamento com proventos, descontos, INSS, IRRF e FGTS.</p>
              <Button
                onClick={() => contracheque.mutate({ colaboradorId: colaboradorId || user?.id || "", competencia })}
                disabled={contracheque.isPending}
                className="w-full bg-puchoo-coral hover:bg-puchoo-coral"
                size="sm"
              >
                {contracheque.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                Gerar PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-puchoo-green-50 rounded-lg"><Clock className="w-5 h-5 text-puchoo-green" /></div>
                <div>
                  <CardTitle className="text-base">Espelho de Ponto</CardTitle>
                  <CardDescription className="text-xs">Portaria 671/2021</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-puchoo-terracotta mb-3">Relatório completo de registros de ponto com entradas, saídas, intervalos e horas extras.</p>
              <Button
                onClick={() => espelhoPonto.mutate({ colaboradorId: colaboradorId || user?.id || "", mes, ano })}
                disabled={espelhoPonto.isPending}
                className="w-full bg-puchoo-coral hover:bg-puchoo-coral"
                size="sm"
              >
                {espelhoPonto.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                Gerar PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-puchoo-green-50 rounded-lg"><Stethoscope className="w-5 h-5 text-puchoo-green" /></div>
                <div>
                  <CardTitle className="text-base">Relatório SST</CardTitle>
                  <CardDescription className="text-xs">Saúde e Segurança</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-puchoo-terracotta mb-3">Exames ocupacionais, ASOs emitidos, resultados e resumo de conformidade NRs.</p>
              <Button
                onClick={() => relatorioSST.mutate()}
                disabled={relatorioSST.isPending}
                className="w-full bg-puchoo-coral hover:bg-puchoo-coral"
                size="sm"
              >
                {relatorioSST.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                Gerar PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios Excel */}
        <h2 className="text-lg font-bold text-puchoo-green-dark mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-puchoo-green" />
          Relatórios em Excel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-puchoo-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-puchoo-green" /></div>
                <div>
                  <CardTitle className="text-base">Folha de Pagamento</CardTitle>
                  <CardDescription className="text-xs">Planilha completa com todos os colaboradores</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-puchoo-terracotta mb-3">Inclui salário bruto, INSS, IRRF, FGTS, descontos e líquido. Aba extra com férias programadas.</p>
              <Button
                onClick={() => folhaExcel.mutate({ competencia })}
                disabled={folhaExcel.isPending}
                className="w-full bg-puchoo-green hover:bg-puchoo-green-dark"
                size="sm"
              >
                {folhaExcel.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                Gerar Excel
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-puchoo-green-50 rounded-lg"><Clock className="w-5 h-5 text-puchoo-green" /></div>
                <div>
                  <CardTitle className="text-base">Registros de Ponto</CardTitle>
                  <CardDescription className="text-xs">Planilha com todos os registros do mês</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-puchoo-terracotta mb-3">Registros de entrada, saída, intervalos, horas trabalhadas e método de registro por colaborador.</p>
              <Button
                onClick={() => pontoExcel.mutate({ mes, ano })}
                disabled={pontoExcel.isPending}
                className="w-full bg-puchoo-green hover:bg-puchoo-green-dark"
                size="sm"
              >
                {pontoExcel.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                Gerar Excel
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <Card className="bg-puchoo-warm-50 border-puchoo-green-50">
          <CardContent className="py-4">
            <p className="text-xs text-puchoo-terracotta">
              Os relatórios são gerados em tempo real a partir dos dados do banco de dados. Contracheques e espelhos de ponto requerem o ID do colaborador.
              Relatórios de folha e ponto em Excel incluem todos os colaboradores do período selecionado. Todos os downloads são registrados na trilha de auditoria.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
