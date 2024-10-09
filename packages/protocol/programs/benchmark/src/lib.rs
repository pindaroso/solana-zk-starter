use anchor_lang::prelude::*;

declare_id!("369WdsAWfRPf1qB4LVM5Zs11CtwfnvcCF91v8NKd4rck");

#[program]
pub mod benchmark {
    use super::*;

    pub fn create<'info>(ctx: Context<'_, '_, '_, 'info, Create<'info>>) -> Result<()> {
        ctx.accounts.counter.owner = ctx.accounts.signer.key();
        ctx.accounts.counter.counter = 0;

        Ok(())
    }

    pub fn increment<'info>(ctx: Context<'_, '_, '_, 'info, Increment<'info>>) -> Result<()> {
        ctx.accounts.counter.counter += 1;

        Ok(())
    }

    pub fn delete<'info>(_ctx: Context<'_, '_, '_, 'info, Delete<'info>>) -> Result<()> {
        Ok(())
    }
}

#[account]
#[derive(Debug, Default)]
pub struct CounterAccount {
    pub owner: Pubkey,
    pub counter: u64,
}

#[error_code]
pub enum CustomError {
    #[msg("No authority to perform this action")]
    Unauthorized,
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        seeds = [b"counter", signer.key().as_ref()],
        bump,
        space = 8 + std::mem::size_of::<CounterAccount>()
    )]
    pub counter: Account<'info, CounterAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"counter", signer.key().as_ref()],
        bump,
        constraint = counter.owner == signer.key() @ CustomError::Unauthorized
    )]
    pub counter: Account<'info, CounterAccount>,
}

#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        close = signer,
        seeds = [b"counter", signer.key().as_ref()],
        bump,
        constraint = counter.owner == signer.key() @ CustomError::Unauthorized
    )]
    pub counter: Account<'info, CounterAccount>,
}
