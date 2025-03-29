
/**
 * This file provides mock genetic data for dogs when real data isn't available
 * It will be replaced with real data from API/database when available
 */

export function getMockGeneticData(dogId: string) {
  return {
    dogId,
    tests: [
      {
        id: `test-${dogId}-1`,
        dog_id: dogId,
        test_type: 'Color Panel',
        test_date: '2023-10-15',
        result: 'E/e, B/B, d/d, a/a, k/k',
        lab_name: 'Animal Genetics',
        certificate_url: null,
        verified: true,
        created_at: '2023-10-16T10:00:00Z',
        updated_at: '2023-10-16T10:00:00Z'
      },
      {
        id: `test-${dogId}-2`,
        dog_id: dogId,
        test_type: 'DM (Degenerative Myelopathy)',
        test_date: '2023-10-15',
        result: 'Clear (N/N)',
        lab_name: 'Animal Genetics',
        certificate_url: null,
        verified: true,
        created_at: '2023-10-16T10:00:00Z',
        updated_at: '2023-10-16T10:00:00Z'
      },
      {
        id: `test-${dogId}-3`,
        dog_id: dogId,
        test_type: 'vWD (von Willebrand Disease)',
        test_date: '2023-10-15',
        result: 'Carrier (N/A)',
        lab_name: 'Animal Genetics',
        certificate_url: null,
        verified: true,
        created_at: '2023-10-16T10:00:00Z',
        updated_at: '2023-10-16T10:00:00Z'
      }
    ]
  };
}

// Generate random health status for testing
export function getRandomStatus() {
  const statuses = ['clear', 'carrier', 'affected'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// Generate random genotype notation for testing
export function getRandomGenotype(status: string) {
  switch (status) {
    case 'clear': return 'N/N';
    case 'carrier': return 'N/A';
    case 'affected': return 'A/A';
    default: return 'N/N';
  }
}
