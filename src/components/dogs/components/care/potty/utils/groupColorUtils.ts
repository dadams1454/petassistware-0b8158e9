
// Utility function to get color classes based on group color
export function getColorClass(color: string | null): string {
  switch (color) {
    case 'blue': return 'border-blue-300';
    case 'green': return 'border-green-300';
    case 'teal': return 'border-teal-300';
    case 'purple': return 'border-purple-300';
    case 'yellow': return 'border-yellow-300';
    case 'red': return 'border-red-300';
    default: return 'border-gray-300';
  }
}
