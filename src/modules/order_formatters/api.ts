function apiFormat() {
    return `<userId>${global.config.shopify.jondo_user_id}</userId>
        <apiKey>${global.config.shopify.jondo_api_key}</apiKey>`;
}
export default apiFormat;