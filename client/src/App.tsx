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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ponto" component={PontoExpandido} />
      <Route path="/sst" component={SST} />
      <Route path="/portal-servidor" component={PortalServidor} />
      <Route path="/integracao-bancaria" component={IntegracaoBancaria} />
      <Route path="/esocial" component={ESocialDashboard} />
      <Route path="/lgpd" component={LGPDExpandido} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

