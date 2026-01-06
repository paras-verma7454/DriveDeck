import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import { prisma } from "./client.js";


configDotenv()
const JWT_SECRET = process.env.JWT_SECRET as string;

// @ts-ignore
export const authMiddleware = async (req, res, next) => { // Made async
    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: 'Authorization header is missing or incorrect',
        });
    }

    // Extract the token from the 'Bearer' scheme
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        req.id = decoded.userId;

        // Fetch user with their role and role permissions
        const userWithRole = await prisma.user.findUnique({
            where: {
                // @ts-ignore
                id: req.id
            },
            include: {
                roleUsers: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: {
                                        permission: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!userWithRole) {
            return res.status(404).json({ message: "User not found" });
        }

        const role = userWithRole.roleUsers[0]?.role;
        const permissions = role?.rolePermissions.map(rp => rp.permission.key) || [];

        // Attach permissions to the request object
        // @ts-ignore
        req.permissions = permissions;
        // @ts-ignore
        req.role = role; // Also attach role for permission checks
        // @ts-ignore
        req.user = userWithRole; // Attach the full user object to the request

        // Proceed to the next middleware
        next();
    } catch (err) {
        return res.status(403).json({
            message: 'Invalid or expired token',
        });
    }
};

export const hasPermission = (requiredPermissions: string[]) => {
    return (req: any, res: any, next: any) => {
        // @ts-ignore
        
        if (req.role && req.role.roleName === 'admin') {
            return next(); // Admin bypasses permission checks
        }

        // @ts-ignore
        const userPermissions = req.permissions || [];

        const authorized = requiredPermissions.some(rp => userPermissions.includes(rp));

        if (authorized) {
            next();
        } else {
            res.status(403).json({
                message: 'Forbidden: You do not have the necessary permissions.',
            });
        }
    };
};