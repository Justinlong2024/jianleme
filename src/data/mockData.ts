import { DailyCheckIn, HealthRecord } from '@/types';

// Generate mock weight data for last 30 days
export function generateMockWeightData(): HealthRecord[] {
  const data: HealthRecord[] = [];
  const today = new Date();
  let weight = 75.0;

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    weight = Math.max(71, weight - (Math.random() * 0.3 - 0.05));
    data.push({
      id: `w-${i}`,
      date: date.toISOString().split('T')[0],
      weight: parseFloat(weight.toFixed(1)),
      bodyFat: parseFloat((weight * 0.25 - Math.random() * 2).toFixed(1)),
      waistCircumference: parseFloat((85 - i * 0.1 + Math.random() * 1).toFixed(1)),
      bloodSugar: parseFloat((4.5 + Math.random() * 1.5).toFixed(1)),
      bloodPressureSystolic: Math.round(115 + Math.random() * 15),
      bloodPressureDiastolic: Math.round(70 + Math.random() * 15),
    });
  }
  return data;
}

export function getTodayCheckIn(): DailyCheckIn {
  return {
    date: new Date().toISOString().split('T')[0],
    meals: {
      breakfast: { mealType: 'breakfast', isFasting: true },
      lunch: { mealType: 'lunch', isFasting: false, foodItems: [
        { name: '糙米饭', calories: 180, protein: 4, carbs: 38, fat: 1.5, portion: '1碗' },
        { name: '清蒸鲈鱼', calories: 150, protein: 25, carbs: 0, fat: 5, portion: '1份' },
        { name: '炒青菜', calories: 50, protein: 2, carbs: 5, fat: 3, portion: '1盘' },
      ]},
      dinner: { mealType: 'dinner', isFasting: true },
    },
    waterRecords: [
      { id: 'w1', timestamp: '08:00', amount: 300, waterType: 'purified' },
      { id: 'w2', timestamp: '10:30', amount: 250, waterType: 'tea' },
      { id: 'w3', timestamp: '14:00', amount: 500, waterType: 'purified' },
      { id: 'w4', timestamp: '16:30', amount: 300, waterType: 'purified' },
    ],
    meditationRecords: [
      { id: 'm1', timestamp: '06:30', duration: 22, type: 'dongyin', mood: 'calm' },
    ],
    totalWater: 1350,
    totalCalories: 380,
    fastingHours: 16,
  };
}
