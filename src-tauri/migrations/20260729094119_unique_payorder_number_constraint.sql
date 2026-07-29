-- Add unique payorder number constraint migration script here


ALTER TABLE pay_orders
ADD CONSTRAINT unique_pay_order_number_constraint
    UNIQUE (pay_order_number);

