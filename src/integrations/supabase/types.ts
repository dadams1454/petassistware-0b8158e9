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
      activities: {
        Row: {
          activity_type: string
          breeder_id: string
          created_at: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          activity_type: string
          breeder_id: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          activity_type?: string
          breeder_id?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      analytics_summaries: {
        Row: {
          breeding_statistics: Json | null
          created_at: string | null
          customer_statistics: Json | null
          end_date: string
          financial_statistics: Json | null
          health_statistics: Json | null
          id: string
          operational_statistics: Json | null
          puppy_statistics: Json | null
          social_statistics: Json | null
          start_date: string
          summary_period: string
          tenant_id: string | null
          updated_at: string | null
          user_id: string | null
          website_statistics: Json | null
        }
        Insert: {
          breeding_statistics?: Json | null
          created_at?: string | null
          customer_statistics?: Json | null
          end_date: string
          financial_statistics?: Json | null
          health_statistics?: Json | null
          id?: string
          operational_statistics?: Json | null
          puppy_statistics?: Json | null
          social_statistics?: Json | null
          start_date: string
          summary_period: string
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_statistics?: Json | null
        }
        Update: {
          breeding_statistics?: Json | null
          created_at?: string | null
          customer_statistics?: Json | null
          end_date?: string
          financial_statistics?: Json | null
          health_statistics?: Json | null
          id?: string
          operational_statistics?: Json | null
          puppy_statistics?: Json | null
          social_statistics?: Json | null
          start_date?: string
          summary_period?: string
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_statistics?: Json | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          affected_records: number | null
          application_version: string | null
          browser_info: string | null
          client_ip: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          error_details: string | null
          id: string
          ip_address: string | null
          new_state: Json | null
          notes: string | null
          os_info: string | null
          previous_state: Json | null
          request_id: string | null
          session_id: string | null
          success_status: boolean | null
          tenant_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action: string
          affected_records?: number | null
          application_version?: string | null
          browser_info?: string | null
          client_ip?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          error_details?: string | null
          id?: string
          ip_address?: string | null
          new_state?: Json | null
          notes?: string | null
          os_info?: string | null
          previous_state?: Json | null
          request_id?: string | null
          session_id?: string | null
          success_status?: boolean | null
          tenant_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action?: string
          affected_records?: number | null
          application_version?: string | null
          browser_info?: string | null
          client_ip?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          error_details?: string | null
          id?: string
          ip_address?: string | null
          new_state?: Json | null
          notes?: string | null
          os_info?: string | null
          previous_state?: Json | null
          request_id?: string | null
          session_id?: string | null
          success_status?: boolean | null
          tenant_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      breed_colors: {
        Row: {
          breed: string
          color_code: string | null
          color_name: string
          created_at: string
          id: string
          is_akc_recognized: boolean
        }
        Insert: {
          breed: string
          color_code?: string | null
          color_name: string
          created_at?: string
          id?: string
          is_akc_recognized?: boolean
        }
        Update: {
          breed?: string
          color_code?: string | null
          color_name?: string
          created_at?: string
          id?: string
          is_akc_recognized?: boolean
        }
        Relationships: []
      }
      breeder_profiles: {
        Row: {
          breeding_experience: string | null
          business_details: string | null
          business_name: string | null
          business_overview: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          profile_image_url: string | null
          role: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          breeding_experience?: string | null
          business_details?: string | null
          business_name?: string | null
          business_overview?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          profile_image_url?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          breeding_experience?: string | null
          business_details?: string | null
          business_name?: string | null
          business_overview?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_image_url?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      breeding_records: {
        Row: {
          breeding_date: string
          created_at: string
          created_by: string | null
          dog_id: string
          id: string
          method: string | null
          notes: string | null
          sire_id: string | null
          success: boolean | null
        }
        Insert: {
          breeding_date: string
          created_at?: string
          created_by?: string | null
          dog_id: string
          id?: string
          method?: string | null
          notes?: string | null
          sire_id?: string | null
          success?: boolean | null
        }
        Update: {
          breeding_date?: string
          created_at?: string
          created_by?: string | null
          dog_id?: string
          id?: string
          method?: string | null
          notes?: string | null
          sire_id?: string | null
          success?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "breeding_records_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_records_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      care_activities: {
        Row: {
          activity_type: string
          created_at: string
          dog_id: string
          id: string
          notes: string | null
          performed_by: string | null
          timestamp: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          dog_id: string
          id?: string
          notes?: string | null
          performed_by?: string | null
          timestamp: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          dog_id?: string
          id?: string
          notes?: string | null
          performed_by?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_activities_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      care_task_presets: {
        Row: {
          breeder_id: string | null
          category: string
          created_at: string
          id: string
          is_default: boolean
          task_name: string
        }
        Insert: {
          breeder_id?: string | null
          category: string
          created_at?: string
          id?: string
          is_default?: boolean
          task_name: string
        }
        Update: {
          breeder_id?: string | null
          category?: string
          created_at?: string
          id?: string
          is_default?: boolean
          task_name?: string
        }
        Relationships: []
      }
      checklist_completions: {
        Row: {
          completed_by: string | null
          completed_date: string
          created_at: string
          id: string
          item_id: string
          litter_checklist_id: string
          notes: string | null
          value: string | null
        }
        Insert: {
          completed_by?: string | null
          completed_date?: string
          created_at?: string
          id?: string
          item_id: string
          litter_checklist_id: string
          notes?: string | null
          value?: string | null
        }
        Update: {
          completed_by?: string | null
          completed_date?: string
          created_at?: string
          id?: string
          item_id?: string
          litter_checklist_id?: string
          notes?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_completions_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "breeder_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_completions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_completions_litter_checklist_id_fkey"
            columns: ["litter_checklist_id"]
            isOneToOne: false
            referencedRelation: "litter_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          category: string | null
          completion_type: string | null
          created_at: string
          description: string | null
          frequency: string | null
          id: string
          order_index: number
          priority: string | null
          reminder_offset: number | null
          task: string
          template_id: string
          value_unit: string | null
        }
        Insert: {
          category?: string | null
          completion_type?: string | null
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          order_index: number
          priority?: string | null
          reminder_offset?: number | null
          task: string
          template_id: string
          value_unit?: string | null
        }
        Update: {
          category?: string | null
          completion_type?: string | null
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          order_index?: number
          priority?: string | null
          reminder_offset?: number | null
          task?: string
          template_id?: string
          value_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          applicable_end_day: number | null
          applicable_start_day: number | null
          category: string
          created_at: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          applicable_end_day?: number | null
          applicable_start_day?: number | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          applicable_end_day?: number | null
          applicable_start_day?: number | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      color_genetics: {
        Row: {
          breed: string
          color_name: string
          created_at: string
          genotype: string
          id: string
          inheritance_pattern: string
          is_dominant: boolean
        }
        Insert: {
          breed: string
          color_name: string
          created_at?: string
          genotype: string
          id?: string
          inheritance_pattern: string
          is_dominant?: boolean
        }
        Update: {
          breed?: string
          color_name?: string
          created_at?: string
          genotype?: string
          id?: string
          inheritance_pattern?: string
          is_dominant?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "color_genetics_breed_color_name_fkey"
            columns: ["breed", "color_name"]
            isOneToOne: false
            referencedRelation: "breed_colors"
            referencedColumns: ["breed", "color_name"]
          },
        ]
      }
      color_inheritance_rules: {
        Row: {
          breed: string
          created_at: string
          id: string
          offspring_genotype: string
          parent1_genotype: string
          parent2_genotype: string
          probability: number
        }
        Insert: {
          breed: string
          created_at?: string
          id?: string
          offspring_genotype: string
          parent1_genotype: string
          parent2_genotype: string
          probability: number
        }
        Update: {
          breed?: string
          created_at?: string
          id?: string
          offspring_genotype?: string
          parent1_genotype?: string
          parent2_genotype?: string
          probability?: number
        }
        Relationships: []
      }
      communication_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          subject: string | null
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          subject?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      compliance_requirements: {
        Row: {
          breeder_id: string | null
          category: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string
          reminder_sent: boolean
          status: string
          title: string
        }
        Insert: {
          breeder_id?: string | null
          category: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string
          reminder_sent?: boolean
          status?: string
          title: string
        }
        Update: {
          breeder_id?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          reminder_sent?: boolean
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_requirements_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "breeder_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      customer_communications: {
        Row: {
          content: string
          created_at: string
          customer_id: string
          id: string
          sent_at: string
          status: string
          subject: string | null
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          customer_id: string
          id?: string
          sent_at?: string
          status: string
          subject?: string | null
          type: string
        }
        Update: {
          content?: string
          created_at?: string
          customer_id?: string
          id?: string
          sent_at?: string
          status?: string
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_preferences: {
        Row: {
          created_at: string | null
          customer_id: string
          dealbreakers: string[] | null
          has_children: boolean | null
          has_other_pets: boolean | null
          housing_type: string | null
          id: string
          important_qualities: string[] | null
          lifestyle_description: string | null
          match_score_threshold: number | null
          preference_updated_at: string | null
          preferred_activity_level: string | null
          preferred_age_range: unknown | null
          preferred_colors: string[] | null
          preferred_gender: string[] | null
          preferred_sizes: string[] | null
          preferred_temperament: string[] | null
          willing_to_wait: boolean | null
          yard_size: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          dealbreakers?: string[] | null
          has_children?: boolean | null
          has_other_pets?: boolean | null
          housing_type?: string | null
          id?: string
          important_qualities?: string[] | null
          lifestyle_description?: string | null
          match_score_threshold?: number | null
          preference_updated_at?: string | null
          preferred_activity_level?: string | null
          preferred_age_range?: unknown | null
          preferred_colors?: string[] | null
          preferred_gender?: string[] | null
          preferred_sizes?: string[] | null
          preferred_temperament?: string[] | null
          willing_to_wait?: boolean | null
          yard_size?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          dealbreakers?: string[] | null
          has_children?: boolean | null
          has_other_pets?: boolean | null
          housing_type?: string | null
          id?: string
          important_qualities?: string[] | null
          lifestyle_description?: string | null
          match_score_threshold?: number | null
          preference_updated_at?: string | null
          preferred_activity_level?: string | null
          preferred_age_range?: unknown | null
          preferred_colors?: string[] | null
          preferred_gender?: string[] | null
          preferred_sizes?: string[] | null
          preferred_temperament?: string[] | null
          willing_to_wait?: boolean | null
          yard_size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
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
          metadata: Json | null
          notes: string | null
          phone: string | null
          tenant_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          metadata?: Json | null
          notes?: string | null
          phone?: string | null
          tenant_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          metadata?: Json | null
          notes?: string | null
          phone?: string | null
          tenant_id?: string | null
        }
        Relationships: []
      }
      daily_care_logs: {
        Row: {
          category: string
          created_at: string
          created_by: string
          dog_id: string
          id: string
          medication_metadata: Json | null
          notes: string | null
          task_name: string
          timestamp: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          dog_id: string
          id?: string
          medication_metadata?: Json | null
          notes?: string | null
          task_name: string
          timestamp?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          dog_id?: string
          id?: string
          medication_metadata?: Json | null
          notes?: string | null
          task_name?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_care_logs_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      deposits: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          customer_id: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: string
          payment_status: string
          puppy_id: string | null
          receipt_url: string | null
          reservation_id: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method: string
          payment_status?: string
          puppy_id?: string | null
          receipt_url?: string | null
          reservation_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_status?: string
          puppy_id?: string | null
          receipt_url?: string | null
          reservation_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deposits_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_documents: {
        Row: {
          created_at: string | null
          document_type: string
          dog_id: string
          file_name: string
          file_url: string
          id: string
          notes: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          document_type: string
          dog_id: string
          file_name: string
          file_url: string
          id?: string
          notes?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          document_type?: string
          dog_id?: string
          file_name?: string
          file_url?: string
          id?: string
          notes?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_documents_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_genetic_calculations: {
        Row: {
          calculation_date: string | null
          calculation_type: string
          dog_id: string
          id: string
          value: number
        }
        Insert: {
          calculation_date?: string | null
          calculation_type: string
          dog_id: string
          id?: string
          value: number
        }
        Update: {
          calculation_date?: string | null
          calculation_type?: string
          dog_id?: string
          id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "dog_genetic_calculations_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_genetic_tests: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          created_by: string | null
          dog_id: string
          id: string
          lab_name: string
          result: string
          test_date: string
          test_type: string
          updated_at: string | null
          verified: boolean | null
          verified_by: string | null
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          created_by?: string | null
          dog_id: string
          id?: string
          lab_name: string
          result: string
          test_date: string
          test_type: string
          updated_at?: string | null
          verified?: boolean | null
          verified_by?: string | null
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          created_by?: string | null
          dog_id?: string
          id?: string
          lab_name?: string
          result?: string
          test_date?: string
          test_type?: string
          updated_at?: string | null
          verified?: boolean | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dog_genetic_tests_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_group_members: {
        Row: {
          created_at: string
          dog_id: string
          group_id: string
          id: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          group_id: string
          id?: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_group_members_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dog_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_groups: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          tenant_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          tenant_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string | null
        }
        Relationships: []
      }
      dog_incompatibilities: {
        Row: {
          active: boolean | null
          created_at: string
          dog_id: string
          id: string
          incompatible_with: string
          reason: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          dog_id: string
          id?: string
          incompatible_with: string
          reason?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          dog_id?: string
          id?: string
          incompatible_with?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dog_incompatibilities_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_incompatibilities_incompatible_with_fkey"
            columns: ["incompatible_with"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_photos: {
        Row: {
          created_at: string
          dog_id: string
          id: string
          url: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          id?: string
          url: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_photos_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_relationships: {
        Row: {
          created_at: string | null
          dog_id: string
          id: string
          related_dog_id: string
          relationship_type: string
        }
        Insert: {
          created_at?: string | null
          dog_id: string
          id?: string
          related_dog_id: string
          relationship_type: string
        }
        Update: {
          created_at?: string | null
          dog_id?: string
          id?: string
          related_dog_id?: string
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_relationships_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_relationships_related_dog_id_fkey"
            columns: ["related_dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_vaccinations: {
        Row: {
          created_at: string
          dog_id: string
          id: string
          notes: string | null
          vaccination_date: string
          vaccination_type: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          id?: string
          notes?: string | null
          vaccination_date: string
          vaccination_type: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          id?: string
          notes?: string | null
          vaccination_date?: string
          vaccination_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_vaccinations_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dogs: {
        Row: {
          birthdate: string | null
          breed: string
          color: string | null
          created_at: string | null
          gender: string | null
          id: string
          is_pregnant: boolean | null
          last_heat_date: string | null
          last_vaccination_date: string | null
          litter_number: number | null
          max_time_between_breaks: number | null
          microchip_number: string | null
          name: string
          notes: string | null
          owner_id: string | null
          pedigree: boolean | null
          photo_url: string | null
          potty_alert_threshold: number | null
          registration_number: string | null
          requires_special_handling: boolean | null
          tenant_id: string | null
          tie_date: string | null
          vaccination_notes: string | null
          vaccination_type: string | null
          weight: number | null
        }
        Insert: {
          birthdate?: string | null
          breed: string
          color?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          is_pregnant?: boolean | null
          last_heat_date?: string | null
          last_vaccination_date?: string | null
          litter_number?: number | null
          max_time_between_breaks?: number | null
          microchip_number?: string | null
          name: string
          notes?: string | null
          owner_id?: string | null
          pedigree?: boolean | null
          photo_url?: string | null
          potty_alert_threshold?: number | null
          registration_number?: string | null
          requires_special_handling?: boolean | null
          tenant_id?: string | null
          tie_date?: string | null
          vaccination_notes?: string | null
          vaccination_type?: string | null
          weight?: number | null
        }
        Update: {
          birthdate?: string | null
          breed?: string
          color?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          is_pregnant?: boolean | null
          last_heat_date?: string | null
          last_vaccination_date?: string | null
          litter_number?: number | null
          max_time_between_breaks?: number | null
          microchip_number?: string | null
          name?: string
          notes?: string | null
          owner_id?: string | null
          pedigree?: boolean | null
          photo_url?: string | null
          potty_alert_threshold?: number | null
          registration_number?: string | null
          requires_special_handling?: boolean | null
          tenant_id?: string | null
          tie_date?: string | null
          vaccination_notes?: string | null
          vaccination_type?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      environmental_monitoring: {
        Row: {
          air_quality: number | null
          alert_details: string | null
          alert_triggered: boolean | null
          battery_level: number | null
          created_at: string | null
          device_id: string
          humidity: number | null
          id: string
          light_level: number | null
          location_id: string
          location_name: string
          motion_detected: boolean | null
          noise_level: number | null
          reading_time: string | null
          sensor_type: string
          temperature: number | null
          tenant_id: string | null
        }
        Insert: {
          air_quality?: number | null
          alert_details?: string | null
          alert_triggered?: boolean | null
          battery_level?: number | null
          created_at?: string | null
          device_id: string
          humidity?: number | null
          id?: string
          light_level?: number | null
          location_id: string
          location_name: string
          motion_detected?: boolean | null
          noise_level?: number | null
          reading_time?: string | null
          sensor_type: string
          temperature?: number | null
          tenant_id?: string | null
        }
        Update: {
          air_quality?: number | null
          alert_details?: string | null
          alert_triggered?: boolean | null
          battery_level?: number | null
          created_at?: string | null
          device_id?: string
          humidity?: number | null
          id?: string
          light_level?: number | null
          location_id?: string
          location_name?: string
          motion_detected?: boolean | null
          noise_level?: number | null
          reading_time?: string | null
          sensor_type?: string
          temperature?: number | null
          tenant_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          breeder_id: string
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          is_recurring: boolean | null
          recurrence_end_date: string | null
          recurrence_pattern: string | null
          status: string
          title: string
        }
        Insert: {
          breeder_id: string
          created_at?: string
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          is_recurring?: boolean | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          status?: string
          title: string
        }
        Update: {
          breeder_id?: string
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          is_recurring?: boolean | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      facility_areas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      facility_checklist_submissions: {
        Row: {
          comments: string | null
          completed_by: string | null
          created_at: string
          created_by: string | null
          date: string
          id: string
          verified_by: string | null
        }
        Insert: {
          comments?: string | null
          completed_by?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          verified_by?: string | null
        }
        Update: {
          comments?: string | null
          completed_by?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          verified_by?: string | null
        }
        Relationships: []
      }
      facility_checklist_tasks: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          initials: string | null
          staff_id: string | null
          submission_id: string | null
          task_description: string
          task_id: string | null
          timestamp: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          initials?: string | null
          staff_id?: string | null
          submission_id?: string | null
          task_description: string
          task_id?: string | null
          timestamp?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          initials?: string | null
          staff_id?: string | null
          submission_id?: string | null
          task_description?: string
          task_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_checklist_tasks_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "facility_checklist_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facility_checklist_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "facility_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_staff: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      facility_task_logs: {
        Row: {
          completed_at: string
          completed_by: string
          created_at: string
          id: string
          notes: string | null
          status: string
          task_id: string
        }
        Insert: {
          completed_at?: string
          completed_by: string
          created_at?: string
          id?: string
          notes?: string | null
          status: string
          task_id: string
        }
        Update: {
          completed_at?: string
          completed_by?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_task_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "facility_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_tasks: {
        Row: {
          active: boolean | null
          area_id: string | null
          created_at: string
          custom_days: number[] | null
          description: string | null
          frequency: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          area_id?: string | null
          created_at?: string
          custom_days?: number[] | null
          description?: string | null
          frequency: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          area_id?: string | null
          created_at?: string
          custom_days?: number[] | null
          description?: string | null
          frequency?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_tasks_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "facility_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_records: {
        Row: {
          amount_consumed: string | null
          amount_offered: string
          created_at: string
          dog_id: string
          food_type: string
          id: string
          notes: string | null
          schedule_id: string | null
          staff_id: string
          timestamp: string
        }
        Insert: {
          amount_consumed?: string | null
          amount_offered: string
          created_at?: string
          dog_id: string
          food_type: string
          id?: string
          notes?: string | null
          schedule_id?: string | null
          staff_id: string
          timestamp?: string
        }
        Update: {
          amount_consumed?: string | null
          amount_offered?: string
          created_at?: string
          dog_id?: string
          food_type?: string
          id?: string
          notes?: string | null
          schedule_id?: string | null
          staff_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeding_records_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeding_records_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "feeding_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_schedules: {
        Row: {
          active: boolean
          amount: string
          created_at: string
          dog_id: string
          food_type: string
          id: string
          schedule_time: string[]
          special_instructions: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount: string
          created_at?: string
          dog_id: string
          food_type: string
          id?: string
          schedule_time: string[]
          special_instructions?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount?: string
          created_at?: string
          dog_id?: string
          food_type?: string
          id?: string
          schedule_time?: string[]
          special_instructions?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeding_schedules_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      genetic_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json
          dog_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details: Json
          dog_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json
          dog_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "genetic_audit_logs_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      genetic_data: {
        Row: {
          breed_composition: Json | null
          breed_lineage: Json | null
          created_at: string | null
          created_by: string | null
          dog_id: string
          genetic_age: number | null
          genetic_diversity: number | null
          health_results: Json | null
          id: string
          import_reference_id: string | null
          import_source: string
          imported_at: string | null
          inbreeding_coefficient: number | null
          maternal_haplogroup: string | null
          paternal_haplogroup: string | null
          raw_data: Json | null
          trait_results: Json | null
          updated_at: string | null
          wolfiness: number | null
        }
        Insert: {
          breed_composition?: Json | null
          breed_lineage?: Json | null
          created_at?: string | null
          created_by?: string | null
          dog_id: string
          genetic_age?: number | null
          genetic_diversity?: number | null
          health_results?: Json | null
          id?: string
          import_reference_id?: string | null
          import_source: string
          imported_at?: string | null
          inbreeding_coefficient?: number | null
          maternal_haplogroup?: string | null
          paternal_haplogroup?: string | null
          raw_data?: Json | null
          trait_results?: Json | null
          updated_at?: string | null
          wolfiness?: number | null
        }
        Update: {
          breed_composition?: Json | null
          breed_lineage?: Json | null
          created_at?: string | null
          created_by?: string | null
          dog_id?: string
          genetic_age?: number | null
          genetic_diversity?: number | null
          health_results?: Json | null
          id?: string
          import_reference_id?: string | null
          import_source?: string
          imported_at?: string | null
          inbreeding_coefficient?: number | null
          maternal_haplogroup?: string | null
          paternal_haplogroup?: string | null
          raw_data?: Json | null
          trait_results?: Json | null
          updated_at?: string | null
          wolfiness?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "genetic_data_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      health_alerts: {
        Row: {
          created_at: string
          dog_id: string
          id: string
          indicator_id: string
          resolved: boolean
          resolved_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          id?: string
          indicator_id: string
          resolved?: boolean
          resolved_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          id?: string
          indicator_id?: string
          resolved?: boolean
          resolved_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_alerts_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_alerts_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "health_indicators"
            referencedColumns: ["id"]
          },
        ]
      }
      health_indicators: {
        Row: {
          abnormal: boolean | null
          alert_generated: boolean | null
          appetite: string | null
          created_at: string
          created_by: string | null
          date: string
          dog_id: string
          energy: string | null
          id: string
          notes: string | null
          stool_consistency: string | null
        }
        Insert: {
          abnormal?: boolean | null
          alert_generated?: boolean | null
          appetite?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          dog_id: string
          energy?: string | null
          id?: string
          notes?: string | null
          stool_consistency?: string | null
        }
        Update: {
          abnormal?: boolean | null
          alert_generated?: boolean | null
          appetite?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          dog_id?: string
          energy?: string | null
          id?: string
          notes?: string | null
          stool_consistency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_indicators_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      health_protocols: {
        Row: {
          completed_date: string | null
          created_at: string
          id: string
          litter_id: string
          lot_number: string | null
          manufacturer: string | null
          notes: string | null
          product: string | null
          protocol_type: string
          scheduled_date: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          id?: string
          litter_id: string
          lot_number?: string | null
          manufacturer?: string | null
          notes?: string | null
          product?: string | null
          protocol_type: string
          scheduled_date: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          id?: string
          litter_id?: string
          lot_number?: string | null
          manufacturer?: string | null
          notes?: string | null
          product?: string | null
          protocol_type?: string
          scheduled_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_protocols_litter_id_fkey"
            columns: ["litter_id"]
            isOneToOne: false
            referencedRelation: "litters"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          administration_route: string | null
          anesthesia_used: string | null
          created_at: string | null
          description: string | null
          document_url: string | null
          dog_id: string | null
          dosage: number | null
          dosage_unit: string | null
          duration: number | null
          duration_unit: string | null
          end_date: string | null
          examination_type: string | null
          expiration_date: string | null
          findings: string | null
          follow_up_date: string | null
          frequency: string | null
          id: string
          lot_number: string | null
          manufacturer: string | null
          medication_name: string | null
          next_due_date: string | null
          performed_by: string | null
          prescription_number: string | null
          procedure_name: string | null
          recommendations: string | null
          record_notes: string | null
          record_type: string | null
          recovery_notes: string | null
          reminder_sent: boolean | null
          start_date: string | null
          surgeon: string | null
          title: string | null
          vaccine_name: string | null
          vet_clinic: string | null
          vet_name: string
          visit_date: string
        }
        Insert: {
          administration_route?: string | null
          anesthesia_used?: string | null
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          dog_id?: string | null
          dosage?: number | null
          dosage_unit?: string | null
          duration?: number | null
          duration_unit?: string | null
          end_date?: string | null
          examination_type?: string | null
          expiration_date?: string | null
          findings?: string | null
          follow_up_date?: string | null
          frequency?: string | null
          id?: string
          lot_number?: string | null
          manufacturer?: string | null
          medication_name?: string | null
          next_due_date?: string | null
          performed_by?: string | null
          prescription_number?: string | null
          procedure_name?: string | null
          recommendations?: string | null
          record_notes?: string | null
          record_type?: string | null
          recovery_notes?: string | null
          reminder_sent?: boolean | null
          start_date?: string | null
          surgeon?: string | null
          title?: string | null
          vaccine_name?: string | null
          vet_clinic?: string | null
          vet_name: string
          visit_date: string
        }
        Update: {
          administration_route?: string | null
          anesthesia_used?: string | null
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          dog_id?: string | null
          dosage?: number | null
          dosage_unit?: string | null
          duration?: number | null
          duration_unit?: string | null
          end_date?: string | null
          examination_type?: string | null
          expiration_date?: string | null
          findings?: string | null
          follow_up_date?: string | null
          frequency?: string | null
          id?: string
          lot_number?: string | null
          manufacturer?: string | null
          medication_name?: string | null
          next_due_date?: string | null
          performed_by?: string | null
          prescription_number?: string | null
          procedure_name?: string | null
          recommendations?: string | null
          record_notes?: string | null
          record_type?: string | null
          recovery_notes?: string | null
          reminder_sent?: boolean | null
          start_date?: string | null
          surgeon?: string | null
          title?: string | null
          vaccine_name?: string | null
          vet_clinic?: string | null
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
      heat_cycles: {
        Row: {
          created_at: string
          cycle_length: number | null
          cycle_number: number | null
          dog_id: string
          end_date: string | null
          fertility_indicators: Json | null
          id: string
          intensity: string | null
          notes: string | null
          recorded_by: string | null
          start_date: string
          symptoms: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          cycle_length?: number | null
          cycle_number?: number | null
          dog_id: string
          end_date?: string | null
          fertility_indicators?: Json | null
          id?: string
          intensity?: string | null
          notes?: string | null
          recorded_by?: string | null
          start_date: string
          symptoms?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          cycle_length?: number | null
          cycle_number?: number | null
          dog_id?: string
          end_date?: string | null
          fertility_indicators?: Json | null
          id?: string
          intensity?: string | null
          notes?: string | null
          recorded_by?: string | null
          start_date?: string
          symptoms?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "heat_cycles_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          breeder_id: string | null
          created_at: string
          follow_up: string | null
          id: string
          inspection_date: string
          inspector: string | null
          next_date: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          breeder_id?: string | null
          created_at?: string
          follow_up?: string | null
          id?: string
          inspection_date: string
          inspector?: string | null
          next_date?: string | null
          notes?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          breeder_id?: string | null
          created_at?: string
          follow_up?: string | null
          id?: string
          inspection_date?: string
          inspector?: string | null
          next_date?: string | null
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "breeder_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kennel_assignments: {
        Row: {
          created_at: string
          created_by: string | null
          dog_id: string
          end_date: string | null
          id: string
          kennel_unit_id: string
          notes: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dog_id: string
          end_date?: string | null
          id?: string
          kennel_unit_id: string
          notes?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dog_id?: string
          end_date?: string | null
          id?: string
          kennel_unit_id?: string
          notes?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "kennel_assignments_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kennel_assignments_kennel_unit_id_fkey"
            columns: ["kennel_unit_id"]
            isOneToOne: false
            referencedRelation: "kennel_units"
            referencedColumns: ["id"]
          },
        ]
      }
      kennel_cleaning: {
        Row: {
          cleaned_by: string
          cleaning_date: string
          cleaning_type: string
          created_at: string
          id: string
          kennel_unit_id: string
          notes: string | null
          products_used: string[] | null
        }
        Insert: {
          cleaned_by: string
          cleaning_date: string
          cleaning_type: string
          created_at?: string
          id?: string
          kennel_unit_id: string
          notes?: string | null
          products_used?: string[] | null
        }
        Update: {
          cleaned_by?: string
          cleaning_date?: string
          cleaning_type?: string
          created_at?: string
          id?: string
          kennel_unit_id?: string
          notes?: string | null
          products_used?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "kennel_cleaning_kennel_unit_id_fkey"
            columns: ["kennel_unit_id"]
            isOneToOne: false
            referencedRelation: "kennel_units"
            referencedColumns: ["id"]
          },
        ]
      }
      kennel_cleaning_schedule: {
        Row: {
          assigned_to: string | null
          created_at: string
          day_of_week: number[] | null
          frequency: string
          id: string
          kennel_unit_id: string
          time_of_day: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          day_of_week?: number[] | null
          frequency: string
          id?: string
          kennel_unit_id: string
          time_of_day?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          day_of_week?: number[] | null
          frequency?: string
          id?: string
          kennel_unit_id?: string
          time_of_day?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kennel_cleaning_schedule_kennel_unit_id_fkey"
            columns: ["kennel_unit_id"]
            isOneToOne: false
            referencedRelation: "kennel_units"
            referencedColumns: ["id"]
          },
        ]
      }
      kennel_maintenance: {
        Row: {
          cost: number | null
          created_at: string
          description: string
          id: string
          kennel_unit_id: string
          maintenance_date: string
          maintenance_type: string
          notes: string | null
          performed_by: string
          status: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          kennel_unit_id: string
          maintenance_date: string
          maintenance_type: string
          notes?: string | null
          performed_by: string
          status: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          kennel_unit_id?: string
          maintenance_date?: string
          maintenance_type?: string
          notes?: string | null
          performed_by?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "kennel_maintenance_kennel_unit_id_fkey"
            columns: ["kennel_unit_id"]
            isOneToOne: false
            referencedRelation: "kennel_units"
            referencedColumns: ["id"]
          },
        ]
      }
      kennel_units: {
        Row: {
          capacity: number
          created_at: string
          features: string[] | null
          id: string
          location: string | null
          name: string
          notes: string | null
          size: string | null
          status: string
          unit_type: string
        }
        Insert: {
          capacity: number
          created_at?: string
          features?: string[] | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          size?: string | null
          status: string
          unit_type: string
        }
        Update: {
          capacity?: number
          created_at?: string
          features?: string[] | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          size?: string | null
          status?: string
          unit_type?: string
        }
        Relationships: []
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
        Relationships: []
      }
      litter_checklists: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          litter_id: string
          start_date: string
          template_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          litter_id: string
          start_date: string
          template_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          litter_id?: string
          start_date?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "litter_checklists_litter_id_fkey"
            columns: ["litter_id"]
            isOneToOne: false
            referencedRelation: "litters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "litter_checklists_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      litters: {
        Row: {
          akc_litter_color: string | null
          akc_registration_date: string | null
          akc_registration_number: string | null
          akc_verified: boolean | null
          birth_date: string
          breeder_id: string
          breeding_notes: string | null
          created_at: string | null
          dam_id: string | null
          documents_url: string | null
          expected_go_home_date: string | null
          female_count: number | null
          first_mating_date: string | null
          id: string
          kennel_name: string | null
          last_mating_date: string | null
          litter_name: string | null
          male_count: number | null
          notes: string | null
          puppy_count: number | null
          sire_id: string | null
          status: string | null
          whelp_date: string | null
        }
        Insert: {
          akc_litter_color?: string | null
          akc_registration_date?: string | null
          akc_registration_number?: string | null
          akc_verified?: boolean | null
          birth_date: string
          breeder_id: string
          breeding_notes?: string | null
          created_at?: string | null
          dam_id?: string | null
          documents_url?: string | null
          expected_go_home_date?: string | null
          female_count?: number | null
          first_mating_date?: string | null
          id?: string
          kennel_name?: string | null
          last_mating_date?: string | null
          litter_name?: string | null
          male_count?: number | null
          notes?: string | null
          puppy_count?: number | null
          sire_id?: string | null
          status?: string | null
          whelp_date?: string | null
        }
        Update: {
          akc_litter_color?: string | null
          akc_registration_date?: string | null
          akc_registration_number?: string | null
          akc_verified?: boolean | null
          birth_date?: string
          breeder_id?: string
          breeding_notes?: string | null
          created_at?: string | null
          dam_id?: string | null
          documents_url?: string | null
          expected_go_home_date?: string | null
          female_count?: number | null
          first_mating_date?: string | null
          id?: string
          kennel_name?: string | null
          last_mating_date?: string | null
          litter_name?: string | null
          male_count?: number | null
          notes?: string | null
          puppy_count?: number | null
          sire_id?: string | null
          status?: string | null
          whelp_date?: string | null
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
      potty_break_dogs: {
        Row: {
          created_at: string
          dog_id: string
          id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          id?: string
          session_id: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "potty_break_dogs_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "potty_break_dogs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "potty_break_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      potty_break_sessions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          session_time: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          session_time?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          session_time?: string
        }
        Relationships: []
      }
      potty_breaks: {
        Row: {
          created_at: string
          dog_id: string
          id: string
          notes: string | null
          session_time: string
          time_slot_id: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          id?: string
          notes?: string | null
          session_time?: string
          time_slot_id: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          id?: string
          notes?: string | null
          session_time?: string
          time_slot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "potty_breaks_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      pregnancy_records: {
        Row: {
          breeding_record_id: string | null
          confirmation_date: string | null
          created_at: string
          created_by: string | null
          dog_id: string
          due_date: string | null
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          breeding_record_id?: string | null
          confirmation_date?: string | null
          created_at?: string
          created_by?: string | null
          dog_id: string
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          breeding_record_id?: string | null
          confirmation_date?: string | null
          created_at?: string
          created_by?: string | null
          dog_id?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pregnancy_records_breeding_record_id_fkey"
            columns: ["breeding_record_id"]
            isOneToOne: false
            referencedRelation: "breeding_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pregnancy_records_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      puppies: {
        Row: {
          akc_litter_number: string | null
          akc_registration_number: string | null
          assistance_notes: string | null
          assistance_required: boolean | null
          birth_date: string | null
          birth_order: number | null
          birth_time: string | null
          birth_weight: string | null
          color: string | null
          created_at: string | null
          current_weight: string | null
          deworming_dates: string | null
          ears_open_date: string | null
          eyes_open_date: string | null
          first_walk_date: string | null
          fully_mobile_date: string | null
          gender: string | null
          id: string
          litter_id: string | null
          microchip_number: string | null
          name: string | null
          notes: string | null
          photo_url: string | null
          presentation: string | null
          reservation_date: string | null
          sale_price: number | null
          status: string | null
          vaccination_dates: string | null
          vet_check_dates: string | null
        }
        Insert: {
          akc_litter_number?: string | null
          akc_registration_number?: string | null
          assistance_notes?: string | null
          assistance_required?: boolean | null
          birth_date?: string | null
          birth_order?: number | null
          birth_time?: string | null
          birth_weight?: string | null
          color?: string | null
          created_at?: string | null
          current_weight?: string | null
          deworming_dates?: string | null
          ears_open_date?: string | null
          eyes_open_date?: string | null
          first_walk_date?: string | null
          fully_mobile_date?: string | null
          gender?: string | null
          id?: string
          litter_id?: string | null
          microchip_number?: string | null
          name?: string | null
          notes?: string | null
          photo_url?: string | null
          presentation?: string | null
          reservation_date?: string | null
          sale_price?: number | null
          status?: string | null
          vaccination_dates?: string | null
          vet_check_dates?: string | null
        }
        Update: {
          akc_litter_number?: string | null
          akc_registration_number?: string | null
          assistance_notes?: string | null
          assistance_required?: boolean | null
          birth_date?: string | null
          birth_order?: number | null
          birth_time?: string | null
          birth_weight?: string | null
          color?: string | null
          created_at?: string | null
          current_weight?: string | null
          deworming_dates?: string | null
          ears_open_date?: string | null
          eyes_open_date?: string | null
          first_walk_date?: string | null
          fully_mobile_date?: string | null
          gender?: string | null
          id?: string
          litter_id?: string | null
          microchip_number?: string | null
          name?: string | null
          notes?: string | null
          photo_url?: string | null
          presentation?: string | null
          reservation_date?: string | null
          sale_price?: number | null
          status?: string | null
          vaccination_dates?: string | null
          vet_check_dates?: string | null
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
      puppy_developmental_milestones: {
        Row: {
          actual_age_days: number | null
          completion_date: string | null
          created_at: string | null
          created_by: string | null
          expected_age_days: number | null
          id: string
          milestone_category: string
          milestone_type: string
          notes: string | null
          photo_url: string | null
          puppy_id: string
        }
        Insert: {
          actual_age_days?: number | null
          completion_date?: string | null
          created_at?: string | null
          created_by?: string | null
          expected_age_days?: number | null
          id?: string
          milestone_category: string
          milestone_type: string
          notes?: string | null
          photo_url?: string | null
          puppy_id: string
        }
        Update: {
          actual_age_days?: number | null
          completion_date?: string | null
          created_at?: string | null
          created_by?: string | null
          expected_age_days?: number | null
          id?: string
          milestone_category?: string
          milestone_type?: string
          notes?: string | null
          photo_url?: string | null
          puppy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "puppy_developmental_milestones_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_health_certificates: {
        Row: {
          certificate_type: string
          created_at: string
          expiry_date: string | null
          file_url: string | null
          id: string
          issue_date: string
          issuer: string
          notes: string | null
          puppy_id: string
        }
        Insert: {
          certificate_type: string
          created_at?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date: string
          issuer: string
          notes?: string | null
          puppy_id: string
        }
        Update: {
          certificate_type?: string
          created_at?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string
          issuer?: string
          notes?: string | null
          puppy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "puppy_health_certificates_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_medication_administrations: {
        Row: {
          administered_at: string
          administered_by: string
          created_at: string
          id: string
          medication_id: string
          notes: string | null
        }
        Insert: {
          administered_at: string
          administered_by: string
          created_at?: string
          id?: string
          medication_id: string
          notes?: string | null
        }
        Update: {
          administered_at?: string
          administered_by?: string
          created_at?: string
          id?: string
          medication_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "puppy_medication_administrations_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "puppy_medications"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_medications: {
        Row: {
          administration_route: string
          created_at: string
          dosage: number
          dosage_unit: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          last_administered: string | null
          medication_name: string
          notes: string | null
          puppy_id: string
          start_date: string
        }
        Insert: {
          administration_route: string
          created_at?: string
          dosage: number
          dosage_unit: string
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean
          last_administered?: string | null
          medication_name: string
          notes?: string | null
          puppy_id: string
          start_date: string
        }
        Update: {
          administration_route?: string
          created_at?: string
          dosage?: number
          dosage_unit?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_administered?: string | null
          medication_name?: string
          notes?: string | null
          puppy_id?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "puppy_medications_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_milestones: {
        Row: {
          created_at: string
          id: string
          milestone_date: string
          milestone_type: string
          notes: string | null
          puppy_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          milestone_date: string
          milestone_type: string
          notes?: string | null
          puppy_id: string
        }
        Update: {
          created_at?: string
          id?: string
          milestone_date?: string
          milestone_type?: string
          notes?: string | null
          puppy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "puppy_milestones_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_photos: {
        Row: {
          created_at: string
          id: string
          is_main: boolean | null
          photo_url: string
          puppy_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_main?: boolean | null
          photo_url: string
          puppy_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_main?: boolean | null
          photo_url?: string
          puppy_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "puppy_photos_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_protocols: {
        Row: {
          completed: boolean | null
          created_at: string
          dose: string | null
          id: string
          notes: string | null
          protocol_id: string
          puppy_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          dose?: string | null
          id?: string
          notes?: string | null
          protocol_id: string
          puppy_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          dose?: string | null
          id?: string
          notes?: string | null
          protocol_id?: string
          puppy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "puppy_protocols_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "health_protocols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "puppy_protocols_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_vaccination_schedule: {
        Row: {
          created_at: string | null
          due_date: string
          id: string
          notes: string | null
          puppy_id: string
          vaccination_type: string
        }
        Insert: {
          created_at?: string | null
          due_date: string
          id?: string
          notes?: string | null
          puppy_id: string
          vaccination_type: string
        }
        Update: {
          created_at?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          puppy_id?: string
          vaccination_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "puppy_vaccination_schedule_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_vaccinations: {
        Row: {
          administered_by: string | null
          created_at: string | null
          id: string
          lot_number: string | null
          notes: string | null
          puppy_id: string
          vaccination_date: string
          vaccination_type: string
        }
        Insert: {
          administered_by?: string | null
          created_at?: string | null
          id?: string
          lot_number?: string | null
          notes?: string | null
          puppy_id: string
          vaccination_date: string
          vaccination_type: string
        }
        Update: {
          administered_by?: string | null
          created_at?: string | null
          id?: string
          lot_number?: string | null
          notes?: string | null
          puppy_id?: string
          vaccination_date?: string
          vaccination_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "puppy_vaccinations_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_weights: {
        Row: {
          age_days: number | null
          created_at: string
          date: string
          id: string
          notes: string | null
          puppy_id: string
          weight: number
          weight_unit: string
        }
        Insert: {
          age_days?: number | null
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          puppy_id: string
          weight: number
          weight_unit: string
        }
        Update: {
          age_days?: number | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          puppy_id?: string
          weight?: number
          weight_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "puppy_weights_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      reproductive_milestones: {
        Row: {
          created_at: string
          created_by: string | null
          dog_id: string
          id: string
          milestone_date: string
          milestone_type: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dog_id: string
          id?: string
          milestone_date: string
          milestone_type: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dog_id?: string
          id?: string
          milestone_date?: string
          milestone_type?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reproductive_milestones_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_status: string
          notes: string | null
          previous_status: string | null
          reservation_id: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status: string
          notes?: string | null
          previous_status?: string | null
          reservation_id?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          previous_status?: string | null
          reservation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_status_history_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          contract_date: string | null
          contract_signed: boolean | null
          created_at: string | null
          customer_id: string | null
          deposit_amount: number | null
          deposit_date: string | null
          deposit_paid: boolean | null
          id: string
          notes: string | null
          pickup_date: string | null
          puppy_id: string | null
          reservation_date: string
          status: string | null
          status_updated_at: string | null
        }
        Insert: {
          contract_date?: string | null
          contract_signed?: boolean | null
          created_at?: string | null
          customer_id?: string | null
          deposit_amount?: number | null
          deposit_date?: string | null
          deposit_paid?: boolean | null
          id?: string
          notes?: string | null
          pickup_date?: string | null
          puppy_id?: string | null
          reservation_date: string
          status?: string | null
          status_updated_at?: string | null
        }
        Update: {
          contract_date?: string | null
          contract_signed?: boolean | null
          created_at?: string | null
          customer_id?: string | null
          deposit_amount?: number | null
          deposit_date?: string | null
          deposit_paid?: boolean | null
          id?: string
          notes?: string | null
          pickup_date?: string | null
          puppy_id?: string | null
          reservation_date?: string
          status?: string | null
          status_updated_at?: string | null
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
      socialization_records: {
        Row: {
          category: string
          created_at: string
          experience: string
          experience_date: string
          id: string
          notes: string | null
          puppy_id: string
          reaction: string | null
        }
        Insert: {
          category: string
          created_at?: string
          experience: string
          experience_date: string
          id?: string
          notes?: string | null
          puppy_id: string
          reaction?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          experience?: string
          experience_date?: string
          id?: string
          notes?: string | null
          puppy_id?: string
          reaction?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "socialization_records_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slot_dogs: {
        Row: {
          created_at: string
          dog_id: string
          id: string
          time_slot_id: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          id?: string
          time_slot_id: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          id?: string
          time_slot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slot_dogs_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_slot_dogs_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          created_at: string
          id: string
          time: string
        }
        Insert: {
          created_at?: string
          id?: string
          time: string
        }
        Update: {
          created_at?: string
          id?: string
          time?: string
        }
        Relationships: []
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
      waitlist: {
        Row: {
          contacted_at: string | null
          customer_id: string
          id: string
          litter_id: string
          notes: string | null
          position: number | null
          preferences: Json | null
          requested_at: string
          status: string
        }
        Insert: {
          contacted_at?: string | null
          customer_id: string
          id?: string
          litter_id: string
          notes?: string | null
          position?: number | null
          preferences?: Json | null
          requested_at?: string
          status?: string
        }
        Update: {
          contacted_at?: string | null
          customer_id?: string
          id?: string
          litter_id?: string
          notes?: string | null
          position?: number | null
          preferences?: Json | null
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_litter_id_fkey"
            columns: ["litter_id"]
            isOneToOne: false
            referencedRelation: "litters"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_records: {
        Row: {
          created_at: string
          date: string
          dog_id: string
          id: string
          notes: string | null
          percent_change: number | null
          puppy_id: string | null
          weight: number
          weight_unit: string
        }
        Insert: {
          created_at?: string
          date: string
          dog_id: string
          id?: string
          notes?: string | null
          percent_change?: number | null
          puppy_id?: string | null
          weight: number
          weight_unit: string
        }
        Update: {
          created_at?: string
          date?: string
          dog_id?: string
          id?: string
          notes?: string | null
          percent_change?: number | null
          puppy_id?: string | null
          weight?: number
          weight_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "weight_records_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weight_records_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      welping_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          litter_id: string
          notes: string | null
          puppy_details: Json | null
          puppy_id: string | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          litter_id: string
          notes?: string | null
          puppy_details?: Json | null
          puppy_id?: string | null
          timestamp?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          litter_id?: string
          notes?: string | null
          puppy_details?: Json | null
          puppy_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "welping_logs_litter_id_fkey"
            columns: ["litter_id"]
            isOneToOne: false
            referencedRelation: "litters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welping_logs_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      welping_observations: {
        Row: {
          action_taken: string | null
          created_at: string | null
          description: string
          id: string
          observation_time: string
          observation_type: string
          puppy_id: string | null
          welping_record_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          description: string
          id?: string
          observation_time: string
          observation_type: string
          puppy_id?: string | null
          welping_record_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          description?: string
          id?: string
          observation_time?: string
          observation_type?: string
          puppy_id?: string | null
          welping_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "welping_observations_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welping_observations_welping_record_id_fkey"
            columns: ["welping_record_id"]
            isOneToOne: false
            referencedRelation: "welping_records"
            referencedColumns: ["id"]
          },
        ]
      }
      welping_postpartum_care: {
        Row: {
          care_time: string
          care_type: string
          created_at: string | null
          id: string
          notes: string
          performed_by: string | null
          puppy_id: string
        }
        Insert: {
          care_time: string
          care_type: string
          created_at?: string | null
          id?: string
          notes: string
          performed_by?: string | null
          puppy_id: string
        }
        Update: {
          care_time?: string
          care_type?: string
          created_at?: string | null
          id?: string
          notes?: string
          performed_by?: string | null
          puppy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "welping_postpartum_care_puppy_id_fkey"
            columns: ["puppy_id"]
            isOneToOne: false
            referencedRelation: "puppies"
            referencedColumns: ["id"]
          },
        ]
      }
      welping_records: {
        Row: {
          attended_by: string | null
          birth_date: string
          complication_notes: string | null
          complications: boolean | null
          created_at: string | null
          end_time: string | null
          females: number
          id: string
          litter_id: string
          males: number
          notes: string | null
          start_time: string
          status: string
          total_puppies: number
        }
        Insert: {
          attended_by?: string | null
          birth_date: string
          complication_notes?: string | null
          complications?: boolean | null
          created_at?: string | null
          end_time?: string | null
          females?: number
          id?: string
          litter_id: string
          males?: number
          notes?: string | null
          start_time: string
          status?: string
          total_puppies?: number
        }
        Update: {
          attended_by?: string | null
          birth_date?: string
          complication_notes?: string | null
          complications?: boolean | null
          created_at?: string | null
          end_time?: string | null
          females?: number
          id?: string
          litter_id?: string
          males?: number
          notes?: string | null
          start_time?: string
          status?: string
          total_puppies?: number
        }
        Relationships: [
          {
            foreignKeyName: "welping_records_litter_id_fkey"
            columns: ["litter_id"]
            isOneToOne: false
            referencedRelation: "litters"
            referencedColumns: ["id"]
          },
        ]
      }
      whelping_shift_logs: {
        Row: {
          attended_by: string
          created_at: string | null
          id: string
          litter_id: string
          notes: string | null
          timestamp: string | null
        }
        Insert: {
          attended_by: string
          created_at?: string | null
          id?: string
          litter_id: string
          notes?: string | null
          timestamp?: string | null
        }
        Update: {
          attended_by?: string
          created_at?: string | null
          id?: string
          litter_id?: string
          notes?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whelping_shift_logs_litter_id_fkey"
            columns: ["litter_id"]
            isOneToOne: false
            referencedRelation: "litters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      format_audit_log: {
        Args: { log_entry: Database["public"]["Tables"]["audit_logs"]["Row"] }
        Returns: string
      }
      get_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_or_owner: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_medication_log: {
        Args: {
          log_record: Database["public"]["Tables"]["daily_care_logs"]["Row"]
        }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          action: string
          entity_type: string
          entity_id: string
          previous_state?: Json
          new_state?: Json
          notes?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
