import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Headphones, FileText, Eye, Lock, BookOpen, X, Download, ArrowLeft, ChevronRight } from 'lucide-react';
import { COURSE_CATEGORIES } from '@/data/mockCourses';
import type { CourseCategory } from '@/data/mockCourses';
import { useCourses, type CourseDB } from '@/hooks/useCourses';
import { getCourseThumbnail } from '@/lib/courseThumbnails';
import { Input } from '@/components/ui/input';

const typeIcon: Record<string, typeof Play> = {
  video: Play,
  audio: Headphones,
  article: FileText,
};

const typeLabel: Record<string, string> = {
  video: '视频',
  audio: '音频',
  article: '文章',
};

const formatViews = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
};

const CoursePlayer = ({ course }: { course: CourseDB }) => {
  const url = course.content_url;
  if (!url) {
    return (
      <div className="w-full h-48 bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm">
        暂无内容
      </div>
    );
  }

  if (course.type === 'video') {
    return (
      <video
        src={url}
        controls
        controlsList="nodownload"
        className="w-full rounded-xl bg-black"
        style={{ maxHeight: 280 }}
      >
        您的浏览器不支持视频播放
      </video>
    );
  }

  if (course.type === 'audio') {
    return (
      <div className="w-full bg-muted/50 rounded-xl p-4 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Headphones size={28} className="text-primary" />
        </div>
        <audio src={url} controls className="w-full">
          您的浏览器不支持音频播放
        </audio>
      </div>
    );
  }

  if (course.type === 'article') {
    const isPdf = url.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      return (
        <iframe
          src={url}
          className="w-full rounded-xl border border-border"
          style={{ height: 350 }}
          title={course.title}
        />
      );
    }
    return (
      <div className="w-full bg-muted/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">文档</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <Download size={14} /> 查看/下载文档
        </a>
      </div>
    );
  }

  return null;
};

const CoursePage = ({ isPremium = false }: { isPremium?: boolean }) => {
  const [activeCategory, setActiveCategory] = useState<CourseCategory | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseDB | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: courses = [], isLoading } = useCourses(
    searchQuery || undefined,
    activeCategory || undefined
  );

  // Group courses by category for showing counts
  const allCourses = useCourses(undefined, undefined);
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (allCourses.data || []).forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [allCourses.data]);

  const handleStartLearning = () => {
    setIsPlaying(true);
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      {/* Header */}
      {activeCategory && !isSearching ? (
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => setActiveCategory(null)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-lg">
            {COURSE_CATEGORIES.find((c) => c.key === activeCategory)?.icon}
          </span>
          <h1 className="text-xl font-bold text-foreground font-serif">{activeCategory}</h1>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={22} className="text-primary" />
            <h1 className="text-xl font-bold text-foreground font-serif">课堂</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-4">探索身心合一的智慧</p>
        </>
      )}

      {/* Search bar */}
      <div className="relative mb-4 mt-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索课程或讲师..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-xl bg-card border-border"
        />
      </div>

      {/* Category grid (show when no category selected and not searching) */}
      {!activeCategory && !isSearching && (
        <div className="grid grid-cols-2 gap-3">
          {COURSE_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setActiveCategory(cat.key)}
              className="wabi-card !p-4 flex items-center gap-3 text-left active:scale-[0.97] transition-transform"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground">{cat.key}</div>
                <div className="text-[10px] text-muted-foreground">
                  {categoryCounts[cat.key] || 0} 门课程
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </motion.button>
          ))}
        </div>
      )}

      {/* Course list (show when category selected or searching) */}
      {(activeCategory || isSearching) && (
        <>
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground text-sm">加载中...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">暂无课程</div>
          ) : (
            <div className="space-y-3">
              {courses.map((course, i) => {
                const Icon = typeIcon[course.type] || Play;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => { setSelectedCourse(course); setIsPlaying(false); }}
                    className="wabi-card flex gap-3.5 !p-4 cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 shrink-0 rounded-xl bg-muted overflow-hidden relative">
                      <img
                        src={getCourseThumbnail(course.category, course.thumbnail)}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-foreground/5 flex items-center justify-center">
                        <Icon size={18} className="text-card/80 drop-shadow" />
                      </div>
                      {!course.is_free && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-secondary/90 flex items-center justify-center">
                          <Lock size={10} className="text-secondary-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                        {course.instructor}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {typeLabel[course.type] || course.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{course.duration}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Eye size={10} /> {formatViews(course.views)}
                        </span>
                        {course.is_free && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            免费
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Course detail modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 flex items-end justify-center"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-lg bg-card rounded-t-3xl overflow-hidden max-h-[85vh] overflow-y-auto mb-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center"
              >
                <X size={16} className="text-foreground" />
              </button>

              {/* Player or cover image */}
              {isPlaying ? (
                <div className="p-4 pt-6">
                  <CoursePlayer course={selectedCourse} />
                </div>
              ) : (
                <div className="w-full h-40 bg-muted">
                  <img
                    src={getCourseThumbnail(selectedCourse.category, selectedCourse.thumbnail)}
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 pb-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">
                    {COURSE_CATEGORIES.find((c) => c.key === selectedCourse.category)?.icon}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {selectedCourse.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {typeLabel[selectedCourse.type] || selectedCourse.type}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-foreground mt-2 mb-1">{selectedCourse.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{selectedCourse.instructor} · {selectedCourse.duration}</p>
                <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                  {selectedCourse.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                  <Eye size={12} /> {formatViews(selectedCourse.views)} 次学习
                </div>

                {!isPlaying && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={(selectedCourse.is_free || isPremium) ? handleStartLearning : undefined}
                    className={`w-full py-3.5 rounded-2xl font-semibold text-sm ${
                      (selectedCourse.is_free || isPremium)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {selectedCourse.is_free || isPremium ? '开始学习' : '🔒 开通会员解锁'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePage;
