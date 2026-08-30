# Bali Zen (balizen.ro)

Marketing site and content administration for Bali Zen, a massage studio in Ploiești. The site presents services, prices, and contact details to clients in Romanian and English; staff edit all customer-facing content through an admin interface.

## Language

### Catalog

**Service**:
A massage offering a client can book (e.g. "Mom To Be"). Has a per-locale title and description, one or more Pricing Tiers, an image, a display order, and a last-modified date that drives the "New" badge.
_Avoid_: massage, treatment, product

**Service Category**:
A named grouping of Services shown as a section of the catalog (e.g. "Masaje Full Body"). Name is per-locale.
_Avoid_: section, group

**Pricing Tier**:
A (duration, price) pair on a Service. One Service can be offered at several durations with a price each.
_Avoid_: option, variant, price point

**Subscription**:
A prepaid bundle of sessions sold at a fixed price (abonament), promoted on the homepage.
_Avoid_: membership, plan, package

**Gift Card**:
A voucher a client buys for someone else, promoted on the homepage with its own copy and disclaimers.
_Avoid_: voucher, coupon

### Reputation

**Review**:
A curated client testimonial (author, text, rating, date) shown on the site and aggregated into the rating shown in search results. Single-language, shown on all locales.
_Avoid_: testimonial, rating

**FAQ**:
A per-locale list of question/answer pairs shown on the site and emitted as structured data for search engines.

### Operations

**Site Config**:
The business's contact facts: phone, WhatsApp, email, address, regular opening hours, booking URL, map links, social links.
_Avoid_: settings, preferences

**Booking**:
An appointment a client makes. Always happens on the external booking app or via WhatsApp; this site only links out to it, never takes bookings itself.
_Avoid_: reservation, appointment (as something this site handles)

**Announcement Banner**:
A dismissible per-locale banner staff toggle on for temporary messages (holiday closures, promos).
_Avoid_: alert, notice, popup

**Exceptional Hours**:
A date-specific override to the regular opening hours (e.g. closed on December 25).
_Avoid_: holiday schedule, special hours

**Locale**:
A content language. `ro` is the default and unprefixed; `en` lives under `/en`. Reviews are the only content not translated.
_Avoid_: language, translation

**Editor**:
A non-technical staff member who changes customer-facing content through the admin interface.
_Avoid_: admin user, content manager
