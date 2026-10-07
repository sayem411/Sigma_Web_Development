const allResults = [];
let serial = 1;
let totalCredit = 0;
let totalPoint = 0;

const form = document.getElementById("courseForm");
const errorEl = document.getElementById("error");
const lastInfo = document.getElementById("lastInfo");
const resultSection = document.getElementById("resultSection");
const resultBody = document.getElementById("resultBody");

const num = (id) => parseFloat(document.getElementById(id).value);
const txt = (id) => document.getElementById(id).value.trim();

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}

function getAttendanceMarks(attendance) {
  if (attendance >= 80) return 7;
  if (attendance >= 70) return 6.2;
  if (attendance >= 60) return 6;
  if (attendance >= 50) return 5;
  if (attendance >= 41) return 4.2;
  return 0;
}

function getGrade(total) {
  if (total >= 80) return { grade: "A+", gp: 4.0 };
  if (total >= 75) return { grade: "A", gp: 3.75 };
  if (total >= 70) return { grade: "A-", gp: 3.5 };
  if (total >= 65) return { grade: "B+", gp: 3.25 };
  if (total >= 60) return { grade: "B", gp: 3.0 };
  if (total >= 55) return { grade: "B-", gp: 2.75 };
  if (total >= 50) return { grade: "C+", gp: 2.5 };
  if (total >= 45) return { grade: "C", gp: 2.25 };
  if (total >= 40) return { grade: "D", gp: 2.0 };
  return { grade: "F", gp: 0.0 };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.hidden = true;

  const name = txt("name");
  const code = txt("code");
  const credit = num("credit");
  const taken = num("taken");
  const attend = num("attend");
  const q1 = num("q1");
  const q2 = num("q2");
  const q3 = num("q3");
  const presentation = num("presentation");
  const assignment = num("assignment");
  const mid = num("mid");
  const finalMarks = num("finalMarks");

  const values = [credit, taken, attend, q1, q2, q3, presentation, assignment, mid, finalMarks];
  if (!name || !code || values.some((v) => Number.isNaN(v) || v < 0)) {
    return showError("Enter Valid Input");
  }

  // Attendance
  if (attend > taken || taken <= 0) {
    return showError("Enter Valid Input");
  }
  const attendance = Math.floor((attend / taken) * 100);
  const attMarks = getAttendanceMarks(attendance);

  // Quiz
  if (q1 > 15 || q2 > 15 || q3 > 15) {
    return showError("Enter Valid Quiz Mark");
  }
  const quiz = Math.trunc((q1 + q2 + q3) / 3) + 1;

  // Other marks
  if (presentation > 8 || assignment > 5 || mid > 25 || finalMarks > 40) {
    return showError("Enter Valid Marks");
  }

  const total = mid + finalMarks + assignment + presentation + quiz + attMarks;
  const { grade, gp } = getGrade(total);

  lastInfo.innerHTML =
    `<h2>${escapeHtml(name)} (${escapeHtml(code)})</h2>` +
    `<p>Attendance is ${attendance} %</p>` +
    `<p>Quiz Average: ${quiz}</p>` +
    `<p>Total: ${Math.round(total * 100) / 100}</p>` +
    `<p>Grade: <strong>${grade}</strong> (${gp.toFixed(2)})</p>`;
  lastInfo.hidden = false;

  allResults.push({ serial, code, name, credit, grade, gp });
  totalCredit += credit;
  totalPoint += credit * gp;

  serial++;
  form.reset();
  document.getElementById("courseHeading").textContent = "Course " + serial;
  document.getElementById("name").focus();
});

document.getElementById("resultBtn").addEventListener("click", () => {
  if (allResults.length === 0) {
    return showError("Age kono course add koro");
  }
  errorEl.hidden = true;

  resultBody.innerHTML = allResults
    .map(
      (r) =>
        `<tr><td>${r.serial}</td><td>${escapeHtml(r.code)}</td><td>${escapeHtml(r.name)}</td>` +
        `<td>${r.credit.toFixed(2)}</td><td>${r.grade}</td><td>${r.gp.toFixed(2)}</td></tr>`
    )
    .join("");

  document.getElementById("totalCredit").textContent = totalCredit;
  const gpa = totalCredit === 0 ? 0 : totalPoint / totalCredit;
  document.getElementById("gpa").textContent = gpa.toFixed(2);

  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  allResults.length = 0;
  serial = 1;
  totalCredit = 0;
  totalPoint = 0;
  resultSection.hidden = true;
  lastInfo.hidden = true;
  form.reset();
  document.getElementById("courseHeading").textContent = "Course 1";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
