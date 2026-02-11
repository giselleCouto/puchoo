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
      <Card className="bg-gradient-to-r from-puchoo-green to-puchoo-green-dark text-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
              <User className="w-16 h-16 text-puchoo-green" />
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
                <p className="text-sm text-puchoo-terracotta">Último Salário</p>
                <p className="text-2xl font-bold text-puchoo-green">
                  R$ {contracheques[0].liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Benefícios Ativos</p>
                <p className="text-2xl font-bold">{beneficios.length}</p>
              </div>
              <Award className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Dias de Férias</p>
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
                <p className="text-sm text-puchoo-terracotta">Documentos</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-puchoo-warm-50 rounded-lg">
                <div>
                  <p className="text-sm text-puchoo-terracotta">Salário Bruto</p>
                  <p className="text-2xl font-bold">
                    R$ {contracheques[0].salarioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-puchoo-terracotta">Total de Descontos</p>
                  <p className="text-2xl font-bold text-puchoo-coral">
                    R$ {contracheques[0].descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-puchoo-terracotta">Salário Líquido</p>
                  <p className="text-2xl font-bold text-puchoo-green">
                    R$ {contracheques[0].liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Detalhamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proventos */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-puchoo-green-dark">Proventos</h3>
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
                          <TableCell className="text-right font-medium">R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Descontos */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-puchoo-coral">Descontos</h3>
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
                          <TableCell className="text-right font-medium">R$ {d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div>
                <h3 className="font-bold text-lg mb-4">Informações Adicionais</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-puchoo-warm-50 rounded-lg">
                  <div>
                    <p className="text-sm text-puchoo-terracotta">Base INSS</p>
                    <p className="font-semibold">R$ {detalhesContracheque.informacoes.baseINSS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-puchoo-terracotta">Base IRRF</p>
                    <p className="font-semibold">R$ {detalhesContracheque.informacoes.baseIRRF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-puchoo-terracotta">Base FGTS</p>
                    <p className="font-semibold">R$ {detalhesContracheque.informacoes.baseFGTS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-puchoo-terracotta">FGTS do Mês</p>
                    <p className="font-semibold">R$ {detalhesContracheque.informacoes.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Baixar PDF</Button>
                <Button><Eye className="mr-2 h-4 w-4" /> Visualizar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: INFORMES DE RENDIMENTOS */}
        <TabsContent value="informes">
          <Card>
            <CardHeader>
              <CardTitle>Meus Informes de Rendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ano</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data de Emissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {informes.map((informe) => (
                    <TableRow key={informe.ano}>
                      <TableCell className="font-semibold">{informe.ano}</TableCell>
                      <TableCell>{informe.tipo}</TableCell>
                      <TableCell>{new Date(informe.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant={informe.status === 'Disponível' ? 'default' : 'secondary'}>{informe.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
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
        <TabsContent value="beneficios">
          <Card>
            <CardHeader>
              <CardTitle>Meus Benefícios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {beneficios.map((beneficio, idx) => (
                  <Card key={idx} className="bg-puchoo-green-50 border-puchoo-green-light">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">{beneficio.tipo}</CardTitle>
                      <Award className="w-4 h-4 text-puchoo-terracotta" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">R$ {beneficio.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <p className="text-xs text-puchoo-terracotta">
                        Vencimento em {new Date(beneficio.vencimento).toLocaleDateString('pt-BR')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: FÉRIAS */}
        <TabsContent value="ferias">
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
                    <TableHead>Valor Bruto</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ferias.map((f, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold">{f.periodo}</TableCell>
                      <TableCell>{f.dias}</TableCell>
                      <TableCell>{f.tipo}</TableCell>
                      <TableCell>R$ {f.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <Badge className="bg-puchoo-green text-white">{f.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: DOCUMENTOS */}
        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle>Meus Documentos Digitais</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Arquivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.map((doc, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold">{doc.nome}</TableCell>
                      <TableCell>{doc.tipo}</TableCell>
                      <TableCell>{new Date(doc.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{doc.tamanho}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
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
