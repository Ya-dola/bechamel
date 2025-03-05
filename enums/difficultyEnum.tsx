export enum Difficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
}

export function getDifficultyText(value: number): string {
  switch (value) {
    case Difficulty.Easy:
      return 'Easy';
    case Difficulty.Medium:
      return 'Medium';
    case Difficulty.Hard:
      return 'Hard';
    default:
      return 'Unknown';
  }
}
