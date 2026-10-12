const PATTERNS = {
  fullName: /^[A-Za-z][A-Za-z .'-]{2,59}$/,
  username: /^[A-Za-z][A-Za-z0-9_]{3,19}$/,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  phone: /^(?:\+92|0)3[0-9]{9}$/,
  institutionId: /^[A-Za-z0-9-]{2,12}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=.]).{8,64}$/,
  subject: /^[A-Za-z0-9 ,.'!?:-]{5,80}$/,
};

const ROLES = ["ADMIN", "STAFF", "LAB_TECHNICIAN", "HOSPITAL_REQUESTER"];
const BLOOD_GROUPS = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

function setFieldState(input, message) {
  const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
  const valid = !message;
  input.classList.toggle("invalid", !valid);
  input.classList.toggle("valid", valid && Boolean(input.value));
  input.setAttribute("aria-invalid", String(!valid));
  if (errorEl) {
    errorEl.textContent = message || "";
    if (!errorEl.id) errorEl.id = `${input.id}Error`;
    const descriptions = new Set((input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    if (message) descriptions.add(errorEl.id);
    else descriptions.delete(errorEl.id);
    if (descriptions.size) input.setAttribute("aria-describedby", [...descriptions].join(" "));
    else input.removeAttribute("aria-describedby");
  }
  return valid;
}

function validateFullName(value) {
  if (!value.trim()) return "Full name is required.";
  if (!PATTERNS.fullName.test(value.trim())) {
    return "Use 3–60 letters. Hyphens, apostrophes, and spaces are allowed.";
  }
  return "";
}

function validateUsername(value) {
  if (!value.trim()) return "Username is required.";
  if (!PATTERNS.username.test(value.trim())) {
    return "4–20 characters, start with a letter. Letters, numbers, and _ only.";
  }
  return "";
}

function validateEmail(value) {
  if (!value.trim()) return "Email is required.";
  const email = value.trim();
  if (email.length > 254 || !PATTERNS.email.test(email)) return "Enter a valid email address (up to 254 characters).";
  return "";
}

function validateOptionalPhone(value) {
  if (!value.trim()) return "";
  const compact = value.replace(/[\s-]/g, "");
  if (!PATTERNS.phone.test(compact)) {
    return "Use a Pakistani mobile number, e.g. 03001234567 or +923001234567.";
  }
  return "";
}

function validateRequiredPhone(value) {
  if (!value.trim()) return "Phone number is required.";
  return validateOptionalPhone(value);
}

function validateInstitution(value) {
  if (!value.trim()) return "Institution ID is required.";
  if (!PATTERNS.institutionId.test(value.trim())) {
    return "2–12 letters, numbers, or hyphens.";
  }
  return "";
}

function validateRole(value) {
  if (!value) return "Select your role.";
  if (!ROLES.includes(value)) return "Choose a valid system role.";
  return "";
}

function validateBloodGroup(value) {
  if (!value) return "Select a blood group.";
  if (!BLOOD_GROUPS.includes(value)) return "Choose a valid ABO/Rh group.";
  return "";
}

function validatePassword(value) {
  if (!value) return "Password is required.";
  if (!PATTERNS.password.test(value)) {
    return "8–64 characters with upper, lower, number, and special character.";
  }
  return "";
}

function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return "";
}

function validateSubject(value) {
  if (!value.trim()) return "Subject is required.";
  if (!PATTERNS.subject.test(value.trim())) {
    return "5–80 characters. Avoid unusual symbols.";
  }
  return "";
}

function validateMessage(value) {
  const text = value.trim();
  if (!text) return "Message is required.";
  if (text.length < 20) return "Please write at least 20 characters.";
  if (text.length > 1000) return "Message cannot exceed 1000 characters.";
  return "";
}

function validateRequired(value, label) {
  if (!String(value).trim()) return `${label} is required.`;
  return "";
}

function validateLoginIdentity(value) {
  if (!value.trim()) return "Username or email is required.";
  const v = value.trim();
  if (v.includes("@")) return validateEmail(v);
  return validateUsername(v);
}

function validateTerms(checked) {
  return checked ? "" : "You must accept the safety and privacy terms.";
}

function bindLiveValidation(form, rules) {
  Object.entries(rules).forEach(([id, validator]) => {
    const input = form.querySelector(`#${id}`);
    if (!input) return;
    const run = () => {
      const message =
        input.type === "checkbox" ? validator(input.checked) : validator(input.value);
      setFieldState(input, message);
    };
    input.addEventListener("blur", run);
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid") || input.classList.contains("valid")) run();
    });
    if (input.id === "password") {
      const confirmation = form.querySelector("#confirmPassword");
      confirmation?.addEventListener("input", () => {
        if (confirmation.classList.contains("invalid") || confirmation.classList.contains("valid")) {
          const confirmRule = rules.confirmPassword;
          if (confirmRule) setFieldState(confirmation, confirmRule(confirmation.value));
        }
      });
    }
  });
}

function validateForm(form, rules) {
  let ok = true;
  Object.entries(rules).forEach(([id, validator]) => {
    const input = form.querySelector(`#${id}`);
    if (!input) return;
    const message =
      input.type === "checkbox" ? validator(input.checked) : validator(input.value);
    if (!setFieldState(input, message)) ok = false;
  });
  return ok;
}

function showStatus(el, type, text) {
  el.className = `form-status show ${type}`;
  el.textContent = text;
}
