export interface OnboardingSlide {
  id: string;
  titleKey: 'onboarding.slide_1' | 'onboarding.slide_2' | 'onboarding.slide_3';
  imageUrl: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'slide-1',
    titleKey: 'onboarding.slide_1',
    imageUrl:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'slide-2',
    titleKey: 'onboarding.slide_2',
    imageUrl:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'slide-3',
    titleKey: 'onboarding.slide_3',
    imageUrl:
      'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=1200&q=80',
  },
];
