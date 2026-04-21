import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

const getCountdownToThisWeekSundayEnd = () => {
  const now = new Date(Date.now());
  const target = new Date(now);

  const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ...
  const daysUntilSunday = (7 - dayOfWeek) % 7;
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(23, 59, 0, 0);

  const diffMs = Math.max(0, target.getTime() - now.getTime());
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
};

const TimeFilter = () => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = React.useState(getCountdownToThisWeekSundayEnd());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownToThisWeekSundayEnd());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="my-6 mt-4 flex-row justify-between px-12">
      <Text className="font-bold text-white">
        {t('leaderboard.countdown.days', { count: countdown.days })}
      </Text>
      <Text className="font-bold text-white">
        {t('leaderboard.countdown.hours', { count: countdown.hours })}
      </Text>
      <Text className="font-bold text-white">
        {t('leaderboard.countdown.minutes', { count: countdown.minutes })}
      </Text>
    </View>
  );
};

export default TimeFilter;
