
import { SocializationReactionOption, SocializationReactionType } from '@/types/puppyTracking';

export const socializationReactions: SocializationReactionOption[] = [
  {
    id: 'positive',
    name: 'Positive',
    color: 'green',
    value: 'positive',
    icon: '😊'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    color: 'blue',
    value: 'neutral',
    icon: '😐'
  },
  {
    id: 'fearful',
    name: 'Fearful',
    color: 'yellow',
    value: 'fearful',
    icon: '😨'
  },
  {
    id: 'negative',
    name: 'Negative',
    color: 'red',
    value: 'negative',
    icon: '😠'
  },
  {
    id: 'curious', 
    name: 'Curious',
    color: 'purple',
    value: 'curious',
    icon: '🧐'
  }
];

export default socializationReactions;
