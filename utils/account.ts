import { account, ID } from "@/app/appwrite";
import { INewUser } from "@/types";

export async function createUserAccount(user: INewUser) {
    const { name, email, password } = user;
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);
        return newAccount; // Return the newly created account object or any relevant data
    } catch (error) {
        console.error("Error creating user account:", error);
        throw error; // Re-throw the error for further handling if needed
    }
}