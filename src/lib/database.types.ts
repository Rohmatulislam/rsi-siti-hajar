export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      doctors: {
        Row: {
          id: string
          user_id: string | null
          name: string
          specialty: string
          image_url: string | null
          description: string | null
          experience_years: number | null
          education: string | null
          certifications: string[] | null
          consultation_fee: number | null
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          specialty: string
          image_url?: string | null
          description?: string | null
          experience_years?: number | null
          education?: string | null
          certifications?: string[] | null
          consultation_fee?: number | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          specialty?: string
          image_url?: string | null
          description?: string | null
          experience_years?: number | null
          education?: string | null
          certifications?: string[] | null
          consultation_fee?: number | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          category: string | null
          title: string
          description: string | null
          image_url: string | null
          contact_info: string | null
          location: string | null
          operating_hours: string | null
          features: string[] | null
          reviews: string[] | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category?: string | null
          title: string
          description?: string | null
          image_url?: string | null
          contact_info?: string | null
          location?: string | null
          operating_hours?: string | null
          features?: string[] | null
          reviews?: string[] | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string | null
          title?: string
          description?: string | null
          image_url?: string | null
          contact_info?: string | null
          location?: string | null
          operating_hours?: string | null
          features?: string[] | null
          reviews?: string[] | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Provider = 'apple' | 'azure' | 'bitbucket' | 'discord' | 'facebook' | 'figma' | 'github' | 'gitlab' | 'google' | 'kakao' | 'keycloak' | 'linkedin' | 'linkedin_oidc' | 'notion' | 'slack' | 'slack_oidc' | 'spotify' | 'twitch' | 'twitter' | 'workos' | 'zoom'