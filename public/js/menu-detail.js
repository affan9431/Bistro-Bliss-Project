document.addEventListener("DOMContentLoaded", () => {
  const menuData = JSON.parse(sessionStorage.getItem("menuData"));

  if (menuData) {
    const detailContainer =
      document.getElementsByClassName("product-detail")[0];

    // Ensure the container exists
    if (detailContainer instanceof HTMLElement) {
      detailContainer.querySelector(".product-detail__image").src =
        menuData.image;
      detailContainer.querySelector(".product-detail__image").alt =
        menuData.name;
      detailContainer.querySelector(".product-detail__name").textContent =
        menuData.name;
      detailContainer.querySelector(
        ".product-detail__description"
      ).textContent = menuData.description;
      detailContainer.querySelector(".product-detail__price").textContent =
        menuData.price;
      document.title = menuData.name;
    } else {
      console.error(
        "Product detail container not found or not an HTML element!"
      );
    }
  }
});
