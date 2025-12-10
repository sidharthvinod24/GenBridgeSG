export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          id: string
          participant_one: string
          participant_two: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_one: string
          participant_two: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_one?: string
          participant_two?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          age_group: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          credibility_score: number | null
          credits: number
          full_name: string | null
          id: string
          phone_number: string | null
          q_allow_archive: boolean | null
          q_availability: string[] | null
          q_communication_preference: string | null
          q_conversation_preference: string | null
          q_cultural_interests: string[] | null
          q_digital_help_needed: string[] | null
          q_digital_teaching_skills: string[] | null
          q_explaining_patience: string | null
          q_frustrating_task: string | null
          q_hands_or_screens: string | null
          q_joining_reason: string | null
          q_languages_dialects: string[] | null
          q_learning_style: string | null
          q_open_to_verification: boolean | null
          q_other_generation: string | null
          q_proud_story: string | null
          q_skill_or_hobby: string | null
          q_skills_to_share: string | null
          q_talk_topic: string | null
          q_teaching_comfort: number | null
          skill_exchange_duration: string | null
          skills_offered: string[] | null
          skills_proficiency: Json | null
          skills_wanted: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          age_group?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          credibility_score?: number | null
          credits?: number
          full_name?: string | null
          id?: string
          phone_number?: string | null
          q_allow_archive?: boolean | null
          q_availability?: string[] | null
          q_communication_preference?: string | null
          q_conversation_preference?: string | null
          q_cultural_interests?: string[] | null
          q_digital_help_needed?: string[] | null
          q_digital_teaching_skills?: string[] | null
          q_explaining_patience?: string | null
          q_frustrating_task?: string | null
          q_hands_or_screens?: string | null
          q_joining_reason?: string | null
          q_languages_dialects?: string[] | null
          q_learning_style?: string | null
          q_open_to_verification?: boolean | null
          q_other_generation?: string | null
          q_proud_story?: string | null
          q_skill_or_hobby?: string | null
          q_skills_to_share?: string | null
          q_talk_topic?: string | null
          q_teaching_comfort?: number | null
          skill_exchange_duration?: string | null
          skills_offered?: string[] | null
          skills_proficiency?: Json | null
          skills_wanted?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          age_group?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          credibility_score?: number | null
          credits?: number
          full_name?: string | null
          id?: string
          phone_number?: string | null
          q_allow_archive?: boolean | null
          q_availability?: string[] | null
          q_communication_preference?: string | null
          q_conversation_preference?: string | null
          q_cultural_interests?: string[] | null
          q_digital_help_needed?: string[] | null
          q_digital_teaching_skills?: string[] | null
          q_explaining_patience?: string | null
          q_frustrating_task?: string | null
          q_hands_or_screens?: string | null
          q_joining_reason?: string | null
          q_languages_dialects?: string[] | null
          q_learning_style?: string | null
          q_open_to_verification?: boolean | null
          q_other_generation?: string | null
          q_proud_story?: string | null
          q_skill_or_hobby?: string | null
          q_skills_to_share?: string | null
          q_talk_topic?: string | null
          q_teaching_comfort?: number | null
          skill_exchange_duration?: string | null
          skills_offered?: string[] | null
          skills_proficiency?: Json | null
          skills_wanted?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          action_taken: string | null
          created_at: string
          description: string
          id: string
          reported_user_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          description: string
          id?: string
          reported_user_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          description?: string
          id?: string
          reported_user_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_profile: {
        Args: { target_user_id: string }
        Returns: {
          age_group: string
          avatar_url: string
          bio: string
          credibility_score: number
          full_name: string
          id: string
          skill_exchange_duration: string
          skills_offered: string[]
          skills_proficiency: Json
          skills_wanted: string[]
          user_id: string
        }[]
      }
      get_public_profiles: {
        Args: never
        Returns: {
          age_group: string
          avatar_url: string
          bio: string
          credibility_score: number
          full_name: string
          id: string
          skill_exchange_duration: string
          skills_offered: string[]
          skills_proficiency: Json
          skills_wanted: string[]
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
