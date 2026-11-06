/* ============ PENGATURAN ============ */
// GANTI dengan nomor WhatsApp Anda: kode negara tanpa 0 dan tanpa +
// Contoh: 0812-3456-7890 menjadi 6281234567890
const NOMOR_WA = "628123456789";
const KUNCI = "dibaran_keranjang";

/* ============ KERANJANG (localStorage) ============ */
function ambilKeranjang() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI)) || [];
  } catch (e) {
    return [];
  }
}

function simpanKeranjang(keranjang) {
  localStorage.setItem(KUNCI, JSON.stringify(keranjang));
  perbaruiBadge();
}

function tambahKeKeranjang(id) {
  const keranjang = ambilKeranjang();
  const ada = keranjang.find(item => item.id === id);
  if (ada) {
    ada.jumlah = Math.min(99, ada.jumlah + 1);
  } else {
    keranjang.push({ id: id, jumlah: 1 });
  }
  simpanKeranjang(keranjang);
  tampilToast("Produk ditambahkan ke keranjang");
}

function perbaruiBadge() {
  const total = ambilKeranjang().reduce((t, item) => t + item.jumlah, 0);
  document.querySelectorAll(".badge").forEach(b => { b.textContent = total; });
}

/* ============ PEMBANTU ============ */
function rupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

function tampilToast(teks) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = teks;
  toast.classList.add("tampil");
  setTimeout(() => toast.classList.remove("tampil"), 1800);
}

async function muatProduk() {
  const respon = await fetch("data/produk.json");
  return await respon.json();
}

function buatKartu(p) {
  return `
    <article class="kartu">
      <img src="${p.gambar}" alt="${p.nama}" loading="lazy"
           onerror="this.style.visibility='hidden'">
      <div class="isi">
        <h3>${p.nama}</h3>
        <p>${p.deskripsi}</p>
        <p class="harga">${rupiah(p.harga)}</p>
        <button class="btn" data-id="${p.id}" ${p.stok ? "" : "disabled"}>
          ${p.stok ? "Tambah ke Keranjang" : "Habis"}
        </button>
      </div>
    </article>`;
}

/* ============ DIJALANKAN DI SEMUA HALAMAN ============ */
document.addEventListener("DOMContentLoaded", async () => {
  perbaruiBadge();

  // Semua tautan WhatsApp mengikuti NOMOR_WA di atas
  document.querySelectorAll(".link-wa").forEach(a => {
    a.href = "https://wa.me/" + NOMOR_WA;
  });

  // Menu ponsel
  const tombolMenu = document.querySelector(".menu-btn");
  if (tombolMenu) {
    tombolMenu.addEventListener("click", () => {
      document.getElementById("menu").classList.toggle("buka");
    });
  }

  // Klik tombol "Tambah ke Keranjang" di halaman mana pun
  document.addEventListener("click", e => {
    const tombol = e.target.closest("button[data-id]");
    if (tombol && !tombol.disabled && !tombol.closest(".item")) {
      tambahKeKeranjang(tombol.dataset.id);
    }
  });

  // Beranda: tampilkan produk unggulan
  const unggulan = document.getElementById("produk-unggulan");
  if (unggulan) {
    try {
      const data = await muatProduk();
      unggulan.innerHTML = data.produk.filter(p => p.unggulan).map(buatKartu).join("");
    } catch (e) {
      unggulan.innerHTML = "<p>Produk gagal dimuat. Buka website lewat Live Server.</p>";
    }
  }
});