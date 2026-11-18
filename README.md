# 🏗️ MŞ Group İnşaat & Mimarlık — Kurumsal Web Sitesi ve Yönetim Paneli

**MŞ Group İnşaat & Mimarlık** için geliştirilmiş, modern mimari tasarıma sahip **Full-Stack (React + Node.js/Express + MySQL / Yerel JSON Veritabanı)** kurumsal web sitesi, proje portföyü, saha medya arşivi (148 fotoğraf & 14 şantiye videosu) ve kapsamlı yönetim paneli uygulaması.

---

## ✨ Öne Çıkan Özellikler

### 🌐 Kurumsal Ön Yüz (Frontend)
- **Ana Sayfa (`/`)**:
  - Canlı şantiye videosu ve fotoğraf vitrini içeren **Hero** alanı
  - Kurumsal **Hakkımızda** özeti ve kalite standartları şeridi
  - **Hizmetlerimiz** kartları ve animasyonlu sayaçlarla kurumsal istatistikler
  - Kategori bazlı filtrelenebilir **Seçkin Projelerimiz** vitrini
  - **Saha Videolarımız ve Fotoğraf Galerimiz** bölümü (oynatılabilir şantiye videoları + Lightbox fotoğraf galerisi)
  - Hızlı **İletişim & Ücretsiz Keşif** formu ve sabit WhatsApp iletişim butonu
- **Projelerimiz (`/projeler`)**:
  - Kategoriye (`Konut İnşaatı`, `Ticari İnşaat`, `Altyapı`, `Çevre Düzenlemesi` vb.), proje durumuna (`Tamamlandı`, `Devam Ediyor`, `Planlama`) ve anahtar kelimeye göre anlık filtreleme
- **Proje Detay (`/projeler/:slug`)**:
  - Proje künyesi (konum, inşaat alanı m², yıl, durum, kategori)
  - Büyük vitrin görseli, küçük resim (thumbnail) seçici ve tam ekran **Lightbox** fotoğraf galerisi
  - Projeye ait **Şantiye & Uygulama Videoları** oynatıcısı
  - Hızlı teklif/bilgi alma kartı ve benzer projeler önerisi
- **Hizmetlerimiz (`/hizmetler`)**:
  - 7 ana faaliyet alanı, kapsam maddeleri ve 4 adımlı proje çalışma süreci (`Keşif & Planlama` → `Mimari Tasarım` → `İnşaat & Uygulama` → `Anahtar Teslim`)
- **Hakkımızda (`/hakkimizda`)**:
  - Kurumsal tarihçe, **Misyon & Vizyon**, temel değerler ve **Neden Şah Group?** bölümü
- **Galeri & Saha Arşivi (`/galeri`)**:
  - **Tümü (162)**, **Videolar (14)** ve **Fotoğraflar (148)** filtre sekmeleri
  - Tüm saha videolarını tarayıcıda doğrudan oynatma ve fotoğrafları tam ekran Lightbox ile inceleme
- **İletişim (`/iletisim`)**:
  - Konu seçmeli detaylı iletişim/keşif formu, telefon/e-posta/adres/çalışma saatleri kartları, WhatsApp hızlı erişim ve Google Maps harita entegrasyonu

---

### 🔐 Yönetim Paneli (`/admin`)
- **Güvenli Giriş (`/admin/login`)**: JWT tabanlı kimlik doğrulama ve tek tıkla varsayılan bilgileri doldurma kolaylığı
- **Dashboard (`/admin`)**: Toplam proje, medya dosyası (162), toplam mesaj ve okunmamış mesaj sayaçları + son gelen mesajlar listesi
- **Proje Yönetimi (`/admin/projeler`)**:
  - Yeni proje oluşturma, mevcut projeleri düzenleme ve silme
  - Proje düzenleme ekranından doğrudan projeye fotoğraf/video yükleme ve kapak fotoğrafı belirleme
- **Hizmet Yönetimi (`/admin/hizmetler`)**:
  - Hizmet ekleme, düzenleme, sıralama, ikon seçimi ve aktif/pasif durumu değiştirme
- **Medya Yönetimi (`/admin/medya`)**:
  - Sürükle-bırak (Drag & Drop) ile çoklu fotoğraf ve video yükleme
  - `Sharp` kütüphanesi ile yüklenen fotoğrafları otomatik WebP formatına dönüştürme ve küçük resim (thumbnail) oluşturma
  - Medyaları projelere atama, proje kapak görseli seçme ve toplu silme
- **Mesaj Yönetimi (`/admin/mesajlar`)**:
  - İletişim formundan gelen mesajları okuma, okundu/okunmadı filtreleme, tek tıkla **WhatsApp** veya **E-posta** üzerinden yanıtlama ve silme
- **Site Ayarları (`/admin/ayarlar`)**:
  - Şirket bilgileri, telefon, e-posta, adres, sosyal medya bağlantıları, Google Maps embed kodu, SEO ayarları ve yönetici şifresi değiştirme

---

## 🛠️ Teknoloji Yığını

| Katman | Teknolojiler |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router v7, Axios, Lucide React, React Hot Toast, Özel Tasarım CSS |
| **Backend** | Node.js, Express 5, Multer (Dosya Yükleme), Sharp (Görsel İşleme & Şeffaf Logo Üretimi), JWT, Bcryptjs |
| **Veritabanı** | MySQL (`mysql2/promise`) + **Otomatik Yerel JSON Veritabanı Yedeği** (`backend/database/local_db.json`) |

---

## 📂 Proje Klasör Yapısı

```text
mutahit-web-sitesi/
├── backend/
│   ├── config/
│   │   ├── database.js        # MySQL bağlantı havuzu + otomatik yerel veritabanı yönlendiricisi
│   │   ├── initDb.js          # Tablo kurulumu, medya senkronizasyonu ve logo işleme başlatıcısı
│   │   ├── localStore.js      # MySQL olmadığında devreye giren yerel JSON veritabanı motoru
│   │   ├── processLogo.js     # Şeffaf arka planlı logo.png ve logo-icon.png üretici
│   │   └── syncMedia.js       # 148 saha fotoğrafı ve 14 şantiye videosunu otomatik içe aktarıcı
│   ├── database/
│   │   ├── schema.sql         # MySQL veritabanı şeması ve başlangıç verileri
│   │   └── local_db.json      # Otomatik oluşturulan yerel veritabanı dosyası
│   ├── middleware/
│   │   ├── auth.js            # JWT doğrulama middleware'i
│   │   └── upload.js          # Multer fotoğraf/video yükleme yapılandırması
│   ├── routes/                # Express API uç noktaları (auth, projects, services, media, contact, settings, stats, categories)
│   ├── uploads/               # Yüklenen ve senkronize edilen fotoğraf ve videolar
│   └── server.js              # Express uygulama giriş noktası (Port 5000)
│
├── frontend/
│   ├── public/
│   │   ├── logo.png           # Şeffaf arka planlı tam Şah Group İnşaat logosu
│   │   ├── logo-icon.png      # Şeffaf arka planlı amblem / favicon
│   │   └── uploads/           # Saha fotoğrafları (148 adet) ve videoları (14 adet)
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProtectedRoute
│   │   ├── contexts/          # AuthContext (Yönetici oturum yönetimi)
│   │   ├── lib/               # Axios API istemcisi (api.js)
│   │   ├── pages/             # Ana Sayfa, Projeler, Proje Detay, Hizmetler, Hakkımızda, Galeri, İletişim
│   │   │   └── admin/         # AdminLogin, AdminLayout, Dashboard, Projects, Services, Media, Messages, Settings
│   │   ├── App.jsx            # Sayfa yönlendirmeleri (Router)
│   │   └── index.css          # Kurumsal tasarım sistemi ve responsive stiller
│   └── vite.config.js         # Vite yapılandırması
├── medya/                     # Tüm orijinal saha fotoğrafları (148 adet) ve videoları (14 adet)
└── README.md
```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- **Node.js** (v18 veya üzeri)
- **MySQL** *(İsteğe bağlı: MySQL kurulu değilse veya şifre girilmemişse sistem otomatik olarak `backend/database/local_db.json` yerel veritabanını kullanır ve hiçbir ek kurulum gerektirmeden çalışır.)*

### 1. Backend Sunucusunu Başlatma
```bash
cd backend
npm install
npm run dev
```
- Backend sunucusu varsayılan olarak **`http://localhost:5000`** adresinde çalışır.
- İlk başlatmada:
  1. Klasördeki **148 fotoğraf** ve **14 video** otomatik olarak `uploads/` dizinine ve veritabanına aktarılır.
  2. Şeffaf arka planlı kurumsal logo (`logo.png` ve `logo-icon.png`) oluşturulur.
  3. MySQL bağlantısı varsa tablolar oluşturulur; yoksa yerel JSON veritabanı devreye girer.

### 2. Frontend Uygulamasını Başlatma
Yeni bir terminal açarak:
```bash
cd frontend
npm install
npm run dev
```
- Web sitesi **`http://localhost:5173`** adresinde çalışmaya başlayacaktır.

---

## 🔑 Yönetim Paneli Giriş Bilgileri

| Bilgi | Değer |
| :--- | :--- |
| **Yönetim Paneli Adresi** | `http://localhost:5173/admin/login` |
| **Kullanıcı Adı** | `admin` *(veya `admin@shahgroup.com`)* |
| **Şifre** | `Admin123!` |

> **İpucu:** Giriş ekranındaki **"Otomatik Doldur"** butonuna tıklayarak kullanıcı adı ve şifreyi tek tıkla doldurabilirsiniz.

---

## ⚙️ Ortam Değişkenleri (`backend/.env`)

`backend/.env` dosyası üzerinden sunucu ve veritabanı ayarlarını özelleştirebilirsiniz:

```env
PORT=5000
NODE_ENV=development

# MySQL Veritabanı Ayarları (Boş bırakılırsa otomatik local_db.json kullanılır)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=shahgroup_db

# JWT Güvenlik Anahtarı
JWT_SECRET=shahgroup_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d

# Frontend Adresi
FRONTEND_URL=http://localhost:5173
```

---

## 📡 Temel API Uç Noktaları (Endpoints)

| Metot | Endpoint | Açıklama | Yetki |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Yönetici girişi ve JWT token alma | Açık |
| `GET` | `/api/auth/me` | Aktif yönetici bilgilerini getirme | Admin |
| `PUT` | `/api/auth/change-password` | Yönetici şifresini güncelleme | Admin |
| `GET` | `/api/projects` | Projeleri listeleme (kategori, durum, öne çıkan filtreli) | Açık |
| `GET` | `/api/projects/:slug` | Tekil proje detayı ve medya galerisi | Açık |
| `POST` | `/api/projects` | Yeni proje ekleme | Admin |
| `PUT` | `/api/projects/:id` | Proje bilgilerini güncelleme | Admin |
| `DELETE` | `/api/projects/:id` | Projeyi silme | Admin |
| `GET` | `/api/services` | Hizmetleri listeleme | Açık |
| `POST` | `/api/services` | Yeni hizmet ekleme | Admin |
| `PUT` | `/api/services/:id` | Hizmet güncelleme | Admin |
| `DELETE` | `/api/services/:id` | Hizmet silme | Admin |
| `GET` | `/api/media` | Fotoğraf ve videoları listeleme | Açık |
| `POST` | `/api/media/upload` | Çoklu fotoğraf/video yükleme | Admin |
| `PUT` | `/api/media/:id/cover` | Medyayı proje kapak fotoğrafı yapma | Admin |
| `PUT` | `/api/media/:id/assign` | Medyayı bir projeye atama | Admin |
| `DELETE` | `/api/media/:id` | Medya dosyasını silme | Admin |
| `POST` | `/api/contact` | İletişim / keşif formu mesajı gönderme | Açık |
| `GET` | `/api/contact` | Gelen mesajları listeleme | Admin |
| `GET` | `/api/settings` | Site ayarlarını getirme | Açık |
| `PUT` | `/api/settings` | Site ayarlarını güncelleme | Admin |

---

## 📄 Lisans
Bu proje **Şah Group İnşaat & Mimarlık** kurumsal kullanımı için hazırlanmıştır. Tüm hakları saklıdır.
