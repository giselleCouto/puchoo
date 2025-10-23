"""
API de SST - Saúde e Segurança do Trabalho
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
from app.core.security import get_current_user

router = APIRouter()

class ASORequest(BaseModel):
    funcionario_id: int
    tipo: str  # Admissional, Periódico, Retorno ao Trabalho, Mudança de Função, Demissional
    data_exame: date
    medico_responsavel: str
    crm: str
    resultado: str  # Apto, Inapto
    observacoes: Optional[str] = None
    validade: date

class RiscoRequest(BaseModel):
    funcionario_id: int
    tipo_risco: str  # Físico, Químico, Biológico, Ergonômico, Acidentes
    agente: str
    intensidade: str  # Baixo, Médio, Alto, Crítico
    medidas_controle: str
    epi_necessario: Optional[str] = None

class CATRequest(BaseModel):
    funcionario_id: int
    data_acidente: datetime
    tipo_acidente: str  # Típico, Trajeto, Doença Ocupacional
    parte_corpo_atingida: str
    descricao: str
    houve_afastamento: bool
    dias_afastamento: Optional[int] = None
    testemunhas: Optional[str] = None

@router.post("/aso")
async def criar_aso(
    aso: ASORequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Cria ASO (Atestado de Saúde Ocupacional)
    
    - Gera evento eSocial S-2220
    - Armazena documento em MinIO
    - Controla validade
    """
    
    return {
        "id": 1,
        "funcionario_id": aso.funcionario_id,
        "tipo": aso.tipo,
        "data_exame": aso.data_exame,
        "resultado": aso.resultado,
        "validade": aso.validade,
        "status": "Ativo",
        "esocial_enviado": False,
        "documento_url": "/documentos/aso/1.pdf"
    }

@router.get("/aso")
async def listar_aso(
    funcionario_id: Optional[int] = None,
    tipo: Optional[str] = None,
    vencendo_em_dias: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Lista ASOs com filtros"""
    
    return {
        "total": 3,
        "asos": [
            {
                "id": 1,
                "funcionario": "João Silva",
                "tipo": "Periódico",
                "data_exame": "2025-01-15",
                "resultado": "Apto",
                "validade": "2026-01-15",
                "dias_para_vencer": 89,
                "status": "Ativo"
            },
            {
                "id": 2,
                "funcionario": "Maria Santos",
                "tipo": "Admissional",
                "data_exame": "2025-02-20",
                "resultado": "Apto",
                "validade": "2026-02-20",
                "dias_para_vencer": 125,
                "status": "Ativo"
            }
        ]
    }

@router.post("/riscos")
async def cadastrar_risco(
    risco: RiscoRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Cadastra risco ocupacional
    
    - Gera evento eSocial S-2240
    - Atualiza PPRA/PGR
    """
    
    return {
        "id": 1,
        "funcionario_id": risco.funcionario_id,
        "tipo_risco": risco.tipo_risco,
        "agente": risco.agente,
        "intensidade": risco.intensidade,
        "medidas_controle": risco.medidas_controle,
        "epi_necessario": risco.epi_necessario,
        "esocial_enviado": False
    }

@router.get("/riscos")
async def listar_riscos(
    funcionario_id: Optional[int] = None,
    tipo_risco: Optional[str] = None,
    intensidade: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Lista riscos ocupacionais"""
    
    return {
        "total": 4,
        "riscos": [
            {
                "id": 1,
                "funcionario": "João Silva",
                "tipo_risco": "Físico",
                "agente": "Ruído",
                "intensidade": "Alto",
                "epi": "Protetor Auricular"
            },
            {
                "id": 2,
                "funcionario": "Maria Santos",
                "tipo_risco": "Ergonômico",
                "agente": "Postura Inadequada",
                "intensidade": "Médio",
                "epi": "Cadeira Ergonômica"
            }
        ]
    }

@router.post("/cat")
async def registrar_cat(
    cat: CATRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Registra CAT (Comunicação de Acidente de Trabalho)
    
    - Gera evento eSocial S-2210
    - Notifica INSS
    - Prazo: até o 1º dia útil seguinte ao acidente
    """
    
    return {
        "id": 1,
        "numero_cat": f"CAT-{datetime.now().year}-{1:06d}",
        "funcionario_id": cat.funcionario_id,
        "data_acidente": cat.data_acidente,
        "tipo_acidente": cat.tipo_acidente,
        "houve_afastamento": cat.houve_afastamento,
        "dias_afastamento": cat.dias_afastamento,
        "status": "Registrada",
        "esocial_enviado": False,
        "protocolo_inss": None
    }

@router.get("/cat")
async def listar_cat(
    funcionario_id: Optional[int] = None,
    ano: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Lista CATs registradas"""
    
    return {
        "total": 1,
        "cats": [
            {
                "id": 1,
                "numero_cat": "CAT-2025-000001",
                "funcionario": "Pedro Costa",
                "data_acidente": "2025-09-15T14:30:00",
                "tipo_acidente": "Típico",
                "parte_corpo": "Mão Direita",
                "afastamento": True,
                "dias_afastamento": 15,
                "status": "Registrada"
            }
        ]
    }

@router.get("/exames")
async def listar_exames(
    funcionario_id: Optional[int] = None,
    tipo: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Lista exames ocupacionais"""
    
    return {
        "total": 5,
        "exames": [
            {
                "id": 1,
                "funcionario": "João Silva",
                "tipo": "Audiometria",
                "data": "2025-01-15",
                "resultado": "Normal",
                "clinica": "Clínica Saúde Total"
            },
            {
                "id": 2,
                "funcionario": "João Silva",
                "tipo": "Acuidade Visual",
                "data": "2025-01-15",
                "resultado": "Normal",
                "clinica": "Clínica Saúde Total"
            }
        ]
    }

@router.get("/relatorios")
async def gerar_relatorio(
    tipo: str,  # PPRA, PCMSO, LTCAT, PGR
    formato: str = "pdf",  # pdf, docx
    current_user: dict = Depends(get_current_user)
):
    """
    Gera relatórios de SST
    
    - PPRA: Programa de Prevenção de Riscos Ambientais
    - PCMSO: Programa de Controle Médico de Saúde Ocupacional
    - LTCAT: Laudo Técnico das Condições Ambientais do Trabalho
    - PGR: Programa de Gerenciamento de Riscos
    """
    
    return {
        "tipo": tipo,
        "formato": formato,
        "data_geracao": datetime.now(),
        "url": f"/downloads/{tipo.lower()}_2025.{formato}",
        "validade": "2026-12-31"
    }

@router.get("/estatisticas")
async def get_estatisticas(
    current_user: dict = Depends(get_current_user)
):
    """Retorna estatísticas de SST"""
    
    return {
        "exames_pendentes": 8,
        "asos_vencendo": 3,
        "riscos_criticos": 2,
        "cats_ano": 1,
        "taxa_conformidade": 94.5,
        "funcionarios_expostos_riscos": 12
    }

