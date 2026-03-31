import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";
import {
  ArrowLeft, Building2, Target, Eye, Heart, Globe, Mail, Phone,
  MapPin, Linkedin, Instagram, Facebook, ExternalLink, Users,
  ShieldCheck, Lightbulb, Handshake, Award, Leaf
} from "lucide-react";

const valores = [
  {
    icon: Lightbulb,
    titulo: "Inovação",
    descricao: "Buscamos constantemente soluções tecnológicas que transformem a gestão de pessoas, antecipando tendências e necessidades do mercado.",
    cor: "bg-puchoo-orange",
  },
  {
    icon: ShieldCheck,
    titulo: "Confiabilidade",
    descricao: "Garantimos segurança, precisão e conformidade em cada módulo, protegendo os dados e a reputação dos nossos clientes.",
    cor: "bg-puchoo-green",
  },
  {
    icon: Handshake,
    titulo: "Parceria",
    descricao: "Trabalhamos lado a lado com nossos clientes, entendendo suas particularidades e construindo soluções sob medida.",
    cor: "bg-puchoo-terracotta",
  },
  {
    icon: Users,
    titulo: "Humanização",
    descricao: "Acreditamos que a tecnologia deve servir às pessoas. Nossos sistemas são projetados para simplificar e valorizar o trabalho humano.",
    cor: "bg-puchoo-coral",
  },
  {
    icon: Award,
    titulo: "Excelência",
    descricao: "Comprometemo-nos com a qualidade em cada entrega, desde o código até o atendimento, buscando superar expectativas.",
    cor: "bg-puchoo-green-dark",
  },
  {
    icon: Leaf,
    titulo: "Sustentabilidade",
    descricao: "Promovemos práticas digitais que reduzem o uso de papel e otimizam processos, contribuindo para um futuro mais sustentável.",
    cor: "bg-puchoo-green-light",
  },
];

const diferenciais = [
  { numero: "15+", label: "Módulos Integrados" },
  { numero: "100%", label: "Conformidade eSocial" },
  { numero: "LGPD", label: "Totalmente Conforme" },
  { numero: "24/7", label: "Suporte Disponível" },
];

export default function SobreNokahi() {
  return (
    <div className="min-h-screen bg-puchoo-warm-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-puchoo-green-50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1 text-puchoo-green-dark hover:bg-puchoo-green-50">
                <ArrowLeft className="w-4 h-4" />Voltar
              </Button>
            </Link>
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8" />}
            <h1 className="text-lg font-bold text-puchoo-green-dark">Sobre a Nokahi</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-puchoo-green-dark via-puchoo-green to-puchoo-green-light py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {APP_LOGO && <img src={APP_LOGO} alt="Puchoo AI" className="h-24 mx-auto mb-6 drop-shadow-lg" />}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nokahi Consultoria e Soluções Ltda
          </h2>
          <p className="text-green-100 text-lg mb-2">
            Transformando a gestão de pessoas com inteligência artificial
          </p>
          <p className="text-green-200/70 text-sm">
            CNPJ 34.849.449/0001-40
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Quem Somos */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-puchoo-green w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-puchoo-green-dark">Quem Somos</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-puchoo-green-50 p-6 md:p-8">
            <p className="text-puchoo-green-dark leading-relaxed mb-4">
              A <strong>Nokahi Consultoria e Soluções Ltda</strong> é uma empresa brasileira especializada em 
              soluções tecnológicas para gestão de pessoas. Com sede em Manaus, Amazonas, nascemos da convicção 
              de que a tecnologia pode — e deve — simplificar a complexidade da gestão de recursos humanos no Brasil.
            </p>
            <p className="text-puchoo-terracotta leading-relaxed mb-4">
              Nosso principal produto, o <strong className="text-puchoo-green-dark">{APP_TITLE}</strong>, é um 
              sistema integrado que reúne 15 módulos essenciais para a gestão completa de pessoas: desde a folha 
              de pagamento e conformidade com o eSocial, passando pelo controle de ponto eletrônico (Portaria 671), 
              gestão de benefícios, saúde e segurança do trabalho, até recrutamento e seleção com triagem por 
              inteligência artificial.
            </p>
            <p className="text-puchoo-terracotta leading-relaxed">
              Combinamos expertise em legislação trabalhista brasileira com tecnologia de ponta para entregar 
              soluções que são ao mesmo tempo robustas e intuitivas, atendendo organizações de todos os portes 
              e segmentos.
            </p>
          </div>
        </section>

        {/* Missão, Visão */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white border-puchoo-green-50 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-puchoo-orange w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl text-puchoo-green-dark">Missão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-puchoo-terracotta leading-relaxed">
                Desenvolver soluções tecnológicas inovadoras que simplifiquem e otimizem a gestão de pessoas, 
                garantindo conformidade legal, segurança da informação e eficiência operacional para nossos 
                clientes, contribuindo para ambientes de trabalho mais organizados e humanos.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-puchoo-green-50 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-puchoo-coral w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl text-puchoo-green-dark">Visão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-puchoo-terracotta leading-relaxed">
                Ser referência nacional em soluções de gestão de pessoas baseadas em inteligência artificial, 
                reconhecida pela excelência tecnológica, pela proximidade com o cliente e pelo impacto positivo 
                na transformação digital das organizações brasileiras.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Valores */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-puchoo-terracotta w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-puchoo-green-dark">Nossos Valores</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {valores.map((valor) => {
              const IconComponent = valor.icon;
              return (
                <Card key={valor.titulo} className="bg-white border-puchoo-green-50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${valor.cor} w-9 h-9 rounded-lg flex items-center justify-center shadow-sm`}>
                        <IconComponent className="w-4.5 h-4.5 text-white" />
                      </div>
                      <h4 className="font-semibold text-puchoo-green-dark">{valor.titulo}</h4>
                    </div>
                    <p className="text-sm text-puchoo-terracotta leading-relaxed">{valor.descricao}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Diferenciais */}
        <section>
          <div className="bg-gradient-to-r from-puchoo-green-dark to-puchoo-green rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Nossos Diferenciais</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {diferenciais.map((d) => (
                <div key={d.label} className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">{d.numero}</p>
                  <p className="text-sm text-green-100 mt-1">{d.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contato e Redes Sociais */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-puchoo-coral w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-puchoo-green-dark">Contato e Redes Sociais</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Informações de Contato */}
            <Card className="bg-white border-puchoo-green-50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-puchoo-green-dark">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-puchoo-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-puchoo-green-dark text-sm">Endereço</p>
                    <p className="text-sm text-puchoo-terracotta">Manaus, Amazonas - Brasil</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-puchoo-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-puchoo-green-dark text-sm">E-mail</p>
                    <a href="mailto:contato@nokahi.com.br" className="text-sm text-puchoo-green hover:underline">
                      contato@nokahi.com.br
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-puchoo-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-puchoo-green-dark text-sm">Telefone</p>
                    <a href="tel:+5592999999999" className="text-sm text-puchoo-green hover:underline">
                      (92) 99999-9999
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-puchoo-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-puchoo-green-dark text-sm">CNPJ</p>
                    <p className="text-sm text-puchoo-terracotta">34.849.449/0001-40</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            <Card className="bg-white border-puchoo-green-50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-puchoo-green-dark">Siga-nos nas Redes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://www.linkedin.com/company/nokahi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-puchoo-warm-50 hover:bg-puchoo-green-50 transition-colors group"
                >
                  <div className="bg-[#0A66C2] w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
                    <Linkedin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-puchoo-green-dark text-sm">LinkedIn</p>
                    <p className="text-xs text-puchoo-terracotta">linkedin.com/company/nokahi</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-puchoo-green-light group-hover:text-puchoo-green transition-colors" />
                </a>

                <a
                  href="https://www.instagram.com/nokahi.consultoria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-puchoo-warm-50 hover:bg-puchoo-green-50 transition-colors group"
                >
                  <div className="bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-puchoo-green-dark text-sm">Instagram</p>
                    <p className="text-xs text-puchoo-terracotta">@nokahi.consultoria</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-puchoo-green-light group-hover:text-puchoo-green transition-colors" />
                </a>

                <a
                  href="https://www.facebook.com/nokahiconsultoria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-puchoo-warm-50 hover:bg-puchoo-green-50 transition-colors group"
                >
                  <div className="bg-[#1877F2] w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-puchoo-green-dark text-sm">Facebook</p>
                    <p className="text-xs text-puchoo-terracotta">facebook.com/nokahiconsultoria</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-puchoo-green-light group-hover:text-puchoo-green transition-colors" />
                </a>

                <a
                  href="https://nokahi.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-puchoo-warm-50 hover:bg-puchoo-green-50 transition-colors group"
                >
                  <div className="bg-puchoo-green w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-puchoo-green-dark text-sm">Website</p>
                    <p className="text-xs text-puchoo-terracotta">nokahi.com.br</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-puchoo-green-light group-hover:text-puchoo-green transition-colors" />
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center bg-white rounded-xl shadow-sm border border-puchoo-green-50 p-8">
          <h3 className="text-xl font-bold text-puchoo-green-dark mb-2">
            Pronto para transformar sua gestão de pessoas?
          </h3>
          <p className="text-sm text-puchoo-terracotta mb-6 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como o {APP_TITLE} pode otimizar os processos de RH 
            da sua organização com inteligência artificial e conformidade total.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="mailto:contato@nokahi.com.br">
              <Button className="bg-puchoo-orange hover:bg-puchoo-coral text-white gap-2 shadow-md">
                <Mail className="w-4 h-4" />Fale Conosco
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" className="gap-2 text-puchoo-green-dark border-puchoo-green-50 hover:bg-puchoo-green-50">
                <ArrowLeft className="w-4 h-4" />Voltar ao Sistema
              </Button>
            </Link>
          </div>
          <p className="text-xs text-puchoo-terracotta-light mt-6">
            Nokahi Consultoria e Soluções Ltda — CNPJ 34.849.449/0001-40 — Manaus, AM
          </p>
        </section>
      </main>
    </div>
  );
}
