document.addEventListener("DOMContentLoaded", () => {
  const contactBubble = document.getElementById("contact-bubble");
  const contactFormPopup = document.getElementById("contact-form-popup");
  const contactForm = document.getElementById("contact-form");
  const closeButton = document.getElementById("close-popup"); // Correct ID

  // Open the contact form when bubble is clicked
  contactBubble.addEventListener("click", () => {
    contactFormPopup.style.display = "block";
  });

  // Close the form when the close button is clicked
  closeButton.addEventListener("click", () => {
    contactFormPopup.style.display = "none";
  });

  // Show thank you message after form submission
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    contactForm.innerHTML = `
        <h4>Thank you for contacting us!</h4>
        <p>One of our team members will contact you soon.</p>
      `;
  });
});
