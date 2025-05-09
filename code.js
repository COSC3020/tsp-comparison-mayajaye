//Maya Conway
//code.js
//TSP Comparison
//5-8-25

// TSP Local Search
function tsp_ls(distance_matrix) {
    const t0 = performance.now(); //start timer
    let n = distance_matrix.length;
    let route = [];
    for (let i = 0; i < n; i++) route.push(i);

    //get the random start route
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        swap(route, i, j);
    }

    let distance = findDistance(distance_matrix, route); //get its distance

    //if no better distance is found, that means we have done all possible 2 opt swaps, so we return the shortest found distance
    let newDistance;
    do {
        newDistance = ls(distance_matrix, route, distance);
        if (newDistance < distance) {
            distance = newDistance;
        }
    }
    while (newDistance < distance);

    return distance;

}

function ls(distance_matrix, route, distance) {
    let n = route.length;

    //i should be less than k so we can work on what is in between them,
    //k should be >= i + 2 so we are swapping more than 2 cities
    for (let i = 0; i < n - 2; i++) {
        for (let k = i + 2; k < n; k++) {
            let newRoute = twoOptSwap(route, i, k);
            let newDistance = findDistance(distance_matrix, newRoute);

            //only swap if a better distance is found so that previous iterations aren't undone
            if (newDistance < distance) {
                for (let j = 0; j < n; j++) route[j] = newRoute[j];
                distance = newDistance;
            }
        }
    }
    return distance;
}

function swap(arr, i, j) {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function twoOptSwap(route, i, k) {
    let routeCopy = route.slice();
    while (i < k) {
        // cities from 1 to i-1 and k+1 to n stay the same, cities i to k are reversed
        swap(routeCopy, i, k);
        i++; k--;
    }
    return routeCopy;
}

function findDistance(distance_matrix, route) {
    let distance = 0;
    for (let j = 0; j < route.length - 1; j++) {
        //add all edges of the route up
        distance += distance_matrix[route[j]][route[j + 1]];
    }
    return distance;
}


//TSP Held-Karp
function tsp_hk(distance_matrix) {
    const t0 = performance.now();
    let n = distance_matrix.length;
    let minCost = Infinity;
    let cities = [];
    let cache = new Map(); //create a map for memoization for all start cities

    if (n <= 1) return 0;

    for (let i = 0; i < n; i++) cities.push(i); //create the list of cities
    for (let start = 0; start < n; start++) { //get the minimum cost out of all the start cities
        minCost = Math.min(minCost, heldKarp(cities, start, distance_matrix, cache));
    }

    return minCost;

}    

function heldKarp(cities, start, distance_matrix, cache) {
    let sortedCities = cities.slice();
    sortedCities.sort(function(a, b) {return a - b;}); //sort the subsets for if the cities are the same set in a different order
    let key = sortedCities.join('|') + '|' + start; //initialize the key for the subset of cities and the current start city
    if (cache.has(key)) return cache.get(key); //returned cached result of this level if it exists

    if (cities.length == 2) {
        //return length of tour that starts at start, goes directly to other city in cities
        //either 0 -> 1 or 1 -> 0
        let other;
        if (cities.indexOf(start) == 0) other = cities[1];
        else other = cities[0];

        cache.set(key, distance_matrix[start][other]); //store the result in the cache
        return distance_matrix[start][other]; 
    }

    let minCost = Infinity;
    let cost = 0;
    for (let city of cities) {
        if (city == start) continue;
        let minusStart = cities.slice(); //copy the cities list
        let index = cities.indexOf(start);
        if (index > -1) minusStart.splice(index, 1); //remove the start city

        //reduce the set of cities that are unvisited by one  (the old start)
        cost = heldKarp(minusStart, city, distance_matrix, cache) + distance_matrix[start][city];
        if (cost < minCost) minCost = cost; //compare the results of each recursive call to find the minimum cost
    }

    cache.set(key, minCost); //store the minimum cost from this level in the map
    return minCost;
}