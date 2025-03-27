
import { InfoIcon } from "lucide-react";

/**
 * Contains detailed information about different vaccination types for dogs
 */
export const vaccinationInfo = {
  rabies: {
    name: "Rabies",
    description: "Protects against the rabies virus, which is fatal and can be transmitted to humans. Required by law in most areas.",
    schedule: "Given at 12-16 weeks, then boosted after 1 year, followed by boosters every 1-3 years depending on vaccine type.",
    icon: InfoIcon,
  },
  distemper: {
    name: "Distemper",
    description: "Protects against canine distemper virus which affects respiratory, gastrointestinal, and nervous systems.",
    schedule: "Given in a series of shots during puppyhood, followed by boosters every 1-3 years.",
    icon: InfoIcon,
  },
  parvovirus: {
    name: "Parvovirus",
    description: "Protects against a highly contagious virus that causes severe, often fatal gastrointestinal disease, especially in puppies.",
    schedule: "Part of core puppy vaccines, given in a series, followed by boosters every 1-3 years.",
    icon: InfoIcon,
  },
  adenovirus: {
    name: "Adenovirus",
    description: "Protects against infectious canine hepatitis, which affects the liver, kidneys, and eyes.",
    schedule: "Given as part of core puppy vaccines, followed by boosters every 1-3 years.",
    icon: InfoIcon,
  },
  leptospirosis: {
    name: "Leptospirosis",
    description: "Protects against bacterial infection that can damage the liver and kidneys. Can be transmitted to humans.",
    schedule: "Given annually in areas where the disease is common. May require initial series of two shots.",
    icon: InfoIcon,
  },
  bordetella: {
    name: "Bordetella",
    description: "Protects against kennel cough, a highly contagious respiratory infection. Often required for boarding, grooming, or training.",
    schedule: "Given annually or bi-annually, depending on risk factors.",
    icon: InfoIcon,
  },
  lyme: {
    name: "Lyme Disease",
    description: "Protects against Lyme disease, a tick-borne illness that can cause joint pain, lameness, and kidney disease.",
    schedule: "Given annually in areas where ticks carrying Lyme disease are common.",
    icon: InfoIcon,
  },
  combo: {
    name: "Combo (DHPP)",
    description: "Combination vaccine that protects against Distemper, Hepatitis (Adenovirus), Parainfluenza, and Parvovirus.",
    schedule: "Given in a series during puppyhood, followed by boosters every 1-3 years.",
    icon: InfoIcon,
  }
};

/**
 * Returns information about a specific vaccination type
 * @param type The vaccination type
 * @returns Object containing information about the vaccination
 */
export const getVaccinationInfo = (type: string) => {
  return vaccinationInfo[type as keyof typeof vaccinationInfo] || {
    name: type,
    description: "Information not available",
    schedule: "Consult your veterinarian",
    icon: InfoIcon,
  };
};

/**
 * Map vaccination type to human-readable name
 * @param type Vaccination type
 * @returns Human-readable name
 */
export const getVaccinationTypeLabel = (type: string) => {
  const info = vaccinationInfo[type as keyof typeof vaccinationInfo];
  return info ? info.name : type;
};
