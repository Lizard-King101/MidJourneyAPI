export interface Config {
    hosts: {
        production: HostConfig,
        development: HostConfig
    },
    nocodb: {
        host: string;
        api_key: string;
        org: string;
        project: string;
    },
    shopify: {
        shopify_webhook_token: string;
        order_test: boolean;
        jondo_user_id: number;
        jondo_api_key: string;
    }
    linode_bucket: {
        region: string;
        bucket_name: string;
    }
    dev: boolean;
    guild_id: string;
    bot_config: DiscordBotConfig;
    user_token: string;
    socketio: boolean;
}

export interface HostConfig {
    httpPort: number;
    hostName: string;
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