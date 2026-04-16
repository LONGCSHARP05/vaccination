from sqlalchemy.orm.session import Session


from sqlalchemy.orm.session import Session


from sqlalchemy import create_engine 
# thư viện để tạo kết nối với database
from sqlalchemy.orm import sessionmaker, declarative_base # khai báo base cho các model
# thư viện để tạo session làm việc với database
import os # thư viện os để làm việc với biến môi trường
from core.config import settings



engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URL,
) # tạo engine kết nối với database

SessionLocal = sessionmaker(bind=engine) # tạo session để làm việc với database
# bind là liên kết session với engine đã tạo




