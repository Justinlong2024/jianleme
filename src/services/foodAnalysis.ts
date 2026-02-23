export interface FoodAnalysisResult {
  foods: {
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    confidence: number;
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  healthScore: number;
  suggestion: string;
}

export async function analyzeFood(imageBase64: string): Promise<FoodAnalysisResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/analyze-food`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ imageBase64 }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: '分析失败' }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  if (result.error) throw new Error(result.error);
  if (!result.data) throw new Error('无法解析分析结果');
  return result.data;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
