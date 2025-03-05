export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      breeders: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          breeder_id: string | null
          contract_date: string
          contract_type: string | null
          created_at: string | null
          customer_id: string | null
          document_url: string | null
          id: string
          notes: string | null
          price: number | null
          puppy_id: string | null
          signed: boolean | null
        }
        Insert: {
          breeder_id?: string | null
          contract_date: string
          contract_type?: string | null
          created_at?: string | null
          customer_id?: string | null
          document_url?: string | null
          id?: string
          notes?: string | null
          price?: number | null
          puppy_id?: string | null
          signed?: boolean | null
        }
        Update: {
          breeder_id?: string | null
          contract_date?: string
          contract_type?: string | null
          created_at?: string | null
          customer_id?: string | null
          document_url?: string | null
          id?: string
          notes?: string | null
          price?: number | null
          puppy_id?: string | null
          signed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "breeders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      dogs: {
        Row: {
          birthdate: string | null
          breed: string
          created_at: string | null
          gender: string | null
          id: string
          microchip_number: string | null
          name: string
          owner_id: string | null
          photo_url: string | null
        }
        Insert: {
          birthdate?: string | null
          breed: string
          created_at?: string | null
          gender?: string | null
          id?: string
          microchip_number?: string | null
          name: string
          owner_id?: string | null
          photo_url?: string | null
        }
        Update: {
          birthdate?: string | null
          breed?: string
          created_at?: string | null
          gender?: string | null
          id?: string
          microchip_number?: string | null
          name?: string
          owner_id?: string | null
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dogs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "breeders"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          created_at: string | null
          document_url: string | null
          dog_id: string | null
          id: string
          record_notes: string | null
          vet_name: string
          visit_date: string
        }
        Insert: {
          created_at?: string | null
          document_url?: string | null
          dog_id?: string | null
          id?: string
          record_notes?: string | null
          vet_name: string
          visit_date: string
        }
        Update: {
          created_at?: string | null
          document_url?: string | null
          dog_id?: string | null
          id?: string
          record_notes?: string | null
          vet_name?: string
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          breeder_id: string | null
          created_at: string | null
          document_url: string | null
          expiry_date: string | null
          id: string
          issued_date: string | null
          license_number: string | null
          license_type: string
        }
        Insert: {
          breeder_id?: string | null
          created_at?: string | null
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string | null
          license_number?: string | null
          license_type: string
        }
        Update: {
          breeder_id?: string | null
          created_at?: string | null
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string | null
          license_number?: string | null
          license_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "breeders"
            referencedColumns: ["id"]
          },
        ]
      }
      litters: {
        Row: {
          birth_date: string
          created_at: string | null
          dam_id: string | null
          id: string
          notes: string | null
          puppy_count: number | null
          sire_id: string | null
        }
        Insert: {
          birth_date: string
          created_at?: string | null
          dam_id?: string | null
          id?: string
          notes?: string | null
          puppy_count?: number | null
          sire_id?: string | null
        }
        Update: {
          birth_date?: string
          created_at?: string | null
          dam_id?: string | null
          id?: string
          notes?: string | null
          puppy_count?: number | null
          sire_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "litters_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "litters_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      puppies: {
        Row: {
          created_at: string | null
          gender: string | null
          id: string
          litter_id: string | null
          microchip_number: string | null
          name: string | null
          photo_url: string | null
          reservation_date: string | null
          sale_price: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          gender?: string | null
          id?: string
          litter_id?: string | null
          microchip_number?: string | null
          name?: string | null
          photo_url?: string | null
          reservation_date?: string | null
          sale_price?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          gender?: string | null
          id?: string
          litter_id?: string | null
          microchip_number?: string | null
          name?: string | null
          photo_url?: string | null
          reservation_date?: string | null
          sale_price?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "puppies_litter_id_fkey"
            columns: ["litter_id"]
            isOneToOne: false
            referencedRelation: "litters"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string | null
          customer_id: string | null
          deposit_amount: number | null
          id: string
          notes: string | null
          puppy_id: string | null
          reservation_date: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          deposit_amount?: number | null
          id?: string
          notes?: string | null
          puppy_id?: string | null
          reservation_date: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          deposit_amount?: number | null
          id?: string
          notes?: string | null
          puppy_id?: string | null
          reservation_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          breeder_id: string | null
          category: string | null
          created_at: string | null
          dog_id: string | null
          id: string
          notes: string | null
          puppy_id: string | null
          receipt_url: string | null
          transaction_date: string
          transaction_type: string | null
        }
        Insert: {
          amount: number
          breeder_id?: string | null
          category?: string | null
          created_at?: string | null
          dog_id?: string | null
          id?: string
          notes?: string | null
          puppy_id?: string | null
          receipt_url?: string | null
          transaction_date: string
          transaction_type?: string | null
        }
        Update: {
          amount?: number
          breeder_id?: string | null
          category?: string | null
          created_at?: string | null
          dog_id?: string | null
          id?: string
          notes?: string | null
          puppy_id?: string | null
          receipt_url?: string | null
          transaction_date?: string
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "breeders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
