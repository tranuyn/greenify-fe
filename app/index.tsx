import { Redirect } from 'expo-router';

export default function StartPage() {
  // Tự động chuyển hướng người dùng vào nhóm (tabs)
  return <Redirect href="/(tabs)" />;
}