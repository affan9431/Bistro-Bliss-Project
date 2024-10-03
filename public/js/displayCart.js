let mainContainer = document.querySelector(".cart-items");

function getAndDisplayData() {
  const data = JSON.parse(sessionStorage.getItem("cartItems")) || [];

  // Clear previous items
  mainContainer.innerHTML = "";

  let total = 0;

  data.forEach((item, index) => {
    total += item.quantity * parseFloat(item.price.replace("$", " "));

    // Create list item
    const cartItem = document.createElement("li");
    cartItem.classList.add("cart-item");

    // Create item info
    const itemInfo = document.createElement("div");
    itemInfo.classList.add("item-info");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.classList.add("item-image");

    const itemDetails = document.createElement("div");
    itemDetails.classList.add("item-details");

    const itemName = document.createElement("h3");
    itemName.textContent = item.name;

    const itemPrice = document.createElement("span");
    itemPrice.classList.add("item-price");
    itemPrice.textContent = item.price;

    // Create item quantity section
    const itemQuantity = document.createElement("div");
    itemQuantity.classList.add("item-quantity");

    const decreaseBtn = document.createElement("button");
    decreaseBtn.classList.add("quantity-btn");
    decreaseBtn.setAttribute("aria-label", "Decrease quantity");
    decreaseBtn.textContent = "-";

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = item.quantity;
    quantityInput.min = "1";
    quantityInput.classList.add("quantity-input");
    quantityInput.setAttribute("aria-label", "Item quantity");

    const increaseBtn = document.createElement("button");
    increaseBtn.classList.add("quantity-btn");
    increaseBtn.setAttribute("aria-label", "Increase quantity");
    increaseBtn.textContent = "+";

    // Create delete button with SVG icon
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.setAttribute("aria-label", "Delete item");
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5v7h1v-7h-1zm4 0v7h1v-7h-1zM2.5 4a.5.5 0 0 0-.5.5v.5h12v-.5a.5.5 0 0 0-.5-.5H10v-1a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H2.5zm3 0h4v-1a.5.5 0 0 1 .5-.5H9a.5.5 0 0 1 .5.5v1H5.5V3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4z"/>
      </svg>
    `;

    // Append elements
    itemDetails.appendChild(itemName);
    itemDetails.appendChild(itemPrice);
    itemInfo.appendChild(img);
    itemInfo.appendChild(itemDetails);
    itemQuantity.appendChild(decreaseBtn);
    itemQuantity.appendChild(quantityInput);
    itemQuantity.appendChild(increaseBtn);

    cartItem.appendChild(itemInfo);
    cartItem.appendChild(itemQuantity);
    cartItem.appendChild(deleteBtn);

    // Append the cart item to the main container
    mainContainer.appendChild(cartItem);

    // Add event listeners for the increase and decrease buttons
    increaseBtn.addEventListener("click", () => {
      item.quantity++;
      sessionStorage.setItem("cartItems", JSON.stringify(data));
      getAndDisplayData();
    });

    decreaseBtn.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
        sessionStorage.setItem("cartItems", JSON.stringify(data));
        getAndDisplayData();
      }
    });

    // Update item quantity via input field
    quantityInput.addEventListener("change", () => {
      let newQuantity = parseInt(quantityInput.value);
      if (newQuantity > 0) {
        item.quantity = newQuantity;
        sessionStorage.setItem("cartItems", JSON.stringify(data));
        getAndDisplayData();
      }
    });

    // Add event listener for delete button
    deleteBtn.addEventListener("click", () => {
      data.splice(index, 1);
      sessionStorage.setItem("cartItems", JSON.stringify(data));
      getAndDisplayData();
    });
  });

  document.querySelector(".cart-total").innerHTML = `Total: $${total.toFixed(
    2
  )}`;
}

getAndDisplayData();
