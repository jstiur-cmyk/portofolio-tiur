(function () {
  var diam = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Garis kemajuan gulir di bagian paling atas halaman
  var garis = document.querySelector(".progres");
  function hitung() {
    var tinggi = document.documentElement.scrollHeight - window.innerHeight;
    var p = tinggi > 0 ? window.scrollY / tinggi : 0;
    if (garis) garis.style.transform = "scaleX(" + Math.min(Math.max(p, 0), 1) + ")";
  }
  window.addEventListener("scroll", hitung, { passive: true });
  window.addEventListener("resize", hitung);
  hitung();

  if (diam || !("IntersectionObserver" in window)) return;

  // Angka naik dari 0 saat terlihat
  var angka = document.querySelectorAll(".angka b");
  var amati = new IntersectionObserver(function (daftar) {
    daftar.forEach(function (d) {
      if (!d.isIntersecting) return;
      amati.unobserve(d.target);
      var el = d.target, akhir = parseInt(el.textContent, 10);
      if (isNaN(akhir)) return;
      var mulai = null, durasi = 900;
      function langkah(t) {
        if (mulai === null) mulai = t;
        var p = Math.min((t - mulai) / durasi, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(akhir * ease);
        if (p < 1) requestAnimationFrame(langkah);
      }
      el.textContent = "0";
      requestAnimationFrame(langkah);
    });
  }, { threshold: 0.6 });
  angka.forEach(function (el) { amati.observe(el); });

  // Foto bergeser sedikit mengikuti penunjuk di area hero
  var hero = document.querySelector(".hero");
  var foto = document.querySelector(".hero-foto img");
  if (hero && foto && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      foto.style.transform = "translate(" + (x * 12).toFixed(1) + "px," + (y * 10).toFixed(1) + "px)";
    });
    hero.addEventListener("pointerleave", function () { foto.style.transform = ""; });
  }
})();
