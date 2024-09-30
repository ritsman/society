import AdminUser from "../../Models/SuperAdminModel/user.model.js";
import bcrypt from "bcrypt";


export const adminLogin = async(req,res)=>{
          try {
            const { user, password } = req.body;
            //    const usserrr =  new AdminUser(req.body)
            console.log(user,password)
                        const users = await AdminUser.findOne({ user });
                        console.log(users)
                        if (!users) {
                          return res
                            .status(400)
                            .send("Invalid email or passwordddd");
                        } else {
                            let validPassword ;
                            if(password == users.password){
                                validPassword = true
                            }else{
                                validPassword = false
                            }
                          
                          if (!validPassword) {
                            return res
                              .status(400)
                              .send("Invalid email or passwordsss");
                          } else {
                            return res
                              .status(200)
                              .send("successfully logged in");
                          }
                        }
          } catch (error) {
            console.log(error)
                 return res.status(500).send("internal error found")
          }
}

import { Society } from "../../Models/SuperAdminModel/user.model.js";


export const createSociety = async (req, res) => {
  const { name, societyId } = req.body;

  // Check if societyId is unique
  try {
     const existingSociety = await Society.findOne({ societyId });
     if (existingSociety) {
       return res.status(400).json({ error: "Society ID already exists" });
     }

     // Hash password

     const sanitizedSocietyName = societyId.replace(/\s+/g, "_");
     const dbConnection = `mongodb://0.0.0.0:27017/${sanitizedSocietyName}_db`;

     const newSociety = new Society({
       name,
       societyId,
       dbConnection,
     });

     newSociety.save();
     res.json({ message: "Society created" });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error creating society" });
  }
 


}

export const getSociety = async (req,res)=>{
  try {
    let result =await Society.find({});
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error)
  }
}

import { createSocietyDbConnection } from "../../mongodb/config.js";
import User from "../../Models/User.models.js";
    

export const societyLogin = async (req, res) => {
  try {
    const { societyId  } = req.body;
    console.log(req.body)

    // Find society by societyId
    const society = await User.findOne({ societyId });
    if (!society) {
      return res.status(404).json({ error: "Society not found" });
    }

    // Verify password
    // const isMatch = await bcrypt.compare(password, society.password);
    // if (!isMatch) {
    //   return res.status(401).json({ error: "Invalid credentials" });
    // }

    // Connect to the society's individual database
    // const societyDb = await mongoose.createConnection(society.dbConnection, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });

      const {user} = createSocietyDbConnection(society.dbConnection,society.name);
       User = user

    // Return success message (you could also include society data or token here)
    res.json({ message: `Connected to ${society.name} database` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
};

export {User};
