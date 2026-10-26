// ---------- 1. VARIABEL ----------

const namaWanita = "Widya";                          // String
const namaPria = "Zain";                             // String
const tanggalAcara = new Date("2026-11-13T10:00:00"); // ganti kalau tanggalnya berubah
let musikMain = false;                               // Boolean
let jumlahUcapan = 0;                                // Number

console.log(namaWanita, typeof namaWanita);
console.log(jumlahUcapan, typeof jumlahUcapan);
console.log(musikMain, typeof musikMain);


// ---------- 2. NAMA TAMU DARI LINK (?to=Nama) ----------
function ambilNamaTamu() {
  let nama = new URLSearchParams(window.location.search).get("to");
  if (nama === null || nama.trim() === "") {
    return "Tamu Undangan";
  }
  nama = nama.trim();
  return nama.charAt(0).toUpperCase() + nama.slice(1);
}

// Tampilkan di cover.
document.getElementById("nama-tamu").innerHTML = amankan(ambilNamaTamu());


// ---------- 3. FUNGSI PENGAMAN TEKS ----------

function amankan(teks) {
  return teks
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


// ---------- 4. BUKA UNDANGAN ----------
function bukaUndangan() {
  const cover = document.getElementById("cover");
  const amplop = document.querySelector(".amplop");
  const isi = document.getElementById("isi");

  // Kunci tombol supaya tidak bisa diklik dua kali
  document.getElementById("btn-buka").disabled = true;

  // Langkah 1: tutup amplop terbuka, kartu naik, musik mulai
  amplop.classList.add("terbuka");
  toggleMusik();

  // Langkah 2: setelah 2,3 detik, cover memudar
  setTimeout(function () {
    cover.classList.add("menghilang");
  }, 2300);

  // Langkah 3: setelah 2,9 detik, tampilkan isi undangan
  setTimeout(function () {
    cover.classList.add("d-none");
    isi.classList.remove("d-none");
    isi.classList.add("muncul");
    document.getElementById("menu-bawah").classList.remove("d-none");
    document.getElementById("btn-musik").classList.remove("d-none");
    document.body.classList.remove("terkunci");
    keSlide(0);
  }, 2900);
}


// ---------- 5. MUSIK ----------
function toggleMusik() {
  const audio = document.getElementById("musik");
  const tombol = document.getElementById("btn-musik");

  if (musikMain === false) {
    audio.play().then(function () {
      musikMain = true;
      tombol.classList.add("berputar");
    }).catch(function () {
      console.log("Musik belum bisa diputar. Cek apakah file audio/lagu.mp3 ada.");
    });
  } else {
    audio.pause();
    musikMain = false;
    tombol.classList.remove("berputar");
  }
}

// ---------- 6. COUNTDOWN (materi tambahan) ----------
function hitungMundur() {
  let sekarang = new Date();
  let selisih = tanggalAcara - sekarang;

  if (selisih <= 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML =
      `<p class="fw-bold">Acara telah berlangsung. Terima kasih atas doa restunya.</p>`;
    return;
  }

  let hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
  let jam = Math.floor((selisih / (1000 * 60 * 60)) % 24);
  let menit = Math.floor((selisih / (1000 * 60)) % 60);
  let detik = Math.floor((selisih / 1000) % 60);

  document.getElementById("hari").innerHTML = hari;
  document.getElementById("jam").innerHTML = jam;
  document.getElementById("menit").innerHTML = menit;
  document.getElementById("detik").innerHTML = detik;
}

let timer = setInterval(hitungMundur, 1000);
hitungMundur();


// ---------- 7. SALIN NOMOR REKENING ----------
function salinRekening() {
  let noRek = document.getElementById("no-rek").innerHTML;
  let bersih = noRek.replaceAll(" ", "");

  navigator.clipboard.writeText(bersih);
  bootstrap.Toast.getOrCreateInstance(document.getElementById("toast-salin")).show();
}

// ---------- 8. RSVP & UCAPAN ----------
function kirimUcapan(event) {
  event.preventDefault(); 

  let nama = document.getElementById("nama").value.trim();
  let hadir = document.querySelector('input[name="hadir"]:checked').value;
  let pesan = document.getElementById("pesan").value.trim();

  // parseInt: ubah String dari form menjadi bilangan bulat
  let jumlah = parseInt(document.getElementById("jumlah").value, 10);
  if (isNaN(jumlah) || jumlah < 1) {
    jumlah = 1;
  }

  // Validasi sederhana
  let inputNama = document.getElementById("nama");
  let inputPesan = document.getElementById("pesan");
  let valid = true;

  if (nama === "") {
    inputNama.classList.add("is-invalid");
    valid = false;
  } else {
    inputNama.classList.remove("is-invalid");
  }

  if (pesan === "") {
    inputPesan.classList.add("is-invalid");
    valid = false;
  } else {
    inputPesan.classList.remove("is-invalid");
  }

  if (valid === false) {
    return;
  }

  let daftar = document.getElementById("daftar-ucapan");
  let itemBaru = `
    <div class="ucapan-item">
      <strong>${amankan(nama)}</strong>
      <small>(${hadir}, ${jumlah} orang)</small>
      <p>${amankan(pesan)}</p>
    </div>`;
  daftar.innerHTML = itemBaru + daftar.innerHTML;

  jumlahUcapan = jumlahUcapan + 1;
  console.log("Total ucapan:", jumlahUcapan);

  document.getElementById("form-rsvp").reset();
}

// ---------- 9. SLIDE ----------
const semuaSlide = document.querySelectorAll("#isi > section");
const menuLink = document.querySelectorAll(".menu-bawah a");
let slideAktif = 0;

function keSlide(nomor) {
  if (nomor < 0 || nomor >= semuaSlide.length) {
    return;
  }
  slideAktif = nomor;

  for (let i = 0; i < semuaSlide.length; i++) {
    semuaSlide[i].classList.remove("aktif", "sebelum");
    menuLink[i].classList.remove("aktif");

    if (i === nomor) {
      semuaSlide[i].classList.add("aktif");
      semuaSlide[i].scrollTop = 0;
      menuLink[i].classList.add("aktif");
    } else if (i < nomor) {
      semuaSlide[i].classList.add("sebelum");
    }
  }
}

let awalX = 0;
let awalY = 0;
const panggung = document.getElementById("isi");



panggung.addEventListener("touchstart", function (e) {
  awalX = e.touches[0].clientX;
  awalY = e.touches[0].clientY;
});

panggung.addEventListener("touchend", function (e) {
  if (e.target.closest(".carousel")) return;
  let geserX = e.changedTouches[0].clientX - awalX;
  let geserY = e.changedTouches[0].clientY - awalY;

  if (Math.abs(geserX) > 50 && Math.abs(geserX) > Math.abs(geserY)) {
    if (geserX < 0) {
      keSlide(slideAktif + 1);
    } else {
      keSlide(slideAktif - 1); 
    }
  }
});


document.addEventListener("keydown", function (e) {
  let tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return;
  }
  if (e.key === "ArrowRight") keSlide(slideAktif + 1);
  if (e.key === "ArrowLeft") keSlide(slideAktif - 1);
});

// ---------- 10. MENYAMBUNGKAN TOMBOL ----------
document.getElementById("form-rsvp").addEventListener("submit", kirimUcapan);
document.getElementById("btn-salin").addEventListener("click", salinRekening);
document.getElementById("btn-musik").addEventListener("click", toggleMusik);