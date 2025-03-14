import { useLoaderData } from "@remix-run/react";
import {
  Layout,
  Page, BlockStack,
  Text, Banner,
  Card,
  Link,
  CalloutCard,
  Box,
  List,
  InlineStack, Button, Form, FormLayout, TextField
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import { getWebPixels } from '../models/Script.server';
import { useCallback, useState } from "react";

export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const {webPixel} = await getWebPixels(admin.graphql);
  return webPixel
}

export async function action({ request ,params}) {
  

  
}

export default function Index() {
  //const qrCode = useLoaderData();
    const webPixel  = useLoaderData();

    const {settings} = webPixel

    const parsedSettings = JSON.parse(settings);

    const [advertiser, setAdvertiser] = useState(parsedSettings?.advertiser);
    const [offer, setOffer] = useState(parsedSettings?.offer);



    const handleAdvertiserChange = useCallback(
      (value) => setAdvertiser(value),
    [],
    )

    const handleOfferChange = useCallback(
      (value) => setOffer(value),[]
    )


  return (
    <Page
    title="Welcome to Userly Analytics"
    primaryAction={
      <>
       <Button url="https://www.userly.net" external target="_blank">Get your credential</Button>
      </>
    }
  >
    <BlockStack gap="500">
      {/* Welcome Banner */}
      <Banner title="Thank you for choosing our application" status="success">
        <p>Follow the steps below to start tracking your store's performance.</p>
      </Banner>

      <Layout>
        <Layout.Section>
          {/* Quick Setup Card */}
          <CalloutCard
            title="Quick Setup Guide"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{
              content: 'Get Your Credentials',
              url: 'https://www.userly.net',
              _target: 'blank',
            }}
          >
            <BlockStack gap="400">
              <Text as="p">
                To enable tracking on your store, you'll need your unique credentials from the Userly dashboard.
              </Text>
            </BlockStack>
          </CalloutCard>
        </Layout.Section>

        <Layout.Section secondary>
          {/* Steps Card */}
          <Card>
            <BlockStack gap="400">
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Setup Steps
                  </Text>
                  <List type="number">
                    <List.Item>
                      Log in to your Userly dashboard
                    </List.Item>
                    <List.Item>
                      Navigate to Settings → offers
                    </List.Item>
                    <List.Item>
                      Copy your Advertiser and Offer IDs
                    </List.Item>
                    <List.Item>
                      Paste them in the configuration below
                    </List.Item>
                  </List>
                </BlockStack>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          {/* Configuration Card */}
          <Card>
            <BlockStack gap="400">
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Tracking Configuration on the theme page
                  </Text>

                  <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Setup Steps
                  </Text>
                  <List type="number">
                    <List.Item>
                      go to online store → themes
                    </List.Item>
                    <List.Item>
                      Click on Custumize
                    </List.Item>
                    <List.Item>
                      on the left side click on app embed blocks
                    </List.Item>
                    <List.Item>
                      Activate the Userly block = pages variables
                    </List.Item>
                    <List.Item>
                      Add ids you get from our platform
                    </List.Item>
                  </List>
                </BlockStack>
              </Box>

                  <InlineStack gap="400" wrap={false}>
                    <Text as="p">
                      Need help finding your credentials? Check our{' '}
                      <Link url="https://www.userly.net/docs" external>
                        documentation
                      </Link>
                    </Text>
                  </InlineStack>

                  {/* Add your form components here */}
                </BlockStack>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          {/* Configuration Card */}
          <Card>
            <BlockStack gap="400">
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Tracking Configuration on the Checkout thank you page
                  </Text>

                  <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Setup Steps
                  </Text>
                  <List type="number">
                    <List.Item>
                      go to settings
                    </List.Item>
                    <List.Item>
                      Click on Checkout
                    </List.Item>
                    <List.Item>
                      Click custumize
                    </List.Item>
                    <List.Item>
                      click on apps
                    </List.Item>
                    <List.Item>
                      Activate uzerly ext
                    </List.Item>
                    <List.Item>
                      Add ids you get from our platform
                    </List.Item>
                  </List>
                </BlockStack>
              </Box>

                  <InlineStack gap="400" wrap={false}>
                    <Text as="p">
                      Need help finding your credentials? Check our{' '}
                      <Link url="https://www.userly.net/docs" external>
                        documentation
                      </Link>
                    </Text>
                  </InlineStack>

                  {/* Add your form components here */}
                </BlockStack>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Help & Support Section */}
        <Layout.Section>
  <Card>
    <BlockStack gap="400">
      <Box padding="400">
        <BlockStack gap="400">
          <Text variant="headingMd" as="h2">
            Web Pixel Integration
          </Text>
          <Text as="p">
            Create a web pixel to track user activity and conversions across your store.
            This will allow you to measure the effectiveness of your marketing campaigns.
          </Text>
          <Form onSubmit={()=>{}}>
      <FormLayout>
        <TextField
          value={advertiser}
          onChange={handleAdvertiserChange}
          label="advertiser"
          type="number"
          autoComplete="Advertiser"
          helpText={
            <span>
              We’ll use this id as your advertiser id on the web pixel
            </span>
          }
        />
        <TextField
          value={offer}
          onChange={handleOfferChange}
          label="offer"
          type="number"
          autoComplete="Offer"
          helpText={
            <span>
              We’ll use this id as your offer id on the web pixel
            </span>
          }
        />
        <Button submit>{(advertiser && offer) ? 'Update web pixel' : 'Create web pixel'}</Button>
      </FormLayout>
    </Form>
        </BlockStack>
      </Box>
    </BlockStack>
  </Card>
</Layout.Section>

      </Layout>
    </BlockStack>
  </Page>
  );
}
