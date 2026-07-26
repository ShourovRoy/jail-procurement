-- Add unique constraint to tender notice and number col migration script here


ALTER TABLE tenders
ADD CONSTRAINT unique_notice_number UNIQUE (notice_number),
ADD CONSTRAINT unique_tender_number UNIQUE (tender_number);

