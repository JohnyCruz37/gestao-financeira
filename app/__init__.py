from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from app.config.config import Config

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)

    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'pages.login'
    login_manager.login_message_category = 'info'

    app.config['UPLOAD_FOLDER'] = Config.UPLOAD_FOLDER

    @login_manager.user_loader
    def load_user(user_id):
        from app.models.user import User
        return User.query.get(int(user_id))

    from app.routes.pages import pages
    from app.routes.apis import apis

    app.register_blueprint(pages)
    app.register_blueprint(apis, url_prefix='/api')

    return app