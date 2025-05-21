// grid.js
export async function loadDictionary(url) {
    const response = await fetch(url);
    const text = await response.text();
    const words = text.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(Boolean);
    return buildTrie(words);
  }
  
  function buildTrie(words) {
    const root = {};
    for (const word of words) {
      let node = root;
      for (const char of word) {
        node[char] = node[char] || {};
        node = node[char];
      }
      node.isWord = true;
    }
    return root;
  }
  
  function hasPrefix(trie, prefix) {
    let node = trie;
    for (const char of prefix) {
      if (!node[char]) return false;
      node = node[char];
    }
    return true;
  }
  
  function isWord(trie, word) {
    let node = trie;
    for (const char of word) {
      if (!node[char]) return false;
      node = node[char];
    }
    return !!node.isWord;
  }
  
  function findWordsInGrid(grid, trie) {
    const rows = grid.length;
    const cols = grid[0].length;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0],  [1, 1]
    ];
  
    const found = {};
  
    function dfs(x, y, path, positions, visited) {
      const char = grid[x][y].toLowerCase();
      const newPath = path + char;
      const pos = x * cols + y + 1;
      const newPositions = [...positions, pos];
  
      if (!hasPrefix(trie, newPath)) return;
      if (isWord(trie, newPath) && newPath.length > 3) {
        found[newPath] = newPositions;
      }
  
      visited[x][y] = true;
  
      for (const [dx, dy] of directions) {
        const nx = x + dx, ny = y + dy;
        if (
          nx >= 0 && nx < rows &&
          ny >= 0 && ny < cols &&
          !visited[nx][ny]
        ) {
          dfs(nx, ny, newPath, newPositions, visited.map(r => [...r]));
        }
      }
  
      visited[x][y] = false;
    }
  
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        dfs(i, j, "", [], visited);
      }
    }
  
    return found;
  }
  
  function formatDLX(foundWords, gridRows, gridCols) {
    const sets = Object.values(foundWords)
      .map(path => `{${path.join(",")}}`);
    const total = gridRows * gridCols;
    const allIndexes = Array.from({ length: total }, (_, i) => i + 1);
    return `{${sets.join(",")} : ${allIndexes.join(",")}}`;
  }
  
  function extractGridFromUI() {
    const table = document.querySelector("#letterGridContainer table");
    const rows = Array.from(table.rows);
    return rows.map(row =>
      Array.from(row.cells).map(cell =>
        cell.querySelector("input").value || " "
      )
    );
  }

  function buildBinaryMatrix(foundWords, gridRows, gridCols) {
    const totalCells = gridRows * gridCols;
    const words = Object.keys(foundWords);
  
    // Create matrix: rows = words, cols = cells
    // Initialize with 0s
    const matrix = words.map(word => {
      const pathSet = new Set(foundWords[word]);
      // For each cell index from 1 to totalCells
      return Array.from({ length: totalCells }, (_, idx) => pathSet.has(idx + 1) ? 1 : 0);
    });
  
    return { matrix, words };
  }
  
  // Optional: Format matrix as a string for textarea output
  function matrixToString(matrix) {
    return matrix.map(row => row.join(' ')).join('\n');
  }
  
  // Use inside your convertGridToDLX or a separate function
  export async function generateBinaryMatrix() {
    const grid = extractGridFromUI();
    const trie = await loadDictionary('words_alpha.txt');
    const foundWords = findWordsInGrid(grid, trie);
    const { matrix, words } = buildBinaryMatrix(foundWords, grid.length, grid[0].length);
  
    // Show matrix as string in textarea for your DLX solver input
    document.getElementById("matrixInput").value = matrixToString(matrix);
  
    console.log("Words found:", words);
    console.log("Binary matrix:\n", matrixToString(matrix));
  }
  
  
  export async function convertGridToDLX() {
    const grid = extractGridFromUI();
    const trie = await loadDictionary('words_alpha.txt');
    const foundWords = findWordsInGrid(grid, trie);
    const dlxFormat = formatDLX(foundWords, grid.length, grid[0].length);
  
    document.getElementById("matrixInput").value = dlxFormat;
    console.log("DLX Matrix Generated:\n", dlxFormat);
  }
  