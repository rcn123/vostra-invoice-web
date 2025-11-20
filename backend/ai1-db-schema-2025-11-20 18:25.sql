--
-- PostgreSQL database dump
--

\restrict T9LftevYDD2ZKbQVNCYw7eGb8mj1bv85ySmzEUP8eqFm1B1aFRReact8jCFYEju

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: konto_aggregates; Type: TABLE; Schema: public; Owner: vostra
--

CREATE TABLE public.konto_aggregates (
    konto text,
    total_transactions text,
    min_belopp text,
    max_belopp text,
    mean_belopp text,
    median_belopp text,
    q1_belopp text,
    q3_belopp text,
    iqr_belopp text,
    vanligaste_f text,
    f_confidence text,
    f_distribution text,
    first_transaction_date text,
    last_transaction_date text,
    generated_at text
);


ALTER TABLE public.konto_aggregates OWNER TO vostra;

--
-- Name: konto_definitions; Type: TABLE; Schema: public; Owner: vostra
--

CREATE TABLE public.konto_definitions (
    konto_id integer NOT NULL,
    konto_code text NOT NULL,
    caption text NOT NULL,
    kbas24 text,
    kbas25 text,
    kbas26 text,
    imported_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.konto_definitions OWNER TO vostra;

--
-- Name: konto_definitions_konto_id_seq; Type: SEQUENCE; Schema: public; Owner: vostra
--

CREATE SEQUENCE public.konto_definitions_konto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.konto_definitions_konto_id_seq OWNER TO vostra;

--
-- Name: konto_definitions_konto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vostra
--

ALTER SEQUENCE public.konto_definitions_konto_id_seq OWNED BY public.konto_definitions.konto_id;


--
-- Name: leverantor_aggregates; Type: TABLE; Schema: public; Owner: vostra
--

CREATE TABLE public.leverantor_aggregates (
    lev_nr bigint NOT NULL,
    namn text,
    total_transactions bigint,
    vanligaste_konto bigint,
    konto_confidence double precision,
    konto_distribution text,
    vanligaste_kst bigint,
    kst_confidence double precision,
    kst_distribution text,
    vanligaste_f bigint,
    f_confidence double precision,
    f_distribution text,
    median_belopp double precision,
    mean_belopp double precision,
    min_belopp double precision,
    max_belopp double precision,
    stddev_belopp double precision,
    seasonal_pattern text,
    first_transaction_date date,
    last_transaction_date date,
    generated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leverantor_aggregates OWNER TO vostra;

--
-- Name: leverantor_kst_aggregates; Type: TABLE; Schema: public; Owner: vostra
--

CREATE TABLE public.leverantor_kst_aggregates (
    lev_nr text,
    kst text,
    namn text,
    kst_namn text,
    total_transactions text,
    vanligaste_konto text,
    konto_confidence text,
    konto_distribution text,
    vanligaste_f text,
    f_confidence text,
    f_distribution text,
    median_belopp text,
    mean_belopp text,
    min_belopp text,
    max_belopp text,
    first_transaction_date text,
    last_transaction_date text,
    generated_at text
);


ALTER TABLE public.leverantor_kst_aggregates OWNER TO vostra;

--
-- Name: leverantor_last_invoice; Type: TABLE; Schema: public; Owner: vostra
--

CREATE TABLE public.leverantor_last_invoice (
    lev_nr text,
    first_invoice_date text,
    last_invoice_date text,
    invoice_count text
);


ALTER TABLE public.leverantor_last_invoice OWNER TO vostra;

--
-- Name: leverantor_payment_methods; Type: TABLE; Schema: public; Owner: vostra
--

CREATE TABLE public.leverantor_payment_methods (
    lev_nr bigint NOT NULL,
    payment_method text,
    first_seen_date text,
    last_seen_date text
);


ALTER TABLE public.leverantor_payment_methods OWNER TO vostra;

--
-- Name: leverantor_used_accounts; Type: TABLE; Schema: public; Owner: vostra
--

CREATE TABLE public.leverantor_used_accounts (
    lev_nr text,
    konto text,
    first_seen_date text,
    last_seen_date text,
    count text
);


ALTER TABLE public.leverantor_used_accounts OWNER TO vostra;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: vostra
--

CREATE TABLE public.suppliers (
    lev_nr bigint NOT NULL,
    namn text,
    org_nr text,
    imported_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    verksamhetsbeskrivning text,
    jurform_kod text,
    jurform_text text,
    sni_ng1 text,
    sni_ng2 text,
    sni_ng3 text,
    sni_ng4 text,
    sni_ng5 text,
    foretagsstatus bigint
);


ALTER TABLE public.suppliers OWNER TO vostra;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: vostra
--

CREATE TABLE public.transactions (
    id bigint NOT NULL,
    vt text,
    ver_datum date,
    ver_nr bigint,
    fakturanr text,
    resk_nr bigint,
    resk_nr_t text,
    konto bigint,
    f bigint,
    f_t text,
    kst bigint,
    kst_t text,
    projekt bigint,
    projekt_t text,
    belopp double precision,
    imported_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transactions OWNER TO vostra;

--
-- Name: konto_definitions konto_id; Type: DEFAULT; Schema: public; Owner: vostra
--

ALTER TABLE ONLY public.konto_definitions ALTER COLUMN konto_id SET DEFAULT nextval('public.konto_definitions_konto_id_seq'::regclass);


--
-- Name: konto_definitions konto_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: vostra
--

ALTER TABLE ONLY public.konto_definitions
    ADD CONSTRAINT konto_definitions_pkey PRIMARY KEY (konto_id);


--
-- Name: leverantor_aggregates leverantor_aggregates_pkey; Type: CONSTRAINT; Schema: public; Owner: vostra
--

ALTER TABLE ONLY public.leverantor_aggregates
    ADD CONSTRAINT leverantor_aggregates_pkey PRIMARY KEY (lev_nr);


--
-- Name: leverantor_payment_methods leverantor_payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: vostra
--

ALTER TABLE ONLY public.leverantor_payment_methods
    ADD CONSTRAINT leverantor_payment_methods_pkey PRIMARY KEY (lev_nr);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: vostra
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (lev_nr);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: vostra
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: idx_kbas24; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_kbas24 ON public.konto_definitions USING btree (kbas24);


--
-- Name: idx_kbas25; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_kbas25 ON public.konto_definitions USING btree (kbas25);


--
-- Name: idx_kbas26; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_kbas26 ON public.konto_definitions USING btree (kbas26);


--
-- Name: idx_konto_aggregates_konto; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_konto_aggregates_konto ON public.konto_aggregates USING btree (konto);


--
-- Name: idx_konto_aggregates_median; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_konto_aggregates_median ON public.konto_aggregates USING btree (median_belopp);


--
-- Name: idx_konto_code; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_konto_code ON public.konto_definitions USING btree (konto_code);


--
-- Name: idx_last_invoice_lev; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_last_invoice_lev ON public.leverantor_last_invoice USING btree (lev_nr);


--
-- Name: idx_lev_kst_aggregates_conf; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_lev_kst_aggregates_conf ON public.leverantor_kst_aggregates USING btree (konto_confidence);


--
-- Name: idx_lev_kst_aggregates_kst; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_lev_kst_aggregates_kst ON public.leverantor_kst_aggregates USING btree (kst);


--
-- Name: idx_lev_kst_aggregates_lev; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_lev_kst_aggregates_lev ON public.leverantor_kst_aggregates USING btree (lev_nr);


--
-- Name: idx_payment_methods_lev; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_payment_methods_lev ON public.leverantor_payment_methods USING btree (lev_nr);


--
-- Name: idx_transactions_konto; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_transactions_konto ON public.transactions USING btree (konto);


--
-- Name: idx_transactions_kst; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_transactions_kst ON public.transactions USING btree (kst);


--
-- Name: idx_transactions_resk_nr; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_transactions_resk_nr ON public.transactions USING btree (resk_nr);


--
-- Name: idx_transactions_ver_datum; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_transactions_ver_datum ON public.transactions USING btree (ver_datum);


--
-- Name: idx_used_accounts_konto; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_used_accounts_konto ON public.leverantor_used_accounts USING btree (konto);


--
-- Name: idx_used_accounts_lev; Type: INDEX; Schema: public; Owner: vostra
--

CREATE INDEX idx_used_accounts_lev ON public.leverantor_used_accounts USING btree (lev_nr);


--
-- PostgreSQL database dump complete
--

\unrestrict T9LftevYDD2ZKbQVNCYw7eGb8mj1bv85ySmzEUP8eqFm1B1aFRReact8jCFYEju

