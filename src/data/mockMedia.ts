import { MediaRecord } from '@/types';

// Generate mock media records for the last 30 days
export function generateMockMedia(): MediaRecord[] {
  const records: MediaRecord[] = [];
  const today = new Date();

  // Photos
  const photoTypes: ('halfBody' | 'fullBody')[] = ['halfBody', 'fullBody'];
  for (let i = 0; i < 18; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(i * 1.8));
    const dayNum = 30 - Math.floor(i * 1.8);
    const type = photoTypes[i % 2];
    records.push({
      id: `photo-${i}`,
      mediaType: 'photo',
      timestamp: date.toISOString(),
      date: date.toISOString().split('T')[0],
      photoType: type,
      url: `https://picsum.photos/seed/pile${i}/400/600`,
      thumbnailUrl: `https://picsum.photos/seed/pile${i}/200/300`,
      tags: [`第${dayNum}天`, type === 'fullBody' ? '全身照' : '半身照'],
      relatedData: {
        weight: 75 - i * 0.15,
        dayNumber: dayNum,
      },
    });
  }

  // Videos
  for (let i = 0; i < 4; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 7);
    const dayNum = 30 - i * 7;
    records.push({
      id: `video-${i}`,
      mediaType: 'video',
      timestamp: date.toISOString(),
      date: date.toISOString().split('T')[0],
      thumbnailUrl: `https://picsum.photos/seed/pvid${i}/200/300`,
      url: '',
      duration: 15 + Math.floor(Math.random() * 15),
      tags: [`第${dayNum}天`, '视频记录'],
      relatedData: { dayNumber: dayNum },
    });
  }

  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
