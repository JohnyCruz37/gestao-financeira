from flask import send_from_directory, current_app
from flask_login import login_required
import os
from app.routes.pages import pages
from app.config.config import Config

ALLOWED_DIRS = {
    'notas_fiscais_uploads': Config.UPLOAD_FOLDER,
    'comprovantes_pagamentos_uploads': Config.UPLOAD_FOLDER_COMPROVANTES
}

@pages.route('/uploads/<path:directory>/<path:filename>')
@login_required
def serve_image(directory, filename):
    if directory not in ALLOWED_DIRS:
        return 'Diretório não permitido', 403

    uploads_dir = os.path.join(current_app.root_path, ALLOWED_DIRS[directory])

    full_path = os.path.join(uploads_dir, filename)

    if not os.path.exists(full_path):
        return 'Arquivo não encontrado', 404

    return send_from_directory(uploads_dir, filename)

