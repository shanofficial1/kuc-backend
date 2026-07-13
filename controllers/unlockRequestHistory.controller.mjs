import UnlockRequest from "../models/unlockRequest.mjs";

export const getUnlockRequestHistory = async (req, res) => {
  try {
    const studentId = req.user._id;

    const requests = await UnlockRequest.find({ studentId })
      .sort({ createdAt: -1 })
      .select(
        "requestNo requestType status reason correctionFields createdAt reviewedAt"
      );

    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

