import express, { Router } from "express";
// import Stripe from "stripe";
import dotenv from "dotenv";

import cors from "cors";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client/extension";
// import { prisma } from "./client.js";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter, uploadRouter2 } from "./uploadthing.js";
import { authMiddleware, hasPermission } from "./Middleware.js";
// import { PrismaClient } from "@prisma/client";
import vendorRouter  from "./routes/vendor.js";
import { prisma } from "./client.js";
import { carsDB } from "./cars_database.js";



dotenv.config();

const app = express();
app.use(express.json())
app.use(cors())
app.use(Router())

// export const prisma = new PrismaClient({
//     datasourceUrl: process.env.DATABASE_URL as string,
// })
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string )


app.get("/v1/user",authMiddleware, async (req, res)=>{
    try {
        // @ts-ignore
        const user = req.user;
        // @ts-ignore
        const role = req.role;
        // @ts-ignore
        const permissions = req.permissions;

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: { ...user, roleUsers: undefined }, // Clean up user object before sending
            role: role ? { ...role, rolePermissions: undefined } : null, // Clean up role object before sending
            permissions: permissions
        });
    } catch (e) {
        console.error("Error fetching user:", e);
        res.status(401).json({
            success: false,
            message: "Unauthorized or invalid token"
        });
    }
})

app.use("/v1/vendor", vendorRouter)

app.post("/v1/delete/user/:id", authMiddleware, hasPermission(["users.delete"]), async(req, res)=>{
    const DeleteId = req.params.id;
    try {
        // const token = req.headers.authorization?.split(" ")[1] as string;
        // const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const user = await prisma.user.update({
            where:{
                id: DeleteId
            },
            data:{
                isActive: false
            }
        })
        res.json({
            success: true,
            user: user
        })
    } catch (e) {
        console.error("Error deleting user:", e);
        res.status(401).json({
            success: false,
            message: "Unauthorized or invalid token"
        });
    }
})
app.get("/v1/cars",authMiddleware,async(req, res)=>{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const skip = (page - 1) * pageSize;

        const totalCars = await prisma.car.count();
        const cars = await prisma.car.findMany({
            skip: skip,
            take: pageSize,
        });
        res.status(200).json({ success: true, cars, totalCars, page, pageSize });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch cars" });
    }
})

app.get("/v1/all/users", authMiddleware, hasPermission(["users.view"]), async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const skip = (page - 1) * pageSize;

        const totalUsers = await prisma.user.count({
            where: {
                isActive: true
            },
        });

        const users = await prisma.user.findMany({
            where: {
                isActive: true
            },
            skip: skip,
            take: pageSize,
        });

        const userIds = users.map((user: any) => user.id);

        const roles = await prisma.role.findMany({
            where: {
                id: {
                    in: userIds
                }
            }
        });

        const roleMap = new Map(roles.map((role: any) => [role.id, role]));

        const usersWithRoles = users.map((user: any) => ({
            ...user,
            role: roleMap.get(user.id) || null
        }));

        const nonAdminUsers = usersWithRoles.filter((user: any) => user.role?.roleName !== 'admin');

        res.json({
            success: true,
            users: nonAdminUsers,
            totalUsers: totalUsers,
            page: page,
            pageSize: pageSize
        });
    } catch (e) {
        console.error("Error fetching users:", e);
        res.status(401).json({
            success: false,
            message: "Unauthorized or invalid token"
        });
    }
})

app.get("/v1/car/brands",(req,res)=>{
    const cars= Object.keys(carsDB)
    // console.log("cars:",cars)
    res.json({
        success: true,
        cars: cars
    })
})

app.get("/v1/car/models/:brand",(req,res)=>{
    const brand= req.params.brand
    // @ts-ignore
    const models = carsDB[brand]
    // console.log("models:",models)
    res.json({
        success: true,
        models: models
    })
})
app.use("/v1/api/uploadthing", createRouteHandler({
      router: uploadRouter,
    }),
);
app.use("/v1/api/uploadthing/vendor", createRouteHandler({
      router: uploadRouter2,
    }),
);

// Get all available permissions
app.get("/v1/permissions", authMiddleware, hasPermission(["permissions.view"]), async (req, res) => { // Added auth and permission
    try {
        const allPermissions = await prisma.permission.findMany();
        res.json({
            success: true,
            permissions: allPermissions
        });
    } catch (e) {
        console.error("Error fetching all permissions:", e);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all permissions"
        });
    }
});

// Get all roles with their assigned permissions, excluding the admin role
app.get("/v1/roles", authMiddleware, hasPermission(["roles.view"]), async (req, res) => { // Added auth and permission
    try {
        const roles = await prisma.role.findMany({
            where: {
                roleName: {
                    not: 'admin' // Exclude the admin role
                }
            },
            include: {
                rolePermissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
        res.json({
            success: true,
            roles: roles.map(role => ({
                ...role,
                permissions: role.rolePermissions.map(rp => rp.permission.key)
            }))
        });
    } catch (e) {
        console.error("Error fetching roles:", e);
        res.status(500).json({ success: false, message: "Failed to fetch roles" });
    }
});

// Update permissions for a specific role
app.put("/v1/roles/:roleId/permissions", authMiddleware, hasPermission(["roles.manage"]), async (req, res) => { // Added auth and permission
    const { roleId } = req.params;
    const { permissions: newPermissionKeys } = req.body; // Array of permission keys

    try {
        // Find the role
        const role = await prisma.role.findUnique({
            where: { id: roleId }
        });
        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }

        // Get all permission objects for the provided keys
        const permissionObjects = await prisma.permission.findMany({
            where: {
                key: {
                    in: newPermissionKeys
                }
            }
        });

        // Delete existing role permissions
        await prisma.rolePermission.deleteMany({
            where: { roleId: roleId }
        });

        // Create new role permissions
        await prisma.rolePermission.createMany({
            data: permissionObjects.map(p => ({
                roleId: roleId,
                permissionId: p.id
            }))
        });

        res.json({ success: true, message: `Permissions updated for role ${role.roleName}` });

    } catch (e) {
        console.error("Error updating role permissions:", e);
        res.status(500).json({ success: false, message: "Failed to update role permissions" });
    }
});

// Create a new permission
app.post("/v1/permissions", authMiddleware, async (req, res) => {
    const { key } = req.body;
    try {
        const existingPermission = await prisma.permission.findUnique({ where: { key } });
        if (existingPermission) {
            return res.status(409).json({ success: false, message: "Permission with this key already exists." });
        }
        const permission = await prisma.permission.create({ data: { key } });
        res.status(201).json({ success: true, message: "Permission created successfully.", permission });
    } catch (e) {
        console.error("Error creating permission:", e);
        res.status(500).json({ success: false, message: "Failed to create permission." });
    }
});

// Update an existing permission
app.put("/v1/permissions/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { key: newKey } = req.body;
    try {
        const existingPermission = await prisma.permission.findUnique({ where: { key: newKey } });
        if (existingPermission && existingPermission.id !== id) {
            return res.status(409).json({ success: false, message: "Permission with this key already exists." });
        }
        const permission = await prisma.permission.update({
            where: { id },
            data: { key: newKey },
        });
        res.json({ success: true, message: "Permission updated successfully.", permission });
    } catch (e) {
        console.error("Error updating permission:", e);
        res.status(500).json({ success: false, message: "Failed to update permission." });
    }
});

// Delete a permission
app.delete("/v1/permissions/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.permission.delete({ where: { id } });
        res.json({ success: true, message: "Permission deleted successfully." });
    } catch (e) {
        console.error("Error deleting permission:", e);
        res.status(500).json({ success: false, message: "Failed to delete permission." });
    }
});

app.post("/v1/image",authMiddleware,async (req, res)=>{
    const {image,userId}= req.body;
    const response = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            Image: image
        }
    })
    res.json({
        success: true,
        resp: response
    })
})

app.post("/v1/user/:id",authMiddleware ,async(req , res)=>{
    const userId = req.params.id;
  const { firstName, lastName, username, email, phoneNumber, currentPassword, newPassword, city, state, pincode, country,Role } = req.body;
   
  try {
    // Account Tab: Update basic info
    if (firstName || lastName || username || email || phoneNumber) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          FirstName: firstName,
          LastName: lastName,
          UserName: username,
          Email: email,
          PhoneNumber: phoneNumber,
          // Add Image field if included
        },
      });
    }
    

    // Address Tab: Update address fields
    if (city || state || pincode || country) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          City: city,
          State: state,
          Country: country,
          Pincode: pincode,
        },
      });
    }
    const user= await prisma.user.findFirst({
        where:{
            id: userId
        },
    })
    // Password Tab: Change password securely (hashing recommended)
    if (currentPassword && newPassword) {
      // Add your password verification & hashing logic here!
      const Passwordverify=  await bcrypt.compare(currentPassword, user?.Password as string)

        if(!Passwordverify){
            return res.json({
                success:false,
                message:"Password is incorrect",
            })
        }
      const Passwordhash= await bcrypt.hash(newPassword, 10)

      await prisma.user.update({
        where: { id: userId },
        data: {
          Password: Passwordhash, // Use a hashed password in production!
        },
      });
    }
    // Role Tab: Update user role

    if (Role) {
      await prisma.role.update({
        where: { id: userId },
        data: {
          roleName: Role,
        },
      });
    }

    res.status(200).json({ message: "User updated successfully",
        success:true,
        user:user
    });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error });
  }

})

app.post("/v1/auth/signup", async (req, res)=>{
    const {FirstName, LastName, UserName, PhoneNumber, Email, Password, City, State, Country, Pincode, Role}= req.body;
    const existingUser  = await prisma.user.findFirst({
        where:{
            OR:[
                {Email: Email},
                {UserName: UserName}
            ]
        }
    })
    console.log("existing user: ", existingUser );
    
    if(existingUser){
        return res.status(409).json({
            success:false,
            message:"Email or UserName already exists",
        })
    }
    const Passwordhash =  await bcrypt.hash(Password, 10)
    const newUser = await prisma.user.create({
        data:{
            FirstName,
            LastName,
            UserName,
            PhoneNumber,
            Password:Passwordhash,
            Email,
            City,
            State,
            Country,
            Pincode,
        }
    })
    if(Role){
        const newRole = await prisma.role.create({
            data:{
                roleName:Role,
                id:newUser.id,
            }
        })        
        await prisma.roleUsers.create({
            data:{
                roleId: newRole.id,
                userId: newUser.id
            }
        })
    }else{
        const newRole = await prisma.role.create({
            data:{
                roleName:"user",
                id:newUser.id,
            }
        })
        await prisma.roleUsers.create({
            data:{
                roleId: newRole.id,
                userId: newUser.id
            }
        })
    }

    const token = jwt.sign({
        userId: newUser.id
    }, process.env.JWT_SECRET as string,)
        return res.json({
            success:true,
            message:"User created successfully",
            token:token,
            user:newUser,
        })

})

app.post("/v1/auth/login", async (req, res)=>{

    const {Email, Password}= req.body;
    if (!Email || !Password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        })
    }
    const user = await prisma.user.findUnique({
        where:{
            Email:Email,
            isActive: true
        }
    })
    if(!user){
        return res.json({
            success:false,
            message:"User does not exist",
        })
    }
    const Passwordhash =  await bcrypt.compare(Password, user.Password)
    if(!Passwordhash){
        return res.json({
            success:false,
            message:"Password is incorrect",
        })
    }
    const token= jwt.sign({
        userId: user.id
    }, process.env.JWT_SECRET as string,)
    return res.json({
        success:true,
        message:"User logged in successfully",
        token:token,
        user:user,
    })

})

// app.post("/v1/create/subscription", async (req, res) => {
//     const {name, description, amount, currency, adminId, recurring: {interval}} =  req.body;

//     const product = await stripe.products.create({
//         name:name,
//         description:description,
//     })
//     const price = await stripe.prices.create({
//         product:product.id,
//         unit_amount:amount,
//         currency:currency,
//         recurring:{
//             interval:interval,
//         }
//     })

//     await prisma.subscription.create({
//         data:{
//             name:name,
//             description:description,
//             amount:amount,
//             currency:currency,
//             interval:interval,
//             adminId:adminId,
//             productId:product.id,
//             priceId:price.id,
//         }
//     })
//     res.json({
//         success:true,
//         message:`Subscription ${name} created successfully`,
//         product:product,
//         price:price,
//     })
// })

// app.get("/v1/get/subscription", async (req, res) => {
//     // const subscriptions = await stripe.subscriptions.list({
//     //     limit:10,
//     //     status: "all",
        
//     // })
//     const subscriptions = await prisma.subscription.findMany()
//     res.json({
//         success:true,
//         total_count:subscriptions.length,
//         subscriptions:subscriptions,
//     })
// })

// app.get("/v1/get/subscription/:id", async (req, res) => {
//     const {id} = req.params;
//     const subscription = await stripe.subscriptions.retrieve(id);
//     res.json({
//         success:true,
//         subscription:subscription,
//     })
// })


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})