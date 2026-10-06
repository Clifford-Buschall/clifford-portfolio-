/* =====================================================
   CLIFFORD BUSCHALL PORTFOLIO - SCRIPT
   1 Mobile menu, 2 Header on scroll, 3 Active link,
   4 Work filter, 5 Contact form, 6 Footer year
   ===================================================== */

/* ---------- 1. MOBILE MENU ---------- */
const navToggle = document.getElementById("navToggle"); // the hamburger button
const navLinks = document.getElementById("navLinks");   // the list of links

navToggle.addEventListener("click", () => {
  // Show or hide the menu and keep the button's aria state in sync for screen readers
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the menu after a link is tapped (so it doesn't stay over the page)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- 2. HEADER BORDER ON SCROLL ---------- */
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  // Adds a thin line under the header once you scroll past the top
  header.classList.toggle("scrolled", window.scrollY > 10);
});

/* ---------- 3. HIGHLIGHT THE CURRENT SECTION IN THE MENU ---------- */
const sections = document.querySelectorAll("main section[id]");
const menuAnchors = navLinks.querySelectorAll("a:not(.btn)");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Mark the link that points to the visible section
        menuAnchors.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" } // a section counts as "current" near the middle of the screen
);
sections.forEach((section) => sectionObserver.observe(section));

/* ---------- 4. WORK FILTER ---------- */
const filterButtons = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const chosen = button.dataset.filter; // "all", "graphic", "web" or "uiux"

    // Move the highlighted style to the clicked button
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    // Show projects that match; hide the rest
    projects.forEach((project) => {
      const matches = chosen === "all" || project.dataset.category === chosen;
      project.classList.toggle("hidden", !matches);
    });
  });
});

/* ---------- 5. CONTACT FORM (emails you every message) ----------
   Uses FormSubmit (free, no server needed). Messages go to the address below.
   FIRST TIME ONLY: after the site is online, send a test message. FormSubmit emails you
   an "Activate" link; click it once and every future message lands in your inbox. */
const MY_EMAIL = "cliffordbuschall16@gmail.com"; // change this if you want messages sent elsewhere
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the page from reloading

  const button = form.querySelector("button[type='submit']");
  button.disabled = true;           // prevent double sending
  note.className = "form-note";
  note.textContent = "Sending...";

  try {
    // Send the form fields to FormSubmit, which forwards them to your email
    const response = await fetch("https://formsubmit.co/ajax/" + MY_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(), // lets you hit "Reply" in Gmail
        message: form.elements.message.value.trim(),
        _subject: "New portfolio message from " + form.elements.name.value.trim(),
        _honey: form.elements._honey.value,      // spam trap
        _captcha: "false"
      })
    });

    if (!response.ok) throw new Error("Request failed");

    note.textContent = "Thanks! Your message has been sent. I'll reply soon.";
    form.reset();
  } catch (error) {
    // Shown if the visitor is offline or the service is down
    note.className = "form-note error";
    note.textContent = "Couldn't send that. Please email me directly at " + MY_EMAIL + ".";
  } finally {
    button.disabled = false;
  }
});

/* ---------- 6. FOOTER YEAR ---------- */
// Keeps the copyright year up to date automatically
document.getElementById("year").textContent = new Date().getFullYear();
