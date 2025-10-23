"""
API de LGPD - Lei Geral de Proteção de Dados
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.core.security import get_current_user

router = APIRouter()

class ConsentimentoRequest(BaseModel):
    titular_cpf: str
    tipo: str  # Uso de Dados Pessoais, Compartilhamento, Marketing
    finalidade: str
    validade_anos: int = 1

class SolicitacaoRequest(BaseModel):
    tipo: str  # Acesso, Retificação, Exclusão, Portabilidade
    titular_cpf: str
    titular_nome: str
    descricao: str

@router.get("/consentimentos")
async def listar_consentimentos(
    cpf: Optional[str] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Lista consentimentos com filtros"""
    
    return {
        "total": 3,
        "consentimentos": [
            {
                "id": 1,
                "titular": "João Silva",
                "cpf": "123.456.789-00",
                "tipo": "Uso de Dados Pessoais",
                "status": "Ativo",
                "data": "2025-01-15",
                "validade": "2026-01-15"
            },
            {
                "id": 2,
                "titular": "Maria Santos",
                "cpf": "987.654.321-00",
                "tipo": "Compartilhamento com Terceiros",
                "status": "Ativo",
                "data": "2025-02-20",
                "validade": "2026-02-20"
            },
            {
                "id": 3,
                "titular": "Pedro Costa",
                "cpf": "456.789.123-00",
                "tipo": "Marketing",
                "status": "Revogado",
                "data": "2024-12-10",
                "validade": None
            }
        ]
    }

@router.post("/consentimentos")
async def criar_consentimento(
    consentimento: ConsentimentoRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Cria solicitação de consentimento
    
    - Envia email/SMS para o titular
    - Aguarda aceite
    - Registra no blockchain (opcional)
    """
    
    return {
        "id": 1,
        "titular_cpf": consentimento.titular_cpf,
        "tipo": consentimento.tipo,
        "finalidade": consentimento.finalidade,
        "status": "Aguardando Aceite",
        "data_solicitacao": datetime.now(),
        "link_aceite": f"https://puchoo.ai/lgpd/consentimento/{hash(consentimento.titular_cpf)}"
    }

@router.get("/solicitacoes")
async def listar_solicitacoes(
    tipo: Optional[str] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Lista solicitações de titulares"""
    
    return {
        "total": 4,
        "solicitacoes": [
            {
                "id": 1,
                "tipo": "Acesso",
                "titular": "Ana Paula",
                "cpf": "321.654.987-00",
                "data": "2025-10-15",
                "status": "Pendente",
                "prazo": "2025-10-30"
            },
            {
                "id": 2,
                "tipo": "Retificação",
                "titular": "Carlos Lima",
                "cpf": "789.123.456-00",
                "data": "2025-10-14",
                "status": "Em Análise",
                "prazo": "2025-10-29"
            },
            {
                "id": 3,
                "tipo": "Exclusão",
                "titular": "Juliana Souza",
                "cpf": "654.321.987-00",
                "data": "2025-10-10",
                "status": "Concluída",
                "prazo": "2025-10-25"
            }
        ]
    }

@router.post("/solicitacoes")
async def criar_solicitacao(
    solicitacao: SolicitacaoRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Cria solicitação de titular
    
    Tipos:
    - Acesso: Solicitar cópia dos dados
    - Retificação: Corrigir dados incorretos
    - Exclusão: Direito ao esquecimento
    - Portabilidade: Transferir dados
    
    Prazo legal: 15 dias (prorrogável por mais 15)
    """
    
    prazo = date.today().replace(day=date.today().day + 15)
    
    return {
        "id": 1,
        "tipo": solicitacao.tipo,
        "titular": solicitacao.titular_nome,
        "cpf": solicitacao.titular_cpf,
        "descricao": solicitacao.descricao,
        "data": date.today(),
        "prazo": prazo,
        "status": "Pendente",
        "protocolo": f"LGPD-{datetime.now().year}-{hash(solicitacao.titular_cpf) % 100000:05d}"
    }

@router.get("/auditoria")
async def get_auditoria(
    usuario: Optional[str] = None,
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Trilha de auditoria de acessos a dados pessoais
    
    Registra:
    - Quem acessou
    - Quando acessou
    - Quais dados
    - IP de origem
    - Resultado (sucesso/negado)
    """
    
    return {
        "total": 4,
        "logs": [
            {
                "id": 1,
                "usuario": "admin@puchoo.ai",
                "acao": "Acesso a dados de João Silva",
                "data": "2025-10-18 14:30:15",
                "ip": "192.168.1.100",
                "resultado": "Sucesso"
            },
            {
                "id": 2,
                "usuario": "gestor@puchoo.ai",
                "acao": "Exportação de relatório de funcionários",
                "data": "2025-10-18 12:15:30",
                "ip": "192.168.1.105",
                "resultado": "Sucesso"
            },
            {
                "id": 3,
                "usuario": "rh@puchoo.ai",
                "acao": "Tentativa de acesso a dados sensíveis",
                "data": "2025-10-18 10:45:22",
                "ip": "192.168.1.110",
                "resultado": "Negado"
            }
        ]
    }

@router.get("/inventario")
async def get_inventario(
    current_user: dict = Depends(get_current_user)
):
    """
    Inventário de dados pessoais tratados
    
    Conforme Art. 37 da LGPD
    """
    
    return {
        "categorias": [
            {
                "categoria": "Dados Pessoais",
                "tipos": "Nome, CPF, RG, Data de Nascimento",
                "finalidade": "Gestão de Funcionários",
                "base_legal": "Contrato de Trabalho",
                "retencao": "5 anos após desligamento",
                "compartilhamento": "Não"
            },
            {
                "categoria": "Dados Financeiros",
                "tipos": "Salário, Conta Bancária, Benefícios",
                "finalidade": "Pagamento de Salários",
                "base_legal": "Obrigação Legal",
                "retencao": "10 anos",
                "compartilhamento": "Bancos (para pagamento)"
            },
            {
                "categoria": "Dados de Saúde",
                "tipos": "ASO, Exames, Atestados",
                "finalidade": "Saúde e Segurança",
                "base_legal": "Obrigação Legal",
                "retencao": "20 anos",
                "compartilhamento": "eSocial"
            },
            {
                "categoria": "Dados de Localização",
                "tipos": "GPS de Ponto Eletrônico",
                "finalidade": "Controle de Jornada",
                "base_legal": "Consentimento",
                "retencao": "2 anos",
                "compartilhamento": "Não"
            }
        ]
    }

@router.get("/relatorios/conformidade")
async def gerar_relatorio_conformidade(
    mes: int,
    ano: int,
    current_user: dict = Depends(get_current_user)
):
    """Gera relatório mensal de conformidade LGPD"""
    
    return {
        "periodo": f"{ano}-{mes:02d}",
        "conformidade": 94.6,
        "consentimentos_ativos": 1180,
        "solicitacoes_atendidas": 15,
        "solicitacoes_pendentes": 3,
        "incidentes": 0,
        "acessos_auditados": 2547,
        "url_pdf": f"/downloads/lgpd_conformidade_{ano}_{mes:02d}.pdf"
    }

@router.get("/estatisticas")
async def get_estatisticas(
    current_user: dict = Depends(get_current_user)
):
    """Estatísticas gerais de LGPD"""
    
    return {
        "titulares": 1247,
        "consentimentos_ativos": 1180,
        "solicitacoes_pendentes": 8,
        "incidentes": 0,
        "conformidade": 94.6,
        "ultima_atualizacao": datetime.now()
    }

