import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, ShieldCheck, Users, UserPlus, Monitor, DoorOpen, AlertCircle, Clock } from "lucide-react";

export default function ControleAcesso() {
  const dashboard = trpc.acesso.getDashboard.useQuery();
  const visitantes = trpc.acesso.getVisitantes.useQuery();
  const logs = trpc.acesso.getLogAcessos.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-slate-700 w-10 h-10 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Controle de Acesso e Portaria</h1>
              <p className="text-sm text-slate-500">Catracas, visitantes, dispositivos e logs</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-slate-500">Pessoas Presentes</p>
              <p className="text-3xl font-bold">{dashboard.data?.pessoasPresentes || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <UserPlus className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-sm text-slate-500">Visitantes Hoje</p>
              <p className="text-3xl font-bold text-emerald-600">{dashboard.data?.visitantesHoje || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <DoorOpen className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
              <p className="text-sm text-slate-500">Acessos Hoje</p>
              <p className="text-3xl font-bold text-indigo-600">{dashboard.data?.acessosHoje || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
              <p className="text-sm text-slate-500">Acessos Negados</p>
              <p className="text-3xl font-bold text-red-600">{dashboard.data?.acessosNegados || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Dispositivos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Monitor className="w-5 h-5" />Dispositivos de Acesso</CardTitle>
            <CardDescription>Status em tempo real dos dispositivos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {dashboard.data?.dispositivos.map((d) => (
                <div key={d.id} className={`p-4 rounded-lg border ${d.status === "online" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">{d.nome}</p>
                    <Badge variant={d.status === "online" ? "default" : "destructive"}>{d.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{d.tipo.replace("_", " ")}</p>
                  <p className="text-xs text-slate-600 mt-1">Acessos hoje: <span className="font-bold">{d.acessosHoje}</span></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visitantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" />Visitantes</CardTitle>
              <CardDescription>Controle de entrada e saída de visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Presentes Agora</h4>
              <div className="space-y-3 mb-6">
                {visitantes.data?.visitantes.filter(v => v.status === "presente").map((v) => (
                  <div key={v.id} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{v.nome}</p>
                        <p className="text-xs text-slate-500">{v.empresa}</p>
                        <p className="text-xs text-slate-600">Motivo: {v.motivoVisita}</p>
                        <p className="text-xs text-slate-600">Visitando: {v.pessoaVisitada}</p>
                      </div>
                      <Badge>Presente</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="text-sm font-medium text-slate-700 mb-3">Agendados</h4>
              <div className="space-y-3">
                {visitantes.data?.agendados.map((v) => (
                  <div key={v.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{v.nome}</p>
                        <p className="text-xs text-slate-500">{v.empresa}</p>
                        <p className="text-xs text-slate-600">{v.dataAgendada}</p>
                      </div>
                      <Badge variant="secondary">Agendado</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Log de Acessos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" />Log de Acessos</CardTitle>
              <CardDescription>Registro em tempo real de entradas e saídas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs.data?.logs.map((l) => (
                  <div key={l.id} className={`p-3 rounded-lg flex items-center justify-between ${l.autorizado ? "bg-slate-50" : "bg-red-50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${l.autorizado ? "bg-emerald-500" : "bg-red-500"}`} />
                      <div>
                        <p className="font-medium text-sm">{l.pessoa}</p>
                        <p className="text-xs text-slate-500">{l.dispositivo} | {l.metodo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{l.horario}</p>
                      <Badge variant={l.autorizado ? "outline" : "destructive"} className="text-xs">
                        {l.direcao === "entrada" ? "Entrada" : "Saída"}
                      </Badge>
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
