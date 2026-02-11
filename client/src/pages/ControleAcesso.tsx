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

  const dispositivos: any[] = dashboard.data?.dispositivos || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-puchoo-warm-50 to-puchoo-warm-100">
      <header className="bg-white shadow-sm border-b border-puchoo-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-puchoo-green-dark w-10 h-10 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-puchoo-green-dark">Controle de Acesso e Portaria</h1>
              <p className="text-sm text-puchoo-terracotta">Catracas, visitantes, dispositivos e logs</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 mx-auto text-puchoo-green mb-2" />
              <p className="text-sm text-puchoo-terracotta">Pessoas Presentes</p>
              <p className="text-3xl font-bold">{dashboard.data?.pessoasPresentes || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <UserPlus className="w-8 h-8 mx-auto text-puchoo-green mb-2" />
              <p className="text-sm text-puchoo-terracotta">Visitantes Hoje</p>
              <p className="text-3xl font-bold text-puchoo-green">{dashboard.data?.visitantesHoje || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <DoorOpen className="w-8 h-8 mx-auto text-puchoo-green mb-2" />
              <p className="text-sm text-puchoo-terracotta">Acessos Hoje</p>
              <p className="text-3xl font-bold text-puchoo-green">{dashboard.data?.acessosHoje || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto text-puchoo-coral mb-2" />
              <p className="text-sm text-puchoo-terracotta">Acessos Negados</p>
              <p className="text-3xl font-bold text-puchoo-coral">{dashboard.data?.acessosNegados || 0}</p>
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
              {dispositivos.map((d: any) => (
                <div key={d.id} className={`p-4 rounded-lg border ${d.status === "online" ? "bg-puchoo-green-50 border-puchoo-green-light" : "bg-puchoo-coral-light/20 border-puchoo-coral-light"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">{d.nome || "N/A"}</p>
                    <Badge variant={d.status === "online" ? "default" : "destructive"}>{d.status || "offline"}</Badge>
                  </div>
                  <p className="text-xs text-puchoo-terracotta">{(d.tipo || "").replace("_", " ")}</p>
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
              <h4 className="text-sm font-medium text-puchoo-green-dark mb-3">Presentes Agora</h4>
              <div className="space-y-3 mb-6">
                {(visitantes.data?.visitantes || []).filter((v: any) => v.status === "presente").map((v: any) => (
                  <div key={v.id} className="p-3 bg-puchoo-green-50 rounded-lg border border-puchoo-green-light">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{v.nome || "N/A"}</p>
                        <p className="text-xs text-puchoo-terracotta">{v.empresa || ""}</p>
                        <p className="text-xs text-puchoo-terracotta">Motivo: {v.motivoVisita || "N/A"}</p>
                        <p className="text-xs text-puchoo-terracotta">Visitando: {v.pessoaVisitada || "N/A"}</p>
                      </div>
                      <Badge>Presente</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="text-sm font-medium text-puchoo-green-dark mb-3">Agendados</h4>
              <div className="space-y-3">
                {(visitantes.data?.agendados || []).map((v: any) => (
                  <div key={v.id} className="p-3 bg-puchoo-green-50 rounded-lg border border-puchoo-green-light">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{v.nome || "N/A"}</p>
                        <p className="text-xs text-puchoo-terracotta">{v.empresa || ""}</p>
                        <p className="text-xs text-puchoo-terracotta">{new Date(v.dataHora).toLocaleDateString?.() || String(v.dataHora || "")}</p>
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
                {(logs.data?.logs || []).map((l: any) => (
                  <div key={l.id} className={`p-3 rounded-lg flex items-center justify-between ${l.autorizado ? "bg-puchoo-warm-50" : "bg-puchoo-coral-light/20"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${l.autorizado ? "bg-puchoo-green" : "bg-puchoo-coral"}`} />
                      <div>
                        <p className="font-medium text-sm">{l.pessoaId || "N/A"}</p>
                        <p className="text-xs text-puchoo-terracotta">{l.dispositivo || "N/A"} | {l.metodoAcesso || "N/A"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{new Date(l.dataHora).toLocaleString?.() || String(l.dataHora || "")}</p>
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
