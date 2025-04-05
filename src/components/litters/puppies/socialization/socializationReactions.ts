
import { SocializationReactionOption, SocializationReactionType } from '@/types/puppyTracking';

export const socializationReactions: SocializationReactionOption[] = [
  {
    id: 'positive',
    label: 'Positive',
    value: 'positive',
    color: 'green',
    type: 'positive',
    icon: '😊',
    name: 'Positive'
  },
  {
    id: 'neutral',
    label: 'Neutral',
    value: 'neutral',
    color: 'blue',
    type: 'neutral',
    icon: '😐',
    name: 'Neutral'
  },
  {
    id: 'fearful',
    label: 'Fearful',
    value: 'fearful',
    color: 'yellow',
    type: 'fearful',
    icon: '😨',
    name: 'Fearful'
  },
  {
    id: 'negative',
    label: 'Negative',
    value: 'negative',
    color: 'red',
    type: 'negative',
    icon: '😠',
    name: 'Negative'
  },
  {
    id: 'curious', 
    label: 'Curious',
    value: 'curious',
    color: 'purple',
    type: 'curious',
    icon: '🧐',
    name: 'Curious'
  }
];

export default socializationReactions;
