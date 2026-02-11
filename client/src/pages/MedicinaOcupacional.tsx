import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Stethoscope, UserCheck, Calendar, AlertTriangle, Baby } from "lucide-react";

export default function MedicinaOcupacional() {
  const prontuarios = trpc.medicina.getProntuarios.useQuery();
  const afastamentos = trpc.medicina.getAfastamentos.useQuery();
  const gestantes = trpc.medicina.getGestantes.useQuery();
  const exames = trpc.medicina.getExamesOcupacionais.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-puchoo-warm-50 to-puchoo-warm-100">
      <header className="bg-white shadow-sm border-b border-puchoo-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-puchoo-coral w-10 h-10 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-puchoo-green-dark">Medicina Ocupacional</h1>
              <p className="text-sm text-puchoo-terracotta">Prontuários, afastamentos, gestantes e exames</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Stethoscope className="w-8 h-8 mx-auto text-puchoo-coral mb-2" />
              <p className="text-sm text-puchoo-terracotta">Prontuários</p>
              <p className="text-2xl font-bold">{prontuarios.data?.prontuarios.length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="text-sm text-puchoo-terracotta">Afastamentos Ativos</p>
              <p className="text-2xl font-bold text-amber-600">{afastamentos.data?.totalAtivos || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Baby className="w-8 h-8 mx-auto text-puchoo-coral mb-2" />
              <p className="text-sm text-puchoo-terracotta">Gestantes</p>
              <p className="text-2xl font-bold text-puchoo-coral">{gestantes.data?.gestantes.length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="w-8 h-8 mx-auto text-puchoo-green mb-2" />
              <p className="text-sm text-puchoo-terracotta">Exames Vencidos</p>
              <p className="text-2xl font-bold text-puchoo-coral">{exames.data?.vencidos || 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prontuários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCheck className="w-5 h-5" />Prontuários Médicos</CardTitle>
              <CardDescription>Histórico de saúde dos colaboradores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prontuarios.data?.prontuarios.map((p) => (
                  <div key={p.id} className="p-4 bg-puchoo-warm-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{p.colaboradorId}</p>
                        <p className="text-xs text-puchoo-terracotta">Consulta: {p.dataConsulta?.toLocaleDateString?.() || String(p.dataConsulta || "")}</p>
                      </div>
                      <Badge variant={p.diagnostico ? "default" : "secondary"}>
                        {p.diagnostico || "N/A"}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-xs text-puchoo-terracotta">
                      <span>Tipo: {p.tipo || "N/A"}</span>
                      <span>Médico: {p.medicoResponsavel || "N/A"}</span>
                    </div>
                  </div>
                ))}
                {(!prontuarios.data?.prontuarios.length) && (
                  <p className="text-center text-puchoo-terracotta-light py-4">Nenhum prontuário registrado</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Afastamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" />Afastamentos</CardTitle>
              <CardDescription>Controle de afastamentos e retornos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {afastamentos.data?.afastamentos.map((a) => (
                  <div key={a.id} className="p-4 bg-puchoo-warm-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{a.colaboradorId}</p>
                        <p className="text-xs text-puchoo-terracotta">{a.tipo === "doenca" ? "Doença" : a.tipo === "maternidade" ? "Licença Maternidade" : a.tipo || ""}</p>
                      </div>
                      <Badge variant={a.status === "ativo" ? "destructive" : "default"}>{a.status || "N/A"}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-puchoo-terracotta">
                      <span>Início: {a.dataInicio?.toLocaleDateString?.() || String(a.dataInicio || "")}</span>
                      <span>Retorno: {a.previsaoRetorno?.toLocaleDateString?.() || String(a.previsaoRetorno || "N/A")}</span>
                      <span>CID: {a.cid || "N/A"}</span>
                    </div>
                    {a.cid && <p className="text-xs text-puchoo-terracotta mt-1">CID: {a.cid}</p>}
                  </div>
                ))}
                {(!afastamentos.data?.afastamentos.length) && (
                  <p className="text-center text-puchoo-terracotta-light py-4">Nenhum afastamento registrado</p>
                )}
                <div className="p-3 bg-amber-50 rounded-lg text-center text-sm text-puchoo-terracotta">
                  Total de afastamentos no ano: <span className="font-bold">{afastamentos.data?.totalAno || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gestantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Baby className="w-5 h-5 text-puchoo-coral" />Controle de Gestantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gestantes.data?.gestantes.map((g) => (
                  <div key={g.id} className="p-4 bg-puchoo-coral-light/20 rounded-lg">
                    <p className="font-medium">{g.colaboradorId}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-puchoo-terracotta mt-2">
                      <span>Início: {g.dataInicio?.toLocaleDateString?.() || String(g.dataInicio || "")}</span>
                      <span>Retorno: {g.previsaoRetorno?.toLocaleDateString?.() || String(g.previsaoRetorno || "N/A")}</span>
                    </div>
                    <p className="text-xs text-puchoo-coral mt-1">Tipo: {g.tipo || "N/A"}</p>
                  </div>
                ))}
                {(!gestantes.data?.gestantes.length) && (
                  <p className="text-center text-puchoo-terracotta-light py-4">Nenhuma gestante registrada</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Agenda de Exames */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Agenda de Exames</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exames.data?.agenda.map((e) => (
                  <div key={e.id} className="p-4 bg-puchoo-warm-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{e.colaboradorId}</p>
                      <p className="text-xs text-puchoo-terracotta">{e.tipo || "N/A"} - {e.medicoResponsavel || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{e.dataExame?.toLocaleDateString?.() || String(e.dataExame || "")}</p>
                      <Badge variant="outline" className="text-xs">{e.resultado || "pendente"}</Badge>
                    </div>
                  </div>
                ))}
                {(!exames.data?.agenda.length) && (
                  <p className="text-center text-puchoo-terracotta-light py-4">Nenhum exame agendado</p>
                )}
                <div className="p-3 bg-puchoo-coral-light/20 rounded-lg text-center text-sm text-puchoo-coral">
                  Exames vencidos: <span className="font-bold">{exames.data?.vencidos || 0}</span> | Próximos 30 dias: <span className="font-bold">{exames.data?.proximos30Dias || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
