from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from models import User
from fastapi.middleware.cors import CORSMiddleware
from users import router as user_router
from auth import get_current_user

app = FastAPI()

origins = [
    "http://localhost:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(user_router)

class JobAppBase(BaseModel):
    company: str
    job_title: str
    notes: str
    status: str
    application_date: str

class JobAppModel(JobAppBase):
    id: int

    class Config:
        from_attributes= True

def get_db():
    db= SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/applications/", response_model=JobAppModel)
def create_application(app_data: JobAppBase, db: db_dependency, current_user: User = Depends(get_current_user)):
    app_entry = models.JobApplication(**app_data.dict(), owner_id=current_user.id)
    db.add(app_entry)
    db.commit()
    db.refresh(app_entry)
    return app_entry

@app.get("/applications/", response_model=List[JobAppModel])
def read_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(models.JobApplication).filter(models.JobApplication.owner_id == current_user.id).all()

from fastapi import Path

# 🚀 PUT: Update a job
@app.put("/applications/{job_id}", response_model=JobAppModel)
def update_application(
    job_id: int,
    updated_job: JobAppBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(models.JobApplication).filter(
        models.JobApplication.id == job_id,
        models.JobApplication.owner_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Update each field manually
    job.company = updated_job.company
    job.job_title = updated_job.job_title
    job.status = updated_job.status
    job.notes = updated_job.notes
    job.application_date = updated_job.application_date

    db.commit()
    db.refresh(job)
    return job


# 🗑️ DELETE: Remove a job
@app.delete("/applications/{job_id}")
def delete_application(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(models.JobApplication).filter(
        models.JobApplication.id == job_id,
        models.JobApplication.owner_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
    return {"detail": "Job deleted"}
