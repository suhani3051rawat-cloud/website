
import { AdminPannelModel } from "../model/adminModel.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        const adminId = req.data?.id;

        if (!adminId) {
            return res.status(401).json({
                message: "Admin login required"
            });
        }

        const admin = await AdminPannelModel
            .findById(adminId)
            .select("_id");

        if (!admin) {
            return res.status(403).json({
                message: "Admin access denied"
            });
        }

        req.admin = admin;
        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
