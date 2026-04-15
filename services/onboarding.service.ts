import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = 'onboarding.completed.v1';

export async function getOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return value === 'true';
  } catch (error) {
    console.warn('Failed to read onboarding state:', error);
    return false;
  }
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, String(completed));
  } catch (error) {
    console.warn('Failed to save onboarding state:', error);
  }
}

export async function resetOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
  } catch (error) {
    console.warn('Failed to reset onboarding state:', error);
  }
}
