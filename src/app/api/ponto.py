"""
API de Ponto Eletrônico
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from app.core.security import get_current_user

router = APIRouter()

class RegistroPontoRequest(BaseModel):
    funcionario_id: int
    tipo: str  # Entrada, Saída Almoço, Retorno Almoço, Saída
    timestamp: datetime
    foto_base64: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    modo_trabalho: str = "presencial"  # presencial ou home_office

class RegistroPontoResponse(BaseModel):
    id: int
    funcionario_id: int
    tipo: str
    timestamp: datetime
    status: str
    localizacao_validada: bool
    foto_validada: bool

class JustificativaRequest(BaseModel):
    funcionario_id: int
    data: date
    tipo: str  # Atraso, Falta, Saída Antecipada
    motivo: str
    anexo_url: Optional[str] = None

@router.post("/registrar", response_model=RegistroPontoResponse)
async def registrar_ponto(
    registro: RegistroPontoRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Registra ponto com reconhecimento facial e geolocalização
    
    - Valida foto via AWS Rekognition (simulado)
    - Valida geolocalização (precisão ≤ 20 metros)
    - Registra no banco de dados
    """
    
    # Simulação de validação facial
    foto_validada = bool(registro.foto_base64)
    
    # Simulação de validação de geolocalização
    localizacao_validada = bool(registro.latitude and registro.longitude)
    
    # Em produção: salvar no banco de dados
    return {
        "id": 1,
        "funcionario_id": registro.funcionario_id,
        "tipo": registro.tipo,
        "timestamp": registro.timestamp,
        "status": "Registrado",
        "localizacao_validada": localizacao_validada,
        "foto_validada": foto_validada
    }

@router.get("/relatorio")
async def get_relatorio(
    data_inicio: date,
    data_fim: date,
    funcionario_id: Optional[int] = None,
    formato: str = "json",  # json, pdf, csv, xlsx
    current_user: dict = Depends(get_current_user)
):
    """
    Gera relatório de ponto com filtros
    
    - Período (data_inicio, data_fim)
    - Funcionário específico (opcional)
    - Formato de exportação (json, pdf, csv, xlsx)
    """
    
    # Dados mock
    registros = [
        {
            "data": "2025-10-18",
            "funcionario": "João Silva",
            "entrada": "08:00:00",
            "saida_almoco": "12:00:00",
            "retorno_almoco": "13:00:00",
            "saida": "18:00:00",
            "total_horas": "08:00",
            "status": "Normal"
        },
        {
            "data": "2025-10-17",
            "funcionario": "João Silva",
            "entrada": "08:10:00",
            "saida_almoco": "12:00:00",
            "retorno_almoco": "13:00:00",
            "saida": "18:05:00",
            "total_horas": "07:55",
            "status": "Atraso"
        }
    ]
    
    if formato == "pdf":
        return {"message": "PDF gerado", "url": "/downloads/relatorio_ponto.pdf"}
    elif formato == "csv":
        return {"message": "CSV gerado", "url": "/downloads/relatorio_ponto.csv"}
    elif formato == "xlsx":
        return {"message": "Excel gerado", "url": "/downloads/relatorio_ponto.xlsx"}
    
    return {
        "data_inicio": data_inicio,
        "data_fim": data_fim,
        "total_registros": len(registros),
        "registros": registros
    }

@router.get("/folha")
async def get_folha_ponto(
    mes: int,
    ano: int,
    funcionario_id: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Gera folha de ponto mensal para integração com folha de pagamento
    """
    
    return {
        "mes": mes,
        "ano": ano,
        "funcionarios": [
            {
                "id": 1,
                "nome": "João Silva",
                "dias_trabalhados": 22,
                "total_horas": "176:00",
                "horas_extras": "8:00",
                "faltas": 0,
                "atrasos": 1
            }
        ]
    }

@router.post("/justificativa")
async def criar_justificativa(
    justificativa: JustificativaRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Cria justificativa de atraso, falta ou saída antecipada
    
    - Upload de atestado via MinIO (simulado)
    - Aguarda aprovação do gestor
    """
    
    return {
        "id": 1,
        "funcionario_id": justificativa.funcionario_id,
        "data": justificativa.data,
        "tipo": justificativa.tipo,
        "motivo": justificativa.motivo,
        "status": "Pendente",
        "anexo_url": justificativa.anexo_url
    }

@router.get("/justificativas")
async def listar_justificativas(
    funcionario_id: Optional[int] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Lista justificativas com filtros"""
    
    return {
        "total": 2,
        "justificativas": [
            {
                "id": 1,
                "funcionario": "João Silva",
                "data": "2025-10-14",
                "tipo": "Atraso",
                "motivo": "Trânsito",
                "status": "Pendente",
                "anexo": True
            },
            {
                "id": 2,
                "funcionario": "João Silva",
                "data": "2025-10-13",
                "tipo": "Falta",
                "motivo": "Atestado Médico",
                "status": "Aprovado",
                "anexo": True
            }
        ]
    }

@router.get("/estatisticas")
async def get_estatisticas(
    mes: int,
    ano: int,
    current_user: dict = Depends(get_current_user)
):
    """Retorna estatísticas de ponto do mês"""
    
    return {
        "mes": mes,
        "ano": ano,
        "total_funcionarios": 45,
        "registros_hoje": 45,
        "atrasos_mes": 12,
        "faltas_mes": 3,
        "horas_extras_mes": 180.5,
        "taxa_presenca": 97.8
    }

