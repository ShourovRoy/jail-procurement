-- Add tenders participants migration script here


CREATE TABLE IF NOT EXISTS tender_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    quoted_amount NUMERIC(18,2) DEFAULT 0.00,
    bid_submission_date DATE,
    remarks TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),     
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 

    -- foreign key tender id 
    CONSTRAINT fk_tender_participants_tender_id 
        FOREIGN KEY (tender_id)
        REFERENCES tenders(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- foreign key organization id
    CONSTRAINT fk_tender_participants_organization_id 
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

);



