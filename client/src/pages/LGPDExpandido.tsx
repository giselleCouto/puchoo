import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Shield, FileText, Users, AlertTriangle, CheckCircle, 
  XCircle, Clock, Download, Eye, Search, Lock, Unlock
} from 'lucide-react';

const LGPDExpandido = () => {
  const [buscaTitular, setBuscaTitular] = useState('');

  // Estatísticas
  const estatisticas = {
    titulares: 1247,
    consentimentosAtivos: 1180,
    solicitacoesPendentes: 8,
    incidentes: 0,
    conformidade: 94.6
  };

  // Consentimentos
  const consentimentos = [
    { id: 1, titular: 'João Silva', cpf: '123.456.789-00', tipo: 'Uso de Dados Pessoais', status: 'Ativo', data: '2025-01-15', validade: '2026-01-15' },
    { id: 2, titular: 'Maria Santos', cpf: '987.654.321-00', tipo: 'Compartilhamento com Terceiros', status: 'Ativo', data: '2025-02-20', validade: '2026-02-20' },
    { id: 3, titular: 'Pedro Costa', cpf: '456.789.123-00', tipo: 'Marketing', status: 'Revogado', data: '2024-12-10', validade: '-' },
  ];

  // Solicitações de titulares
  const solicitacoes = [
    { id: 1, tipo: 'Acesso', titular: 'Ana Paula', cpf: '321.654.987-00', data: '2025-10-15', status: 'Pendente', prazo: '2025-10-30' },
    { id: 2, tipo: 'Retificação', titular: 'Carlos Lima', cpf: '789.123.456-00', data: '2025-10-14', status: 'Em Análise', prazo: '2025-10-29' },
    { id: 3, tipo: 'Exclusão', titular: 'Juliana Souza', cpf: '654.321.987-00', data: '2025-10-10', status: 'Concluída', prazo: '2025-10-25' },
    { id: 4, tipo: 'Portabilidade', titular: 'Roberto Alves', cpf: '147.258.369-00', data: '2025-10-08', status: 'Concluída', prazo: '2025-10-23' },
  ];

  // Trilha de auditoria
  const trilhaAuditoria = [
    { id: 1, usuario: 'admin@puchoo.ai', acao: 'Acesso a dados de João Silva', data: '2025-10-18 14:30:15', ip: '192.168.1.100', resultado: 'Sucesso' },
    { id: 2, usuario: 'gestor@puchoo.ai', acao: 'Exportação de relatório de funcionários', data: '2025-10-18 12:15:30', ip: '192.168.1.105', resultado: 'Sucesso' },
    { id: 3, usuario: 'rh@puchoo.ai', acao: 'Tentativa de acesso a dados sensíveis', data: '2025-10-18 10:45:22', ip: '192.168.1.110', resultado: 'Negado' },
    { id: 4, usuario: 'admin@puchoo.ai', acao: 'Atualização de consentimento', data: '2025-10-17 16:20:45', ip: '192.168.1.100', resultado: 'Sucesso' },
  ];

  // Inventário de dados
  const inventarioDados = [
    { categoria: 'Dados Pessoais', tipos: 'Nome, CPF, RG, Data de Nascimento', finalidade: 'Gestão de Funcionários', base_legal: 'Contrato de Trabalho', retencao: '5 anos após desligamento' },
    { categoria: 'Dados Financeiros', tipos: 'Salário, Conta Bancária, Benefícios', finalidade: 'Pagamento de Salários', base_legal: 'Obrigação Legal', retencao: '10 anos' },
    { categoria: 'Dados de Saúde', tipos: 'ASO, Exames, Atestados', finalidade: 'Saúde e Segurança', base_legal: 'Obrigação Legal', retencao: '20 anos' },
    { categoria: 'Dados de Localização', tipos: 'GPS de Ponto Eletrônico', finalidade: 'Controle de Jornada', base_legal: 'Consentimento', retencao: '2 anos' },
  ];

  // Relatórios de conformidade
  const relatoriosConformidade = [
    { nome: 'Relatório Mensal de Conformidade', periodo: 'Outubro/2025', status: 'Gerado', data: '2025-10-01', conformidade: 94.6 },
    { nome: 'Relatório de Incidentes', periodo: 'Setembro/2025', status: 'Gerado', data: '2025-09-01', conformidade: 95.2 },
    { nome: 'Relatório de Consentimentos', periodo: 'Agosto/2025', status: 'Gerado', data: '2025-08-01', conformidade: 93.8 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">LGPD - Gestão de Privacidade</h1>
          <p className="text-puchoo-terracotta">Conformidade com a Lei Geral de Proteção de Dados</p>
        </div>
        <Badge variant="default" className="text-lg px-4 py-2">
          <Shield className="w-4 h-4 mr-2" />
          Conformidade: {estatisticas.conformidade}%
        </Badge>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Titulares</p>
                <p className="text-3xl font-bold">{estatisticas.titulares}</p>
              </div>
              <Users className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Consentimentos</p>
                <p className="text-3xl font-bold text-puchoo-green">{estatisticas.consentimentosAtivos}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Solicitações</p>
                <p className="text-3xl font-bold text-puchoo-coral">{estatisticas.solicitacoesPendentes}</p>
              </div>
              <Clock className="w-10 h-10 text-puchoo-coral" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Incidentes</p>
                <p className="text-3xl font-bold text-puchoo-green">{estatisticas.incidentes}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Conformidade</p>
                <p className="text-3xl font-bold text-puchoo-green">{estatisticas.conformidade}%</p>
              </div>
              <Shield className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="consentimentos" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="consentimentos">Consentimentos</TabsTrigger>
          <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
          <TabsTrigger value="inventario">Inventário</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        {/* ABA: CONSENTIMENTOS */}
        <TabsContent value="consentimentos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestão de Consentimentos</CardTitle>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Buscar por nome ou CPF..." 
                    value={buscaTitular}
                    onChange={(e) => setBuscaTitular(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titular</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Tipo de Consentimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Consentimento</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consentimentos.map((cons) => (
                    <TableRow key={cons.id}>
                      <TableCell className="font-medium">{cons.titular}</TableCell>
                      <TableCell className="font-mono text-sm">{cons.cpf}</TableCell>
                      <TableCell>{cons.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={cons.status === 'Ativo' ? 'default' : 'secondary'}>
                          {cons.status === 'Ativo' ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                          {cons.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{cons.data}</TableCell>
                      <TableCell>{cons.validade}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solicitar Novo Consentimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPF do Titular</Label>
                  <Input placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Consentimento</Label>
                  <Input placeholder="Ex: Uso de Dados Pessoais" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Finalidade</Label>
                <Textarea placeholder="Descreva a finalidade do tratamento dos dados..." rows={3} />
              </div>
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Enviar Solicitação de Consentimento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: SOLICITAÇÕES */}
        <TabsContent value="solicitacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Titulares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-puchoo-green-50 rounded-lg">
                <p className="text-sm text-puchoo-green-dark">
                  <strong>Prazo Legal:</strong> As solicitações devem ser respondidas em até 15 dias, 
                  podendo ser prorrogado por mais 15 dias mediante justificativa.
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Titular</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Data da Solicitação</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitacoes.map((sol) => (
                    <TableRow key={sol.id}>
                      <TableCell>
                        <Badge variant="outline">{sol.tipo}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{sol.titular}</TableCell>
                      <TableCell className="font-mono text-sm">{sol.cpf}</TableCell>
                      <TableCell>{sol.data}</TableCell>
                      <TableCell className="text-sm">{sol.prazo}</TableCell>
                      <TableCell>
                        <Badge variant={
                          sol.status === 'Concluída' ? 'default' :
                          sol.status === 'Em Análise' ? 'secondary' : 'destructive'
                        }>
                          {sol.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          {sol.status === 'Concluída' ? 'Ver Resposta' : 'Processar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de Solicitações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-2">
                  <CardContent className="pt-6 text-center">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-puchoo-green" />
                    <h3 className="font-bold">Acesso</h3>
                    <p className="text-sm text-puchoo-terracotta">Solicitar cópia dos dados</p>
                  </CardContent>
                </Card>
                <Card className="border-2">
                  <CardContent className="pt-6 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-puchoo-green" />
                    <h3 className="font-bold">Retificação</h3>
                    <p className="text-sm text-puchoo-terracotta">Corrigir dados incorretos</p>
                  </CardContent>
                </Card>
                <Card className="border-2">
                  <CardContent className="pt-6 text-center">
                    <XCircle className="w-8 h-8 mx-auto mb-2 text-puchoo-coral" />
                    <h3 className="font-bold">Exclusão</h3>
                    <p className="text-sm text-puchoo-terracotta">Remover dados pessoais</p>
                  </CardContent>
                </Card>
                <Card className="border-2">
                  <CardContent className="pt-6 text-center">
                    <Download className="w-8 h-8 mx-auto mb-2 text-puchoo-green" />
                    <h3 className="font-bold">Portabilidade</h3>
                    <p className="text-sm text-puchoo-terracotta">Transferir dados</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: AUDITORIA */}
        <TabsContent value="auditoria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trilha de Auditoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Resultado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trilhaAuditoria.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.usuario}</TableCell>
                      <TableCell>{log.acao}</TableCell>
                      <TableCell className="text-sm">{log.data}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell>
                        <Badge variant={log.resultado === 'Sucesso' ? 'default' : 'destructive'}>
                          {log.resultado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: INVENTÁRIO */}
        <TabsContent value="inventario" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventário de Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipos de Dados</TableHead>
                    <TableHead>Finalidade</TableHead>
                    <TableHead>Base Legal</TableHead>
                    <TableHead>Retenção</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventarioDados.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-bold">{item.categoria}</TableCell>
                      <TableCell className="text-sm">{item.tipos}</TableCell>
                      <TableCell className="text-sm">{item.finalidade}</TableCell>
                      <TableCell className="text-sm">{item.base_legal}</TableCell>
                      <TableCell className="text-sm">{item.retencao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: RELATÓRIOS */}
        <TabsContent value="relatorios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Conformidade</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Relatório</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Data de Geração</TableHead>
                    <TableHead>Conformidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatoriosConformidade.map((rel, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{rel.nome}</TableCell>
                      <TableCell>{rel.periodo}</TableCell>
                      <TableCell>{rel.data}</TableCell>
                      <TableCell>
                        <Badge variant="default">{rel.conformidade}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{rel.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <h3 className="font-bold text-lg mb-4">Gerar Novos Relatórios</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20">
                    <FileText className="w-6 h-6 mr-2" />
                    Relatório de Conformidade
                  </Button>
                  <Button variant="outline" className="h-20">
                    <FileText className="w-6 h-6 mr-2" />
                    Relatório de Incidentes
                  </Button>
                  <Button variant="outline" className="h-20">
                    <FileText className="w-6 h-6 mr-2" />
                    Relatório de Consentimentos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LGPDExpandido;

