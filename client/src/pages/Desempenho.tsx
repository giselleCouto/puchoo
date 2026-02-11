import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Target, Star, BookOpen, BarChart3, MessageSquare } from "lucide-react";

export default function Desempenho() {
  const dashboard = trpc.desempenho.getDashboard.useQuery();
  const avaliacoes = trpc.desempenho.getAvaliacoes.useQuery();
  const okrs = trpc.desempenho.getOKRs.useQuery();
  const pdis = trpc.desempenho.getPDIs.useQuery();
  const feedbacks = trpc.desempenho.getFeedbacks.useQuery();

  const mediaGeral = parseFloat(dashboard.data?.mediaGeral?.toString() || "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Gestão de Desempenho</h1>
              <p className="text-sm text-slate-500">Avaliações, OKRs, PDI e Feedback contínuo</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-slate-500">Ciclo Atual</p>
              <p className="text-2xl font-bold text-amber-600">{dashboard.data?.cicloAtual || "..."}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-slate-500">Avaliações Concluídas</p>
              <p className="text-2xl font-bold">{dashboard.data?.avaliacoesConcluidas || 0}/{dashboard.data?.avaliacoesTotal || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-slate-500">Média Geral</p>
              <p className="text-2xl font-bold text-emerald-600">{mediaGeral.toFixed(1)}/5.0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-slate-500">Pendentes</p>
              <p className="text-2xl font-bold text-red-600">{dashboard.data?.avaliacoesPendentes || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* 9-Box Grid */}
        {dashboard.data?.distribuicao9Box && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Matriz 9-Box</CardTitle>
              <CardDescription>Distribuição de colaboradores por desempenho e potencial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Enigma", value: dashboard.data.distribuicao9Box.baixoDesempenhoAltoPotencial, color: "bg-yellow-100 text-yellow-800" },
                  { label: "Potencial", value: dashboard.data.distribuicao9Box.medioDesempenhoAltoPotencial, color: "bg-blue-100 text-blue-800" },
                  { label: "Estrela", value: dashboard.data.distribuicao9Box.altoDesempenhoAltoPotencial, color: "bg-emerald-100 text-emerald-800" },
                  { label: "Questionável", value: dashboard.data.distribuicao9Box.baixoDesempenhoMedioPotencial, color: "bg-orange-100 text-orange-800" },
                  { label: "Mantenedor", value: dashboard.data.distribuicao9Box.medioDesempenhoMedioPotencial, color: "bg-slate-100 text-slate-800" },
                  { label: "Alto Desemp.", value: dashboard.data.distribuicao9Box.altoDesempenhoMedioPotencial, color: "bg-teal-100 text-teal-800" },
                  { label: "Insuficiente", value: dashboard.data.distribuicao9Box.baixoDesempenhoBaixoPotencial, color: "bg-red-100 text-red-800" },
                  { label: "Efetivo", value: dashboard.data.distribuicao9Box.medioDesempenhoBaixoPotencial, color: "bg-gray-100 text-gray-800" },
                  { label: "Profissional", value: dashboard.data.distribuicao9Box.altoDesempenhoBaixoPotencial, color: "bg-indigo-100 text-indigo-800" },
                ].map((box, i) => (
                  <div key={i} className={`${box.color} rounded-lg p-4 text-center`}>
                    <p className="text-xs font-medium">{box.label}</p>
                    <p className="text-2xl font-bold">{box.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Baixo Desempenho</span><span>Alto Desempenho</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avaliações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5" />Avaliações</CardTitle>
              <CardDescription>Avaliações 90°, 180° e 360°</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {avaliacoes.data?.avaliacoes.map((a) => {
                  const notaFinal = parseFloat(a.notaFinal?.toString() || "0");
                  return (
                    <div key={a.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-medium text-sm">{a.colaboradorId || "N/A"}</p>
                          <p className="text-xs text-slate-500">Avaliador: {a.avaliadorId || "N/A"} | Tipo: {a.tipo || "N/A"}</p>
                        </div>
                        <Badge variant={a.status === "concluida" ? "default" : "secondary"}>{a.status || "N/A"}</Badge>
                      </div>
                      {notaFinal > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.round(notaFinal) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                          ))}
                          <span className="text-xs text-slate-600 ml-1">{notaFinal.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* OKRs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" />OKRs</CardTitle>
              <CardDescription>Objetivos e Resultados-Chave</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {okrs.data?.okrs.map((o) => {
                  const percentual = parseFloat(o.percentual?.toString() || "0");
                  return (
                    <div key={o.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{o.colaboradorId || "N/A"}</p>
                          <p className="text-xs text-slate-600">{o.objetivo || "N/A"}</p>
                          <p className="text-xs text-slate-500">KR: {o.resultadoChave || "N/A"}</p>
                        </div>
                        <Badge variant={o.status === "concluida" ? "default" : "secondary"}>{percentual}%</Badge>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${percentual >= 70 ? "bg-emerald-500" : percentual >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${percentual}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* PDIs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" />PDI - Plano de Desenvolvimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pdis.data?.pdis.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-sm">{p.colaboradorId || "N/A"}</p>
                    <p className="text-xs text-slate-600">Competência: {p.competencia || "N/A"}</p>
                    <p className="text-xs text-slate-500">Ação: {p.acaoDesenvolvimento || "N/A"}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500">Prazo: {new Date(p.prazo || "").toLocaleDateString?.() || String(p.prazo || "")}</span>
                      <Badge variant={p.status === "em_andamento" ? "default" : "secondary"}>{p.status || "N/A"}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedbacks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" />Feedbacks</CardTitle>
              <CardDescription>Feedback contínuo entre colaboradores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feedbacks.data?.feedbacks.map((f) => (
                  <div key={f.id} className={`p-3 rounded-lg ${f.tipo === "elogio" ? "bg-emerald-50" : "bg-amber-50"}`}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs text-slate-500">{(f.deUserId || "N/A")} → {(f.paraUserId || "N/A")}</p>
                      <Badge variant={f.tipo === "elogio" ? "default" : "secondary"}>{f.tipo || "N/A"}</Badge>
                    </div>
                    <p className="text-sm">{f.mensagem || "N/A"}</p>
                    <p className="text-xs text-slate-400 mt-1">{f.createdAt?.toLocaleDateString?.() || String(f.createdAt || "")}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
