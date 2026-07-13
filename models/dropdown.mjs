import mongoose from "mongoose";


const DropdownSchema = new mongoose.Schema(
  {
    faculty: [String],
    programLevels: [String],
    departments: [String],
    degreeNames: [String],
    specializations: [String],

    currentYears: [String],
    currentSemesters: [String],

    studyModes: [String],
    admissionCategories: [String],

    genders: [String],
    nationalities: [String],
    countries: [String],

    // State -> District mapping
    states: {
      type: Map,
      of: [String],
      default: {}
    },

    socialCategories: [String],
    castes: [String],

    visaTypes: [String],
    visaStatuses: [String],

    motherTongues: [String],
    languages: [String],

    relations: [String],

    bloodGroups: [String],
    vaccinationStatuses: [String],

    qualifications: [String],
    qualificationLevels: [String],
    qualificationModes: [String],

    examNames: [String],

    scholarshipCategories: [String],
    grantCategories: [String],

    bankNames: [String],

    indexingServices: [String],
    religions: [String],
    presentationTypes: [String],
    conferenceTypes: [String],

    patentStatuses: [String],

    membershipTypes: [String],
    publicationTypes: [String],
publicationIndexedIn: [String],
publicationStatuses: [String]
    
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Dropdown", DropdownSchema);