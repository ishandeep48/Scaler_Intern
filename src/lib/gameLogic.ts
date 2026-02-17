/**
 * Calculates the next state of the user based on their answer correctness.
 * Implements the "Stabilizer" algorithm to prevent difficulty ping-ponging.
 *
 * @param currentDifficulty - Current difficulty level (1-10)
 * @param currentMomentum - Current momentum counter
 * @param isCorrect - Whether the answer was correct
 * @param currentStreak - Current win streak
 * @returns Object containing new difficulty, momentum, score delta, and new streak
 */
export function calculateNextState(
    currentDifficulty: number,
    currentMomentum: number,
    isCorrect: boolean,
    currentStreak: number
) {
    let newDifficulty = currentDifficulty;
    let newMomentum = currentMomentum;
    let newStreak = isCorrect ? currentStreak + 1 : 0;
    let scoreDelta = 0;

    if (isCorrect) {
        // Increment momentum
        newMomentum++;

        // Check if momentum threshold reached to increase difficulty
        if (newMomentum >= 2) {
            newDifficulty = Math.min(currentDifficulty + 1, 10);
            newMomentum = 0; // Reset momentum after difficulty increase
        }
        // Else: difficulty stays same, momentum keeps building

        // Calculate Score
        const baseScore = currentDifficulty * 10;
        // Multiplier: 1 + (streak * 0.1), capped at 2.5x
        const multiplier = Math.min(1 + (currentStreak * 0.1), 2.5);
        scoreDelta = Math.floor(baseScore * multiplier);

    } else {
        // Wrong answer: Immediate drop
        newDifficulty = Math.max(currentDifficulty - 1, 1);
        newMomentum = 0; // Reset momentum
        scoreDelta = 0;
    }

    return {
        newDifficulty,
        newMomentum,
        newStreak,
        scoreDelta,
    };
}
