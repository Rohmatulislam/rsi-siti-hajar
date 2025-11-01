flowchart TD
    Start[Start] --> AuthCheck{User signed in?}
    AuthCheck -->|No| SignIn[Show Clerk Sign in]
    SignIn --> AuthCheck
    AuthCheck -->|Yes| Home[Render Home Page]
    Home --> Setup[Show Setup Dashboard]
    Setup --> Config[Configure Services]
    Config --> Home
    Home --> ChatComponent[Render Chat UI]
    ChatComponent -->|User message| ApiChat[POST api chat]
    ApiChat --> AIProcess[Invoke Vercel AI SDK]
    AIProcess -->|AI response| ChatComponent
    Home --> SupabaseFetch[Fetch data via Supabase]
    SupabaseFetch --> Home