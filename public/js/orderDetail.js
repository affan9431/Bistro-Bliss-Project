document.addEventListener("DOMContentLoaded", () => {
  // Get the cart items from localStorage
  const cartItems = JSON.parse(sessionStorage.getItem("cartItems"));

  // Generate a random order number
  const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`; 
  const orderDate = new Date().toLocaleDateString(); 
  const customerName = "John Doe"; 
  const deliveryAddress = "123 Main St, Anytown, AN 12345";

  // Check if cartItems is available
  if (cartItems && cartItems.length > 0) {
    // Set order details in the HTML
    document.querySelector("#order-number").textContent = orderNumber;
    document.querySelector("#order-date").textContent = orderDate;
    document.querySelector("#customer-name").textContent = customerName;
    document.querySelector("#delivery-address").textContent = deliveryAddress;

    // Populate order items and total amount
    const orderItemsContainer = document.querySelector("#order-items");
    let totalAmount = 0;

    cartItems.forEach((item) => {
      const orderItemElement = document.createElement("div");
      orderItemElement.classList.add("order-details-item");

      // Create the item text
      const itemDescription = document.createElement("span");
      itemDescription.textContent = `${item.name} x${item.quantity}`;
      orderItemElement.appendChild(itemDescription);

      // Convert the price from string to number
      const itemPriceString = item.price; 
      const itemPriceNumber = parseFloat(itemPriceString.replace("$", "")); 

      // Calculate item total price
      const itemTotalPrice = itemPriceNumber * item.quantity; 
      totalAmount += itemTotalPrice;

      // Create formatted item total price
      const itemPriceElement = document.createElement("span");
      itemPriceElement.textContent = ` $${itemTotalPrice.toFixed(2)}`; 
      orderItemElement.appendChild(itemPriceElement);

      // Append to the container
      orderItemsContainer.appendChild(orderItemElement);
    });

    // Set the total amount
    document.querySelector(
      "#total-amount"
    ).textContent = `$${totalAmount.toFixed(2)}`; 
    document.querySelector("#payment-method").textContent = "Credit Card"; 

    sessionStorage.removeItem("cartItems");
  } else {
    // Handle case where there are no items in the cart
    document.querySelector(".order-details-success-message").textContent =
      "No items found in the order.";
  }
});
