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
  Shield, FileText, Activity, AlertTriangle, Calendar, 
  Download, Upload, CheckCircle, XCircle, Clock, Users,
  TrendingUp, BarChart3, FileWarning, Stethoscope
} from 'lucide-react';

type ModalType = 'novoExame' | 'novoASO' | 'novoRisco' | 'novaCAT' | null;

const SST = () => {
  const [modalAberto, setModalAberto] = useState<ModalType>(null);

  // Dados simulados
  const estatisticas = {
    examesPendentes: 12,
    asosVencendo: 5,
    riscosCriticos: 3,
    catAbertas: 1,
    conformidade: 87
  };

  const examesPendentes = [
    { id: 1, funcionario: 'João Silva', cargo: 'Operador', tipo: 'Periódico', vencimento: '2025-11-15', status: 'Agendado' },
    { id: 2, funcionario: 'Maria Santos', cargo: 'Analista', tipo: 'Admissional', vencimento: '2025-10-25', status: 'Pendente' },
    { id: 3, funcionario: 'Pedro Costa', cargo: 'Técnico', tipo: 'Retorno ao Trabalho', vencimento: '2025-10-20', status: 'Urgente' },
  ];

  const asos = [
    { id: 1, funcionario: 'Ana Paula', tipo: 'Admissional', data: '2025-01-15', validade: '2026-01-15', resultado: 'Apto', medico: 'Dr. Carlos Silva' },
    { id: 2, funcionario: 'Roberto Lima', tipo: 'Periódico', data: '2025-03-20', validade: '2026-03-20', resultado: 'Apto', medico: 'Dra. Maria Costa' },
    { id: 3, funcionario: 'Juliana Souza', tipo: 'Mudança de Função', data: '2025-06-10', validade: '2026-06-10', resultado: 'Apto com Restrição', medico: 'Dr. João Santos' },
  ];

  const riscos = [
    { id: 1, tipo: 'Físico', agente: 'Ruído', nivel: 'Alto', setor: 'Produção', funcionarios: 25, medidas: 'EPI obrigatório' },
    { id: 2, tipo: 'Químico', agente: 'Solventes', nivel: 'Médio', setor: 'Laboratório', funcionarios: 8, medidas: 'Ventilação adequada' },
    { id: 3, tipo: 'Ergonômico', agente: 'Postura', nivel: 'Baixo', setor: 'Administrativo', funcionarios: 45, medidas: 'Ginástica laboral' },
  ];

  const cats = [
    { id: 1, funcionario: 'Carlos Mendes', data: '2025-10-10', tipo: 'Acidente de Trabalho', gravidade: 'Leve', status: 'Em Análise', dias: 5 },
    { id: 2, funcionario: 'Fernanda Alves', data: '2025-09-15', tipo: 'Doença Ocupacional', gravidade: 'Moderada', status: 'Concluída', dias: 15 },
  ];

  const relatorios = [
    { nome: 'PPRA 2025', tipo: 'PPRA', data: '2025-01-01', status: 'Vigente', validade: '2026-01-01' },
    { nome: 'PCMSO 2025', tipo: 'PCMSO', data: '2025-01-01', status: 'Vigente', validade: '2026-01-01' },
    { nome: 'LTCAT', tipo: 'LTCAT', data: '2024-12-01', status: 'Vigente', validade: '2025-12-01' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SST - Saúde e Segurança do Trabalho</h1>
          <p className="text-puchoo-terracotta">Gestão completa de saúde ocupacional e segurança</p>
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
                <p className="text-sm text-puchoo-terracotta">Exames Pendentes</p>
                <p className="text-3xl font-bold">{estatisticas.examesPendentes}</p>
              </div>
              <Stethoscope className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">ASOs Vencendo</p>
                <p className="text-3xl font-bold text-puchoo-coral">{estatisticas.asosVencendo}</p>
              </div>
              <Clock className="w-10 h-10 text-puchoo-coral" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">Riscos Críticos</p>
                <p className="text-3xl font-bold text-puchoo-coral">{estatisticas.riscosCriticos}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-puchoo-coral" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-puchoo-terracotta">CATs Abertas</p>
                <p className="text-3xl font-bold">{estatisticas.catAbertas}</p>
              </div>
              <FileWarning className="w-10 h-10 text-puchoo-terracotta" />
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
              <CheckCircle className="w-10 h-10 text-puchoo-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="exames" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="exames">Exames</TabsTrigger>
          <TabsTrigger value="asos">ASO</TabsTrigger>
          <TabsTrigger value="riscos">Riscos</TabsTrigger>
          <TabsTrigger value="cat">CAT</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        {/* ABA: EXAMES */}
        <TabsContent value="exames" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Exames Ocupacionais</CardTitle>
                <Button onClick={() => setModalAberto('novoExame')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Exame
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Tipo de Exame</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examesPendentes.map((exame) => (
                    <TableRow key={exame.id}>
                      <TableCell className="font-medium">{exame.funcionario}</TableCell>
                      <TableCell>{exame.cargo}</TableCell>
                      <TableCell>{exame.tipo}</TableCell>
                      <TableCell>{exame.vencimento}</TableCell>
                      <TableCell>
                        <Badge variant={
                          exame.status === 'Urgente' ? 'destructive' :
                          exame.status === 'Agendado' ? 'default' : 'secondary'
                        }>
                          {exame.status}
                        </Badge>
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

        {/* ABA: ASO */}
        <TabsContent value="asos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Atestados de Saúde Ocupacional (ASO)</CardTitle>
                <Button onClick={() => setModalAberto('novoASO')}>
                  <Upload className="w-4 h-4 mr-2" />
                  Cadastrar ASO
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asos.map((aso) => (
                    <TableRow key={aso.id}>
                      <TableCell className="font-medium">{aso.funcionario}</TableCell>
                      <TableCell>{aso.tipo}</TableCell>
                      <TableCell>{aso.data}</TableCell>
                      <TableCell>{aso.validade}</TableCell>
                      <TableCell>
                        <Badge variant={
                          aso.resultado === 'Apto' ? 'default' :
                          aso.resultado === 'Apto com Restrição' ? 'secondary' : 'destructive'
                        }>
                          {aso.resultado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{aso.medico}</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: RISCOS */}
        <TabsContent value="riscos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Mapa de Riscos Ocupacionais</CardTitle>
                <Button onClick={() => setModalAberto('novoRisco')}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Cadastrar Risco
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Agente</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Funcionários Expostos</TableHead>
                    <TableHead>Medidas de Controle</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riscos.map((risco) => (
                    <TableRow key={risco.id}>
                      <TableCell className="font-medium">{risco.tipo}</TableCell>
                      <TableCell>{risco.agente}</TableCell>
                      <TableCell>
                        <Badge variant={
                          risco.nivel === 'Alto' ? 'destructive' :
                          risco.nivel === 'Médio' ? 'secondary' : 'default'
                        }>
                          {risco.nivel}
                        </Badge>
                      </TableCell>
                      <TableCell>{risco.setor}</TableCell>
                      <TableCell className="text-center">{risco.funcionarios}</TableCell>
                      <TableCell className="text-sm">{risco.medidas}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: CAT */}
        <TabsContent value="cat" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Comunicação de Acidente de Trabalho (CAT)</CardTitle>
                <Button onClick={() => setModalAberto('novaCAT')} variant="destructive">
                  <FileWarning className="w-4 h-4 mr-2" />
                  Registrar CAT
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Gravidade</TableHead>
                    <TableHead>Dias Afastado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cats.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.funcionario}</TableCell>
                      <TableCell>{cat.data}</TableCell>
                      <TableCell>{cat.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={
                          cat.gravidade === 'Grave' ? 'destructive' :
                          cat.gravidade === 'Moderada' ? 'secondary' : 'default'
                        }>
                          {cat.gravidade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{cat.dias}</TableCell>
                      <TableCell>
                        <Badge variant={cat.status === 'Concluída' ? 'default' : 'destructive'}>
                          {cat.status}
                        </Badge>
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

        {/* ABA: RELATÓRIOS */}
        <TabsContent value="relatorios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios e Documentos SST</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatorios.map((rel, idx) => (
                  <Card key={idx} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{rel.nome}</h3>
                          <p className="text-sm text-puchoo-terracotta">{rel.tipo}</p>
                        </div>
                        <Badge variant="default">{rel.status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Emissão:</strong> {rel.data}</p>
                        <p><strong>Validade:</strong> {rel.validade}</p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">Gerar Novos Relatórios</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20">
                    <FileText className="w-6 h-6 mr-2" />
                    PPRA
                  </Button>
                  <Button variant="outline" className="h-20">
                    <FileText className="w-6 h-6 mr-2" />
                    PCMSO
                  </Button>
                  <Button variant="outline" className="h-20">
                    <FileText className="w-6 h-6 mr-2" />
                    LTCAT
                  </Button>
                  <Button variant="outline" className="h-20">
                    <FileText className="w-6 h-6 mr-2" />
                    PGR
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

export default SST;

