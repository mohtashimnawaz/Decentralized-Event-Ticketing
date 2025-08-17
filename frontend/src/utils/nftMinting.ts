import { 
  Connection, 
  Keypair, 
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint
} from '@solana/spl-token';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export interface NFTTicketData {
  eventName: string;
  eventDate: string;
  venue: string;
  ticketNumber: number;
  eventId: string;
}

export async function mintTicketNFT(
  wallet: AnchorWallet, 
  ticketData: NFTTicketData
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  try {
    // Create a new mint keypair for the NFT
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    
    console.log('Creating NFT mint:', mint.toString());
    
    // Get rent exemption amount for mint account
    const rentExemption = await getMinimumBalanceForRentExemptMint(connection);
    
    // Get associated token account for the buyer
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mint,
      wallet.publicKey
    );
    
    // Create transaction
    const transaction = new Transaction();
    
    // Set recent blockhash and fee payer
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    
    // Add instruction to create mint account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint,
        space: MINT_SIZE,
        lamports: rentExemption,
        programId: TOKEN_PROGRAM_ID,
      })
    );
    
    // Add instruction to initialize mint
    transaction.add(
      createInitializeMintInstruction(
        mint,
        0, // decimals (0 for NFT)
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority
        TOKEN_PROGRAM_ID
      )
    );
    
    // Add instruction to create associated token account
    transaction.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        associatedTokenAccount,
        wallet.publicKey, // owner
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
    
    // Add instruction to mint 1 token
    transaction.add(
      createMintToInstruction(
        mint,
        associatedTokenAccount,
        wallet.publicKey, // mint authority
        1, // amount (1 for NFT)
        [],
        TOKEN_PROGRAM_ID
      )
    );
    
    // Add the mint keypair as a signer
    transaction.partialSign(mintKeypair);
    
    console.log('Sending transaction...');
    // Sign transaction with wallet
    const signedTransaction = await wallet.signTransaction(transaction);
    
    // Send the signed transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });
    
    // Confirm transaction
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }
    
    console.log('NFT Ticket minted successfully!');
    console.log('Transaction signature:', signature);
    console.log('Mint address:', mint.toString());
    console.log('Token account:', associatedTokenAccount.toString());
    
    return mint.toString();
  } catch (error) {
    console.error('Error minting NFT ticket:', error);
    throw error;
  }
}
