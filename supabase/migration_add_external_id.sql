-- Add external_id to waste_log for upsert deduplication
-- Run this in Supabase SQL Editor after schema.sql
alter table waste_log
  add column if not exists external_id text unique;
