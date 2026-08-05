-- Add performance security migration script here

CREATE TABLE IF NOT EXISTS performance_security (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    issuer_bank_name VARCHAR(150) NOT NULL,
    issuer_bank_branch VARCHAR(150) NOT NULL,
    performance_security_number VARCHAR(255) NOT NULL,
    amount NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    is_released BOOLEAN DEFAULT FALSE,
    released_date DATE,
    released_by UUID,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),     
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- foreign key tender id
    CONSTRAINT fk_tender_id_tenders 
    FOREIGN KEY (tender_id)
    REFERENCES tenders(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    -- foreign key org id
    CONSTRAINT fk_organization_id_organizations
    FOREIGN KEY (organization_id)
    REFERENCES organizations(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    -- foreign key released by  
    CONSTRAINT fk_released_by_users
    FOREIGN KEY (released_by)
    REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,



    -- unique constraints starts here
    -- unique pair for org and tender
    CONSTRAINT unique_tender_org_constraint
        UNIQUE(organization_id, tender_id),

    -- unique performance security number
    CONSTRAINT unique_performance_security
        UNIQUE(performance_security_number),



    -- Ensure issue date isn't after expiry date
    CONSTRAINT check_valid_dates
        CHECK (issue_date <= expiry_date)


);
