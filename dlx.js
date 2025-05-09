class Node {
    constructor() {
      this.left = this;
      this.right = this;
      this.up = this;
      this.down = this;
      this.column = null;
    }
  }
  
  class Column extends Node {
    constructor(name) {
      super();
      this.name = name;
      this.size = 0;
      this.column = this;
    }
  }
  
  class DLX {
    constructor(matrix) {
      this.root = new Column('root');
      this.columns = [];
      this.solution = [];
  
      const cols = matrix[0].length;
      for (let i = 0; i < cols; i++) {
        const col = new Column(i);
        this.columns.push(col);
        this.linkHorizontal(this.root.left, col);
      }
  
      for (const row of matrix) {
        let prev = null;
        for (let j = 0; j < cols; j++) {
          if (row[j] === 1) {
            const col = this.columns[j];
            const node = new Node();
            node.column = col;
            this.linkVertical(col.up, node);
            col.size++;
  
            if (prev) this.linkHorizontal(prev, node);
            prev = node;
          }
        }
      }
    }
  
    linkHorizontal(left, right) {
      right.right = left.right;
      right.left = left;
      left.right.left = right;
      left.right = right;
    }
  
    linkVertical(above, below) {
      below.down = above.down;
      below.up = above;
      above.down.up = below;
      above.down = below;
    }
  
    cover(column) {
      column.right.left = column.left;
      column.left.right = column.right;
      for (let i = column.down; i !== column; i = i.down) {
        for (let j = i.right; j !== i; j = j.right) {
          j.down.up = j.up;
          j.up.down = j.down;
          j.column.size--;
        }
      }
    }
  
    uncover(column) {
      for (let i = column.up; i !== column; i = i.up) {
        for (let j = i.left; j !== i; j = j.left) {
          j.column.size++;
          j.down.up = j;
          j.up.down = j;
        }
      }
      column.right.left = column;
      column.left.right = column;
    }
  
    search() {
      if (this.root.right === this.root) {
        return this.solution.slice();
      }
  
      // Choose column with smallest size (heuristic)
      let col = this.root.right;
      for (let j = col.right; j !== this.root; j = j.right) {
        if (j.size < col.size) col = j;
      }
  
      this.cover(col);
      for (let r = col.down; r !== col; r = r.down) {
        this.solution.push(r);
        for (let j = r.right; j !== r; j = j.right) this.cover(j.column);
  
        const result = this.search();
        if (result) return result;
  
        this.solution.pop();
        for (let j = r.left; j !== r; j = j.left) this.uncover(j.column);
      }
      this.uncover(col);
      return null;
    }
  }
  
  function parseMatrix(input) {
    return input.trim().split('\n').map(line =>
      line.trim().split(/\s+/).map(Number)
    );
  }
  
  function solve() {
    const input = document.getElementById("matrixInput").value;
    const matrix = parseMatrix(input);
    const dlx = new DLX(matrix);
    const solution = dlx.search();
  
    const output = document.getElementById("output");
    if (solution) {
      output.textContent = "Solution (row indices):\n" +
        solution.map(node => {
          let nodes = [node];
          for (let j = node.right; j !== node; j = j.right) {
            nodes.push(j);
          }
          return nodes[0].column.name;
        }).join(", ");
    } else {
      output.textContent = "No solution found.";
    }
  }

window.solve = solve;
  