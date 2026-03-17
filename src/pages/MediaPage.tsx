import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaRecord, VIDEO_TEMPLATES } from '@/types';
import { generateMockMedia } from '@/data/mockMedia';
import {
  Camera, Video, Image, Film, Check, X, Play, Clock,
  Wand2, ChevronRight, Plus, Calendar, Tag,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'gallery' | 'capture' | 'edit';
type MediaFilter = 'all' | 'photo' | 'video';

const MediaPage = () => {
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [editStep, setEditStep] = useState<'select' | 'template' | 'processing' | 'done'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('wabisabi');
  const [progress, setProgress] = useState(0);
  const [previewItem, setPreviewItem] = useState<MediaRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Post composer state
  const [showComposer, setShowComposer] = useState(false);
  const [composerPreview, setComposerPreview] = useState<string | null>(null);
  const [composerFile, setComposerFile] = useState<File | null>(null);
  const [composerText, setComposerText] = useState('');
  const [composerMediaType, setComposerMediaType] = useState<'photo' | 'video'>('photo');

  const filtered = media.filter((m) =>
    filter === 'all' ? true : m.mediaType === filter
  );

  const photoCount = media.filter((m) => m.mediaType === 'photo').length;
  const videoCount = media.filter((m) => m.mediaType === 'video').length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEdit = () => {
    if (selectedIds.size < 2) {
      toast({ title: '请至少选择 2 张照片/视频', variant: 'destructive' });
      return;
    }
    setViewMode('edit');
    setEditStep('template');
  };

  const simulateProcessing = () => {
    setEditStep('processing');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setEditStep('done');
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 200);
  };

  const resetEdit = () => {
    setViewMode('gallery');
    setIsSelecting(false);
    setSelectedIds(new Set());
    setEditStep('select');
    setProgress(0);
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-foreground font-serif">
          {viewMode === 'edit' ? '一键编辑' : '照片 · 视频'}
        </h1>
        {viewMode === 'gallery' && (
          <div className="flex gap-2">
            {isSelecting ? (
              <>
                <button
                  onClick={startEdit}
                  className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium"
                >
                  <Wand2 size={12} className="inline mr-1" />
                  一键编辑 ({selectedIds.size})
                </button>
                <button
                  onClick={() => { setIsSelecting(false); setSelectedIds(new Set()); }}
                  className="text-xs text-muted-foreground px-2 py-1.5"
                >
                  取消
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSelecting(true)}
                className="text-xs text-primary font-medium px-2 py-1.5"
              >
                选择
              </button>
            )}
          </div>
        )}
        {viewMode === 'edit' && (
          <button onClick={resetEdit} className="text-muted-foreground">
            <X size={20} />
          </button>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        {viewMode === 'edit' ? '选择模板生成对比视频' : '记录身体变化，见证蜕变之旅'}
      </p>

      {/* Gallery Mode */}
      {viewMode === 'gallery' && (
        <>
          {/* Quick capture buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => fileInputRef.current?.click()}
              className="wabi-card flex items-center gap-3 !p-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Camera size={20} className="text-primary" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">拍照打卡</div>
                <div className="text-[10px] text-muted-foreground">半身/全身照</div>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => videoInputRef.current?.click()}
              className="wabi-card flex items-center gap-3 !p-4"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Video size={20} className="text-secondary" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">录制视频</div>
                <div className="text-[10px] text-muted-foreground">30秒以内</div>
              </div>
            </motion.button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setComposerFile(file);
            setComposerPreview(URL.createObjectURL(file));
            setComposerMediaType('photo');
            setComposerText('');
            setShowComposer(true);
            e.target.value = '';
          }} />
          <input ref={videoInputRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setComposerFile(file);
            setComposerPreview(URL.createObjectURL(file));
            setComposerMediaType('video');
            setComposerText('');
            setShowComposer(true);
            e.target.value = '';
          }} />

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {([
              { key: 'all' as MediaFilter, label: `全部 ${media.length}`, icon: Image },
              { key: 'photo' as MediaFilter, label: `照片 ${photoCount}`, icon: Camera },
              { key: 'video' as MediaFilter, label: `视频 ${videoCount}`, icon: Film },
            ]).map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon size={12} />
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Photo/Video Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => {
                    if (isSelecting) toggleSelect(item.id);
                    else setPreviewItem(item);
                  }}
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.tags.join(', ')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Video badge */}
                  {item.mediaType === 'video' && (
                    <div className="absolute bottom-1 left-1 bg-foreground/60 text-card text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <Play size={8} fill="currentColor" />
                      {item.duration}s
                    </div>
                  )}
                  {/* Day tag */}
                  {item.relatedData?.dayNumber && (
                    <div className="absolute top-1 left-1 bg-card/80 backdrop-blur-sm text-foreground text-[9px] px-1.5 py-0.5 rounded-md">
                      第{item.relatedData.dayNumber}天
                    </div>
                  )}
                  {/* Weight badge */}
                  {item.relatedData?.weight && (
                    <div className="absolute top-1 right-1 bg-primary/80 text-primary-foreground text-[9px] px-1.5 py-0.5 rounded-md">
                      {item.relatedData.weight.toFixed(1)}kg
                    </div>
                  )}
                  {/* Selection overlay */}
                  {isSelecting && (
                    <div className={`absolute inset-0 flex items-center justify-center transition-all ${
                      selectedIds.has(item.id) ? 'bg-primary/30' : 'bg-foreground/10'
                    }`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedIds.has(item.id)
                          ? 'bg-primary border-primary'
                          : 'border-card bg-card/50'
                      }`}>
                        {selectedIds.has(item.id) && <Check size={14} className="text-primary-foreground" />}
                      </div>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="wabi-card py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Image size={22} />
              </div>
              <h3 className="text-base font-semibold text-foreground">还没有任何记录</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                点击上方“拍照打卡”或“录制视频”，开始你的第一条照片记录。
              </p>
            </div>
          )}

          {/* One-click edit CTA */}
          {!isSelecting && media.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSelecting(true)}
              className="w-full mt-5 wabi-card flex items-center justify-center gap-2 !py-4 hover:border-primary/30 transition-all"
            >
              <Wand2 size={18} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">一键生成对比视频</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </motion.button>
          )}
        </>
      )}

      {/* Edit Mode */}
      {viewMode === 'edit' && (
        <div className="space-y-4">
          {/* Template selection */}
          {editStep === 'template' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm text-muted-foreground mb-3">
                已选择 {selectedIds.size} 个素材，请选择视频模板：
              </p>
              <div className="space-y-2">
                {Object.entries(VIDEO_TEMPLATES).map(([key, tmpl]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full wabi-card flex items-center gap-3 !p-4 transition-all ${
                      selectedTemplate === key ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedTemplate === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Film size={18} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-semibold text-foreground">{tmpl.label}风格</div>
                      <div className="text-[10px] text-muted-foreground">{tmpl.description}</div>
                    </div>
                    {selectedTemplate === key && <Check size={18} className="text-primary" />}
                  </button>
                ))}
              </div>
              <button
                onClick={simulateProcessing}
                className="w-full mt-4 h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
              >
                开始生成
              </button>
            </motion.div>
          )}

          {/* Processing */}
          {editStep === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <Wand2 size={32} className="text-primary animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-2">正在生成对比视频...</p>
              <p className="text-xs text-muted-foreground mb-4">
                {selectedIds.size} 个素材 · {VIDEO_TEMPLATES[selectedTemplate]?.label}风格
              </p>
              <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{Math.min(Math.round(progress), 100)}%</p>
            </motion.div>
          )}

          {/* Done */}
          {editStep === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12"
            >
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-5">
                <Check size={32} className="text-success" />
              </div>
              <p className="text-lg font-bold text-foreground mb-1">视频生成完成！</p>
              <p className="text-sm text-muted-foreground mb-6">
                {selectedIds.size} 张照片/视频已编辑为对比视频
              </p>

              {/* Mock video preview */}
              <div className="w-full aspect-[9/16] max-w-[240px] bg-muted rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/result/240/426`}
                  alt="生成的视频"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-card/80 flex items-center justify-center">
                    <Play size={20} className="text-foreground ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-card/80 backdrop-blur-sm rounded-lg p-2 text-center">
                  <p className="text-[10px] text-foreground font-medium">我的蜕变之旅</p>
                  <p className="text-[9px] text-muted-foreground">{selectedIds.size} 天记录 · {VIDEO_TEMPLATES[selectedTemplate]?.label}风格</p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    toast({ title: '已保存到相册 📱' });
                  }}
                  className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                >
                  保存视频
                </button>
                <button
                  onClick={resetEdit}
                  className="flex-1 h-11 rounded-xl bg-muted text-muted-foreground text-sm font-medium"
                >
                  返回
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-sm w-full bg-card rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewItem.url || previewItem.thumbnailUrl}
                alt=""
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{previewItem.date}</span>
                  {previewItem.mediaType === 'video' && (
                    <>
                      <Clock size={14} className="text-muted-foreground ml-2" />
                      <span className="text-xs text-muted-foreground">{previewItem.duration}s</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {previewItem.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
                {previewItem.notes && (
                  <p className="text-sm text-foreground mt-3 leading-relaxed">{previewItem.notes}</p>
                )}
                {previewItem.relatedData?.weight && (
                  <p className="text-xs text-muted-foreground mt-2">
                    体重：{previewItem.relatedData.weight.toFixed(1)} kg
                  </p>
                )}
                <button
                  onClick={() => setPreviewItem(null)}
                  className="w-full mt-3 h-10 rounded-xl bg-muted text-muted-foreground text-sm font-medium"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Composer Modal */}
      <AnimatePresence>
        {showComposer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setShowComposer(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl max-h-[78dvh] mb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:mb-0 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                <h2 className="font-bold text-foreground">
                  {composerMediaType === 'photo' ? '📷 发布照片' : '🎬 发布视频'}
                </h2>
                <button onClick={() => setShowComposer(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Media preview */}
                {composerPreview && (
                  <div className="rounded-2xl overflow-hidden">
                    {composerMediaType === 'photo' ? (
                      <img src={composerPreview} alt="预览" className="w-full max-h-[24dvh] object-cover" />
                    ) : (
                      <video src={composerPreview} className="w-full max-h-[24dvh] object-cover" controls />
                    )}
                  </div>
                )}

                {/* Text input */}
                <textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value.slice(0, 500))}
                  placeholder="记录此刻的心情，分享你的蜕变故事..."
                  className="w-full h-24 rounded-xl bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                />
                <div className="flex justify-between items-center px-1">
                  <p className="text-[10px] text-muted-foreground">记录你的感受、进步或今天的小目标</p>
                  <span className="text-[10px] text-muted-foreground">{composerText.length}/500</span>
                </div>
              </div>

              {/* Sticky bottom actions */}
              <div className="flex gap-3 p-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-border bg-card shrink-0">
                <button
                  onClick={() => setShowComposer(false)}
                  className="flex-1 h-11 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const dateStr = today.toISOString().split('T')[0];
                    const newRecord: MediaRecord = {
                      id: `m-${Date.now()}`,
                      mediaType: composerMediaType,
                      timestamp: today.toISOString(),
                      date: dateStr,
                      url: composerPreview || '',
                      thumbnailUrl: composerPreview || '',
                      tags: [composerMediaType === 'photo' ? '打卡照片' : '打卡视频'],
                      notes: composerText.trim() || undefined,
                      relatedData: { dayNumber: 7 },
                    };
                    setMedia((prev) => [newRecord, ...prev]);
                    setShowComposer(false);
                    setComposerPreview(null);
                    setComposerFile(null);
                    setComposerText('');
                    toast({
                      title: '发布成功 ✨',
                      description: composerText.trim() ? '照片和文字已记录' : '照片已记录',
                    });
                  }}
                  className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                >
                  发布
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaPage;
