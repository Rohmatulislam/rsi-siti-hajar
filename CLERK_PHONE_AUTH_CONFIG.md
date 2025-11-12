# Konfigurasi Clerk untuk Login dengan Nomor Telepon

## Pengaturan Dashboard Clerk

Untuk memastikan bahwa login dan registrasi mendukung nomor telepon sebagai metode utama, Anda perlu mengkonfigurasi pengaturan berikut di dashboard Clerk:

### 1. Sign-In Settings
- Buka dashboard Clerk Anda
- Pergi ke **User Management** → **Sign-up & Sign-in**
- Di bagian **Additional settings** → **Sign-in**:
  - Aktifkan **Phone number** sebagai salah satu metode sign-in
  - Atur **Preferred sign-in strategy** ke **Phone number** jika Anda ingin menjadikannya default

### 2. Sign-Up Settings
- Di bagian **Additional settings** → **Sign-up**:
  - Pastikan **Phone number** disertakan sebagai field yang diperlukan
  - Aktifkan **Phone number** sebagai salah satu metode sign-up

### 3. Verification Settings
- Di **User Management** → **Verification** → **SMS**:
  - Atur service SMS untuk pengiriman OTP
  - Di banyak kasus, menggunakan platform seperti Twilio atau service SMS lainnya
  - Kode verifikasi akan dikirim ke nomor telepon yang dimasukkan

### 4. Appearance Configuration (Opsional)
- Jika Anda ingin mengatur penampilan tampilan default, Anda bisa melakukannya di **Appearance** → **Customize**
- Atau tetap gunakan pengaturan dalam komponen SignIn/SignUp di file Anda

### 5. Redirect Behavior
- Anda telah mengatur `afterSignInUrl` dan `afterSignUpUrl` ke `/dashboard`
- Pastikan bahwa `/dashboard` adalah halaman yang valid dalam aplikasi Anda
- Jika halaman dashboard belum ada, Anda bisa mengubahnya ke halaman lain seperti `/` atau `/profile`

### 6. Phone Number Preferences
- Untuk memastikan bahwa pengguna diminta untuk login melalui nomor telepon secara default:
  - Di bagian Sign-in Settings, pastikan urutan field disusun agar phone number muncul pertama
  - Dalam komponen, Clerk akan mengikuti konfigurasi dashboard untuk menentukan urutan dan preferensi otentikasi

## Konfigurasi Environment Variables

Pastikan variabel lingkungan berikut telah diatur di aplikasi Anda:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Tautan Berguna
- [Documentation Clerk](https://clerk.com/docs)
- [Sign-in Component Documentation](https://clerk.com/docs/components/elements/sign-in)
- [Sign-up Component Documentation](https://clerk.com/docs/components/elements/sign-up)
- [SMS Configuration Guide](https://clerk.com/docs/authentication/sms-integration)

## Catatan Tambahan
- Jika aplikasi Anda memerlukan konfigurasi tambahan seperti domain restriction atau custom SMS provider, lakukan pengaturan tersebut di dashboard Clerk
- Untuk debugging masalah otentikasi, Anda bisa mengecek logs di dashboard Clerk
- Selalu pastikan bahwa pengaturan production di Clerk sesuai dengan environment production aplikasi Anda