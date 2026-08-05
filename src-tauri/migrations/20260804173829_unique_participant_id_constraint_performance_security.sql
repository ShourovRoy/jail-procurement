-- Add unique constraint to participant id migration script here


ALTER TABLE performance_security
ADD CONSTRAINT uq_performance_security_participant_id
    UNIQUE(participant_id);
