# Job Tracker App

A full-stack job application tracking system built with **React**, **FastAPI**, and **PostgreSQL**.

## ✨ Features

- 🔐 JWT Authentication (Login/Signup)
- 📄 Add, edit, delete, and view job applications
- 📊 Filter and search by status and date
- 🔒 User-specific protected routes and data access
- 📱 Responsive UI using Bootstrap

## 🛠 Tech Stack

- **Frontend**: React, Axios, Bootstrap
- **Backend**: FastAPI, SQLAlchemy, JWT (python-jose)
- **Database**: PostgreSQL
- **Deployment**: Render (Backend), Vercel or Netlify (Frontend)

## 🚀 Setup Instructions

### Backend

```bash
cd backend
python -m venv env
source env/bin/activate  # or `env\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Make sure to configure your `.env` file with:
```
DATABASE_URL=your_postgresql_url
SECRET_KEY=your_secret_key
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## 📝 License

This project is licensed under the MIT License.

---

Built with ❤️ by Naga Mamata Iluru