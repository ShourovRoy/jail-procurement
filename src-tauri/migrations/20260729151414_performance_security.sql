-- Add performance security migration script here




CREATE TABLE IF NOT EXISTS performance_security (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL,
    issuer_bank_name VARCHAR(150) NOT NULL,
    issuer_bank_branch VARCHAR(150) NOT NULL,
    pay_order_number VARCHAR(255) NOT NULL,
    security_number VARCHAR(255) NOT NULL,
    amount NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    is_released BOOLEAN NOT NULL DEFAULT FALSE,
    released_date DATE,
    released_by UUID,
    created_by UUID NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),     
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),



    -- unique security number constraint
    CONSTRAINT unique_security_number
        UNIQUE (security_number),


    -- unique participant id
    CONSTRAINT unique_participant_id
        UNIQUE (participant_id),


    -- foreign key with tender participants table with participant_id
    CONSTRAINT fk_performance_security_participant
        FOREIGN KEY (participant_id)
        REFERENCES  tender_participants(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- foreign key with users table with created_by
    CONSTRAINT fk_users_created_by
        FOREIGN KEY (created_by)
        REFERENCES  users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,


    -- check issue date isn't after expiry date
    CONSTRAINT check_valid_date
        CHECK (issue_date <= expiry_date)


);