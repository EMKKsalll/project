# Lofi Focus Space

Node.js ve Express tabanlı, "Glassmorphism" tasarım diline sahip dinamik bir çalışma ortamı uygulaması.

## Özellikler

- **Kullanıcı Girişi**: Şifreli (Bcrypt) kayıt ve giriş sistemi.
- **Dinamik Ortamlar**: Sahneler (Video + Ses + Tema Rengi) arasında geçiş yapabilme.
- **Cam Tasarım**: Lofi estetiğine uygun modern arayüz.
- **Araçlar**: Pomodoro Sayacı, To-Do Listesi, Ses Kontrolü.
- **Admin Paneli**: Yeni video ve ses dosyası yükleme.
- **Backend**: JSON tabanlı veritabanı (users.json, scenes.json).

## Kurulum ve Çalıştırma

1. Gerekli paketleri yükleyin:
   ```bash
   npm install 
   ```

2. Sunucuyu başlatın:
   ```bash
   npm start
   # veya
   node server.js
   ```

3. Tarayıcıda açın:
   `http://localhost:3000`

## Varsayılan Kullanıcılar

İlk kayıt olan kullanıcı otomatik olarak **Admin** yetkisine sahip olur.

## Klasör Yapısı

- `server.js`: Backend kodları (API, Auth, Static Files).
- `data/`: JSON veri dosyaları.
- `public/`: Frontend dosyaları (HTML, CSS, JS).
- `public/assets/`: Yüklenen medya dosyaları.
