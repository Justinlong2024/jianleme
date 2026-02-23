import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { analyzeFood, fileToBase64, FoodAnalysisResult } from '@/services/foodAnalysis';
import { toast } from '@/hooks/use-toast';

interface FoodAnalyzerProps {
  onAnalysisComplete?: (result: FoodAnalysisResult) => void;
  onClose: () => void;
}

const FoodAnalyzer = ({ onAnalysisComplete, onClose }: FoodAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setResult(null);

    // Analyze
    setIsAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      const analysis = await analyzeFood(base64);
      setResult(analysis);
      onAnalysisComplete?.(analysis);
    } catch (err) {
      toast({
        title: '分析失败',
        description: err instanceof Error ? err.message : '请重试',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <h2 className="font-bold text-foreground">AI 餐食分析</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Upload area */}
          {!preview && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-border 
                         flex flex-col items-center justify-center gap-3 hover:border-primary 
                         hover:bg-primary/5 transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">拍照或选择照片</p>
                <p className="text-xs text-muted-foreground mt-1">AI 将自动识别食物和营养成分</p>
              </div>
            </motion.button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Preview */}
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="餐食照片"
                className="w-full aspect-[4/3] object-cover rounded-2xl"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-foreground/40 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <Loader2 size={32} className="text-card animate-spin" />
                  <p className="text-sm text-card font-medium">AI 正在分析中...</p>
                </div>
              )}
              {!isAnalyzing && !result && (
                <button
                  onClick={() => { setPreview(null); fileInputRef.current?.click(); }}
                  className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm rounded-full p-2"
                >
                  <X size={16} className="text-foreground" />
                </button>
              )}
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Health score + totals */}
                <div className="wabi-card flex items-center gap-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(result.healthScore)}`}>
                      {result.healthScore}
                    </div>
                    <div className="text-[10px] text-muted-foreground">健康评分</div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">{result.totalCalories}</div>
                      <div className="text-[10px] text-muted-foreground">千卡</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">{result.totalProtein}g</div>
                      <div className="text-[10px] text-muted-foreground">蛋白质</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">{result.totalCarbs}g</div>
                      <div className="text-[10px] text-muted-foreground">碳水</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">{result.totalFat}g</div>
                      <div className="text-[10px] text-muted-foreground">脂肪</div>
                    </div>
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="bg-primary/5 rounded-xl p-3">
                  <p className="text-xs text-foreground leading-relaxed">
                    <Sparkles size={12} className="text-primary inline mr-1" />
                    {result.suggestion}
                  </p>
                </div>

                {/* Food details toggle */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between px-1 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>食物详情（{result.foods.length} 项）</span>
                  {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-2"
                    >
                      {result.foods.map((food, i) => (
                        <div key={i} className="bg-muted rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-foreground">{food.name}</span>
                            <span className="text-xs text-muted-foreground">{food.portion}</span>
                          </div>
                          <div className="flex gap-3 text-[10px] text-muted-foreground">
                            <span>{food.calories} kcal</span>
                            <span>蛋白 {food.protein}g</span>
                            <span>碳水 {food.carbs}g</span>
                            <span>脂肪 {food.fat}g</span>
                          </div>
                          <div className="mt-1 h-1 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${food.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => { setPreview(null); setResult(null); }}
                    className="flex-1 h-11 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-all"
                  >
                    重新拍照
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                  >
                    确认保存
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FoodAnalyzer;
