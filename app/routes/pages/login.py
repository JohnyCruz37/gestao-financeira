from flask import render_template, redirect, url_for
from flask_login import logout_user, current_user
from ..pages import pages
@pages.route('/')
def login():
    return render_template('pages/login.html')


@pages.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
    return redirect(url_for('pages.login'))