import os
class Config:
    SECRET_KEY = 'ffdardfoidnpeqinfpoihewinpoaidfsAfadfasdMdpfiadjfAfpasdofiaM'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:Jc_1234@localhost/db_amam'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, '../notas_fiscais_uploads')