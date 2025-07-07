// api/oneCall.ts
// import type { OneCallCurrent } from '@/assets/types/weather'; // Commented out due to missing or incorrect module

// Temporary replacement in oneCall.ts
export async function getCurrentUVCoords(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric') {
  // Bỏ qua units vì API này không hỗ trợ
  const url = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Không lấy được dữ liệu UV: ${res.status} - ${await res.text()}`);
  const data = await res.json();
  if (!data.ok || !data.now || typeof data.now.uvi !== 'number') throw new Error('Dữ liệu UV Index không hợp lệ');
  return { uvi: data.now.uvi };
}