# ChatApp - Aplikasi Chat React Native dengan Firebase

Aplikasi chat real-time sederhana yang dibuat dengan React Native dan Firebase. Aplikasi ini memungkinkan pengguna untuk chat secara anonim menggunakan Firebase Authentication dan Firestore untuk pesan real-time.

## Fitur

- Otentikasi pengguna anonim
- Chat real-time dengan Firestore
- Cross-platform (fokus Android)
- Dibuat dengan React Native dan TypeScript

## Prasyarat

- Node.js (versi 20 atau lebih tinggi)
- Android Studio dengan Android SDK
- Emulator Android atau perangkat Android fisik
- Proyek Firebase dengan Firestore diaktifkan

## Instalasi

1. Clone repository:
   ```sh
   git clone https://github.com/Tesion1121/firebase.git
   cd firebase
   ```

2. Install dependensi:
   ```sh
   npm install
   ```

3. Setup Firebase:
   - Buat proyek Firebase di [Firebase Console](https://console.firebase.google.com/)
   - Aktifkan Firestore Database
   - Aktifkan Otentikasi Anonim
   - Download `google-services.json` dan letakkan di `android/app/`
   - Update `firebase.ts` dengan konfigurasi Firebase Anda

## Menjalankan Aplikasi

1. Jalankan Metro bundler:
   ```sh
   npm start
   ```

2. Di terminal baru, jalankan di emulator Android:
   ```sh
   npm run android
   ```

Aplikasi akan secara otomatis masuk secara anonim dan navigasi ke layar chat.

## Struktur Proyek

- `App.tsx` - Komponen aplikasi utama dengan navigasi
- `firebase.ts` - Konfigurasi Firebase dan ekspor
- `screens/LoginScreen.tsx` - Layar login (saat ini dilewati dengan otentikasi anonim)
- `screens/ChatScreen.tsx` - Antarmuka chat utama
- `android/` - Konfigurasi spesifik Android

## Pemecahan Masalah

- Pastikan emulator Android berjalan sebelum `npm run android`
- Periksa bahwa `google-services.json` ditempatkan dengan benar
- Verifikasi aturan Firebase mengizinkan akses anonim dan baca/tulis Firestore

## Pelajari Lebih Lanjut

- [Dokumentasi React Native](https://reactnative.dev/docs/getting-started)
- [Dokumentasi Firebase](https://firebase.google.com/docs)
