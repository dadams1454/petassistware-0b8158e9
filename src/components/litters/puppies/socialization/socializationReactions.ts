
import { SocializationReactionOption } from '../types';

export const socializationReactions: SocializationReactionOption[] = [
  {
    id: 'curious',
    name: 'Curious',
    value: 'curious',
    label: 'Curious',
    color: 'green'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    value: 'neutral',
    label: 'Neutral',
    color: 'blue'
  },
  {
    id: 'cautious',
    name: 'Cautious',
    value: 'cautious',
    label: 'Cautious',
    color: 'amber'
  },
  {
    id: 'fearful',
    name: 'Fearful',
    value: 'fearful',
    label: 'Fearful',
    color: 'red'
  },
  {
    id: 'excited',
    name: 'Excited',
    value: 'excited',
    label: 'Excited',
    color: 'purple'
  }
];

export default socializationReactions;
