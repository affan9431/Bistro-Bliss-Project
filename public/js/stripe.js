import axios from "axios";

export const bookOrder = async (menuId) => {
  const stripe = Stripe(
    "pk_test_51Q42oHEOpds4wBfudqRIqvMDB6rOOyQQQsH28y7dJvrK7wfW5qV6gnyoFA2c8cY5GZhgi3GGn0Vf2KyIrjq489Om00UEXzoO5g"
  );
  try {
    const session = await axios({
      method: "GET",
      url: `http://localhost:8080/chechout-session/${menuId}`,
    });

    window.location.replace(session.data.session.url);
  } catch (err) {
    console.log("Error: ", err);
  }
};
