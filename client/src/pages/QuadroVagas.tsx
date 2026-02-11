import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, LayoutGrid, Users, Building2 } from "lucide-react";

export default function QuadroVagas() {
  const resumo = trpc.quadroVagas.getResumo.useQuery();
  const vagas = trpc.quadroVagas.getVagas.useQuery();

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const orcamentoUtilizado = parseFloat(resumo.data?.orcamentoUtilizado?.toString() || "0");
  const orcamentoTotal = parseFloat(resumo.data?.orcamentoTotal?.toString() || "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-puchoo-warm-50 to-puchoo-warm-100">
      <header className="bg-white shadow-sm border-b border-puchoo-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-puchoo-green w-10 h-10 rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-puchoo-green-dark">Quadro de Vagas</h1>
              <p className="text-sm text-puchoo-terracotta">Planejamento e controle de vagas por departamento</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-puchoo-terracotta">Vagas Efetivas</p>
              <p className="text-3xl font-bold">{resumo.data?.totalVagasEfetivas || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-puchoo-terracotta">Vagas Ocupadas</p>
              <p className="text-3xl font-bold text-puchoo-green">{resumo.data?.totalVagasOcupadas || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-puchoo-terracotta">Vagas Disponíveis</p>
              <p className="text-3xl font-bold text-puchoo-green">{resumo.data?.totalVagasDisponiveis || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-puchoo-terracotta">Orçamento Utilizado</p>
              <p className="text-xl font-bold text-amber-600">{resumo.data ? fmt(orcamentoUtilizado) : "..."}</p>
              <p className="text-xs text-puchoo-terracotta">de {resumo.data ? fmt(orcamentoTotal) : "..."}</p>
            </CardContent>
          </Card>
        </div>

        {/* Departamentos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" />Vagas por Departamento</CardTitle>
            <CardDescription>Distribuição de vagas efetivas, ocupadas e previstas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-puchoo-green-50">
                    <th className="text-left py-3 px-4 font-medium text-puchoo-terracotta">Departamento</th>
                    <th className="text-center py-3 px-4 font-medium text-puchoo-terracotta">Efetivas</th>
                    <th className="text-center py-3 px-4 font-medium text-puchoo-terracotta">Ocupadas</th>
                    <th className="text-center py-3 px-4 font-medium text-puchoo-terracotta">Disponíveis</th>
                    <th className="text-center py-3 px-4 font-medium text-puchoo-terracotta">Previstas</th>
                    <th className="text-right py-3 px-4 font-medium text-puchoo-terracotta">Orçamento</th>
                    <th className="text-center py-3 px-4 font-medium text-puchoo-terracotta">Ocupação</th>
                  </tr>
                </thead>
                <tbody>
                  {resumo.data?.departamentos.map((d, i) => {
                    const ocupacao = d.efetivas > 0 ? Math.round((d.ocupadas / d.efetivas) * 100) : 0;
                    const orcamento = parseFloat(d.orcamento?.toString() || "0");
                    return (
                      <tr key={i} className="border-b border-puchoo-warm-100 hover:bg-puchoo-warm-50">
                        <td className="py-3 px-4 font-medium">{d.departamento || "N/A"}</td>
                        <td className="py-3 px-4 text-center">{d.efetivas}</td>
                        <td className="py-3 px-4 text-center text-puchoo-green font-medium">{d.ocupadas}</td>
                        <td className="py-3 px-4 text-center text-puchoo-green font-medium">{d.efetivas - d.ocupadas}</td>
                        <td className="py-3 px-4 text-center text-puchoo-terracotta">{d.previstas}</td>
                        <td className="py-3 px-4 text-right">{fmt(orcamento)}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-16 bg-puchoo-warm-100 rounded-full h-2">
                              <div className={`h-2 rounded-full ${ocupacao >= 90 ? "bg-puchoo-green" : ocupacao >= 70 ? "bg-amber-500" : "bg-puchoo-coral"}`} style={{ width: `${ocupacao}%` }} />
                            </div>
                            <span className="text-xs">{ocupacao}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Vagas Detalhadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Cargos e Vagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vagas.data?.vagas.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-4 bg-puchoo-warm-50 rounded-lg">
                  <div>
                    <p className="font-medium">{v.cargo || "N/A"}</p>
                    <p className="text-sm text-puchoo-terracotta">{v.departamento || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-puchoo-terracotta">Efetivas</p>
                      <p className="font-bold">{v.vagasEfetivas || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-puchoo-terracotta">Ocupadas</p>
                      <p className="font-bold text-puchoo-green">{v.vagasOcupadas || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-puchoo-terracotta">Disponíveis</p>
                      <p className="font-bold text-puchoo-green">{(v.vagasEfetivas || 0) - (v.vagasOcupadas || 0)}</p>
                    </div>
                    <Badge variant="outline">{v.status || "N/A"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
