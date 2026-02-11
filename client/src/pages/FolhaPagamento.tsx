import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, DollarSign, Users, FileText, Calculator, TrendingUp, Calendar, AlertTriangle } from "lucide-react";

export default function FolhaPagamento() {
  const { user } = useAuth();
  const resumo = trpc.folha.getResumoFolha.useQuery();
  const colaboradores = trpc.folha.getColaboradores.useQuery();
  const ferias = trpc.folha.getFerias.useQuery();
  const relatorios = trpc.folha.getRelatorios.useQuery();

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-puchoo-warm-50 to-puchoo-warm-100">
      <header className="bg-white shadow-sm border-b border-puchoo-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-puchoo-green w-10 h-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-puchoo-green-dark">Folha de Pagamento</h1>
              <p className="text-sm text-puchoo-terracotta">Gestão completa de folha, encargos e obrigações</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-puchoo-terracotta">Total Colaboradores</p>
                  <p className="text-2xl font-bold">{resumo.data?.totalColaboradores || 0}</p>
                </div>
                <Users className="w-8 h-8 text-puchoo-green" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-puchoo-terracotta">Total Bruto</p>
                  <p className="text-2xl font-bold text-puchoo-green">{resumo.data ? fmt(parseFloat(resumo.data.totalBruto?.toString() || "0")) : "..."}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-puchoo-green" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-puchoo-terracotta">Total Líquido</p>
                  <p className="text-2xl font-bold text-puchoo-green">{resumo.data ? fmt(parseFloat(resumo.data.totalLiquido?.toString() || "0")) : "..."}</p>
                </div>
                <DollarSign className="w-8 h-8 text-puchoo-green" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-puchoo-terracotta">Total Descontos</p>
                  <p className="text-2xl font-bold text-puchoo-coral">{resumo.data ? fmt(parseFloat(resumo.data.totalDescontos?.toString() || "0")) : "..."}</p>
                </div>
                <Calculator className="w-8 h-8 text-puchoo-coral" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Encargos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Encargos Sociais - {resumo.data?.competencia || "2025-01"}</CardTitle>
            <CardDescription>Resumo dos encargos calculados na folha</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {resumo.data?.encargos && Object.entries(resumo.data.encargos).map(([key, val]) => (
                <div key={key} className="bg-puchoo-warm-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-puchoo-terracotta uppercase">{key}</p>
                  <p className="text-lg font-bold text-puchoo-green-dark">{fmt(parseFloat(val?.toString() || "0"))}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colaboradores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Colaboradores</CardTitle>
              <CardDescription>Cadastro de colaboradores ativos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {colaboradores.data?.colaboradores.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-puchoo-warm-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{c.nome || "N/A"}</p>
                      <p className="text-xs text-puchoo-terracotta">{c.cargo || "N/A"} - {c.departamento || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{fmt(parseFloat(c.salarioBase?.toString() || "0"))}</p>
                      <Badge variant="outline" className="text-xs">{(c.tipoContrato || "N/A").toUpperCase()}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Férias e Alertas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Férias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ferias.data?.ferias.map((f) => (
                    <div key={f.id} className="flex items-center justify-between p-3 bg-puchoo-warm-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{f.colaboradorId || "N/A"}</p>
                        <p className="text-xs text-puchoo-terracotta">{new Date(f.dataInicio).toLocaleDateString?.() || String(f.dataInicio || "")} a {new Date(f.dataFim).toLocaleDateString?.() || String(f.dataFim || "")} ({f.dias} dias)</p>
                      </div>
                      <Badge variant={f.status === "aprovada" ? "default" : "secondary"}>{f.status || "N/A"}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {ferias.data?.alertas && ferias.data.alertas.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800"><AlertTriangle className="w-5 h-5" />Alertas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(ferias.data.alertas as any[]).map((a: any, i: number) => (
                      <div key={i} className="p-3 bg-white rounded-lg border border-amber-200">
                        <p className="font-medium text-sm text-amber-900">{a.colaboradorId || "N/A"}</p>
                        <p className="text-xs text-amber-700">{a.mensagem || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Relatórios */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Relatórios Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {relatorios.data?.relatorios.map((r) => (
                <Button key={r.id} variant="outline" className="justify-start h-auto py-3">
                  <FileText className="w-4 h-4 mr-2 text-puchoo-green" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{r.nome || "N/A"}</p>
                    <p className="text-xs text-puchoo-terracotta">{r.competencia || "N/A"}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
