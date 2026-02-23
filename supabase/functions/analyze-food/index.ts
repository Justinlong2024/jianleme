import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "缺少图片数据" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `你是一个专业的营养分析师。用户会发送餐食照片，你需要：
1. 识别图片中的所有食物
2. 估算每种食物的份量和营养成分（卡路里、蛋白质、碳水化合物、脂肪）
3. 给出总热量和健康评分（0-100）
4. 提供简短的饮食建议

你必须使用以下工具返回结构化数据。份量用中文描述（如"1碗"、"1份"），食物名称用中文。`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
              { type: "text", text: "请分析这张餐食照片中的食物和营养成分。" },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_food",
              description: "返回餐食的营养分析结果",
              parameters: {
                type: "object",
                properties: {
                  foods: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "食物名称（中文）" },
                        portion: { type: "string", description: "份量描述（如1碗、1份）" },
                        calories: { type: "number", description: "卡路里(kcal)" },
                        protein: { type: "number", description: "蛋白质(g)" },
                        carbs: { type: "number", description: "碳水化合物(g)" },
                        fat: { type: "number", description: "脂肪(g)" },
                        confidence: { type: "number", description: "识别置信度(0-1)" },
                      },
                      required: ["name", "portion", "calories", "protein", "carbs", "fat", "confidence"],
                      additionalProperties: false,
                    },
                  },
                  totalCalories: { type: "number" },
                  totalProtein: { type: "number" },
                  totalCarbs: { type: "number" },
                  totalFat: { type: "number" },
                  healthScore: { type: "number", description: "健康评分(0-100)" },
                  suggestion: { type: "string", description: "简短饮食建议" },
                },
                required: ["foods", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "healthScore", "suggestion"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_food" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "请求过于频繁，请稍后再试" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI 额度已用完，请充值" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI 分析失败" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify({ data: analysis }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: try to parse from content
    const content = result.choices?.[0]?.message?.content;
    return new Response(
      JSON.stringify({ data: null, raw: content, error: "无法解析分析结果" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("analyze-food error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "未知错误" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
