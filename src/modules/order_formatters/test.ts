import { ShopifyOrder } from "../../types/shopify";

function testFormat(order: ShopifyOrder) {
    return order.test || global.config.shopify.order_test ? '<testMode>1</testMode>' : '';
}

export default testFormat;