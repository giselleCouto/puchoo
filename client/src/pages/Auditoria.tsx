import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, ScrollText, Eye, Edit, Trash2, Plus, Search } from "lucide-react";

export default function Auditoria() {
  const logs = trpc.auditoria.getLogs.useQuery();

  const acaoIcon = (acao: string) => {
    switch (acao) {
      case "inclusao": return <Plus className="w-4 h-4 text-puchoo-green" />;
      case "alteracao": return <Edit className="w-4 h-4 text-amber-500" />;
      case "exclusao": return <Trash2 className="w-4 h-4 text-puchoo-coral" />;
      case "consulta": return <Eye className="w-4 h-4 text-puchoo-green-light" />;
      default: return <Search className="w-4 h-4 text-puchoo-terracotta-light" />;
    }
  };

  const acaoColor = (acao: string) => {
    switch (acao) {
      case "inclusao": return "bg-puchoo-green-50 border-puchoo-green-light";
      case "alteracao": return "bg-amber-50 border-amber-200";
      case "exclusao": return "bg-puchoo-coral-light/20 border-puchoo-coral-light";
      case "consulta": return "bg-puchoo-green-50 border-puchoo-green-light";
      default: return "bg-puchoo-warm-50 border-puchoo-green-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-puchoo-warm-50 to-puchoo-warm-100">
      <header className="bg-white shadow-sm border-b border-puchoo-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-puchoo-terracotta w-10 h-10 rounded-lg flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-puchoo-green-dark">Trilha de Auditoria</h1>
              <p className="text-sm text-puchoo-terracotta">Registro de todas as operações do sistema (inclusão, alteração, exclusão, consulta)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ScrollText className="w-5 h-5" />Logs de Auditoria</CardTitle>
            <CardDescription>Rastreabilidade completa de todas as ações do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.data?.logs.map((l: any) => (
                <div key={l.id} className={`p-4 rounded-lg border ${acaoColor(l.acao || "")}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{acaoIcon(l.acao || "")}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{l.descricao || "N/A"}</p>
                          <p className="text-xs text-puchoo-terracotta mt-1">Usuário: {l.nomeUsuario || "N/A"} ({l.usuarioId || "N/A"})</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">{l.modulo || "N/A"}</Badge>
                          <p className="text-xs text-puchoo-terracotta mt-1">{new Date(l.dataHora).toLocaleDateString?.() || String(l.dataHora || "")}</p>
                        </div>
                      </div>
                      <p className="text-xs text-puchoo-terracotta-light mt-1">IP: {l.ip || "N/A"}</p>
                    </div>
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
