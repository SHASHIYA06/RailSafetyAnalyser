--
-- PostgreSQL database dump
--

\restrict LoEJ3qzXFA2Jphb4zfzdtNtZTwctOUoZTIEfMmYgfvGbzHhd7epsN5cgskB6EIo

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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
-- Name: component_clauses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.component_clauses (
    id integer NOT NULL,
    component_id integer NOT NULL,
    clause_id integer NOT NULL,
    applicability_score numeric(5,2),
    compliance_evidence text,
    assessment_notes text,
    last_assessed timestamp without time zone DEFAULT now()
);


ALTER TABLE public.component_clauses OWNER TO postgres;

--
-- Name: component_clauses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.component_clauses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.component_clauses_id_seq OWNER TO postgres;

--
-- Name: component_clauses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.component_clauses_id_seq OWNED BY public.component_clauses.id;


--
-- Name: component_standards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.component_standards (
    id integer NOT NULL,
    component_id integer NOT NULL,
    standard_id integer NOT NULL,
    compliance_status text NOT NULL,
    compliance_score numeric(5,2),
    certification_date timestamp without time zone,
    expiry_date timestamp without time zone,
    notes text,
    verified_by text,
    last_verified timestamp without time zone DEFAULT now()
);


ALTER TABLE public.component_standards OWNER TO postgres;

--
-- Name: component_standards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.component_standards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.component_standards_id_seq OWNER TO postgres;

--
-- Name: component_standards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.component_standards_id_seq OWNED BY public.component_standards.id;


--
-- Name: component_suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.component_suppliers (
    id integer NOT NULL,
    component_id integer NOT NULL,
    supplier_id integer NOT NULL,
    supplier_part_number text,
    lead_time integer,
    price_range text,
    availability text DEFAULT 'available'::text NOT NULL
);


ALTER TABLE public.component_suppliers OWNER TO postgres;

--
-- Name: component_suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.component_suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.component_suppliers_id_seq OWNER TO postgres;

--
-- Name: component_suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.component_suppliers_id_seq OWNED BY public.component_suppliers.id;


--
-- Name: components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.components (
    id integer NOT NULL,
    name text NOT NULL,
    model text NOT NULL,
    manufacturer text NOT NULL,
    category text NOT NULL,
    subcategory text,
    description text,
    technical_specs jsonb,
    operating_conditions jsonb,
    certification_status text DEFAULT 'pending'::text NOT NULL,
    sil_level integer,
    rams_score numeric(5,2),
    reliability_score numeric(5,2),
    availability_score numeric(5,2),
    maintainability_score numeric(5,2),
    safety_score numeric(5,2),
    risk_level text DEFAULT 'medium'::text NOT NULL,
    last_updated timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.components OWNER TO postgres;

--
-- Name: components_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.components_id_seq OWNER TO postgres;

--
-- Name: components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.components_id_seq OWNED BY public.components.id;


--
-- Name: dlp_alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dlp_alerts (
    id integer NOT NULL,
    alert_type text NOT NULL,
    item_id integer,
    item_name text,
    message text NOT NULL,
    severity text DEFAULT 'medium'::text NOT NULL,
    is_resolved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    resolved_at timestamp without time zone
);


ALTER TABLE public.dlp_alerts OWNER TO postgres;

--
-- Name: dlp_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dlp_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dlp_alerts_id_seq OWNER TO postgres;

--
-- Name: dlp_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dlp_alerts_id_seq OWNED BY public.dlp_alerts.id;


--
-- Name: dlp_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dlp_items (
    id integer NOT NULL,
    item_id text NOT NULL,
    part_number text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    system_type text NOT NULL,
    vendor_name text,
    vendor_id integer,
    unit_of_measure text DEFAULT 'Piece'::text NOT NULL,
    received_qty integer DEFAULT 0,
    consumed_qty integer DEFAULT 0,
    available_qty integer DEFAULT 0,
    recommended_qty integer DEFAULT 10,
    reorder_level integer DEFAULT 5,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    critical_flag boolean DEFAULT false,
    notes text,
    last_updated timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.dlp_items OWNER TO postgres;

--
-- Name: dlp_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dlp_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dlp_items_id_seq OWNER TO postgres;

--
-- Name: dlp_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dlp_items_id_seq OWNED BY public.dlp_items.id;


--
-- Name: dlp_systems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dlp_systems (
    id integer NOT NULL,
    system_id text NOT NULL,
    system_name text NOT NULL,
    primary_vendor text,
    total_items integer DEFAULT 0,
    total_received integer DEFAULT 0,
    total_consumed integer DEFAULT 0,
    total_available integer DEFAULT 0,
    critical_status boolean DEFAULT false,
    maintenance_frequency text,
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.dlp_systems OWNER TO postgres;

--
-- Name: dlp_systems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dlp_systems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dlp_systems_id_seq OWNER TO postgres;

--
-- Name: dlp_systems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dlp_systems_id_seq OWNED BY public.dlp_systems.id;


--
-- Name: dlp_tools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dlp_tools (
    id integer NOT NULL,
    tool_id text NOT NULL,
    tool_name text NOT NULL,
    tool_number text,
    category text NOT NULL,
    location text,
    condition text DEFAULT 'Good'::text NOT NULL,
    calibration_due text,
    issued_to text,
    issued_date text,
    remarks text,
    qty integer DEFAULT 1,
    consumable boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.dlp_tools OWNER TO postgres;

--
-- Name: dlp_tools_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dlp_tools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dlp_tools_id_seq OWNER TO postgres;

--
-- Name: dlp_tools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dlp_tools_id_seq OWNED BY public.dlp_tools.id;


--
-- Name: dlp_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dlp_transactions (
    id integer NOT NULL,
    transaction_type text NOT NULL,
    item_id integer,
    item_name text,
    part_number text,
    quantity integer NOT NULL,
    from_location text,
    to_location text,
    reference_type text,
    reference_id text,
    remarks text,
    initiated_by text DEFAULT 'Admin'::text,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    transaction_date timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.dlp_transactions OWNER TO postgres;

--
-- Name: dlp_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dlp_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dlp_transactions_id_seq OWNER TO postgres;

--
-- Name: dlp_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dlp_transactions_id_seq OWNED BY public.dlp_transactions.id;


--
-- Name: dlp_vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dlp_vendors (
    id integer NOT NULL,
    vendor_id text NOT NULL,
    vendor_name text NOT NULL,
    vendor_code text NOT NULL,
    contact_person text,
    email text,
    phone text,
    country text,
    payment_terms text,
    delivery_days integer,
    quality_rating text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.dlp_vendors OWNER TO postgres;

--
-- Name: dlp_vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dlp_vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dlp_vendors_id_seq OWNER TO postgres;

--
-- Name: dlp_vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dlp_vendors_id_seq OWNED BY public.dlp_vendors.id;


--
-- Name: standard_clauses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.standard_clauses (
    id integer NOT NULL,
    standard_id integer NOT NULL,
    clause_number text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    requirements jsonb,
    rams_category text,
    sil_relevance integer,
    criticality_level text DEFAULT 'medium'::text NOT NULL
);


ALTER TABLE public.standard_clauses OWNER TO postgres;

--
-- Name: standard_clauses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.standard_clauses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.standard_clauses_id_seq OWNER TO postgres;

--
-- Name: standard_clauses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.standard_clauses_id_seq OWNED BY public.standard_clauses.id;


--
-- Name: standards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.standards (
    id integer NOT NULL,
    code text NOT NULL,
    title text NOT NULL,
    description text,
    pdf_url text,
    category text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    version text,
    published_date timestamp without time zone,
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.standards OWNER TO postgres;

--
-- Name: standards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.standards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.standards_id_seq OWNER TO postgres;

--
-- Name: standards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.standards_id_seq OWNED BY public.standards.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name text NOT NULL,
    country text,
    certifications jsonb,
    contact_info jsonb,
    irs_certified boolean DEFAULT false,
    quality_rating numeric(3,2),
    last_audit timestamp without time zone
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'viewer'::text NOT NULL,
    full_name text,
    email text,
    is_active boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: component_clauses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_clauses ALTER COLUMN id SET DEFAULT nextval('public.component_clauses_id_seq'::regclass);


--
-- Name: component_standards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_standards ALTER COLUMN id SET DEFAULT nextval('public.component_standards_id_seq'::regclass);


--
-- Name: component_suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_suppliers ALTER COLUMN id SET DEFAULT nextval('public.component_suppliers_id_seq'::regclass);


--
-- Name: components id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components ALTER COLUMN id SET DEFAULT nextval('public.components_id_seq'::regclass);


--
-- Name: dlp_alerts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_alerts ALTER COLUMN id SET DEFAULT nextval('public.dlp_alerts_id_seq'::regclass);


--
-- Name: dlp_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_items ALTER COLUMN id SET DEFAULT nextval('public.dlp_items_id_seq'::regclass);


--
-- Name: dlp_systems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_systems ALTER COLUMN id SET DEFAULT nextval('public.dlp_systems_id_seq'::regclass);


--
-- Name: dlp_tools id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_tools ALTER COLUMN id SET DEFAULT nextval('public.dlp_tools_id_seq'::regclass);


--
-- Name: dlp_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_transactions ALTER COLUMN id SET DEFAULT nextval('public.dlp_transactions_id_seq'::regclass);


--
-- Name: dlp_vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_vendors ALTER COLUMN id SET DEFAULT nextval('public.dlp_vendors_id_seq'::regclass);


--
-- Name: standard_clauses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standard_clauses ALTER COLUMN id SET DEFAULT nextval('public.standard_clauses_id_seq'::regclass);


--
-- Name: standards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standards ALTER COLUMN id SET DEFAULT nextval('public.standards_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: component_clauses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.component_clauses (id, component_id, clause_id, applicability_score, compliance_evidence, assessment_notes, last_assessed) FROM stdin;
\.


--
-- Data for Name: component_standards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.component_standards (id, component_id, standard_id, compliance_status, compliance_score, certification_date, expiry_date, notes, verified_by, last_verified) FROM stdin;
9	5	8	compliant	96.50	2024-01-15 00:00:00	\N	\N	TÜV SÜD Rail	2026-03-20 14:01:50.596188
10	5	12	compliant	98.20	2024-02-10 00:00:00	\N	\N	TÜV SÜD Rail	2026-03-20 14:01:50.596188
11	5	14	compliant	94.80	2024-03-05 00:00:00	\N	\N	DEKRA Rail	2026-03-20 14:01:50.596188
12	6	8	compliant	98.10	2024-01-20 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
13	6	20	compliant	97.50	2024-02-25 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
14	6	11	compliant	98.80	2024-03-15 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
15	7	21	compliant	93.20	2024-04-10 00:00:00	\N	\N	EXOVA BM TRADA	2026-03-20 14:01:50.596188
16	7	8	partial	87.50	2024-05-01 00:00:00	\N	\N	TÜV NORD	2026-03-20 14:01:50.596188
17	8	8	compliant	97.80	2024-01-10 00:00:00	\N	\N	TÜV SÜD Rail	2026-03-20 14:01:50.596188
18	8	35	compliant	96.50	2024-02-01 00:00:00	\N	\N	TÜV SÜD Rail	2026-03-20 14:01:50.596188
19	8	20	compliant	98.00	2024-03-01 00:00:00	\N	\N	TÜV SÜD Rail	2026-03-20 14:01:50.596188
20	9	8	compliant	98.50	2024-01-25 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
21	9	11	compliant	99.00	2024-02-15 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
22	10	8	compliant	94.20	2024-03-20 00:00:00	\N	\N	TÜV NORD	2026-03-20 14:01:50.596188
23	10	12	compliant	95.80	2024-04-05 00:00:00	\N	\N	TÜV NORD	2026-03-20 14:01:50.596188
24	15	8	compliant	97.20	2024-01-30 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
25	15	11	compliant	98.50	2024-02-20 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
26	22	8	compliant	98.90	2024-01-08 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
27	22	11	compliant	99.10	2024-02-08 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
28	22	35	compliant	98.70	2024-03-08 00:00:00	\N	\N	CERTIFER	2026-03-20 14:01:50.596188
\.


--
-- Data for Name: component_suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.component_suppliers (id, component_id, supplier_id, supplier_part_number, lead_time, price_range, availability) FROM stdin;
4	5	4	SIBAS32-TMC-001	16	€50,000-70,000	available
5	6	5	ATLAS200-OBU-001	20	€80,000-120,000	available
6	7	6	FPA5000-RWY-001	12	€15,000-25,000	available
7	8	4	TGMT-V40-001	24	€500,000-800,000	available
8	9	7	STR-WC-G8-001	18	€200,000-350,000	available
9	10	8	EP2002-BCU-001	14	€25,000-40,000	available
10	11	11	BCC750-V2-001	16	€35,000-55,000	available
11	13	5	ONIX800-TI-001	20	€45,000-65,000	available
12	14	9	WBL88-1800-001	10	€8,000-15,000	available
13	15	7	VACMA-SIL4-001	12	€12,000-18,000	available
14	16	10	C146-DCU-001	8	€5,000-10,000	available
15	22	7	STR-S40-ATC-001	30	€1,000,000-2,000,000	limited
\.


--
-- Data for Name: components; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.components (id, name, model, manufacturer, category, subcategory, description, technical_specs, operating_conditions, certification_status, sil_level, rams_score, reliability_score, availability_score, maintainability_score, safety_score, risk_level, last_updated, created_at) FROM stdin;
5	Siemens SIBAS 32 Traction Motor Controller	SIBAS-32-TMC-V3.2	Siemens Mobility	Power & Electrical Systems	Traction Control	Advanced traction motor control system for metro and light rail with integrated safety functions and energy recovery.	{"power": "2.5 MW", "weight": "120kg", "voltage": "1500V DC / 25kV AC", "dimensions": "800x600x300mm", "efficiency": "96%"}	{"altitude": {"max": 2000, "unit": "m"}, "humidity": {"max": 95, "unit": "%"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	3	96.50	97.20	98.10	95.30	96.80	low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
6	Alstom ATLAS 200 ETCS Onboard Unit	ATLAS-200-OBU-L3	Alstom Transport	Control & Signaling	Train Control	ETCS Level 2/3 onboard unit with advanced train protection and automatic train operation for high-speed and urban rail.	{"maxSpeed": "350 km/h", "etcsLevel": "2/3", "interfaces": ["DMI", "STM", "Radio"], "processingUnit": "dual_redundant"}	{"humidity": {"max": 95, "unit": "%"}, "vibration": "EN 61373 Category 1", "temperature": {"max": 70, "min": -25, "unit": "°C"}}	certified	4	98.10	99.00	98.50	97.20	98.70	very low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
7	Bosch FPA-5000 Fire Detection Panel	FPA-5000-RWY-V2.1	Bosch Security Systems	Safety Systems	Fire Protection	Advanced fire detection and alarm system for metro stations and tunnels with intelligent smoke detection.	{"loops": 4, "zones": 250, "detectionTypes": ["smoke", "heat", "flame", "gas"], "networkProtocol": "TCP/IP"}	{"humidity": {"max": 95, "unit": "%"}, "ipRating": "IP54", "temperature": {"max": 55, "min": -10, "unit": "°C"}}	certified	2	89.70	92.30	89.50	85.20	93.80	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
8	Siemens TRAINGUARD MT CBTC System	TG-MT-V4.0	Siemens Mobility	Control & Signaling	CBTC	Communication-based train control system providing automatic train supervision, protection, and operation for metro lines.	{"headway": "90 seconds", "ato_grade": "GoA4", "frequency": "2.4 GHz ISM", "communicationType": "radio"}	{"humidity": {"max": 95, "unit": "%"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	4	97.80	98.50	99.20	96.10	97.40	low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
9	Thales SelTrac CBTC Wayside Controller	SELTRAC-WC-G8	Thales Group	Control & Signaling	CBTC	Wayside controller for SelTrac CBTC systems providing zone controller functionality for urban metro operations.	{"redundancy": "hot_standby", "radioProtocol": "IEEE 802.11p", "processingCapacity": "120 trains/hour"}	{"humidity": {"max": 100, "unit": "%"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	4	98.50	99.10	99.40	97.50	98.90	very low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
10	Knorr-Bremse EP2002 Brake Control Unit	EP2002-BCU-V5.1	Knorr-Bremse Rail	Mechanical Systems	Braking Systems	Electronic brake control unit for metro and regional trains with integrated diagnostics and anti-skid functionality.	{"brakeTypes": ["regenerative", "friction", "magnetic"], "interfaces": ["TCMS", "WTB"], "maxDeceleration": "1.3 m/s²"}	{"humidity": {"max": 95, "unit": "%"}, "ipRating": "IP65", "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	3	94.20	95.80	96.10	92.50	94.70	low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
11	ABB BORDLINE CC750 Auxiliary Converter	BORDLINE-CC750-V2	ABB Rail	Power & Electrical Systems	Auxiliary Power	Static auxiliary converter for rolling stock providing 400V AC and 110V DC supplies from 750V DC or 1500V DC catenary.	{"weight": "280kg", "efficiency": "94%", "outputPower": "120 kVA", "inputVoltage": "750V / 1500V DC"}	{"altitude": {"max": 3000, "unit": "m"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	2	91.30	93.50	92.80	89.70	90.40	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
12	Siemens SIRIUS 3RV Circuit Breaker	3RV2041-4JA10	Siemens Mobility	Power & Electrical Systems	Protection Devices	Motor protection circuit breaker for railway applications rated for harsh environmental conditions.	{"standard": "IEC 60947-2", "protection": "IP20", "ratedCurrent": "30A", "breakingCapacity": "100kA"}	{"humidity": {"max": 95, "unit": "%"}, "temperature": {"max": 55, "min": -25, "unit": "°C"}}	certified	1	87.50	90.20	88.70	85.00	86.80	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
13	Alstom ONIX 800 Traction Inverter	ONIX-800-TI-V3	Alstom Transport	Power & Electrical Systems	Traction Inverters	IGBT-based traction inverter for electric multiple units with regenerative braking capability.	{"power": "800 kW", "voltage": "1500V DC", "frequency": "0-300Hz", "coolingType": "water_cooled"}	{"humidity": {"max": 100, "unit": "%"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	2	93.60	95.10	94.30	91.80	93.20	low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
14	Faiveley Transport Pantograph WBL 88	WBL-88-1800	Faiveley Transport	Current Collection Systems	Pantographs	Single-arm pantograph for high-speed rail with automatic adjustment and ice detection system.	{"material": "carbon_strip", "maxSpeed": "380 km/h", "contactForce": "60-90N", "workingHeight": "1800mm"}	{"temperature": {"max": 60, "min": -40, "unit": "°C"}, "iceProtection": true}	certified	1	88.90	91.40	90.20	85.70	88.20	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
15	Thales VACMA Vigilance System	VACMA-SIL4-V2	Thales Group	Safety Systems	Vigilance & Deadman	SIL 4 vigilance control and management system ensuring driver alertness throughout train operations.	{"silLevel": 4, "interface": "CAN", "displayType": "LED", "responseTime": "< 2.5s"}	{"vibration": "EN 61373 Category 1B", "temperature": {"max": 70, "min": -25, "unit": "°C"}}	certified	4	97.20	98.10	97.80	95.90	99.10	very low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
16	Schaltbau C146 Door Control Unit	C146-DCU-V4.2	Schaltbau Group	Passenger Systems	Door Systems	Electronic door control unit for metro and regional trains supporting plug and sliding door configurations.	{"maxDoors": 8, "doorTypes": ["sliding", "plug", "bi-parting"], "communicationBus": "MVB", "obstacleDetection": "laser"}	{"humidity": {"max": 100, "unit": "%"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	2	90.80	92.50	91.30	89.20	90.50	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
17	Siemens SICAM A8000 RTU	SICAM-A8000-CP-8050	Siemens Mobility	Control & Signaling	Remote Terminal Units	Remote terminal unit for railway substation and infrastructure monitoring with IEC 61850 support.	{"ios": 512, "protocol": "IEC 61850", "enclosure": "19inch_rack", "redundancy": "dual_port_ethernet"}	{"humidity": {"max": 95, "unit": "%"}, "temperature": {"max": 55, "min": -25, "unit": "°C"}}	certified	2	92.10	94.30	93.70	90.20	91.50	low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
18	ABB ACS880 Railway Drive	ACS880-07-1100A-7	ABB Rail	Power & Electrical Systems	Variable Speed Drives	All-compatible drive for railway applications supporting RDFI, ABB industrial drives functionalities.	{"power": "630 kW", "voltage": "690V", "efficiency": "97%", "coolingType": "forced_air"}	{"altitude": {"max": 4000, "unit": "m"}, "temperature": {"max": 40, "min": -15, "unit": "°C"}}	pending	1	85.40	87.20	86.50	83.80	84.90	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
19	Alstom PRIMA II Electric Locomotive	PRIMA-II-6MW-AC	Alstom Transport	Rolling Stock	Locomotives	6MW AC electric locomotive for mainline freight and passenger service with regenerative braking.	{"power": "6 MW", "axleLoad": "22.5t", "maxSpeed": "200 km/h", "tractionForce": "300kN"}	{"altitude": {"max": 2500, "unit": "m"}, "temperature": {"max": 50, "min": -40, "unit": "°C"}}	certified	2	92.70	94.50	93.80	91.30	91.90	low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
20	Knorr-Bremse ESRA 2 Braking System	ESRA-2-HS-V3	Knorr-Bremse Rail	Mechanical Systems	Braking Systems	Electronic Slip-Slide Protection and Rail Adhesion system for high-speed trains up to 350 km/h.	{"axles": 16, "maxSpeed": "350 km/h", "brakeTypes": ["pneumatic", "regenerative"], "sensorType": "rotary_encoder"}	{"humidity": {"max": 98, "unit": "%"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	3	95.30	96.80	95.90	93.70	96.10	low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
21	Siemens SIRIUS 3TK2845 Safety Relay	3TK2845-1CB30	Siemens Mobility	Safety Systems	Safety Relays	Safety relay module for SIL 3 / PLe emergency stop and safety door monitoring applications.	{"contacts": "3NO+1NC", "silLevel": 3, "responseTime": "< 20ms", "supplyVoltage": "24V DC"}	{"humidity": {"max": 95, "unit": "%"}, "temperature": {"max": 60, "min": -25, "unit": "°C"}}	certified	3	96.80	97.50	97.10	95.80	98.20	very low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
22	Thales SELTRAC S40 ATC System	SELTRAC-S40-ATC	Thales Group	Control & Signaling	Automatic Train Control	Automatic train control system for fully driverless metro operations (GoA4) with integrated ATO, ATP, and ATS.	{"headway": "75 seconds", "goaLevel": 4, "trainCapacity": 1000, "communicationType": "radio"}	{"humidity": {"max": 100, "unit": "%"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	4	98.90	99.30	99.50	98.20	99.40	very low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
23	Faiveley HVAC Climate Control Unit	FT-CCU-60-R290	Faiveley Transport	Passenger Systems	HVAC Systems	Roof-mounted HVAC unit for metro cars using R290 natural refrigerant with EN 50155 compliance.	{"airflow": "8000 m³/h", "refrigerant": "R290", "coolingCapacity": "30 kW", "heatingCapacity": "24 kW"}	{"humidity": {"max": 100, "unit": "%"}, "temperature": {"max": 55, "min": -40, "unit": "°C"}}	certified	1	86.30	88.90	87.40	84.10	85.60	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
24	Siemens VESYS Railway Wiring System	VESYS-8.0-RWY	Siemens Mobility	Communications & Electronics	Wiring Systems	Electrical wiring design and manufacturing tool optimized for railway vehicle applications with LCM integration.	{"voltage": "Up to 3kV", "fireClass": "EN 45545 HL3", "cableTypes": ["PVC", "XLPE", "Silicone"]}	{"temperature": {"max": 90, "min": -40, "unit": "°C"}, "flameRetardant": true}	certified	1	84.70	87.30	85.90	82.50	83.80	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
25	ABB BORDLINE ESS Energy Storage	BORDLINE-ESS-V1.2	ABB Rail	Power & Electrical Systems	Energy Storage	Lithium-ion energy storage system for catenary-free operation and energy peak shaving in metro applications.	{"capacity": "100 kWh", "cellType": "LFP", "cycleLife": 10000, "peakPower": "500 kW"}	{"humidity": {"max": 95, "unit": "%"}, "temperature": {"max": 45, "min": -20, "unit": "°C"}}	certified	2	91.50	93.20	92.70	89.50	91.00	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
26	Knorr-Bremse FLEXtra Bogies	FLEXtra-B5000	Knorr-Bremse Rail	Mechanical Systems	Bogies & Wheelsets	Modular bogie design for regional and metro trains with active tilting and condition monitoring integration.	{"gauges": ["1435mm", "1668mm"], "axleLoad": "20t", "maxSpeed": "200 km/h", "tiltingAngle": "8°"}	{"humidity": {"max": 100, "unit": "%"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	1	89.40	91.70	90.80	87.30	88.50	medium	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
27	Alstom ONIS Onboard Information System	ONIS-HD-V5.0	Alstom Transport	Passenger Systems	Passenger Information	Passenger information system with HD displays, real-time GTFS integration, and multi-language support.	{"languages": 32, "resolution": "1920x1080", "displaySize": "21.5 inch", "communicationProtocol": "Ethernet"}	{"humidity": {"max": 95, "unit": "%"}, "temperature": {"max": 60, "min": -25, "unit": "°C"}}	certified	0	82.10	85.40	83.70	80.20	81.50	low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
28	Thales Rail Communication Gateway	RCG-4G-LTE-TETRA	Thales Group	Communications & Electronics	Communication Systems	Multi-mode communication gateway supporting GSM-R, LTE, TETRA, and WiFi for comprehensive train-ground communication.	{"antennas": 6, "protocols": ["GSM-R", "LTE", "TETRA", "WiFi"], "encryption": "AES-256", "redundancy": "dual_modem"}	{"humidity": {"max": 100, "unit": "%"}, "temperature": {"max": 70, "min": -40, "unit": "°C"}}	certified	2	93.40	95.00	94.60	91.70	92.80	low	2026-03-20 14:01:50.587925	2026-03-20 14:01:50.587925
\.


--
-- Data for Name: dlp_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dlp_alerts (id, alert_type, item_id, item_name, message, severity, is_resolved, created_at, resolved_at) FROM stdin;
1	CRITICAL	\N	TMS Central Control Unit	Critical item at minimum stock level (1 unit). Recommend immediate procurement.	critical	f	2026-03-20 20:16:33.727784	\N
2	LOW_STOCK	\N	TMS Communication Node	Stock at reorder level. Available: 1, Reorder Level: 1.	high	f	2026-03-20 20:16:33.727784	\N
3	LOW_STOCK	\N	Brake Cylinder - Type A	Available qty (8) approaching reorder level (8). Consider raising PO.	medium	f	2026-03-20 20:16:33.727784	\N
4	LOW_STOCK	\N	Collector Shoe Support - Steel	Available qty (3) at reorder threshold. Long lead time from Germany.	high	f	2026-03-20 20:16:33.727784	\N
\.


--
-- Data for Name: dlp_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dlp_items (id, item_id, part_number, description, category, system_type, vendor_name, vendor_id, unit_of_measure, received_qty, consumed_qty, available_qty, recommended_qty, reorder_level, status, critical_flag, notes, last_updated, created_at) FROM stdin;
1	DLP-001	II91919/02105	Safety Valve - Brake System	Brake	Brake System	KBI Brake	\N	Piece	15	8	7	10	5	ACTIVE	t	Critical safety component	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
2	DLP-002	II91919/02106	Ballcock Assembly - Brake	Brake	Brake System	KBI Brake	\N	Piece	12	5	7	8	4	ACTIVE	f	Standard wear item	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
3	DLP-003	AM5007	Traction Motor Unit - 300KW	Traction	Traction Motor & Inverter	M/s MELCO	\N	Unit	4	1	3	2	1	ACTIVE	f	Rarely replaced	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
4	DLP-004	AM5008	Inverter Module - Gate Circuit	Traction	Traction Motor & Inverter	M/s MELCO	\N	Unit	4	1	3	2	1	ACTIVE	f	Planned replacement	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
5	DLP-005	KS1001	Brake Cylinder - Type A	Brake	Brake System	KBI Brake	\N	Piece	20	12	8	15	8	ACTIVE	f	Routine maintenance	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
6	DLP-006	KS1002	Brake Control Board - Main	Brake	Brake System	KBI Brake	\N	Unit	8	3	5	5	3	ACTIVE	f	Standard replacement	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
7	DLP-007	TR1001	Rail Collector - Carbon	Current_Collector	Current Collector	Stemmann-Technic	\N	Piece	10	4	6	8	4	ACTIVE	t	Critical for collection	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
8	DLP-008	TR1002	Collector Shoe Support - Steel	Current_Collector	Current Collector	Stemmann-Technic	\N	Set	5	2	3	4	2	ACTIVE	f	Routine wear	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
9	DLP-009	BRK001	Emergency Ballcock	Brake	Brake System	KBI Brake	\N	Piece	18	10	8	12	6	ACTIVE	f	Emergency backup	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
10	DLP-010	BRK002	Brake Valve - Pilot	Brake	Brake System	KBI Brake	\N	Piece	14	6	8	10	5	ACTIVE	f	Maintenance item	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
11	DLP-011	APS001	APS Battery Charger Unit	APS	APS	M/s MELCO	\N	Unit	2	0	2	2	1	ACTIVE	f	Charging unit	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
12	DLP-012	APS002	APS Power Module	APS	APS	M/s MELCO	\N	Unit	3	1	2	2	1	ACTIVE	f	Power supply	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
13	DLP-013	TMS001	TMS Central Control Unit	TMS	TMS	M/s MELCO	\N	Unit	1	0	1	1	1	CRITICAL	t	Central processing	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
14	DLP-014	TMS002	TMS Communication Node	TMS	TMS	M/s MELCO	\N	Unit	2	1	1	1	1	ACTIVE	f	System communication	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
15	DLP-015	LIT001	Saloon Light Fixture - LED	Lighting	Lighting	Tecknoware	\N	Unit	6	2	4	5	3	ACTIVE	f	Energy efficient LED	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
16	DLP-016	LIT002	Light Diffuser Panel	Lighting	Lighting	Tecknoware	\N	Piece	12	4	8	10	5	ACTIVE	f	Light diffusion	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
17	DLP-017	CC001	Current Collector Rail - Pantograph	Current_Collector	Current Collector	Stemmann-Technic	\N	Piece	8	3	5	6	3	ACTIVE	f	Power collection	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
18	DLP-018	CC002	Insulator Set - Ceramic	Current_Collector	Current Collector	Stemmann-Technic	\N	Set	4	1	3	3	2	ACTIVE	f	Electrical insulation	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
19	DLP-019	VAC001	VAC Compressor Unit	VAC	VAC System	Faiveley	\N	Unit	2	0	2	2	1	ACTIVE	f	Compression system	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
20	DLP-020	VAC002	VAC Condenser Assembly	VAC	VAC System	Faiveley	\N	Unit	3	1	2	2	1	ACTIVE	f	Heat rejection system	2026-03-20 20:16:33.707163	2026-03-20 20:16:33.707163
\.


--
-- Data for Name: dlp_systems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dlp_systems (id, system_id, system_name, primary_vendor, total_items, total_received, total_consumed, total_available, critical_status, maintenance_frequency, last_updated) FROM stdin;
1	SYS-001	Traction Motor & Inverter	M/s MELCO	2	8	2	6	f	Low	2026-03-20 20:16:33.698977
2	SYS-002	Brake System	KBI Brake	4	52	29	23	t	High	2026-03-20 20:16:33.698977
3	SYS-003	APS (Auxiliary Power Supply)	M/s MELCO	2	5	1	4	f	Low	2026-03-20 20:16:33.698977
4	SYS-004	TMS (Train Management System)	M/s MELCO	2	3	2	1	t	Medium	2026-03-20 20:16:33.698977
5	SYS-005	Lighting System	Tecknoware	2	18	6	12	f	Medium	2026-03-20 20:16:33.698977
6	SYS-006	Current Collector	Stemmann-Technic	2	13	4	9	f	High	2026-03-20 20:16:33.698977
7	SYS-007	VAC System	Faiveley	2	5	1	4	f	High	2026-03-20 20:16:33.698977
8	SYS-008	PAPIS & CCTV System	Televic	2	0	0	0	f	Low	2026-03-20 20:16:33.698977
9	SYS-009	Saloon Door System	KBI	2	0	0	0	f	High	2026-03-20 20:16:33.698977
10	SYS-010	Battery System	SAFT	2	0	0	0	f	Low	2026-03-20 20:16:33.698977
11	SYS-011	Coupler System	Faiveley	2	0	0	0	f	Medium	2026-03-20 20:16:33.698977
12	SYS-012	Fire Detection System	SEMA	2	0	0	0	f	Low	2026-03-20 20:16:33.698977
13	SYS-013	Junction Boxes & Terminal Boards	River Engineering	2	0	0	0	f	Low	2026-03-20 20:16:33.698977
14	SYS-014	Vehicle Control & Connectors	River Engineering	2	0	0	0	f	Low	2026-03-20 20:16:33.698977
\.


--
-- Data for Name: dlp_tools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dlp_tools (id, tool_id, tool_name, tool_number, category, location, condition, calibration_due, issued_to, issued_date, remarks, qty, consumable, created_at, updated_at) FROM stdin;
1	TL-001	Digital Multimeter	TL-001	Electrical	Tool Room	Good	2026-06-30	\N	\N	Fluke 87V	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
2	TL-002	Torque Wrench (50-300 Nm)	TL-002	Mechanical	Tool Room	Good	2026-09-30	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
3	TL-003	Oscilloscope (100 MHz)	TL-003	Electrical	Electronics Lab	Good	2026-12-31	\N	\N	Rigol DS1102E	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
4	TL-004	Insulation Resistance Tester	TL-004	Electrical	Tool Room	Good	2026-06-30	\N	\N	Megger MIT430	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
5	TL-005	Hydraulic Jack (20T)	TL-005	Mechanical	Pit Area	Good	\N	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
6	TL-006	Laser Alignment Tool	TL-006	Precision	Tool Room	Good	2026-03-31	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
7	TL-007	Borescope Camera	TL-007	Inspection	Tool Room	Good	\N	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
8	TL-008	Infrared Thermometer	TL-008	Measurement	Tool Room	Good	2026-09-30	\N	\N	Fluke 568	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
9	TL-009	Cable Crimping Tool	TL-009	Electrical	Tool Room	Good	\N	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
10	TL-010	Pneumatic Drill	TL-010	Mechanical	Workshop	Good	\N	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
11	TL-011	AC Power Quality Analyzer	TL-011	Electrical	Electronics Lab	Good	2026-06-30	\N	\N	Fluke 435-II	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
12	TL-012	Wheel Profile Gauge	TL-012	Measurement	Wheel Shop	Good	2026-12-31	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
13	TL-013	Brake Disc Micrometer	TL-013	Measurement	Workshop	Good	2026-09-30	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
14	TL-014	TCMS Laptop (Diagnostic)	TL-014	Diagnostic	Electronics Lab	Good	\N	\N	\N	Mitsubishi licensed	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
15	TL-015	Door System Diagnostic Kit	TL-015	Diagnostic	Tool Room	Good	\N	\N	\N	Faiveley proprietary	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
16	TL-016	Clamp Meter (AC/DC)	TL-016	Electrical	Tool Room	Good	2026-06-30	\N	\N	Fluke 376	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
17	TL-017	Impact Wrench	TL-017	Mechanical	Workshop	Good	\N	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
18	TL-018	Vibration Analyzer	TL-018	Measurement	Tool Room	Good	2026-12-31	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
19	TL-019	Paint Thickness Gauge	TL-019	Measurement	Tool Room	Good	2026-09-30	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
20	TL-020	Loctite Dispenser Kit	TL-020	Mechanical	Workshop	Good	\N	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
21	TL-021	X5 Connector PAPIS	TL-021	Electrical	Almirah 01 Rack 01	Good	\N	\N	\N	Box 7	18	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
22	TL-022	External CCTV Camera Cover	TL-022	Inspection	Almirah 01 Rack 01	Good	\N	\N	\N	\N	1	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
23	TL-023	MOXA Connector (M12) 18 Pin	TL-023	Electrical	Almirah 01 Rack 01	Good	\N	\N	\N	Box 6	4	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
24	TL-024	Camera Tools	TL-024	Inspection	Almirah 01 Rack 01	Good	\N	\N	\N	\N	6	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
25	TL-025	Dummy Cap (Male Connector cap)	TL-025	Electrical	Almirah 01 Rack 01	Good	\N	\N	\N	Box 6	12	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
26	TL-026	Dust Cap	TL-026	Electrical	Almirah 01 Rack 01	Good	\N	\N	\N	Box 2	60	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
27	TL-027	Stinger Box (Open & Close Sticker)	TL-027	Safety	Almirah 01 Rack 01	Good	\N	\N	\N	Box 3	42	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
28	TL-028	Sticker (Spare) Plate	TL-028	Safety	Almirah 01 Rack 01	Good	\N	\N	\N	Box 3	18	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
29	TL-029	Bracket (FDS-HMI)	TL-029	Electrical	Almirah 01 Rack 01	Good	\N	\N	\N	\N	2	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
30	TL-030	Auto Dimmer (Taknoware)	TL-030	Electrical	Almirah 01 Rack 01	Good	\N	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
31	TL-046	Wago Female Connector	TL-046	Electrical	Almirah 01 Rack 02	Good	\N	\N	\N	Box 2	166	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
32	TL-047	WAGO TB 280	TL-047	Electrical	Almirah 01 Rack 02	Good	\N	\N	\N	\N	100	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
33	TL-050	WAGO 279	TL-050	Electrical	Almirah 01 Rack 02	Good	\N	\N	\N	\N	88	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
34	TL-054	Walkie Talkie	TL-054	Communication	Almirah 01 Rack 02	Good	\N	\N	\N	\N	5	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
35	TL-072	Polyester Putty	TL-072	Consumable	Almirah 01 Rack 04	Good	\N	\N	\N	Box 2	100	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
36	TL-087	Small Shim (3TD15782801)	TL-087	Mechanical	Almirah 01 Rack 04	Good	\N	\N	\N	\N	140	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
37	TL-088	Big Shim (3TD15776R02)	TL-088	Mechanical	Almirah 01 Rack 04	Good	\N	\N	\N	\N	208	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
38	TL-100	MRD-2 (Faulty from SEMA)	TL-100	Diagnostic	Almirah 01 Rack 02	Faulty	\N	\N	\N	\N	1	f	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
39	TL-102	Welding Rod (AWS A5.9: ER 308L)	TL-102	Consumable	Almirah 01 Rack 05	Good	\N	\N	\N	12.5 Kg	1	t	2026-03-20 20:16:33.73891	2026-03-20 20:16:33.73891
\.


--
-- Data for Name: dlp_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dlp_transactions (id, transaction_type, item_id, item_name, part_number, quantity, from_location, to_location, reference_type, reference_id, remarks, initiated_by, status, transaction_date, created_at) FROM stdin;
1	RECEIPT	\N	Safety Valve - Brake System	II91919/02105	15	\N	Central Store	PO	PO-2026-001	Initial stock receipt	Admin	COMPLETED	2026-03-20 20:16:33.722284	2026-03-20 20:16:33.722284
2	ISSUE	\N	Safety Valve - Brake System	II91919/02105	8	Central Store	Maintenance Area	JOB_CARD	JC-2026-042	Brake maintenance TS#05	Admin	COMPLETED	2026-03-20 20:16:33.722284	2026-03-20 20:16:33.722284
3	RECEIPT	\N	Traction Motor Unit - 300KW	AM5007	4	\N	Central Store	PO	PO-2026-002	Planned procurement	Admin	COMPLETED	2026-03-20 20:16:33.722284	2026-03-20 20:16:33.722284
4	ISSUE	\N	Traction Motor Unit - 300KW	AM5007	1	Central Store	Workshop	NCR	NCR-2026-018	Motor replacement TS#12	Admin	COMPLETED	2026-03-20 20:16:33.722284	2026-03-20 20:16:33.722284
5	RECEIPT	\N	Brake Cylinder - Type A	KS1001	20	\N	Central Store	PO	PO-2026-003	Routine stock replenishment	Admin	COMPLETED	2026-03-20 20:16:33.722284	2026-03-20 20:16:33.722284
6	ISSUE	\N	Brake Cylinder - Type A	KS1001	12	Central Store	Maintenance Area	JOB_CARD	JC-2026-051	Periodic brake overhaul	Admin	COMPLETED	2026-03-20 20:16:33.722284	2026-03-20 20:16:33.722284
7	RETURN	\N	Rail Collector - Carbon	TR1001	2	Maintenance Area	Central Store	OTHER	RTN-2026-007	Unused stock returned	Admin	COMPLETED	2026-03-20 20:16:33.722284	2026-03-20 20:16:33.722284
8	ISSUE	\N	TMS Central Control Unit	TMS001	0	Central Store	Maintenance Area	NCR	NCR-2026-020	Reserved for emergency use	Admin	COMPLETED	2026-03-20 20:16:33.722284	2026-03-20 20:16:33.722284
\.


--
-- Data for Name: dlp_vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dlp_vendors (id, vendor_id, vendor_name, vendor_code, contact_person, email, phone, country, payment_terms, delivery_days, quality_rating, is_active, created_at) FROM stdin;
1	VEND-001	M/s MELCO	MELCO-001	Mr. Rajesh Kumar	rajesh@melco.co.in	+91-22-1234-5678	India	Net 30	14	Excellent	t	2026-03-20 20:16:33.664901
2	VEND-002	KBI Brake	KBI-001	Mr. Vikram Singh	vikram@kbibrake.com	+91-22-2345-6789	India	Net 30	10	Excellent	t	2026-03-20 20:16:33.664901
3	VEND-003	Tecknoware	TECK-001	Mr. Ashok Patel	ashok@tecknoware.com	+91-80-3456-7890	India	Net 45	21	Good	t	2026-03-20 20:16:33.664901
4	VEND-004	Stemmann-Technic	STEM-001	Mr. Heinrich Vogel	support@stemmann.com	+49-89-4567-8901	Germany	Net 60	30	Excellent	t	2026-03-20 20:16:33.664901
5	VEND-005	Mafelec	MAFE-001	Mr. Jean Pierre	jp@mafelec.com	+33-1-5678-9012	France	Net 30	21	Good	t	2026-03-20 20:16:33.664901
6	VEND-006	Faiveley	FAIV-001	Mr. Michel Dupont	sales@faiveley.co.in	+91-22-6789-0123	India	Net 30	14	Excellent	t	2026-03-20 20:16:33.664901
7	VEND-007	Televic	TELE-001	Mr. Tom Richardson	contact@televic.com	+33-2-7890-1234	France	Net 45	30	Good	t	2026-03-20 20:16:33.664901
8	VEND-008	SAFT	SAFT-001	Mr. Patrick Blanc	sales@saft.fr	+33-1-8901-2345	France	Net 60	45	Excellent	t	2026-03-20 20:16:33.664901
9	VEND-009	SEMA	SEMA-001	Mr. Klaus Mueller	info@sema.com	+49-89-9012-3456	Germany	Net 30	21	Good	t	2026-03-20 20:16:33.664901
10	VEND-010	River Engineering	RIVE-001	Mr. Ravi Shankar	contact@rivereng.co.in	+91-22-0123-4567	India	Net 30	7	Excellent	t	2026-03-20 20:16:33.664901
\.


--
-- Data for Name: standard_clauses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.standard_clauses (id, standard_id, clause_number, title, content, requirements, rams_category, sil_relevance, criticality_level) FROM stdin;
4	8	4.3.1	RAMS Policy	The supplier shall establish, document and maintain a RAMS policy.	{"type": "mandatory", "evidence": "documented_policy"}	Reliability	2	high
5	8	8.2.4.26.1	Hazard Log	The Hazard Log shall include all hazards throughout the system life cycle.	{"type": "mandatory", "evidence": "hazard_log"}	Safety	4	critical
6	12	4.2	Temperature Classes	Equipment shall be designed to operate within specified temperature ranges.	{"type": "mandatory", "evidence": "test_report"}	Reliability	1	medium
\.


--
-- Data for Name: standards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.standards (id, code, title, description, pdf_url, category, status, version, published_date, last_updated) FROM stdin;
8	EN 50126-1	Railway applications - RAMS - Part 1: Generic RAMS process	Defines the RAMS process and lifecycle for railway applications.	https://www.en-standard.eu/bs-en-50126-1-2017	RAMS	active	2017+A1:2024	2017-12-01 00:00:00	2026-03-20 14:01:50.558516
9	EN 50126-2	Railway applications - RAMS - Part 2: Systems approach to safety	Systems approach to safety within the RAMS framework.	https://standards.globalspec.com/std/10115699/en-50126-2	RAMS	active	2017	2017-12-01 00:00:00	2026-03-20 14:01:50.558516
10	EN 50128	Railway applications - Software for railway control and protection systems	Specifies requirements and recommendations for development of software for railway control and protection systems.	https://standards.globalspec.com/std/14317747/en-50128	Software	superseded	2011+A1:2020	2011-10-01 00:00:00	2026-03-20 14:01:50.558516
11	EN 50129	Railway applications - Safety related electronic systems for signaling	Defines requirements for acceptance of safety-related electronic systems in railway signaling.	https://standards.globalspec.com/std/14317747/en-50129	Signaling	active	2018	2018-08-01 00:00:00	2026-03-20 14:01:50.558516
12	EN 50155	Railway applications - Electronic equipment used on rolling stock	Specifies test conditions and test methods for electronic equipment used on railway rolling stock.	https://standards.globalspec.com/std/14403651/en-50155	Rolling Stock	active	2017	2017-06-01 00:00:00	2026-03-20 14:01:50.558516
13	EN 50121-1	Railway applications - Electromagnetic compatibility - Part 1: General	General requirements for EMC in railway applications.	https://standards.globalspec.com/std/en-50121-1	EMC	active	2017	2017-01-01 00:00:00	2026-03-20 14:01:50.558516
14	EN 50121-3-2	Railway applications - EMC - Part 3-2: Rolling stock - Apparatus	Defines EMC requirements for apparatus used on railway rolling stock.	https://standards.globalspec.com/std/13302501/en-50121-4	EMC	active	2016	2016-03-01 00:00:00	2026-03-20 14:01:50.558516
15	EN 50121-4	Railway applications - EMC - Part 4: Emission and immunity of signalling and telecommunications apparatus	EMC requirements for signaling and telecom apparatus.	https://standards.globalspec.com/std/13302501/en-50121-4	EMC	active	2016	2016-03-01 00:00:00	2026-03-20 14:01:50.558516
16	EN 50124-1	Railway applications - Insulation coordination - Part 1: Basic requirements	Basic requirements and rules for insulation coordination in railway applications.	https://standards.globalspec.com/std/en-50124-1	Electrical	active	2017	2017-05-01 00:00:00	2026-03-20 14:01:50.558516
17	EN 50125-1	Railway applications - Environmental conditions for equipment - Part 1: Rolling stock equipment	Environmental conditions and testing for rolling stock equipment.	https://standards.globalspec.com/std/en-50125-1	Rolling Stock	active	2014	2014-04-01 00:00:00	2026-03-20 14:01:50.558516
18	EN 50127	Railway applications - Fixed installations - Electrical DC switchgear	Requirements for DC switchgear in fixed railway installations.	https://standards.globalspec.com/std/en-50127	Fixed Installations	active	2011	2011-06-01 00:00:00	2026-03-20 14:01:50.558516
19	EN 50159	Railway applications - Safety-related communication in railway systems	Requirements and methods for safety-related communication in railway systems.	https://standards.globalspec.com/std/en-50159	Communication	active	2010+A1:2020	2010-09-01 00:00:00	2026-03-20 14:01:50.558516
20	EN 50716	Railway applications - Requirements for software development	Supersedes EN 50128, defining requirements for software development with enhanced cybersecurity.	https://www.en-standard.eu/bs-en-50716-2023	Software	active	2023	2023-12-01 00:00:00	2026-03-20 14:01:50.558516
21	EN 45545-2	Railway applications - Fire protection - Part 2: Fire behaviour requirements	Specifies fire behaviour requirements for materials and components in railway vehicles.	https://www.en-standard.eu/bs-en-45545-2-2020	Fire Protection	active	2020	2020-05-01 00:00:00	2026-03-20 14:01:50.558516
22	EN 45545-3	Railway applications - Fire protection - Part 3: Fire resistance requirements	Fire resistance requirements for fire barriers in railway vehicles.	https://www.en-standard.eu/bs-en-45545-3	Fire Protection	active	2013	2013-08-01 00:00:00	2026-03-20 14:01:50.558516
23	IEC 62278	Railway applications - Specification and demonstration of RAMS	Specification and demonstration of Reliability, Availability, Maintainability and Safety.	https://webstore.iec.ch/publication/6747	RAMS	active	2002	2002-10-01 00:00:00	2026-03-20 14:01:50.558516
24	IEC 62279	Railway applications - Software for railway control and protection systems	IEC equivalent of EN 50128 for international railway software certification.	https://webstore.iec.ch/publication/22745	Software	active	2015	2015-06-01 00:00:00	2026-03-20 14:01:50.558516
25	IEC 62425	Railway applications - Communication, signaling and processing systems - Safety related electronic systems	Safety related electronic systems for signaling.	https://webstore.iec.ch/publication/7007	Signaling	active	2007	2007-06-01 00:00:00	2026-03-20 14:01:50.558516
26	IEC 62443-4-2	Security for IACS components - Technical security requirements	Cybersecurity requirements for industrial automation and control systems applicable to railway.	https://webstore.iec.ch/publication/33615	Cybersecurity	active	2019	2019-02-01 00:00:00	2026-03-20 14:01:50.558516
27	CLC/TS 50701	Railway applications - Cybersecurity	Cybersecurity requirements specific to railway applications.	https://standards.globalspec.com/std/clc-ts-50701	Cybersecurity	active	2021	2021-03-01 00:00:00	2026-03-20 14:01:50.558516
28	EN 50163	Railway applications - Supply voltages of traction systems	Specifies supply voltage ranges for traction systems.	https://standards.globalspec.com/std/en-50163	Electrical	active	2004+A1:2007	2004-01-01 00:00:00	2026-03-20 14:01:50.558516
29	EN 50206-1	Railway applications - Pantographs - Part 1: Pantographs for main line vehicles	Requirements for pantographs used on main line vehicles.	https://standards.globalspec.com/std/en-50206-1	Rolling Stock	active	2010	2010-11-01 00:00:00	2026-03-20 14:01:50.558516
30	EN 50215	Railway applications - Testing of rolling stock on completion of construction and before entry into service	Testing procedures for rolling stock before entering service.	https://standards.globalspec.com/std/en-50215	Testing	active	1999	1999-05-01 00:00:00	2026-03-20 14:01:50.558516
31	EN 50238-1	Railway applications - Compatibility between rolling stock and train detection systems - Part 1: General	General compatibility requirements between rolling stock and train detection systems.	https://standards.globalspec.com/std/en-50238-1	Compatibility	active	2016	2016-07-01 00:00:00	2026-03-20 14:01:50.558516
32	EN 50325-5	Industrial communication subsystem based on ISO 11898 for controller area networks - Part 5: CANopen Safety	CANopen Safety protocol for safety-related communication in industrial systems including railways.	https://standards.globalspec.com/std/en-50325-5	Communication	active	2010	2010-06-01 00:00:00	2026-03-20 14:01:50.558516
33	EN 50553	Railway applications - Requirements for running capability in case of fire on board rolling stock	Requirements ensuring trains can keep running during a fire for safe evacuation.	https://standards.globalspec.com/std/en-50553	Fire Protection	active	2012	2012-09-01 00:00:00	2026-03-20 14:01:50.558516
34	EN 61373	Railway applications - Rolling stock equipment - Shock and vibration tests	Shock and vibration test requirements for railway rolling stock equipment.	https://standards.globalspec.com/std/en-61373	Testing	active	2010	2010-03-01 00:00:00	2026-03-20 14:01:50.558516
35	EN 62290-1	Railway applications - UGTMS - Part 1: System principles and fundamental concepts	Urban Guided Transport Management and Command/Control Systems fundamentals.	https://standards.globalspec.com/std/en-62290-1	CBTC	active	2006+A1:2012	2006-08-01 00:00:00	2026-03-20 14:01:50.558516
36	EN 62290-2	Railway applications - UGTMS - Part 2: Functional requirements specification	Functional requirements for Urban Guided Transport Management Systems.	https://standards.globalspec.com/std/en-62290-2	CBTC	active	2014	2014-02-01 00:00:00	2026-03-20 14:01:50.558516
37	TSI OPE	Technical Specification for Interoperability - Operation and Traffic Management	TSI relating to operation and traffic management in the EU rail system.	https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1694	Interoperability	active	2023	2023-08-01 00:00:00	2026-03-20 14:01:50.558516
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, name, country, certifications, contact_info, irs_certified, quality_rating, last_audit) FROM stdin;
4	Siemens Mobility	Germany	{"iris": true, "en15085": true, "iso9001": true}	{"email": "info@siemens.com", "website": "https://www.mobility.siemens.com"}	t	4.80	2024-06-15 00:00:00
5	Alstom Transport	France	{"iris": true, "en15085": true, "iso9001": true}	{"email": "contact@alstom.com", "website": "https://www.alstom.com"}	t	4.70	2024-05-20 00:00:00
6	Bosch Security Systems	Germany	{"iris": false, "en45545": true, "iso9001": true}	{"email": "info@boschsecurity.com", "website": "https://www.boschsecurity.com"}	f	4.50	2024-07-10 00:00:00
7	Thales Group	France	{"iris": true, "en50129": true, "iso9001": true}	{"email": "transport@thalesgroup.com", "website": "https://www.thalesgroup.com"}	t	4.90	2024-04-12 00:00:00
8	Knorr-Bremse Rail	Germany	{"iris": true, "iso9001": true}	{"email": "rail@knorr-bremse.com", "website": "https://www.knorr-bremse.com"}	t	4.60	2024-08-01 00:00:00
9	Faiveley Transport	France	{"iris": true, "iso9001": true}	{"email": "info@faiveley.com", "website": "https://www.wabteccorp.com"}	t	4.40	2024-03-18 00:00:00
10	Schaltbau Group	Germany	{"iris": false, "iso9001": true}	{"email": "info@schaltbau.com", "website": "https://www.schaltbau.com"}	f	4.20	2024-09-05 00:00:00
11	ABB Rail	Switzerland	{"iris": true, "iso9001": true, "iec61508": true}	{"email": "rail@abb.com", "website": "https://www.abb.com/transportation"}	t	4.70	2024-06-30 00:00:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role, full_name, email, is_active) FROM stdin;
\.


--
-- Name: component_clauses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.component_clauses_id_seq', 1, false);


--
-- Name: component_standards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.component_standards_id_seq', 28, true);


--
-- Name: component_suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.component_suppliers_id_seq', 15, true);


--
-- Name: components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.components_id_seq', 28, true);


--
-- Name: dlp_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dlp_alerts_id_seq', 4, true);


--
-- Name: dlp_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dlp_items_id_seq', 21, true);


--
-- Name: dlp_systems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dlp_systems_id_seq', 14, true);


--
-- Name: dlp_tools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dlp_tools_id_seq', 39, true);


--
-- Name: dlp_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dlp_transactions_id_seq', 8, true);


--
-- Name: dlp_vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dlp_vendors_id_seq', 10, true);


--
-- Name: standard_clauses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.standard_clauses_id_seq', 6, true);


--
-- Name: standards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.standards_id_seq', 37, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 11, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: component_clauses component_clauses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_clauses
    ADD CONSTRAINT component_clauses_pkey PRIMARY KEY (id);


--
-- Name: component_standards component_standards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_standards
    ADD CONSTRAINT component_standards_pkey PRIMARY KEY (id);


--
-- Name: component_suppliers component_suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_suppliers
    ADD CONSTRAINT component_suppliers_pkey PRIMARY KEY (id);


--
-- Name: components components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_pkey PRIMARY KEY (id);


--
-- Name: dlp_alerts dlp_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_alerts
    ADD CONSTRAINT dlp_alerts_pkey PRIMARY KEY (id);


--
-- Name: dlp_items dlp_items_item_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_items
    ADD CONSTRAINT dlp_items_item_id_unique UNIQUE (item_id);


--
-- Name: dlp_items dlp_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_items
    ADD CONSTRAINT dlp_items_pkey PRIMARY KEY (id);


--
-- Name: dlp_systems dlp_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_systems
    ADD CONSTRAINT dlp_systems_pkey PRIMARY KEY (id);


--
-- Name: dlp_systems dlp_systems_system_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_systems
    ADD CONSTRAINT dlp_systems_system_id_unique UNIQUE (system_id);


--
-- Name: dlp_tools dlp_tools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_tools
    ADD CONSTRAINT dlp_tools_pkey PRIMARY KEY (id);


--
-- Name: dlp_tools dlp_tools_tool_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_tools
    ADD CONSTRAINT dlp_tools_tool_id_unique UNIQUE (tool_id);


--
-- Name: dlp_transactions dlp_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_transactions
    ADD CONSTRAINT dlp_transactions_pkey PRIMARY KEY (id);


--
-- Name: dlp_vendors dlp_vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_vendors
    ADD CONSTRAINT dlp_vendors_pkey PRIMARY KEY (id);


--
-- Name: dlp_vendors dlp_vendors_vendor_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_vendors
    ADD CONSTRAINT dlp_vendors_vendor_id_unique UNIQUE (vendor_id);


--
-- Name: standard_clauses standard_clauses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standard_clauses
    ADD CONSTRAINT standard_clauses_pkey PRIMARY KEY (id);


--
-- Name: standards standards_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standards
    ADD CONSTRAINT standards_code_unique UNIQUE (code);


--
-- Name: standards standards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standards
    ADD CONSTRAINT standards_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: component_clauses component_clauses_clause_id_standard_clauses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_clauses
    ADD CONSTRAINT component_clauses_clause_id_standard_clauses_id_fk FOREIGN KEY (clause_id) REFERENCES public.standard_clauses(id);


--
-- Name: component_clauses component_clauses_component_id_components_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_clauses
    ADD CONSTRAINT component_clauses_component_id_components_id_fk FOREIGN KEY (component_id) REFERENCES public.components(id);


--
-- Name: component_standards component_standards_component_id_components_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_standards
    ADD CONSTRAINT component_standards_component_id_components_id_fk FOREIGN KEY (component_id) REFERENCES public.components(id);


--
-- Name: component_standards component_standards_standard_id_standards_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_standards
    ADD CONSTRAINT component_standards_standard_id_standards_id_fk FOREIGN KEY (standard_id) REFERENCES public.standards(id);


--
-- Name: component_suppliers component_suppliers_component_id_components_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_suppliers
    ADD CONSTRAINT component_suppliers_component_id_components_id_fk FOREIGN KEY (component_id) REFERENCES public.components(id);


--
-- Name: component_suppliers component_suppliers_supplier_id_suppliers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_suppliers
    ADD CONSTRAINT component_suppliers_supplier_id_suppliers_id_fk FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: dlp_alerts dlp_alerts_item_id_dlp_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_alerts
    ADD CONSTRAINT dlp_alerts_item_id_dlp_items_id_fk FOREIGN KEY (item_id) REFERENCES public.dlp_items(id);


--
-- Name: dlp_items dlp_items_vendor_id_dlp_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_items
    ADD CONSTRAINT dlp_items_vendor_id_dlp_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.dlp_vendors(id);


--
-- Name: dlp_transactions dlp_transactions_item_id_dlp_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dlp_transactions
    ADD CONSTRAINT dlp_transactions_item_id_dlp_items_id_fk FOREIGN KEY (item_id) REFERENCES public.dlp_items(id);


--
-- Name: standard_clauses standard_clauses_standard_id_standards_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standard_clauses
    ADD CONSTRAINT standard_clauses_standard_id_standards_id_fk FOREIGN KEY (standard_id) REFERENCES public.standards(id);


--
-- PostgreSQL database dump complete
--

\unrestrict LoEJ3qzXFA2Jphb4zfzdtNtZTwctOUoZTIEfMmYgfvGbzHhd7epsN5cgskB6EIo

