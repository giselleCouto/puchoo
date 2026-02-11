import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Clock, Camera, MapPin, CheckCircle, XCircle, AlertCircle, Download, Upload, Calendar, Home, Building } from 'lucide-react';

interface Localizacao {
  lat: number;
  lng: number;
  precisao: number;
}

const PontoExpandido = () => {
  const [registrando, setRegistrando] = useState(false);
  const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null);
  const [modoTrabalho, setModoTrabalho] = useState('presencial');
  const videoRef = useRef(null);

  // Simula captura de foto
  const capturarFoto = () => {
    setRegistrando(true);
    setTimeout(() => {
      setFotoCapturada('/api/placeholder/150/150');
      setRegistrando(false);
    }, 2000);
  };

  // Simula captura de localização
  const capturarLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocalizacao({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          precisao: position.coords.accuracy
        });
      });
    }
  };

  // Simula registro de ponto
  const registrarPonto = (tipo: string) => {
    capturarFoto();
    capturarLocalizacao();
    setTimeout(() => {
      alert(`Ponto registrado com sucesso!\nTipo: ${tipo}\nModo: ${modoTrabalho}\nHorário: ${new Date().toLocaleTimeString()}`);
    }, 2500);
  };

  const registrosHoje = [
    { tipo: 'Entrada', horario: '08:00:00', status: 'Normal', localizacao: 'Escritório Central', foto: true },
    { tipo: 'Saída Almoço', horario: '12:00:00', status: 'Normal', localizacao: 'Escritório Central', foto: true },
    { tipo: 'Retorno Almoço', horario: '13:00:00', status: 'Normal', localizacao: 'Escritório Central', foto: true },
  ];

  const justificativasPendentes = [
    { data: '14/10/2025', tipo: 'Atraso', motivo: 'Trânsito', status: 'Pendente', anexo: true },
    { data: '13/10/2025', tipo: 'Falta', motivo: 'Atestado Médico', status: 'Aprovado', anexo: true },
  ];

  const historicoSemanal = [
    { data: '15/10/2025', entrada: '08:00', saida: '18:00', total: '08h00', status: 'Completo', modo: 'Presencial' },
    { data: '14/10/2025', entrada: '08:10', saida: '18:05', total: '07h55', status: 'Atraso', modo: 'Presencial' },
    { data: '13/10/2025', entrada: '-', saida: '-', total: '00h00', status: 'Falta Justificada', modo: '-' },
    { data: '12/10/2025', entrada: '09:00', saida: '18:00', total: '08h00', status: 'Completo', modo: 'Home Office' },
    { data: '11/10/2025', entrada: '08:00', saida: '18:05', total: '08h05', status: 'Completo', modo: 'Presencial' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ponto Eletrônico Avançado</h1>
          <p className="text-puchoo-terracotta">Registro com reconhecimento facial e geolocalização</p>
        </div>
        <Badge variant={modoTrabalho === 'presencial' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
          {modoTrabalho === 'presencial' ? <Building className="w-4 h-4 mr-2" /> : <Home className="w-4 h-4 mr-2" />}
          {modoTrabalho === 'presencial' ? 'Presencial' : 'Home Office'}
        </Badge>
      </div>

      <Tabs defaultValue="registro" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registro">Registrar Ponto</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="justificativas">Justificativas</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        {/* ABA: REGISTRAR PONTO */}
        <TabsContent value="registro" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card: Relógio */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horário Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <div className="text-puchoo-terracotta">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button 
                      onClick={() => setModoTrabalho(modoTrabalho === 'presencial' ? 'home_office' : 'presencial')}
                      variant="outline"
                      className="w-full"
                    >
                      {modoTrabalho === 'presencial' ? 'Mudar para Home Office' : 'Mudar para Presencial'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card: Reconhecimento Facial */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Reconhecimento Facial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-puchoo-warm-100 rounded-lg h-48 flex items-center justify-center">
                    {fotoCapturada ? (
                      <div className="text-center">
                        <div className="w-32 h-32 bg-puchoo-green-light rounded-full mx-auto mb-2 flex items-center justify-center">
                          <CheckCircle className="w-16 h-16 text-puchoo-green" />
                        </div>
                        <p className="text-sm text-puchoo-green font-semibold">Face reconhecida!</p>
                      </div>
                    ) : registrando ? (
                      <div className="text-center">
                        <div className="animate-pulse">
                          <Camera className="w-16 h-16 text-puchoo-terracotta-light mx-auto mb-2" />
                          <p className="text-sm text-puchoo-terracotta">Capturando...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-puchoo-terracotta-light mx-auto mb-2" />
                        <p className="text-sm text-puchoo-terracotta">Aguardando captura</p>
                      </div>
                    )}
                  </div>
                  <Button onClick={capturarFoto} className="w-full" disabled={registrando}>
                    {registrando ? 'Capturando...' : 'Capturar Foto'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card: Geolocalização */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Geolocalização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-puchoo-warm-100 rounded-lg h-48 flex items-center justify-center">
                    {localizacao ? (
                      <div className="text-center p-4">
                        <MapPin className="w-12 h-12 text-puchoo-green mx-auto mb-2" />
                        <p className="text-xs font-semibold mb-1">Localização Validada</p>
                        <p className="text-xs text-puchoo-terracotta">Lat: {localizacao.lat.toFixed(6)}</p>
                        <p className="text-xs text-puchoo-terracotta">Lng: {localizacao.lng.toFixed(6)}</p>
                        <p className="text-xs text-puchoo-green mt-2">Precisão: {localizacao.precisao.toFixed(0)}m</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <MapPin className="w-16 h-16 text-puchoo-terracotta-light mx-auto mb-2" />
                        <p className="text-sm text-puchoo-terracotta">Aguardando GPS</p>
                      </div>
                    )}
                  </div>
                  <Button onClick={capturarLocalizacao} variant="outline" className="w-full">
                    Capturar Localização
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botões de Registro */}
          <Card>
            <CardHeader>
              <CardTitle>Registrar Ponto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => registrarPonto('Entrada')} 
                  className="h-20 text-lg bg-puchoo-green hover:bg-puchoo-green-dark"
                  disabled={!fotoCapturada || !localizacao}
                >
                  <Clock className="w-6 h-6 mr-2" />
                  Entrada
                </Button>
                <Button 
                  onClick={() => registrarPonto('Saída Almoço')} 
                  className="h-20 text-lg bg-puchoo-orange hover:bg-puchoo-orange-dark"
                  disabled={!fotoCapturada || !localizacao}
                >
                  <Clock className="w-6 h-6 mr-2" />
                  Saída Almoço
                </Button>
                <Button 
                  onClick={() => registrarPonto('Retorno Almoço')} 
                  className="h-20 text-lg bg-puchoo-green hover:bg-puchoo-green-dark"
                  disabled={!fotoCapturada || !localizacao}
                >
                  <Clock className="w-6 h-6 mr-2" />
                  Retorno
                </Button>
                <Button 
                  onClick={() => registrarPonto('Saída')} 
                  className="h-20 text-lg bg-puchoo-coral hover:bg-puchoo-coral-dark"
                  disabled={!fotoCapturada || !localizacao}
                >
                  <Clock className="w-6 h-6 mr-2" />
                  Saída
                </Button>
              </div>
              {(!fotoCapturada || !localizacao) && (
                <p className="text-sm text-puchoo-orange-dark mt-4 text-center">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Capture a foto e a localização antes de registrar o ponto
                </p>
              )}
            </CardContent>
          </Card>

          {/* Registros de Hoje */}
          <Card>
            <CardHeader>
              <CardTitle>Registros de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Foto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrosHoje.map((registro, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{registro.tipo}</TableCell>
                      <TableCell>{registro.horario}</TableCell>
                      <TableCell>
                        <Badge variant={registro.status === 'Normal' ? 'default' : 'secondary'}>
                          {registro.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-puchoo-terracotta">{registro.localizacao}</TableCell>
                      <TableCell>
                        {registro.foto && <CheckCircle className="w-5 h-5 text-puchoo-green" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: HISTÓRICO */}
        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Saída</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Modo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoSemanal.map((dia, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{dia.data}</TableCell>
                      <TableCell>{dia.entrada}</TableCell>
                      <TableCell>{dia.saida}</TableCell>
                      <TableCell className="font-semibold">{dia.total}</TableCell>
                      <TableCell>
                        <Badge variant={
                          dia.status === 'Completo' ? 'default' : 
                          dia.status === 'Atraso' ? 'secondary' : 'destructive'
                        }>
                          {dia.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {dia.modo === 'Presencial' ? <Building className="w-3 h-3 mr-1" /> : <Home className="w-3 h-3 mr-1" />}
                          {dia.modo}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: JUSTIFICATIVAS */}
        <TabsContent value="justificativas" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Justificativas e Atestados</CardTitle>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Nova Justificativa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Anexo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {justificativasPendentes.map((just, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{just.data}</TableCell>
                      <TableCell>{just.tipo}</TableCell>
                      <TableCell>{just.motivo}</TableCell>
                      <TableCell>
                        <Badge variant={
                          just.status === 'Aprovado' ? 'default' : 
                          just.status === 'Pendente' ? 'secondary' : 'destructive'
                        }>
                          {just.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {just.anexo && <CheckCircle className="w-5 h-5 text-puchoo-green" />}
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
              <CardTitle>Exportar Relatórios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20">
                  <Download className="w-6 h-6 mr-2" />
                  Espelho de Ponto (PDF)
                </Button>
                <Button variant="outline" className="h-20">
                  <Download className="w-6 h-6 mr-2" />
                  Relatório Mensal (Excel)
                </Button>
                <Button variant="outline" className="h-20">
                  <Download className="w-6 h-6 mr-2" />
                  Banco de Horas (CSV)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PontoExpandido;

