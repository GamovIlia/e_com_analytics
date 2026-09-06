# Event map

The site intentionally exposes both ordinary DOM interactions and `window.dataLayer` events.

| Event | Where it happens | Useful parameters |
|---|---|---|
| `virtual_page_context` | every page | `page_type` |
| `view_item` | product page | `currency`, `value`, `items` |
| `select_item` | product-card click | `item_list_name`, `items` |
| `add_to_cart` | add buttons | `currency`, `value`, `items` |
| `remove_from_cart` | cart | `currency`, `value`, `items` |
| `view_cart` | cart page | `currency`, `value`, `items` |
| `begin_checkout` | checkout page | `currency`, `value`, `items` |
| `checkout_click` | cart CTA | `currency`, `value` |
| `purchase` | thank-you page | `transaction_id`, `currency`, `value`, `items` |
| `search` | search results | `search_term` |
| `generate_lead` | contact form success | `form_id`, `lead_type` |
| `sign_up` | newsletter | `method` |
| `outbound_click` | footer GitHub link | `link_url`, `link_text` |
| `consent_update` | cookie banner | `analytics_storage` |

## Important practice note

Do not send personal data from the forms to GA4. The fields are only UI for practice. The supplied JavaScript does **not** push names or email addresses into `dataLayer`.

## Suggested progression

1. First install only GTM and GA4 Configuration / Google tag.
2. Verify `page_view` and DebugView.
3. Track simple click/form events using GTM triggers without touching the source.
4. Then consume the existing `dataLayer` custom events.
5. Map the ecommerce events to GA4 recommended ecommerce events.
6. Build funnel explorations.
7. Add UTM test traffic.
8. Test consent behavior.
