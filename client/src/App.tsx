import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PontoExpandido from "./pages/PontoExpandido";
import SST from "./pages/SST";
import PortalServidor from "./pages/PortalServidor";
import IntegracaoBancaria from "./pages/IntegracaoBancaria";
import ESocialDashboard from "./pages/ESocialDashboard";
import LGPDExpandido from "./pages/LGPDExpandido";
import FolhaPagamento from "./pages/FolhaPagamento";
import Beneficios from "./pages/Beneficios";
import MedicinaOcupacional from "./pages/MedicinaOcupacional";
import Desempenho from "./pages/Desempenho";
import ControleAcesso from "./pages/ControleAcesso";
import QuadroVagas from "./pages/QuadroVagas";
import Recrutamento from "./pages/Recrutamento";
import Suporte from "./pages/Suporte";
import Auditoria from "./pages/Auditoria";
import AdminPermissoes from "./pages/AdminPermissoes";
import Relatorios from "./pages/Relatorios";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* 3.1 Folha de Pagamento */}
      <Route path="/folha" component={FolhaPagamento} />
      {/* 3.2 eSocial */}
      <Route path="/esocial" component={ESocialDashboard} />
      {/* 3.3 Controle de Ponto */}
      <Route path="/ponto" component={PontoExpandido} />
      {/* 3.4 Benefícios */}
      <Route path="/beneficios" component={Beneficios} />
      {/* 3.5 SST/SESMT */}
      <Route path="/sst" component={SST} />
      {/* 3.6 Medicina Ocupacional */}
      <Route path="/medicina" component={MedicinaOcupacional} />
      {/* 3.7 Gestão de Desempenho */}
      <Route path="/desempenho" component={Desempenho} />
      {/* 3.9 Portal do Colaborador */}
      <Route path="/portal-servidor" component={PortalServidor} />
      {/* 3.11 Controle de Acesso */}
      <Route path="/acesso" component={ControleAcesso} />
      {/* 3.12 Quadro de Vagas */}
      <Route path="/quadro-vagas" component={QuadroVagas} />
      {/* 3.13 Recrutamento e Seleção */}
      <Route path="/recrutamento" component={Recrutamento} />
      {/* 3.14 Suporte */}
      <Route path="/suporte" component={Suporte} />
      {/* Integração Bancária */}
      <Route path="/integracao-bancaria" component={IntegracaoBancaria} />
      {/* LGPD */}
      <Route path="/lgpd" component={LGPDExpandido} />
      {/* Auditoria */}
      <Route path="/auditoria" component={Auditoria} />
      {/* 3.15 Painel Administrativo */}
      <Route path="/admin" component={AdminPermissoes} />
      {/* Relatórios PDF/Excel */}
      <Route path="/relatorios" component={Relatorios} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
