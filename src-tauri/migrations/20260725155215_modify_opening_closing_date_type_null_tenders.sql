-- Add tenders migration script here to make the opening and closing date optional


ALTER TABLE tenders
    ALTER COLUMN opening_date DROP NOT NULL,
    ALTER COLUMN dropping_date DROP NOT NULL;
