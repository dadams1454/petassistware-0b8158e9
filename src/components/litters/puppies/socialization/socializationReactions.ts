
import { SocializationReactionOption, SocializationReactionType } from '@/types/puppyTracking';

export const socializationReactions: SocializationReactionOption[] = [
  {
    id: 'curious',
    name: 'Curious',
    value: 'curious',
    label: 'Curious',
    color: 'green',
    type: 'curious',
    emoji: '🧐'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    value: 'neutral',
    label: 'Neutral',
    color: 'blue',
    type: 'neutral',
    emoji: '😐'
  },
  {
    id: 'positive',
    name: 'Positive',
    value: 'positive',
    label: 'Positive',
    color: 'amber',
    type: 'positive',
    emoji: '😊'
  },
  {
    id: 'fearful',
    name: 'Fearful',
    value: 'fearful',
    label: 'Fearful',
    color: 'red',
    type: 'fearful',
    emoji: '😨'
  },
  {
    id: 'excited',
    name: 'Excited',
    value: 'excited',
    label: 'Excited',
    color: 'purple',
    type: 'excited',
    emoji: '🤩'
  }
];

export default socializationReactions;
