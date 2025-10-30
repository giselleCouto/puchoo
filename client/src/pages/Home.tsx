import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Clock, Shield, Users, Banknote, FileText, Lock } from "lucide-react";

const modules = [
  {
    id: "ponto",
    title: "Ponto",
    description: "Controle de presença com reconhecimento facial e geolocalização",
    icon: Clock,
    path: "/ponto",
    color: "bg-blue-500",
  },
  {
    id: "sst",
    title: "SST",
    description: "Saúde e Segurança do Trabalho - Exames, ASO, CAT e relatórios",
    icon: Shield,
    path: "/sst",
    color: "bg-green-500",
  },
  {
    id: "portal",
    title: "Portal do Servidor",
    description: "Contracheques, benefícios, férias e documentos pessoais",
    icon: Users,
    path: "/portal-servidor",
    color: "bg-purple-500",
  },
  {
    id: "bancaria",
    title: "Integração Bancária",
    description: "Pagamentos em lote via Pix, TED e CNAB",
    icon: Banknote,
    path: "/integracao-bancaria",
    color: "bg-amber-500",
  },
  {
    id: "esocial",
    title: "eSocial",
    description: "Gestão de eventos e conformidade com legislação",
    icon: FileText,
    path: "/esocial",
    color: "bg-red-500",
  },
  {
    id: "lgpd",
    title: "LGPD",
    description: "Conformidade com Lei Geral de Proteção de Dados",
    icon: Lock,
    path: "/lgpd",
    color: "bg-indigo-500",
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
        <div className="text-center max-w-md">
          {APP_LOGO && (
            <img src={APP_LOGO} alt="Logo" className="h-16 w-16 mx-auto mb-4" />
          )}
          <h1 className="text-4xl font-bold text-white mb-2">{APP_TITLE}</h1>
          <p className="text-slate-300 mb-8">
            Sistema completo de gestão de pessoas, folha de pagamento e aprendizagem organizacional para o setor público brasileiro.
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
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && (
              <img src={APP_LOGO} alt="Logo" className="h-10 w-10" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{APP_TITLE}</h1>
              <p className="text-sm text-slate-500">Bem-vindo, {user?.name || "Usuário"}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="text-slate-700 border-slate-300"
          >
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Módulos do Sistema</h2>
          <p className="text-slate-600">
            Acesse os diferentes módulos para gerenciar recursos humanos, folha de pagamento e conformidade.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link key={module.id} href={module.path}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = module.path;
                      }}
                    >
                      Acessar
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Sobre o PUCHOO AI</h3>
          <p className="text-slate-600 mb-4">
            O PUCHOO AI é um sistema integrado desenvolvido especificamente para atender às necessidades do setor público brasileiro. 
            Ele oferece funcionalidades completas para gestão de pessoas, processamento de folha de pagamento com cálculos de INSS, IRRF e FGTS, 
            controle de ponto com reconhecimento facial, gestão de saúde e segurança do trabalho, integração bancária e conformidade com legislação.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <strong>Recursos Principais:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Controle de ponto com IA</li>
                <li>Gestão de SST completa</li>
                <li>Portal do servidor integrado</li>
              </ul>
            </div>
            <div>
              <strong>Conformidade:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>eSocial integrado</li>
                <li>LGPD compliance</li>
                <li>Segurança de dados</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

