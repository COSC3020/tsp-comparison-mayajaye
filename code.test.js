//Maya Conway
//code.test.js
//TSP Comparison
//5-8-25

const fs = require('fs');
eval(fs.readFileSync('code.js')+'');

function randomDistanceMatrix(nodes) {
      let mat = [];
      if (nodes == 0) return mat;
      for(let i = 0; i < nodes; i++) {
            mat[i] = [];
            for(let j = 0; j < nodes; j++) {
                  //distance from a city to itself is 0
                  if (i == j) mat[i][j] = 0;

                  //the graph is undirected
                  else if (j < i) {
                        mat[i][j] = mat[j][i];
                  } else { //random entries from 1-9
                        mat[i][j] = Math.floor(Math.random() * 9) + 1;
                  }
            }
      }
      return mat;
}


function printMatrix(matrix, name) {
      console.log(`${name}:`);
      for (let row of matrix) {
            console.log(row.map(n => n.toString().padStart(2, ' ')).join(' '));
      }
      console.log();
}

//to make sure the matrices are being generated correctly
printMatrix(randomDistanceMatrix(0), "dm1");
printMatrix(randomDistanceMatrix(3), "dm2");
printMatrix(randomDistanceMatrix(10), "dm3");
printMatrix(randomDistanceMatrix(20), "dm4");


const inputSizes = [0, 3, 10, 20, 50, 200, 400, 800, 1200, 1600, 2000, 2500, 3000, 4000, 5000, 6500];
let lsTimes = [];
let lsDists = [];
let hkTimes = [];
let hkDists = [];

for (let n of inputSizes) {
    const mat = randomDistanceMatrix(n);

    //run ls and store its time and distance
    const t0_ls = performance.now();
    let dist_ls = tsp_ls(mat);
    const t1_ls = performance.now();
    let time = ((t1_ls - t0_ls) / 1000).toFixed(5);
    console.log("LS Finished in time: ", time, " seconds");
    lsDists.push(dist_ls);
    lsTimes.push(time); //convert to seconds

    //hk crashes for input sizes over 20, so fill the arrays with null after that point
    if (n <= 20) {
        const t0_hk = performance.now();
        let dist_hk = tsp_hk(mat);
        const t1_hk = performance.now();
        let time = ((t1_hk - t0_hk) / 1000).toFixed(5);
        console.log("HK Finished in time: ", time, " seconds\n");
        hkDists.push(dist_hk);
        hkTimes.push(time);
    } else {
        console.log("HK: range error\n");
        hkDists.push(null);
        hkTimes.push(null);
    }
}

//store results
fs.writeFileSync("results.json", JSON.stringify({
      inputSizes, lsTimes, lsDists, hkTimes, hkDists
  }, null, 2));
  


