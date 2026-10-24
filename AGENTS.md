# Architecture rules

- Proposal RPC type extensions live in `src/lib/propostas-client.ts` and reuse the managed client; this keeps pending migration contracts typed without modifying generated integration files or creating another auth session.