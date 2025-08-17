use anchor_lang::prelude::*;

declare_id!("2DgdaYVe3y38aHABcbyJxa4sKbirWWkW8P4UaTWD2SNk");

#[program]
pub mod dextik {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    // 1. Create a new event
    pub fn create_event(
        ctx: Context<CreateEvent>, 
        name: String, 
        total_tickets: u32, 
        ticket_price: u64, 
        royalty_bps: u16,
        event_date: i64,
        venue: String,
        description: String
    ) -> Result<()> {
        let event = &mut ctx.accounts.event;
        let clock = Clock::get()?;
        
        event.name = name;
        event.organizer = ctx.accounts.organizer.key();
        event.total_tickets = total_tickets;
        event.tickets_sold = 0;
        event.ticket_price = ticket_price;
        event.royalty_bps = royalty_bps;
        event.event_date = event_date;
        event.venue = venue;
        event.description = description;
        event.created_at = clock.unix_timestamp;
        Ok(())
    }

    // 2. Mint a ticket NFT for a user
    pub fn mint_ticket(ctx: Context<MintTicket>, _event_id: Pubkey) -> Result<()> {
        let event = &mut ctx.accounts.event;

        // Anti-scalping: check if sold out
        if event.tickets_sold >= event.total_tickets {
            return Err(error!(DextikError::SoldOut));
        }

        // For now, just increment tickets sold (simple implementation)
        // TODO: Add full NFT minting in future versions
        event.tickets_sold += 1;

        msg!("Ticket minted successfully! Total sold: {}", event.tickets_sold);
        Ok(())
    }


    // 3. Resell ticket on secondary market
    pub fn resell_ticket(ctx: Context<ResellTicket>, _ticket_id: Pubkey, _new_price: u64) -> Result<()> {
        let _event = &ctx.accounts.event;
        let _seller = &ctx.accounts.seller;
        // TODO: Add buyer and ticket accounts to ResellTicket struct for full logic

        // Enforce holding period (e.g., 1 day = 86400 seconds)
        // let holding_period: i64 = 86400;
        // let clock = Clock::get()?;
        // if clock.unix_timestamp - ticket.last_transfer_time < holding_period {
        //     return Err(error!(DextikError::HoldingPeriodNotMet));
        // }

        // Calculate royalty, transfer NFT, update ticket owner, etc.
        // (Omitted for now)

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

// Event account: stores event details and organizer
#[derive(Accounts)]
pub struct CreateEvent<'info> {
    #[account(init, payer = organizer, space = 8 + 32 + 32 + 4 + 4 + 8 + 2 + 8 + 64 + 256 + 8 + 64)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Mint ticket: user mints a ticket NFT for an event
#[derive(Accounts)]
pub struct MintTicket<'info> {
    #[account(mut)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    // TODO: Add NFT mint accounts
}


// Resell ticket: user resells a ticket NFT
#[derive(Accounts)]
pub struct ResellTicket<'info> {
    #[account(mut)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub seller: Signer<'info>,
    // TODO: Add NFT transfer accounts
}

// Custom error codes for Dextik
#[error_code]
pub enum DextikError {
    #[msg("Ticket limit per wallet reached for this event.")]
    TicketLimitReached,
    #[msg("All tickets for this event are sold out.")]
    SoldOut,
    #[msg("Ticket cannot be resold before holding period ends.")]
    HoldingPeriodNotMet,
}

// Event data structure
#[account]
pub struct Event {
    pub name: String,
    pub organizer: Pubkey,
    pub total_tickets: u32,
    pub tickets_sold: u32,
    pub ticket_price: u64,
    pub royalty_bps: u16, // basis points (e.g. 500 = 5%)
    pub event_date: i64,  // Unix timestamp for event date
    pub venue: String,    // Event venue/location
    pub description: String, // Event description
    pub created_at: i64,  // Creation timestamp
}

