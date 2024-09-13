from functools import wraps
from flask import request, jsonify

def json_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'POST' and not request.is_json:
            return jsonify({'message': 'Corpo da requisição em formato incorreto!'}), 400
        
        try:
            request.get_json()
        except Exception as e:
            return jsonify({'error': "Invalido", "message":str(e)}), 400
        return f(*args, **kwargs)
    return decorated_function