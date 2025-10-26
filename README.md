# Taste Atlas - UTS Studi Kasus Recipes

**Nama:** Muhammad Yusuf  
**NIM:** 122140193  
**Deployment:** [Lihat disini](https://uts-pemweb-122140193.vercel.app/)

---

## Gambaran Proyek

Aplikasi React ini menerapkan studi kasus resep berbasis API TheMealDB. Seluruh halaman, komponen, dan state management sudah disesuaikan dengan rubrik UTS Pemrograman Web sehingga poin CPMK0501 dan CPMK0502 dapat terpenuhi. [API LINK](https://www.themealdb.com/api.php)

---

## Fitur Utama

### **Beranda** (`src/pages/home.jsx`)

- Paginated catalog dengan filter kategori, pencarian, dan skeleton loading
- Komponen `recipe-card` menampilkan detail resep lengkap, tombol favorit, dan queue planner

### **Favorit** (`src/pages/favorites.jsx`)

- Menyimpan resep favorit di `localStorage` melalui `use-favorite-meals`
- Pencarian ulang resep favorit beserta status sudah/belum disimpan

### **Meal Planner** (`src/pages/meal-planner.jsx`)

- Form validasi HTML5 (teks, email, angka, select, checkbox, textarea) memakai komponen UI internal (`src/components/ui`)
- Date picker memakai `planner-date-picker` dengan popover kalender
- Tabel saran resep dari kombinasi filter kategori dan area, dilengkapi aksi queue dan auto-plan
- Panel queue dan daftar rencana tersimpan persisten melalui `use-meal-plan`

### **Routing & Navigasi**

- `RecipeDock` (`src/components/ui/dock.jsx`) berisi tautan Home, Favorites, Planner
- Halaman 404 khusus di `src/pages/not-found.jsx`

---

## Kesesuaian Rubrik

### **CPMK0501: Form, Tabel, CSS**

- Form planner memiliki >5 input berbeda, validasi required/min/max/type, serta feedback submit
- Tabel saran menampilkan kolom Meal, Category, Area, Tags, Actions dengan data TheMealDB
- Styling memanfaatkan kombinasi Tailwind utility, custom CSS (`src/pages/home.css`, `src/components/ui/card-grainny.css`), pseudo-element, dan layout responsif

### **CPMK0502: HTML, JavaScript, React**

- Struktur HTML5 lengkap pada `index.html` dan seluruh halaman React
- Modern JS: arrow function, destrukturisasi, template literal, spread, async/await di hooks (`src/hooks/*`)
- React pattern: functional component, hooks bawaan (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`), Suspense loader, conditional rendering
- State global menggunakan Zustand (detail resep, favorit, meal planner) dengan persist storage
- Integrasi API TheMealDB: search, lookup detail, list kategori/area/ingredient, filter kategori/area

---

## Struktur Direktori Inti

```
src/
├── components/
│   ├── core/               # komponen dasar (dock, morphing dialog)
│   ├── planner/            # planner-form, date-picker, queue, table, header
│   └── ui/                 # komponen UI umum (button, calendar, select, kartu)
├── hooks/                  # logika data (metadata, catalog, detail, planner, favorit)
├── pages/                  # home, favorites, meal-planner, not-found
├── lib/utils.js            # helper utilitas (cn, format tanggal)
├── index.css               # gaya global
└── main.jsx                # entry point + routing
```

---

## Cara Menjalankan

### 1. Persiapan Lingkungan

Node.js >= 18 (npm atau bun)

### 2. Instal Dependensi

```bash
npm install
# atau
bun install
```

### 3. Menjalankan Mode Pengembangan

```bash
npm run dev
```

Buka URL yang muncul di terminal (umumnya `http://localhost:5173`)

### 4. Build Produksi (Opsional)

```bash
npm run build
npm run preview
```

---
