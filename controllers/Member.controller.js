import profile from "../Models/MemberProfile.model.js";
import fs from "fs";

export const Profile = async (req, res) => {
  console.log("reached inside profile controller", req.body);

  try {
    if (!req.file) {
      req.body.map((item) => {
        let result = new profile({
          data: item,
        });

        result.save();
      });
    } else {
      if (req.file) {
        let result = new profile({
          data: req.body,
          photo: fs.readFileSync(req.file.path),
        });
        result.save();
      }
    }

    res.send("successfully sent to database");
  } catch (error) {
    res.send("error in storing data in database");
    console.log(error);
  }
};
