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
import SobreNokahi from "./pages/SobreNokahi";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Folha de Pagamento */}
      <Route path="/folha" component={FolhaPagamento} />
      {/* eSocial */}
      <Route path="/esocial" component={ESocialDashboard} />
      {/* Controle de Ponto */}
      <Route path="/ponto" component={PontoExpandido} />
      {/* Benefícios */}
      <Route path="/beneficios" component={Beneficios} />
      {/* SST/SESMT */}
      <Route path="/sst" component={SST} />
      {/* Medicina Ocupacional */}
      <Route path="/medicina" component={MedicinaOcupacional} />
      {/* Gestão de Desempenho */}
      <Route path="/desempenho" component={Desempenho} />
      {/* Portal do Colaborador */}
      <Route path="/portal-servidor" component={PortalServidor} />
      {/* Controle de Acesso */}
      <Route path="/acesso" component={ControleAcesso} />
      {/* Quadro de Vagas */}
      <Route path="/quadro-vagas" component={QuadroVagas} />
      {/* Recrutamento e Seleção */}
      <Route path="/recrutamento" component={Recrutamento} />
      {/* Suporte */}
      <Route path="/suporte" component={Suporte} />
      {/* Integração Bancária */}
      <Route path="/integracao-bancaria" component={IntegracaoBancaria} />
      {/* LGPD */}
      <Route path="/lgpd" component={LGPDExpandido} />
      {/* Auditoria */}
      <Route path="/auditoria" component={Auditoria} />
      {/* Painel Administrativo */}
      <Route path="/admin" component={AdminPermissoes} />
      {/* Relatórios PDF/Excel */}
      <Route path="/relatorios" component={Relatorios} />
      {/* Sobre a Nokahi */}
      <Route path="/sobre" component={SobreNokahi} />
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
