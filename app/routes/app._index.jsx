import { json, useActionData, useNavigation, useSearchParams, useSubmit } from "@remix-run/react";
import {
  Layout,
  Page, BlockStack,
  Text, Toast,
  Banner,
  Card,
  Link,
  CalloutCard,
  Box,
  List,
  InlineStack, Button
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";

export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request, {
    scopes: ['write_script_tags', 'read_script_tags', 'write_themes', 'read_themes', 'write_pixels']
  });

  const url = new URL(request.url);
  const pixelCreated = url.searchParams.get("pixelCreated");
  const pixelError = url.searchParams.get("pixelError");
  const saved = url.searchParams.get("saved");

  // Handle different status messages
  if (pixelCreated === "true") {
    return Toast.show("Web pixel created successfully", { duration: 3000 });
  } else if (pixelError) {
    return Toast.show(`Error creating web pixel: ${pixelError}`, { duration: 5000, isError: true });
  } else if (saved === "true") {
    return Toast.show("Settings saved", { duration: 3000 });
  } else if (saved === "false") {
    return Toast.show("Settings not saved", { duration: 3000, isError: true });
  }

  return null;
}

export async function action({ request ,params}) {
  const { admin, session } = await authenticate.admin(request, {
    scopes: ['write_pixels']
  });

  try {
    // Parse the request body


    // Create settings object for the pixel
    const settings = {
      accountID:943,
      offerID: 2255
    };

    // Execute the GraphQL mutation to create the web pixel
    const response = await admin.graphql(
      `#graphql
      mutation CreateWebPixel($input: WebPixelInput!) {
        webPixelCreate(webPixel: $input) {
          userErrors {
            code
            field
            message
          }
          webPixel {
            settings
            id
          }
        }
      }`,
      {
        variables: {
          input: {
            settings: JSON.stringify(settings)
          }
        }
      }
    );

    const responseJson = await response.json();

    // Check for errors
    if (responseJson.data?.webPixelCreate?.userErrors?.length > 0) {
      const errors = responseJson.data.webPixelCreate.userErrors;
      return json({
        success: false,
        error: errors[0].message
      }, { status: 400 });
    }

    // Return the created pixel data
    return json({
      success: true,
      pixelId: responseJson.data?.webPixelCreate?.webPixel?.id,
      settings: responseJson.data?.webPixelCreate?.webPixel?.settings
    });
  } catch (error) {
    console.error("Error creating web pixel:", error);
    return json({
      success: false,
      error: error.message || "Failed to create web pixel"
    }, { status: 500 });
  }
}

export default function Index() {
  //const qrCode = useLoaderData();

  const [searchParams] = useSearchParams();
  const saved = searchParams.get("saved");

  const errors = useActionData()?.errors || {};
  const [formState, setFormState] = useState({
    advertiser_id: "",
    offer_id: "",
  });
  const [cleanFormState, setCleanFormState] = useState({});
  const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);

  const nav = useNavigation();
  const isSaving = nav.state === "submitting";

    const submit = useSubmit();
  function handleSave() {
    const data = {
      advertiser_id: Number(formState.advertiser_id) ,
      offer_id: Number(formState.offer_id),
    };

    setCleanFormState({ ...formState });
    submit(data, { method: "post" });

  }


  const handlePixelCreation = () => {
    // Create form data to submit
    const data = {
      pixelAction: "create",
      advertiser_id: 943,
      offer_id: 2255,
    };

    // Use the useSubmit hook to submit the form
    submit(data, { method: "post" });
  };


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
          <Button
            onClick={handlePixelCreation}
            loading={nav.state === "submitting" && nav.formData?.get("pixelCreation") === "true"}
            primary
          >
            Create Web Pixel
          </Button>
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
