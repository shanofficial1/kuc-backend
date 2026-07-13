import Notification from "../models/notification.mjs";


export const deleteMyNotifications = async (req, res) => {

    try {

        await Notification.deleteMany({

            studentId: req.user._id,

        });

        res.json({

            success: true,

            message: "All notifications deleted.",

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

export const getMyNotifications = async (req, res) => {

    try {

        const notifications = await Notification
            .find({
                studentId: req.user._id,
            })
            .sort({
                createdAt: -1,
            });

        res.status(200).json({

            success: true,

            count: notifications.length,

            notifications,

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};