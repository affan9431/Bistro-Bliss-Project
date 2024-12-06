var notyf = new Notyf({
  duration: 2000,
  position: {
    x: "center",
    y: "top",
  },
});

function toggleMenu() {
  const mobileNav = document.querySelector(".mobile-nav");
  mobileNav.classList.toggle("active");
}

const whiteButton = document.getElementById("about");

if (whiteButton) {
  whiteButton.addEventListener("click", function () {
    location.href = "/about";
  });
}

let btn = document.getElementById("btn");

if (btn) {
  btn.addEventListener("click", (e) => {
    const itemName = document.querySelector(
      ".product-detail__name"
    ).textContent;
    const itemDescription = document.querySelector(
      ".product-detail__description"
    ).textContent;
    const itemPrice = document.querySelector(
      ".product-detail__price"
    ).textContent;
    const image = document.querySelector(".product-detail__image").src;

    // Create an item object
    const itemData = {
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      image,
      quantity: 1,
    };

    let cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];

    // Check if the item already exists in the cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.name === itemData.name
    );

    if (existingItemIndex !== -1) {
      // Item already exists, increase the quantity
      cartItems[existingItemIndex].quantity += 1;
      notyf.success(
        `${itemData.name} quantity updated to ${cartItems[existingItemIndex].quantity}`
      );
    } else {
      // Add the new item to the cart
      cartItems.push(itemData);
      notyf.success(`${itemData.name} added to cart.`);
    }

    // Save the updated cart back to local storage
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  });
}

const logout = async () => {
  try {
    const res = await axios.get("/users/logout");

    if (res.data.status === "success") {
      location.reload();
    }
  } catch (error) {
    console.log(error.response);
  }
};

// Add event listener for logout button when the DOM is fully loaded
const logoutBtn = document.querySelector("#logout");

// Add click event listener to the logout button if it exists
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

async function getMenuById(id) {
  const url = `/api/menu/${id}`;

  try {
    const res = await axios.get(url);

    // Store the fetched data in localStorage
    sessionStorage.setItem("menuData", JSON.stringify(res.data.data));

    // Navigate to the menu-detail page
    location.href = "/menu-detail";
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }
}

async function proceedToCheckout() {
  const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];

  if (cartItems.length === 0) {
    notyf.error("Your cart is empty!");
    return;
  }

  // Calculate the total amount
  let totalAmount = 0;
  cartItems.forEach((item) => {
    const itemPrice = parseFloat(item.price.replace("$", ""));
    totalAmount += itemPrice * item.quantity;
  });

  if (totalAmount < 0.5) {
    notyf.error(
      "The total amount must be at least $0.50 to proceed to checkout."
    );
    return;
  }

  try {
    // Send cart data to backend
    const session = await axios.post("/checkout-session", {
      items: cartItems,
    });

    // Redirect to Stripe checkout page
    window.location.replace(session.data.session.url);
  } catch (error) {
    const html = error.response.data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const errorMessage = doc.querySelector(".error__msg").textContent;
    notyf.error(errorMessage);
  }
}

const bookBtn = document.querySelector(".book-button");
if (bookBtn) {
  bookBtn.addEventListener("click", async () => {
    // Fetch user input
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    const branch = document.getElementById("branch").value.toLowerCase();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const persons = document.getElementById("persons").value;
    const id = localStorage.getItem("userID");
    console.log(id);

    const tableData = {
      date: date,
      startTime: startTime,
      endTime: endTime,
      branch: branch,
      name: name,
      phone: phone,
      persons: persons,
      createdBy: id,
    };

    if (tableData) {
      notyf.success("The selected time is available!");
      console.log(tableData);
      const res = await axios.post("/api/booking", tableData);

      if ((res.data.data.status = "success")) {
        notyf.success("Booking successful!");
      }
    } else {
      notyf.error(
        "Sorry, the selected time is not available. Please choose a different time."
      );
    }
  });
}
