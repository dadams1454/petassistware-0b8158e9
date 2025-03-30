
import { MilestoneOption } from './types';

export const milestoneOptions: MilestoneOption[] = [
  {
    value: 'eyes_open',
    label: 'Eyes Open',
    description: 'Puppy\'s eyes have opened',
    typicalAgeRange: {
      earliestDay: 10,
      averageDay: 14,
      latestDay: 17
    }
  },
  {
    value: 'ears_open',
    label: 'Ears Open',
    description: 'Puppy\'s ear canals have opened',
    typicalAgeRange: {
      earliestDay: 13,
      averageDay: 14,
      latestDay: 18
    }
  },
  {
    value: 'first_crawl',
    label: 'First Crawl',
    description: 'Puppy\'s first crawling attempt',
    typicalAgeRange: {
      earliestDay: 7,
      averageDay: 10,
      latestDay: 14
    }
  },
  {
    value: 'standing',
    label: 'Standing',
    description: 'Puppy can stand on its own',
    typicalAgeRange: {
      earliestDay: 15,
      averageDay: 17,
      latestDay: 21
    }
  },
  {
    value: 'walking',
    label: 'Walking',
    description: 'Puppy\'s first steps',
    typicalAgeRange: {
      earliestDay: 17,
      averageDay: 20,
      latestDay: 25
    }
  },
  {
    value: 'first_bark',
    label: 'First Bark',
    description: 'Puppy\'s first bark or vocalization',
    typicalAgeRange: {
      earliestDay: 21,
      averageDay: 25,
      latestDay: 30
    }
  },
  {
    value: 'first_solid_food',
    label: 'First Solid Food',
    description: 'Puppy\'s first attempt eating solid food',
    typicalAgeRange: {
      earliestDay: 21,
      averageDay: 28,
      latestDay: 35
    }
  },
  {
    value: 'fully_weaned',
    label: 'Fully Weaned',
    description: 'Puppy has been fully weaned from mother\'s milk',
    typicalAgeRange: {
      earliestDay: 35,
      averageDay: 42,
      latestDay: 56
    }
  },
  {
    value: 'first_vaccination',
    label: 'First Vaccination',
    description: 'Puppy received first set of vaccinations',
    typicalAgeRange: {
      earliestDay: 42,
      averageDay: 49,
      latestDay: 56
    }
  },
  {
    value: 'microchipped',
    label: 'Microchipped',
    description: 'Microchip has been implanted',
    typicalAgeRange: {
      earliestDay: 42,
      averageDay: 56,
      latestDay: 70
    }
  },
  {
    value: 'temperament_test',
    label: 'Temperament Test',
    description: 'Formal temperament assessment conducted',
    typicalAgeRange: {
      earliestDay: 49,
      averageDay: 56,
      latestDay: 63
    }
  },
  {
    value: 'deworming',
    label: 'Deworming',
    description: 'Deworming medication administered',
    typicalAgeRange: {
      earliestDay: 14,
      averageDay: 21,
      latestDay: 28
    }
  },
  {
    value: 'socialization_started',
    label: 'Socialization Started',
    description: 'Formal socialization with people/objects began',
    typicalAgeRange: {
      earliestDay: 21,
      averageDay: 28,
      latestDay: 35
    }
  },
  {
    value: 'teeth_eruption',
    label: 'Teeth Eruption',
    description: 'First deciduous teeth have appeared',
    typicalAgeRange: {
      earliestDay: 14,
      averageDay: 21,
      latestDay: 28
    }
  },
  {
    value: 'grooming_start',
    label: 'First Grooming',
    description: 'First grooming/brushing session',
    typicalAgeRange: {
      earliestDay: 21,
      averageDay: 28,
      latestDay: 35
    }
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Custom milestone',
    typicalAgeRange: {
      earliestDay: 0,
      averageDay: 0,
      latestDay: 0
    }
  }
];
