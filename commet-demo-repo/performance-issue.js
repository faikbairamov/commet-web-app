// Performance issues
function inefficientLoop() {
  const data = [];
  for (let i = 0; i < 1000000; i++) {
    data.push(i * Math.random()); // Inefficient memory usage
  }
  return data;
}

// Memory leak
let globalData = [];
function addToGlobal(data) {
  globalData.push(data); // Never cleared - memory leak
}

// Blocking operation
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // Block for 5 seconds
  }
}
