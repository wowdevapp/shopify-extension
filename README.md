# Creating a Shopify Partner Account & Development Store

## Part 1: Creating a Shopify Partner Account

1. **Visit Partners Website**

   - Go to [Shopify Partners](https://www.shopify.com/partners)
   - Click "Join Now" (it's free)

2. **Fill in Account Details**

   - Enter your email address
   - Create a password
   - Enter your name and address
   - Choose your primary service (select "App Development" or "Theme Development")
   - Fill in your business details

3. **Verify Your Email**
   - Check your inbox for verification email
   - Click the verification link
   - Complete your profile if needed

## Part 2: Creating a Development Store

1. **Access Partner Dashboard**

   - Log into your Shopify Partners account
   - Navigate to your partner dashboard

2. **Create Development Store**

   - Click "Stores" in the left menu
   - Click "Add Store"
   - Select "Development Store"
   - Check Build version -> developer preview
   - Check in data and configuration -> start with test data

3. **Configure Store Details**
   - Store name (must be unique)
   - Store URL (yourstore.myshopify.com)
   - Password protection (recommended for development)
   - Developer preview (enable for latest features)
   - Click "Create Development Store"

## Sample Data Categories

### Products

Create products in these categories:

- Electronics
- Clothing
- Home & Garden
- Books
- Sports Equipment

### Collections Examples

```markdown
1. New Arrivals

   - Recently added products
   - Sort by date added

2. Best Sellers

   - Products with highest sales
   - Manual selection

3. Sale Items

   - Products with discounted prices
   - Automated based on price rules

4. Featured Products
   - Manually curated selection
   - Homepage showcase
```

### Customer Segments

```markdown
1. Regular Customers

   - Basic contact info
   - Standard shipping addresses

2. VIP Customers

   - Multiple orders
   - Higher average order value

3. Newsletter Subscribers
   - Email marketing opt-in
   - Promotional targeting
```

## Testing Features

1. **Test Payment Gateway**

   - Use Shopify's test payment gateway
   - Test credit card: 4242 4242 4242 4242
   - Any future date for expiry
   - Any 3 digits for CVV

2. **Test Orders**

   ```markdown
   Create test orders with:

   - Different shipping methods
   - Various payment methods
   - Multiple products
   - Discounts applied
   ```

3. **Test User Accounts**

   ```markdown
   Create customer accounts:

   - Regular customer
   - Wholesale customer
   - International customer
   ```

## Important Notes

1. **Development Store Limitations**

   - No real transactions
   - Password protection required
   - Development features enabled
   - No custom domain possible

2. **Best Practices**

   - Use meaningful product names
   - Add realistic prices
   - Include product images
   - Write proper descriptions
   - Set up shipping rules

3. **Maintenance**
   - Regularly update test data
   - Clean up unused products
   - Monitor store performance
   - Test all features regularly

## Additional Resources

1. **Official Documentation**

   - [Shopify Partners Documentation](https://shopify.dev/partners)
   - [Shopify API Documentation](https://shopify.dev/api)
   - [Theme Development](https://shopify.dev/themes)

2. **Development Tools**

   - Shopify CLI
   - Theme Kit
   - App Bridge
   - Polaris (UI Components)

3. **Testing Tools**
   - Browser developer tools
   - Shopify Theme Inspector
   - Performance Analyzer
   - SEO Analyzer

## Quick start for the app testing

### Prerequisites

Before you begin, you'll need the following:

1. **Node.js**: [Download and install](https://nodejs.org/en/download/) it if you haven't already.
2. **Shopify Partner Account**: [Create an account](https://partners.shopify.com/signup) if you don't have one.
3. **Test Store**: Set up either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store) for testing your app.

### Setup

If you used the CLI to create the template, you can skip this section.

Using yarn:

```shell
yarn install
```

Using npm:

```shell
npm install
```

Using pnpm:

```shell
pnpm install
```

### Local Development

Using yarn:

```shell
yarn dev -- --reset
```

Using npm:

```shell
npm run dev -- --reset
```

Using pnpm:

```shell
pnpm run dev  -- --reset
```

Press P to open the URL to your app. Once you click install, you can start development.
