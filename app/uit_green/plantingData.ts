// plantingData.ts

export type PlantingSpot = {
  id: string;
  top: string;
  left: string;
  status: 'available' | 'planted';
  rotate?: string; // Thêm góc xoay để ô bấm khớp với ảnh nghiêng
};

export const AREA_GRIDS_CONFIG: Record<string, PlantingSpot[]> = {
  'nha-xe-a': [
    // Ví dụ tọa độ cho cụm lưới phía dưới bên trái của Nhà xe A
    // (Bạn sẽ cần tinh chỉnh lại các con số % này cho thật khớp với ảnh của bạn nhé)
    { id: 'nxa-1', top: '65%', left: '20%', status: 'available', rotate: '-35deg' },
    { id: 'nxa-2', top: '68%', left: '23%', status: 'planted', rotate: '-35deg' },
    { id: 'nxa-3', top: '71%', left: '26%', status: 'available', rotate: '-35deg' },

    // Ví dụ cụm lưới phía trên bên phải
    { id: 'nxa-4', top: '25%', left: '60%', status: 'available', rotate: '-35deg' },
    { id: 'nxa-5', top: '28%', left: '63%', status: 'available', rotate: '-35deg' },
    // ... Khai báo tiếp cho đến khi đủ các ô bạn muốn
  ],
  'khu-a': [
    // Khu A hình dáng khác, không bị nghiêng thì rotate là 0deg
    { id: 'ka-1', top: '40%', left: '50%', status: 'available', rotate: '0deg' },
    { id: 'ka-2', top: '45%', left: '50%', status: 'available', rotate: '0deg' },
  ],
  'nha-xe-b': [
    // Cấu hình cho nhà xe B...
  ],
};
