SELECT
  v."PatientAge", COUNT(*) AS "NumVisits"
FROM (
  /* Join patient data with transcript documenting each visit */
  SELECT
    t."PatientGuid", t."VisitYear", p."YearOfBirth", p."Gender", p."State",
    (t."VisitYear" - p."YearOfBirth") AS "PatientAge"
  FROM TRANSCRIPT t
  JOIN PATIENT p
    ON p."PatientGuid" = t."PatientGuid"
  WHERE
    /* Eliminate zero values in t."VisitYear" */
    t."VisitYear" >= 1900
) v
GROUP BY v."PatientAge"
ORDER BY
  v."PatientAge" ASC,
  "NumVisits" DESC;