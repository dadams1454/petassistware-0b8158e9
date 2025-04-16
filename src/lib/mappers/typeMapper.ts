
/**
 * Type mappers for converting between different type systems
 */
import type { Dog } from '@/types/dog';
import type { Puppy } from '@/types/puppy';
import type { WeightRecord } from '@/types/weight';
import type { HealthRecord } from '@/types/health';
import type { HeatCycle } from '@/types/heat-cycles';
import { mapHeatIntensityToType } from '@/types/heat-cycles';

/**
 * Map a legacy dog to a core dog
 */
export function mapToCoreDog(dog: any): Dog {
  return {
    id: dog.id,
    name: dog.name || '',
    breed: dog.breed || '',
    gender: dog.gender || 'unknown',
    status: dog.status || 'active',
    birth_date: dog.birth_date || null,
    color: dog.color || '',
    registration_number: dog.registration_number || '',
    microchip_number: dog.microchip_number || '',
    sire_id: dog.sire_id || null,
    dam_id: dog.dam_id || null,
    owner_id: dog.owner_id || null,
    created_at: dog.created_at || new Date().toISOString(),
    updated_at: dog.updated_at || new Date().toISOString(),
  };
}

/**
 * Map a legacy puppy to a core puppy
 */
export function mapToCorePuppy(puppy: any): Puppy {
  return {
    id: puppy.id,
    name: puppy.name || '',
    litter_id: puppy.litter_id || '',
    gender: puppy.gender || 'unknown',
    color: puppy.color || '',
    status: puppy.status || 'available',
    birthdate: puppy.birthdate || puppy.birth_date || null,
    birth_date: puppy.birth_date || puppy.birthdate || null,
    birth_weight: puppy.birth_weight || null,
    current_weight: puppy.current_weight || null,
    collar_color: puppy.collar_color || '',
    markings: puppy.markings || '',
    created_at: puppy.created_at || new Date().toISOString(),
    updated_at: puppy.updated_at || new Date().toISOString(),
  };
}

/**
 * Map a weight record
 */
export function mapToWeightRecord(record: any): WeightRecord {
  // Handle both weight_unit and unit for backwards compatibility
  const weightUnit = record.weight_unit || record.unit || 'lb';
  
  return {
    id: record.id,
    dog_id: record.dog_id || null,
    puppy_id: record.puppy_id || null,
    weight: Number(record.weight),
    weight_unit: weightUnit,
    date: record.date,
    notes: record.notes || '',
    percent_change: record.percent_change !== undefined ? Number(record.percent_change) : null,
    created_at: record.created_at || new Date().toISOString(),
    age_days: record.age_days !== undefined ? Number(record.age_days) : null,
    birth_date: record.birth_date || null,
  };
}

/**
 * Map a health record
 */
export function mapToHealthRecord(record: any): HealthRecord {
  return {
    id: record.id,
    dog_id: record.dog_id || null,
    record_type: record.record_type || 'note',
    timestamp: record.timestamp || record.date || new Date().toISOString(),
    notes: record.notes || '',
    created_by: record.created_by || null,
    created_at: record.created_at || new Date().toISOString(),
    updated_at: record.updated_at || new Date().toISOString(),
  };
}

/**
 * Map a module dog to a core dog
 */
export function mapToModuleDog(dog: any): Dog {
  return mapToCoreDog(dog);
}

/**
 * Map a heat cycle from supabase
 */
export function mapToHeatCycle(cycle: any): HeatCycle {
  return {
    id: cycle.id,
    dog_id: cycle.dog_id,
    cycle_number: Number(cycle.cycle_number),
    start_date: cycle.start_date,
    end_date: cycle.end_date || null,
    cycle_length: cycle.cycle_length ? Number(cycle.cycle_length) : null,
    intensity: mapHeatIntensityToType(cycle.intensity),
    symptoms: Array.isArray(cycle.symptoms) ? cycle.symptoms : [],
    fertility_indicators: cycle.fertility_indicators || {},
    notes: cycle.notes || '',
    recorded_by: cycle.recorded_by || null,
    created_at: cycle.created_at || new Date().toISOString(),
    updated_at: cycle.updated_at || null
  };
}
