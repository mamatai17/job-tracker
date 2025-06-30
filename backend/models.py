from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class JobApplication(Base):
    __tablename__='Job_applications'

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String)
    job_title = Column(String)
    notes = Column(String)
    status = Column(String)
    application_date = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="applications")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

User.applications = relationship("JobApplication", back_populates="owner")