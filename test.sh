#!/bin/bash

curl -v -X POST http://localhost:5000/api/student/profile \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTAxNWFkZjRhMTU1YmJiMGE0YmE0MjkiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODQ3Mzk0MiwiZXhwIjoxNzc4NTYwMzQyfQ.g1-yDh1-1sfbz45rfUuQ2QozhVsh228o-h-nx3OXwt0" \
\
-F "academic_details[admissionApplicationNumber]=APP101" \
-F "academic_details[universityEnrollmentNumber]=UNI101" \
-F "academic_details[rollNumber]=101" \
-F "academic_details[faculty]=Engineering" \
-F "academic_details[programLevel]=UG" \
-F "academic_details[degreeName]=BCA" \
-F "academic_details[specialization]=Cyber Security" \
-F "academic_details[thesisTopic]=AI Security" \
-F "academic_details[researchSupervisor]=Dr Smith" \
-F "academic_details[admissionBatch]=2024" \
-F "academic_details[academicCycle]=2024-2025" \
-F "academic_details[currentYear]=2" \
-F "academic_details[currentSemester]=4" \
-F "academic_details[modeOfStudy]=Full-Time" \
-F "academic_details[admissionCategory]=Merit" \
-F "academic_details[fellowshipLetterNumber]=FL123" \
-F "fellowshipLetter=@/mnt/stone/sample.pdf" \
\
-F "personal_details[fullName]=Amith" \
-F "personal_details[fullNameNative]=അമിത്" \
-F "personal_details[dob]=2002-10-10" \
-F "personal_details[gender]=Male" \
-F "personal_details[nationality]=Indian" \
-F "personal_details[dualCitizenship]=false" \
-F "personal_details[domicileState]=Kerala" \
-F "personal_details[religion]=Hindu" \
-F "personal_details[caste]=OBC" \
-F "personal_details[motherTongue]=Malayalam" \
-F "personal_details[languagesKnown][0]=Malayalam" \
-F "personal_details[languagesKnown][1]=English" \
-F "personal_details[socialCategory]=General" \
-F "personal_details[aadhaarNumber]=123456789012" \
-F "personal_details[passportNumber]=P1234567" \
-F "passportDoc=@/mnt/stone/sample.pdf" \
-F "personal_details[passportExpiry]=2030-01-01" \
-F "personal_details[visaDetails][visaType]=Student" \
-F "personal_details[visaDetails][visaNumber]=VISA123" \
-F "personal_details[visaDetails][issuingCountry]=India" \
-F "personal_details[visaDetails][issueDate]=2024-01-01" \
-F "personal_details[visaDetails][expiryDate]=2028-01-01" \
-F "personal_details[visaDetails][status]=Active" \
-F "visaDoc=@/mnt/stone/sample.pdf" \
-F "birthCertificateDoc=@/mnt/stone/sample.pdf" \
\
-F "contact_details[personalEmail]=amith@example.com" \
-F "contact_details[institutionalEmail]=amith@college.edu" \
-F "contact_details[personalMobile][countryCode]=+91" \
-F "contact_details[personalMobile][number]=9876543210" \
-F "contact_details[whatsappNumber][countryCode]=+91" \
-F "contact_details[whatsappNumber][number]=9876543210" \
-F "contact_details[emergencyContact][name]=Ravi" \
-F "contact_details[emergencyContact][relation]=Father" \
-F "contact_details[emergencyContact][number][countryCode]=+91" \
-F "contact_details[emergencyContact][number][number]=9999999999" \
-F "contact_details[permanentAddress][addressLine]=ABC House" \
-F "contact_details[permanentAddress][city]=Kannur" \
-F "contact_details[permanentAddress][district]=Kannur" \
-F "contact_details[permanentAddress][state]=Kerala" \
-F "contact_details[permanentAddress][pinCode]=670001" \
-F "contact_details[correspondenceAddress][addressLine]=XYZ House" \
-F "contact_details[correspondenceAddress][city]=Thrissur" \
-F "contact_details[correspondenceAddress][district]=Thrissur" \
-F "contact_details[correspondenceAddress][state]=Kerala" \
-F "contact_details[correspondenceAddress][pinCode]=680001" \
-F "contact_details[distanceToCampus]=12" \
\
-F "health_details[bloodGroup]=O+" \
-F "health_details[physicalDimensions][height]=175cm" \
-F "health_details[physicalDimensions][weight]=70kg" \
-F "health_details[disabilityStatus]=false" \
-F "health_details[chronicConditions]=None" \
-F "health_details[regularMedications]=None" \
-F "health_details[insurance][provider]=LIC" \
-F "health_details[insurance][policyNumber]=LIC123" \
-F "health_details[vaccinationStatus]=Completed" \
-F "vaccinationDoc=@/mnt/stone/sample.pdf" \
\
-F "family_details[father][name]=Ravi" \
-F "family_details[father][qualification]=MBA" \
-F "family_details[father][occupation]=Business" \
-F "family_details[mother][name]=Mini" \
-F "family_details[mother][qualification]=BSc" \
-F "family_details[mother][occupation]=Teacher" \
-F "family_details[annualFamilyIncome]=500000" \
-F "family_details[siblings][0][name]=Arun" \
-F "family_details[siblings][0][educationStatus]=BTech" \
-F "family_details[siblings][0][email]=arun@example.com" \
-F "family_details[parentContact][countryCode]=+91" \
-F "family_details[parentContact][number]=9999999999" \
\
-F "education_details[education][0][qualType]=10th" \
-F "education_details[education][0][stream]=General" \
-F "education_details[education][0][regNo]=SSLC101" \
-F "education_details[education][0][board]=State" \
-F "education_details[education][0][institution]=XYZ School" \
-F "education_details[education][0][passMonth]=Mar" \
-F "education_details[education][0][passYear]=2020" \
-F "education_details[education][0][percentage]=95" \
-F "educationDocuments=@/mnt/stone/sample.pdf" \
\
-F "education_details[education][1][qualType]=Plus Two" \
-F "education_details[education][1][stream]=Science" \
-F "education_details[education][1][regNo]=HSE2022" \
-F "education_details[education][1][board]=CBSE" \
-F "education_details[education][1][institution]=ABC School" \
-F "education_details[education][1][passMonth]=Mar" \
-F "education_details[education][1][passYear]=2022" \
-F "education_details[education][1][percentage]=91" \
-F "educationDocuments=@/mnt/stone/sample.pdf" \
\
-F "education_details[competitiveExams][0][examName]=GATE" \
-F "education_details[competitiveExams][0][score]=500" \
-F "education_details[competitiveExams][0][year]=2024" \
-F "competitiveExamDocs=@/mnt/stone/sample.pdf" \
\
-F "migrationUrl=@/mnt/stone/sample.pdf" \
\
-F "financial_details[schType]=Government" \
-F "financial_details[schId]=SCH123" \
-F "feeWaiveDocument=@/mnt/stone/sample.pdf" \
-F "financial_details[educationLoan][bankName]=SBI" \
-F "financial_details[educationLoan][branch]=Kannur" \
-F "financial_details[educationLoan][amount]=200000" \
-F "financial_details[bankAccount][accountHolderName]=Amith" \
-F "financial_details[bankAccount][accountNumber]=1234567890" \
-F "financial_details[bankAccount][bankName]=SBI" \
-F "financial_details[bankAccount][branchName]=Kannur" \
-F "financial_details[bankAccount][ifscCode]=SBIN0001234" \
-F "financial_details[pan]=ABCDE1234F" \
\
-F "professional_details[skills]=Django,React,Cybersecurity" \
\
-F "professional_details[publications][0][date]=2025-01-01" \
-F "professional_details[publications][0][journal]=IEEE" \
-F "professional_details[publications][0][issn]=1234-5678" \
-F "publicationDocs=@/mnt/stone/sample.pdf" \
\
-F "professional_details[conferences][0][title]=CyberConf" \
-F "professional_details[conferences][0][name]=DEF CON" \
-F "conferenceDocs=@/mnt/stone/sample.pdf" \
\
-F "professional_details[patents][0][title]=AI Patent" \
-F "professional_details[patents][0][status]=Filed" \
-F "patentDocs=@/mnt/stone/sample.pdf" \
\
-F "professional_details[experience][0][company]=ABC Pvt Ltd" \
-F "professional_details[experience][0][designation]=Intern" \
-F "professional_details[experience][0][years]=1" \
-F "experienceDocs=@/mnt/stone/sample.pdf" \
\
-F "residential_details[resType]=Hosteller" \
-F "residential_details[hostel][block]=A" \
-F "residential_details[hostel][roomNo]=101" \
-F "residential_details[hostel][bedType]=Single" \
-F "hostelDeclarationForm=@/mnt/stone/sample.pdf" \
-F "residential_details[mess]=Veg" \
-F "residential_details[transport][opted]=true" \
-F "residential_details[transport][routeNumber]=R1" \
-F "residential_details[transport][boardingPoint]=Town" \
-F "residential_details[transport][passNumber]=PASS101" \
-F "residential_details[vehicleReg]=KL13AB1234" \
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
