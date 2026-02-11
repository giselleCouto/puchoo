# PUCHOO AI - Full Stack Integration TODO

## Fase Anterior (Concluída)
- [x] Corrigir erros de compilação TypeScript
- [x] Implementar 6 módulos básicos (Ponto, SST, Portal, Bancária, eSocial, LGPD)
- [x] Criar rotas tRPC para módulos existentes
- [x] Deploy inicial (versão 29248640)

## TR-003/2025 CIGÁS - Novos Módulos Exigidos
- [x] 3.1 Folha de Pagamento - Módulo completo com CLT, INSS, IRRF, FGTS, 13º, férias, rescisão
- [x] 3.4 Gestão de Benefícios - VT, VA/VR, plano saúde, odontológico, consignados
- [x] 3.6 Medicina Ocupacional - PCMSO, PGR, PPP, prontuário médico, ASO
- [x] 3.7 Gestão de Desempenho - Avaliação 90°/180°/270°/360°, OKRs, PDI, 9-Box
- [x] 3.8 Gestão de Ponto (Portal) - Acerto de ponto, espelho digital, assinatura eletrônica
- [x] 3.11 Controle de Acesso e Portaria - Visitantes, catracas, reconhecimento facial
- [x] 3.12 Quadro de Vagas - Planejamento, vagas efetivas/previstas, organograma
- [x] 3.13 Recrutamento e Seleção - Banco de currículos, triagem IA, fluxo aprovação

## TR-003/2025 - Atualização de Módulos Existentes
- [x] 3.2 eSocial - Adicionar todos os eventos (S-1000 a S-2400), pré-análise, DCTF Web
- [x] 3.3 Ponto/Portaria 671 - Biometria, escalas, banco de horas, feriados, integração folha
- [x] 3.5 SST/SESMT - NRs, CIPA, EPIs, CAT, PGR, dashboards indicadores
- [x] 3.9 Portal do Colaborador - Contracheque, IR, férias, treinamentos, clima organizacional
- [x] 3.10 Terminais de Ponto - Integração com terminais legados (via rotas tRPC)

## TR-003/2025 - Requisitos Tecnológicos Transversais (3.15)
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

## Fase Nova: Integração GitHub + Supabase + Permissões + PDF
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
- [ ] Push do código para GitHub (pendente)
