// history/_layout.tsx - chỉ cần đơn giản thế này
import { Stack } from 'expo-router';

export default function HistoryLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
