import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Headphones, Ticket, HelpCircle, CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Suporte() {
  const chamados = trpc.suporte.getChamados.useQuery();
  const faq = trpc.suporte.getFAQ.useQuery();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Suporte ao Cliente</h1>
              <p className="text-sm text-slate-500">Chamados, SLA, FAQ e base de conhecimento</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Ticket className="w-8 h-8 mx-auto text-cyan-500 mb-2" />
              <p className="text-sm text-slate-500">Abertos</p>
              <p className="text-2xl font-bold">{chamados.data?.resumo.abertos || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="text-sm text-slate-500">Em Atendimento</p>
              <p className="text-2xl font-bold text-amber-600">{chamados.data?.resumo.emAtendimento || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-sm text-slate-500">Resolvidos</p>
              <p className="text-2xl font-bold text-emerald-600">{chamados.data?.resumo.resolvidos || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-slate-500">SLA Atendido</p>
              <p className="text-2xl font-bold text-blue-600">{chamados.data?.resumo.slaAtendido || 0}%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chamados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Ticket className="w-5 h-5" />Chamados Recentes</CardTitle>
              <CardDescription>SLA: Retorno 4h | Paliativa 16-24h | Definitiva 48-80h</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chamados.data?.chamados.map((c) => (
                  <div key={c.id} className={`p-4 rounded-lg border ${c.criticidade === "alta" ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{c.titulo}</p>
                        <p className="text-xs text-slate-500">Aberto em: {c.dataAbertura}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={c.criticidade === "alta" ? "destructive" : "outline"}>{c.criticidade}</Badge>
                        <Badge variant={c.status === "resolvido" ? "default" : "secondary"}>{c.status.replace("_", " ")}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-slate-500">Retorno</p>
                        <p className="font-medium">{c.sla.retorno}</p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-slate-500">Paliativa</p>
                        <p className="font-medium">{c.sla.paliativa}</p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-slate-500">Definitiva</p>
                        <p className="font-medium">{c.sla.definitiva}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HelpCircle className="w-5 h-5" />FAQ - Perguntas Frequentes</CardTitle>
              <CardDescription>Base de conhecimento para autoatendimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faq.data?.categorias.map((cat, ci) => (
                  <div key={ci}>
                    <h4 className="font-medium text-sm text-slate-700 mb-2">{cat.categoria}</h4>
                    <div className="space-y-1">
                      {cat.perguntas.map((p, pi) => {
                        const key = `${ci}-${pi}`;
                        const isExpanded = expandedFaq === key;
                        return (
                          <div key={pi} className="bg-slate-50 rounded-lg overflow-hidden">
                            <button
                              className="w-full flex items-center justify-between p-3 text-left text-sm hover:bg-slate-100 transition-colors"
                              onClick={() => setExpandedFaq(isExpanded ? null : key)}
                            >
                              <span className="font-medium">{p.pergunta}</span>
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                            {isExpanded && (
                              <div className="px-3 pb-3 text-sm text-slate-600">{p.resposta}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
