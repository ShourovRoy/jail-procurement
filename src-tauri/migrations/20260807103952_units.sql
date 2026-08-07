-- Add units migration script here



CREATE TABLE IF NOT EXISTS units (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(10) NOT NULL,
    created_by UUID NOT NULL,


    -- unique constraints
    -- unique name and short name
    CONSTRAINT unique_name
        UNIQUE(name),

    CONSTRAINT unique_short_name
        UNIQUE(short_name),


    -- foreign key
    CONSTRAINT fk_created_by_users
    FOREIGN KEY (created_by)
    REFERENCES users(id)

);

