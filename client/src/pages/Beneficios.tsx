import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Gift, Heart, Bus, Utensils, Shield, Baby, FileText, CreditCard } from "lucide-react";

export default function Beneficios() {
  const resumo = trpc.beneficios.getResumo.useQuery();
  const consignados = trpc.beneficios.getConsignados.useQuery();
  const relatorios = trpc.beneficios.getRelatorios.useQuery();

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const iconMap: Record<string, React.ReactNode> = {
    "Vale Transporte": <Bus className="w-5 h-5 text-blue-500" />,
    "Vale Alimentação": <Utensils className="w-5 h-5 text-orange-500" />,
    "Vale Refeição": <Utensils className="w-5 h-5 text-amber-500" />,
    "Plano de Saúde": <Heart className="w-5 h-5 text-red-500" />,
    "Plano Odontológico": <Heart className="w-5 h-5 text-pink-500" />,
    "Auxílio Creche": <Baby className="w-5 h-5 text-purple-500" />,
    "Seguro de Vida": <Shield className="w-5 h-5 text-green-500" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Gestão de Benefícios</h1>
              <p className="text-sm text-slate-500">VT, VA, VR, Planos de Saúde, Consignados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-slate-500">Total Colaboradores</p>
              <p className="text-3xl font-bold">{resumo.data?.totalColaboradores || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-slate-500">Custo Mensal Total</p>
              <p className="text-3xl font-bold text-purple-600">{resumo.data ? fmt(parseFloat(resumo.data.custoMensal?.toString() || "0")) : "..."}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-slate-500">Benefícios Ativos</p>
              <p className="text-3xl font-bold">{resumo.data?.beneficiosAtivos || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tipos de Benefícios */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Benefícios por Tipo</CardTitle>
            <CardDescription>Detalhamento dos benefícios concedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(resumo.data as any)?.tipos?.map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {iconMap[t.tipo] || <Gift className="w-5 h-5 text-slate-500" />}
                    <div>
                      <p className="font-medium">{t.tipo || "N/A"}</p>
                      <p className="text-sm text-slate-500">{t.quantidade} colaboradores</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-700">{fmt(parseFloat(t.custoMensal?.toString() || "0"))}</p>
                    <p className="text-xs text-slate-500">custo mensal</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Consignados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" />Empréstimos Consignados</CardTitle>
              <CardDescription>Controle de margem consignável</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consignados.data?.emprestimos.map((e: any) => (
                  <div key={e.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{e.colaboradorNome || "N/A"}</p>
                        <p className="text-xs text-slate-500">{e.fornecedor || "N/A"}</p>
                      </div>
                      <Badge variant="outline">{e.status || "N/A"}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-slate-500">Total:</span> <span className="font-medium">{fmt(parseFloat(e.valorTotal?.toString() || "0"))}</span></div>
                      <div><span className="text-slate-500">Parcela:</span> <span className="font-medium">{fmt(parseFloat(e.valorParcela?.toString() || "0"))}</span></div>
                      <div><span className="text-slate-500">Restantes:</span> <span className="font-medium">{e.parcelasRestantes}/{e.parcelas}</span></div>
                    </div>
                  </div>
                ))}
                {consignados.data && (
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-sm text-purple-700">Total desconto mensal: <span className="font-bold">{fmt(parseFloat(consignados.data.totalDescontoMensal?.toString() || "0"))}</span></p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Relatórios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {relatorios.data?.relatorios.map((r: any) => (
                  <Button key={r.id} variant="outline" className="w-full justify-start h-auto py-3">
                    <FileText className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="text-sm">{r.nome || "N/A"}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
