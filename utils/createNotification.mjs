import Notification from "../models/notification.mjs";

export const createNotification = async ({
    studentId,
    title,
    message,
    type = "info",
    profileRequestId = null,
    dropdownRequestId = null,
}) => {

    await Notification.create({

        studentId,

        title,

        message,

        type,

        metadata: {

            profileRequestId,

            dropdownRequestId,

        },

    });

};