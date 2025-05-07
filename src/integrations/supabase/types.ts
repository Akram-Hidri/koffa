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
          created_at: string
          grocery_item_id: string
          id: string
          quantity: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          grocery_item_id: string
          id?: string
          quantity: number
        }
        Update: {
          booking_id?: string
          created_at?: string
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
          category: string
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      custom_terms: {
        Row: {
          created_at: string | null
          created_by: string | null
          custom_term: string
          dialect_id: string | null
          id: string
          standard_term: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          custom_term: string
          dialect_id?: string | null
          id?: string
          standard_term: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          custom_term?: string
          dialect_id?: string | null
          id?: string
          standard_term?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_terms_dialect_id_fkey"
            columns: ["dialect_id"]
            isOneToOne: false
            referencedRelation: "dialects"
            referencedColumns: ["id"]
          },
        ]
      }
      dialects: {
        Row: {
          base_language: string
          id: string
          name: string
          region: string | null
        }
        Insert: {
          base_language?: string
          id?: string
          name: string
          region?: string | null
        }
        Update: {
          base_language?: string
          id?: string
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      families: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
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
      notifications: {
        Row: {
          body: string | null
          created_at: string
          event_id: string | null
          id: string
          is_read: boolean | null
          scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          is_read?: boolean | null
          scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          is_read?: boolean | null
          scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      pantry_items: {
        Row: {
          added_by: string | null
          created_at: string
          expiry_date: string | null
          id: string
          location: string | null
          low_stock: boolean | null
          name: string
          notes: string | null
          quantity: string
          unit: string | null
          user_id: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          location?: string | null
          low_stock?: boolean | null
          name: string
          notes?: string | null
          quantity: string
          unit?: string | null
          user_id: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          location?: string | null
          low_stock?: boolean | null
          name?: string
          notes?: string | null
          quantity?: string
          unit?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bold_text: boolean | null
          created_at: string
          family_id: string | null
          high_contrast_mode: boolean | null
          id: string
          input_method: string | null
          language: string | null
          navigation_items: string[] | null
          preferred_dialect_id: string | null
          reduce_animations: boolean | null
          reduce_motion: boolean | null
          reduce_transparency: boolean | null
          screen_reader_compatible: boolean | null
          show_labels_with_icons: boolean | null
          simplified_mode: boolean | null
          text_size: string | null
          theme: string | null
          touch_accommodations: boolean | null
          username: string | null
          voice_commands: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bold_text?: boolean | null
          created_at?: string
          family_id?: string | null
          high_contrast_mode?: boolean | null
          id: string
          input_method?: string | null
          language?: string | null
          navigation_items?: string[] | null
          preferred_dialect_id?: string | null
          reduce_animations?: boolean | null
          reduce_motion?: boolean | null
          reduce_transparency?: boolean | null
          screen_reader_compatible?: boolean | null
          show_labels_with_icons?: boolean | null
          simplified_mode?: boolean | null
          text_size?: string | null
          theme?: string | null
          touch_accommodations?: boolean | null
          username?: string | null
          voice_commands?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bold_text?: boolean | null
          created_at?: string
          family_id?: string | null
          high_contrast_mode?: boolean | null
          id?: string
          input_method?: string | null
          language?: string | null
          navigation_items?: string[] | null
          preferred_dialect_id?: string | null
          reduce_animations?: boolean | null
          reduce_motion?: boolean | null
          reduce_transparency?: boolean | null
          screen_reader_compatible?: boolean | null
          show_labels_with_icons?: boolean | null
          simplified_mode?: boolean | null
          text_size?: string | null
          theme?: string | null
          touch_accommodations?: boolean | null
          username?: string | null
          voice_commands?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_preferred_dialect_id_fkey"
            columns: ["preferred_dialect_id"]
            isOneToOne: false
            referencedRelation: "dialects"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          id: string
          name: string
          optional: boolean | null
          quantity: string
          recipe_id: string
          unit: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          optional?: boolean | null
          quantity: string
          recipe_id: string
          unit?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          optional?: boolean | null
          quantity?: string
          recipe_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_shopping_items: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          recipe_id: string
          shopping_list_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          recipe_id: string
          shopping_list_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          recipe_id?: string
          shopping_list_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_shopping_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "recipe_ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_shopping_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_shopping_items_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          category: string | null
          cook_time: number | null
          created_at: string
          cuisine: string | null
          description: string | null
          difficulty: string | null
          id: string
          image_url: string | null
          instructions: string | null
          prep_time: number | null
          servings: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          cook_time?: number | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          prep_time?: number | null
          servings?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          cook_time?: number | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          prep_time?: number | null
          servings?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shopping_list_items: {
        Row: {
          added_by: string | null
          checked: boolean | null
          created_at: string
          id: string
          list_id: string
          name: string
          note: string | null
          priority: string | null
          quantity: string
          user_id: string
        }
        Insert: {
          added_by?: string | null
          checked?: boolean | null
          created_at?: string
          id?: string
          list_id: string
          name: string
          note?: string | null
          priority?: string | null
          quantity: string
          user_id: string
        }
        Update: {
          added_by?: string | null
          checked?: boolean | null
          created_at?: string
          id?: string
          list_id?: string
          name?: string
          note?: string | null
          priority?: string | null
          quantity?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      space_tasks: {
        Row: {
          assigned_to: string | null
          completed: boolean | null
          created_at: string
          due_date: string | null
          id: string
          recurrence: string | null
          space_id: string
          task: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string
          due_date?: string | null
          id?: string
          recurrence?: string | null
          space_id: string
          task: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string
          due_date?: string | null
          id?: string
          recurrence?: string | null
          space_id?: string
          task?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "space_tasks_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          type: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          type?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_valid_invite_code: {
        Args: { code_param: string }
        Returns: boolean
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
