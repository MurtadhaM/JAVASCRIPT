import sqlalchemy as sa, sqlite3 


db = sqlite3.connect('database.db')

db.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)')
db.execute('INSERT INTO users (username, password) VALUES ("admin", "admin")')

db.users.select( users.c.username == "admin" ).execute()
