import { ShopifyLineItem, ShopifyOrder, ShopifyPropery } from "../../types/shopify";
import apiFormat from "./api";
import brandingFormat from "./branding";
import customerFormat from "./customer";
import shippingFormat from "./shipping";
import testFormat from "./test";

function propMap(properties: Array<ShopifyPropery>) {
    let map: Map<string, string> = new Map();
    for(let prop of properties) {
        map.set(prop.name, prop.value);
    }
    return map;
}

function itemsFormat(items: Array<ShopifyLineItem>) {
    let tmp = '';
    for(let item of items) {
        let props = propMap(item.properties);
        console.log(props);
        tmp += `
            <orderItem>
                <qt>${item.quantity}</qt>
                <code>${item.sku}</code>
                <itemNumber>${item.id}</itemNumber>
                <retailPrice>${item.price}</retailPrice>
                <imageLocation>${props.get('image')}</imageLocation>
            </orderItem>`;
    }
    return tmp;
}

function createFormat(order: ShopifyOrder) {
    let host = global.config.dev ? global.config.hosts.development : global.config.hosts.production;
    let { hostName } = host; 
    
    return `<root>
    <orderRequest>
        ${apiFormat()}
        <customerInfo>
            <thirdPartyId>${order.id}</thirdPartyId>
            <billingIsReturnAddress>Y</billingIsReturnAddress>
            <companyName>Arrtificial</companyName>
            <custLogo>${hostName}/branding/logo.jpg</custLogo>
        </customerInfo>
        <shippingType>Basic</shippingType>
        ${testFormat(order)}
        <poNumber>${order.id}</poNumber>
        ${shippingFormat(order.shipping_address)}
        <email>${order.customer.email}</email>

        <services>
            ${brandingFormat()}
        </services>

        <orderItems>
            ${itemsFormat(order.line_items)}
        </orderItems>

    </orderRequest>
</root>`;
}

export default createFormat;