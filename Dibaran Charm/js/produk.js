document.addEventListener("DOMContentLoaded", async () => {
  const daftar = document.getElementById("daftar-produk");
  const cari = document.getElementById("cari");
  const pilih = document.getElementById("kategori");
  const kosong = document.getElementById("kosong");

  let data;
  try {
    data = await muatProduk();
  } catch (e) {
    daftar.innerHTML = "<p>Produk gagal dimuat. Buka website lewat Live Server.</p>";
    return;
  }

  // Isi pilihan kategori dari JSON
  data.kategori.forEach(k => {
    const opsi = document.createElement("option");
    opsi.value = k.id;
    opsi.textContent = k.nama;
    pilih.appendChild(opsi);
  });

  function tampilkan() {
    const kata = cari.value.toLowerCase();
    const hasil = data.produk.filter(p =>
      (pilih.value === "semua" || p.kategori === pilih.value) &&
      p.nama.toLowerCase().includes(kata)
    );
    daftar.innerHTML = hasil.map(buatKartu).join("");
    kosong.hidden = hasil.length > 0;
  }

  cari.addEventListener("input", tampilkan);
  pilih.addEventListener("change", tampilkan);
  tampilkan();
});