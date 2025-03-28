
import { MilestoneOption } from './types';

export const milestoneOptions: MilestoneOption[] = [
  {
    value: 'eyes_open',
    label: 'Eyes Open',
    description: 'Puppies are born with their eyes sealed shut, but they typically open between 10-14 days.',
    typicalAgeRange: {
      earliestDay: 10,
      averageDay: 12,
      latestDay: 14
    }
  },
  {
    value: 'ears_open',
    label: 'Ears Open',
    description: 'Puppies\' ear canals open around 13-17 days after birth, allowing them to begin hearing.',
    typicalAgeRange: {
      earliestDay: 13,
      averageDay: 15,
      latestDay: 17
    }
  },
  {
    value: 'first_walk',
    label: 'First Walking Attempts',
    description: 'Puppies begin to attempt walking, though unsteadily, around 2-3 weeks of age.',
    typicalAgeRange: {
      earliestDay: 14,
      averageDay: 17,
      latestDay: 21
    }
  },
  {
    value: 'full_mobility',
    label: 'Full Mobility',
    description: 'Puppies develop good coordination and can walk well around 3-4 weeks of age.',
    typicalAgeRange: {
      earliestDay: 21,
      averageDay: 25,
      latestDay: 28
    }
  },
  {
    value: 'first_bark',
    label: 'First Bark',
    description: 'Puppies begin to vocalize with bark-like sounds around 3-4 weeks.',
    typicalAgeRange: {
      earliestDay: 21,
      averageDay: 24,
      latestDay: 28
    }
  },
  {
    value: 'first_food',
    label: 'First Solid Food',
    description: 'Puppies typically begin to eat solid (or mush) food around 3-4 weeks of age.',
    typicalAgeRange: {
      earliestDay: 21,
      averageDay: 24,
      latestDay: 28
    }
  },
  {
    value: 'fully_weaned',
    label: 'Fully Weaned',
    description: 'Puppies are typically fully weaned off mother\'s milk by 6-8 weeks of age.',
    typicalAgeRange: {
      earliestDay: 42,
      averageDay: 49,
      latestDay: 56
    }
  },
  {
    value: 'custom',
    label: 'Custom Milestone',
    description: 'Record any other developmental milestone not covered by the standard options.',
    typicalAgeRange: {
      earliestDay: 0,
      averageDay: 0,
      latestDay: 0
    }
  }
];

export const getMilestoneInfo = (milestoneType: string): MilestoneOption => {
  const milestone = milestoneOptions.find(m => m.value === milestoneType);
  if (!milestone) {
    return milestoneOptions.find(m => m.value === 'custom')!;
  }
  return milestone;
};

export const calculateMilestoneStatus = (
  birthDate: Date | string | null | undefined,
  milestoneType: string,
  completedDate?: Date | string | null
): 'pending' | 'on-time' | 'early' | 'late' | 'unknown' => {
  if (!birthDate) return 'unknown';
  
  // Get milestone info
  const milestone = getMilestoneInfo(milestoneType);
  if (milestoneType === 'custom') return completedDate ? 'on-time' : 'pending';
  
  // Convert birthDate to Date object if it's a string
  const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  
  // If milestone is not completed yet
  if (!completedDate) {
    const today = new Date();
    const ageInDays = Math.floor((today.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    // If the puppy is younger than the earliest expected day for this milestone
    if (ageInDays < milestone.typicalAgeRange.earliestDay) {
      return 'pending';
    }
    // If the puppy is older than the latest expected day for this milestone
    else if (ageInDays > milestone.typicalAgeRange.latestDay) {
      return 'late';
    }
    // If the puppy is within the expected age range
    else {
      return 'pending';
    }
  }
  // If milestone is completed
  else {
    // Convert completedDate to Date object if it's a string
    const completedDateObj = typeof completedDate === 'string' ? new Date(completedDate) : completedDate;
    
    // Calculate age in days when milestone was achieved
    const ageInDays = Math.floor((completedDateObj.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    // If the milestone was achieved earlier than expected
    if (ageInDays < milestone.typicalAgeRange.earliestDay) {
      return 'early';
    }
    // If the milestone was achieved later than expected
    else if (ageInDays > milestone.typicalAgeRange.latestDay) {
      return 'late';
    }
    // If the milestone was achieved within the expected range
    else {
      return 'on-time';
    }
  }
};
