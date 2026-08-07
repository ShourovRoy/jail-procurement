-- Add products migration script here

CREATE TABLE IF NOT EXISTS products (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(250) NOT NULL,
    unit_id UUID NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    
    -- unique constraints
    -- unique name
    CONSTRAINT unique_products_name
        UNIQUE(name),

    -- user foreign key
    CONSTRAINT fk_products_created_by_users
    FOREIGN KEY (created_by)
    REFERENCES users(id),

    -- unit foreign key
    CONSTRAINT fk_products_unit_id_units
    FOREIGN KEY (unit_id)
    REFERENCES units(id)




);
