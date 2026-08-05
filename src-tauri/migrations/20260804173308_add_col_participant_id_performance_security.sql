-- Add participant id col in performance security table migration script here

ALTER TABLE performance_security
ADD COLUMN participant_id UUID NOT NULL;

