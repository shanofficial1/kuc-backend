#!/bin/bash

curl -v -X POST http://localhost:5000/api/student/profile/ \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWU0N2EwMmM4YmY4YmJlNjdhZWE4NTMiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODMwMjQ1NSwiZXhwIjoxNzc4Mzg4ODU1fQ.h2jrOEvq-zSzCW_a47IR9sBkLusXxiB0h9vL4rocgKw" \
-F "education_details[education][0][qualType]=10th" \
-F "education_details[education][0][stream]=General" \
-F "education_details[education][0][regNo]=SSLC101" \
-F "education_details[education][0][board]=State" \
-F "education_details[education][0][institution]=XYZ School" \
-F "education_details[education][0][passMonth]=Mar" \
-F "education_details[education][0][passYear]=2020" \
-F "education_details[education][0][percentage]=95" \
-F "educationDocument0=@/mnt/stone/sample.pdf" \
-F "education_details[education][1][qualType]=Plus Two" \
-F "education_details[education][1][stream]=Science" \
-F "education_details[education][1][regNo]=HSE2022" \
-F "education_details[education][1][board]=CBSE" \
-F "education_details[education][1][institution]=ABC School" \
-F "education_details[education][1][passMonth]=Mar" \
-F "education_details[education][1][passYear]=2022" \
-F "education_details[education][1][percentage]=91" \
-F "educationDocument1=@/mnt/stone/sample.pdf"
