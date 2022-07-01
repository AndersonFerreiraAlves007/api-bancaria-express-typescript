# Script sql

CREATE TABLE public.users (
	"id" varchar(40) NOT NULL,
	"name" varchar(80) NOT NULL,
	"document" varchar(11) NOT NULL,
	"birthdate" DATE NOT NULL,
	"email" varchar(256) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.transactions (
	"id" varchar(40) NOT NULL,
	"date" DATE NOT NULL,
	"value" DECIMAL(11,2) NOT NULL,
	"type" varchar(10) NOT NULL,
	"origin_account_id" varchar(40),
	"destination_account_id" varchar(40)
	CONSTRAINT "transactions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.accounts (
	"id" varchar(40) NOT NULL,
	"agency_number" varchar(4) NOT NULL,
	"agency_verification_code" varchar(1) NOT NULL,
	"account_number" varchar(6) NOT NULL,
	"account_verification_code" varchar(1) NOT NULL,
	"balance" DECIMAL(11,2) NOT NULL,
	"user_id" varchar(40) NOT NULL,
	"password" varchar(100) NOT NULL
	CONSTRAINT "accounts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fk0" FOREIGN KEY ("origin_account_id") REFERENCES "accounts"("id");
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fk1" FOREIGN KEY ("destination_account_id") REFERENCES "accounts"("id");

ALTER TABLE "accounts" ADD CONSTRAINT "accounts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
