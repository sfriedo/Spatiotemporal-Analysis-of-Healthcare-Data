SELECT
DIAG1."ICD9Code",
DIAG1."DiagnosisDescription",
DIAG2."ICD9Code",
DIAG2."DiagnosisDescription",
count(DIAG2."PatientGuid")
 FROM "TUKGRP1"."DIAGNOSIS" AS DIAG1
 INNER JOIN "TUKGRP1"."DIAGNOSIS" AS DIAG2
 ON DIAG1."PatientGuid" = DIAG2."PatientGuid"
 AND DIAG1."StartYear" = DIAG2."StartYear"
 AND DIAG1."ICD9Code" < DIAG2."ICD9Code"
 GROUP BY DIAG1."ICD9Code",
DIAG1."DiagnosisDescription",
DIAG2."ICD9Code",
DIAG2."DiagnosisDescription"
ORDER BY count(DIAG2."PatientGuid") DESC
LIMIT 10;
