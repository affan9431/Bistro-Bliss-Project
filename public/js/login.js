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
        const id = JSON.parse(localStorage.getItem("userID"));
        if (id !== decoded.id) localStorage.setItem("userID", decoded.id);
        else notyf.error("Login failed: " + res.data.message);

        notyf.success("Login successful");
        window.setTimeout(() => {
          location.assign("/");
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

const form = document.querySelector(".login-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
