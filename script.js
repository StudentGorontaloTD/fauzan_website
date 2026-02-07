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
    
    totalPrice.innerText = increment(keranjang)


}

console.log(keranjang)

