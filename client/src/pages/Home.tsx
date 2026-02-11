import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  DollarSign, FileText, Clock, Gift, Shield, Stethoscope,
  Target, Users, ShieldCheck, LayoutGrid, UserSearch,
  Headphones, Banknote, Lock, ScrollText, FileDown
} from "lucide-react";

const moduleCategories = [
  {
    category: "Gestão de Pessoal",
    modules: [
      { id: "folha", title: "Folha de Pagamento", description: "Processamento completo de folha, encargos, férias, rescisões e obrigações acessórias (3.1)", icon: DollarSign, path: "/folha", color: "bg-emerald-500" },
      { id: "esocial", title: "eSocial", description: "Documentos eletrônicos, eventos S-1000 a S-2299, DCTFWeb e conformidade (3.2)", icon: FileText, path: "/esocial", color: "bg-red-500" },
      { id: "ponto", title: "Controle de Ponto", description: "Portaria 671, reconhecimento facial, geolocalização, banco de horas e escalas (3.3)", icon: Clock, path: "/ponto", color: "bg-blue-500" },
      { id: "beneficios", title: "Gestão de Benefícios", description: "VT, VA, VR, planos de saúde, consignados e controle de margem (3.4)", icon: Gift, path: "/beneficios", color: "bg-purple-500" },
    ],
  },
  {
    category: "Saúde e Segurança",
    modules: [
      { id: "sst", title: "SST/SESMT", description: "PGR, PCMSO, LTCAT, PPP, CIPA, EPIs, NRs e gestão de riscos (3.5)", icon: Shield, path: "/sst", color: "bg-green-500" },
      { id: "medicina", title: "Medicina Ocupacional", description: "Prontuários, afastamentos, gestantes, exames ocupacionais e CID (3.6)", icon: Stethoscope, path: "/medicina", color: "bg-rose-500" },
    ],
  },
  {
    category: "Desenvolvimento e Seleção",
    modules: [
      { id: "desempenho", title: "Gestão de Desempenho", description: "Avaliações 90°/180°/360°, OKRs, PDI, 9-Box e feedback contínuo (3.7)", icon: Target, path: "/desempenho", color: "bg-amber-500" },
      { id: "quadro", title: "Quadro de Vagas", description: "Planejamento de vagas por departamento, orçamento e lotação (3.12)", icon: LayoutGrid, path: "/quadro-vagas", color: "bg-teal-500" },
      { id: "recrutamento", title: "Recrutamento e Seleção", description: "Vagas, candidatos, triagem IA, pipeline e contratação (3.13)", icon: UserSearch, path: "/recrutamento", color: "bg-indigo-500" },
    ],
  },
  {
    category: "Portal e Acesso",
    modules: [
      { id: "portal", title: "Portal do Colaborador", description: "Contracheques, férias, documentos, treinamentos e comunicados (3.9)", icon: Users, path: "/portal-servidor", color: "bg-violet-500" },
      { id: "acesso", title: "Controle de Acesso", description: "Catracas faciais, visitantes, portaria e log de acessos (3.11)", icon: ShieldCheck, path: "/acesso", color: "bg-slate-700" },
    ],
  },
  {
    category: "Financeiro e Integrações",
    modules: [
      { id: "bancaria", title: "Integração Bancária", description: "Pagamentos em lote via Pix, TED, CNAB e conciliação (3.1.4)", icon: Banknote, path: "/integracao-bancaria", color: "bg-amber-600" },
    ],
  },
  {
    category: "Conformidade e Suporte",
    modules: [
      { id: "lgpd", title: "LGPD", description: "Consentimentos, solicitações de titulares, DPIA e trilha de auditoria (3.15.1)", icon: Lock, path: "/lgpd", color: "bg-sky-600" },
      { id: "auditoria", title: "Trilha de Auditoria", description: "Registro de inclusão, alteração, exclusão e consulta por módulo (3.15.2)", icon: ScrollText, path: "/auditoria", color: "bg-gray-700" },
      { id: "suporte", title: "Suporte ao Cliente", description: "Chamados, SLA, FAQ e base de conhecimento (3.14)", icon: Headphones, path: "/suporte", color: "bg-cyan-500" },
    ],
  },
];

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="text-center max-w-lg">
          {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-20 w-20 mx-auto mb-6" />}
          <h1 className="text-4xl font-bold text-white mb-3">{APP_TITLE}</h1>
          <p className="text-slate-300 mb-2 text-lg">Sistema de Gestão de Pessoas</p>
          <p className="text-slate-400 mb-8 text-sm">
            Conforme TR-003/2025 CIGÁS - Folha de Pagamento, eSocial, Ponto Eletrônico, SST, Benefícios, Desempenho, Recrutamento e mais.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-9 w-9" />}
            <div>
              <h1 className="text-xl font-bold text-slate-900">{APP_TITLE}</h1>
              <p className="text-xs text-slate-500">TR-003/2025 CIGÁS | Bem-vindo, {user?.name || "Usuário"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">15 módulos ativos</span>
            <Link href="/relatorios"><Button variant="outline" size="sm" className="gap-1 text-orange-600 border-orange-200 hover:bg-orange-50"><FileDown className="w-3.5 h-3.5" />Relatórios</Button></Link>
            {user?.role === "admin" && (
              <Link href="/admin"><Button variant="outline" size="sm" className="gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"><Shield className="w-3.5 h-3.5" />Admin</Button></Link>
            )}
            <Button onClick={logout} variant="outline" size="sm">Sair</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Módulos do Sistema</h2>
          <p className="text-slate-600 text-sm">
            Gestão completa de pessoas conforme Termo de Referência TR-003/2025 da CIGÁS.
          </p>
        </div>

        {/* Modules by Category */}
        <div className="space-y-8">
          {moduleCategories.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{cat.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cat.modules.map((mod) => {
                  const IconComponent = mod.icon;
                  return (
                    <Link key={mod.id} href={mod.path}>
                      <Card className="h-full hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`${mod.color} w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <CardTitle className="text-base">{mod.title}</CardTitle>
                          </div>
                          <CardDescription className="text-xs leading-relaxed">{mod.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-10 bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 mb-3">Sobre o Sistema</h3>
          <p className="text-sm text-slate-600 mb-4">
            Sistema integrado de Gestão de Pessoas desenvolvido conforme o Termo de Referência TR-003/2025 da CIGÁS, 
            contemplando 15 módulos para gestão completa de folha de pagamento, eSocial, ponto eletrônico (Portaria 671), 
            benefícios, SST/SESMT, medicina ocupacional, desempenho, portal do colaborador, controle de acesso, 
            quadro de vagas, recrutamento e seleção, LGPD e auditoria.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-slate-900">15</p>
              <p className="text-xs text-slate-500">Módulos</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-emerald-600">40</p>
              <p className="text-xs text-slate-500">Tabelas BD</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">100%</p>
              <p className="text-xs text-slate-500">eSocial</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-purple-600">LGPD</p>
              <p className="text-xs text-slate-500">Conforme</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
