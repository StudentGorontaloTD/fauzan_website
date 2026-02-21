/* =========================================
   FM CULINARY
========================================= */


/* ================= MUSIC SYSTEM ================= */

const music = document.getElementById("ambientMusic");

if (music) {

  const BASE_VOLUME = 0.1;
  const FADE_DURATION = 3000;
  const FADE_STEP = 50;

  music.volume = 0;

  const savedTime = sessionStorage.getItem("musicTime");
  if (savedTime) music.currentTime = parseFloat(savedTime);

  music.addEventListener("timeupdate", () => {
    sessionStorage.setItem("musicTime", music.currentTime);
  });

  function fadeIn() {
    let volume = 0;
    const increment = BASE_VOLUME / (FADE_DURATION / FADE_STEP);
    const fade = setInterval(() => {
      volume += increment;
      if (volume >= BASE_VOLUME) {
        volume = BASE_VOLUME;
        clearInterval(fade);
      }
      music.volume = volume;
    }, FADE_STEP);
  }

  function fadeOut(callback) {
    let volume = music.volume;
    const decrement = BASE_VOLUME / (FADE_DURATION / FADE_STEP);
    const fade = setInterval(() => {
      volume -= decrement;
      if (volume <= 0) {
        volume = 0;
        clearInterval(fade);
        if (callback) callback();
      }
      music.volume = volume;
    }, FADE_STEP);
  }

  window.addEventListener("load", () => {
    music.play().then(() => fadeIn()).catch(() => {});
  });

  document.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", function (e) {
      const target = this.getAttribute("href");
      if (target && !target.startsWith("#")) {
        e.preventDefault();
        fadeOut(() => window.location.href = target);
      }
    });
  });

  window.addEventListener("beforeunload", () => {
    music.volume = 0;
  });
}


/* ================= HERO VIDEO LOOP ================= */

const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {
  heroVideo.addEventListener("timeupdate", function () {
    if (this.currentTime >= 10) {
      this.currentTime = 0;
      this.play();
    }
  });
}


/* ================= NAVBAR SCROLL EFFECT ================= */

const navbar = document.querySelector(".navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {

  if (!navbar) return;

  const currentScroll = window.pageYOffset;

  // Shrink background
  if (currentScroll > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Hide when scrolling down
  if (currentScroll > lastScroll && currentScroll > 200) {
    navbar.classList.add("hidden");
  } else {
    navbar.classList.remove("hidden");
  }

  lastScroll = currentScroll;
});


/* ================= REVEAL ON SCROLL ================= */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {

  reveals.forEach(section => {

    const windowHeight = window.innerHeight;
    const revealTop = section.getBoundingClientRect().top;
    const revealPoint = 100;

    if (revealTop < windowHeight - revealPoint) {
      section.classList.add("active");
    }

  });

}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


/* ================= OPEN STATUS ================= */

function updateOpenStatus() {
  const statusEl = document.getElementById("openStatus");
  if (!statusEl) return;

  const hour = new Date().getHours();

  if (hour >= 10 && hour < 22) {
    statusEl.textContent = "● Open Now";
    statusEl.className = "open-status status-open";
  } else if (hour >= 22 && hour < 23) {
    statusEl.textContent = "● Closing Soon";
    statusEl.className = "open-status status-closing";
  } else {
    statusEl.textContent = "● Closed";
    statusEl.className = "open-status status-closed";
  }
}

updateOpenStatus();


/* ================= CART SYSTEM ================= */

let keranjang = JSON.parse(localStorage.getItem("cart")) || [];
let historyOrder = JSON.parse(localStorage.getItem("history")) || [];
let dailyRevenue = parseInt(localStorage.getItem("dailyRevenue")) || 0;
let totalOrders = parseInt(localStorage.getItem("totalOrders")) || 0;

let activePayment = false;
let countdownInterval = null;
let remainingTime = 0;

const cartIcon = document.getElementById("cartIcon");
const cartModal = document.getElementById("cartModal");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const payNowBtn = document.getElementById("payNow");
const cancelPaymentBtn = document.getElementById("cancelPayment");
const paymentMethod = document.getElementById("paymentMethod");
const paymentDetails = document.getElementById("paymentDetails");
const paymentStatus = document.getElementById("paymentStatus");
const countdownTimer = document.getElementById("countdownTimer");
const clearCartBtn = document.getElementById("clearCart");
const closeCart = document.getElementById("closeCart");
const orderHistory = document.getElementById("orderHistory");
const revenueEl = document.getElementById("dailyRevenue");
const totalOrdersEl = document.getElementById("totalOrders");


function formatRupiah(n){
  return "Rp " + n.toLocaleString("id-ID");
}

function updateCartUI(){

  if (!cartList) return;

  if (cartIcon)
    cartIcon.style.display = keranjang.length ? "block" : "none";

  cartList.innerHTML = "";

  let total = 0;
  let totalItem = 0;

  keranjang.forEach(item => {
    total += item.price * item.qty;
    totalItem += item.qty;

    cartList.innerHTML += `
      <li>
        <strong>${item.name}</strong><br>
        ${formatRupiah(item.price)} x ${item.qty}
      </li>`;
  });

  if (cartTotal) cartTotal.innerText = formatRupiah(total);
  if (cartCount) cartCount.innerText = totalItem;

  localStorage.setItem("cart", JSON.stringify(keranjang));
}

function storeToArray(price, btn){
  const name = btn.closest(".menu-card").querySelector("h3").innerText;
  let exist = keranjang.find(i => i.name === name);
  if (exist) exist.qty++;
  else keranjang.push({name, price, qty:1});
  updateCartUI();
}


/* ================= MODAL CONTROL ================= */

if (cartIcon) cartIcon.onclick = () => cartModal.classList.add("active");
if (closeCart) closeCart.onclick = () => cartModal.classList.remove("active");

if (clearCartBtn){
  clearCartBtn.onclick = () => {
    if (activePayment){
      alert("Cancel payment first.");
      return;
    }
    keranjang = [];
    localStorage.removeItem("cart");
    updateCartUI();
  };
}


/* ================= PAYMENT METHOD DISPLAY ================= */

if (paymentMethod) {
  paymentMethod.onchange = function () {

    if (!paymentDetails) return;
    paymentDetails.innerHTML = "";

    if (this.value === "QRIS") {
      paymentDetails.innerHTML = `
        <p>Scan QR below:</p>
        <img src="assets/qr.png" style="width:150px; margin-top:10px;">
      `;
    }

    if (this.value === "Bank") {
      const va = "8808" + Math.floor(Math.random()*1000000);
      paymentDetails.innerHTML = `
        <p>Virtual Account:</p>
        <strong>${va}</strong>
      `;
    }

    if (this.value === "COD") {
      paymentDetails.innerHTML = `
        <p>Pay directly at the cashier.</p>
      `;
    }
  };
}


/* ================= HISTORY RENDER ================= */

function renderHistory(){
  if (!orderHistory) return;

  orderHistory.innerHTML = "";

  historyOrder.forEach(order=>{
    orderHistory.innerHTML += `
      <li>${order.invoice} - ${order.method} - ${formatRupiah(order.total)}</li>
    `;
  });

  if (revenueEl) revenueEl.innerText = formatRupiah(dailyRevenue);
  if (totalOrdersEl) totalOrdersEl.innerText = totalOrders;
}

renderHistory();
updateCartUI();