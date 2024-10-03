var notyf = new Notyf({
  duration: 2000,
  position: {
    x: "center",
    y: "top",
  },
});

const login = async (email, password) => {
  try {
    const res = await axios.post("http://localhost:8080/users/login", {
      email,
      password,
    });

    if (res.data.status === "success") {
      notyf.success("Login successful");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      notyf.error("Login failed: " + res.data.message);
    }
  } catch (error) {
    const html = error.response.data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const errorMessage = doc.querySelector(".error__msg").textContent;
    notyf.error(errorMessage);
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
