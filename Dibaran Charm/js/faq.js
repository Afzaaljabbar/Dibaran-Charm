document.addEventListener("DOMContentLoaded", async () => {
  const wadah = document.getElementById("daftar-faq");
  const cari = document.getElementById("cari-faq");

  let faq;
  try {
    const respon = await fetch("data/faq.json");
    faq = await respon.json();
  } catch (e) {
    wadah.innerHTML = "<p>FAQ gagal dimuat. Buka website lewat Live Server.</p>";
    return;
  }

  function tampilkan() {
    const kata = cari.value.toLowerCase();
    const hasil = faq.filter(f =>
      f.tanya.toLowerCase().includes(kata) || f.jawab.toLowerCase().includes(kata)
    );
    wadah.innerHTML = hasil.length
      ? hasil.map(f => `<details><summary>${f.tanya}</summary><p>${f.jawab}</p></details>`).join("")
      : "<p>Pertanyaan tidak ditemukan.</p>";
  }

  cari.addEventListener("input", tampilkan);
  tampilkan();
});