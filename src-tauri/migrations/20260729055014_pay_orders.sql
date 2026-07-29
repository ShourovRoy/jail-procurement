-- Add pay-orders migration script here


CREATE TABLE IF NOT EXISTS pay_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL,
    issuer_bank_name VARCHAR(150) NOT NULL,
    issuer_bank_branch VARCHAR(150) NOT NULL,
    pay_order_number VARCHAR(255) NOT NULL,
    amount NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    is_released BOOLEAN NOT NULL DEFAULT FALSE,
    released_date DATE,
    released_by UUID,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),     
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Unique pair for participant id and payorder number
    CONSTRAINT unique_participant_id_and_payorder_number
        UNIQUE (participant_id, pay_order_number),

    -- Tender participant foreign key (Fixed typo: tender_participants)
    CONSTRAINT fk_participant_id_tender_participant_table
        FOREIGN KEY (participant_id)
        REFERENCES tender_participants(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Released by user foreign key
    CONSTRAINT fk_released_by_users_table
        FOREIGN KEY (released_by)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Ensure issue date isn't after expiry date
    CONSTRAINT check_valid_dates
        CHECK (issue_date <= expiry_date)
);


