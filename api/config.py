class DefaultConfig(object):
    VERSION = "1.0.0"
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:changeit@postgres_db:5432/postgres"
    SQLALCHEMY_TRACK_MODIFICATIONS = False