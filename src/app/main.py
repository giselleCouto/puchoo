"""
PUCHOO AI - Backend API
Sistema completo de Gestão de Pessoas, Folha de Pagamento e Aprendizagem Organizacional
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api import ponto, sst, servidor, folha, esocial, lgpd, auth

app = FastAPI(
    title="PUCHOO AI API",
    description="API completa para gestão de RH, folha de pagamento e conformidade",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas de autenticação
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticação"])

# Rotas de Ponto Eletrônico
app.include_router(ponto.router, prefix="/api/v1/ponto", tags=["Ponto Eletrônico"])

# Rotas de SST
app.include_router(sst.router, prefix="/api/v1/sst", tags=["SST"])

# Rotas de Portal do Servidor
app.include_router(servidor.router, prefix="/api/v1/servidor", tags=["Portal do Servidor"])

# Rotas de Folha de Pagamento
app.include_router(folha.router, prefix="/api/v1/folha", tags=["Folha de Pagamento"])

# Rotas de eSocial
app.include_router(esocial.router, prefix="/api/v1/esocial", tags=["eSocial"])

# Rotas de LGPD
app.include_router(lgpd.router, prefix="/api/v1/lgpd", tags=["LGPD"])

@app.get("/")
async def root():
    """Endpoint raiz da API"""
    return {
        "message": "PUCHOO AI API v2.0.0",
        "status": "online",
        "docs": "/api/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "2.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

