var notyf = new Notyf({
  duration: 2000,
  position: {
    x: "center",
    y: "top",
  },
});

const login = async (email, password) => {
  try {
    const res = await axios.post("/users/login", { email, password });

    if (res && res.data) {
      if (res.data.status === "success") {
        const token = res.data.data.token;
        const decoded = jwtDecode(token);
        const id = localStorage.getItem("userID");
        if (id !== decoded.id) localStorage.setItem("userID", decoded.id);
        else notyf.error("Login failed: " + res.data.message);

        notyf.success("Login successful");
        // Send email to Web3Form
        sendEmailToWeb3Form(email);
        window.setTimeout(() => {
          if (decoded.role === "user") {
            location.assign("/");
          } else {
            location.assign("/admin-profile");
          }
        }, 1500);
      } else {
        notyf.error("Login failed: " + res.data.message);
      }
    } else {
      notyf.error("Invalid response from server.");
    }
  } catch (error) {
    if (error.response) {
      // Handle server error
      const html = error.response.data;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const errorMessage = doc.querySelector(".error__msg").textContent;
      notyf.error(errorMessage);
    } else {
      // Handle network or other errors
      notyf.error("An error occurred: " + error.message);
    }
  }
};

const sendEmailToWeb3Form = async (email) => {
  const formData = new FormData();
  formData.append("access_key", "a500f6ea-fa65-4480-bf60-262dbb11b02c");  // Your Web3Form API Key
  formData.append("email", email);  // Send email to Web3Form

  try {
    const response = await axios.post("https://api.web3forms.com/submit", formData);
    if (response.data.success) {
      console.log("Email sent to Web3Form successfully.");
    } else {
      console.error("Error sending email to Web3Form:", response.data.message);
    }
  } catch (error) {
    console.error("An error occurred while sending to Web3Form:", error);
  }
};


const form = document.querySelector(".login-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
