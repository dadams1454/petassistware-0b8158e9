
import { SocializationReactionOption, SocializationReactionType } from '@/types/puppyTracking';

export const socializationReactions: SocializationReactionOption[] = [
  {
    id: 'positive',
    name: 'Positive',
    color: 'green',
    value: 'positive',
    icon: '😊',
    type: 'positive'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    color: 'blue',
    value: 'neutral',
    icon: '😐',
    type: 'neutral'
  },
  {
    id: 'fearful',
    name: 'Fearful',
    color: 'yellow',
    value: 'fearful',
    icon: '😨',
    type: 'fearful'
  },
  {
    id: 'negative',
    name: 'Negative',
    color: 'red',
    value: 'negative',
    icon: '😠',
    type: 'negative'
  },
  {
    id: 'curious', 
    name: 'Curious',
    color: 'purple',
    value: 'curious',
    icon: '🧐',
    type: 'curious'
  }
];

export default socializationReactions;
