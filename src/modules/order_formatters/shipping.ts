import { ShopifyAddress } from "../../types/shopify";

function shippingFormat(shipping: ShopifyAddress) {
    return `
        <firstName>${shipping.first_name}</firstName>
        <lastName>${shipping.last_name}</lastName>
        <company>${shipping.company}</company>
        <address>${shipping.address1}</address>
        <address2>${shipping.address2}</address2>
        <aptNumber></aptNumber>
        <city>${shipping.city}</city>
        <state>${shipping.province_code}</state>
        <zip>${shipping.zip}</zip>
        <urbanizationCode></urbanizationCode>
        <country>${shipping.country_code}</country>
        <phoneNumber>${shipping.phone}</phoneNumber>`;
}

export default shippingFormat;