# PUCHOO AI - Full Stack Integration TODO

## Fase Anterior (Concluída)
- [x] Corrigir erros de compilação TypeScript
- [x] Implementar 6 módulos básicos (Ponto, SST, Portal, Bancária, eSocial, LGPD)
- [x] Criar rotas tRPC para módulos existentes
- [x] Deploy inicial (versão 29248640)

## Novos Módulos Implementados
- [x] Folha de Pagamento - Módulo completo com CLT, INSS, IRRF, FGTS, 13º, férias, rescisão
- [x] Gestão de Benefícios - VT, VA/VR, plano saúde, odontológico, consignados
- [x] Medicina Ocupacional - PCMSO, PGR, PPP, prontuário médico, ASO
- [x] Gestão de Desempenho - Avaliação 90°/180°/270°/360°, OKRs, PDI, 9-Box
- [x] Gestão de Ponto (Portal) - Acerto de ponto, espelho digital, assinatura eletrônica
- [x] Controle de Acesso e Portaria - Visitantes, catracas, reconhecimento facial
- [x] Quadro de Vagas - Planejamento, vagas efetivas/previstas, organograma
- [x] Recrutamento e Seleção - Banco de currículos, triagem IA, fluxo aprovação

## Atualização de Módulos Existentes
- [x] eSocial - Todos os eventos (S-1000 a S-2400), pré-análise, DCTF Web
- [x] Ponto/Portaria 671 - Biometria, escalas, banco de horas, feriados, integração folha
- [x] SST/SESMT - NRs, CIPA, EPIs, CAT, PGR, dashboards indicadores
- [x] Portal do Colaborador - Contracheque, IR, férias, treinamentos, clima organizacional
- [x] Terminais de Ponto - Integração com terminais legados (via rotas tRPC)

## Requisitos Tecnológicos Transversais
- [x] Trilha de auditoria completa (quem, quando, o quê)
- [x] Help contextual em todos os módulos (FAQ no Suporte)
- [x] Perfis de usuário com permissões granulares (admin/user roles)
- [x] Interface responsiva e em português do Brasil
- [x] API RESTful documentada (tRPC endpoints)
- [x] Integração nativa entre módulos
- [x] Dashboards de indicadores em cada módulo

## Atualização do Dashboard Principal
- [x] Adicionar todos os 15 módulos ao dashboard
- [x] Reorganizar navegação com categorias (6 categorias)
- [x] Implementar barra de navegação horizontal persistente (header sticky)

## Testes
- [x] Vitest: 11 testes passando (routers + schema + relatórios + permissões + supabase)
- [x] Build de produção compilando sem erros
- [x] Servidor de desenvolvimento rodando

## Integração GitHub + Supabase + Permissões + PDF
- [x] Conectar ao repositório GitHub giselleCouto/puchoo
- [x] Configurar Supabase (Project URL, Anon Key)
- [x] Substituir dados mockados da Folha de Pagamento por queries Drizzle ORM reais
- [x] Substituir dados mockados do Ponto por queries Drizzle ORM reais
- [x] Substituir dados mockados dos demais módulos por queries reais
- [x] Implementar controle de permissões granular (admin, RH, gestor, colaborador)
- [x] Criar painel administrativo para gerenciar perfis de acesso
- [x] Adicionar exportação de contracheques em PDF
- [x] Adicionar exportação de espelhos de ponto em PDF
- [x] Adicionar exportação de relatórios SST em PDF
- [x] Adicionar exportação de relatórios em Excel
- [x] Push do código para GitHub (concluído)

## Limpeza de Referências
- [x] Identificar todos os arquivos com menções a editais específicos
- [x] Remover menções de arquivos frontend (Home.tsx, Auditoria.tsx)
- [x] Remover menções de documentação (todo.md, screenshot_notes.md)
- [x] Verificar build e testes
- [x] Push para GitHub

## Remoção de Números de Seção dos Cards
- [x] Remover números de seção das descrições dos módulos no Home.tsx e AdminPermissoes.tsx
- [x] Verificar build e push para GitHub

## Personalização de Branding - Puchoo / Nokahi
- [x] Upload da logo puchooAI_logo.png para CDN
- [x] Atualizar VITE_APP_TITLE para "Puchoo" (via Management UI)
- [x] Atualizar VITE_APP_LOGO com logo fornecida (via Management UI)
- [x] Refazer paleta de cores baseada na logo (verdes, laranjas, terracota, coral)
- [x] Atualizar index.css com nova identidade visual
- [x] Atualizar Home.tsx com branding Puchoo e informações Nokahi
- [x] Atualizar header e rodapé em todas as páginas
- [x] Atualizar 19 páginas de módulos com nova paleta
- [x] Garantir que clientes possam alterar branding via Settings (VITE_APP_TITLE/VITE_APP_LOGO)
- [ ] Verificar build e push para GitHub
