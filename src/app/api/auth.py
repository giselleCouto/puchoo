"""
API de Autenticação
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.core.security import create_access_token, verify_password, get_password_hash
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Usuários mock (em produção, buscar do banco de dados)
MOCK_USERS = {
    "admin@puchoo.ai": {
        "email": "admin@puchoo.ai",
        "hashed_password": get_password_hash("senha123"),
        "role": "admin",
        "name": "Administrador"
    },
    "gestor@puchoo.ai": {
        "email": "gestor@puchoo.ai",
        "hashed_password": get_password_hash("gestor123"),
        "role": "gestor",
        "name": "Gestor"
    },
    "funcionario@puchoo.ai": {
        "email": "funcionario@puchoo.ai",
        "hashed_password": get_password_hash("func123"),
        "role": "funcionario",
        "name": "Funcionário"
    }
}

@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Endpoint de login
    
    Credenciais de teste:
    - admin@puchoo.ai / senha123
    - gestor@puchoo.ai / gestor123
    - funcionario@puchoo.ai / func123
    """
    user = MOCK_USERS.get(credentials.email)
    
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        }
    }

@router.post("/logout")
async def logout():
    """Endpoint de logout"""
    return {"message": "Logout realizado com sucesso"}

@router.get("/me")
async def get_me():
    """Retorna informações do usuário autenticado"""
    return {
        "email": "admin@puchoo.ai",
        "name": "Administrador",
        "role": "admin"
    }

