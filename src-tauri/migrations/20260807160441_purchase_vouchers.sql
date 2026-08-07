-- Add purchase vouchers migration script here



CREATE TABLE IF NOT EXISTS puchase_vouchers (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    participant_id UUID NOT NULL,
    voucher_number VARCHAR(300) NOT NULL,
    voucher_date DATE NOT NULL,
    total_amount NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    remarks TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    
    -- unique constraints
    -- unique voucher_number
    CONSTRAINT unique_voucher_number
        UNIQUE(voucher_number),

    -- tender_id foreign key
    constraint fk_purchase_voucher_tender_id_users
    foreign key (tender_id)
    references tenders(id),

    -- organization_id foreign key
    constraint fk_purchase_voucher_organization_id_users
    foreign key (organization_id)
    references organizations(id),

    -- participant_id foreign key
    constraint fk_purchase_voucher_participant_id_users
    foreign key (participant_id)
    references tender_participants(id),

    -- created by foreign key
    CONSTRAINT fk_purchase_voucher_created_by_users
    FOREIGN KEY (created_by)
    REFERENCES users(id)


);

