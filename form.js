/**
 * ============================================================
 * CODE DUNES — PAGE 2: FORM CONTROLLER (GOOGLE FORMS LOGIC)
 * Spardha 2k26: Uncharted | Participant Registration
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("google-form");
  const btnDemoFill = document.getElementById("btn-demo-fill");
  const btnClearForm = document.getElementById("btn-clear-form");

  // Input elements
  const inputName = document.getElementById("gf-name");
  const inputRoll = document.getElementById("gf-roll");
  const inputEmail = document.getElementById("gf-email");
  const inputCollege = document.getElementById("gf-college");
  const inputPhone = document.getElementById("gf-phone");

  // Question cards
  const cardName = document.getElementById("q-card-name");
  const cardRoll = document.getElementById("q-card-roll");
  const cardEmail = document.getElementById("q-card-email");
  const cardCollege = document.getElementById("q-card-college");
  const cardDept = document.getElementById("q-card-dept");
  const cardYear = document.getElementById("q-card-year");
  const cardPhone = document.getElementById("q-card-phone");

  // Load existing data from localStorage if available
  loadSavedData();

  // 1. Google Forms Signature Card Focus Highlight
  const allQuestionCards = document.querySelectorAll(".gf-question-card");
  allQuestionCards.forEach(card => {
    const inputs = card.querySelectorAll("input");
    inputs.forEach(input => {
      input.addEventListener("focus", () => {
        allQuestionCards.forEach(c => c.classList.remove("is-focused"));
        card.classList.add("is-focused");
      });

      // Clear card error state on typing/selecting
      input.addEventListener("input", () => {
        card.classList.remove("has-error");
      });
      input.addEventListener("change", () => {
        card.classList.remove("has-error");
      });
    });
  });

  // Remove card focus on clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".gf-question-card")) {
      allQuestionCards.forEach(c => c.classList.remove("is-focused"));
    }
  });

  // 2. Demo Auto-Fill Button
  if (btnDemoFill) {
    btnDemoFill.addEventListener("click", () => {
      inputName.value = "Alex Hunter";
      inputRoll.value = "24BQ1A0501";
      inputEmail.value = "alex.hunter@vvit.net";
      inputCollege.value = "Vasireddy Venkatadri Institute of Technology (VVIT)";
      inputPhone.value = "9876543210";

      // Select CSE radio
      const deptCSE = document.querySelector('input[name="dept"][value="Computer Science & Engineering (CSE)"]');
      if (deptCSE) deptCSE.checked = true;

      // Select 2nd Year radio
      const year2nd = document.querySelector('input[name="year"][value="2nd Year"]');
      if (year2nd) year2nd.checked = true;

      // Clear errors
      allQuestionCards.forEach(c => c.classList.remove("has-error"));
    });
  }

  // 3. Clear Form Button
  if (btnClearForm) {
    btnClearForm.addEventListener("click", () => {
      if (confirm("Clear all responses? This will reset the form.")) {
        form.reset();
        allQuestionCards.forEach(c => c.classList.remove("has-error"));
        try {
          localStorage.removeItem("code_dunes_user");
        } catch (e) {}
      }
    });
  }

  // 4. Form Submission & Validation -> Navigates to event.html
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      let isValid = true;
      let firstErrorCard = null;

      // Validate Name
      if (!inputName.value.trim() || inputName.value.trim().length < 2) {
        cardName.classList.add("has-error");
        isValid = false;
        if (!firstErrorCard) firstErrorCard = cardName;
      } else {
        cardName.classList.remove("has-error");
      }

      // Validate Roll
      if (!inputRoll.value.trim() || inputRoll.value.trim().length < 3) {
        cardRoll.classList.add("has-error");
        isValid = false;
        if (!firstErrorCard) firstErrorCard = cardRoll;
      } else {
        cardRoll.classList.remove("has-error");
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!inputEmail.value.trim() || !emailRegex.test(inputEmail.value.trim())) {
        cardEmail.classList.add("has-error");
        isValid = false;
        if (!firstErrorCard) firstErrorCard = cardEmail;
      } else {
        cardEmail.classList.remove("has-error");
      }

      // Validate College
      if (!inputCollege.value.trim()) {
        cardCollege.classList.add("has-error");
        isValid = false;
        if (!firstErrorCard) firstErrorCard = cardCollege;
      } else {
        cardCollege.classList.remove("has-error");
      }

      // Validate Dept (Radio)
      const selectedDept = document.querySelector('input[name="dept"]:checked');
      if (!selectedDept) {
        cardDept.classList.add("has-error");
        isValid = false;
        if (!firstErrorCard) firstErrorCard = cardDept;
      } else {
        cardDept.classList.remove("has-error");
      }

      // Validate Year (Radio)
      const selectedYear = document.querySelector('input[name="year"]:checked');
      if (!selectedYear) {
        cardYear.classList.add("has-error");
        isValid = false;
        if (!firstErrorCard) firstErrorCard = cardYear;
      } else {
        cardYear.classList.remove("has-error");
      }

      // Validate Phone
      const phoneClean = inputPhone.value.trim().replace(/[\s-]/g, '');
      if (!phoneClean || !/^\+?[0-9]{10,14}$/.test(phoneClean)) {
        cardPhone.classList.add("has-error");
        isValid = false;
        if (!firstErrorCard) firstErrorCard = cardPhone;
      } else {
        cardPhone.classList.remove("has-error");
      }

      // If invalid, scroll smoothly to the first error card
      if (!isValid && firstErrorCard) {
        firstErrorCard.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Save valid participant response
      const participantData = {
        name: inputName.value.trim(),
        roll: inputRoll.value.trim(),
        email: inputEmail.value.trim(),
        college: inputCollege.value.trim(),
        department: selectedDept ? selectedDept.value : "CSE",
        year: selectedYear ? selectedYear.value : "2nd Year",
        phone: phoneClean,
        passToken: `DUNES-${Math.floor(1000 + Math.random() * 9000)}`,
        submittedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem("code_dunes_user", JSON.stringify(participantData));
        localStorage.setItem("dunes_participant_name", participantData.name);
        localStorage.setItem("dunes_participant_roll", participantData.roll);
      } catch (err) {
        console.warn("Storage save error:", err);
      }

      // Seamlessly navigate to Page 3 (event.html)
      window.location.href = "event.html";
    });
  }

  function loadSavedData() {
    try {
      const saved = localStorage.getItem("code_dunes_user");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.name && inputName) inputName.value = data.name;
        if (data.roll && inputRoll) inputRoll.value = data.roll;
        if (data.email && inputEmail) inputEmail.value = data.email;
        if (data.college && inputCollege) inputCollege.value = data.college;
        if (data.phone && inputPhone) inputPhone.value = data.phone;

        if (data.department) {
          const deptRadio = document.querySelector(`input[name="dept"][value="${data.department}"]`);
          if (deptRadio) deptRadio.checked = true;
        }

        if (data.year) {
          const yearRadio = document.querySelector(`input[name="year"][value="${data.year}"]`);
          if (yearRadio) yearRadio.checked = true;
        }
      }
    } catch (e) {}
  }
});
