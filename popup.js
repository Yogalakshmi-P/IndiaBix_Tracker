chrome.storage.local.get(["records"], (data) => {
  const records = data.records || [];

  const total = records.length;
  const correctCount = records.filter((r) => r.correct).length;
  const avgTime =
    total > 0
      ? (records.reduce((sum, r) => sum + r.time, 0) / total).toFixed(2)
      : 0;
  const accuracy = total > 0 ? ((correctCount / total) * 100).toFixed(1) : 0;

  document.getElementById("total").textContent = total;
  document.getElementById("correct").textContent = correctCount;
  document.getElementById("accuracy").textContent = accuracy;
  document.getElementById("avgtime").textContent = avgTime;
});
