import { Client, Account } from 'appwrite';

export const client = new Client();

client
    // .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    // .setProject('685b2aa1002c1efc854b'); 
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); 

    console.log(
  'endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  'project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT
);
export const account = new Account(client);
export { ID } from 'appwrite';

