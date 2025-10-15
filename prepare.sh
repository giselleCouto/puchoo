#!/bin/bash
# Script para preparar deploy do PUCHOO AI

echo "Preparando deploy..."

# Copiar static para dentro de src
cp -r ../puchoo-ai/frontend/dist src/static

echo "Deploy preparado!"

