import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl/dextik.json";

// Use the program ID from the IDL
export const PROGRAM_ID = new PublicKey(idl.address);

export function getProvider(wallet?: any) {
  if (!wallet) {
    throw new Error("Wallet not connected");
  }
  
  const connection = new Connection("https://api.devnet.solana.com", {
    commitment: "confirmed"
  });
  
  console.log("Creating provider with connection:", connection.rpcEndpoint);
  console.log("Wallet connected:", wallet?.publicKey?.toString());
  
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
    commitment: "confirmed"
  });
  
  setProvider(provider);
  return provider;
}

export function getProgram(wallet?: any) {
  try {
    const provider = getProvider(wallet);
    console.log("Creating program with ID:", PROGRAM_ID.toString());
    
    // Create program with proper typing
    const program = new Program(idl as any, provider);
    console.log("Program created successfully");
    return program;
  } catch (error) {
    console.error("Error creating program:", error);
    throw error;
  }
}
