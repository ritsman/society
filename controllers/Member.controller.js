import profile from "../Models/MemberProfile.model.js";
import fs from "fs";

export const Profile = async (req, res) => {
  console.log("reached inside profile controller", req.files);

  // const { photo, societyShareCertificate } = req.files;

  try {
    if (!req.files) {
      req.body.map(async (item) => {
        // Destructure flatNo and wingNo for easy reference
        const { flatNo, wingNo } = item;
        const update = {
          firstName: item.firstName,
          lastName: item.lastName,
          permanentAddress: item.permanentAddress,
          registeredMobileNo: item.registeredMobileNo,
          alternateMobileNo: item.alternateMobileNo,
          flatNo: item.flatNo,
          wingNo: item.wingNo,
          area: item.area,
          societyNocStatus: item.societyNocStatus,
          occupancy: item.occupancy,
          maintenance_amt: item.maintenance_amt,
          noc: item.noc,
          arrears: item.arrears,
          rate: item.rate,
          vehicleDetails: item.vehicleDetails,
          memberSince: item.memberSince,
          systemId: item.systemId,
        };

        try {
          await profile.findOneAndUpdate({ flatNo, wingNo }, update, {
            upsert: true,
            new: true,
          });
        } catch (error) {
          console.error("Error updating or creating profile:", error);
        }
      });
      // req.body.map((item) => {
      //   let result = new profile({
      //     data: item,
      //   });

      //   result.save();
      // });
    } else {
      if (req.files) {
        // Define the update object
        const { flatNo, wingNo } = req.body;
        const { photo, societyShareCertificate } = req.files;
        const update = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          permanentAddress: req.body.permanentAddress,
          registeredMobileNo: req.body.registeredMobileNo,
          alternateMobileNo: req.body.alternateMobileNo,
          flatNo: req.body.flatNo,
          wingNo: req.body.wingNo,
          area: req.body.area,
          societyNocStatus: req.body.societyNocStatus,
          occupancy: req.body.occupancy,
          maintenance_amt: req.body.maintenance_amt,
          noc: req.body.noc,
          arrears: req.body.arrears,
          rate: req.body.rate,
          vehicleDetails: req.body.vehicleDetails,
          memberSince: req.body.memberSince,
          systemId: req.body.systemId,
          photo: fs.readFileSync(photo[0].path),
          societyShareCertificate: fs.readFileSync(
            societyShareCertificate[0].path
          ),
        };

        try {
          await profile.findOneAndUpdate({ flatNo, wingNo }, update, {
            upsert: true,
            new: true,
          });
        } catch (error) {
          console.error("Error updating or creating profile:", error);
        }
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

export const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("updateProfile controller reached", req.body, id);
    const existingProfile = await profile.findById(id);
    console.log(existingProfile);
    if (existingProfile) {
      console.log("found");
      if (existingProfile.photo || existingProfile.societyShareCertificate) {
        console.log("photo exist", req.files);
        const { photo, societyShareCertificate } = req.files;

        const update = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          permanentAddress: req.body.permanentAddress,
          registeredMobileNo: req.body.registeredMobileNo,
          alternateMobileNo: req.body.alternateMobileNo,
          flatNo: req.body.flatNo,
          wingNo: req.body.wingNo,
          area: req.body.area,
          societyNocStatus: req.body.societyNocStatus,
          occupancy: req.body.occupancy,
          maintenance_amt: req.body.maintenance_amt,
          noc: req.body.noc,
          arrears: req.body.arrears,
          rate: req.body.rate,
          vehicleDetails: req.body.vehicleDetails,
          memberSince: req.body.memberSince,
          systemId: req.body.systemId,
          photo: fs.readFileSync(photo[0].path),
          societyShareCertificate: fs.readFileSync(
            societyShareCertificate[0].path
          ),
        };

        const result = await profile.findByIdAndUpdate(id, update);

        if (!result) {
          return res.status(404).send("Profile not found");
        } else {
          // console.log(result);
          res.send("Successfully updated data in database");
        }
      } else {
        console.log("photo not exist");

        const update = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          permanentAddress: req.body.permanentAddress,
          registeredMobileNo: req.body.registeredMobileNo,
          alternateMobileNo: req.body.alternateMobileNo,
          flatNo: req.body.flatNo,
          wingNo: req.body.wingNo,
          area: req.body.area,
          societyNocStatus: req.body.societyNocStatus,
          occupancy: req.body.occupancy,
          maintenance_amt: req.body.maintenance_amt,
          noc: req.body.noc,
          arrears: req.body.arrears,
          rate: req.body.rate,
          vehicleDetails: req.body.vehicleDetails,
          memberSince: req.body.memberSince,
          systemId: req.body.systemId,
        };

        const result = await profile.findByIdAndUpdate(id, update);

        if (!result) {
          return res.status(404).send("Profile not found");
        } else {
          // console.log(result);
          res.send("Successfully updated data in database");
        }
      }
    } else {
      res.send("profile not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("deleteProfile controller reached", id);

    if (!id) {
      return res.status(400).send("Missing _id in request parameters");
    }

    const result = await profile.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send("Profile not found");
    } else {
      console.log("Deleted document:", result);
      res.send("Successfully deleted Profile from database");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
