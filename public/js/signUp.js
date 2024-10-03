var notyf = new Notyf({
  duration: 2000,
  position: {
    x: "center",
    y: "top",
  },
});

const signUp = async (name, email, password) => {
  try {
    const res = await axios.post("http://localhost:8080/users/signup", {
      name,
      email,
      password,
    });

    if (res.data.status === "success") {
      notyf.success("Sign Up Successfully.");
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    }
  } catch (error) {
    const html = error.response.data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const errorMessage = doc.querySelector(".error__msg").textContent;
    notyf.error(errorMessage || "ERROR: Please try again.");
  }
};

const form = document.querySelector(".signup-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Client-side password validation
    if (password.length < 8) {
      notyf.error("Password must contain at least 8 characters.");

      return;
    }

    signUp(name, email, password);
  });
}
