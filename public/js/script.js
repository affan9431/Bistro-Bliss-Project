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
      location.assign("/login");
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
      const res = await axios.post("/api/booking", tableData);
      if (res.data.status === "success") {
        // Open the payment modal
        document.getElementById("payment-modal").style.display = "block";
      }
    } else {
      notyf.error(
        "Sorry, the selected time is not available. Please choose a different time."
      );
    }
  });
}

// Close modal functionality
const closeModel = document.getElementById("close-modal");
closeModel &&
  closeModel.addEventListener("click", function () {
    document.getElementById("payment-modal").style.display = "none";
  });

// Handle Cash payment selection
const cash = document.getElementById("cash");
cash &&
  cash.addEventListener("click", function () {
    notyf.success("You chose Cash as your payment method.");
    document.getElementById("payment-modal").style.display = "none";
  });

// Handle Online payment selection and call the backend API
const online = document.getElementById("online");
online &&
  online.addEventListener("click", async function () {
    notyf.success("You chose Pay Online.");

    // Get the booking details to send to the backend
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    const branch = document.getElementById("branch").value.toLowerCase();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const persons = document.getElementById("persons").value;
    const id = localStorage.getItem("userID");

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

    // Send booking data to create a checkout session
    const res = await axios.post("/checkout-session-1", { items: tableData });

    if (res.data.status === "success") {
      // Redirect to Stripe checkout page or handle accordingly
      window.location.href = res.data.session.url; // Assuming the backend sends the Stripe session URL
    } else {
      notyf.error("Failed to create checkout session.");
    }

    document.getElementById("payment-modal").style.display = "none";
  });

const submitReviewBtn = document.querySelector("#submitReview");

submitReviewBtn &&
  submitReviewBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const reviewTitle = document.getElementById("reviewTitle").value;
    const reviewDesc = document.getElementById("reviewDesc").value;
    const id = localStorage.getItem("userID");

    const review = {
      title: reviewTitle,
      description: reviewDesc,
      createdBy: id,
    };

    if (review) {
      const res = await axios.post("/api/review", review);
      notyf.success("Review submitted successfully!");
      window.location.reload();
      console.log(res);
    } else {
      notyf.error("Please fill in all fields");
    }
  });

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch reviews from the API
    const response = await axios.get("/api/review");
    const reviews = response.data.reviews; // Adjust this to match your API response structure

    const reviewContainer = document.querySelector(".review-card-container");

    // Clear existing content (if any)
    if (reviewContainer) {
      reviewContainer.innerHTML = "";
    }

    // Loop through the reviews and dynamically generate cards
    reviews &&
      reviews.forEach((review) => {
        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-card");

        reviewCard.innerHTML = `
          <h2>${review.title}</h2>
          <p class="size">${review.description}</p>
          <div class="author">
            <img src="/images/user-profile.png" alt="${
              review.createdBy?.name || "Unknown"
            }">
            <p>${review.createdBy?.name || "Anonymous"}<br>${new Date(
          review.createdAt
        ).toLocaleDateString()}</p>
          </div>
        `;

        if (reviewContainer) reviewContainer.appendChild(reviewCard);
      });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
});

// Open the modal
function openModal() {
  const modal = document.getElementById("checkout-modal");
  modal.style.display = "block";
}

// Close the modal
function closeModal() {
  const modal = document.getElementById("checkout-modal");
  modal.style.display = "none";
}

// Submit the checkout form
async function submitCheckout(event) {
  const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;

  const data = {
    cartItems: cartItems, // Pass the array of items to be purchased as a parameter in the request body object below
    name: name,
    address: address,
    phone: phone,
  };

  const res = await axios.post("/api/Food", data);
  notyf.success("Checkout successful! You are redirect to payment page!");
  console.log(res);
}

function showTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => (tab.style.display = "none"));
  document.getElementById(tabId).style.display = "block";
}

const addMenu = document.querySelector("#AddMenu");

if (addMenu) {

  addMenu.addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const data = {
      name: name,
      price: price,
      description: description,
    };
    console.log(data);
    const res = await axios.post("/api/menu", data);
    notyf.success("Add menu successful!");
  });
}
