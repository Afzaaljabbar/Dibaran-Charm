document.addEventListener("DOMContentLoaded", async () => {
  const isi = document.getElementById("isi-keranjang");
  const ringkasan = document.getElementById("ringkasan");
  const totalEl = document.getElementById("total");

  let data;
  try {
    data = await muatProduk();
  } catch (e) {
    isi.innerHTML = "<p>Data produk gagal dimuat. Buka website lewat Live Server.</p>";
    return;
  }

  function cariProduk(id) {
    return data.produk.find(p => p.id === id);
  }

  function gambar() {
    // Abaikan item yang produknya sudah tidak ada di produk.json
    const keranjang = ambilKeranjang().filter(item => cariProduk(item.id));

    if (keranjang.length === 0) {
      isi.innerHTML = `
        <p class="kosong">Keranjang masih kosong.<br><br>
        <a href="produk.html" class="btn">Lihat Produk</a></p>`;
      ringkasan.hidden = true;
      return;
    }

    let total = 0;
    isi.innerHTML = keranjang.map(item => {
      const p = cariProduk(item.id);
      const subtotal = p.harga * item.jumlah;
      total += subtotal;
      return `
        <div class="item">
          <img src="${p.gambar}" alt="${p.nama}" onerror="this.style.visibility='hidden'">
          <div class="info"><strong>${p.nama}</strong><br>${rupiah(p.harga)}</div>
          <div class="jumlah">
            <button data-aksi="kurang" data-id="${p.id}">-</button>
            <span>${item.jumlah}</span>
            <button data-aksi="tambah" data-id="${p.id}">+</button>
          </div>
          <strong>${rupiah(subtotal)}</strong>
          <button class="hapus" data-aksi="hapus" data-id="${p.id}" aria-label="Hapus">🗑</button>
        </div>`;
    }).join("");

    totalEl.textContent = rupiah(total);
    ringkasan.hidden = false;
  }

  // Tombol +, -, dan hapus
  isi.addEventListener("click", e => {
    const tombol = e.target.closest("button[data-aksi]");
    if (!tombol) return;

    let keranjang = ambilKeranjang();
    const item = keranjang.find(i => i.id === tombol.dataset.id);
    if (!item) return;

    if (tombol.dataset.aksi === "tambah") item.jumlah = Math.min(99, item.jumlah + 1);
    if (tombol.dataset.aksi === "kurang") item.jumlah -= 1;
    if (tombol.dataset.aksi === "hapus") item.jumlah = 0;

    keranjang = keranjang.filter(i => i.jumlah > 0);
    simpanKeranjang(keranjang);
    gambar();
  });

  // Kosongkan keranjang
  document.getElementById("btn-kosongkan").addEventListener("click", () => {
    if (confirm("Kosongkan seluruh keranjang?")) {
      simpanKeranjang([]);
      gambar();
    }
  });

  // Kirim pesanan ke WhatsApp
  document.getElementById("btn-pesan").addEventListener("click", () => {
    const nama = document.getElementById("nama").value.trim();
    const catatan = document.getElementById("catatan").value.trim();

    if (!nama) {
      alert("Mohon isi nama Anda terlebih dahulu.");
      return;
    }

    let total = 0;
    let baris = "";
    let nomor = 0;
    ambilKeranjang().forEach(item => {
      const p = cariProduk(item.id);
      if (!p) return;
      nomor += 1;
      const subtotal = p.harga * item.jumlah;
      total += subtotal;
      baris += `${nomor}. ${p.nama} x${item.jumlah} = ${rupiah(subtotal)}\n`;
    });

    const pesan =
      `Halo Dibaran Charm, saya ingin memesan:\n` +
      baris +
      `Total: ${rupiah(total)}\n` +
      `Nama: ${nama}\n` +
      `Catatan: ${catatan || "-"}`;

    window.open("https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(pesan), "_blank");
  });

  gambar();
});