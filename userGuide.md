# PUCHOO AI - Guia de Uso

## Informações Gerais

**Propósito:** Sistema integrado de gestão de recursos humanos para o setor público brasileiro, oferecendo funcionalidades completas de controle de ponto, saúde ocupacional, folha de pagamento, conformidade eSocial e LGPD.

**Acesso:** Login obrigatório via autenticação Manus OAuth. Usuários autenticados acessam todos os 6 módulos do sistema.

## Powered by Manus

**Stack Tecnológico:**
- **Frontend:** React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **Backend:** Express 4 + tRPC 11 + Drizzle ORM
- **Database:** MySQL/TiDB com suporte a migrações automáticas
- **Autenticação:** Manus OAuth integrado
- **Deployment:** Auto-scaling infrastructure com global CDN

## Usando Seu Sistema

### 1. Ponto - Controle de Presença

Acesse "Ponto" na página inicial para gerenciar registros de presença com reconhecimento facial e geolocalização. Clique em "Registrar Ponto" → selecione o tipo (Entrada, Saída Almoço, Retorno ou Saída) → capture foto e localização → confirme. Visualize histórico de registros na aba "Histórico".

### 2. SST - Saúde e Segurança do Trabalho

Acesse "SST" para gerenciar exames ocupacionais e conformidade. Clique em "Agendar Exame" → preencha dados do funcionário → selecione tipo de exame → confirme. Acompanhe status de ASO (Atestado de Saúde Ocupacional), CAT (Comunicado de Acidente) e relatórios PPRA/PCMSO.

### 3. Portal do Servidor

Acesse "Portal do Servidor" para visualizar contracheques, benefícios e férias. Clique em "Contracheques" → selecione mês → visualize proventos, descontos e líquido → baixe PDF. Consulte benefícios ativos e dias de férias disponíveis.

### 4. Integração Bancária

Acesse "Integração Bancária" para processar pagamentos em lote. Clique em "Processar Pagamentos" → selecione banco e tipo (Pix, TED ou CNAB) → revise lista de funcionários → confirme processamento. Acompanhe transações e taxa de sucesso em tempo real.

### 5. eSocial

Acesse "eSocial" para gerenciar eventos e conformidade. Clique em "Enviar Eventos" → selecione tipo de evento (S-1200, S-2200, etc.) → preencha dados → confirme envio. Monitore conformidade e status de processamento dos eventos.

### 6. LGPD - Gestão de Privacidade

Acesse "LGPD" para gerenciar consentimentos e conformidade. Clique em "Solicitar Novo Consentimento" → preencha CPF, tipo e finalidade → envie. Acompanhe consentimentos ativos, solicitações pendentes e trilha de auditoria de acessos.

## Gerenciando Seu Sistema

Acesse o painel de gerenciamento via ícone no canto superior direito:

- **Settings:** Atualize título, logo e configurações gerais do sistema
- **Secrets:** Gerencie variáveis de ambiente e credenciais de integração
- **Database:** Acesse CRUD UI para gerenciar dados diretamente
- **Dashboard:** Monitore métricas de uso e disponibilidade

## Próximos Passos

Converse com o Manus AI a qualquer momento para solicitar novos recursos ou ajustes. Comece explorando o módulo "Ponto" para registrar presença e familiarize-se com a navegação do sistema antes de configurar integrações bancárias.

**Conformidade:** Todos os módulos estão em conformidade com legislação brasileira (LGPD, eSocial, INSS, IRRF e FGTS).

