let keranjang = []
function increment(keranjang) {
    var total = 0
    for (i = 0; i < keranjang.length; i++) {
        total += keranjang[i]
    }
    return total
}
function storeToArray(price) {
    var totalPrice = document.getElementById("totalPrice")

    keranjang.push(price)
    total = increment(keranjang)
    console.log(total);
    
    totalPrice.innerText = total


}

function showQr() {
    var qrcode = document.getElementById("qrcode")
    var qrcoder = document.getElementById("qrcoder")
    qrcode.style.display = "flex"
    qrcoder.style.display = "flex"
}

console.log(keranjang)

var modal = document.querySelector(".modal-container");
var button = document.querySelector(".modal-button");
var btnClose = document.querySelector(".modal-ex");

if (button) {
    button.addEventListener("click", function() {
        modal.style.visibility = "visible";
    });
}

if (btnClose) {
    btnClose.addEventListener("click", function() {
       modal.style.visibility = "hidden"; 
    });
}