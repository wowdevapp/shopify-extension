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

## Quick start for the app testing

### Prerequisites

Before you begin, you'll need the following:

1. **Node.js**: [Download and install](https://nodejs.org/en/download/) it if you haven't already.
2. **Shopify Partner Account**: [Create an account](https://partners.shopify.com/signup) if you don't have one.
3. **Test Store**: Set up either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store) for testing your app.

### Setup

Clone this repo on your local and install dependencies

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
