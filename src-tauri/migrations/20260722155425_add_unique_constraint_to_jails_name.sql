-- Add unique constraint to jail name migration script here
ALTER TABLE jails
ADD CONSTRAINT unique_jail_name UNIQUE (name);