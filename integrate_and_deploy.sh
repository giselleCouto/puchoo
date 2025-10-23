#!/bin/bash

# 1. Copiar arquivos do backend para o diretório de deploy
# O diretório de deploy já tem a estrutura do Flask/FastAPI
cp -r /home/ubuntu/puchoo-backend/app /home/ubuntu/puchoo-ai-deploy-v2/src/
cp /home/ubuntu/puchoo-backend/requirements.txt /home/ubuntu/puchoo-ai-deploy-v2/
cp /home/ubuntu/puchoo-backend/.env.example /home/ubuntu/puchoo-ai-deploy-v2/

# 2. Copiar as páginas expandidas do frontend
cp /home/ubuntu/puchoo-expanded/pages/*.jsx /home/ubuntu/puchoo-ai/frontend/src/pages/

# 3. Atualizar App.jsx para incluir as novas rotas
# Usando sed para adicionar as importações e rotas no App.jsx
APP_JSX="/home/ubuntu/puchoo-ai/frontend/src/App.jsx"

# Adicionar imports
sed -i '/import Folha from "\.\/pages\/Folha\.jsx";/a\
import PontoExpandido from "./pages/PontoExpandido.jsx";\
import SST from "./pages/SST.jsx";\
import PortalServidor from "./pages/PortalServidor.jsx";\
import IntegracaoBancaria from "./pages/IntegracaoBancaria.jsx";\
import ESocialDashboard from "./pages/ESocialDashboard.jsx";\
import LGPDExpandido from "./pages/LGPDExpandido.jsx";\
' "$APP_JSX"

# Adicionar rotas
sed -i '/<Route path="\/" element={<Dashboard \/>} \/>/a\
          <Route path="ponto-expandido" element={<PontoExpandido \/>} \/>\
          <Route path="sst" element={<SST \/>} \/>\
          <Route path="portal-servidor" element={<PortalServidor \/>} \/>\
          <Route path="integracao-bancaria" element={<IntegracaoBancaria \/>} \/>\
          <Route path="esocial" element={<ESocialDashboard \/>} \/>\
          <Route path="lgpd-expandido" element={<LGPDExpandido \/>} \/>\
' "$APP_JSX"

# 4. Reconstruir o frontend
cd /home/ubuntu/puchoo-ai/frontend
pnpm install
pnpm run build

# 5. Copiar o novo build para o diretório de deploy
rm -rf /home/ubuntu/puchoo-ai-deploy-v2/src/static/*
cp -r /home/ubuntu/puchoo-ai/frontend/dist/* /home/ubuntu/puchoo-ai-deploy-v2/src/static/

# 6. Atualizar main.py para usar FastAPI e as novas APIs
MAIN_PY="/home/ubuntu/puchoo-ai-deploy-v2/src/main.py"

# Conteúdo do novo main.py (FastAPI integrado com static files)
cat > "$MAIN_PY" << EOF
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
import os

# Importar rotas do backend
from app.api import ponto, sst, servidor, folha, esocial, lgpd, auth

# Configurações
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = FastAPI(
    title="PUCHOO AI - Full Stack",
    description="Sistema completo de Gestão de Pessoas, Folha de Pagamento e Aprendizagem Organizacional",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir todas as origens para o deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar diretório estático (Frontend Build)
app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

# Rotas de Autenticação
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

# Rota para servir o index.html (Frontend SPA)
@app.get("/{full_path:path}", include_in_schema=False)
async def serve_frontend(full_path: str):
    # Serve index.html para todas as rotas do frontend (necessário para SPA)
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0"}

EOF

# 7. Deploy final
cd /home/ubuntu/puchoo-ai-deploy-v2
# O deploy_backend será chamado após a execução deste script
echo "Preparação concluída. Pronto para deploy."

