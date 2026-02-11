import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  DollarSign, FileText, Clock, Gift, Shield, Stethoscope,
  Target, Users, ShieldCheck, LayoutGrid, UserSearch,
  Headphones, Banknote, Lock, ScrollText, FileDown, Settings
} from "lucide-react";

const moduleCategories = [
  {
    category: "Gestão de Pessoal",
    color: "text-puchoo-green-dark",
    modules: [
      { id: "folha", title: "Folha de Pagamento", description: "Processamento completo de folha, encargos, férias, rescisões e obrigações acessórias", icon: DollarSign, path: "/folha", color: "bg-puchoo-green" },
      { id: "esocial", title: "eSocial", description: "Documentos eletrônicos, eventos S-1000 a S-2299, DCTFWeb e conformidade", icon: FileText, path: "/esocial", color: "bg-puchoo-coral" },
      { id: "ponto", title: "Controle de Ponto", description: "Portaria 671, reconhecimento facial, geolocalização, banco de horas e escalas", icon: Clock, path: "/ponto", color: "bg-puchoo-green-dark" },
      { id: "beneficios", title: "Gestão de Benefícios", description: "VT, VA, VR, planos de saúde, consignados e controle de margem", icon: Gift, path: "/beneficios", color: "bg-puchoo-orange" },
    ],
  },
  {
    category: "Saúde e Segurança",
    color: "text-puchoo-green",
    modules: [
      { id: "sst", title: "SST/SESMT", description: "PGR, PCMSO, LTCAT, PPP, CIPA, EPIs, NRs e gestão de riscos", icon: Shield, path: "/sst", color: "bg-puchoo-green-light" },
      { id: "medicina", title: "Medicina Ocupacional", description: "Prontuários, afastamentos, gestantes, exames ocupacionais e CID", icon: Stethoscope, path: "/medicina", color: "bg-puchoo-coral-light" },
    ],
  },
  {
    category: "Desenvolvimento e Seleção",
    color: "text-puchoo-orange",
    modules: [
      { id: "desempenho", title: "Gestão de Desempenho", description: "Avaliações 90°/180°/360°, OKRs, PDI, 9-Box e feedback contínuo", icon: Target, path: "/desempenho", color: "bg-puchoo-orange" },
      { id: "quadro", title: "Quadro de Vagas", description: "Planejamento de vagas por departamento, orçamento e lotação", icon: LayoutGrid, path: "/quadro-vagas", color: "bg-puchoo-terracotta" },
      { id: "recrutamento", title: "Recrutamento e Seleção", description: "Vagas, candidatos, triagem IA, pipeline e contratação", icon: UserSearch, path: "/recrutamento", color: "bg-puchoo-green" },
    ],
  },
  {
    category: "Portal e Acesso",
    color: "text-puchoo-terracotta",
    modules: [
      { id: "portal", title: "Portal do Colaborador", description: "Contracheques, férias, documentos, treinamentos e comunicados", icon: Users, path: "/portal-servidor", color: "bg-puchoo-terracotta-light" },
      { id: "acesso", title: "Controle de Acesso", description: "Catracas faciais, visitantes, portaria e log de acessos", icon: ShieldCheck, path: "/acesso", color: "bg-puchoo-green-dark" },
    ],
  },
  {
    category: "Financeiro e Integrações",
    color: "text-puchoo-coral",
    modules: [
      { id: "bancaria", title: "Integração Bancária", description: "Pagamentos em lote via Pix, TED, CNAB e conciliação", icon: Banknote, path: "/integracao-bancaria", color: "bg-puchoo-orange-light" },
    ],
  },
  {
    category: "Conformidade e Suporte",
    color: "text-puchoo-green-dark",
    modules: [
      { id: "lgpd", title: "LGPD", description: "Consentimentos, solicitações de titulares, DPIA e trilha de auditoria", icon: Lock, path: "/lgpd", color: "bg-puchoo-green" },
      { id: "auditoria", title: "Trilha de Auditoria", description: "Registro de inclusão, alteração, exclusão e consulta por módulo", icon: ScrollText, path: "/auditoria", color: "bg-puchoo-terracotta" },
      { id: "suporte", title: "Suporte ao Cliente", description: "Chamados, SLA, FAQ e base de conhecimento", icon: Headphones, path: "/suporte", color: "bg-puchoo-coral" },
    ],
  },
];

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-puchoo-green-dark to-puchoo-green">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-puchoo-green-dark via-puchoo-green to-puchoo-green-light p-4">
        <div className="text-center max-w-lg">
          {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-28 mx-auto mb-6 drop-shadow-lg" />}
          <h1 className="text-4xl font-bold text-white mb-3">{APP_TITLE}</h1>
          <p className="text-green-100 mb-2 text-lg">Sistema Inteligente de Gestão de Pessoas</p>
          <p className="text-green-200/80 mb-8 text-sm">
            Folha de Pagamento, eSocial, Ponto Eletrônico, SST, Benefícios, Desempenho, Recrutamento e mais.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-puchoo-orange hover:bg-puchoo-coral text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Fazer Login
          </Button>
          <p className="text-green-200/60 text-xs mt-8">
            Uma solução <strong className="text-green-100">Nokahi Consultoria e Soluções Ltda</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puchoo-warm-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-puchoo-green-50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-10" />}
            <div>
              <h1 className="text-xl font-bold text-puchoo-green-dark">{APP_TITLE}</h1>
              <p className="text-xs text-puchoo-terracotta">Bem-vindo, {user?.name || "Usuário"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-puchoo-green hidden sm:inline">15 módulos ativos</span>
            <Link href="/relatorios">
              <Button variant="outline" size="sm" className="gap-1 text-puchoo-orange border-puchoo-orange-light hover:bg-puchoo-warm-100">
                <FileDown className="w-3.5 h-3.5" />Relatórios
              </Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-1 text-puchoo-green-dark border-puchoo-green-50 hover:bg-puchoo-green-50">
                  <Settings className="w-3.5 h-3.5" />Admin
                </Button>
              </Link>
            )}
            <Button onClick={logout} variant="outline" size="sm" className="text-puchoo-coral border-puchoo-coral-light hover:bg-red-50">Sair</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-puchoo-green-dark mb-1">Módulos do Sistema</h2>
          <p className="text-puchoo-terracotta text-sm">
            Gestão completa de pessoas para sua organização.
          </p>
        </div>

        {/* Modules by Category */}
        <div className="space-y-8">
          {moduleCategories.map((cat) => (
            <div key={cat.category}>
              <h3 className={`text-sm font-semibold ${cat.color} uppercase tracking-wider mb-3`}>{cat.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cat.modules.map((mod) => {
                  const IconComponent = mod.icon;
                  return (
                    <Link key={mod.id} href={mod.path}>
                      <Card className="h-full hover:shadow-lg hover:border-puchoo-green-light transition-all cursor-pointer group bg-white">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`${mod.color} w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <CardTitle className="text-base text-puchoo-green-dark">{mod.title}</CardTitle>
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
        <div className="mt-10 bg-white rounded-lg shadow-sm p-6 border border-puchoo-green-50">
          <div className="flex items-start gap-4 mb-4">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-12 opacity-80" />}
            <div>
              <h3 className="text-base font-semibold text-puchoo-green-dark mb-1">Sobre o {APP_TITLE}</h3>
              <p className="text-sm text-puchoo-terracotta">
                Sistema integrado de Gestão de Pessoas desenvolvido para atender às necessidades da sua organização, 
                contemplando 15 módulos para gestão completa de folha de pagamento, eSocial, ponto eletrônico (Portaria 671), 
                benefícios, SST/SESMT, medicina ocupacional, desempenho, portal do colaborador, controle de acesso, 
                quadro de vagas, recrutamento e seleção, LGPD e auditoria.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-puchoo-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-puchoo-green-dark">15</p>
              <p className="text-xs text-puchoo-green">Módulos</p>
            </div>
            <div className="bg-puchoo-warm-100 rounded-lg p-3">
              <p className="text-2xl font-bold text-puchoo-orange">40</p>
              <p className="text-xs text-puchoo-terracotta">Tabelas BD</p>
            </div>
            <div className="bg-puchoo-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-puchoo-green">100%</p>
              <p className="text-xs text-puchoo-green-dark">eSocial</p>
            </div>
            <div className="bg-puchoo-warm-100 rounded-lg p-3">
              <p className="text-2xl font-bold text-puchoo-coral">LGPD</p>
              <p className="text-xs text-puchoo-terracotta">Conforme</p>
            </div>
          </div>
          
          {/* Nokahi Footer */}
          <div className="mt-6 pt-4 border-t border-puchoo-green-50 text-center">
            <p className="text-xs text-puchoo-terracotta">
              Uma solução <strong className="text-puchoo-green-dark">Nokahi Consultoria e Soluções Ltda</strong>
            </p>
            <p className="text-xs text-puchoo-terracotta-light mt-0.5">
              CNPJ 34.849.449/0001-40
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
