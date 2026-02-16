# Ethos XP Bank — Deploy Rehberi

## ADIM 1: Privy App ID Al

1. https://dashboard.privy.io adresine git
2. Hesap oluştur veya giriş yap
3. "Create App" ile yeni uygulama oluştur (isim: "Ethos XP Bank")
4. Sol menüden **Global Settings → Integrations** bölümüne git
5. **Ethos Network** bul ve **Enable** et
6. Ana sayfadaki **App ID**'yi kopyala (clxxxxxxxxxxxxxxx gibi)

## ADIM 2: GitHub Repo Oluştur

1. https://github.com/new adresine git
2. Repository name: `ethos-xp-bank`
3. Public seç
4. "Create repository" tıkla
5. Bilgisayarında terminal aç:

```bash
# Bu projenin dosyalarını indirdiğin klasöre git
cd ethos-xp-bank

# Git başlat
git init
git add .
git commit -m "Initial commit - Ethos XP Bank"

# GitHub repo'nu bağla (kendi username'ini yaz)
git remote add origin https://github.com/SENIN-USERNAME/ethos-xp-bank.git
git branch -M main
git push -u origin main
```

## ADIM 3: Netlify'a Bağla

1. https://app.netlify.com adresine git
2. "Add new site" → "Import an existing project"
3. "GitHub" seç ve authorize et
4. `ethos-xp-bank` repo'sunu seç
5. Build settings otomatik gelecek (netlify.toml sayesinde):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **"Show advanced"** tıkla → **"New variable"**:
   - Key: `VITE_PRIVY_APP_ID`
   - Value: Adım 1'de kopyaladığın App ID
7. **"Deploy site"** tıkla

## ADIM 4: Domain Ayarı

1. Deploy tamamlandıktan sonra Netlify sana bir URL verecek
   (mesela: `random-name-123.netlify.app`)
2. İstersen "Site configuration" → "Change site name" ile değiştirebilirsin
   (mesela: `ethos-xp-bank.netlify.app`)

## SORUN GİDERME

### Build hatası alıyorsan:
- Netlify Dashboard → Deploys → son deploy'a tıkla → logları oku
- En yaygın sorun: VITE_PRIVY_APP_ID environment variable eksik

### "No Ethos profile linked" hatası:
- Privy Dashboard'da Ethos Network integration'ın enabled olduğundan emin ol

### Boş sayfa:
- Tarayıcı Console'u aç (F12) ve hataları kontrol et
- Privy App ID'nin doğru olduğunu kontrol et
