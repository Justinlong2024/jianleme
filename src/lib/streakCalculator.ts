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
/**
 * Get local date string in YYYY-MM-DD format (avoids UTC timezone shift)
 */
function getLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateFastingStreak(
  history: CheckInRecord[],
  todayIsFasting: boolean
): number {
  if (!todayIsFasting) return 0;

  // Sort by date descending
  const sorted = [...history]
    .sort((a, b) => b.date.localeCompare(a.date));

  let streak = 1; // Today counts as day 1
  const now = new Date();

  // Walk backward from yesterday
  for (let i = 1; i <= sorted.length; i++) {
    const checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = getLocalDateStr(checkDate);

    const record = sorted.find(r => r.date === dateStr);
    if (!record) break; // No record for this day = streak broken

    const isMealFasting = (meal?: { isFasting?: boolean; foodItems?: any[] }) =>
      meal?.isFasting && (!meal.foodItems || meal.foodItems.length === 0);

    const hasFasting = [
      isMealFasting(record.meals?.breakfast as any),
      isMealFasting(record.meals?.lunch as any),
      isMealFasting(record.meals?.dinner as any),
    ].some(Boolean);

    if (hasFasting) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
