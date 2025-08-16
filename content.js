(function () {
  let startTime = null;
  let timerInterval = null;
  let elapsed = 0;
  let topicName =
    document.querySelector("h1")?.innerText.trim() || "Unknown Topic";

  let stats = {
    [topicName]: { correct: 0, wrong: 0 },
  };

  function createDashboard() {
    const dash = document.createElement("div");
    dash.id = "indiabix-dashboard";
    dash.innerHTML = `
            <div class="dash-header">${topicName} - Tracker</div>
            <div class="dash-controls">
                <button id="start-stop-btn" title="Start">▶</button>
                <span id="time-display">00:00</span>
                <button id="reset-btn" title="Reset">🔄</button>
            </div>
            <div class="dash-report">
                <button id="report-btn" title="Show Report">📊 Report</button>
            </div>
            <div class="dash-stats">
                ✅ Correct: <span id="correct-count">0</span> | ❌ Wrong: <span id="wrong-count">0</span>
            </div>
        `;
    document.body.appendChild(dash);

    document.getElementById("start-stop-btn").onclick = toggleTimer;
    document.getElementById("reset-btn").onclick = resetTimer;
    document.getElementById("report-btn").onclick = () => showReport(topicName);
  }

  function toggleTimer() {
    const btn = document.getElementById("start-stop-btn");
    if (!timerInterval) {
      startTime = Date.now() - elapsed;
      timerInterval = setInterval(updateTimer, 1000);
      btn.textContent = "⏸";
      btn.title = "Stop";
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      btn.textContent = "▶";
      btn.title = "Start";
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsed = 0;
    updateTimerDisplay(0);
    document.getElementById("start-stop-btn").textContent = "▶";
    document.getElementById("start-stop-btn").title = "Start";
  }

  function updateTimer() {
    elapsed = Date.now() - startTime;
    updateTimerDisplay(elapsed);
  }

  function updateTimerDisplay(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    let seconds = String(totalSeconds % 60).padStart(2, "0");
    document.getElementById("time-display").innerText = `${minutes}:${seconds}`;
  }

  function trackAnswers() {
    document.body.addEventListener("click", (e) => {
      const optionCell = e.target.closest(".bix-td-option");
      if (optionCell) {
        // Wait a moment for DOM to update after click
        setTimeout(() => {
          const answerSection = optionCell.closest("table")?.nextElementSibling;
          if (
            answerSection &&
            answerSection.innerText.toLowerCase().includes("correct answer")
          ) {
            stats[topicName].correct++;
            document.getElementById("correct-count").innerText =
              stats[topicName].correct;
          } else {
            stats[topicName].wrong++;
            document.getElementById("wrong-count").innerText =
              stats[topicName].wrong;
          }
        }, 200); // small delay so IndiaBix updates DOM
      }
    });
  }

  function showReport(topic) {
    let data = stats[topic];
    let total = data.correct + data.wrong;
    let efficiency = total > 0 ? ((data.correct / total) * 100).toFixed(1) : 0;
    alert(
      `Report for ${topic}:\n✅ Correct: ${data.correct}\n❌ Wrong: ${data.wrong}\nEfficiency: ${efficiency}%`
    );
  }

  function detectTopicChange() {
    const observer = new MutationObserver(() => {
      let newTopic = document.querySelector("h1")?.innerText.trim();
      if (newTopic && newTopic !== topicName) {
        topicName = newTopic;
        if (!stats[topicName]) {
          stats[topicName] = { correct: 0, wrong: 0 };
        }
        document.querySelector(
          ".dash-header"
        ).innerText = `${topicName} - Tracker`;
        document.getElementById("correct-count").innerText =
          stats[topicName].correct;
        document.getElementById("wrong-count").innerText =
          stats[topicName].wrong;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  createDashboard();
  trackAnswers();
  detectTopicChange();
})();
