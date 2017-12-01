CREATE COLUMN TABLE ICD9_RANGES (
   s NVARCHAR(4) NOT NULL, -- start of range
   e NVARCHAR(4) NOT NULL,  -- end of range
   category VARCHAR(255)
);
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('001', '139', 'infectious and parasitic diseases');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('140', '239', 'neoplasms');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('240', '279', 'endocrine, nutritional and metabolic diseases, and immunity disorders');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('280', '289', 'diseases of the blood and blood-forming organs');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('290', '319', 'mental disorders');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('320', '389', 'diseases of the nervous system and sense organs');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('390', '459', 'diseases of the circulatory system');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('460', '519', 'diseases of the respiratory system');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('520', '579', 'diseases of the digestive system');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('580', '629', 'diseases of the genitourinary system');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('630', '679', 'complications of pregnancy, childbirth, and the puerperium');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('680', '709', 'diseases of the skin and subcutaneous tissue');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('710', '739', 'diseases of the musculoskeletal system and connective tissue');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('740', '759', 'congenital anomalies');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('760', '779', 'certain conditions originating in the perinatal period');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('780', '799', 'symptoms, signs, and ill-defined conditions');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('800', '999', 'injury and poisoning');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('e001', 'e999', 'External causes of injury');
INSERT INTO ICD9_RANGES (s, e, category) VALUES ('v01', 'v99', 'Supplementary classification of factors influencing health status and contact with health services');
