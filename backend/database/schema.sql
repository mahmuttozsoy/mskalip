-- MŞ Group İnşaat Mimarlık - Veritabanı Şeması (mskalip)
CREATE DATABASE IF NOT EXISTS mskalip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mskalip;

-- Admin kullanıcıları tablosu
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(200),
  role ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projeler tablosu
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  short_description VARCHAR(500),
  location VARCHAR(255),
  area DECIMAL(10, 2),
  year INT,
  status ENUM('tamamlandi', 'devam_ediyor', 'planlama') DEFAULT 'tamamlandi',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Medya dosyaları tablosu
CREATE TABLE IF NOT EXISTS media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  thumbnail_path VARCHAR(500),
  file_type ENUM('image', 'video') DEFAULT 'image',
  mime_type VARCHAR(100),
  file_size BIGINT,
  width INT,
  height INT,
  alt_text VARCHAR(255),
  is_cover BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Hizmetler tablosu
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  short_description VARCHAR(500),
  icon VARCHAR(100),
  image_path VARCHAR(500),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- İletişim mesajları tablosu
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_replied BOOLEAN DEFAULT FALSE,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site ayarları tablosu
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type ENUM('text', 'textarea', 'image', 'json', 'boolean') DEFAULT 'text',
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Slider/Banner tablosu
CREATE TABLE IF NOT EXISTS sliders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  subtitle VARCHAR(500),
  image_path VARCHAR(500) NOT NULL,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referanslar tablosu
CREATE TABLE IF NOT EXISTS references_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_path VARCHAR(500),
  website VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İstatistikler tablosu
CREATE TABLE IF NOT EXISTS stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Varsayılan yönetici kaydı
INSERT INTO admins (username, email, password, full_name, role) VALUES 
('admin', 'admin@msgroup.com', '$2b$10$0Gi15XV0tO/srGEGB/J0EOM3RKXCdLJA6QhKs7Ziec.kLBz4Ttxbu', 'Sistem Yöneticisi', 'super_admin')
ON DUPLICATE KEY UPDATE id=id;

-- Varsayılan kategoriler
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES 
('Konut İnşaatı', 'konut-insaati', 'Apartman, Villa ve Müstakil Ev Projeleri', 'home', 1),
('Ticari İnşaat', 'ticari-insaat', 'Ofis, AVM ve İş Merkezi Projeleri', 'building', 2),
('Mimarlık ve Tasarım', 'mimarlik-tasarim', 'Mimari Proje ve Tasarım Hizmetleri', 'drafting-compass', 3),
('Restorasyon', 'restorasyon', 'Restorasyon ve Yenileme Projeleri', 'tools', 4),
('İç Mimari', 'ic-mimari', 'İç Mekan Tasarım ve Dekorasyon', 'couch', 5),
('Altyapı', 'altyapi', 'Altyapı ve Zemin Etüdü Projeleri', 'layer-group', 6),
('Çevre Düzenlemesi', 'cevre-duzenlemesi', 'Yol ve Çevre Düzenleme Projeleri', 'tree', 7)
ON DUPLICATE KEY UPDATE id=id;

-- Varsayılan hizmetler
INSERT INTO services (title, slug, description, short_description, icon, sort_order) VALUES 
('Konut İnşaatı', 'konut-insaati', 'Apartman, villa ve müstakil ev projelerinde yüksek kaliteli inşaat hizmetleri sunuyoruz. Modern mimari anlayışı ile hayalinizdeki evi inşa ediyoruz.', 'Hayalinizdeki evi inşa ediyoruz', 'home', 1),
('Ticari İnşaat', 'ticari-insaat', 'Ofis binaları, alışveriş merkezleri ve iş merkezi projelerinde profesyonel inşaat çözümleri.', 'Profesyonel ticari yapılar', 'building-2', 2),
('Mimarlık ve Proje Tasarımı', 'mimarlik-proje-tasarimi', 'Deneyimli mimar kadromuzla özgün ve fonksiyonel mimari projeler tasarlıyoruz.', 'Özgün mimari çözümler', 'pencil-ruler', 3),
('Restorasyon ve Yenileme', 'restorasyon-yenileme', 'Tarihi ve mevcut yapıların restorasyon ve yenileme projelerinde uzman hizmet.', 'Yapılarınıza yeni bir nefes', 'hammer', 4),
('İç Mimari ve Dekorasyon', 'ic-mimari-dekorasyon', 'İç mekan tasarımı ve dekorasyon hizmetleriyle yaşam alanlarınızı dönüştürüyoruz.', 'Estetik yaşam alanları', 'sofa', 5),
('Altyapı ve Zemin Etüdü', 'altyapi-zemin-etudu', 'Zemin etüdü, temel tasarımı ve altyapı çalışmalarında güvenilir çözümler.', 'Sağlam temeller üzerine', 'layers', 6),
('Yol ve Çevre Düzenleme', 'yol-cevre-duzenleme', 'Çevre düzenlemesi, peyzaj ve yol yapım projelerinde kaliteli hizmet.', 'Güzel çevreler yaratıyoruz', 'trees', 7)
ON DUPLICATE KEY UPDATE id=id;

-- Varsayılan site ayarları
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES 
('site_title', 'MŞ Group İnşaat Mimarlık', 'text', 'Site başlığı'),
('site_description', 'Kalite ve güvenilirliğin adresi - İnşaat ve Mimarlık çözümleri', 'textarea', 'Site açıklaması'),
('company_name', 'MŞ Group İnşaat Mimarlık', 'text', 'Şirket adı'),
('company_phone', '+90 536 869 62 51', 'text', 'Şirket telefon numarası'),
('company_email', 'info@msgroup.com', 'text', 'Şirket e-posta'),
('company_address', 'İstanbul, Türkiye', 'text', 'Şirket adresi'),
('company_founded', '2010', 'text', 'Kuruluş yılı'),
('projects_count', '500+', 'text', 'Tamamlanan proje sayısı'),
('experience_years', '15+', 'text', 'Deneyim yılı'),
('team_size', '100+', 'text', 'Çalışan sayısı'),
('facebook_url', '', 'text', 'Facebook URL'),
('instagram_url', '', 'text', 'Instagram URL'),
('whatsapp_number', '+90 536 869 62 51', 'text', 'WhatsApp numarası'),
('google_maps_embed', '', 'textarea', 'Google Maps embed kodu')
ON DUPLICATE KEY UPDATE id=id;

-- Varsayılan istatistikler
INSERT INTO stats (id, title, value, icon, sort_order) VALUES 
(1, 'Tamamlanan Proje', '500+', 'check-circle', 1),
(2, 'Yıllık Deneyim', '15+', 'calendar', 2),
(3, 'Mutlu Müşteri', '1000+', 'smile', 3),
(4, 'Uzman Ekip', '100+', 'users', 4)
ON DUPLICATE KEY UPDATE id=id;

-- Varsayılan projeler
INSERT INTO projects (id, category_id, title, slug, description, short_description, location, area, year, status, is_featured, sort_order, is_active) VALUES
(1, 1, 'Toplu Konut & Betonarme Yapı Kompleksi', 'toplu-konut-betonarme-yapi-kompleksi', 'Deprem yönetmeliğine tam uyumlu, yüksek dayanımlı betonarme taşıyıcı sistem ve modern kalıp teknolojileriyle inşa edilen çok bloklu konut ve yaşam projemiz. Saha dökümleri, perde beton imalatları ve üst yapı uygulamaları uzman mühendis kadromuz kontrolünde tamamlanmıştır.', 'Depreme dayanıklı betonarme taşıyıcı sistemli çok bloklu toplu konut projesi.', 'Türkiye', 18500, 2025, 'tamamlandi', 1, 1, 1),
(2, 6, 'Yüksek İstinat Duvarı & Perde Beton Projesi', 'yuksek-istinat-duvari-perde-beton-projesi', 'Yüksek kot farklarına sahip arazilerde zemin güvenliğini sağlamak amacıyla projelendirilen ağır hizmet tipi betonarme istinat duvarı ve perde beton imalatları. Çelik yüzeyli endüstriyel kalıp sistemleri ile pürüzsüz brüt beton yüzey kalitesi elde edilmiştir.', 'Endüstriyel kalıp sistemleriyle yüksek dayanımlı brüt beton istinat ve perde duvar uygulaması.', 'Türkiye', 9200, 2025, 'tamamlandi', 1, 2, 1),
(3, 6, 'Ağır Demir Donatı & Radye Temel Uygulaması', 'agir-demir-donati-radye-temel-uygulamasi', 'Büyük ölçekli üstyapı ve mühendislik yapıları için yüksek yoğunluklu nervürlü çelik donatı işçiliği, temel kirişleri ve radye temel beton döküm çalışmaları. Statik projeye birebir uygunluk ve maksimum mukavemet standartlarında uygulanmıştır.', 'Yüksek yoğunluklu çelik donatı ve radye temel mühendislik uygulaması.', 'Türkiye', 14000, 2025, 'tamamlandi', 1, 3, 1),
(4, 2, 'Endüstriyel Tesis & Fabrika Temel İnşaatı', 'endustriyel-tesis-fabrika-temel-insaati', 'Ağır makine yüklerine ve endüstriyel operasyonlara dayanıklı fabrika içi makine temelleri, derin temel çukuru donatı imalatları ve yüksek mukavemetli endüstriyel saha betonu uygulamaları.', 'Ağır yük taşıma kapasiteli endüstriyel tesis ve makine temeli inşaatı.', 'Türkiye', 11500, 2025, 'devam_ediyor', 1, 4, 1),
(5, 7, 'Altyapı Galerisi & Tünel Kalıp Sistemi', 'altyapi-galerisi-tunel-kalip-sistemi', 'Uzun metrajlı altyapı hatları, betonarme galeri kanalları ve çevre düzenleme kapsamında gerçekleştirilen kazı, grobeton, demir donatı ve modüler kalıp imalatları.', 'Uzun metrajlı betonarme altyapı galerisi, kanal ve saha mühendisliği projesi.', 'Türkiye', 16800, 2025, 'devam_ediyor', 1, 5, 1),
(6, 1, 'Anahtar Teslim Betonarme & Saha Uygulamaları', 'anahtar-teslim-betonarme-saha-uygulamalari', 'Vinç destekli ağır kalıp montajı, gece ve gündüz kesintisiz pompa beton dökümleri, kolon-perde imalatları ve anahtar teslim şantiye yönetimi çalışmalarımız.', 'Vinç destekli modüler kalıp montajı ve anahtar teslim betonarme saha uygulamaları.', 'Türkiye', 12400, 2024, 'tamamlandi', 1, 6, 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);
