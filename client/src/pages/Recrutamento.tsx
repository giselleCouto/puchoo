import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, UserSearch, Briefcase, Users, Clock, TrendingUp, CheckCircle2, Brain } from "lucide-react";

export default function Recrutamento() {
  const dashboard = trpc.recrutamento.getDashboard.useQuery();
  const vagas = trpc.recrutamento.getVagas.useQuery();

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <UserSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Recrutamento e Seleção</h1>
              <p className="text-sm text-slate-500">Vagas, candidatos, triagem IA e pipeline</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Briefcase className="w-6 h-6 mx-auto text-indigo-500 mb-1" />
              <p className="text-xs text-slate-500">Vagas Abertas</p>
              <p className="text-2xl font-bold">{dashboard.data?.vagasAbertas || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-6 h-6 mx-auto text-blue-500 mb-1" />
              <p className="text-xs text-slate-500">Candidatos</p>
              <p className="text-2xl font-bold">{dashboard.data?.candidatosTotal || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Brain className="w-6 h-6 mx-auto text-purple-500 mb-1" />
              <p className="text-xs text-slate-500">Em Processo</p>
              <p className="text-2xl font-bold text-purple-600">{dashboard.data?.emProcesso || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
              <p className="text-xs text-slate-500">Contratados/Mês</p>
              <p className="text-2xl font-bold text-emerald-600">{dashboard.data?.contratadosMes || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="w-6 h-6 mx-auto text-amber-500 mb-1" />
              <p className="text-xs text-slate-500">Tempo Médio</p>
              <p className="text-2xl font-bold text-amber-600">{dashboard.data?.tempoMedioContratacao || 0}d</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-6 h-6 mx-auto text-teal-500 mb-1" />
              <p className="text-xs text-slate-500">Taxa Conversão</p>
              <p className="text-2xl font-bold text-teal-600">{dashboard.data?.taxaConversao || 0}%</p>
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
              {vagas.data?.vagas.map((v) => (
                <div key={v.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{v.titulo}</h3>
                      <p className="text-sm text-slate-500">{v.departamento} | Faixa: {fmt(v.salarioMin)} - {fmt(v.salarioMax)}</p>
                    </div>
                    <Badge variant={v.status === "aberta" ? "default" : v.status === "em_selecao" ? "secondary" : "outline"}>
                      {v.status === "aberta" ? "Aberta" : v.status === "em_selecao" ? "Em Seleção" : v.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{v.candidatos} candidatos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">Aberta em {v.dataAbertura}</span>
                    </div>
                  </div>

                  {/* Pipeline visual */}
                  <div className="mt-3 flex gap-1">
                    {["Triagem", "Teste", "Entrevista", "Proposta", "Contratado"].map((etapa, i) => (
                      <div key={i} className="flex-1">
                        <div className={`h-2 rounded-full ${i <= 2 ? "bg-indigo-400" : "bg-slate-200"}`} />
                        <p className="text-xs text-center text-slate-500 mt-1">{etapa}</p>
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
