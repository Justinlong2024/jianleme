import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Headphones, FileText, Eye, Lock, BookOpen } from 'lucide-react';
import { COURSE_CATEGORIES, MOCK_COURSES, Course, CourseCategory, CourseType } from '@/data/mockCourses';

const typeIcon: Record<CourseType, typeof Play> = {
  video: Play,
  audio: Headphones,
  article: FileText,
};

const typeLabel: Record<CourseType, string> = {
  video: '视频',
  audio: '音频',
  article: '文章',
};

const formatViews = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
};

const CoursePage = () => {
  const [activeCategory, setActiveCategory] = useState<CourseCategory | 'all'>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filtered =
    activeCategory === 'all'
      ? MOCK_COURSES
      : MOCK_COURSES.filter((c) => c.category === activeCategory);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen size={22} className="text-primary" />
        <h1 className="text-xl font-bold text-foreground font-serif">课堂</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-4">探索身心合一的智慧</p>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          全部
        </button>
        {COURSE_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {cat.icon} {cat.key}
          </button>
        ))}
      </div>

      {/* Course list */}
      <div className="space-y-3">
        {filtered.map((course, i) => {
          const Icon = typeIcon[course.type];
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedCourse(course)}
              className="wabi-card flex gap-3.5 !p-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              {/* Thumbnail placeholder */}
              <div className="w-20 h-20 shrink-0 rounded-xl bg-muted flex items-center justify-center relative overflow-hidden">
                <Icon size={24} className="text-muted-foreground/60" />
                {!course.isFree && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-secondary/90 flex items-center justify-center">
                    <Lock size={10} className="text-secondary-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                  {course.instructor}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {typeLabel[course.type]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{course.duration}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Eye size={10} /> {formatViews(course.views)}
                  </span>
                  {course.isFree && (
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
              className="w-full max-w-lg bg-card rounded-t-3xl p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-5" />

              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">
                  {COURSE_CATEGORIES.find((c) => c.key === selectedCourse.category)?.icon}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {selectedCourse.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {typeLabel[selectedCourse.type]}
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

              <motion.button
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm ${
                  selectedCourse.isFree
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {selectedCourse.isFree ? '开始学习' : '解锁课程'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePage;
