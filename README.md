# ERP System

## Description
Full-stack ERP System built with **Django** (backend) and **React** (frontend) using **PostgreSQL**.  
Supports **user & role management, CRUD operations, and a responsive dashboard** for Admin, Manager, and Employee.

---

## Tools / Tech Stack
- Backend: Django, Python  
- Frontend: React, JavaScript  
- Database: PostgreSQL  
- Version Control: Git / GitHub  

---

## Users / Roles
- **Admin**: Full access to all modules and user management  
- **Manager**: Manage employees, view dashboards, approve requests  
- **Employee**: View personal data, update profile, interact with assigned modules  

---

## Prerequisites
- Python 3.10+  
- Node.js 16+  
- PostgreSQL 12+  

---

## Guidance to Clone and Use

```bash
# 1. Clone the repository
git clone https://github.com/ajaydevz/erp-system.git
cd erp-system

# 2. Setup Backend (Django)
cd backend
python -m venv env

# Activate virtual environment
# Windows
env\Scripts\activate
# Linux / Mac
source env/bin/activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
# Backend runs at: http://127.0.0.1:8000/


# 3. Setup Frontend (React)
cd ../client
npm install

npm start
# Frontend runs at: http://localhost:3000/
