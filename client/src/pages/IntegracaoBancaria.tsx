import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Building2, DollarSign, Send, CheckCircle, XCircle, Clock, 
  AlertTriangle, Download, Upload, TrendingUp, CreditCard,
  FileText, Wallet, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';

const IntegracaoBancaria = () => {
  const [bancoSelecionado, setBancoSelecionado] = useState('inter');
  const [tipoPagamento, setTipoPagamento] = useState('pix');
  const [processando, setProcessando] = useState(false);

  // Dados simulados
  const estatisticas = {
    pagamentosHoje: 45,
    valorTotal: 285650.00,
    pendentes: 3,
    falhas: 0,
    taxasSucesso: 98.5
  };

  const bancos = [
    { id: 'inter', nome: 'Banco Inter', logo: '🏦', status: 'Conectado', saldo: 500000.00 },
    { id: 'bb', nome: 'Banco do Brasil', logo: '🏛️', status: 'Conectado', saldo: 750000.00 },
    { id: 'bradesco', nome: 'Bradesco', logo: '🏢', status: 'Conectado', saldo: 320000.00 },
    { id: 'santander', nome: 'Santander', logo: '🏪', status: 'Inativo', saldo: 0 },
  ];

  const pagamentosRecentes = [
    { id: 1, data: '2025-10-18 14:30', tipo: 'Pix', valor: 285650.00, funcionarios: 45, status: 'Concluído', banco: 'Banco Inter' },
    { id: 2, data: '2025-09-18 14:25', tipo: 'TED', valor: 278900.00, funcionarios: 45, status: 'Concluído', banco: 'Banco do Brasil' },
    { id: 3, data: '2025-08-18 14:20', tipo: 'Pix', valor: 275300.00, funcionarios: 44, status: 'Concluído', banco: 'Banco Inter' },
  ];

  const pagamentosPendentes = [
    { id: 1, funcionario: 'João Silva', cpf: '123.456.789-00', valor: 6500.00, tipo: 'Salário', competencia: '2025-10' },
    { id: 2, funcionario: 'Maria Santos', cpf: '987.654.321-00', valor: 7200.00, tipo: 'Salário', competencia: '2025-10' },
    { id: 3, funcionario: 'Pedro Costa', cpf: '456.789.123-00', valor: 5800.00, tipo: 'Salário', competencia: '2025-10' },
  ];

  const historicoTransacoes = [
    { id: 'TRX001', data: '2025-10-18 14:30:15', tipo: 'Pix', valor: 6500.00, destinatario: 'João Silva', status: 'Sucesso', banco: 'Inter' },
    { id: 'TRX002', data: '2025-10-18 14:30:18', tipo: 'Pix', valor: 7200.00, destinatario: 'Maria Santos', status: 'Sucesso', banco: 'Inter' },
    { id: 'TRX003', data: '2025-10-18 14:30:21', tipo: 'Pix', valor: 5800.00, destinatario: 'Pedro Costa', status: 'Sucesso', banco: 'Inter' },
    { id: 'TRX004', data: '2025-10-18 14:30:24', tipo: 'Pix', valor: 8900.00, destinatario: 'Ana Paula', status: 'Sucesso', banco: 'Inter' },
    { id: 'TRX005', data: '2025-10-18 14:30:27', tipo: 'Pix', valor: 4500.00, destinatario: 'Carlos Lima', status: 'Falha', banco: 'Inter' },
  ];

  const configuracoesBanco = {
    inter: {
      clientId: 'puchoo_client_id_inter',
      ambiente: 'Produção',
      ultimaSync: '2025-10-18 14:30:00',
      taxaPix: 0.00,
      taxaTED: 8.50
    }
  };

  const processarPagamentos = () => {
    setProcessando(true);
    setTimeout(() => {
      setProcessando(false);
      alert(`Pagamentos processados com sucesso!\n\nTipo: ${tipoPagamento.toUpperCase()}\nBanco: ${bancos.find(b => b.id === bancoSelecionado)?.nome}\nTotal: R$ ${pagamentosPendentes.reduce((sum, p) => sum + p.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Integração Bancária</h1>
          <p className="text-gray-500">Pagamentos em lote via Pix, TED e CNAB</p>
        </div>
        <Badge variant="default" className="text-lg px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          Taxa de Sucesso: {estatisticas.taxasSucesso}%
        </Badge>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pagamentos Hoje</p>
                <p className="text-3xl font-bold">{estatisticas.pagamentosHoje}</p>
              </div>
              <Send className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {(estatisticas.valorTotal / 1000).toFixed(0)}k
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendentes</p>
                <p className="text-3xl font-bold text-orange-600">{estatisticas.pendentes}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Falhas</p>
                <p className="text-3xl font-bold text-red-600">{estatisticas.falhas}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taxa Sucesso</p>
                <p className="text-3xl font-bold text-green-600">{estatisticas.taxasSucesso}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bancos Conectados */}
      <Card>
        <CardHeader>
          <CardTitle>Bancos Conectados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {bancos.map((banco) => (
              <Card key={banco.id} className={`border-2 ${banco.status === 'Conectado' ? 'border-green-500' : 'border-gray-300'}`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-5xl mb-2">{banco.logo}</div>
                    <h3 className="font-bold text-lg mb-2">{banco.nome}</h3>
                    <Badge variant={banco.status === 'Conectado' ? 'default' : 'secondary'} className="mb-3">
                      {banco.status}
                    </Badge>
                    {banco.status === 'Conectado' && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Saldo Disponível</p>
                        <p className="text-xl font-bold text-green-600">
                          R$ {banco.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                    <Button 
                      variant={banco.status === 'Conectado' ? 'outline' : 'default'} 
                      className="w-full mt-3"
                      size="sm"
                    >
                      {banco.status === 'Conectado' ? 'Configurar' : 'Conectar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="processar" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="processar">Processar Pagamentos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="transacoes">Transações</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        {/* ABA: PROCESSAR PAGAMENTOS */}
        <TabsContent value="processar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Pagamento em Lote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Banco de Origem</Label>
                  <Select value={bancoSelecionado} onValueChange={setBancoSelecionado}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bancos.filter(b => b.status === 'Conectado').map((banco) => (
                        <SelectItem key={banco.id} value={banco.id}>
                          {banco.logo} {banco.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Pagamento</Label>
                  <Select value={tipoPagamento} onValueChange={setTipoPagamento}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">Pix (Instantâneo - R$ 0,00)</SelectItem>
                      <SelectItem value="ted">TED (1 dia útil - R$ 8,50)</SelectItem>
                      <SelectItem value="cnab">CNAB (Arquivo - R$ 0,00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Resumo do Pagamento</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total de Funcionários</p>
                    <p className="text-2xl font-bold">{pagamentosPendentes.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {pagamentosPendentes.reduce((sum, p) => sum + p.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taxa Estimada</p>
                    <p className="text-2xl font-bold">
                      R$ {tipoPagamento === 'ted' ? (pagamentosPendentes.length * 8.50).toFixed(2) : '0,00'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Competência</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentosPendentes.map((pag) => (
                    <TableRow key={pag.id}>
                      <TableCell className="font-medium">{pag.funcionario}</TableCell>
                      <TableCell className="font-mono text-sm">{pag.cpf}</TableCell>
                      <TableCell>{pag.tipo}</TableCell>
                      <TableCell>{pag.competencia}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        R$ {pag.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex gap-4">
                <Button 
                  onClick={processarPagamentos} 
                  className="flex-1 h-14 text-lg"
                  disabled={processando}
                >
                  {processando ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Processar Pagamentos ({pagamentosPendentes.length})
                    </>
                  )}
                </Button>
                <Button variant="outline" className="h-14">
                  <Download className="w-5 h-5 mr-2" />
                  Exportar Lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: HISTÓRICO */}
        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos em Lote</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Funcionários</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentosRecentes.map((pag) => (
                    <TableRow key={pag.id}>
                      <TableCell className="font-medium">{pag.data}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pag.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{pag.funcionarios}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        R$ {pag.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-sm">{pag.banco}</TableCell>
                      <TableCell>
                        <Badge variant="default">{pag.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: TRANSAÇÕES */}
        <TabsContent value="transacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transações Individuais</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Transação</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Destinatário</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoTransacoes.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className="font-mono text-sm">{trx.id}</TableCell>
                      <TableCell className="text-sm">{trx.data}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{trx.tipo}</Badge>
                      </TableCell>
                      <TableCell>{trx.destinatario}</TableCell>
                      <TableCell className="font-bold">
                        R$ {trx.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{trx.banco}</TableCell>
                      <TableCell>
                        <Badge variant={trx.status === 'Sucesso' ? 'default' : 'destructive'}>
                          {trx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: CONFIGURAÇÕES */}
        <TabsContent value="configuracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Banco Inter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client ID</Label>
                  <Input value={configuracoesBanco.inter.clientId} readOnly />
                </div>
                <div>
                  <Label>Ambiente</Label>
                  <Input value={configuracoesBanco.inter.ambiente} readOnly />
                </div>
                <div>
                  <Label>Última Sincronização</Label>
                  <Input value={configuracoesBanco.inter.ultimaSync} readOnly />
                </div>
                <div>
                  <Label>Taxa Pix</Label>
                  <Input value={`R$ ${configuracoesBanco.inter.taxaPix.toFixed(2)}`} readOnly />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sincronizar
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Atualizar Certificado
                </Button>
                <Button variant="destructive">
                  Desconectar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegracaoBancaria;

