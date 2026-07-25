-- Add tenders migration script here

-- create tender status enum
DO $$ 
BEGIN     
    IF NOT EXISTS (         
        SELECT 1         
        FROM pg_type         
        WHERE typname = 'tender_status'     
    ) THEN         
        CREATE TYPE tender_status AS ENUM (             
            'open',             
            'awarded',             
            'closed',             
            'cancelled'         
        );     
    END IF; 
END $$;  

-- create tenders table 
CREATE TABLE IF NOT EXISTS tenders (      
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),     
    jail_id UUID NOT NULL,     
    tender_number VARCHAR(255) NOT NULL,     
    notice_number VARCHAR(255) NOT NULL,     
    dropping_date DATE NOT NULL,     
    opening_date DATE NOT NULL,     
    estimated_amount NUMERIC(18,2) DEFAULT 0.00,     
    winner_participant_id UUID,     
    winner_bid_amount NUMERIC(18,2) DEFAULT 0.00,     
    status tender_status NOT NULL DEFAULT 'open',     
    remarks TEXT,     
    created_by UUID NOT NULL,     
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),     
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),      
    
    -- jail fk      
    CONSTRAINT fk_tender_jail          
        FOREIGN KEY (jail_id)         
        REFERENCES jails(id)         
        ON UPDATE CASCADE         
        ON DELETE RESTRICT,      
        
    -- created by fk     
    CONSTRAINT fk_tender_created_by         
        FOREIGN KEY (created_by)         
        REFERENCES users(id)         
        ON UPDATE CASCADE         
        ON DELETE RESTRICT
);
