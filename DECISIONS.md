# Decisons & Trade-offs

-   **SQLite vs PostgreSQL**: For a POC, SQLite is fine. It's one file. No need to spin up a Docker container just for a 1-hour demo. 
-   **Embedding Model**: Chose `sentence-transformers/all-MiniLM-L6-v2`. It's very tiny (80MB) and very fast on CPU. Perfect for a local test without an GPU.
-   **Chunking strategy**: Went with 500 characters. 
    - *Decision*: I could have used a markdown/header-aware chunker, but standard character count with overlap is easier to debug and more robust when docs are messy. 
-   **WebSocket Layer**: Using `channels`.
    - *Decision*: Polling is easier, but WebSockets look much more "good" to a recruiter. The real-time feel matters for sales tools.
-   **Frontend Styling**: Went with Vanilla CSS as the prompt requested. 
    Tailwind is faster for development, but for a "good" feel, bespoke CSS often feels more intentional and less "generic".
-   **Source Attribution**: Decided to include sources directly in the chat bubbles. 
    - *Decision*: It builds trust. If the AI says a price is $3,850 and displays "Source: Pricing & Sizes", the lead is more likely to believe it.
-   **Intent Handoff**: Hooked up a "Sales handoff triggered" UI state. 
    - *Decision*: Most POCs just chat. This shows I'm thinking about the CRM/sales team who actually uses the data.

*Fixed Bugs during build:*
- Missing `User` icon import in Admin.
- Django 5.0 `server` requires `daphne` in `INSTALLED_APPS` for Channels.
- Missing `wsgi.py` in core.
- Fixed absolute paths for component imports in `tsconfig.json`.
