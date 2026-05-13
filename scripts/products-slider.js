const productSlides = document.querySelectorAll(".product-slide");

let currentProductSlide = 0;

console.log("product slider loaded:", productSlides.length);

if (productSlides.length > 1) {
  setInterval(() => {
    productSlides[currentProductSlide].classList.remove("active");

    currentProductSlide =
      (currentProductSlide + 1) % productSlides.length;

    productSlides[currentProductSlide].classList.add("active");
  }, 4500);
}