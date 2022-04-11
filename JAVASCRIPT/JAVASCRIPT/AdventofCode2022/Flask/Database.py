import sqlalchemy as sa


class Database():
    def __init__(self, db_name):
        self.db_name = db_name
        self.engine = sa.create_engine('sqlite:///' + db_name)
        self.metadata = sa.MetaData()
        self.users = sa.Table('users', self.metadata,
                              sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
                              sa.Column('username', sa.String),
                              sa.Column('password', sa.String))
        self.metadata.create_all(self.engine)

    def add_user(self, username, password):
        ins = self.users.insert().values(username=username, password=password)
        self.engine.execute(ins)
        if (self.get_user(username) and self.get_user(password)):
            return True
        else:
            return False

    def get_user(self, username):
        sel = self.users.select().where(self.users.c.username == username)
        res = self.engine.execute(sel)
        return res.fetchone()

    def get_all_users(self):
        sel = self.users.select()
        res = self.engine.execute(sel)
        return res.fetchall()