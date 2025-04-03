
export interface MedicationInfo {
  id: string;
  name: string;
  dosage?: string;
  frequency: string;
  lastAdministered: string;
  nextDue?: string;
  status?: string;
}

export interface MedicationsLogProps {
  dogId?: string;
  onRefresh?: () => void;
}

export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  dog_photo: string;
  breed: string;
}

export interface DogInfoProps {
  dogId: string;
  dogName: string;
  dogPhoto: string;
  breed: string;
}

export interface LastMedicationInfoProps {
  dogId: string;
  name: string;
  lastAdministered: string;
  frequency: string;
}
