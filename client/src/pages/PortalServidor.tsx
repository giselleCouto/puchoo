import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  FileText, Download, Eye, Calendar, DollarSign, 
  TrendingUp, Award, BookOpen, Bell, Lock, User
} from 'lucide-react';

const PortalServidor = () => {
  const [competenciaSelecionada, setCompetenciaSelecionada] = useState('2025-10');

  // Dados simulados
  const dadosServidor = {
    nome: 'João da Silva Santos',
    matricula: '123456',
    cargo: 'Analista de Sistemas',
    departamento: 'Tecnologia da Informação',
    dataAdmissao: '15/03/2020',
    foto: '/api/placeholder/100/100'
  };

  const contracheques = [
    { competencia: '2025-10', salarioBruto: 8500.00, descontos: 1850.50, liquido: 6649.50, status: 'Disponível' },
    { competencia: '2025-09', salarioBruto: 8500.00, descontos: 1850.50, liquido: 6649.50, status: 'Disponível' },
    { competencia: '2025-08', salarioBruto: 8500.00, descontos: 1850.50, liquido: 6649.50, status: 'Disponível' },
    { competencia: '2025-07', salarioBruto: 8500.00, descontos: 1850.50, liquido: 6649.50, status: 'Disponível' },
    { competencia: '2025-06', salarioBruto: 8500.00, descontos: 1850.50, liquido: 6649.50, status: 'Disponível' },
  ];

  const detalhesContracheque = {
    proventos: [
      { codigo: '001', descricao: 'Salário Base', valor: 7000.00 },
      { codigo: '010', descricao: 'Gratificação de Função', valor: 1000.00 },
      { codigo: '015', descricao: 'Adicional Noturno', valor: 500.00 },
    ],
    descontos: [
      { codigo: '200', descricao: 'INSS', valor: 765.00 },
      { codigo: '201', descricao: 'IRRF', valor: 950.50 },
      { codigo: '210', descricao: 'Vale Transporte', valor: 135.00 },
    ],
    informacoes: {
      baseINSS: 7000.00,
      baseIRRF: 6235.00,
      baseFGTS: 8500.00,
      fgts: 680.00,
      diasTrabalhados: 30,
      faltas: 0
    }
  };

  const informes = [
    { ano: 2024, tipo: 'Informe de Rendimentos', status: 'Disponível', data: '2025-02-28' },
    { ano: 2023, tipo: 'Informe de Rendimentos', status: 'Disponível', data: '2024-02-28' },
    { ano: 2022, tipo: 'Informe de Rendimentos', status: 'Disponível', data: '2023-02-28' },
  ];

  const beneficios = [
    { tipo: 'Vale Alimentação', valor: 500.00, status: 'Ativo', vencimento: '2025-10-31' },
    { tipo: 'Vale Transporte', valor: 135.00, status: 'Ativo', vencimento: '2025-10-31' },
    { tipo: 'Plano de Saúde', valor: 250.00, status: 'Ativo', vencimento: '2025-12-31' },
    { tipo: 'Seguro de Vida', valor: 15.00, status: 'Ativo', vencimento: '2025-12-31' },
  ];

  const ferias = [
    { periodo: '2024-12-20 a 2025-01-08', dias: 20, tipo: 'Férias', status: 'Concluído', valor: 9500.00 },
    { periodo: '2023-12-15 a 2024-01-03', dias: 20, tipo: 'Férias', status: 'Concluído', valor: 9000.00 },
  ];

  const documentos = [
    { nome: 'Contrato de Trabalho', tipo: 'PDF', data: '2020-03-15', tamanho: '245 KB' },
    { nome: 'Termo de Confidencialidade', tipo: 'PDF', data: '2020-03-15', tamanho: '180 KB' },
    { nome: 'Ficha de Registro', tipo: 'PDF', data: '2020-03-15', tamanho: '320 KB' },
    { nome: 'ASO - Admissional', tipo: 'PDF', data: '2020-03-10', tamanho: '150 KB' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header com dados do servidor */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
              <User className="w-16 h-16 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{dadosServidor.nome}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="opacity-80">Matrícula</p>
                  <p className="font-semibold">{dadosServidor.matricula}</p>
                </div>
                <div>
                  <p className="opacity-80">Cargo</p>
                  <p className="font-semibold">{dadosServidor.cargo}</p>
                </div>
                <div>
                  <p className="opacity-80">Departamento</p>
                  <p className="font-semibold">{dadosServidor.departamento}</p>
                </div>
                <div>
                  <p className="opacity-80">Admissão</p>
                  <p className="font-semibold">{dadosServidor.dataAdmissao}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Último Salário</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {contracheques[0].liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <p className="text-sm text-gray-500">Benefícios Ativos</p>
                <p className="text-2xl font-bold">{beneficios.length}</p>
              </div>
              <Award className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dias de Férias</p>
                <p className="text-2xl font-bold">30</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Documentos</p>
                <p className="text-2xl font-bold">{documentos.length}</p>
              </div>
              <FileText className="w-10 h-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contracheques" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="contracheques">Contracheques</TabsTrigger>
          <TabsTrigger value="informes">Informes</TabsTrigger>
          <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
          <TabsTrigger value="ferias">Férias</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        {/* ABA: CONTRACHEQUES */}
        <TabsContent value="contracheques" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Meus Contracheques</CardTitle>
                <div className="flex gap-2">
                  <Select value={competenciaSelecionada} onValueChange={setCompetenciaSelecionada}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {contracheques.map((c) => (
                        <SelectItem key={c.competencia} value={c.competencia}>
                          {c.competencia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumo do contracheque selecionado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Salário Bruto</p>
                  <p className="text-2xl font-bold">
                    R$ {contracheques[0].salarioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Descontos</p>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {contracheques[0].descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salário Líquido</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {contracheques[0].liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Detalhamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proventos */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-green-700">Proventos</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detalhesContracheque.proventos.map((p, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-sm">{p.codigo}</TableCell>
                          <TableCell>{p.descricao}</TableCell>
                          <TableCell className="text-right font-semibold text-green-700">
                            R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-green-50">
                        <TableCell colSpan={2} className="font-bold">Total de Proventos</TableCell>
                        <TableCell className="text-right font-bold text-green-700">
                          R$ {detalhesContracheque.proventos.reduce((sum, p) => sum + p.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Descontos */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-red-700">Descontos</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detalhesContracheque.descontos.map((d, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-sm">{d.codigo}</TableCell>
                          <TableCell>{d.descricao}</TableCell>
                          <TableCell className="text-right font-semibold text-red-700">
                            R$ {d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-red-50">
                        <TableCell colSpan={2} className="font-bold">Total de Descontos</TableCell>
                        <TableCell className="text-right font-bold text-red-700">
                          R$ {detalhesContracheque.descontos.reduce((sum, d) => sum + d.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">Base INSS</p>
                  <p className="font-semibold">R$ {detalhesContracheque.informacoes.baseINSS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Base IRRF</p>
                  <p className="font-semibold">R$ {detalhesContracheque.informacoes.baseIRRF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Base FGTS</p>
                  <p className="font-semibold">R$ {detalhesContracheque.informacoes.baseFGTS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">FGTS Depositado</p>
                  <p className="font-semibold">R$ {detalhesContracheque.informacoes.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
              </div>

              {/* Histórico */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">Histórico de Contracheques</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Competência</TableHead>
                      <TableHead>Salário Bruto</TableHead>
                      <TableHead>Descontos</TableHead>
                      <TableHead>Líquido</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracheques.map((c, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{c.competencia}</TableCell>
                        <TableCell>R$ {c.salarioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-red-600">R$ {c.descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="font-bold text-green-600">R$ {c.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>
                          <Badge variant="default">{c.status}</Badge>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: INFORMES */}
        <TabsContent value="informes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informes de Rendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ano</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data de Emissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {informes.map((inf, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-bold">{inf.ano}</TableCell>
                      <TableCell>{inf.tipo}</TableCell>
                      <TableCell>{inf.data}</TableCell>
                      <TableCell>
                        <Badge variant="default">{inf.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Baixar PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: BENEFÍCIOS */}
        <TabsContent value="beneficios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Benefícios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {beneficios.map((ben, idx) => (
                  <Card key={idx} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{ben.tipo}</h3>
                          <p className="text-2xl font-bold text-green-600 mt-2">
                            R$ {ben.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <Badge variant="default">{ben.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Vencimento: {ben.vencimento}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: FÉRIAS */}
        <TabsContent value="ferias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Férias</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Dias</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ferias.map((fer, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{fer.periodo}</TableCell>
                      <TableCell>{fer.dias}</TableCell>
                      <TableCell>{fer.tipo}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        R$ {fer.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{fer.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: DOCUMENTOS */}
        <TabsContent value="documentos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.map((doc, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{doc.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.tipo}</Badge>
                      </TableCell>
                      <TableCell>{doc.data}</TableCell>
                      <TableCell className="text-sm text-gray-600">{doc.tamanho}</TableCell>
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
      </Tabs>
    </div>
  );
};

export default PortalServidor;

