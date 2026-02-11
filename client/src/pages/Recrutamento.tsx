import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, UserSearch, Briefcase, Users, Clock, TrendingUp, CheckCircle2, Brain } from "lucide-react";

export default function Recrutamento() {
  const dashboard = trpc.recrutamento.getDashboard.useQuery();
  const vagas = trpc.recrutamento.getVagas.useQuery();

  const fmt = (v: number | string | null | undefined) => {
    const num = parseFloat(v?.toString() || "0");
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString?.() || String(date);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-puchoo-warm-50 to-puchoo-warm-100">
      <header className="bg-white shadow-sm border-b border-puchoo-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-puchoo-green w-10 h-10 rounded-lg flex items-center justify-center">
              <UserSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-puchoo-green-dark">Recrutamento e Seleção</h1>
              <p className="text-sm text-puchoo-terracotta">Vagas, candidatos, triagem IA e pipeline</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Briefcase className="w-6 h-6 mx-auto text-puchoo-green mb-1" />
              <p className="text-xs text-puchoo-terracotta">Vagas Abertas</p>
              <p className="text-2xl font-bold">{dashboard.data?.vagasAbertas || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-6 h-6 mx-auto text-puchoo-green mb-1" />
              <p className="text-xs text-puchoo-terracotta">Candidatos</p>
              <p className="text-2xl font-bold">{dashboard.data?.candidatosTotal || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Brain className="w-6 h-6 mx-auto text-purple-500 mb-1" />
              <p className="text-xs text-puchoo-terracotta">Em Processo</p>
              <p className="text-2xl font-bold text-purple-600">{dashboard.data?.emProcesso || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto text-puchoo-green mb-1" />
              <p className="text-xs text-puchoo-terracotta">Contratados/Mês</p>
              <p className="text-2xl font-bold text-puchoo-green">{dashboard.data?.contratadosMes || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="w-6 h-6 mx-auto text-amber-500 mb-1" />
              <p className="text-xs text-puchoo-terracotta">Tempo Médio</p>
              <p className="text-2xl font-bold text-amber-600">{dashboard.data?.tempoMedioContratacao || 0}d</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-6 h-6 mx-auto text-teal-500 mb-1" />
              <p className="text-xs text-puchoo-terracotta">Taxa Conversão</p>
              <p className="text-2xl font-bold text-teal-600">{parseFloat(dashboard.data?.taxaConversao?.toString() || "0").toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Vagas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" />Vagas em Aberto</CardTitle>
            <CardDescription>Pipeline de recrutamento por vaga</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vagas.data?.vagas.map((v: any) => (
                <div key={v.id} className="p-4 bg-puchoo-warm-50 rounded-lg hover:bg-puchoo-warm-100 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{v.titulo || "N/A"}</h3>
                      <p className="text-sm text-puchoo-terracotta">{v.departamento || "N/A"} | Faixa: {fmt(v.salarioMin)} - {fmt(v.salarioMax)}</p>
                    </div>
                    <Badge variant={v.status === "aberta" ? "default" : v.status === "em_selecao" ? "secondary" : "outline"}>
                      {v.status === "aberta" ? "Aberta" : v.status === "em_selecao" ? "Em Seleção" : (v.status || "N/A")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-puchoo-terracotta-light" />
                      <span className="text-sm">{v.candidatos || 0} candidatos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-puchoo-terracotta-light" />
                      <span className="text-sm">Aberta em {formatDate(v.dataAbertura)}</span>
                    </div>
                  </div>

                  {/* Pipeline visual */}
                  <div className="mt-3 flex gap-1">
                    {[
                      { label: "Triagem", count: v.etapaTriagem || 0 },
                      { label: "Teste", count: v.etapaTeste || 0 },
                      { label: "Entrevista", count: v.etapaEntrevista || 0 },
                      { label: "Proposta", count: v.etapaProposta || 0 },
                      { label: "Contratado", count: v.etapaContratado || 0 },
                    ].map((etapa, i) => (
                      <div key={i} className="flex-1">
                        <div className={`h-2 rounded-full ${etapa.count > 0 ? "bg-puchoo-green-light" : "bg-puchoo-warm-100"}`} />
                        <p className="text-xs text-center text-puchoo-terracotta mt-1">{etapa.label} ({etapa.count})</p>
                      </div>
                    ))}
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
