from database import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    collection_id = db.Column(db.Integer, unique=True, nullable=True)
    created_at = db.Column(db.Date, nullable=False)
    role = db.Column(db.String(), default="user")    

    __table_args__ = (
        db.CheckConstraint(role.in_(['user', 'premium', 'admin']), name='role_types'),      
    )

    def __init__(self, username, created_at, role, collection_id):
        self.username = username        
        self.created_at = created_at        
        self.role = role
        self.collection_id = collection_id
    
    def register_user_if_not_exist(self):        
        db_user = User.query.filter(User.username == self.username).all()
        db_collection_id = User.query.filter(User.collection_id == self.collection_id).all()
        if not db_user and not db_collection_id:
            db.session.add(self)
            db.session.commit()
        
        return True
    
    def get_by_username(username):        
        db_user = User.query.filter(User.username == username).first()
        return db_user
    
    def get_by_collection_id(collection_id):    
        db_user = User.query.filter(User.collection_id == collection_id).first()
        return db_user

    def __repr__(self):
        return f"<User {self.username}>"