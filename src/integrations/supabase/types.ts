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
      booking_groceries: {
        Row: {
          booking_id: string
          grocery_item_id: string
          id: string
          quantity: number
        }
        Insert: {
          booking_id: string
          grocery_item_id: string
          id?: string
          quantity?: number
        }
        Update: {
          booking_id?: string
          grocery_item_id?: string
          id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_groceries_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "chef_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_groceries_grocery_item_id_fkey"
            columns: ["grocery_item_id"]
            isOneToOne: false
            referencedRelation: "chef_grocery_items"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          assigned_to: string | null
          category: string
          color: string | null
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          family_id: string | null
          id: string
          is_recurring: boolean | null
          location: string | null
          recurrence_pattern: string | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          all_day?: boolean | null
          assigned_to?: string | null
          category?: string
          color?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          family_id?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          recurrence_pattern?: string | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          all_day?: boolean | null
          assigned_to?: string | null
          category?: string
          color?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          family_id?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          recurrence_pattern?: string | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      chef_bookings: {
        Row: {
          booking_date: string
          chef_id: string
          created_at: string
          end_time: string
          guests_count: number
          id: string
          meal_type: string
          special_requests: string | null
          start_time: string
          status: string
          total_price: number
          user_id: string
        }
        Insert: {
          booking_date: string
          chef_id: string
          created_at?: string
          end_time: string
          guests_count: number
          id?: string
          meal_type: string
          special_requests?: string | null
          start_time: string
          status?: string
          total_price: number
          user_id: string
        }
        Update: {
          booking_date?: string
          chef_id?: string
          created_at?: string
          end_time?: string
          guests_count?: number
          id?: string
          meal_type?: string
          special_requests?: string | null
          start_time?: string
          status?: string
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chef_bookings_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chefs"
            referencedColumns: ["id"]
          },
        ]
      }
      chef_favorites: {
        Row: {
          chef_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          chef_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          chef_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chef_favorites_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chefs"
            referencedColumns: ["id"]
          },
        ]
      }
      chef_grocery_items: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          price: number
          unit: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          price: number
          unit: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          price?: number
          unit?: string
        }
        Relationships: []
      }
      chef_reviews: {
        Row: {
          chef_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          chef_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          chef_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chef_reviews_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chefs"
            referencedColumns: ["id"]
          },
        ]
      }
      chefs: {
        Row: {
          bio: string | null
          created_at: string
          cuisine_style: string
          hourly_rate: number
          id: string
          name: string
          profile_image: string | null
          specialty: string | null
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          cuisine_style: string
          hourly_rate: number
          id?: string
          name: string
          profile_image?: string | null
          specialty?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          cuisine_style?: string
          hourly_rate?: number
          id?: string
          name?: string
          profile_image?: string | null
          specialty?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      families: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          family_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          family_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          family_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          code: string
          created_at: string
          created_by: string
          expires_at: string
          family_id: string
          id: string
          is_used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          expires_at?: string
          family_id: string
          id?: string
          is_used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          expires_at?: string
          family_id?: string
          id?: string
          is_used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "invitations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      pantry_items: {
        Row: {
          barcode: string | null
          category: string | null
          created_at: string
          created_by: string
          expiry_date: string | null
          family_id: string
          id: string
          image_url: string | null
          location: string | null
          name: string
          notes: string | null
          quantity: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category?: string | null
          created_at?: string
          created_by: string
          expiry_date?: string | null
          family_id: string
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          notes?: string | null
          quantity?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category?: string | null
          created_at?: string
          created_by?: string
          expiry_date?: string | null
          family_id?: string
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          quantity?: number | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pantry_items_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          family_id: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          family_id?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          family_id?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
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
