// import profile from "../Models/MemberProfile.model.js";
import { profile } from "./User.controller.js";
// import { OpeningMember } from "../Models/MemberProfile.model.js";
import { OpeningBalance } from "./User.controller.js";
// import { MemberLedger } from "../Models/MemberProfile.model.js";
import { MemberLedger } from "./User.controller.js";
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
          name: item.name,

          permanentAddress: item.permanentAddress,
          registeredMobileNo: item.registeredMobileNo,
          alternateMobileNo: item.alternateMobileNo,
          email: item.email,
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
          head: item.head,
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
          name: req.body.name,
          permanentAddress: req.body.permanentAddress,
          registeredMobileNo: req.body.registeredMobileNo,
          alternateMobileNo: req.body.alternateMobileNo,
          email: req.body.email,
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
          name: req.body.name,
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
          name: req.body.name,
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

// opening member list

export const postOpeningMember = async (req, res) => {
  console.log("inside post opening member");
  try {
    req.body.map(async (item) => {
      console.log(item)
      const { flatNo, wingno } = item;
      let isExist = await profile.findOne({ flatNo: flatNo });
      if (isExist) {
        isExist.head = item.head;
        isExist.name = item.name;

        isExist.email = item.email;
        isExist.permanentAddress = item.address;
        isExist.registeredMobileNo = item.mobileNo;
        isExist.save();
      }
    });
    res.send("successfully data saved");
  } catch (error) {
    console.log(error);
    res.send("error in storing data", error);
  }
};

export const getOpeningMember = async (req, res) => {
  try {
    let result = await OpeningMember.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

// starting of member Ledgers Controller

export const postLedger = async (req, res) => {
  console.log("inside postLedger");

  try {
    const { memberId, ledger } = req.body;
    console.log(ledger);

    const updatedMember = await MemberLedger.findOneAndUpdate(
      { memberId },
      {
        $push: {
          ledger: { $each: ledger },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res
      .status(201)
      .json({ success: true, message: "successfully saved Ledger " });
  } catch (error) {
    console.error("Error in postLedger:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLedger = async (req, res) => {
  let memberId = req.params.memberId;
  console.log("inside get Ledger", memberId);
  try {
    // Find document by memberId
    const ledger = await MemberLedger.findOne({ memberId });

    if (!ledger) {
      return res.status(404).json({ message: "Ledger not found" });
    }

    res.status(200).json({ success: true, data: ledger });
  } catch (error) {
    console.error("Error in getLedger:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ending of member Ledgers Controller
