import { ShopifyOrder } from "../../types/shopify";
import apiFormat from "./api";

function cancelFormat(order: ShopifyOrder) {
    return `<root>
    <cancelOrder>
        ${apiFormat()}
        <poNumber>${order.id}</poNumber>
    </cancelOrder>
</root>`;
}

export default cancelFormat;