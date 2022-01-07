export interface Config {
    hosts: {
        production: HostConfig,
        development: HostConfig
    },
    database: {
        host: string,
        database: string,
        user: string,
        password: string
    }
    bot_config: DiscordBotConfig;
    socketio: boolean
}

export interface HostConfig {
    httpPort: number;
    httpsPort: number;
    database?: DatabaseConfig,
}

export interface DatabaseConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

export interface DiscordBotConfig {
    bot_token: string;
    application_id: string;
}