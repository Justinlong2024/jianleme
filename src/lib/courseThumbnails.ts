import courseFasting from '@/assets/course-fasting.jpg';
import courseBigu from '@/assets/course-bigu.jpg';
import courseMeditation from '@/assets/course-meditation.jpg';
import courseMovement from '@/assets/course-movement.jpg';
import courseFood from '@/assets/course-food.jpg';
import courseMinimalism from '@/assets/course-minimalism.jpg';

// Map categories to default thumbnail images
const categoryThumbnails: Record<string, string> = {
  '轻断食': courseFasting,
  '辟谷': courseBigu,
  '静引': courseMeditation,
  '动引': courseMovement,
  '复食': courseFood,
  '药食同源': courseFood,
  '食愈师': courseBigu,
  '断舍离': courseMinimalism,
};

export const getCourseThumbnail = (category: string, thumbnail?: string | null): string => {
  if (thumbnail && thumbnail.length > 0) return thumbnail;
  return categoryThumbnails[category] || courseFasting;
};
