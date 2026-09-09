import type { MessageCategory, MessageTemplate } from '@/types';

export interface MessageTemplateSeed {
  category: MessageCategory;
  title: string;
  message: string;
}

export const messageTemplateSeeds: MessageTemplateSeed[] = [
  // Birthday
  {
    category: 'birthday',
    title: 'Happy Birthday!',
    message:
      "Wishing you the happiest of birthdays! May this year bring you endless joy, exciting adventures, and dreams come true. You deserve all the wonderful things life has to offer.",
  },
  {
    category: 'birthday',
    title: 'Another Year of You',
    message:
      "Happy birthday to someone who makes the world brighter just by being in it. Here's to another year of laughter, love, and unforgettable moments!",
  },
  {
    category: 'birthday',
    title: 'Celebrate You',
    message:
      "Today is all about you! May your birthday be filled with smiles, surrounded by the people who love you most. Cheers to another amazing year ahead!",
  },
  // Graduation
  {
    category: 'graduation',
    title: 'Congratulations on Your Graduation!',
    message:
      "Congratulations on reaching this incredible milestone. Your hard work, dedication, and determination have paid off. Wishing you success and happiness in the exciting journey ahead!",
  },
  {
    category: 'graduation',
    title: 'The World Awaits',
    message:
      "You did it! All those late nights, early mornings, and everything in between have led to this moment. The world is waiting for what you'll do next. Congratulations, graduate!",
  },
  {
    category: 'graduation',
    title: 'Dream Big',
    message:
      "Graduation is not the end — it's the beginning of everything you've been working toward. Dream big, stay curious, and never stop growing. Congratulations!",
  },
  // Wedding
  {
    category: 'wedding',
    title: 'Congratulations on Your Wedding!',
    message:
      "Wishing you both a lifetime of love, laughter, and happiness. May your marriage be filled with joy, your home with warmth, and your days with endless love. Congratulations!",
  },
  {
    category: 'wedding',
    title: 'Two Hearts, One Journey',
    message:
      "As you begin this beautiful journey together, may every day bring you closer and every challenge make you stronger. Wishing you a lifetime of love and happiness!",
  },
  {
    category: 'wedding',
    title: 'Happily Ever After',
    message:
      "Congratulations on your wedding! May your love grow stronger with each passing year, and may your life together be everything you've dreamed of and more.",
  },
  // Anniversary
  {
    category: 'anniversary',
    title: 'Happy Anniversary!',
    message:
      "Cheers to another year of love, laughter, and beautiful memories. Your journey together is an inspiration to everyone who knows you. Happy anniversary!",
  },
  {
    category: 'anniversary',
    title: 'Love That Lasts',
    message:
      "Through all the seasons of life, your love has only grown stronger. Here's to many more years of joy, adventure, and togetherness. Happy anniversary!",
  },
  {
    category: 'anniversary',
    title: 'Years of Happiness',
    message:
      "Celebrating the love you share and the life you've built together. May your anniversary be as special and wonderful as the two of you. Congratulations!",
  },
  // Engagement
  {
    category: 'engagement',
    title: 'Congratulations on Your Engagement!',
    message:
      "What wonderful news! Wishing you both a joyous engagement and a beautiful wedding ahead. May this new chapter be filled with love, excitement, and happy planning!",
  },
  {
    category: 'engagement',
    title: 'A New Beginning',
    message:
      "Congratulations on taking this beautiful step together! Your love story is just getting started, and the best is yet to come. So happy for you both!",
  },
  {
    category: 'engagement',
    title: 'Ring by Spring',
    message:
      "He asked, she said yes, and now the adventure begins! Wishing you a lifetime of happiness as you plan your happily ever after. Congratulations!",
  },
  // Baby
  {
    category: 'baby',
    title: 'Welcome Little One!',
    message:
      "Congratulations on the arrival of your precious little one! May this new chapter be filled with snuggles, smiles, and sweet moments. Wishing your growing family all the best!",
  },
  {
    category: 'baby',
    title: 'A Bundle of Joy',
    message:
      "A new little life, a world of love. Congratulations on your beautiful new arrival! May the days ahead be filled with wonder, joy, and countless firsts.",
  },
  {
    category: 'baby',
    title: 'Growing Families',
    message:
      "Congratulations on growing your family! There's nothing quite like the love a baby brings. Wishing you all the happiness in the world during this special time.",
  },
  // Congratulations
  {
    category: 'congratulations',
    title: 'Congratulations!',
    message:
      "Huge congratulations on your amazing achievement! You've worked so hard for this, and it's wonderful to see your efforts pay off. Here's to many more successes ahead!",
  },
  {
    category: 'congratulations',
    title: 'Well Done!',
    message:
      "Congratulations on a job well done! Your dedication and talent truly shine through. Keep reaching for the stars — the sky's the limit!",
  },
  {
    category: 'congratulations',
    title: 'You Did It!',
    message:
      "So proud of everything you've accomplished. This is just one of many great things to come. Congratulations and keep up the amazing work!",
  },
  // Thank You
  {
    category: 'thank-you',
    title: 'Thank You!',
    message:
      "Thank you so much for your kindness and generosity. Your thoughtfulness means the world to me, and I truly appreciate everything you've done.",
  },
  {
    category: 'thank-you',
    title: 'With Gratitude',
    message:
      "Words can't express how thankful I am for you. Your support and encouragement have made all the difference. Thank you from the bottom of my heart.",
  },
  {
    category: 'thank-you',
    title: 'A Heartfelt Thanks',
    message:
      "I am so grateful for your kindness. Thank you for being there when it mattered most. Your generosity will never be forgotten.",
  },
  // Other
  {
    category: 'other',
    title: 'Sending Good Wishes',
    message:
      "Sending you warm wishes and good vibes! Whatever the occasion, I hope this moment brings you joy and happiness. Celebrate big!",
  },
  {
    category: 'other',
    title: 'Thinking of You',
    message:
      "Just wanted to reach out and say hello! Sending positive thoughts your way and hoping you're doing wonderfully. Take care!",
  },
  {
    category: 'other',
    title: 'Celebrate Today',
    message:
      "Every day is worth celebrating, and today is no exception. Wishing you joy, peace, and happiness in all that you do!",
  },
];

export const messageCategoryLabels: Record<MessageCategory, string> = {
  birthday: 'Birthday',
  graduation: 'Graduation',
  wedding: 'Wedding',
  anniversary: 'Anniversary',
  engagement: 'Engagement',
  baby: 'Baby',
  congratulations: 'Congratulations',
  'thank-you': 'Thank You',
  other: 'Other',
};

export const messageCategoryIcons: Record<MessageCategory, string> = {
  birthday: '🎂',
  graduation: '🎓',
  wedding: '💍',
  anniversary: '💝',
  engagement: '✨',
  baby: '🍼',
  congratulations: '🎊',
  'thank-you': '🙏',
  other: '💌',
};
