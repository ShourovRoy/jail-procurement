-- Add uq_tender_participants_tender_organization on tender participants migration script here

-- enforcing one organization to bid once per tenders
ALTER TABLE tender_participants
ADD CONSTRAINT uq_tender_participants_tender_organization
    UNIQUE (tender_id, organization_id);


