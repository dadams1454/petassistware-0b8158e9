
/**
 * Type definitions for JSON data structures used in the application
 */

// Used for generic JSON typing
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];

// Typed interfaces for genetics JSON data
export interface GeneticProfile {
  dog_id: string;
  breed_composition?: JsonObject;
  trait_results?: JsonObject;
  health_results?: JsonObject;
  raw_data?: JsonObject;
  [key: string]: any;
}

export interface GeneticAnalysisResult {
  compatibility: number;
  healthRisks: JsonObject;
  colorProbabilities: JsonObject;
  recommendations: string[];
}
