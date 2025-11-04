// Menunggu sampai seluruh halaman HTML dimuat
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Navigasi Mobile (Hamburger Menu) ---
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  // --- 2. Fungsi Utama untuk Memuat Data ---

  // Fungsi generik untuk mengambil data JSON
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Gagal mengambil data dari ${url}:`, error);
      return null; // Kembalikan null jika gagal
    }
  }

  // --- 3. Memuat Halaman Galeri (galeri.html) ---
  const galeriGrid = document.getElementById("galeri-grid");
  if (galeriGrid) {
    loadGaleri();
  }

  async function loadGaleri() {
    const data = await fetchData("data/galeri.json");
    if (!data) {
      galeriGrid.innerHTML =
        "<p>Gagal memuat galeri. Silakan coba lagi nanti.</p>";
      return;
    }

    galeriGrid.innerHTML = ""; // Kosongkan tulisan "Memuat..."

    data.forEach((proyek) => {
      const card = document.createElement("div");
      card.className = "galeri-card";

      // Buat tag teknologi
      const tagsHtml = proyek.teknologi
        .map((tag) => `<span>${tag}</span>`)
        .join("");

      card.innerHTML = `
                <img src="${proyek.gambar}" alt="${proyek.judul}">
                <div class="galeri-card-content">
                    <h3>${proyek.judul}</h3>
                    <p>${proyek.deskripsi}</p>
                    <div class="galeri-card-tags">
                        ${tagsHtml}
                    </div>
                    <div class="galeri-card-links">
                        <a href="${proyek.link_demo}" class="btn-link" target="_blank" rel="noopener noreferrer">Lihat Demo</a>
                        <a href="${proyek.link_repo}" class="btn-link" target="_blank" rel="noopener noreferrer">Lihat Kode</a>
                    </div>
                </div>
            `;
      galeriGrid.appendChild(card);
    });
  }

  // --- 4. Memuat Halaman Tulisan (tulisan.html) ---
  const tulisanList = document.getElementById("tulisan-list");
  if (tulisanList) {
    loadTulisan();
  }

  async function loadTulisan() {
    const data = await fetchData("data/tulisan.json");
    if (!data) {
      tulisanList.innerHTML =
        "<p>Gagal memuat tulisan. Silakan coba lagi nanti.</p>";
      return;
    }

    tulisanList.innerHTML = ""; // Kosongkan tulisan "Memuat..."

    data.forEach((artikel) => {
      const item = document.createElement("article");
      item.className = "tulisan-item";

      item.innerHTML = `
                <h3>${artikel.judul}</h3>
                <div class="tulisan-meta">
                    <span>${artikel.tanggal}</span> | 
                    <span class="kategori">${artikel.kategori}</span>
                </div>
                <p>${artikel.ringkasan}</p>
                <a href="${artikel.link_artikel}" class="btn-link">Baca Selengkapnya &rarr;</a>
            `;
      tulisanList.appendChild(item);
    });
  }

  // --- 5. Memuat Pratinjau (index.html) ---
  const galeriPreview = document.getElementById("galeri-preview");
  const tulisanPreview = document.getElementById("tulisan-preview");

  if (galeriPreview && tulisanPreview) {
    loadPratinjau();
  }

  async function loadPratinjau() {
    // Muat 2 item galeri terbaru
    const galeriData = await fetchData("data/galeri.json");
    if (galeriData) {
      galeriPreview.innerHTML = ""; // Hapus loading
      // Ambil 2 item pertama (atau sesuaikan jika perlu)
      galeriData.slice(0, 2).forEach((proyek) => {
        const item = document.createElement("a");
        item.href = "galeri.html"; // Arahkan ke halaman galeri
        item.className = "preview-item";
        item.textContent = proyek.judul;
        galeriPreview.appendChild(item);
      });
    } else {
      galeriPreview.innerHTML = "<p>Gagal memuat pratinjau galeri.</p>";
    }

    // Muat 2 tulisan terbaru
    const tulisanData = await fetchData("data/tulisan.json");
    if (tulisanData) {
      tulisanPreview.innerHTML = ""; // Hapus loading
      tulisanData.slice(0, 2).forEach((artikel) => {
        const item = document.createElement("a");
        item.href = artikel.link_artikel; // Arahkan ke artikelnya langsung
        item.className = "preview-item-tulisan";
        item.innerHTML = `
                    <strong>${artikel.judul}</strong>
                    <span>${artikel.tanggal}</span>
                `;
        tulisanPreview.appendChild(item);
      });
    } else {
      tulisanPreview.innerHTML = "<p>Gagal memuat pratinjau tulisan.</p>";
    }
  }
});
