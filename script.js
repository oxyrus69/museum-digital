document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Navigasi Mobile (Hamburger Menu) ---
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  // --- VARIABEL BARU UNTUK MODAL SENI ---
  const seniModal = document.getElementById("seni-modal");
  const modalClose = document.getElementById("modal-close");
  let seniDataStore = []; // Variabel untuk menyimpan data seni

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  // --- 2. Fungsi Utama untuk Memuat Data ---
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Gagal mengambil data dari ${url}:`, error);
      return null;
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
    galeriGrid.innerHTML = "";
    data.forEach((proyek) => {
      const card = document.createElement("div");
      card.className = "galeri-card";
      const tagsHtml = proyek.teknologi
        .map((tag) => `<span>${tag}</span>`)
        .join("");
      card.innerHTML = `
                <img src="${proyek.gambar}" alt="${proyek.judul}">
                <div class="galeri-card-content">
                    <h3>${proyek.judul}</h3>
                    <p>${proyek.deskripsi}</p>
                    <p class="galeri-cerita">${proyek.cerita || ""}</p>
                    <div class="galeri-card-tags">${tagsHtml}</div>
                    <div class="galeri-card-links">
                        <a href="${
                          proyek.link_demo
                        }" class="btn-link" target="_blank" rel="noopener noreferrer">Lihat</a>
                        
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
    tulisanList.innerHTML = "";
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

  // --- 5. Memuat Halaman Galeri Seni (seni.html) ---
  const seniGrid = document.getElementById("seni-grid");
  if (seniGrid) {
    loadSeni();
  }

  async function loadSeni() {
    const data = await fetchData("data/seni.json");

    if (!data) {
      seniGrid.innerHTML =
        '<p style="color: red;">Error: Gagal memuat data dari data/seni.json. Periksa konsol (F12).</p>';
      return;
    }

    if (data.length === 0) {
      seniGrid.innerHTML = "<p>Galeri ini masih kosong.</p>";
      return;
    }

    // SIMPAN DATA ke data store
    seniDataStore = data;

    seniGrid.innerHTML = ""; // Kosongkan grid

    data.forEach((karya) => {
      const card = document.createElement("div");
      card.className = "galeri-card";
      // TAMBAHKAN DATA-ID
      card.dataset.id = karya.id;

      card.innerHTML = `
                <img src="${karya.gambar}" alt="${karya.judul}">
                <div class="galeri-card-content">
                    <h3>${karya.judul}</h3>
                    <p>${karya.deskripsi}</p>
                    <p class="galeri-cerita">${karya.cerita || ""}</p>
                    <div class="galeri-card-tags">
                        <span>${karya.media}</span>
                    </div>
                </div>
            `;
      seniGrid.appendChild(card);
    });
  }

  // --- 6. Memuat Pratinjau Tulisan (index.html) ---
  // MODIFIKASI BESAR DI SINI
  const tulisanPreviewGrid = document.getElementById("tulisan-preview-grid");

  if (tulisanPreviewGrid) {
    loadPratinjauTulisan();
  }

  async function loadPratinjauTulisan() {
    const tulisanData = await fetchData("data/tulisan.json");

    if (tulisanData) {
      tulisanPreviewGrid.innerHTML = ""; // Hapus loading

      // Ambil 3 tulisan pertama (atau berapapun yang Anda mau)
      tulisanData.slice(0, 3).forEach((artikel) => {
        const item = document.createElement("a");
        item.href = artikel.link_artikel;
        item.className = "tulisan-preview-item";

        item.innerHTML = `
                    <span>${artikel.kategori}</span>
                    <h4>${artikel.judul}</h4>
                `;
        tulisanPreviewGrid.appendChild(item);
      });
    } else {
      tulisanPreviewGrid.innerHTML = "<p>Gagal memuat pratinjau tulisan.</p>";
    }
  }

  // --- 7. Memuat Hero Slideshow (index.html) ---
  const heroSlideshowContainer = document.getElementById(
    "hero-slideshow-container"
  );
  if (heroSlideshowContainer) {
    loadHeroSlideshow();
  }

  async function loadHeroSlideshow() {
    const artData = await fetchData("data/slideshow.json");
    if (!artData || artData.length === 0) {
      console.warn("Tidak ada data seni untuk slideshow.");
      // Jika gagal, setidaknya beri latar belakang darurat
      heroSlideshowContainer.style.backgroundColor = "#222";
      return;
    }

    // 1. Buat elemen slide
    artData.forEach((karya, index) => {
      const slide = document.createElement("div");
      slide.className = "hero-slide";
      slide.style.backgroundImage = `url('${karya.gambar}')`;

      if (index === 0) {
        slide.classList.add("active"); // Set slide pertama sebagai aktif
      }
      heroSlideshowContainer.appendChild(slide);
    });

    // 2. Jalankan interval slideshow
    const slides = heroSlideshowContainer.querySelectorAll(".hero-slide");
    const slideCount = slides.length;
    let currentSlide = 0;

    setInterval(() => {
      // Sembunyikan slide saat ini
      slides[currentSlide].classList.remove("active");

      // Pindah ke slide berikutnya (atau kembali ke awal)
      currentSlide = (currentSlide + 1) % slideCount;

      // Tampilkan slide berikutnya
      slides[currentSlide].classList.add("active");
    }, 5000); // Ganti gambar setiap 5 detik (5000 ms)
  }

  // --- LOGIKA BARU UNTUK MODAL DETAIL SENI ---

  // Fungsi untuk membuka modal
  function openSeniModal(id) {
    // Cari karya di data store berdasarkan ID
    const karya = seniDataStore.find((item) => item.id == id);
    if (!karya) return; // Jika tidak ketemu, jangan lakukan apa-apa

    // Isi data ke elemen modal
    document.getElementById("modal-img").src = karya.gambar;
    document.getElementById("modal-img").alt = karya.judul;
    document.getElementById("modal-title").textContent = karya.judul;
    document.getElementById("modal-media").textContent = karya.media;
    document.getElementById("modal-desc").textContent = karya.deskripsi;
    document.getElementById("modal-story").textContent =
      karya.cerita || "Tidak ada cerita tambahan untuk karya ini.";

    // Tampilkan modal
    if (seniModal) seniModal.classList.add("open");
  }

  // Fungsi untuk menutup modal
  function closeSeniModal() {
    if (seniModal) seniModal.classList.remove("open");
  }

  // Tambahkan event listener ke grid (event delegation)
  if (seniGrid) {
    seniGrid.addEventListener("click", (e) => {
      // Cari elemen .galeri-card terdekat dari target klik
      const card = e.target.closest(".galeri-card");
      if (card && card.dataset.id) {
        openSeniModal(card.dataset.id);
      }
    });
  }

  // Event listener untuk tombol close dan background modal
  if (modalClose) {
    modalClose.addEventListener("click", closeSeniModal);
  }
  if (seniModal) {
    seniModal.addEventListener("click", (e) => {
      // Jika target klik adalah modal background (bukan .modal-content)
      if (e.target === seniModal) {
        closeSeniModal();
      }
    });
  }
});
