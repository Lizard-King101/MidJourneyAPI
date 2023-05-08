export interface JondoAccessToken {
    token: string;
    token_type: string;
    expires_in: Date;
}

export interface ShopifyOrder {
    id: number,
    admin_graphql_api_id: string,
    app_id: string,
    browser_ip: string,
    buyer_accepts_marketing: boolean,
    cancel_reason: string,
    cancelled_at: string | Date,
    cart_token: null | string,
    checkout_id: null | string;
    checkout_token: null | string;
    client_details: null | string;
    closed_at: null | string;
    confirmed: boolean,
    contact_email: string,
    created_at: string | Date,
    currency: string,
    current_subtotal_price: string,
    current_subtotal_price_set: ShopifyPriceSet,
    current_total_additional_fees_set: null | string;
    current_total_discounts: string,
    current_total_discounts_set: ShopifyPriceSet,
    current_total_duties_set: null | string;
    current_total_price: string,
    current_total_price_set: ShopifyPriceSet,
    current_total_tax: string,
    current_total_tax_set: ShopifyPriceSet,
    customer_locale: string,
    device_id: null | string;
    discount_codes: Array<string>,
    email: string,
    estimated_taxes: boolean,
    financial_status: string,
    fulfillment_status: string,
    landing_site: null | string;
    landing_site_ref: null | string;
    location_id: null | string;
    merchant_of_record_app_id: null | string;
    name: string,
    note: null | string;
    note_attributes: any[],
    number: number,
    order_number: number,
    order_status_url: string,
    original_total_additional_fees_set: null | string;
    original_total_duties_set: null | string;
    payment_gateway_names: Array<string>,
    phone: null | string;
    presentment_currency: string,
    processed_at: null | string;
    reference: null | string;
    referring_site: null | string;
    source_identifier: null | string;
    source_name: string,
    source_url: null | string;
    subtotal_price: string,
    subtotal_price_set: ShopifyPriceSet,
    tags: string,
    tax_lines: Array<any>,
    taxes_included: boolean,
    test: boolean,
    token: string,
    total_discounts: string,
    total_discounts_set: ShopifyPriceSet,
    total_line_items_price: string,
    total_line_items_price_set: ShopifyPriceSet,
    total_outstanding: string,
    total_price: string,
    total_price_set: ShopifyPriceSet,
    total_shipping_price_set: ShopifyPriceSet,
    total_tax: string,
    total_tax_set: ShopifyPriceSet,
    total_tip_received: string,
    total_weight: number,
    updated_at: string | Date,
    user_id: null | string,
    billing_address: ShopifyAddress,
    customer: ShopifyCustomer,
    discount_applications: Array<any>,
    fulfillments: Array<any>,
    line_items: Array<ShopifyLineItem>,
    payment_terms: null | any,
    refunds: Array<any>,
    shipping_address: ShopifyAddress,
    shipping_lines: Array<ShopifyShipping>
}

export interface ShopifyPriceSet {
    shop_money: ShopifyCurrency,
    presentment_money: ShopifyCurrency
}

interface ShopifyCurrency { 
    amount: string, 
    currency_code: string 
}

export interface ShopifyShipping {
    id: number,
    carrier_identifier: null | string,
    code: null | number,
    delivery_category: null | any,
    discounted_price: string,
    discounted_price_set: ShopifyPriceSet,
    phone: null | string,
    price: string,
    price_set: ShopifyPriceSet,
    requested_fulfillment_service_id: null | any,
    source: string,
    title: string,
    tax_lines: Array<any>,
    discount_allocations: Array<any>
}

export interface ShopifyAddress {
    first_name: string,
    address1: string,
    phone: string,
    city: string,
    zip: string,
    province: string,
    country: string,
    last_name: string,
    address2: null | string,
    company: string,
    latitude: null | string,
    longitude: null | string,
    name: string,
    country_code: string,
    province_code: string
}

export interface ShopifyCustomer {
    id: number,
    email: string,
    accepts_marketing: boolean,
    created_at: null | string | Date,
    updated_at: null | string | Date,
    first_name: string,
    last_name: string,
    state: string,
    note: null | string,
    verified_email: true,
    multipass_identifier: null | any,
    tax_exempt: boolean,
    phone: null | string,
    email_marketing_consent: {
        state: string,
        opt_in_level: null | any,
        consent_updated_at: null | any
    },
    sms_marketing_consent: null | any,
    tags: string,
    currency: string,
    accepts_marketing_updated_at: null | any,
    marketing_opt_in_level: null | any,
    tax_exemptions: Array<any>,
    admin_graphql_api_id: string,
    default_address: ShopifyAddress
}

export interface ShopifyLineItem {
    id: number,
    admin_graphql_api_id: string,
    fulfillable_quantity: number,
    fulfillment_service: string,
    fulfillment_status: null | string,
    gift_card: boolean,
    grams: number,
    name: string,
    price: string,
    price_set: ShopifyPriceSet,
    product_exists: boolean,
    product_id: number,
    properties: Array<ShopifyPropery>,
    quantity: number,
    requires_shipping: boolean,
    sku: string,
    taxable: boolean,
    title: string,
    total_discount: string,
    total_discount_set: ShopifyPriceSet,
    variant_id: number,
    variant_inventory_management: null | any,
    variant_title: null | any,
    vendor: null | any,
    tax_lines: Array<any>,
    duties: Array<any>,
    discount_allocations: Array<any>
}

export interface ShopifyPropery {
    name: string;
    value: string;
}