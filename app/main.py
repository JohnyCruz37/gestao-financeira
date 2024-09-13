from app import create_app

app = create_app()

from app.models import *


if __name__ == '__main__':
    app.run(debug=True)
