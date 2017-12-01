DROP TABLE #age_groups;
DROp TABLE #ten_most_common_diseases;
CREATE LOCAL TEMPORARY TABLE #age_groups (
   s int NOT NULL, -- start of range
   e int NOT NULL  -- end of range
);
INSERT INTO #age_groups (s, e) VALUES (0, 9);
INSERT INTO #age_groups (s, e) VALUES (10, 19);
INSERT INTO #age_groups (s, e) VALUES (20, 29);
INSERT INTO #age_groups (s, e) VALUES (30, 39);
INSERT INTO #age_groups (s, e) VALUES (40, 49);
INSERT INTO #age_groups (s, e) VALUES (50, 59);
INSERT INTO #age_groups (s, e) VALUES (60, 69);
INSERT INTO #age_groups (s, e) VALUES (70, 79);
INSERT INTO #age_groups (s, e) VALUES (80, 89);
INSERT INTO #age_groups (s, e) VALUES (90, 99);
INSERT INTO #age_groups (s, e) VALUES (100, 200);

--DROP TABLE #ten_most_common_diseases;
CREATE LOCAL TEMPORARY TABLE #ten_most_common_diseases (
    icd9 varchar(10),
    total int
);

INSERT INTO #ten_most_common_diseases (icd9, total)
SELECT
    "ICD9Code" AS icd9, count(*) AS total
FROM "TUKGRP1"."DIAGNOSIS"
GROUP BY "ICD9Code"
LIMIT 10;

SELECT concat(concat(#age_groups.s, '-'), #age_groups.e) AS AgeGroup, "DiagnosisDescription", "ICD9Code", count("PatientGuid")
  FROM #age_groups
  INNER JOIN (
    SELECT
      diagnosis."ICD9Code",
      diagnosis."DiagnosisDescription",
      patient.age,
      patient."PatientGuid"
    FROM  "TUKGRP1"."DIAGNOSIS" AS diagnosis
    INNER JOIN (SELECT (2012 - CAST("YearOfBirth" AS INTEGER)) AS age, "PatientGuid" FROM "TUKGRP1"."PATIENT") patient
    ON diagnosis."PatientGuid" = patient."PatientGuid"
    where diagnosis."ICD9Code" IN (SELECT "ICD9" FROM #ten_most_common_diseases)
  ) AS x ON x.age BETWEEN #age_groups.s and #age_groups.e
  GROUP BY concat(concat(#age_groups.s, '-'), #age_groups.e), "ICD9Code", "DiagnosisDescription"
  ORDER BY concat(concat(#age_groups.s, '-'), #age_groups.e), count("PatientGuid") ASC;
