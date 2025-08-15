(function () {
  let startTime = null;
  let timerInterval = null;
  let elapsed = 0;
  let topicName =
    document.querySelector("h1")?.innerText.trim() || "Unknown Topic";

  let stats = {
    [topicName]: { total: 0, correct: 0, attempts: 0 },
  };

  function createDashboard() {
    const dash = document.createElement("div");
    dash.id = "indiabix-dashboard";
    dash.innerHTML = `
            <div class="dash-header">${topicName} - Tracker</div>
            <div class="dash-timer">⏱ <span id="time-display">00:00</span></div>
            <div class="dash-controls">
                <button id="start-btn">Start</button>
                <button id="stop-btn">Stop</button>
                <button id="reset-btn">Reset</button>
            </div>
            <div class="dash-stats">Attempts: <span id="attempts-count">0</span> | Correct: <span id="correct-count">0</span></div>
        `;
    document.body.appendChild(dash);

    document.getElementById("start-btn").onclick = startTimer;
    document.getElementById("stop-btn").onclick = stopTimer;
    document.getElementById("reset-btn").onclick = resetTimer;
  }

  function startTimer() {
    if (!timerInterval) {
      startTime = Date.now() - elapsed;
      timerInterval = setInterval(updateTimer, 1000);
    }
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    stopTimer();
    elapsed = 0;
    updateTimerDisplay(0);
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

  function trackAttempts() {
    document.body.addEventListener("click", (e) => {
      const optionCell = e.target.closest(".bix-td-option");
      if (optionCell) {
        const questionId = optionCell.id.split("_").pop(); // e.g., "239"

        // Count attempt
        stats[topicName].attempts++;
        document.getElementById("attempts-count").innerText =
          stats[topicName].attempts;

        // Check correctness (IndiaBix marks correct answer with an image named 'correct.gif')
        if (optionCell.innerHTML.includes("correct.gif")) {
          stats[topicName].correct++;
          document.getElementById("correct-count").innerText =
            stats[topicName].correct;
        }
      }
    });
  }

  function detectTopicChange() {
    const observer = new MutationObserver(() => {
      let newTopic = document.querySelector("h1")?.innerText.trim();
      if (newTopic && newTopic !== topicName) {
        showReport(topicName);
        topicName = newTopic;
        if (!stats[topicName]) {
          stats[topicName] = { total: 0, correct: 0, attempts: 0 };
        }
        document.querySelector(
          ".dash-header"
        ).innerText = `${topicName} - Tracker`;
        document.getElementById("attempts-count").innerText =
          stats[topicName].attempts;
        document.getElementById("correct-count").innerText =
          stats[topicName].correct;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function showReport(oldTopic) {
    let data = stats[oldTopic];
    let efficiency =
      data.attempts > 0 ? ((data.correct / data.attempts) * 100).toFixed(1) : 0;
    alert(
      `Report for ${oldTopic}:\nCorrect: ${data.correct}\nAttempts: ${data.attempts}\nEfficiency: ${efficiency}%`
    );
  }

  createDashboard();
  trackAttempts();
  detectTopicChange();
})();
