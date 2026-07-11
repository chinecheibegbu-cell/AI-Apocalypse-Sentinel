import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://avypubtaorxyuxrvvoul.supabase.co/rest/v1/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eXB1YnRhb3J4eXV4cnZ2b3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMTY0OTksImV4cCI6MjA5ODU5MjQ5OX0.et8Q_aXdMlln24bp0hQzr7yB6stcOf3LP24AXLQGNg4'
)
