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
          <h1 className="text-3xl font-bold">eSocial Dashboard</h1>
          <p className="text-gray-500">Gestão completa de eventos eSocial</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="text-lg px-4 py-2">
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
                <p className="text-sm text-gray-500">Eventos Enviados</p>
                <p className="text-3xl font-bold">{estatisticas.eventosEnviados}</p>
              </div>
              <Send className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aguardando</p>
                <p className="text-3xl font-bold text-orange-600">{estatisticas.aguardandoProcessamento}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Com Sucesso</p>
                <p className="text-3xl font-bold text-green-600">{estatisticas.processadosComSucesso}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Com Erros</p>
                <p className="text-3xl font-bold text-red-600">{estatisticas.comErros}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conformidade</p>
                <p className="text-3xl font-bold text-green-600">{estatisticas.conformidade}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eventos por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventosPorCategoria.map((cat, idx) => (
              <Card key={idx} className="border-2">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-4">{cat.categoria}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total:</span>
                      <span className="font-bold">{cat.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sucesso:</span>
                      <span className="font-bold text-green-600">{cat.sucesso}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Erros:</span>
                      <span className="font-bold text-red-600">{cat.erros}</span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
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
                <CardTitle>Últimos Eventos Enviados</CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventosRecentes.map((evento) => (
                    <TableRow key={evento.id}>
                      <TableCell className="font-mono font-bold">{evento.tipo}</TableCell>
                      <TableCell>{evento.descricao}</TableCell>
                      <TableCell className="text-sm">{evento.data}</TableCell>
                      <TableCell>
                        <Badge variant={evento.status === 'Processado' ? 'default' : 'destructive'}>
                          {evento.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{evento.protocolo}</TableCell>
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
        </TabsContent>

        {/* ABA: EVENTOS PENDENTES */}
        <TabsContent value="pendentes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Aguardando Envio</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Funcionários</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventosPendentes.map((evento) => (
                    <TableRow key={evento.id}>
                      <TableCell className="font-mono font-bold">{evento.tipo}</TableCell>
                      <TableCell>{evento.descricao}</TableCell>
                      <TableCell className="text-center">{evento.funcionarios}</TableCell>
                      <TableCell>
                        <Badge variant={
                          evento.prioridade === 'Alta' ? 'destructive' :
                          evento.prioridade === 'Média' ? 'secondary' : 'default'
                        }>
                          {evento.prioridade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => enviarEvento(evento.tipo)}
                          size="sm"
                          disabled={processando}
                        >
                          <Send className="w-4 h-4 mr-1" />
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

        {/* ABA: EVENTOS COM ERRO */}
        <TabsContent value="erros" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eventos com Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Erro</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tentativas</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventosComErro.map((evento) => (
                    <TableRow key={evento.id}>
                      <TableCell className="font-mono font-bold">{evento.tipo}</TableCell>
                      <TableCell>{evento.funcionario}</TableCell>
                      <TableCell className="text-red-600">{evento.erro}</TableCell>
                      <TableCell className="text-sm">{evento.data}</TableCell>
                      <TableCell className="text-center">{evento.tentativas}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Reenviar
                          </Button>
                        </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Enviar Novos Eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 p-4 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900">Atenção</p>
                  <p className="text-sm text-amber-800">
                    Certifique-se de que todos os dados estão corretos antes de enviar eventos ao eSocial.
                    Eventos enviados não podem ser excluídos, apenas retificados.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">S-1200</span>
                  <span className="text-xs text-gray-500">Remuneração</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">S-1299</span>
                  <span className="text-xs text-gray-500">Fechamento</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">S-2200</span>
                  <span className="text-xs text-gray-500">Admissão</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">S-2299</span>
                  <span className="text-xs text-gray-500">Desligamento</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">S-2210</span>
                  <span className="text-xs text-gray-500">CAT</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">S-2220</span>
                  <span className="text-xs text-gray-500">ASO</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: TIPOS DE EVENTOS */}
        <TabsContent value="tipos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Eventos de Tabelas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {tiposEventos.tabelas.map((evento, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-bold">{evento.codigo}</TableCell>
                        <TableCell>{evento.nome}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eventos Não Periódicos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {tiposEventos.naoPeriodicos.map((evento, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-bold">{evento.codigo}</TableCell>
                        <TableCell>{evento.nome}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eventos Periódicos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {tiposEventos.periodicos.map((evento, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-bold">{evento.codigo}</TableCell>
                        <TableCell>{evento.nome}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eventos SST</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {tiposEventos.sst.map((evento, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-bold">{evento.codigo}</TableCell>
                        <TableCell>{evento.nome}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESocialDashboard;

