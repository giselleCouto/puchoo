"""
API do Portal do Servidor
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from app.core.security import get_current_user

router = APIRouter()

@router.get("/perfil")
async def get_perfil(
    current_user: dict = Depends(get_current_user)
):
    """Retorna perfil completo do servidor"""
    
    return {
        "id": 1,
        "nome": "João Silva",
        "cpf": "123.456.789-00",
        "matricula": "2025001",
        "cargo": "Analista de Sistemas",
        "departamento": "TI",
        "data_admissao": "2020-01-15",
        "email": "joao.silva@empresa.com",
        "telefone": "(11) 98765-4321",
        "foto_url": "/fotos/joao_silva.jpg"
    }

@router.get("/contracheques")
async def get_contracheques(
    mes: Optional[int] = None,
    ano: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Retorna contracheques do servidor
    
    - Filtro por mês/ano (opcional)
    - Retorna histórico completo se não especificado
    """
    
    return {
        "total": 12,
        "contracheques": [
            {
                "id": 1,
                "competencia": "2025-10",
                "data_pagamento": "2025-10-05",
                "salario_base": 6500.00,
                "proventos": {
                    "salario_base": 6500.00,
                    "gratificacao": 1000.00,
                    "adicional_noturno": 0.00,
                    "horas_extras": 500.00,
                    "total": 8000.00
                },
                "descontos": {
                    "inss": 713.09,
                    "irrf": 505.64,
                    "vale_transporte": 130.00,
                    "plano_saude": 250.00,
                    "total": 1598.73
                },
                "liquido": 6401.27,
                "fgts": 520.00,
                "bases_calculo": {
                    "base_inss": 7786.02,
                    "base_irrf": 7086.91,
                    "base_fgts": 6500.00
                },
                "dias_trabalhados": 22,
                "faltas": 0
            }
        ]
    }

@router.get("/contracheques/{id}/pdf")
async def download_contracheque(
    id: int,
    current_user: dict = Depends(get_current_user)
):
    """Download do contracheque em PDF"""
    
    return {
        "url": f"/downloads/contracheque_{id}.pdf",
        "filename": f"contracheque_2025_10.pdf"
    }

@router.get("/informes")
async def get_informes(
    ano: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Retorna informe de rendimentos anual para IR
    """
    
    return {
        "ano": ano,
        "funcionario": "João Silva",
        "cpf": "123.456.789-00",
        "total_rendimentos": 96000.00,
        "total_descontos": 19184.76,
        "inss_retido": 8557.08,
        "irrf_retido": 6067.68,
        "plano_saude": 3000.00,
        "dependentes": 0,
        "url_pdf": f"/downloads/informe_rendimentos_{ano}.pdf"
    }

@router.get("/beneficios")
async def get_beneficios(
    current_user: dict = Depends(get_current_user)
):
    """Lista benefícios do servidor"""
    
    return {
        "beneficios": [
            {
                "tipo": "Vale Alimentação",
                "valor": 600.00,
                "status": "Ativo",
                "operadora": "Alelo"
            },
            {
                "tipo": "Vale Transporte",
                "valor": 130.00,
                "status": "Ativo",
                "operadora": "VT Carioca"
            },
            {
                "tipo": "Plano de Saúde",
                "valor": 250.00,
                "status": "Ativo",
                "operadora": "Unimed",
                "dependentes": 2
            },
            {
                "tipo": "Seguro de Vida",
                "valor": 15.00,
                "status": "Ativo",
                "operadora": "MetLife",
                "cobertura": 100000.00
            }
        ]
    }

@router.get("/ferias")
async def get_ferias(
    current_user: dict = Depends(get_current_user)
):
    """Histórico de férias"""
    
    return {
        "saldo_dias": 30,
        "periodo_aquisitivo": "2024-01-15 a 2025-01-14",
        "historico": [
            {
                "id": 1,
                "periodo_aquisitivo": "2023-01-15 a 2024-01-14",
                "data_inicio": "2024-01-20",
                "data_fim": "2024-02-18",
                "dias": 30,
                "abono_pecuniario": 0,
                "valor_pago": 8666.67,
                "status": "Gozadas"
            }
        ]
    }

@router.get("/documentos")
async def get_documentos(
    current_user: dict = Depends(get_current_user)
):
    """Lista documentos pessoais"""
    
    return {
        "documentos": [
            {
                "tipo": "Contrato de Trabalho",
                "data_upload": "2020-01-15",
                "url": "/documentos/contrato_trabalho.pdf"
            },
            {
                "tipo": "ASO Admissional",
                "data_upload": "2020-01-10",
                "url": "/documentos/aso_admissional.pdf"
            },
            {
                "tipo": "Ficha de Registro",
                "data_upload": "2020-01-15",
                "url": "/documentos/ficha_registro.pdf"
            },
            {
                "tipo": "Termo de Confidencialidade",
                "data_upload": "2020-01-15",
                "url": "/documentos/termo_confidencialidade.pdf"
            }
        ]
    }

