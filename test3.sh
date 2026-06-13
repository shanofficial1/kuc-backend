#!/bin/bash

curl -v -X POST http://localhost:5000/api/student/profile \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTAxNWFkZjRhMTU1YmJiMGE0YmE0MjkiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODQ3Mzk0MiwiZXhwIjoxNzc4NTYwMzQyfQ.g1-yDh1-1sfbz45rfUuQ2QozhVsh228o-h-nx3OXwt0" \
\
-F "academic_details[admissionApplicationNumber]=APP2026789" \
-F "academic_details[universityEnrollmentNumber]=UNI2026789" \
-F "academic_details[rollNumber]=ROLL789" \
-F "academic_details[faculty]=Engineering" \
-F "academic_details[programLevel]=UG" \
-F "academic_details[degreeName]=BCA" \
-F "academic_details[specialization]=Cyber Security" \
-F "academic_details[thesisTopic]=AI Security Advanced" \
-F "academic_details[researchSupervisor]=Dr Johnson" \
-F "academic_details[admissionBatch]=2025" \
-F "academic_details[academicCycle]=2025-2028" \
-F "academic_details[currentYear]=2" \
-F "academic_details[currentSemester]=4" \
-F "academic_details[modeOfStudy]=Full-Time" \
-F "academic_details[admissionCategory]=Merit" \
-F "academic_details[fellowshipLetterNumber]=FL999" \
-F "fellowshipLetter=@/mnt/stone/sample.pdf" \
\
-F "personal_details[fullName]=Amith E K" \
-F "personal_details[fullNameNative]=അമിത് കുമാർ" \
-F "personal_details[dob]=2001-09-14" \
-F "personal_details[gender]=Male" \
-F "personal_details[nationality]=Indian" \
-F "personal_details[dualCitizenship]=false" \
-F "personal_details[domicileState]=Kerala" \
-F "personal_details[religion]=Hindu" \
-F "personal_details[caste]=General" \
-F "personal_details[motherTongue]=Malayalam" \
-F "personal_details[languagesKnown][0]=Malayalam" \
-F "personal_details[languagesKnown][1]=English" \
-F "personal_details[languagesKnown][2]=Hindi" \
-F "personal_details[socialCategory]=OBC" \
-F "personal_details[aadhaarNumber]=987654321098" \
-F "personal_details[passportNumber]=P7654321" \
-F "passportDoc=@/mnt/stone/sample.pdf" \
-F "personal_details[passportExpiry]=2032-01-01" \
-F "personal_details[visaDetails][visaType]=Student" \
-F "personal_details[visaDetails][visaNumber]=VISA999" \
-F "personal_details[visaDetails][issuingCountry]=India" \
-F "personal_details[visaDetails][issueDate]=2025-01-01" \
-F "personal_details[visaDetails][expiryDate]=2029-01-01" \
-F "personal_details[visaDetails][status]=Active" \
-F "visaDoc=@/mnt/stone/sample.pdf" \
-F "birthCertificateDoc=@/mnt/stone/sample.pdf" \
\
-F "contact_details[personalEmail]=amith.new@example.com" \
-F "contact_details[institutionalEmail]=amith2025@college.edu" \
-F "contact_details[personalMobile][countryCode]=+91" \
-F "contact_details[personalMobile][number]=9123456780" \
-F "contact_details[whatsappNumber][countryCode]=+91" \
-F "contact_details[whatsappNumber][number]=9123456780" \
-F "contact_details[emergencyContact][name]=Suresh" \
-F "contact_details[emergencyContact][relation]=Father" \
-F "contact_details[emergencyContact][number][countryCode]=+91" \
-F "contact_details[emergencyContact][number][number]=9000000001" \
-F "contact_details[permanentAddress][addressLine]=Green Villa" \
-F "contact_details[permanentAddress][city]=Kozhikode" \
-F "contact_details[permanentAddress][district]=Kozhikode" \
-F "contact_details[permanentAddress][state]=Kerala" \
-F "contact_details[permanentAddress][pinCode]=673001" \
-F "contact_details[correspondenceAddress][addressLine]=Hostel Block B" \
-F "contact_details[correspondenceAddress][city]=Thrissur" \
-F "contact_details[correspondenceAddress][district]=Thrissur" \
-F "contact_details[correspondenceAddress][state]=Kerala" \
-F "contact_details[correspondenceAddress][pinCode]=680020" \
-F "contact_details[distanceToCampus]=8" \
\
-F "health_details[bloodGroup]=B+" \
-F "health_details[physicalDimensions][height]=178cm" \
-F "health_details[physicalDimensions][weight]=72kg" \
-F "health_details[disabilityStatus]=false" \
-F "health_details[chronicConditions]=None" \
-F "health_details[regularMedications]=Vitamin D" \
-F "health_details[insurance][provider]=Star Health" \
-F "health_details[insurance][policyNumber]=STAR555" \
-F "health_details[vaccinationStatus]=Completed" \
-F "vaccinationDoc=@/mnt/stone/sample.pdf" \
\
-F "family_details[father][name]=Suresh Kumar" \
-F "family_details[father][qualification]=MBA" \
-F "family_details[father][occupation]=Manager" \
-F "family_details[mother][name]=Lakshmi" \
-F "family_details[mother][qualification]=MSc" \
-F "family_details[mother][occupation]=Professor" \
-F "family_details[annualFamilyIncome]=850000" \
-F "family_details[siblings][0][name]=Akhil" \
-F "family_details[siblings][0][educationStatus]=MCA" \
-F "family_details[siblings][0][email]=akhil@example.com" \
-F "family_details[parentContact][countryCode]=+91" \
-F "family_details[parentContact][number]=9000000001" \
\
-F "education_details[education][0][qualType]=10th" \
-F "education_details[education][0][stream]=General" \
-F "education_details[education][0][regNo]=SSLC555" \
-F "education_details[education][0][board]=CBSE" \
-F "education_details[education][0][institution]=Modern School" \
-F "education_details[education][0][passMonth]=Mar" \
-F "education_details[education][0][passYear]=2019" \
-F "education_details[education][0][percentage]=96" \
-F "educationDocuments=@/mnt/stone/sample.pdf" \
\
-F "education_details[education][1][qualType]=Plus Two" \
-F "education_details[education][1][stream]=Science" \
-F "education_details[education][1][regNo]=HSE9090" \
-F "education_details[education][1][board]=State" \
-F "education_details[education][1][institution]=National School" \
-F "education_details[education][1][passMonth]=Mar" \
-F "education_details[education][1][passYear]=2021" \
-F "education_details[education][1][percentage]=93" \
-F "educationDocuments=@/mnt/stone/sample.pdf" \
\
-F "education_details[competitiveExams][0][examName]=GATE" \
-F "education_details[competitiveExams][0][score]=650" \
-F "education_details[competitiveExams][0][year]=2025" \
-F "competitiveExamDocs=@/mnt/stone/sample.pdf" \
\
-F "migrationUrl=@/mnt/stone/sample.pdf" \
\
-F "financial_details[schType]=Scholarship" \
-F "financial_details[schId]=SCH999" \
-F "feeWaiveDocument=@/mnt/stone/sample.pdf" \
-F "financial_details[educationLoan][bankName]=Federal Bank" \
-F "financial_details[educationLoan][branch]=Thrissur" \
-F "financial_details[educationLoan][amount]=350000" \
-F "financial_details[bankAccount][accountHolderName]=Amith EK" \
-F "financial_details[bankAccount][accountNumber]=9876543210" \
-F "financial_details[bankAccount][bankName]=Federal Bank" \
-F "financial_details[bankAccount][branchName]=Thrissur Main" \
-F "financial_details[bankAccount][ifscCode]=FDRL0009999" \
-F "financial_details[pan]=PQRSX6789K" \
\
-F "professional_details[skills]=NodeJS,React,Django,Cybersecurity" \
\
-F "professional_details[publications][0][date]=2026-01-01" \
-F "professional_details[publications][0][journal]=Springer" \
-F "professional_details[publications][0][issn]=9876-5432" \
-F "publicationDocs=@/mnt/stone/sample.pdf" \
\
-F "professional_details[conferences][0][title]=Cyber Summit" \
-F "professional_details[conferences][0][name]=BlackHat" \
-F "conferenceDocs=@/mnt/stone/sample.pdf" \
\
-F "professional_details[patents][0][title]=Security Monitoring AI" \
-F "professional_details[patents][0][status]=Published" \
-F "patentDocs=@/mnt/stone/sample.pdf" \
\
-F "professional_details[experience][0][company]=SecureTech Pvt Ltd" \
-F "professional_details[experience][0][designation]=Security Analyst Intern" \
-F "professional_details[experience][0][years]=2" \
-F "experienceDocs=@/mnt/stone/sample.pdf" \
\
-F "residential_details[resType]=Hosteller" \
-F "residential_details[hostel][block]=B" \
-F "residential_details[hostel][roomNo]=205" \
-F "residential_details[hostel][bedType]=Double" \
-F "hostelDeclarationForm=@/mnt/stone/sample.pdf" \
-F "residential_details[mess]=Non-Veg" \
-F "residential_details[transport][opted]=true" \
-F "residential_details[transport][routeNumber]=R12" \
-F "residential_details[transport][boardingPoint]=East Fort" \
-F "residential_details[transport][passNumber]=PASS999" \
-F "residential_details[vehicleReg]=KL08CD9090" \
\
-F "documents[identityProof][type]=Passport" \
-F "identityProof=@/mnt/stone/sample.pdf" \
-F "profilePhoto=@/mnt/stone/sample.pdf" \
-F "signature=@/mnt/stone/sample.pdf" \
-F "transcripts=@/mnt/stone/sample.pdf" \
-F "incomeCertificate=@/mnt/stone/sample.pdf" \
-F "casteCertificate=@/mnt/stone/sample.pdf" \
-F "nonCreamyLayerCertificate=@/mnt/stone/sample.pdf" \
-F "nativityCertificate=@/mnt/stone/sample.pdf"
