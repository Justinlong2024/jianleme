/**
 * Calculate consecutive fasting streak days from check-in history.
 * A "fasting day" is a day where at least one meal is marked as fasting.
 * The streak counts backward from today — if today is fasting, it's day 1+.
 */

interface CheckInRecord {
  date: string; // YYYY-MM-DD
  meals: {
    breakfast?: { isFasting?: boolean };
    lunch?: { isFasting?: boolean };
    dinner?: { isFasting?: boolean };
  };
}

/**
 * Returns the number of consecutive fasting days ending today.
 * If today has fasting, returns at least 1.
 * If no history exists but currently fasting, returns 1.
 */
export function calculateFastingStreak(
  history: CheckInRecord[],
  todayIsFasting: boolean
): number {
  if (!todayIsFasting) return 0;

  // Sort by date descending
  const sorted = [...history]
    .sort((a, b) => b.date.localeCompare(a.date));

  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  const currentDate = new Date();

  // Walk backward from today
  for (let i = 0; i <= sorted.length; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];

    if (i === 0) {
      // Today — we already know it's fasting from the param
      streak++;
      continue;
    }

    const record = sorted.find(r => r.date === dateStr);
    if (!record) break; // No record for this day = streak broken

    const hasFasting = [
      record.meals?.breakfast?.isFasting,
      record.meals?.lunch?.isFasting,
      record.meals?.dinner?.isFasting,
    ].some(Boolean);

    if (hasFasting) {
      streak++;
    } else {
      break;
    }
  }

  return Math.max(streak, 1); // At least 1 if today is fasting
}
