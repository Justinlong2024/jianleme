

## Problem

Fasting day counter and streak days are hardcoded to `7` in multiple places. New users should start from day 1.

## Plan

### 1. Create a `daily_checkins` table in the database
- Columns: `id`, `user_id`, `date`, `meals` (jsonb), `water_records` (jsonb), `meditation_records` (jsonb), `total_water`, `total_calories`, `fasting_hours`, `created_at`
- RLS policies: users can only read/write their own records
- This lets us calculate the real streak from historical data

### 2. Create a streak calculation utility
- In `src/lib/streakCalculator.ts`, add a function that takes an array of check-in dates and calculates consecutive fasting days (counting today)
- For new users with no history, returns `1` if currently fasting, `0` otherwise

### 3. Update Index.tsx
- Replace hardcoded `dayNumber = 7` with calculated streak from check-in history
- Replace hardcoded `streakDays={7}` with the real value
- For the initial implementation (before DB persistence is ready), default to `1` instead of `7` when fasting is active

### 4. Update MediaPage.tsx
- Replace hardcoded `dayNumber: 7` with the actual streak value (passed as prop or calculated)

### Priority approach
Since the full DB persistence for daily check-ins is a larger feature, the immediate fix will:
- Change the hardcoded `7` to `1` as the default for new sessions
- Track fasting start within the current session state
- Leave a clean path for future DB-backed streak calculation

