import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Upload, FileVideo, FileAudio, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse, type CourseDB } from '@/hooks/useCourses';
import { COURSE_CATEGORIES } from '@/data/mockCourses';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminCoursePageProps {
  onBack: () => void;
}

const emptyCourse = {
  title: '',
  category: '轻断食',
  type: 'video',
  duration: '',
  thumbnail: '',
  instructor: '',
  description: '',
  is_free: false,
  views: 0,
  content_url: '',
};

const ACCEPTED_TYPES: Record<string, string> = {
  video: 'video/mp4,video/webm,video/quicktime',
  audio: 'audio/mpeg,audio/wav,audio/ogg,audio/mp4',
  article: 'application/pdf,text/html,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const CONTENT_ICONS: Record<string, typeof FileVideo> = {
  video: FileVideo,
  audio: FileAudio,
  article: FileText,
};

const CONTENT_LABELS: Record<string, string> = {
  video: '上传视频',
  audio: '上传音频',
  article: '上传文档',
};

const AdminCoursePage = ({ onBack }: AdminCoursePageProps) => {
  const { data: courses = [], isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [editing, setEditing] = useState<Partial<CourseDB> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const contentFileRef = useRef<HTMLInputElement>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    
    setUploading(true);
    setUploadProgress(10);

    const { error } = await supabase.storage
      .from('course-media')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;
    
    setUploadProgress(90);

    const { data: urlData } = supabase.storage
      .from('course-media')
      .getPublicUrl(fileName);

    setUploadProgress(100);
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
    }, 500);

    return urlData.publicUrl;
  };

  const handleContentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      const url = await uploadFile(file, 'content');
      setEditing({ ...editing, content_url: url });
      toast.success('文件上传成功');
    } catch (err: any) {
      toast.error(err.message || '上传失败');
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      const url = await uploadFile(file, 'thumbnails');
      setEditing({ ...editing, thumbnail: url });
      toast.success('封面上传成功');
    } catch (err: any) {
      toast.error(err.message || '上传失败');
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (isNew) {
        await createCourse.mutateAsync(editing as any);
        toast.success('课程已创建');
      } else {
        await updateCourse.mutateAsync({ id: editing.id!, ...editing });
        toast.success('课程已更新');
      }
      setEditing(null);
      setIsNew(false);
    } catch (err: any) {
      toast.error(err.message || '操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这个课程吗？')) return;
    try {
      await deleteCourse.mutateAsync(id);
      toast.success('课程已删除');
    } catch (err: any) {
      toast.error(err.message || '删除失败');
    }
  };

  const ContentIcon = editing ? CONTENT_ICONS[editing.type || 'video'] || FileVideo : FileVideo;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-foreground font-serif">课程管理</h1>
        <div className="flex-1" />
        <Button
          size="sm"
          onClick={() => { setEditing({ ...emptyCourse }); setIsNew(true); }}
          className="rounded-xl gap-1"
        >
          <Plus size={16} /> 新增
        </Button>
      </div>

      {/* Edit form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="wabi-card mb-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{isNew ? '新增课程' : '编辑课程'}</h3>
            <button onClick={() => { setEditing(null); setIsNew(false); }}>
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>
          <Input
            placeholder="课程标题"
            value={editing.title || ''}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={editing.category || '轻断食'}
              onValueChange={(v) => setEditing({ ...editing, category: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {COURSE_CATEGORIES.map((c) => (
                  <SelectItem key={c.key} value={c.key}>{c.icon} {c.key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={editing.type || 'video'}
              onValueChange={(v) => setEditing({ ...editing, type: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="video">视频</SelectItem>
                <SelectItem value="audio">音频</SelectItem>
                <SelectItem value="article">文章</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="讲师"
              value={editing.instructor || ''}
              onChange={(e) => setEditing({ ...editing, instructor: e.target.value })}
            />
            <Input
              placeholder="时长 (如 18:45)"
              value={editing.duration || ''}
              onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
            />
          </div>

          {/* Thumbnail upload */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">封面图</label>
            <div className="flex gap-2">
              <Input
                placeholder="封面图URL (可选)"
                value={editing.thumbnail || ''}
                onChange={(e) => setEditing({ ...editing, thumbnail: e.target.value })}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => thumbnailFileRef.current?.click()}
                disabled={uploading}
                className="shrink-0"
              >
                <Upload size={14} />
              </Button>
              <input
                ref={thumbnailFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailUpload}
              />
            </div>
            {editing.thumbnail && (
              <img src={editing.thumbnail} alt="封面预览" className="w-20 h-14 object-cover rounded-lg" />
            )}
          </div>

          {/* Content file upload */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              {CONTENT_LABELS[editing.type || 'video'] || '上传内容'}
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="内容URL (可选，或上传文件)"
                value={editing.content_url || ''}
                onChange={(e) => setEditing({ ...editing, content_url: e.target.value })}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => contentFileRef.current?.click()}
                disabled={uploading}
                className="shrink-0 gap-1"
              >
                <ContentIcon size={14} />
                <Upload size={14} />
              </Button>
              <input
                ref={contentFileRef}
                type="file"
                accept={ACCEPTED_TYPES[editing.type || 'video'] || '*/*'}
                className="hidden"
                onChange={handleContentUpload}
              />
            </div>
            {editing.content_url && (
              <p className="text-[11px] text-primary truncate">✓ {editing.content_url.split('/').pop()}</p>
            )}
          </div>

          {uploading && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-[11px] text-muted-foreground">上传中...</p>
            </div>
          )}

          <Textarea
            placeholder="课程描述"
            value={editing.description || ''}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            rows={3}
          />
          <div className="flex items-center gap-3">
            <Switch
              checked={editing.is_free ?? false}
              onCheckedChange={(v) => setEditing({ ...editing, is_free: v })}
            />
            <span className="text-sm text-foreground">免费课程</span>
          </div>
          <Button onClick={handleSave} className="w-full rounded-xl gap-1" disabled={createCourse.isPending || updateCourse.isPending || uploading}>
            <Save size={16} /> 保存
          </Button>
        </motion.div>
      )}

      {/* Course list */}
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground text-sm">加载中...</div>
      ) : (
        <div className="space-y-2">
          {courses.map((course) => (
            <div key={course.id} className="wabi-card !p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">{course.title}</h4>
                <p className="text-[11px] text-muted-foreground">
                  {course.category} · {course.instructor}
                  {course.content_url ? ' · ✓有内容' : ''}
                </p>
              </div>
              <button
                onClick={() => { setEditing({ ...course }); setIsNew(false); }}
                className="text-muted-foreground hover:text-primary p-1.5"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="text-muted-foreground hover:text-destructive p-1.5"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCoursePage;
