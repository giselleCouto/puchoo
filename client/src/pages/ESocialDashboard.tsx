import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  FileText, Send, CheckCircle, XCircle, Clock, AlertTriangle,
  Download, Upload, RefreshCw, Eye, Settings, TrendingUp
} from 'lucide-react';

const ESocialDashboard = () => {
  const [processando, setProcessando] = useState(false);

  // Estatísticas
  const estatisticas = {
    eventosEnviados: 1247,
    aguardandoProcessamento: 5,
    processadosComSucesso: 1230,
    comErros: 12,
    conformidade: 98.6
  };

  // Eventos por categoria
  const eventosPorCategoria = [
    { categoria: 'Tabelas', total: 45, sucesso: 45, erros: 0 },
    { categoria: 'Não Periódicos', total: 856, sucesso: 850, erros: 6 },
    { categoria: 'Periódicos', total: 346, sucesso: 335, erros: 11 },
  ];

  // Eventos recentes
  const eventosRecentes = [
    { id: 1, tipo: 'S-1200', descricao: 'Remuneração de trabalhador', data: '2025-10-18 14:30', status: 'Processado', protocolo: 'ESO-123456' },
    { id: 2, tipo: 'S-2200', descricao: 'Cadastramento Inicial do Vínculo', data: '2025-10-18 12:15', status: 'Processado', protocolo: 'ESO-123455' },
    { id: 3, tipo: 'S-2206', descricao: 'Alteração de Contrato de Trabalho', data: '2025-10-18 10:45', status: 'Processado', protocolo: 'ESO-123454' },
    { id: 4, tipo: 'S-2299', descricao: 'Desligamento', data: '2025-10-18 09:30', status: 'Erro', protocolo: '-' },
    { id: 5, tipo: 'S-1210', descricao: 'Pagamentos de Rendimentos do Trabalho', data: '2025-10-17 16:20', status: 'Processado', protocolo: 'ESO-123453' },
  ];

  // Eventos com erro
  const eventosComErro = [
    { id: 1, tipo: 'S-2299', funcionario: 'João Silva', erro: 'CPF inválido', data: '2025-10-18 09:30', tentativas: 1 },
    { id: 2, tipo: 'S-1200', funcionario: 'Maria Santos', erro: 'Rubrica não cadastrada', data: '2025-10-17 14:20', tentativas: 2 },
    { id: 3, tipo: 'S-2206', funcionario: 'Pedro Costa', erro: 'Data de admissão inconsistente', data: '2025-10-16 11:15', tentativas: 1 },
  ];

  // Eventos pendentes
  const eventosPendentes = [
    { id: 1, tipo: 'S-1200', descricao: 'Folha de Pagamento - Outubro/2025', funcionarios: 45, prioridade: 'Alta' },
    { id: 2, tipo: 'S-1299', descricao: 'Fechamento da Folha - Outubro/2025', funcionarios: 45, prioridade: 'Alta' },
    { id: 3, tipo: 'S-2200', descricao: 'Admissão - Ana Paula', funcionarios: 1, prioridade: 'Média' },
  ];

  // Tipos de eventos
  const tiposEventos = {
    tabelas: [
      { codigo: 'S-1000', nome: 'Informações do Empregador' },
      { codigo: 'S-1005', nome: 'Tabela de Estabelecimentos' },
      { codigo: 'S-1010', nome: 'Tabela de Rubricas' },
      { codigo: 'S-1020', nome: 'Tabela de Lotações' },
    ],
    naoPeriodicos: [
      { codigo: 'S-2200', nome: 'Cadastramento Inicial do Vínculo' },
      { codigo: 'S-2205', nome: 'Alteração de Dados Cadastrais' },
      { codigo: 'S-2206', nome: 'Alteração de Contrato' },
      { codigo: 'S-2299', nome: 'Desligamento' },
      { codigo: 'S-2300', nome: 'Trabalhador Sem Vínculo' },
    ],
    periodicos: [
      { codigo: 'S-1200', nome: 'Remuneração de Trabalhador' },
      { codigo: 'S-1210', nome: 'Pagamentos de Rendimentos' },
      { codigo: 'S-1299', nome: 'Fechamento da Folha' },
    ],
    sst: [
      { codigo: 'S-2210', nome: 'Comunicação de Acidente de Trabalho' },
      { codigo: 'S-2220', nome: 'Monitoramento da Saúde do Trabalhador' },
      { codigo: 'S-2240', nome: 'Condições Ambientais do Trabalho' },
    ]
  };

  const enviarEvento = (tipo: string) => {
    setProcessando(true);
    setTimeout(() => {
      setProcessando(false);
      alert(`Evento ${tipo} enviado com sucesso!\nProtocolo: ESO-${Math.floor(Math.random() * 1000000)}`);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-puchoo-green-dark">eSocial Dashboard</h1>
          <p className="text-puchoo-terracotta">Gestão completa de eventos eSocial</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="text-lg px-4 py-2 bg-puchoo-green text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Conformidade: {estatisticas.conformidade}%
          </Badge>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Eventos Enviados</p>
                <p className="text-3xl font-bold text-puchoo-green-dark">{estatisticas.eventosEnviados}</p>
              </div>
              <Send className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Aguardando</p>
                <p className="text-3xl font-bold text-puchoo-coral">{estatisticas.aguardandoProcessamento}</p>
              </div>
              <Clock className="w-10 h-10 text-puchoo-coral" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Com Sucesso</p>
                <p className="text-3xl font-bold text-puchoo-green">{estatisticas.processadosComSucesso}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Com Erros</p>
                <p className="text-3xl font-bold text-puchoo-coral">{estatisticas.comErros}</p>
              </div>
              <XCircle className="w-10 h-10 text-puchoo-coral" />
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
              <TrendingUp className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eventos por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-puchoo-green-dark">Eventos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventosPorCategoria.map((cat, idx) => (
              <Card key={idx} className="border-2 border-puchoo-warm-100">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-4 text-puchoo-green-dark">{cat.categoria}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-puchoo-terracotta">Total:</span>
                      <span className="font-bold text-puchoo-green-dark">{cat.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-puchoo-terracotta">Sucesso:</span>
                      <span className="font-bold text-puchoo-green">{cat.sucesso}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-puchoo-terracotta">Erros:</span>
                      <span className="font-bold text-puchoo-coral">{cat.erros}</span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-puchoo-warm-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-puchoo-green" 
                      style={{ width: `${(cat.sucesso / cat.total) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recentes" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="recentes">Eventos Recentes</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="erros">Erros</TabsTrigger>
          <TabsTrigger value="enviar">Enviar Eventos</TabsTrigger>
          <TabsTrigger value="tipos">Tipos de Eventos</TabsTrigger>
        </TabsList>

        {/* ABA: EVENTOS RECENTES */}
        <TabsContent value="recentes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-puchoo-green-dark">Últimos Eventos Enviados</CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-puchoo-warm-100">
                    <TableHead className="text-puchoo-green-dark">Tipo</TableHead>
                    <TableHead className="text-puchoo-green-dark">Descrição</TableHead>
                    <TableHead className="text-puchoo-green-dark">Data/Hora</TableHead>
                    <TableHead className="text-puchoo-green-dark">Status</TableHead>
                    <TableHead className="text-puchoo-green-dark">Protocolo</TableHead>
                    <TableHead className="text-puchoo-green-dark">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventosRecentes.map((evento) => (
                    <TableRow key={evento.id} className="border-puchoo-warm-100">
                      <TableCell className="font-mono font-bold text-puchoo-terracotta">{evento.tipo}</TableCell>
                      <TableCell className="text-puchoo-terracotta">{evento.descricao}</TableCell>
                      <TableCell className="text-puchoo-terracotta-light">{evento.data}</TableCell>
                      <TableCell>
                        <Badge className={`${evento.status === 'Processado' ? 'bg-puchoo-green-50 text-puchoo-green-dark' : 'bg-puchoo-coral-light/30 text-puchoo-coral'}`}>
                          {evento.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-puchoo-terracotta-light">{evento.protocolo}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="hover:bg-puchoo-warm-50">
                          <Eye className="w-4 h-4 text-puchoo-green" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: EVENTOS PENDENTES */}
        <TabsContent value="pendentes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-puchoo-green-dark">Eventos Pendentes de Envio</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-puchoo-warm-100">
                    <TableHead className="text-puchoo-green-dark">Tipo</TableHead>
                    <TableHead className="text-puchoo-green-dark">Descrição</TableHead>
                    <TableHead className="text-puchoo-green-dark">Funcionários</TableHead>
                    <TableHead className="text-puchoo-green-dark">Prioridade</TableHead>
                    <TableHead className="text-puchoo-green-dark">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventosPendentes.map((evento) => (
                    <TableRow key={evento.id} className="border-puchoo-warm-100">
                      <TableCell className="font-mono font-bold text-puchoo-terracotta">{evento.tipo}</TableCell>
                      <TableCell className="text-puchoo-terracotta">{evento.descricao}</TableCell>
                      <TableCell className="text-puchoo-terracotta">{evento.funcionarios}</TableCell>
                      <TableCell>
                        <Badge className={`${evento.prioridade === 'Alta' ? 'bg-puchoo-coral-light/30 text-puchoo-coral' : 'bg-amber-50 text-amber-500'}`}>
                          {evento.prioridade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" className="bg-puchoo-green hover:bg-puchoo-green-dark">
                          <Send className="w-4 h-4 mr-2" />
                          Enviar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: ERROS */}
        <TabsContent value="erros" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-puchoo-green-dark">Eventos com Erros</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-puchoo-warm-100">
                    <TableHead className="text-puchoo-green-dark">Tipo</TableHead>
                    <TableHead className="text-puchoo-green-dark">Funcionário</TableHead>
                    <TableHead className="text-puchoo-green-dark">Erro</TableHead>
                    <TableHead className="text-puchoo-green-dark">Data/Hora</TableHead>
                    <TableHead className="text-puchoo-green-dark">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventosComErro.map((evento) => (
                    <TableRow key={evento.id} className="bg-puchoo-coral-light/20 border-puchoo-coral-light">
                      <TableCell className="font-mono font-bold text-puchoo-coral">{evento.tipo}</TableCell>
                      <TableCell className="text-puchoo-coral">{evento.funcionario}</TableCell>
                      <TableCell className="text-puchoo-coral">{evento.erro}</TableCell>
                      <TableCell className="text-puchoo-coral">{evento.data}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="destructive" className="bg-puchoo-coral hover:bg-puchoo-coral-dark">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reprocessar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: ENVIAR EVENTOS */}
        <TabsContent value="enviar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-puchoo-green-dark">Envio Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-puchoo-green-50 text-puchoo-green-dark hover:bg-puchoo-green-100" onClick={() => enviarEvento('S-2200')} disabled={processando}>
                  <FileText className="w-4 h-4 mr-2" /> Cadastrar Novo Vínculo (S-2200)
                </Button>
                <Button className="w-full justify-start bg-puchoo-green-50 text-puchoo-green-dark hover:bg-puchoo-green-100" onClick={() => enviarEvento('S-2299')} disabled={processando}>
                  <FileText className="w-4 h-4 mr-2" /> Enviar Desligamento (S-2299)
                </Button>
                <Button className="w-full justify-start bg-puchoo-green-50 text-puchoo-green-dark hover:bg-puchoo-green-100" onClick={() => enviarEvento('S-1200')} disabled={processando}>
                  <FileText className="w-4 h-4 mr-2" /> Enviar Remuneração (S-1200)
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-puchoo-green-dark">Envio em Lote</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-full bg-puchoo-warm-50 border-2 border-dashed border-puchoo-green-light rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-puchoo-terracotta-light mb-4" />
                <h3 className="text-lg font-semibold text-puchoo-green-dark">Arraste e solte seu arquivo XML</h3>
                <p className="text-puchoo-terracotta">ou</p>
                <Button variant="outline">Selecione o arquivo</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABA: TIPOS DE EVENTOS */}
        <TabsContent value="tipos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(tiposEventos).map(([key, value]) => (
              <Card key={key}>
                <CardHeader className="bg-puchoo-green-50 rounded-t-lg">
                  <CardTitle className="text-puchoo-green-dark capitalize">{key.replace(/([A-Z])/g, ' $1')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {value.map(evento => (
                      <li key={evento.codigo} className="text-sm text-puchoo-terracotta flex justify-between items-center">
                        <span>{evento.codigo} - {evento.nome}</span>
                        <Button variant="ghost" size="sm" className="hover:bg-puchoo-warm-50">
                          <Send className="w-4 h-4 text-puchoo-green" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESocialDashboard;
