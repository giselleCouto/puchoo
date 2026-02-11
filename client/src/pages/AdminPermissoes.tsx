import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, Shield, Users, Key, Settings, Plus, Check, X } from "lucide-react";
import { useState, useMemo } from "react";

const MODULOS = [
  { id: "folha", nome: "Folha de Pagamento", categoria: "Gestão de Pessoal" },
  { id: "esocial", nome: "eSocial", categoria: "Gestão de Pessoal" },
  { id: "ponto", nome: "Controle de Ponto", categoria: "Gestão de Pessoal" },
  { id: "beneficios", nome: "Gestão de Benefícios", categoria: "Gestão de Pessoal" },
  { id: "sst", nome: "SST/SESMT", categoria: "Saúde e Segurança" },
  { id: "medicina", nome: "Medicina Ocupacional", categoria: "Saúde e Segurança" },
  { id: "desempenho", nome: "Gestão de Desempenho", categoria: "Desenvolvimento" },
  { id: "recrutamento", nome: "Recrutamento e Seleção", categoria: "Desenvolvimento" },
  { id: "quadroVagas", nome: "Quadro de Vagas", categoria: "Desenvolvimento" },
  { id: "portal", nome: "Portal do Colaborador", categoria: "Autoatendimento" },
  { id: "acesso", nome: "Controle de Acesso", categoria: "Infraestrutura" },
  { id: "lgpd", nome: "LGPD", categoria: "Conformidade" },
  { id: "bancaria", nome: "Integração Bancária", categoria: "Financeiro" },
  { id: "suporte", nome: "Suporte", categoria: "Atendimento" },
  { id: "auditoria", nome: "Auditoria", categoria: "Conformidade" },
];

const PERFIS_PADRAO = [
  { nome: "Administrador", descricao: "Acesso total a todos os módulos", cor: "bg-puchoo-coral-light/30 text-puchoo-coral" },
  { nome: "RH", descricao: "Gestão de pessoal, folha, benefícios e recrutamento", cor: "bg-puchoo-green-50 text-puchoo-green-dark" },
  { nome: "Gestor", descricao: "Avaliações, ponto da equipe e portal", cor: "bg-puchoo-green-50 text-puchoo-green-dark" },
  { nome: "Colaborador", descricao: "Portal do colaborador e autoatendimento", cor: "bg-puchoo-warm-100 text-puchoo-green-dark" },
];

export default function AdminPermissoes() {
  const { user } = useAuth();
  const perfis = trpc.permissoes.getPerfis.useQuery();
  const criarPerfil = trpc.permissoes.criarPerfil.useMutation();
  const [activeTab, setActiveTab] = useState<"perfis" | "usuarios" | "modulos">("perfis");
  const [novoPerfil, setNovoPerfil] = useState({ nome: "", descricao: "" });
  const [permissoes, setPermissoes] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);

  const categorias = useMemo(() => {
    const cats: Record<string, typeof MODULOS> = {};
    MODULOS.forEach(m => {
      if (!cats[m.categoria]) cats[m.categoria] = [];
      cats[m.categoria].push(m);
    });
    return cats;
  }, []);

  const handleCriarPerfil = async () => {
    if (!novoPerfil.nome) return;
    await criarPerfil.mutateAsync({ nome: novoPerfil.nome, descricao: novoPerfil.descricao, permissoes });
    setNovoPerfil({ nome: "", descricao: "" });
    setPermissoes({});
    setShowForm(false);
    perfis.refetch();
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-puchoo-warm-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-16 h-16 mx-auto text-puchoo-coral mb-4" />
            <h2 className="text-xl font-bold text-puchoo-green-dark mb-2">Acesso Restrito</h2>
            <p className="text-puchoo-terracotta mb-4">Esta área é restrita a administradores do sistema.</p>
            <Link href="/"><Button variant="outline">Voltar ao Dashboard</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-puchoo-warm-50 to-puchoo-warm-100">
      <header className="bg-white shadow-sm border-b border-puchoo-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button></Link>
          <div className="flex items-center gap-3">
            <div className="bg-puchoo-green-dark w-10 h-10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-puchoo-green-dark">Painel Administrativo</h1>
              <p className="text-sm text-puchoo-terracotta">Controle de permissões e perfis de acesso</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button variant={activeTab === "perfis" ? "default" : "outline"} onClick={() => setActiveTab("perfis")} className="gap-2">
            <Key className="w-4 h-4" />Perfis de Acesso
          </Button>
          <Button variant={activeTab === "usuarios" ? "default" : "outline"} onClick={() => setActiveTab("usuarios")} className="gap-2">
            <Users className="w-4 h-4" />Usuários
          </Button>
          <Button variant={activeTab === "modulos" ? "default" : "outline"} onClick={() => setActiveTab("modulos")} className="gap-2">
            <Settings className="w-4 h-4" />Módulos
          </Button>
        </div>

        {activeTab === "perfis" && (
          <div className="space-y-6">
            {/* Perfis Padrão */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Perfis de Acesso</CardTitle>
                    <CardDescription>Gerencie os perfis e suas permissões por módulo</CardDescription>
                  </div>
                  <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                    <Plus className="w-4 h-4" />Novo Perfil
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showForm && (
                  <div className="mb-6 p-4 bg-puchoo-green-50 rounded-lg border border-puchoo-green-light">
                    <h3 className="font-medium text-puchoo-green-dark mb-3">Criar Novo Perfil</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text" placeholder="Nome do perfil"
                        value={novoPerfil.nome} onChange={e => setNovoPerfil(p => ({ ...p, nome: e.target.value }))}
                        className="px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="text" placeholder="Descrição"
                        value={novoPerfil.descricao} onChange={e => setNovoPerfil(p => ({ ...p, descricao: e.target.value }))}
                        className="px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <h4 className="text-sm font-medium text-puchoo-green-dark mb-2">Permissões por Módulo:</h4>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {MODULOS.map(m => (
                        <label key={m.id} className="flex items-center gap-2 text-sm p-2 bg-white rounded border cursor-pointer hover:bg-puchoo-green-50">
                          <input
                            type="checkbox" checked={!!permissoes[m.id]}
                            onChange={e => setPermissoes(p => ({ ...p, [m.id]: e.target.checked }))}
                            className="rounded"
                          />
                          {m.nome}
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCriarPerfil} disabled={!novoPerfil.nome} className="gap-2">
                        <Check className="w-4 h-4" />Criar Perfil
                      </Button>
                      <Button variant="outline" onClick={() => setShowForm(false)} className="gap-2">
                        <X className="w-4 h-4" />Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PERFIS_PADRAO.map((p, i) => (
                    <div key={i} className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge className={p.cor}>{p.nome}</Badge>
                          <p className="text-sm text-puchoo-terracotta mt-2">{p.descricao}</p>
                        </div>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {MODULOS.filter((_, idx) => {
                          if (p.nome === "Administrador") return true;
                          if (p.nome === "RH") return idx < 8;
                          if (p.nome === "Gestor") return [2, 6, 9].includes(idx);
                          return idx === 9;
                        }).map(m => (
                          <span key={m.id} className="text-xs px-2 py-0.5 bg-puchoo-warm-100 rounded">{m.nome}</span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Perfis do banco */}
                  {perfis.data?.perfis.map((p) => (
                    <div key={p.id} className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge className="bg-purple-100 text-purple-800">{p.nome}</Badge>
                          <p className="text-sm text-puchoo-terracotta mt-2">{p.descricao || "Sem descrição"}</p>
                        </div>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(() => {
                          if (!p.permissoes || typeof p.permissoes !== "object") return null;
                          const perms = p.permissoes as Record<string, boolean>;
                          return Object.keys(perms).filter(k => perms[k]).map(k => (
                            <span key={k} className="text-xs px-2 py-0.5 bg-purple-50 rounded">{k}</span>
                          ));
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "usuarios" && (
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Usuários</CardTitle>
              <CardDescription>Atribua perfis de acesso aos usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-lg border flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user?.name || "Admin"}</p>
                    <p className="text-xs text-puchoo-terracotta">{user?.email || "admin@puchoo.ai"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-puchoo-coral-light/30 text-puchoo-coral">Administrador</Badge>
                    <Badge variant="outline">Owner</Badge>
                  </div>
                </div>
                <div className="p-6 bg-puchoo-warm-50 rounded-lg text-center">
                  <Users className="w-12 h-12 mx-auto text-puchoo-terracotta-light mb-3" />
                  <p className="text-puchoo-terracotta">Novos usuários aparecerão aqui após o primeiro login via OAuth.</p>
                  <p className="text-xs text-puchoo-terracotta-light mt-1">Você poderá atribuir perfis de acesso a cada usuário.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "modulos" && (
          <Card>
            <CardHeader>
              <CardTitle>Módulos do Sistema</CardTitle>
              <CardDescription>Visão geral dos 15 módulos e suas permissões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(categorias).map(([cat, mods]) => (
                  <div key={cat}>
                    <h3 className="text-sm font-semibold text-puchoo-terracotta uppercase tracking-wider mb-3">{cat}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {mods.map(m => (
                        <div key={m.id} className="p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-sm">{m.nome}</p>
                            <Badge variant="outline" className="text-xs">Ativo</Badge>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {PERFIS_PADRAO.map((p, i) => {
                              const hasAccess = p.nome === "Administrador" ||
                                (p.nome === "RH" && MODULOS.indexOf(m) < 8) ||
                                (p.nome === "Gestor" && ["ponto", "desempenho", "portal"].includes(m.id)) ||
                                (p.nome === "Colaborador" && m.id === "portal");
                              return (
                                <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${hasAccess ? "bg-puchoo-green-50 text-puchoo-green-dark" : "bg-puchoo-warm-100 text-puchoo-terracotta-light"}`}>
                                  {p.nome.substring(0, 3)}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
