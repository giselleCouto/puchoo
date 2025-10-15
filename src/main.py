"""
PUCHOO AI - Sistema de Gestão de Pessoas e Folha de Pagamento
"""
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime
import jwt
import os

# Configurar Flask com static dentro de src
app = Flask(__name__, static_folder='static', static_url_path='')
app.config['SECRET_KEY'] = 'puchoo-ai-production-key-2025'
CORS(app, resources={r"/*": {"origins": "*"}})

# ==================== DADOS SIMULADOS ====================

USERS_DB = {
    'admin@puchoo.ai': {
        'password': 'senha123',
        'nome': 'Administrador Sistema',
        'role': 'admin'
    },
    'gestor@puchoo.ai': {
        'password': 'gestor123',
        'nome': 'Gestor de Equipe',
        'role': 'gestor'
    }
}

FUNCIONARIOS_DB = [
    {
        'id': 1,
        'nome': 'João Silva Santos',
        'cpf': '123.456.789-00',
        'email': 'joao.silva@empresa.gov.br',
        'telefone': '(11) 98765-4321',
        'cargo': 'Analista de Sistemas',
        'departamento': 'TI',
        'salario': 8500.00,
        'data_admissao': '2020-01-15',
        'status': 'ativo'
    },
    {
        'id': 2,
        'nome': 'Maria Oliveira Costa',
        'cpf': '987.654.321-00',
        'email': 'maria.oliveira@empresa.gov.br',
        'telefone': '(11) 98765-1234',
        'cargo': 'Gerente de RH',
        'departamento': 'RH',
        'salario': 12000.00,
        'data_admissao': '2018-03-20',
        'status': 'ativo'
    },
    {
        'id': 3,
        'nome': 'Pedro Henrique Souza',
        'cpf': '456.789.123-00',
        'email': 'pedro.souza@empresa.gov.br',
        'telefone': '(11) 98765-5678',
        'cargo': 'Desenvolvedor Full Stack',
        'departamento': 'TI',
        'salario': 9500.00,
        'data_admissao': '2021-06-10',
        'status': 'ativo'
    },
    {
        'id': 4,
        'nome': 'Ana Carolina Lima',
        'cpf': '789.123.456-00',
        'email': 'ana.lima@empresa.gov.br',
        'telefone': '(11) 98765-9012',
        'cargo': 'Analista de RH',
        'departamento': 'RH',
        'salario': 7000.00,
        'data_admissao': '2022-02-15',
        'status': 'ferias'
    }
]

FOLHAS_DB = [
    {
        'competencia': '2025-10',
        'data_processamento': '2025-10-25 10:30:00',
        'status': 'processada',
        'total_funcionarios': 1247,
        'valor_total_bruto': 2847920.00,
        'total_inss': 284792.00,
        'total_irrf': 142396.00,
        'total_fgts': 227834.00,
        'total_liquido': 2420732.00
    },
    {
        'competencia': '2025-09',
        'data_processamento': '2025-09-25 10:30:00',
        'status': 'processada',
        'total_funcionarios': 1240,
        'valor_total_bruto': 2820000.00,
        'total_inss': 282000.00,
        'total_irrf': 141000.00,
        'total_fgts': 225600.00,
        'total_liquido': 2397000.00
    }
]

# ==================== ROTAS DA API ====================

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'PUCHOO AI',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = USERS_DB.get(email)
    if user and user['password'] == password:
        token = jwt.encode({
            'email': email,
            'role': user['role']
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'email': email,
                'nome': user['nome'],
                'role': user['role']
            }
        })
    
    return jsonify({'message': 'Credenciais inválidas'}), 401

@app.route('/api/v1/funcionarios', methods=['GET'])
def listar_funcionarios():
    return jsonify({
        'total': len(FUNCIONARIOS_DB),
        'funcionarios': FUNCIONARIOS_DB
    })

@app.route('/api/v1/funcionarios/estatisticas', methods=['GET'])
def estatisticas_funcionarios():
    return jsonify({
        'total': 1247,
        'ativos': 1189,
        'ferias': 42,
        'afastados': 16,
        'por_departamento': {
            'TI': 180,
            'RH': 120,
            'Administrativo': 320,
            'Financeiro': 177,
            'Operacional': 450
        }
    })

@app.route('/api/v1/folha', methods=['GET'])
def listar_folhas():
    return jsonify({
        'total': len(FOLHAS_DB),
        'folhas': FOLHAS_DB
    })

# ==================== ROTAS DO FRONTEND ====================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

