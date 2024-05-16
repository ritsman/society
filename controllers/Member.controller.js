import profile from "../Models/MemberProfile.model.js";
import fs from "fs";

export const Profile = async (req, res) => {
  console.log("reached inside profile controller", req.files);

  const { photo, societyShareCertificate } = req.files;

  try {
    if (!req.files) {
      req.body.map((item) => {
        let result = new profile({
          data: item,
        });

        result.save();
      });
    } else {
      if (req.files) {
        let result = new profile({
          data: req.body,
          photo: fs.readFileSync(photo[0].path),
          societyShareCertificate: fs.readFileSync(
            societyShareCertificate[0].path
          ),
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

export const getMemberList = async (req, res) => {
  console.log("reached inside getMemberList controller");
  try {
    let result = await profile.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};
