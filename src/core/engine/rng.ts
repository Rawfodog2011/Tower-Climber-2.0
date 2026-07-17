/**
 * Centralized RNG system for the engine.
 * Allows using a seeded pseudo-random number generator for tests, 
 * or Math.random() for production.
 */

let currentSeed = Date.now();

// Um LCG (Linear Congruential Generator) simples para seed
function lcg(seed: number) {
  return function() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

let rngFunc = () => Math.random();

export function createSeededRandom(seed: number) {
  currentSeed = seed;
  rngFunc = lcg(seed);
}

export function resetRngToSystem() {
  rngFunc = () => Math.random();
}

/**
 * Returns a random number between 0 (inclusive) and 1 (exclusive).
 * Replaces Math.random() usage across the core engine.
 */
export function random(): number {
  return rngFunc();
}
