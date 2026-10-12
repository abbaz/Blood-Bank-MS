document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "register") {
    requireGuest();
    const form = document.getElementById("registerForm");
    const status = document.getElementById("formStatus");
    const rules = {
      fullName: validateFullName,
      username: validateUsername,
      email: validateEmail,
      phone: validateRequiredPhone,
      institutionId: validateInstitution,
      role: validateRole,
      bloodGroup: validateBloodGroup,
      password: validatePassword,
      confirmPassword: (value) =>
        validateConfirmPassword(form.password.value, value),
      terms: validateTerms,
    };
    bindLiveValidation(form, rules);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateForm(form, rules)) {
        showStatus(status, "error", "Please correct the highlighted fields.");
        return;
      }
      try {
        await registerUser({
          fullName: form.fullName.value,
          username: form.username.value,
          email: form.email.value,
          phone: form.phone.value,
          institutionId: form.institutionId.value,
          role: form.role.value,
          bloodGroup: form.bloodGroup.value,
          password: form.password.value,
        });
        showStatus(status, "success", "Account created. Redirecting to home…");
        setTimeout(() => (window.location.href = "index.html"), 800);
      } catch (err) {
        showStatus(status, "error", err.message);
      }
    });
  }

  if (page === "login") {
    requireGuest();
    const form = document.getElementById("loginForm");
    const status = document.getElementById("formStatus");
    const rules = {
      identity: validateLoginIdentity,
      password: (value) => (value ? "" : "Password is required."),
    };
    bindLiveValidation(form, rules);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateForm(form, rules)) {
        showStatus(status, "error", "Please complete both fields correctly.");
        return;
      }
      try {
        await loginUser(form.identity.value, form.password.value);
        showStatus(status, "success", "Signed in. Redirecting…");
        setTimeout(() => (window.location.href = "index.html"), 700);
      } catch (err) {
        showStatus(status, "error", err.message);
      }
    });
  }

  if (page === "contact") {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    const session = getSession();
    if (session) {
      form.fullName.value = session.fullName;
      form.email.value = session.email;
      form.role.value = session.role;
    }
    const rules = {
      fullName: validateFullName,
      email: validateEmail,
      phone: validateOptionalPhone,
      role: validateRole,
      subject: validateSubject,
      message: validateMessage,
    };
    bindLiveValidation(form, rules);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(form, rules)) {
        showStatus(status, "error", "Please correct the highlighted fields.");
        return;
      }
      const tickets = JSON.parse(localStorage.getItem("sbb_tickets") || "[]");
      tickets.push({
        id: Date.now(),
        name: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        role: form.role.value,
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
        sentAt: new Date().toISOString(),
      });
      localStorage.setItem("sbb_tickets", JSON.stringify(tickets));
      form.reset();
      ["fullName", "email", "phone", "role", "subject", "message"].forEach((id) => {
        form[id].classList.remove("valid", "invalid");
      });
      showStatus(
        status,
        "success",
        "Message sent. The administrator team will follow up using your email."
      );
    });
  }

  if (page === "home") {
    const session = getSession();
    const guest = document.getElementById("guestHero");
    const dash = document.getElementById("signedInDash");
    if (session && guest && dash) {
      guest.hidden = true;
      dash.hidden = false;
      document.getElementById("welcomeName").textContent = session.fullName;
      document.getElementById("welcomeRole").textContent = session.role.replaceAll("_", " ");
    }
  }
});
