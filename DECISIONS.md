# Decisons & Trade-offs

- **SQLite vs PostgreSQL**: For a POC, SQLite is fine. It's one file. No need to spin up a Docker container just for a 1-hour demo.
- **Embedding Model**: Chose `sentence-transformers/all-MiniLM-L6-v2`. It's very tiny (80MB) and very fast on CPU. Perfect for a local test without an GPU.
- **Chunking strategy**: Went with 500 characters.
  - _Decision_: I could have used a markdown/header-aware chunker, but standard character count with overlap is easier to debug and more robust when docs are messy.
- **WebSocket Layer**: Using `channels`.
  - _Decision_: Polling is easier, but WebSockets look much more "premium" to a recruiter. The real-time feel matters for sales tools.
