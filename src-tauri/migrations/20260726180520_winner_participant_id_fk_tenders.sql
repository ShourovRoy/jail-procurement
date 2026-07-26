-- Add fk constraint to winner_participant_id tenders table migration script here


ALTER TABLE tenders
    ADD CONSTRAINT fk_winner_participant_id_tender 
    FOREIGN KEY (winner_participant_id)
    REFERENCES tender_participants(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
