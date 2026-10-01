import logging
from sqlalchemy import text
from app.database.base import Base
from app.database.session import engine

logger = logging.getLogger(__name__)

def init_db():
    """Initialize database tables and extensions."""
    try:
        with engine.connect() as conn:
            # Enable PostGIS extension if supported by Postgres
            try:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
                conn.commit()
                logger.info("PostGIS extension checked/enabled.")
            except Exception as pe:
                logger.warning(f"Note: PostGIS extension creation skipped: {pe}")
            
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization encountered an issue: {e}")

if __name__ == "__main__":
    init_db()
