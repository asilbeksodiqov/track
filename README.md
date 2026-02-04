# Hisobot Tizimi Backend

## 🚀 Bepul Hosting Xizmatlari

### 1. **Render.com** (Tavsiya qilinadi)
- ✅ Bepul tier mavjud
- ✅ Avtomatik deploy (GitHub bilan)
- ✅ SQLite database ishlaydi
- ⚠️ 15 daqiqa faollik yo'qligidan keyin uxlaydi

**Deploy qilish:**
1. [render.com](https://render.com) ga ro'yxatdan o'ting
2. GitHub repo yarating va barcha fayllarni yuklang
3. Render da "New" → "Web Service"
4. GitHub repo ni ulang
5. Sozlamalar:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: Free
6. "Create Web Service"

**URL:** `https://sizning-app.onrender.com`

---

### 2. **Railway.app**
- ✅ Bepul $5/oy kredit
- ✅ Juda tez deploy
- ✅ Avtomatik HTTPS

**Deploy qilish:**
1. [railway.app](https://railway.app) ga ro'yxatdan o'ting
2. "New Project" → "Deploy from GitHub repo"
3. Repo ni tanlang
4. Railway avtomatik aniqlaydi va deploy qiladi

**URL:** `https://sizning-app.up.railway.app`

---

### 3. **Fly.io**
- ✅ Bepul tier
- ✅ Global CDN

**Deploy qilish:**
1. [fly.io](https://fly.io) ga ro'yxatdan o'ting
2. flyctl CLI o'rnating
3. `flyctl launch` buyrug'i
4. `flyctl deploy`

---

### 4. **PythonAnywhere** (Eng oddiy)
- ✅ 100% bepul (cheklangan)
- ✅ Web interface orqali
- ⚠️ Har 3 oyda bir marta reload kerak

**Deploy qilish:**
1. [pythonanywhere.com](https://www.pythonanywhere.com) ga ro'yxatdan o'ting
2. "Files" → fayllarni yuklang
3. "Web" → "Add a new web app"
4. Flask ni tanlang
5. WSGI file ni sozlang

---

## 📁 Fayllar

- `app.py` - Flask backend
- `requirements.txt` - Python kutubxonalari
- `Procfile` - Render uchun
- `railway.json` - Railway uchun
- `hisobot.db` - SQLite database (avtomatik yaratiladi)

---

## 🔧 Lokal test qilish

```bash
# Virtual environment yaratish
python -m venv venv

# Aktivlashtirish (Windows)
venv\Scripts\activate

# Aktivlashtirish (Mac/Linux)
source venv/bin/activate

# Dependencies o'rnatish
pip install -r requirements.txt

# Serverni ishga tushirish
python app.py
```

Server: `http://localhost:5000`

---

## 🌐 API Endpoints

### 1. Ma'lumot qo'shish
```
POST /api/add-entry
Body: {
  "foydalanuvchi": "user01",
  "sana": "1 Fevral 2026",
  "muddat": "ertalab",
  "raqam": "1234"
}
```

### 2. Admin login
```
POST /api/admin-login
Body: {
  "password": "admin123"
}
```

### 3. Ma'lumotlarni olish
```
POST /api/get-entries
Body: {
  "start_date": "1 Fevral 2026",
  "end_date": "5 Fevral 2026",
  "users": ["user01", "user02"]
}
```

### 4. Excel yuklab olish
```
POST /api/download-excel
Body: {
  "start_date": "1 Fevral 2026",
  "end_date": "5 Fevral 2026",
  "users": ["user01"]
}
```

---

## ⚙️ Environment Variables

Backend URL ni frontend da o'zgartiring:
```javascript
const BACKEND_URL = 'https://sizning-app.onrender.com';
```

---

## 🔒 Xavfsizlik

- Admin paroli: `app.py` da `ADMIN_PASSWORD` ni o'zgartiring
- Production da environment variable ishlatish tavsiya qilinadi

---

## 📊 Database struktura

```sql
CREATE TABLE entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    foydalanuvchi TEXT NOT NULL,
    sana TEXT NOT NULL,
    ertalab TEXT,
    kechqurun TEXT,
    yuborilgan_vaqti TEXT NOT NULL,
    farq TEXT
);
```

---

## ❓ Muammolar

1. **CORS xatosi:** `flask-cors` o'rnatilganligini tekshiring
2. **Database yo'q:** Server birinchi marta ishga tushganda avtomatik yaratiladi
3. **Hosting uxlaydi:** Bepul tier da 15 daqiqa aktivlik yo'q bo'lsa uxlaydi

---

## 📞 Qo'llab-quvvatlash

Muammo bo'lsa, GitHub Issues da xabar bering.