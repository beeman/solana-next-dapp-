#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("3KCNCJuETwV6ALJXs3JpAmxLVXYGipQ4nYVYMaDXKRxG");

#[program]
pub mod counter {
    use super::*;

  pub fn initialize_counter(_ctx: Context<InitializeCounter>) -> Result<()> {
    Ok(())
  }

  pub fn increment(ctx: Context<Increment>) -> Result<()> {
    ctx.accounts.counter.count = ctx.accounts.counter.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn decrement(ctx: Context<Increment>) -> Result<()> {
    ctx.accounts.counter.count = ctx.accounts.counter.count.checked_sub(1).unwrap();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Counter::INIT_SPACE,
  payer = payer
  )]
  pub counter: Account<'info, Counter>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
  #[account(mut)]
  pub counter: Account<'info, Counter>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
  count: u64,
}
