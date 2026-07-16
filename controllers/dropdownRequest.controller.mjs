import DropdownRequest from "../models/dropdownRequest.mjs";
import StudentProfile from "../models/studentProfile.mjs";
import Dropdown from "../models/dropdown.mjs";
import ProfileUpdateRequest from "../models/profileUpdateRequest.mjs";
import { createNotification } from "../utils/createNotification.mjs";
const DROPDOWN_FIELD_MAP = {
  faculty: "faculty",
  department: "departments",
  degreeName: "degreeNames",
  specialization: "specializations",

  qualification: "qualifications",
  qualificationLevel: "qualificationLevels",
  qualificationMode: "qualificationModes",

  examName: "examNames",

  bankName: "bankNames",

  religion: "religions",

  presentationType: "presentationTypes",

  conferenceType: "conferenceTypes",

  patentStatus: "patentStatuses",

  membershipType: "membershipTypes",

  publicationType: "publicationTypes",

  publicationIndexedIn: "publicationIndexedIn",

  publicationStatus: "publicationStatuses",
};


const updateDropdownCollection =
async (request, approvedValue) => {

    const dropdownField =
        DROPDOWN_FIELD_MAP[
            request.fieldKey
        ];

    if (!dropdownField) {
        return;
    }

    let dropdown =
        await Dropdown.findOne();

    if (!dropdown) {
        dropdown =
            await Dropdown.create({});
    }

    const values =
        dropdown[dropdownField] || [];

    if (
        !values.includes(
            approvedValue
        )
    ) {

        values.push(
            approvedValue
        );

        dropdown[dropdownField] =
            values;

        await dropdown.save();

    }

};


const updateProfileRequest = async (
  request,
  approvedValue
) => {

  const profileRequest =
    await ProfileUpdateRequest.findById(
      request.profileRequestId
    );

  if (!profileRequest) {
    return;
  }

  const section = request.section;

  const field = request.fieldKey;

  const customField = `${field}Custom`;

  if (
    !profileRequest.changes?.[section]
  ) {
    return;
  }

  // Replace "__OTHER__"
  profileRequest.changes[section][field] =
    approvedValue;

  // Remove custom helper field
  delete profileRequest.changes[section][customField];

  // Tell mongoose Mixed field changed
  profileRequest.markModified("changes");

  await profileRequest.save();

};


export const createDropdownRequest = async (req, res) => {

    try {

        const userId = req.user._id;

        const {
            module,
            fieldKey,
            fieldLabel,
            requestedValue,
        } = req.body;

        const profile =
            await StudentProfile.findOne({
                userId,
            });

        if (!profile) {

            return res.status(404).json({
                success:false,
                message:"Profile not found",
            });

        }

        const exists =
            await DropdownRequest.findOne({

                studentId:userId,

                fieldKey,

                requestedValue,

                status:"pending",

            });

        if(exists){

            return res.status(400).json({

                success:false,

                message:"Request already pending.",

            });

        }

        const request =
            await DropdownRequest.create({

                studentId:userId,

                studentName:
                    profile.personal_details.fullName,

                registerNumber:
                    profile.academic_details.rollNumber,

                department:
                    profile.academic_details.department,

                program:
                    profile.academic_details.degreeName,

                module,

                fieldKey,

                fieldLabel,

                requestedValue,

            });

        res.status(201).json({

            success:true,

            message:"Request submitted.",

            request,

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message,

        });

    }

};


export const approveDropdownRequest =
async(req,res)=>{

    try{

        const request =
        await DropdownRequest.findById(
            req.params.id
        );

        if(!request){

            return res.status(404).json({

                success:false,

                message:"Request not found.",

            });

        }

        if(request.status!=="pending"){

            return res.status(400).json({

                success:false,

                message:"Already processed.",

            });

        }

        const approvedValue =
        req.body.approvedValue ||
        request.requestedValue;

        request.status="approved";

        request.approvedValue=
        approvedValue;

        request.reviewedBy=null;

        request.reviewedAt=new Date();

        await request.save();

        await updateDropdownCollection(
    request,
    approvedValue
);

await updateProfileRequest(
    request,
    approvedValue
);

await createNotification({

    studentId: request.studentId,

    title: "Dropdown Request Approved",

    message:
        `Your request to add "${request.requestedValue}" to "${request.fieldLabel}" has been approved.`,

    type: "approved",

    profileRequestId:
        request.profileRequestId,

    dropdownRequestId:
        request._id,

});

const pendingCount =
await DropdownRequest.countDocuments({

    profileRequestId: request.profileRequestId,

    status: "pending",

});

        // NEXT PHASE
        // 1 Update dropdown collection
        // 2 Update student profile
        // 3 Create notification

       res.json({

    success: true,

    message: "Dropdown request approved successfully.",

    profileRequestId: request.profileRequestId,

    dropdownRequestId: request._id,

    profileReady: pendingCount === 0,

});

    }

    catch (err) {

    console.error(err);

    console.error(err.stack);

    res.status(500).json({

        success: false,

        message: err.message,

    });

}

};

export const getPendingDropdownRequests =
async(req,res)=>{

    try{

    const requests =
await DropdownRequest
.find({

    status: "pending",

    department: req.user.department,

})
.sort({

    createdAt: -1,

});

        res.json({

            success:true,

            requests,

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message,

        });

    }

};
export const rejectDropdownRequest =
async(req,res)=>{

    try{

        const request=
        await DropdownRequest.findById(
            req.params.id
        );

        if(!request){

            return res.status(404).json({

                success:false,

                message:"Request not found.",

            });

        }

        request.status="rejected";

        request.adminRemark=
        req.body.adminRemark;

        request.reviewedBy=
        req.user._id;

        request.reviewedAt=
        new Date();

        await request.save();

        await createNotification({

    studentId: request.studentId,

    title: "Dropdown Request Rejected",

    message:
        `Your request to add "${request.requestedValue}" to "${request.fieldLabel}" has been rejected.`,

    type: "rejected",

    profileRequestId:
        request.profileRequestId,

    dropdownRequestId:
        request._id,

});

        res.json({

            success:true,

            message:"Rejected.",

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message,

        });

    }

};



export const getMyDropdownRequests =
async(req,res)=>{

    try{

        const requests =
        await DropdownRequest
        .find({

            studentId:req.user._id,

        })
        .sort({

            createdAt:-1,

        });

        res.json({

            success:true,

            requests,

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message,

        });

    }

};